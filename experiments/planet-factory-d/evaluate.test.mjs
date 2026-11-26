import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluate} from './evaluate.mjs';
import {fallbackWorldSpec} from '../../web/worlds/spec.mjs';
const spec=fallbackWorldSpec({issue_number:1,type:'planeta',description:'Planeta oceánico violeta con tres lunas'});
const complete=()=>({status:'complete',stage:null,brief:{decision:'accept',concept:'Planeta violeta',requirements:['tres lunas']},spec,review:{decision:'approve',findings:[]}});

test('un bundle completo, aprobado sin hallazgos y con spec válido pasa',()=>assert.match(evaluate(complete()),/accepted/));
test('un rechazo deja rastro: se informa la fase y los hallazgos del revisor',()=>{
 assert.throws(()=>evaluate({status:'rejected',stage:'reviewer',brief:complete().brief,spec,review:{decision:'reject',findings:['falta la ciudad flotante']}}),/rejected at reviewer: falta la ciudad flotante/);
 assert.throws(()=>evaluate({status:'failed',stage:'builder',brief:complete().brief,spec:null,review:null}),/failed at builder/);
 assert.throws(()=>evaluate({status:'rejected',stage:'otro'}),/invalid status or stage/);
});
test('aprobar con hallazgos no cuenta como acierto',()=>{
 const x=complete();x.review.findings=['paleta aproximada'];
 assert.throws(()=>evaluate(x),/without findings/);
});
test('entradas null, arrays o sin estado fallan con un mensaje claro',()=>{
 for(const v of [null,[],'x'])assert.throws(()=>evaluate(v),/not a JSON object/);
 assert.throws(()=>evaluate({brief:{}}),/invalid status/);
 const x=complete();x.stage='reviewer';assert.throws(()=>evaluate(x),/must not name a stage/);
});
test('un spec inválido o que excede el presupuesto no pasa',()=>{
 const x=complete();x.spec={...spec,script:'alert(1)'};assert.throws(()=>evaluate(x));
});
