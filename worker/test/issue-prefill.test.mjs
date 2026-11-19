import test from 'node:test';
import assert from 'node:assert/strict';
import {issueDraftUrl} from '../../web/issue-prefill.mjs';
test('prellena formulario de Issue para un objeto cósmico',()=>{
  const url=new URL(issueDraftUrl({type:'estacion',name:'Thanos',alias:'davidop',description:'Una estación espacial disparando cohetes'}));
  assert.equal(url.origin,'https://github.com');
  assert.equal(url.pathname,'/davidop/academyverso-2026/issues/new');
  assert.equal(url.searchParams.get('template'),'crear-objeto.yml');
  assert.equal(url.searchParams.get('tipo'),'estacion');
  assert.equal(url.searchParams.get('alias'),'davidop');
  assert.equal(url.searchParams.get('nombre'),'Thanos');
  assert.equal(url.searchParams.get('descripcion'),'Una estación espacial disparando cohetes');
});
test('acentos y caracteres especiales se codifican y recuperan',()=>{
  const url=new URL(issueDraftUrl({type:'planeta',name:'Neón-42',alias:'Comandante Pixel',description:'Órbitas y tres lunas con luz de color azul & rosa'}));
  assert.equal(url.searchParams.get('nombre'),'Neón-42');
  assert.equal(url.searchParams.get('descripcion'),'Órbitas y tres lunas con luz de color azul & rosa');
});
test('rechaza tipos inválidos',()=>assert.throws(()=>issueDraftUrl({type:'script',name:'Thanos',alias:'David',description:'Una descripción válida'})));
