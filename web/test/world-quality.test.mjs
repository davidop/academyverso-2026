import test from 'node:test';
import assert from 'node:assert/strict';
import {initialQuality,adaptiveQuality,pixelRatioFor} from '../worlds/quality.mjs';
test('quality adapts to hardware while respecting pixel ratio cap',()=>{
 assert.equal(initialQuality(2,3),'low');
 assert.equal(initialQuality(8,2),'medium');
 assert.equal(initialQuality(12,1),'high');
 assert.equal(pixelRatioFor('low',3),1);
 assert.equal(pixelRatioFor('medium',3),1.4);
});
test('quality only moves by one step and does not oscillate midrange',()=>{
 assert.equal(adaptiveQuality('high',20),'medium');
 assert.equal(adaptiveQuality('medium',20),'low');
 assert.equal(adaptiveQuality('low',90),'medium');
 assert.equal(adaptiveQuality('medium',40),'medium');
 assert.equal(adaptiveQuality('low',0),'low');
});
