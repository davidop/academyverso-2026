import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {buildWorld} from '../worlds/builder.mjs';
import {fallbackWorldSpec} from '../worlds/spec.mjs';

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
