// Pure camera math and deterministic scene layout. No THREE, DOM, secrets or network dependency.
export const HOME_ORBIT=Object.freeze({yaw:0,pitch:0.12,distance:190});
const lerp=(a,b,t)=>t<=0?a:t>=1?b:a+(b-a)*t;
const between=(n,a,b)=>Math.min(b,Math.max(a,n));

export function numberHash(str){
 let h=2166136261;
 for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
 return h>>>0;
}
export function orderWorlds(items=[]){
 return [...items].sort((a,b)=>Number(a.issue_number)-Number(b.issue_number));
}
// Reproduce the original AcademyVerso placement; sorting by issue number keeps older
// planets at stable coordinates when a new Issue arrives during a presentation.
export function worldPosition(obj,index){
 const h=numberHash(`${obj.issue_number}-${obj.name}`);
 const angle=index*2.399963+((h%47)/200);
 const radius=33+Math.sqrt(index+1)*16;
 return {x:Math.cos(angle)*radius,y:((h%27)-13)*1.6,z:Math.sin(angle)*radius};
}
// Home orbit distance that frames every world for the viewport's shape. A fixed distance cut
// worlds off on portrait phones and left them tiny on a wide projector. `extent` is the radius
// the worlds reach from the centre (rings included), `aspect` is width/height and `fovDeg` the
// camera's vertical field of view. The maximum matches the zoom limit: past it worlds are dots,
// so a phone with a very large galaxy still crops the outer ring and the visitor can drag.
export const HOME_DISTANCE_BOUNDS=Object.freeze({min:110,max:380});
export function fitHomeDistance(extent,aspect,fovDeg=58){
 const r=Math.max(40,Number.isFinite(extent)?extent:0);
 const a=Number.isFinite(aspect)&&aspect>0?aspect:1;
 const tanV=Math.tan(fovDeg*Math.PI/360);
 const across=r*1.05/(tanV*a);
 // The camera looks at the galaxy almost edge-on, so its height is about 0.6 of its radius.
 const tall=r*0.6*1.1/tanV;
 // Worlds on the near side sit closer to the camera and look wider: add a third of a radius.
 return between(Math.max(across,tall)+r*0.35,HOME_DISTANCE_BOUNDS.min,HOME_DISTANCE_BOUNDS.max);
}
export function homeCameraPose(distance=HOME_ORBIT.distance){
 const {yaw,pitch}=HOME_ORBIT;
 return {eye:{x:Math.sin(yaw)*distance*Math.cos(pitch),y:Math.sin(pitch)*distance,z:Math.cos(yaw)*distance*Math.cos(pitch)},focus:{x:0,y:0,z:0}};
}
export function cameraPoseForWorld(world,viewer,radius=6){
 const dx=viewer.x-world.x,dy=viewer.y-world.y,dz=viewer.z-world.z;
 const length=Math.hypot(dx,dy,dz);
 const direction=length>0.001?{x:dx/length,y:dy/length,z:dz/length}:{x:0,y:0,z:1};
 const distance=Math.max(25,Number(radius)*4.5);
 return {
   eye:{x:world.x+direction.x*distance,y:world.y+direction.y*distance+6,z:world.z+direction.z*distance},
   focus:{x:world.x,y:world.y,z:world.z}
 };
}
export function easedProgress(value){
 const t=between(Number.isFinite(value)?value:0,0,1);
 return t*t*(3-2*t);
}
export function flightPose(flight,now){
 const duration=Math.max(0,Number(flight.duration)||0);
 const elapsed=Math.max(0,now-flight.startedAt);
 const progress=duration===0?1:between(elapsed/duration,0,1);
 const t=easedProgress(progress);
 const point=key=>({
   x:lerp(flight.from[key].x,flight.to[key].x,t),
   y:lerp(flight.from[key].y,flight.to[key].y,t),
   z:lerp(flight.from[key].z,flight.to[key].z,t)
 });
 return {eye:point('eye'),focus:point('focus'),done:progress>=1,progress};
}

/** Scale the camera orbit; smaller scales zoom in and preserve per-mode bounds. */
export function zoomDistance(distance,scale,visitingWorld=false){
 const min=visitingWorld?14:50;
 const original=Number.isFinite(distance)?distance:HOME_ORBIT.distance;
 const scaled=original*scale;
 return between(Number.isFinite(scaled)?scaled:original,min,380);
}
