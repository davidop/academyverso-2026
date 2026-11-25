// Regresión de #14: al reconstruir o eliminar un mundo se liberan todas sus
// geometrías, materiales y texturas, incluidas las partículas de nacimiento.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {buildWorld} from '../worlds/builder.mjs';
import {fallbackWorldSpec} from '../worlds/spec.mjs';
import {createBirthParticles} from '../worlds/birth.mjs';
import {disposeGroup} from '../worlds/dispose.mjs';

const types=['planeta','estrella','luna','agujero-negro','estacion','asteroide'];
const world=(type,i)=>({type,issue_number:i+1,name:'Ensayo '+type,description:'Océano con tres lunas, volcanes, cúpulas y anillos'});

// Every disposable resource in the group, deduplicated (builders may share materials).
function resources(group){
 const set=new Set();
 group.traverse(child=>{
  if(child.geometry)set.add(child.geometry);
  for(const material of [child.material].flat().filter(Boolean)){
   set.add(material);
   for(const value of Object.values(material))if(value?.isTexture)set.add(value);
  }
 });
 return [...set];
}
function track(items){
 const disposed=new Set();
 for(const item of items)item.addEventListener('dispose',()=>disposed.add(item));
 return disposed;
}

for(const quality of ['low','medium','high']){
 test('every archetype releases all GPU resources at '+quality+' quality',()=>{
  for(const [i,type] of types.entries()){
   const obj=world(type,i);
   const built=buildWorld(THREE,obj,fallbackWorldSpec(obj),null,quality);
   const scene=new THREE.Scene();scene.add(built.group);
   const items=resources(built.group);
   assert.ok(items.length>0,type+' must create resources');
   const disposed=track(items);
   disposeGroup(scene,built.group);
   assert.equal(built.group.parent,null,type+' must leave the scene');
   assert.equal(disposed.size,items.length,type+' leaked '+(items.length-disposed.size)+' of '+items.length+' resources');
  }
 });
}

test('a world still being born also releases its particles',()=>{
 const obj=world('planeta',0);
 const built=buildWorld(THREE,obj,fallbackWorldSpec(obj));
 const particles=createBirthParticles(THREE,built.size,42);
 built.group.add(particles);
 const scene=new THREE.Scene();scene.add(built.group);
 const disposed=track([particles.geometry,particles.material]);
 disposeGroup(scene,built.group);
 assert.equal(disposed.size,2);
});

test('textures and multi-material meshes are released',()=>{
 const texture=new THREE.Texture();
 const materials=[new THREE.MeshBasicMaterial({map:texture}),new THREE.MeshBasicMaterial()];
 const group=new THREE.Group();
 group.add(new THREE.Mesh(new THREE.BoxGeometry(),materials));
 const scene=new THREE.Scene();scene.add(group);
 const items=resources(group);
 assert.equal(items.length,4,'geometry, two materials and one texture');
 const disposed=track(items);
 disposeGroup(scene,group);
 assert.equal(disposed.size,4);
});

test('repeated rebuilds keep the scene and live resources bounded',()=>{
 const scene=new THREE.Scene(),obj=world('planeta',0),spec=fallbackWorldSpec(obj);
 const live=new Set();
 let current=null;
 for(const quality of ['high','low','medium','high','low','high','medium','low']){
  if(current)disposeGroup(scene,current.group);
  current=buildWorld(THREE,obj,spec,null,quality);
  scene.add(current.group);
  for(const item of resources(current.group)){
   live.add(item);
   item.addEventListener('dispose',()=>live.delete(item));
  }
 }
 assert.equal(scene.children.length,1,'only the current world remains in the scene');
 assert.equal(live.size,resources(current.group).length,'only the current world holds GPU resources');
});
