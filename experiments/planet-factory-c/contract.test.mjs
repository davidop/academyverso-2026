import test from 'node:test';
import assert from 'node:assert/strict';
import {brief,spec,review,hash} from './contract.mjs';
import {fallbackWorldSpec} from '../../web/worlds/spec.mjs';
test('brief accepts only bounded design or rejects closed',()=>{
 assert.equal(brief({decision:'accept',concept:'Oceans',requirements:['three moons']}).decision,'accept');
 assert.throws(()=>brief({decision:'reject',concept:'bad',requirements:[]}));
 assert.throws(()=>brief({decision:'accept',concept:'x',requirements:[],code:'eval()'}));
});
test('spec rejects unknown executable fields',()=>{
 const valid=fallbackWorldSpec({issue_number:1,type:'planeta',description:'tres lunas'});
 assert.doesNotThrow(()=>spec(valid));
 assert.throws(()=>spec({...valid,script:'alert(1)'}));
});
test('review must approve exact hash and contain no findings',()=>{
 const h=hash('candidate');
 assert.doesNotThrow(()=>review({decision:'approve',spec_sha256:h,findings:[]},h));
 assert.throws(()=>review({decision:'approve',spec_sha256:hash('different'),findings:[]},h));
 assert.throws(()=>review({decision:'reject',spec_sha256:h,findings:[]},h));
 assert.throws(()=>review({decision:'approve',spec_sha256:h,findings:['missing moon']},h));
});
