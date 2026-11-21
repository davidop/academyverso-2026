import test from 'node:test';
import assert from 'node:assert/strict';
import {orderWorlds,worldPosition,homeCameraPose,cameraPoseForWorld,easedProgress,flightPose,zoomDistance} from '../travel.mjs';

const point=(x=0,y=0,z=0)=>({x,y,z});
test('stable world order preserves earlier objects when new Issues arrive',()=>{
 const a={issue_number:3,name:'Vice Nebula'},b={issue_number:8,name:'Centinela'},c={issue_number:12,name:'Nueva'};
 const initial=orderWorlds([b,a]);
 const extended=orderWorlds([c,b,a]);
 assert.deepEqual(initial.map(x=>x.issue_number),[3,8]);
 assert.deepEqual(extended.map(x=>x.issue_number),[3,8,12]);
 for(let i=0;i<initial.length;i++)assert.deepEqual(worldPosition(initial[i],i),worldPosition(extended[i],i));
});
test('200 world positions are finite and deterministic',()=>{
 for(let i=0;i<200;i++){
   const world={issue_number:i+1,name:`Planeta ${i}`};
   const pos=worldPosition(world,i);
   assert.deepEqual(pos,worldPosition(world,i));
   assert.ok(Object.values(pos).every(Number.isFinite));
 }
});
test('destination remains outside the object even with coincident source and target',()=>{
 const world=point(25,3,-11);
 const target=cameraPoseForWorld(world,world,6);
 assert.deepEqual(target.focus,world);
 assert.ok(Math.hypot(target.eye.x-world.x,target.eye.y-world.y,target.eye.z-world.z)>25);
 const normal=cameraPoseForWorld(world,point(0,20,190),6);
 assert.ok(Math.hypot(normal.eye.x-world.x,normal.eye.y-world.y,normal.eye.z-world.z)>25);
});
test('animated flight starts at the current view and ends exactly at its target',()=>{
 const from=homeCameraPose();
 const to=cameraPoseForWorld(point(40,-9,0),from.eye);
 const flight={from,to,startedAt:100,duration:2000};
 assert.deepEqual(flightPose(flight,100).eye,from.eye);
 assert.deepEqual(flightPose(flight,2100).eye,to.eye);
 assert.deepEqual(flightPose(flight,2100).focus,to.focus);
 assert.equal(flightPose(flight,2100).done,true);
 assert.equal(flightPose(flight,900).done,false);
 assert.ok(flightPose(flight,900).eye.x!==from.eye.x);
});
test('reduced motion jumps instantly and cancellation can start from current camera pose',()=>{
 const home=homeCameraPose();
 const destination=cameraPoseForWorld(point(30,1,2),home.eye);
 const instant=flightPose({from:home,to:destination,startedAt:100,duration:0},100);
 assert.equal(instant.done,true);
 assert.deepEqual(instant.eye,destination.eye);
 const outbound={from:home,to:destination,startedAt:100,duration:2000};
 const half=flightPose(outbound,1100);
 const back={from:half,to:home,startedAt:1100,duration:800};
 assert.deepEqual(flightPose(back,1100).eye,half.eye);
 assert.deepEqual(flightPose(back,1900).focus,home.focus);
 assert.deepEqual(flightPose(back,1900).eye,home.eye);
});
test('smooth interpolation clamps negative, excessive or NaN progress',()=>{
 assert.equal(easedProgress(-9),0);
 assert.equal(easedProgress(99),1);
 assert.equal(easedProgress(NaN),0);
 assert.ok(easedProgress(.5)===.5);
});

test('pinch zoom keeps independent galaxy and destination bounds',()=>{
 assert.equal(zoomDistance(190,.5,false),95);
 assert.equal(zoomDistance(190,2,false),380);
 assert.equal(zoomDistance(70,.01,false),50);
 assert.equal(zoomDistance(70,.01,true),14);
 assert.equal(zoomDistance(50,1.5,true),75);
 assert.equal(zoomDistance(50,Number.NaN,true),50);
 assert.equal(zoomDistance(Number.NaN,1,false),190);
});
