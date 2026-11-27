import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {buildWorld} from '../worlds/builder.mjs';
import {fallbackWorldSpec,resolvedWorldSpec} from '../worlds/spec.mjs';
import {advanceWorldMotion} from '../worlds/animation.mjs';

const cases=[
 ['planeta','Planeta océano con tres lunas, dos ciudades flotantes, volcanes y cúpulas'],
 ['estrella','Estrella azul enorme y luminosa'],
 ['luna','Luna rocosa con cráteres de impacto'],
 ['agujero-negro','Agujero negro con anillos luminosos'],
 ['estacion','Estación espacial con paneles solares, antenas y drones'],
 ['asteroide','Asteroide irregular de hielo y roca']
];
const object=(type,description,index=1)=>({type,name:'Ensayo '+type,issue_number:index,description});
const stats=(group)=>{
 const stats={meshes:0,triangles:0,points:0};
 group.traverse(x=>{
  if(x.isMesh){
   stats.meshes++;
   const geometry=x.geometry;
   if(geometry.index)stats.triangles+=geometry.index.count/3;
   else stats.triangles+=geometry.getAttribute('position')?.count/3||0;
  }
  if(x.isPoints)stats.points+=x.geometry.getAttribute('position')?.count||0;
 });
 return stats;
};
test('all six archetypes produce independent nonempty selectable Three.js scenes',()=>{
 const snapshots=[];
 for(const [i,[type,description]] of cases.entries()){
  const world=object(type,description,i+1);
  const spec=fallbackWorldSpec(world);
  const scene=buildWorld(THREE,world,spec);
  assert.ok(scene.group instanceof THREE.Group);
  assert.ok(scene.size>=3);
  assert.ok(scene.clickables.length>=1);
  assert.ok(scene.clickables.every(mesh=>mesh.isMesh));
  snapshots.push({type,...stats(scene.group)});
 }
 assert.ok(new Set(snapshots.map(s=>s.meshes+'-'+Math.round(s.triangles))).size>=5);
});
test('description creates selectable cities, volcanoes and domes, not just recolored spheres',()=>{
 const o=object('planeta','Planeta con ciudades flotantes, volcanes, cúpulas y tres lunas',25);
 const {group,clickables}=buildWorld(THREE,o,fallbackWorldSpec(o));
 const kinds=new Set(clickables.map(m=>m.userData.poi?.kind).filter(Boolean));
 assert.deepEqual([...kinds].sort(),['dome','floating_city','volcano']);
 assert.ok(stats(group).meshes>10);
});
test('low quality cuts triangle budget without hiding essential POIs',()=>{
 const o=object('planeta','Planeta oceánico con una ciudad flotante',15),spec=fallbackWorldSpec(o);
 const low=buildWorld(THREE,o,spec,null,'low');
 const high=buildWorld(THREE,o,spec,null,'high');
 assert.ok(stats(low.group).triangles<stats(high.group).triangles);
 assert.deepEqual(new Set(low.clickables.map(x=>x.userData.poi?.kind).filter(Boolean)),new Set(high.clickables.map(x=>x.userData.poi?.kind).filter(Boolean)));
});

test('persisted factory WorldSpec drives actual geometry instead of description heuristics',()=>{
 const o=object('planeta','Un planeta tranquilo sin detalles',81);
 const stored={...fallbackWorldSpec(o),features:[{kind:'floating_city',count:1},{kind:'moon',count:3}],palette:{primary:'#123456',secondary:'#FABC12',emissive:'#654321'}};
 const persisted={...o,world_spec:JSON.stringify(stored),world_status:'ready',world_version:1};
 const resolved=resolvedWorldSpec(persisted);assert.equal(resolved.source,'persisted');assert.deepEqual(resolved.spec,stored);
 const actual=buildWorld(THREE,persisted,resolved.spec),legacy=buildWorld(THREE,o,fallbackWorldSpec(o));
 assert.ok(actual.clickables.some(x=>x.userData.poi?.kind==='floating_city'));
 assert.ok(!legacy.clickables.some(x=>x.userData.poi?.kind==='floating_city'));
 assert.ok(stats(actual.group).meshes>stats(legacy.group).meshes);
});

test('a dawn ring spec renders an additional golden halo around the ring',()=>{
 const o=object('planeta','Planeta oceánico con un anillo dorado que brilla al amanecer',130);
 const spec=fallbackWorldSpec(o),ring=spec.features.find(f=>f.kind==='ring');
 assert.equal(ring.glow,'dawn');
 const {group}=buildWorld(THREE,o,spec);
 const rings=[];group.traverse(x=>{if(x.isMesh&&x.geometry.type==='TorusGeometry')rings.push(x)});
 assert.equal(rings.length,2);
 assert.ok(rings.some(x=>x.material.opacity>.5&&x.material.color.getHexString()==='d4af37'));
 assert.ok(rings.some(x=>x.material.opacity<.4&&x.material.color.getHexString()==='ffcc66'));
});

test('issue 131 keeps its requested ocean, moon and ring while the declared animation reaches the renderer',()=>{
 const o=object('planeta','Planeta oceánico con una luna plateada y un anillo dorado',131);
 const spec=fallbackWorldSpec(o),features=new Set(spec.features.map(f=>f.kind));
 assert.ok(features.has('ocean'));
 assert.ok(features.has('moon'));
 assert.ok(features.has('ring'));
 assert.equal(spec.features.find(f=>f.kind==='ring').finish,'gold');
 assert.equal(spec.animation,'static');
 const {group,clickables}=buildWorld(THREE,o,spec);
 assert.equal(group.userData.animation,spec.animation);
 const ring=[];group.traverse(x=>{if(x.isMesh&&x.geometry.type==='TorusGeometry')ring.push(x)});
 assert.equal(ring.length,1);
 assert.equal(ring[0].material.color.getHexString(),'d4af37');
 assert.equal(clickables.length,2);
});

test('slow-orbit animates and static WorldSpec remains still',()=>{
 const spinning={group:{rotation:{y:0},position:{y:0}},animation:'slow-orbit',baseY:3,phase:0};
 advanceWorldMotion(spinning,0);
 assert.equal(spinning.group.rotation.y,.0025);
 assert.equal(spinning.group.position.y,3);

 const still={group:{rotation:{y:0},position:{y:3}},animation:'static',baseY:3,phase:0};
 advanceWorldMotion(still,500);
 assert.equal(still.group.rotation.y,0);
 assert.equal(still.group.position.y,3);
});
