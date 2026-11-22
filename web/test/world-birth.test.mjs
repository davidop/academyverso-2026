import test from 'node:test';
import assert from 'node:assert/strict';
import {birthProgress,birthScale} from '../worlds/birth.mjs';
test('birth motion is monotonic, capped and ends at full scale',()=>{
 assert.equal(birthProgress(-100),0);
 assert.equal(birthProgress(1250),1);
 assert.equal(birthProgress(99999),1);
 assert.equal(birthScale(1250),1);
 let last=0;
 for(let ms=0;ms<=1250;ms+=25){const v=birthProgress(ms);assert.ok(v>=last);last=v;}
});
