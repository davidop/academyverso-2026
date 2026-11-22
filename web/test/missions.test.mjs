import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceMission,emptyMissionState,missionProgress} from '../missions.mjs';
test('progress only advances for mission worlds actually reached',()=>{
 const original=emptyMissionState();
 assert.equal(missionProgress(advanceMission(original,{kind:'poi-discovered',mission:'vice-nebula',poi:'volcano'})).stars,0);
 assert.equal(missionProgress(advanceMission(original,{kind:'world-reached',mission:'random-planet'})).stars,0);
 const first=advanceMission(original,{kind:'world-reached',mission:'vice-nebula'});
 assert.equal(missionProgress(first).stars,1);
 assert.deepEqual(advanceMission(first,{kind:'world-reached',mission:'vice-nebula'}),first);
 const second=advanceMission(first,{kind:'world-reached',mission:'colonia-centinela'});
 assert.equal(missionProgress(second).stars,2);
});
test('POI discovery is idempotent and cannot count invented or repeated structures',()=>{
 let state=advanceMission(emptyMissionState(),{kind:'world-reached',mission:'vice-nebula'});
 const event={kind:'poi-discovered',mission:'vice-nebula',poi:'floating_city'};
 state=advanceMission(state,event);assert.equal(missionProgress(state).stars,2);
 state=advanceMission(state,event);assert.equal(missionProgress(state).stars,2);
 state=advanceMission(state,{kind:'poi-discovered',mission:'vice-nebula',poi:'fake-star'});assert.equal(missionProgress(state).stars,2);
});
test('five stars requires two destinations and three genuine distinct discoveries',()=>{
 let state=emptyMissionState();
 for(const mission of ['vice-nebula','colonia-centinela'])state=advanceMission(state,{kind:'world-reached',mission});
 for(const poi of ['floating_city','volcano','dome'])state=advanceMission(state,{kind:'poi-discovered',mission:'vice-nebula',poi});
 assert.deepEqual(missionProgress(state),{stars:5,visited:2,points:3,complete:true});
 assert.equal(missionProgress(emptyMissionState()).stars,0);
});
