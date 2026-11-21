import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { issueDraftUrl } from './issue-prefill.mjs';
import {TERRAFORMING_MISSIONS,terraformMissionFor,terraformCounts,terraformProposal,terraformGitHubUrl} from './terraforming.mjs';

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

const viewport=$('viewport');
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x11182d,0.004);
const camera=new THREE.PerspectiveCamera(58,1,.1,2000);
camera.position.set(0,65,185);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
viewport.innerHTML='';viewport.appendChild(renderer.domElement);
scene.add(new THREE.AmbientLight(0x859aff,2));
const light=new THREE.PointLight(0x9cfff7,13000,800);light.position.set(-40,30,80);scene.add(light);
const center=new THREE.Mesh(new THREE.SphereGeometry(14,32,24),new THREE.MeshStandardMaterial({color:0x71d8d5,emissive:0x3c7e95,emissiveIntensity:.5,roughness:.7}));scene.add(center);
const centerHalo=new THREE.Mesh(new THREE.TorusGeometry(21,0.32,8,90),new THREE.MeshBasicMaterial({color:0xbac3ff,transparent:true,opacity:.55}));centerHalo.rotation.x=Math.PI/2.8;scene.add(centerHalo);
const starsGeo=new THREE.BufferGeometry();const points=[];for(let i=0;i<1300;i++){points.push((Math.random()-.5)*800,(Math.random()-.5)*550,(Math.random()-.5)*900)}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xd9e8ff,size:1.25,sizeAttenuation:true,transparent:true,opacity:.75})));
let meshes=[],clickables=[];const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
function numberHash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function makeBody(obj,i,total){const h=numberHash(`${obj.issue_number}-${obj.name}`),t=String(obj.type||'planeta');const angle=i*2.399963+((h%47)/200);const radius=33+Math.sqrt(i+1)*16;const y=((h%27)-13)*1.6;const pos=new THREE.Vector3(Math.cos(angle)*radius,y,Math.sin(angle)*radius);const colorPal=[0x64c4c1,0xb0a0ef,0xffba68,0x71b2ed,0xef89a3,0xf4db82];let color=colorPal[h%colorPal.length];if(/rojo|fuego|lava/i.test(obj.description))color=0xea777a;if(/verde|bosque/i.test(obj.description))color=0x7acb99;
 const group=new THREE.Group();group.position.copy(pos);
 const size=t==='estrella'?7:t==='planeta'?6:t==='agujero-negro'?6:t==='estacion'?4:3.6;
 const mat=new THREE.MeshStandardMaterial({color:t==='agujero-negro'?0x101020:color,roughness:.76,metalness:t==='estacion'?.5:.1,emissive:t==='estrella'?color:0x0f1524,emissiveIntensity:t==='estrella'?.85:.07});
 const mission=terraformMissionFor(obj.description);
 if(mission){mat.color.setHex(mission.id==='vice-nebula'?0xee78b8:0x4edfc4);mat.emissive.setHex(mission.id==='vice-nebula'?0x621d5c:0x116b64);mat.emissiveIntensity=.37;}
 const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(size,t==='asteroide'?0:2),mat);group.add(mesh);
 if(t==='planeta'||t==='agujero-negro'){const ring=new THREE.Mesh(new THREE.TorusGeometry(size*1.6,.35,7,56),new THREE.MeshBasicMaterial({color:t==='agujero-negro'?0x72e6db:mission?(mission.id==='vice-nebula'?0xff9fda:0x8bffea):0xe7badb,side:THREE.DoubleSide,transparent:true,opacity:.8}));ring.rotation.x=.8;ring.rotation.y=.2;group.add(ring)}
 if(t==='estacion'){const solar=new THREE.Mesh(new THREE.BoxGeometry(size*5,.35,2),new THREE.MeshStandardMaterial({color:0x6ac9f2,metalness:.5,roughness:.4}));group.add(solar)}
 if(t==='estrella'){const glow=new THREE.PointLight(color,350,80);group.add(glow)}
 mesh.userData={obj,group};clickables.push(mesh);meshes.push({group,phase:h%100/20});scene.add(group);
}
function paint(items){for(const m of meshes)scene.remove(m.group);meshes=[];clickables=[];items.slice(0,200).forEach((o,i)=>makeBody(o,i,items.length))}
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(viewport);resize();
let pointerDown=null,dragging=false,yaw=0,pitch=.12,dist=190;
function updateCamera(){camera.position.set(Math.sin(yaw)*dist*Math.cos(pitch),Math.sin(pitch)*dist,Math.cos(yaw)*dist*Math.cos(pitch));camera.lookAt(0,0,0)}
renderer.domElement.addEventListener('pointerdown',e=>{pointerDown={x:e.clientX,y:e.clientY};dragging=false;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!pointerDown)return;const dx=e.clientX-pointerDown.x,dy=e.clientY-pointerDown.y;if(Math.abs(dx)+Math.abs(dy)>4)dragging=true;yaw-=dx*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch+dy*.003));pointerDown={x:e.clientX,y:e.clientY};updateCamera()});
renderer.domElement.addEventListener('pointerup',e=>{pointerDown=null;if(dragging)return;const b=renderer.domElement.getBoundingClientRect();mouse.x=((e.clientX-b.left)/b.width)*2-1;mouse.y=-((e.clientY-b.top)/b.height)*2+1;raycaster.setFromCamera(mouse,camera);const found=raycaster.intersectObjects(clickables)[0];if(found)openDetails(found.object.userData.obj)});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(50,Math.min(380,dist+Math.sign(e.deltaY)*10));updateCamera()},{passive:false});
$('reset-camera').addEventListener('click',()=>{yaw=0;pitch=.12;dist=190;updateCamera()});
updateCamera();
function animate(){requestAnimationFrame(animate);if(!reduced){center.rotation.y+=.001;meshes.forEach((m,i)=>{m.group.rotation.y+=.0025;m.group.position.y+=Math.sin(performance.now()/1100+m.phase)*.006})}renderer.render(scene,camera)}animate();
function refreshUI(){paint(objects);$('count').textContent=objects.length;$('explorers').textContent=new Set(objects.map(o=>o.alias)).size;const totals=terraformCounts(API?objects:[]);for(const mission of TERRAFORMING_MISSIONS){$(mission.id+'-count').textContent=totals[mission.id];}const cards=$('cards');cards.replaceChildren();for(const x of objects.slice(-12).reverse()){const c=document.createElement('article');c.className='body-card';c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label',`Ver ${x.name}`);const symbol=document.createElement('div');symbol.className='emoji';symbol.textContent=emoji[x.type]||'✨';const h=document.createElement('h3');h.textContent=safe(x.name);const a=document.createElement('div');a.className='alias';a.textContent=`Por ${safe(x.alias)}`;const p=document.createElement('p');p.textContent=safe(x.description);c.append(symbol,h,a,p);const mission=terraformMissionFor(x.description);if(mission){const badge=document.createElement('span');badge.className='mission-label';badge.textContent='🎮 GTA VII · '+mission.label;c.appendChild(badge);}c.addEventListener('click',()=>openDetails(x));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(x)}});cards.appendChild(c)}}
openDetails=obj=>{$('detail-type').textContent=`${emoji[obj.type]||'✨'} ${obj.type}`;$('detail-title').textContent=safe(obj.name);$('detail-description').textContent=safe(obj.description);$('detail-alias').textContent=`Descubierto por ${safe(obj.alias)}`;const a=$('detail-issue');a.href=obj.issue_url||`https://github.com/${REPO}/issues`;a.textContent=obj.issue_number?`Ver GitHub Issue #${obj.issue_number} ↗`:'Ver repositorio ↗';$('detail-dialog').showModal()};
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
async function sync(){if(!API)return;try{const r=await fetch(`${API}/api/objects`,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();objects=Array.isArray(data.objects)?data.objects:[];refreshUI();$('connection').textContent='En directo · GitHub Issues';$('last-sync').textContent=`Actualizado ${new Date().toLocaleTimeString('es-ES')}`;}catch(e){$('connection').textContent='Sincronización no disponible';$('last-sync').textContent='Reintentando conexión…'}}
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
