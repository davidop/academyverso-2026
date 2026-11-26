// Importar run.mjs también comprueba que sus imports (web/worlds/spec.mjs) resuelven.
import test from 'node:test';
import assert from 'node:assert/strict';
import {parseModelJson,checkBrief,checkReview,reviewInput,digest,CLI_FLAGS} from './run.mjs';

test('acepta JSON envuelto en ```json y nombra la fase cuando no es JSON',()=>{
 assert.deepEqual(parseModelJson('interpret','```json\n{"a":1}\n```'),{a:1});
 assert.deepEqual(parseModelJson('interpret','  {"a":1}\n'),{a:1});
 assert.throws(()=>parseModelJson('generate','Aquí tienes el spec: {'),/generate returned invalid JSON/);
});
test('las compuertas rechazan null, arrays y valores que no son objeto con su propio mensaje',()=>{
 for(const v of [null,[],'texto',42]){
  assert.throws(()=>checkBrief(v),/Brief gate failed/);
  assert.throws(()=>checkReview(v,'x'),/Review gate failed/);
 }
 assert.ok(checkBrief({decision:'accept',concept:'Planeta violeta',requirements:['tres lunas']}));
});
test('el revisor recibe el texto exacto y su hash con el nombre de campo que debe devolver',()=>{
 const text='{\n  "a": 1\n}\n',input=reviewInput({id:'f'},{concept:'c'},text);
 assert.equal(input.candidate_json,text);
 assert.equal(input.spec_sha256,digest(text));
 assert.ok(checkReview({decision:'approve',spec_sha256:input.spec_sha256,findings:[]},input.spec_sha256));
 assert.throws(()=>checkReview({decision:'approve',spec_sha256:digest('{"a":1}'),findings:[]},input.spec_sha256),/Review gate failed/);
 assert.throws(()=>checkReview({decision:'approve',spec_sha256:input.spec_sha256,findings:['falta una luna']},input.spec_sha256));
});
test('el CLI corre sin preguntas, sin MCP integrados y sin shell, escritura, lectura ni URLs',()=>{
 for(const f of ['--no-ask-user','--silent','--disable-builtin-mcps'])assert.ok(CLI_FLAGS.includes(f),f);
 const denied=CLI_FLAGS.filter((f,i)=>CLI_FLAGS[i-1]==='--deny-tool');
 assert.deepEqual(denied.sort(),['read','shell','url','write']);
});
