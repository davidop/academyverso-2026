// Pure POI helpers: no THREE, DOM or network. app.js passes already-resolved world positions.
import {POI_KINDS} from '../missions.mjs';

const kindRank=kind=>{const i=POI_KINDS.indexOf(kind);return i<0?POI_KINDS.length:i;};

/**
 * Turn raw POI entries ({poi:{kind,title,description}, position}) into a stable, labelled list.
 * Ordering follows POI_KINDS and then build order, so ids survive re-renders of the same world.
 */
export function listPois(entries=[]){
 const valid=entries.filter(e=>e&&e.poi&&POI_KINDS.includes(e.poi.kind));
 const totals={};
 for(const e of valid)totals[e.poi.kind]=(totals[e.poi.kind]||0)+1;
 const seen={};
 return valid
  .map((e,order)=>({e,order}))
  .sort((a,b)=>kindRank(a.e.poi.kind)-kindRank(b.e.poi.kind)||a.order-b.order)
  .map(({e})=>{
   const kind=e.poi.kind,n=seen[kind]=(seen[kind]||0)+1;
   const title=String(e.poi.title||kind);
   return {
    id:kind+':'+n,
    kind,
    title,
    label:totals[kind]>1?title+' '+n:title,
    description:String(e.poi.description||''),
    position:e.position
   };
  });
}

/** Camera pose that looks at a POI from outside its world, keeping the destination zoom bounds (>=14). */
export function cameraPoseForPoi(worldCenter,poiPoint,radius=6){
 const dx=poiPoint.x-worldCenter.x,dy=poiPoint.y-worldCenter.y,dz=poiPoint.z-worldCenter.z;
 const length=Math.hypot(dx,dy,dz);
 const n=length>0.001?{x:dx/length,y:dy/length,z:dz/length}:{x:0,y:1,z:0};
 const distance=Math.max(14,Number(radius)*2.6||0);
 return {
  eye:{x:poiPoint.x+n.x*distance,y:poiPoint.y+n.y*distance+2,z:poiPoint.z+n.z*distance},
  focus:{x:poiPoint.x,y:poiPoint.y,z:poiPoint.z}
 };
}
