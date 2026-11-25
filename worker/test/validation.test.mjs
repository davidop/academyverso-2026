import test from 'node:test';import assert from 'node:assert/strict';
import {validate,parseIssue,parseTriagedIssue,parseTriageComment,issueBody,TRIAGE_MARKER} from '../src/validation.mjs';
const valid={type:'planeta',name:'Pythonia',alias:'Comandante Python',description:'Un planeta verde de tres lunas'};
const triageComment=(description,marker=TRIAGE_MARKER)=>`### Lo que hemos entendido\n\nUn planeta verde con tres lunas.\n\n### Descripción que aparecerá en el planeta\n\n${description}\n\n${marker}`.trimEnd();
const triagedBody=(overrides={})=>issueBody({...valid,...overrides})+'\n\n'+TRIAGE_MARKER;
test('permite creación válida',()=>assert.deepEqual(validate(valid),valid));
test('rechaza tipo arbitrario',()=>assert.throws(()=>validate({...valid,type:'script'})));
test('rechaza enlaces y correos',()=>assert.throws(()=>validate({...valid,description:'Un planeta https://ejemplo.com'})));
test('rechaza descripciones cortas',()=>assert.throws(()=>validate({...valid,description:'corto'})));
test('rechaza algunos términos ofensivos',()=>assert.throws(()=>validate({...valid,name:'Puto planeta'})));
test('permite round-trip de una Issue',()=>assert.deepEqual(parseIssue(issueBody(valid)),valid));
test('conserva la descripción multilinea del formulario al ingerirla',()=>{
 const body=issueBody({...valid,description:'Un planeta verde\ncon tres lunas visibles'})+'\n\n[academyverso-triage:ready:v1]';
 assert.equal(parseIssue(body).description,'Un planeta verde con tres lunas visibles');
});
test('la descripción publicada viene del comentario de triage, no del cuerpo',()=>{
 const body=triagedBody({description:'Un planeta azul sin lunas que no debe publicarse'});
 assert.deepEqual(parseTriagedIssue(body,triageComment('Un planeta verde de tres lunas')),valid);
});
test('tipo, alias y nombre se siguen leyendo del cuerpo de la Issue',()=>{
 const body=triagedBody({name:'Pythonia II',alias:'Exploradora Ada',type:'luna'});
 const result=parseTriagedIssue(body,triageComment('Un planeta verde de tres lunas'));
 assert.equal(result.type,'luna');
 assert.equal(result.name,'Pythonia II');
 assert.equal(result.alias,'Exploradora Ada');
 assert.equal(result.description,'Un planeta verde de tres lunas');
});
test('preserva los markers GTA al inicio de la descripción del comentario',()=>{
 for(const marker of ['[GTA:VICE-NEBULA]','[GTA:COLONIA-CENTINELA]']){
  const description=`${marker} Un planeta verde de tres lunas`;
  const result=parseTriagedIssue(triagedBody(),triageComment(description));
  assert.ok(result.description.startsWith(marker),result.description);
  assert.equal(result.description,description);
 }
});
test('rechaza un comentario de triage sin marcador visible',()=>{
 assert.throws(()=>parseTriagedIssue(triagedBody(),triageComment('Un planeta verde de tres lunas','')),/Texto/);
 assert.throws(()=>parseTriageComment('### Descripción que aparecerá en el planeta\n\nUn planeta verde de tres lunas'),/Texto/);
});
test('rechaza un comentario de triage sin sección de descripción',()=>{
 assert.throws(()=>parseTriageComment(`### Lo que hemos entendido\n\nAlgo breve.\n\n${TRIAGE_MARKER}`),/Texto/);
 assert.throws(()=>parseTriageComment(`### Descripción que aparecerá en el planeta\n\n${TRIAGE_MARKER}`),/Texto/);
});
test('aplica longitudes y saneamiento a la descripción del comentario',()=>{
 assert.throws(()=>parseTriagedIssue(triagedBody(),triageComment('corto')),/description:/);
 assert.throws(()=>parseTriagedIssue(triagedBody(),triageComment('Un planeta https://ejemplo.com')),/Texto/);
 assert.throws(()=>parseTriagedIssue(triagedBody(),triageComment('Un planeta '+'x'.repeat(280))),/description:/);
 const result=parseTriagedIssue(triagedBody(),triageComment('Un planeta verde\ncon tres lunas visibles'));
 assert.equal(result.description,'Un planeta verde con tres lunas visibles');
});
