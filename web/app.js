import {advanceMission,emptyMissionState,missionProgress} from './missions.mjs';
import {portalChoices,selectPortalPair,portalFlightPose,portalColor} from './portal.mjs';
import {evolutionComment,worldUrl,mutateWorld} from './worlds/evolution-ui.mjs';
import {initialQuality,adaptiveQuality,pixelRatioFor} from './worlds/quality.mjs';
import {resolvedWorldSpec} from './worlds/spec.mjs';
import {buildWorld} from './worlds/builder.mjs';
import {birthProgress,birthScale,createBirthParticles} from './worlds/birth.mjs';
import {disposeGroup} from './worlds/dispose.mjs';
import {listPois,cameraPoseForPoi} from './worlds/poi.mjs';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { issueDraftUrl } from './issue-prefill.mjs';
import {TERRAFORMING_MISSIONS,terraformMissionFor,terraformCounts,terraformProposal,terraformGitHubUrl} from './terraforming.mjs';
import {numberHash,orderWorlds,worldPosition,homeCameraPose,cameraPoseForWorld,flightPose,zoomDistance,fitHomeDistance,HOME_ORBIT} from './travel.mjs';

const config = window.ACADEMYVERSO_CONFIG || {};
const API = String(config.API_BASE || '').replace(/\/$/, '');
let createEnabled = false;
let worldgenLive = false;
let selectedWorld = null;
const tokenKey=id=>'academyverso-2026:world-owner:'+String(id);
function savedWorldToken(id){try{return sessionStorage.getItem(tokenKey(id))||''}catch{return ''}}
function storeWorldToken(id,token){try{sessionStorage.setItem(tokenKey(id),token)}catch{}}

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
// Modo embed: incrusta solo el universo 3D (presentación). Activa con ?embed=1
const EMBED = new URLSearchParams(location.search).has('embed');
if (EMBED) document.body.classList.add('embed');
const safe=s=>String(s??'').trim().slice(0,280);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let quality=initialQuality(navigator.hardwareConcurrency||4,devicePixelRatio||1);

const viewport=$('viewport');
const scene=new THREE.Scene();
const BASE_FOG=0.004;
scene.fog=new THREE.FogExp2(0x11182d,BASE_FOG);
const camera=new THREE.PerspectiveCamera(58,1,.1,2000);
camera.position.set(0,65,185);
// Some phones, kiosk browsers and battery-saver modes have no WebGL. The constructor then throws, and
// without this guard the whole module stopped: no cards, forms or missions. Keep the page working
// with a no-op renderer and turn off only what needs the 3D view (travel and the portal).
function createRenderer(){
 try{return new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}
 catch(error){console.warn('AcademyVerso: WebGL no disponible; se desactiva la vista 3D.',error);return null;}
}
const glRenderer=createRenderer();
const webgl=glRenderer!==null;
const renderer=glRenderer||{domElement:document.createElement('canvas'),setPixelRatio(){},setSize(){},render(){}};
renderer.setPixelRatio(pixelRatioFor(quality,devicePixelRatio));
renderer.outputColorSpace=THREE.SRGBColorSpace;
if(webgl){viewport.innerHTML='';viewport.appendChild(renderer.domElement);}
else{
 viewport.classList.add('no-webgl');
 viewport.setAttribute('aria-label','Vista 3D no disponible en este dispositivo');
 $('fallback-text').textContent='Tu dispositivo o navegador no puede mostrar la galaxia 3D. Puedes seguir creando tu mundo y ver todas las creaciones más abajo.';
}
scene.add(new THREE.AmbientLight(0x859aff,2));
const light=new THREE.PointLight(0x9cfff7,13000,800);light.position.set(-40,30,80);scene.add(light);
const center=new THREE.Mesh(new THREE.SphereGeometry(14,32,24),new THREE.MeshStandardMaterial({color:0x71d8d5,emissive:0x3c7e95,emissiveIntensity:.5,roughness:.7}));scene.add(center);
const centerHalo=new THREE.Mesh(new THREE.TorusGeometry(21,0.32,8,90),new THREE.MeshBasicMaterial({color:0xbac3ff,transparent:true,opacity:.55}));centerHalo.rotation.x=Math.PI/2.8;scene.add(centerHalo);
const starsGeo=new THREE.BufferGeometry();const points=[];for(let i=0;i<1300;i++){points.push((Math.random()-.5)*800,(Math.random()-.5)*550,(Math.random()-.5)*900)}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xd9e8ff,size:1.25,sizeAttenuation:true,transparent:true,opacity:.75})));
let meshes=[],clickables=[];
let portalSelection={source:null,target:null},portalArt=[],portalArtSignature='';
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
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
function disposeWorld(m){disposeGroup(scene,m.group)}
function clearPortalArt(){
 for(const gate of portalArt)disposeWorld({group:gate});
 portalArt=[];portalArtSignature='';
}
// GPU-light, procedural, original interdimensional ring. No external assets or shaders.
function makePortalGate(world,color){
 const gate=new THREE.Group();
 const radius=Math.max(5,Math.min(12,world.size*1.05));
 const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false});
 gate.add(new THREE.Mesh(new THREE.TorusGeometry(radius,.4,10,64),material));
 const inner=new THREE.Mesh(new THREE.TorusGeometry(radius*.79,.17,8,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.52,depthWrite:false}));
 inner.rotation.y=.24;gate.add(inner);
 const veil=new THREE.Mesh(new THREE.CircleGeometry(radius*.79,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));
 gate.add(veil);
 if(quality!=='low'&&!reduced){
  const sparkles=[];for(let i=0;i<40;i++){const angle=i*Math.PI*2/40,r=radius*(.86+(i%5)*.07);sparkles.push(Math.cos(angle)*r,Math.sin(angle)*r,Math.sin(i*17)*.4);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(sparkles,3));
  gate.add(new THREE.Points(geometry,new THREE.PointsMaterial({color,size:.38,transparent:true,opacity:.88,depthWrite:false})));
 }
 gate.position.copy(world.group.position);
 gate.position.x+=world.size*.75;
 gate.position.y+=world.size*.25;
 scene.add(gate);portalArt.push(gate);
}
function updatePortalControls(){
 const choices=portalChoices(objects),sourceSelect=$('portal-source'),targetSelect=$('portal-target');
 const pair=selectPortalPair(choices,portalSelection);
 sourceSelect.replaceChildren();targetSelect.replaceChildren();
 for(const world of choices){
   for(const sel of [sourceSelect,targetSelect]){const option=document.createElement('option');option.value=String(world.issue_number);option.textContent=safe(world.name)+' · #'+world.issue_number;sel.appendChild(option);}
 }
 const ready=!!pair;
 sourceSelect.disabled=!ready;targetSelect.disabled=!ready;$('portal-launch').disabled=!ready||!webgl;
 $('portal-mode').textContent=!firstLiveSync?'Modo demostración o conexión pendiente': 'Objetos obtenidos de Cloudflare D1';
 if(!pair){
   portalSelection={source:null,target:null};clearPortalArt();
   $('portal-feedback').textContent='Se necesitan al menos dos mundos distintos para abrir un portal.';
   return;
 }
 portalSelection={source:String(pair.source.issue_number),target:String(pair.target.issue_number)};
 sourceSelect.value=portalSelection.source;targetSelect.value=portalSelection.target;
 $('portal-feedback').textContent=webgl
  ?'Conecta '+safe(pair.source.name)+' con '+safe(pair.target.name)+'. Los destinos se eligen entre mundos disponibles, no se crean objetos ficticios.'
  :'El portal necesita la vista 3D, que este dispositivo no puede mostrar. Síguelo en la pantalla de la sala.';
 const source=meshes.find(m=>String(m.obj.issue_number)===portalSelection.source);
 const target=meshes.find(m=>String(m.obj.issue_number)===portalSelection.target);
 const signature=[portalSelection.source,portalSelection.target,quality,source?.signature,target?.signature].join('|');
 if(signature!==portalArtSignature){clearPortalArt();if(source&&target){makePortalGate(source,portalColor(pair.source.issue_number));makePortalGate(target,portalColor(pair.target.issue_number));portalArtSignature=signature;}}
}
function beginPortalTrip(){
 const pair=selectPortalPair(objects,portalSelection);
 if(!pair||String(pair.source.issue_number)!==portalSelection.source||String(pair.target.issue_number)!==portalSelection.target){
  $('portal-feedback').textContent='Los destinos han cambiado. Elige dos mundos disponibles.';return;
 }
 if(flight){$('portal-feedback').textContent='Ya hay un viaje en curso.';return;}
 const source=meshes.find(m=>String(m.obj.issue_number)===portalSelection.source);
 const target=meshes.find(m=>String(m.obj.issue_number)===portalSelection.target);
 if(!source||!target){$('portal-feedback').textContent='Los mundos aún no se han representado. Reinténtalo.';return;}
 hidePois();
 const from=currentPose(),a=source.group.position,b=target.group.position;
 const entry=cameraPoseForWorld({x:a.x,y:a.y,z:a.z},from.eye,source.size);
 const exit=cameraPoseForWorld({x:b.x,y:b.y,z:b.z},entry.eye,target.size);
 const to=cameraPoseForWorld({x:b.x,y:b.y,z:b.z},from.eye,target.size);
 activeWorldId=portalSelection.target;travelMode='travelling';
 flight={from,entry,exit,to,startedAt:performance.now(),duration:reduced?0:3100,kind:'portal',worldName:safe(pair.target.name),sourceName:safe(pair.source.name)};
 $('travel-panel').hidden=false;
 $('travel-world').textContent=safe(pair.source.name)+' → '+safe(pair.target.name);
 $('travel-phase').textContent=reduced?'Salto accesible inmediato':'Portal activado · aproximándonos al origen';
 viewport.classList.toggle('travelling',!reduced);
 $('universe').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
 statusMessage('Portal interdimensional de '+safe(pair.source.name)+' a '+safe(pair.target.name)+'.');
 if(reduced)advanceFlight(flight.startedAt);
 else $('return-home').focus({preventScroll:true});
}
$('portal-source').addEventListener('change',e=>{portalSelection.source=e.target.value;updatePortalControls()});
$('portal-target').addEventListener('change',e=>{portalSelection.target=e.target.value;updatePortalControls()});
$('portal-swap').addEventListener('click',()=>{portalSelection={source:portalSelection.target,target:portalSelection.source};updatePortalControls()});
$('portal-launch').addEventListener('click',beginPortalTrip);
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
   // Keep the spin angle so a quality rebuild does not move a POI away from the camera.
   if(previous)created.group.rotation.y=previous.group.rotation.y;
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
 updatePortalControls();
 refitHome();
 if(activeWorldId!==null&&travelMode!=='returning'&&!meshes.some(m=>String(m.obj.issue_number)===activeWorldId)){
  returnHome('El destino ya no está disponible. Regresamos a la galaxia.');
 }
}
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);refitHome()}
// Orbiting remains available both in the galaxy and after reaching a destination.
const focus=new THREE.Vector3(0,0,0);
let pointerDown=null,dragging=false,yaw=HOME_ORBIT.yaw,pitch=HOME_ORBIT.pitch,dist=HOME_ORBIT.distance;
let flight=null,travelMode='galaxy',activeWorldId=null;
// While a POI is focused its world stops spinning, so the camera keeps looking at it.
let poiFocusWorldId=null,activePoiId=null;
// The home view is framed for the viewport's shape and the galaxy's size (see fitHomeDistance).
// Once the visitor drags or zooms, a resize or a new world no longer moves their camera.
let homeDistance=HOME_ORBIT.distance,homeUntouched=true;
function galaxyExtent(){
 let r=0;
 for(const m of meshes){const p=m.group.position;r=Math.max(r,Math.hypot(p.x,p.z)+m.size*2);}
 return r;
}
function refitHome(){
 const next=fitHomeDistance(galaxyExtent(),camera.aspect);
 if(Math.abs(next-homeDistance)<0.5)return;
 homeDistance=next;
 // Keep the home view as deep as before: thinner fog when the camera has to pull back.
 scene.fog.density=BASE_FOG*HOME_ORBIT.distance/homeDistance;
 if(travelMode==='galaxy'&&!flight&&homeUntouched){dist=homeDistance;updateCamera();}
}
new ResizeObserver(resize).observe(viewport);resize();

let missionState=emptyMissionState();
function updateMissionUI(){
 const progress=missionProgress(missionState);
 $('mission-stars').textContent='★'.repeat(progress.stars)+'☆'.repeat(5-progress.stars);
 $('mission-progress').textContent=progress.stars+'/5 estrellas · '+progress.visited+'/2 mundos GTA VII · '+progress.points+'/3 descubrimientos';
}
function recordMission(event){
 const next=advanceMission(missionState,event);
 if(next!==missionState){missionState=next;updateMissionUI();}
}
$('mission-reset').addEventListener('click',()=>{
 missionState=emptyMissionState();updateMissionUI();
 $('mission-reset').focus({preventScroll:true});
});
updateMissionUI();

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
  viewport.classList.remove('travelling','portal-crossing');
  deriveOrbit();
  if(completed.kind==='home'){
    travelMode='galaxy';activeWorldId=null;homeUntouched=true;
    $('travel-panel').hidden=true;
    statusMessage('Has regresado a la galaxia. Selecciona otro planeta para viajar.');
    $('reset-camera').focus({preventScroll:true});
  }else if(completed.kind==='poi'){
    travelMode='world';
    const poi=completed.poi;
    if(poi){
      if(completed.missionId)recordMission({kind:'poi-discovered',mission:completed.missionId,poi:poi.kind});
      $('travel-phase').textContent='Sobrevolando '+poi.label+' · arrastra para explorar';
      $('poi-detail').textContent=poi.label+': '+poi.description;
      statusMessage('Has llegado a '+poi.label+' en '+completed.worldName+'. '+poi.description);
    }else{
      $('travel-phase').textContent='Destino alcanzado · arrastra para explorar';
      $('poi-detail').textContent='';
      statusMessage('Vista general de '+completed.worldName+'.');
    }
  }else{
    travelMode='world';
    if(completed.missionId)recordMission({kind:'world-reached',mission:completed.missionId});
    $('travel-phase').textContent=completed.kind==='portal'?'Portal atravesado · explora el mundo':'Destino alcanzado · arrastra para explorar';
    statusMessage('Destino alcanzado: '+completed.worldName+'. Puedes explorar alrededor del planeta o regresar.');
    activePoiId=null;poiFocusWorldId=null;renderPoiList();
    $('return-home').focus({preventScroll:true});
  }
}
function activeWorld(){return meshes.find(m=>String(m.obj.issue_number)===activeWorldId)||null;}
function worldPois(world){
  world.group.updateMatrixWorld(true);
  const v=new THREE.Vector3();
  return listPois(world.targets.filter(m=>m.userData.poi).map(m=>{m.getWorldPosition(v);return {poi:m.userData.poi,position:{x:v.x,y:v.y,z:v.z}};}));
}
function hidePois(){
  poiFocusWorldId=null;activePoiId=null;
  $('poi-panel').hidden=true;$('poi-list').replaceChildren();$('poi-detail').textContent='';
}
function markActivePoi(){
  for(const b of $('poi-list').children)b.setAttribute('aria-pressed',String((b.dataset.poi||null)===activePoiId));
}
// Keyboard/touch alternative to raycast picking: native buttons, one per POI of the visited world.
function renderPoiList(){
  const world=activeWorld();
  const pois=world?worldPois(world):[];
  if(!pois.length){hidePois();return;}
  const list=$('poi-list');list.replaceChildren();
  const add=(id,label)=>{
    const b=document.createElement('button');b.type='button';b.dataset.poi=id||'';b.textContent=label;
    b.setAttribute('aria-controls','viewport');b.addEventListener('click',()=>visitPoi(id));list.appendChild(b);
  };
  add(null,'🪐 Vista del planeta');
  for(const poi of pois)add(poi.id,poi.label);
  markActivePoi();
  $('poi-panel').hidden=false;
}
function visitPoi(id){
  if(flight||travelMode!=='world')return;
  const world=activeWorld();
  if(!world){returnHome('El destino ya no está disponible. Regresamos a la galaxia.');return;}
  const c=world.group.position,center={x:c.x,y:c.y,z:c.z},from=currentPose();
  let poi=null,to;
  if(id){
    poi=worldPois(world).find(p=>p.id===id)||null;
    if(!poi){statusMessage('Este punto de interés ya no está disponible.');renderPoiList();return;}
    poiFocusWorldId=activeWorldId;
    to=cameraPoseForPoi(center,poi.position,world.size);
  }else{
    poiFocusWorldId=null;
    to=cameraPoseForWorld(center,from.eye,world.size);
  }
  activePoiId=id||null;markActivePoi();
  travelMode='travelling';
  flight={from,to,startedAt:performance.now(),duration:reduced?0:1200,kind:'poi',poi,worldName:safe(world.obj.name),missionId:terraformMissionFor(world.obj.description)?.id};
  $('travel-phase').textContent=poi?'Sobrevolando · '+poi.label:'Volviendo a la vista del planeta';
  viewport.classList.toggle('travelling',!reduced);
  statusMessage(poi?'Sobrevolando '+poi.label+'.':'Volviendo a la vista general de '+safe(world.obj.name)+'.');
  if(reduced)advanceFlight(flight.startedAt);
}
function advanceFlight(now){
  if(!flight)return;
  const state=flight.kind==='portal'?portalFlightPose(flight,now):flightPose(flight,now);
  setPose(state);
  if(flight.kind==='portal'){
    viewport.classList.toggle('portal-crossing',state.stage==='crossing'&&!reduced);
    if(state.stage==='crossing')$('travel-phase').textContent='Atravesando el portal interdimensional';
    else if(state.stage==='arriving')$('travel-phase').textContent='Emergiendo en el mundo de destino';
  }
  if(state.done)finishFlight();
}
function startTravel(obj){
  if(!terraformMissionFor(obj?.description))return false;
  const world=meshes.find(m=>String(m.obj.issue_number)===String(obj.issue_number));
  if(!world){statusMessage('Este mundo todavía no se ha cargado. Vuelve a intentarlo.');return false;}
  hidePois();
  const from=currentPose();
  const target=world.group.position;
  const to=cameraPoseForWorld({x:target.x,y:target.y,z:target.z},from.eye,world.size);
  activeWorldId=String(obj.issue_number);
  travelMode='travelling';
  flight={from,to,startedAt:performance.now(),duration:reduced?0:1850,kind:'world',worldName:safe(obj.name),missionId:terraformMissionFor(obj.description)?.id};
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
    yaw=HOME_ORBIT.yaw;pitch=HOME_ORBIT.pitch;dist=homeDistance;homeUntouched=true;
    focus.set(0,0,0);updateCamera();
    return;
  }
  hidePois();
  const from=currentPose();
  activeWorldId=null;
  travelMode='returning';
  flight={from,to:homeCameraPose(homeDistance),startedAt:performance.now(),duration:reduced?0:1100,kind:'home'};
  $('travel-panel').hidden=false;
  $('travel-phase').textContent='Regresando a la galaxia';
  viewport.classList.toggle('travelling',!reduced);
  viewport.classList.remove('portal-crossing');
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
     homeUntouched=false;updateCamera();
   }
   previousPinchGap=gap;pointerDown=null;dragging=true;
   return;
 }
 if(!pointerDown)return;
 const dx=e.clientX-prior.x,dy=e.clientY-prior.y;
 if(Math.abs(e.clientX-pointerDown.x)+Math.abs(e.clientY-pointerDown.y)>4)dragging=true;
 yaw-=dx*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch+dy*.003));
 homeUntouched=false;updateCamera();
});
renderer.domElement.addEventListener('pointerup',e=>{
 const tap=activePointers.size===1&&pointerDown!==null&&!dragging&&!flight;
 activePointers.delete(e.pointerId);pointerDown=null;previousPinchGap=null;
 if(!tap)return;
 const b=renderer.domElement.getBoundingClientRect();
 mouse.x=((e.clientX-b.left)/b.width)*2-1;mouse.y=-((e.clientY-b.top)/b.height)*2+1;
 raycaster.setFromCamera(mouse,camera);
 const found=raycaster.intersectObjects(clickables)[0];
 if(found){
  const selected=found.object.userData;
  const mission=terraformMissionFor(selected.obj.description);
  if(selected.poi&&mission)recordMission({kind:'poi-discovered',mission:mission.id,poi:selected.poi.kind});
  openDetails(selected.obj,selected.poi);
 }
});
renderer.domElement.addEventListener('pointercancel',e=>{
 activePointers.delete(e.pointerId);pointerDown=null;previousPinchGap=null;dragging=true;
});
renderer.domElement.addEventListener('wheel',e=>{
 e.preventDefault();
 if(flight)return;
 dist=zoomDistance(dist,(dist+Math.sign(e.deltaY)*10)/dist,travelMode==='world');
 homeUntouched=false;updateCamera();
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
    portalArt.forEach((gate,i)=>{gate.rotation.z+=i%2===0?.004:-.004;});
    meshes.forEach(m=>{
      if(String(m.obj.issue_number)!==poiFocusWorldId)m.group.rotation.y+=.0025;
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
}
if(webgl)animate();
let renderedSignature=null;
function refreshUI(){const signature=JSON.stringify(objects);if(signature===renderedSignature)return;renderedSignature=signature;paint(objects);$('count').textContent=objects.length;$('explorers').textContent=new Set(objects.map(o=>o.alias)).size;const totals=terraformCounts(API?objects:[]);for(const mission of TERRAFORMING_MISSIONS){$(mission.id+'-count').textContent=totals[mission.id];}const cards=$('cards');cards.replaceChildren();for(const x of objects.slice(-12).reverse()){const c=document.createElement('article');c.className='body-card';c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label',`Ver ${x.name}`);const symbol=document.createElement('div');symbol.className='emoji';symbol.textContent=emoji[x.type]||'✨';const h=document.createElement('h3');h.textContent=safe(x.name);const a=document.createElement('div');a.className='alias';a.textContent=`Por ${safe(x.alias)}`;const p=document.createElement('p');p.textContent=safe(x.description);c.append(symbol,h,a,p);const mission=terraformMissionFor(x.description);if(mission){const badge=document.createElement('span');badge.className='mission-label';badge.textContent='🎮 GTA VII · '+mission.label;c.appendChild(badge);}c.addEventListener('click',()=>openDetails(x));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(x)}});cards.appendChild(c)}}
openDetails=(obj,poi=null)=>{selectedWorld=obj;const evolvePanel=$('world-evolve-panel');evolvePanel.hidden=!worldgenLive||!API||!obj.issue_number;if(!evolvePanel.hidden){$('world-edit-token').value=savedWorldToken(obj.issue_number);$('world-evolve-status').textContent='';$('world-history-list').replaceChildren();}const travelButton=$('travel-to-world');const mission=terraformMissionFor(obj.description);travelButton.hidden=!mission||!webgl;travelButton.onclick=mission&&webgl?()=>{$('detail-dialog').close();startTravel(obj)}:null;$('detail-type').textContent=poi?'📍 Punto de interés':`${emoji[obj.type]||'✨'} ${obj.type}`;$('detail-title').textContent=poi?safe(poi.title):safe(obj.name);$('detail-description').textContent=poi?safe(poi.description):safe(obj.description);$('detail-alias').textContent=`Descubierto por ${safe(obj.alias)}`;const a=$('detail-issue');a.href=obj.issue_url||`https://github.com/${REPO}/issues`;a.textContent=obj.issue_number?`Ver GitHub Issue #${obj.issue_number} ↗`:'Ver repositorio ↗';$('detail-dialog').showModal()};

$('copy-evolve-command').addEventListener('click',async()=>{
 if(!selectedWorld)return;
 const instruction=$('world-evolve-instruction').value.trim()||'Añade dos lunas y una ciudad flotante';
 try{
  const command=evolutionComment(instruction);
  await navigator.clipboard.writeText(command);
  $('world-evolve-status').textContent='Comando copiado. Pégalo como comentario en tu GitHub Issue, con tu cuenta de autor.';
 }catch(error){$('world-evolve-status').textContent=error.message||'No se pudo copiar el comando';}
});
$('world-evolve-form').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!selectedWorld||!API)return;
 const status=$('world-evolve-status'),token=$('world-edit-token').value.trim();
 const instruction=$('world-evolve-instruction').value.trim();
 status.textContent='Evolucionando mundo y guardando una nueva versión…';
 try{
  const result=await mutateWorld(API,selectedWorld.issue_number,'evolve',token,{instruction});
  storeWorldToken(selectedWorld.issue_number,token);
  status.textContent='Versión '+result.version+' registrada ('+(result.status==='ready'?'Microsoft Foundry':'generación procedural de respaldo')+'). Actualizando galaxia…';
  await sync();
 }catch(error){status.textContent=error.message||'No se pudo evolucionar el mundo';}
});
$('world-history-button').addEventListener('click',async()=>{
 if(!selectedWorld||!API)return;
 const list=$('world-history-list');list.replaceChildren();
 try{
  const response=await fetch(worldUrl(API,selectedWorld.issue_number,'history'),{cache:'no-store'});
  const data=await response.json();
  if(!response.ok)throw Error(data.error||'No se pudo obtener el historial');
  for(const revision of data.versions||[]){
   const li=document.createElement('li');
   li.textContent='Versión '+revision.version+' · '+revision.world_status+' · '+revision.created_at;
   list.append(li);
  }
  if(!list.childElementCount){const li=document.createElement('li');li.textContent='Sin versiones registradas';list.append(li);}
 }catch(error){$('world-evolve-status').textContent=error.message;}
});
$('world-rollback-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!selectedWorld||!API)return;
 const status=$('world-evolve-status'),token=$('world-edit-token').value.trim(),version=Number($('world-rollback-version').value);
 status.textContent='Restaurando versión '+version+'…';
 try{
  const result=await mutateWorld(API,selectedWorld.issue_number,'rollback',token,{version});
  status.textContent='Versión '+result.version+' creada al restaurar la versión '+version+'.';
  await sync();
 }catch(error){status.textContent=error.message||'No se pudo restaurar';}
});

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
async function sync(){if(!API)return;try{const r=await fetch(`${API}/api/objects`,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();objects=Array.isArray(data.objects)?data.objects:[];if(!firstLiveSync)suppressBirth=true;firstLiveSync=true;refreshUI();suppressBirth=false;$('connection').textContent='En directo · GitHub Issues';$('last-sync').textContent=`Actualizado ${new Date().toLocaleTimeString('es-ES')}`;}catch(e){$('connection').textContent='Sincronización no disponible';$('last-sync').textContent='Reintentando conexión…'}}
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
   worldgenLive=data.worldgen_enabled===true;
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
   if(typeof data.edit_token==='string'&&/^[A-Za-z0-9_-]{43}$/.test(data.edit_token)){
    storeWorldToken(registeredIssue,data.edit_token);
    const notice=document.createElement('p');
    notice.textContent='Guarda esta clave privada para poder evolucionar el mundo. Solo se muestra al crearlo:';
    const code=document.createElement('code');code.textContent=data.edit_token;
    const copy=document.createElement('button');copy.type='button';copy.textContent='Copiar clave';
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(data.edit_token);copy.textContent='Clave copiada';}catch{copy.textContent='Selecciona la clave y cópiala';}});
    status.append(notice,code,document.createTextNode(' '),copy);
   }
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
