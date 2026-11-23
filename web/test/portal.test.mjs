import test from 'node:test';
import assert from 'node:assert/strict';
import {portalChoices,selectPortalPair,portalFlightPose,portalColor} from '../portal.mjs';
const p=(x=0)=>({eye:{x,y:6,z:12},focus:{x,y:0,z:0}});
const w=(id,name='Mundo '+id)=>({issue_number:id,name,type:'planeta'});
test('only real distinct well-formed object IDs can be portal destinations',()=>{
 const list=portalChoices([w(7),w(5),w(5,'Duplicado'),w(0),w(-1),{issue_number:9,name:''},w(8)]);
 assert.deepEqual(list.map(x=>x.issue_number),[5,7,8]);
 assert.equal(selectPortalPair([w(7)]),null);
 assert.equal(selectPortalPair([]),null);
});
test('pair selects two distinct worlds and preserves user choices on polling',()=>{
 const objects=[w(10),w(11),w(12)];
 assert.deepEqual([selectPortalPair(objects,{source:'12',target:'10'}).source.issue_number,selectPortalPair(objects,{source:'12',target:'10'}).target.issue_number],[12,10]);
 const distinct=selectPortalPair(objects,{source:'10',target:'10'});
 assert.notEqual(distinct.source.issue_number,distinct.target.issue_number);
 const stale=selectPortalPair([w(10),w(12)],{source:'11',target:'12'});
 assert.equal(stale.source.issue_number,10);assert.equal(stale.target.issue_number,12);
});
test('portal route starts exactly at current camera and arrives at chosen world',()=>{
 const flight={from:p(0),entry:p(15),exit:p(80),to:p(90),startedAt:100,duration:3000};
 const start=portalFlightPose(flight,100);
 assert.deepEqual(start.eye,flight.from.eye);
 const cross=portalFlightPose(flight,1600);
 assert.equal(cross.stage,'crossing');
 assert.ok(cross.eye.x>15&&cross.eye.x<80);
 const finish=portalFlightPose(flight,3100);
 assert.deepEqual(finish.eye,flight.to.eye);assert.equal(finish.done,true);
 assert.equal(portalFlightPose(flight,99).stage,'approach');
 assert.equal(portalFlightPose(flight,99999).done,true);
});
test('reduced motion is instantaneous and deterministic',()=>{
 const flight={from:p(0),entry:p(10),exit:p(20),to:p(30),startedAt:100,duration:0};
 assert.deepEqual(portalFlightPose(flight,100).eye,flight.to.eye);
 assert.equal(portalFlightPose(flight,100).stage,'arrived');
 assert.equal(portalColor(10),portalColor(10));
});
