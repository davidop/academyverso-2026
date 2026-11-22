import {initialQuality,adaptiveQuality,pixelRatioFor} from './worlds/quality.mjs';
import {resolvedWorldSpec} from './worlds/spec.mjs';
import {buildWorld} from './worlds/builder.mjs';
import {birthProgress,birthScale,createBirthParticles} from './worlds/birth.mjs';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { issueDraftUrl } from './issue-prefill.mjs';
import {TERRAFORMING_MISSIONS,terraformMissionFor,terraformCounts,terraformProposal,terraformGitHubUrl} from './terraforming.mjs';
import {numberHash,orderWorlds,worldPosition,homeCameraPose,cameraPoseForWorld,flightPose,zoomDistance,HOME_ORBIT} from './travel.mjs';

const config = window.ACADEMYVERSO_CONFIG || {};
const API = String(config.API_BASE || '').replace(/\/$/, '');
let createEnabled = false;
const REPO = config.REPO || 'davidop/academyverso-2026';
const DEMO = [
  {issue_number:1,type:'planeta',name:'Pythonia',alias:'Comandante Python',description:'Un planeta turquesa con tres lunas brillantes y océanos de código.'},
  {issue_number:2,type:'estrella',name:'Estrella JavaScript',alias:'Capitana JS',description:'Una estrella violeta que parpadea cuando alguien escribe código.'},
  {issue_number:3,type:'estacion',name:'Base Academy',alias:'Explorador Git',description:'Una estación espacial con antenas y luces alrededor del universo.'},
  {issue_number:4,type:'luna',name:'Luna de los Sueños',alias:'LunaDev',description:'Una luna lavanda cubierta de cráteres de colores.'},
  {issue_number:5,type:'agujero-negro',name:'Bug Infinito',alias:'QA Cósmico',description:'Un agujero negro rodeado por un vórtice turquesa.'},
  {issue_number:6,type:'asteroide',name:'Meteorito 404',alias:'Error Hunter',description:'Roca espacial naranja que nunca encuentra su camino.'}
].map(x=>({...x,issue_url:`https://github.com/${REPO}/issues/${x.issue_number}`}));
let objects = [...DEMO];
let openDetails = () => {};
const emoji={planeta:'🪐',estrella:'⭐',luna:'🌙','agujero-negro':'🕳️',estacion:'🛸',asteroide:'☄️'};
const $=id=>document.getElementById(id);
const safe=s=>String(s??'').trim().slice(0,280);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let quality=initialQuality(navigator.hardwareConcurrency||4,devicePixelRatio||1);

const viewport=$('viewport');
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x11182d,0.004);
const camera=new THREE.PerspectiveCamera(58,1,.1,2000);
camera.position.set(0,65,185);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(pixelRatioFor(quality,devicePixelRatio));
renderer.outputColorSpace=THREE.SRGBColorSpace;
viewport.innerHTML='';viewport.appendChild(renderer.domElement);
scene.add(new THREE.AmbientLight(0x859aff,2));
const light=new THREE.PointLight(0x9cfff7,13000,800);light.position.set(-40,30,80);scene.add(light);
const center=new THREE.Mesh(new THREE.SphereGeometry(14,32,24),new THREE.MeshStandardMaterial({color:0x71d8d5,emissive:0x3c7e95,emissiveIntensity:.5,roughness:.7}));scene.add(center);
const centerHalo=new THREE.Mesh(new THREE.TorusGeometry(21,0.32,8,90),new THREE.MeshBasicMaterial({color:0xbac3ff,transparent:true,opacity:.55}));centerHalo.rotation.x=Math.PI/2.8;scene.add(centerHalo);
const starsGeo=new THREE.BufferGeometry();const points=[];for(let i=0;i<1300;i++){points.push((Math.random()-.5)*800,(Math.random()-.5)*550,(Math.random()-.5)*900)}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xd9e8ff,size:1.25,sizeAttenuation:true,transparent:true,opacity:.75})));
let meshes=[],clickables=[];const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
let initialWorldPaint=true,firstLiveSync=false,suppressBirth=false;
function makeBody(obj,i){
 const coords=worldPosition(obj,i);
 const mission=terraformMissionFor(obj.description);
 const {spec}=resolvedWorldSpec(obj);
 const {group,size,clickables:targets}=buildWorld(THREE,obj,spec,mission,quality);
 group.position.set(coords.x,coords.y,coords.z);
 for(const mesh of targets){mesh.userData={...mesh.userData,obj,group};clickables.push(mesh)}
 const entry={obj,group,size,targets,baseY:coords.y,phase:numberHash(String(obj.issue_number)+'-'+obj.name)%100/20};
 meshes.push(entry);scene.add(group);return entry;
}
function disposeWorld(m){
 scene.remove(m.group);
 m.group.traverse(child=>{
  child.geometry?.dispose?.();
  const materials=Array.isArray(child.material)?child.material:[child.material];
  for(const material of materials)material?.dispose?.();
 });
}
function paint(items){
 const oldById=new Map(meshes.map(m=>[String(m.obj.issue_number),m]));
 const next=orderWorlds(items).slice(0,200);
 meshes=[];clickables=[];
 for(let i=0;i<next.length;i++){
  const obj=next[i],id=String(obj.issue_number);
  const signature=JSON.stringify([obj.type,obj.name,obj.description,obj.world_spec,obj.world_version,quality]);
  const previous=oldById.get(id);
  if(previous&&previous.signature===signature){
   previous.obj=obj;
   for(const mesh of previous.targets){mesh.userData.obj=obj;clickables.push(mesh)}
   meshes.push(previous);
  }else{
   if(previous)disposeWorld(previous);
   const created=makeBody(obj,i);created.signature=signature;
   if(!initialWorldPaint&&!suppressBirth&&!reduced&&!previous){
    created.birthStartedAt=performance.now();
    created.group.scale.setScalar(.08);
    created.birthParticles=createBirthParticles(THREE,created.size,numberHash(id));
    created.group.add(created.birthParticles);
   }
  }
  oldById.delete(id);
 }
 for(const old of oldById.values())disposeWorld(old);
 initialWorldPaint=false;
 if(activeWorldId!==null&&travelMode!=='returning'&&!meshes.some(m=>String(m.obj.issue_number)===activeWorldId)){
  returnHome('El destino ya no está disponible. Regresamos a la galaxia.');
 }
}
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(viewport);resize();
// Orbiting remains available both in the galaxy and after reaching a destination.
const focus=new THREE.Vector3(0,0,0);
let pointerDown=null,dragging=false,yaw=HOME_ORBIT.yaw,pitch=HOME_ORBIT.pitch,dist=HOME_ORBIT.distance;
let flight=null,travelMode='galaxy',activeWorldId=null;
const statusMessage=message=>{$('travel-status').textContent=message;};
function updateCamera(){
  camera.position.set(focus.x+Math.sin(yaw)*dist*Math.cos(pitch),
    focus.y+Math.sin(pitch)*dist,focus.z+Math.cos(yaw)*dist*Math.cos(pitch));
  camera.lookAt(focus);
}
function currentPose(){return {eye:{x:camera.position.x,y:camera.position.y,z:camera.position.z},focus:{x:focus.x,y:focus.y,z:focus.z}};}
function setPose(pose){
  camera.position.set(pose.eye.x,pose.eye.y,pose.eye.z);
  focus.set(pose.focus.x,pose.focus.y,pose.focus.z);
  camera.lookAt(focus);
}
function deriveOrbit(){
  const delta=camera.position.clone().sub(focus);
  dist=Math.max(0.1,delta.length());
  yaw=Math.atan2(delta.x,delta.z);
  pitch=Math.asin(Math.max(-1,Math.min(1,delta.y/dist)));
}
function finishFlight(){
  const completed=flight;
  flight=null;
  viewport.classList.remove('travelling');
  deriveOrbit();
  if(completed.kind==='home'){
    travelMode='galaxy';activeWorldId=null;
    $('travel-panel').hidden=true;
    statusMessage('Has regresado a la galaxia. Selecciona otro planeta para viajar.');
    $('reset-camera').focus({preventScroll:true});
  }else{
    travelMode='world';
    $('travel-phase').textContent='Destino alcanzado · arrastra para explorar';
    statusMessage('Destino alcanzado: '+completed.worldName+'. Puedes explorar alrededor del planeta o regresar.');
    $('return-home').focus({preventScroll:true});
  }
}
function advanceFlight(now){
  if(!flight)return;
  const state=flightPose(flight,now);
  setPose(state);
  if(state.done)finishFlight();
}
function startTravel(obj){
  if(!terraformMissionFor(obj?.description))return false;
  const world=meshes.find(m=>String(m.obj.issue_number)===String(obj.issue_number));
  if(!world){statusMessage('Este mundo todavía no se ha cargado. Vuelve a intentarlo.');return false;}
  const from=currentPose();
  const target=world.group.position;
  const to=cameraPoseForWorld({x:target.x,y:target.y,z:target.z},from.eye,world.size);
  activeWorldId=String(obj.issue_number);
  travelMode='travelling';
  flight={from,to,startedAt:performance.now(),duration:reduced?0:1850,kind:'world',worldName:safe(obj.name)};
  $('travel-panel').hidden=false;
  $('travel-world').textContent=safe(obj.name);
  $('travel-phase').textContent=reduced?'Destino seleccionado':'En vuelo · preparando aterrizaje';
  viewport.classList.toggle('travelling',!reduced);
  $('universe').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  statusMessage('Despegando hacia '+safe(obj.name)+'.');
  if(reduced)advanceFlight(flight.startedAt);
  else $('return-home').focus({preventScroll:true});
  return true;
}
function returnHome(message){
  if(travelMode==='galaxy'&&!flight){
    yaw=HOME_ORBIT.yaw;pitch=HOME_ORBIT.pitch;dist=HOME_ORBIT.distance;
    focus.set(0,0,0);updateCamera();
    return;
  }
  const from=currentPose();
  activeWorldId=null;
  travelMode='returning';
  flight={from,to:homeCameraPose(),startedAt:performance.now(),duration:reduced?0:1100,kind:'home'};
  $('travel-panel').hidden=false;
  $('travel-phase').textContent='Regresando a la galaxia';
  viewport.classList.toggle('travelling',!reduced);
  statusMessage(message||'Regresando a la galaxia.');
  if(reduced)advanceFlight(flight.startedAt);
}
// Track multiple pointers so touch gestures zoom rather than accidentally select a planet.
const activePointers=new Map();
let previousPinchGap=null;
function pinchGap(){
 const [a,b]=[...activePointers.values()];
 return a&&b?Math.hypot(a.x-b.x,a.y-b.y):null;
}
renderer.domElement.addEventListener('pointerdown',e=>{
 if(flight)return;
 activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 renderer.domElement.setPointerCapture(e.pointerId);
 if(activePointers.size>1){previousPinchGap=pinchGap();pointerDown=null;dragging=true;}
 else{pointerDown={x:e.clientX,y:e.clientY};dragging=false;}
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(flight||!activePointers.has(e.pointerId))return;
 const prior=activePointers.get(e.pointerId);
 activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(activePointers.size>1){
   const gap=pinchGap();
   if(gap>0&&previousPinchGap>0){
     dist=zoomDistance(dist,previousPinchGap/gap,travelMode==='world');
     updateCamera();
   }
   previousPinchGap=gap;pointerDown=null;dragging=true;
   return;
 }
 if(!pointerDown)return;
 const dx=e.clientX-prior.x,dy=e.clientY-prior.y;
 if(Math.abs(e.clientX-pointerDown.x)+Math.abs(e.clientY-pointerDown.y)>4)dragging=true;
 yaw-=dx*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch+dy*.003));
 updateCamera();
});
renderer.domElement.addEventListener('pointerup',e=>{
 const tap=activePointers.size===1&&pointerDown!==null&&!dragging&&!flight;
 activePointers.delete(e.pointerId);pointerDown=null;previousPinchGap=null;
 if(!tap)return;
 const b=renderer.domElement.getBoundingClientRect();
 mouse.x=((e.clientX-b.left)/b.width)*2-1;mouse.y=-((e.clientY-b.top)/b.height)*2+1;
 raycaster.setFromCamera(mouse,camera);
 const found=raycaster.intersectObjects(clickables)[0];
 if(found)openDetails(found.object.userData.obj,found.object.userData.poi);
});
renderer.domElement.addEventListener('pointercancel',e=>{
 activePointers.delete(e.pointerId);pointerDown=null;previousPinchGap=null;dragging=true;
});
renderer.domElement.addEventListener('wheel',e=>{
 e.preventDefault();
 if(flight)return;
 dist=zoomDistance(dist,(dist+Math.sign(e.deltaY)*10)/dist,travelMode==='world');
 updateCamera();
},{passive:false});
$('return-home').addEventListener('click',()=>returnHome());
$('reset-camera').addEventListener('click',()=>returnHome());
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&travelMode!=='galaxy'&&!$('detail-dialog').open&&!$('create-dialog').open){
    e.preventDefault();returnHome();
  }
});
updateCamera();
let qualitySampleStart=performance.now(),qualityFrames=0,lastQualityChange=qualitySampleStart;
function animate(){
  requestAnimationFrame(animate);
  const sampleNow=performance.now();qualityFrames++;
  if(sampleNow-qualitySampleStart>=4500){
    const fps=qualityFrames*1000/(sampleNow-qualitySampleStart);
    qualityFrames=0;qualitySampleStart=sampleNow;
    if(sampleNow-lastQualityChange>12000){
      const next=adaptiveQuality(quality,fps);
      if(next!==quality){quality=next;renderer.setPixelRatio(pixelRatioFor(quality,devicePixelRatio));resize();suppressBirth=true;paint(objects);suppressBirth=false;lastQualityChange=sampleNow;}
    }
  }
  if(flight)advanceFlight(performance.now());
  if(!reduced){
    center.rotation.y+=.001;
    const now=performance.now();
    meshes.forEach(m=>{
      m.group.rotation.y+=.0025;
      m.group.position.y=m.baseY+Math.sin(now/1100+m.phase)*.14;
      if(m.birthStartedAt!==undefined){
       const elapsed=now-m.birthStartedAt,t=birthProgress(elapsed);
       m.group.scale.setScalar(birthScale(elapsed));
       if(m.birthParticles){
        m.birthParticles.material.opacity=1-t;
        m.birthParticles.scale.setScalar(1+t*.5);
       }
       if(t===1){
        m.group.scale.setScalar(1);
        if(m.birthParticles){m.group.remove(m.birthParticles);m.birthParticles.geometry.dispose();m.birthParticles.material.dispose();m.birthParticles=null;}
        delete m.birthStartedAt;
       }
      }
    });
  }
  renderer.render(scene,camera);
}animate();
let renderedSignature=null;
function refreshUI(){const signature=JSON.stringify(objects);if(signature===renderedSignature)return;renderedSignature=signature;paint(objects);$('count').textContent=objects.length;$('explorers').textContent=new Set(objects.map(o=>o.alias)).size;const totals=terraformCounts(API?objects:[]);for(const mission of TERRAFORMING_MISSIONS){$(mission.id+'-count').textContent=totals[mission.id];}const cards=$('cards');cards.replaceChildren();for(const x of objects.slice(-12).reverse()){const c=document.createElement('article');c.className='body-card';c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label',`Ver ${x.name}`);const symbol=document.createElement('div');symbol.className='emoji';symbol.textContent=emoji[x.type]||'✨';const h=document.createElement('h3');h.textContent=safe(x.name);const a=document.createElement('div');a.className='alias';a.textContent=`Por ${safe(x.alias)}`;const p=document.createElement('p');p.textContent=safe(x.description);c.append(symbol,h,a,p);const mission=terraformMissionFor(x.description);if(mission){const badge=document.createElement('span');badge.className='mission-label';badge.textContent='🎮 GTA VII · '+mission.label;c.appendChild(badge);}c.addEventListener('click',()=>openDetails(x));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(x)}});cards.appendChild(c)}}
openDetails=(obj,poi=null)=>{const travelButton=$('travel-to-world');const mission=terraformMissionFor(obj.description);travelButton.hidden=!mission;travelButton.onclick=mission?()=>{$('detail-dialog').close();startTravel(obj)}:null;$('detail-type').textContent=poi?'📍 Punto de interés':`${emoji[obj.type]||'✨'} ${obj.type}`;$('detail-title').textContent=poi?safe(poi.title):safe(obj.name);$('detail-description').textContent=poi?safe(poi.description):safe(obj.description);$('detail-alias').textContent=`Descubierto por ${safe(obj.alias)}`;const a=$('detail-issue');a.href=obj.issue_url||`https://github.com/${REPO}/issues`;a.textContent=obj.issue_number?`Ver GitHub Issue #${obj.issue_number} ↗`:'Ver repositorio ↗';$('detail-dialog').showModal()};
$('close-detail').onclick=()=>$('detail-dialog').close();$('open-form').onclick=()=>$('create-dialog').showModal();$('close-form').onclick=()=>$('create-dialog').close();
for(const mission of TERRAFORMING_MISSIONS){
  $(mission.id+'-github').href=terraformGitHubUrl(mission.id,REPO);
}
document.querySelectorAll('[data-mission]').forEach(button=>button.addEventListener('click',()=>{
  const missionId=button.dataset.mission;
  const mission=TERRAFORMING_MISSIONS.find(m=>m.id===missionId);
  if(!mission)return;
  const draft=terraformProposal(missionId);
  const form=$('create-form');
  form.elements.namedItem('type').value=draft.type;
  form.elements.namedItem('name').value=draft.name;
  form.elements.namedItem('description').value=draft.description;
  $('form-status').textContent='';
  $('mission-feedback').textContent='Misión '+mission.label+' preparada. Añade tu alias y modifica el nombre y los detalles si quieres; conserva el marcador [GTA:...] al principio para que cuente como creación de esta misión.';
  $('create-dialog').showModal();
  form.elements.namedItem('alias').focus();
}));
async function sync(){if(!API)return;try{const r=await fetch(`${API}/api/objects`,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();objects=Array.isArray(data.objects)?data.objects:[];if(!firstLiveSync)suppressBirth=true;refreshUI();firstLiveSync=true;suppressBirth=false;$('connection').textContent='En directo · GitHub Issues';$('last-sync').textContent=`Actualizado ${new Date().toLocaleTimeString('es-ES')}`;}catch(e){$('connection').textContent='Sincronización no disponible';$('last-sync').textContent='Reintentando conexión…'}}
function draftIssue(status,body,message,redirect=false){
 const url=issueDraftUrl(body,REPO);
 const link=document.createElement('a');
 link.href=url;link.target='_blank';link.rel='noopener noreferrer';
 link.textContent='Revisar y publicar la Issue en GitHub ↗';
 status.className='';
 status.replaceChildren(document.createTextNode(message+' '),link);
 if(redirect)window.location.assign(url);
}
function updateCreateUI(){
 $('open-form').textContent=createEnabled?'Crear objeto cósmico':'Preparar propuesta para GitHub';
 $('submit-object').textContent=createEnabled?'Lanzar al universo 🚀':'Continuar en GitHub ↗';
 const hint=$('create-form').querySelector('.micro');
 if(hint)hint.textContent=createEnabled
   ? 'Tu creación se registrará como GitHub Issue pública y aparecerá en el universo. Evita datos personales.'
   : 'El universo ya consulta Cloudflare D1, pero crear Issues desde la web requiere activar GITHUB_TOKEN. Puedes continuar en GitHub con los campos precargados.';
}
async function checkCreateCapability(){
 if(!API){updateCreateUI();return}
 try{
   const response=await fetch(`${API}/api/health`,{cache:'no-store'});
   if(!response.ok)throw new Error('Servicio no disponible');
   const data=await response.json();
   createEnabled=data.ok===true && data.database_connected===true && data.create_enabled===true;
 }catch(error){createEnabled=false}
 updateCreateUI();
}
$('create-form').addEventListener('submit',async e=>{
 e.preventDefault();
 // currentTarget is only guaranteed while this event is being dispatched.
 // Capture the form before the first await; after fetch it becomes null.
 const form=e.currentTarget;
 const status=$('form-status');
 const body=Object.fromEntries(new FormData(form));
 if(!API||!createEnabled){
   draftIssue(status,body,'Los datos están preparados. Confirma la creación de tu Issue en GitHub.',true);
   return;
 }
 const btn=$('submit-object');
 let registeredIssue=null;
 btn.disabled=true;status.className='';status.textContent='Registrando tu Issue pública…';
 try{
   const r=await fetch(`${API}/api/create`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
   const data=await r.json();
   if(r.status===503 && data.code==='CREATE_NOT_READY'){
     createEnabled=false;updateCreateUI();
     draftIssue(status,body,'El registro web está pendiente de activar. Puedes publicar tu propuesta en GitHub.');
     return;
   }
   if(!r.ok)throw Error(data.error||'No se pudo crear');
   // GitHub creation and D1 persistence have succeeded at this point.
   registeredIssue=Number(data.issue_number);
   if(!Number.isInteger(registeredIssue)||registeredIssue<1)throw new Error('Respuesta de creación inválida');
   form.reset();
   const issueLink=document.createElement('a');
   issueLink.href=`https://github.com/${REPO}/issues/${registeredIssue}`;
   issueLink.target='_blank';
   issueLink.rel='noopener noreferrer';
   issueLink.textContent=`Ver Issue #${registeredIssue} en GitHub ↗`;
   status.replaceChildren(document.createTextNode('¡Registrado! Tu creación ya forma parte de AcademyVerso. '),issueLink);
   await sync();
 }catch(err){
   if(registeredIssue){
     // Never suggest creating the same Issue again after the server confirmed it.
     status.className='';
     status.textContent=`¡Registrado! Issue #${registeredIssue}. La actualización visual no se ha completado; recarga la galaxia.`;
     return;
   }
   status.className='error';
   const link=document.createElement('a');
   link.href=issueDraftUrl(body,REPO);link.target='_blank';link.rel='noopener noreferrer';
   link.textContent='Abrir propuesta en GitHub ↗';
   status.replaceChildren(document.createTextNode(err.message+'; si no se creó ninguna Issue, puedes intentarlo en GitHub. '),link);
 }finally{btn.disabled=false}
});
refreshUI();checkCreateCapability();
if(API){$('connection').textContent='Conectando…';sync();setInterval(sync,Math.max(3000,Number(config.POLL_MS)||5000));}
else{$('connection').textContent='Modo demostración';$('last-sync').textContent='6 objetos de ejemplo · Backend pendiente';}
