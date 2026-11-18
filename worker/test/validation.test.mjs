import test from 'node:test';import assert from 'node:assert/strict';
import {validate,parseIssue,issueBody} from '../src/validation.mjs';
const valid={type:'planeta',name:'Pythonia',alias:'Comandante Python',description:'Un planeta verde de tres lunas'};
test('permite creación válida',()=>assert.deepEqual(validate(valid),valid));
test('rechaza tipo arbitrario',()=>assert.throws(()=>validate({...valid,type:'script'})));
test('rechaza enlaces y correos',()=>assert.throws(()=>validate({...valid,description:'Un planeta https://ejemplo.com'})));
test('rechaza descripciones cortas',()=>assert.throws(()=>validate({...valid,description:'corto'})));
test('rechaza algunos términos ofensivos',()=>assert.throws(()=>validate({...valid,name:'Puto planeta'})));
test('permite round-trip de una Issue',()=>assert.deepEqual(parseIssue(issueBody(valid)),valid));
