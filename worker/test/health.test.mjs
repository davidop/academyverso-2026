import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.mjs';

const request=()=>new Request('https://academyverso-api.example.workers.dev/api/health');
const makeEnv=(total)=>({
  DB:{prepare(sql){
    assert.match(sql,/sqlite_master/);
    return {async first(){return {total}}};
  }},
  GITHUB_REPO:'davidop/academyverso-2026',
  ALLOWED_ORIGIN:'https://davidop.github.io'
});
test('health returns 200 only when D1 schema is initialized',async()=>{
  const res=await worker.fetch(request(),makeEnv(2),{});
  assert.equal(res.status,200);
  const body=await res.json();
  assert.equal(body.ok,true);
  assert.equal(body.database_connected,true);
  assert.equal(body.create_enabled,false);
});
test('health returns 503 when D1 binding is missing',async()=>{
  const res=await worker.fetch(request(),{ALLOWED_ORIGIN:'https://davidop.github.io'},{});
  assert.equal(res.status,503);
  assert.equal((await res.json()).database_connected,false);
});
test('health returns 503 when D1 tables are missing',async()=>{
  const res=await worker.fetch(request(),makeEnv(1),{});
  assert.equal(res.status,503);
  assert.equal((await res.json()).ok,false);
});

test('creation returns a controlled unavailable response until GitHub token is configured',async()=>{
  const res=await worker.fetch(new Request('https://academyverso-api.example.workers.dev/api/create',{method:'POST',headers:{origin:'https://davidop.github.io','content-type':'application/json'},body:JSON.stringify({type:'estacion',alias:'davidop',name:'Thanos',description:'Una estacion espacial disparando cohetes'})}),makeEnv(2),{});
  assert.equal(res.status,503);
  assert.equal((await res.json()).code,'CREATE_NOT_READY');
});

test('ingest updates D1 for a previously closed Issue after an edit',async()=>{
  const secret='integration-test-secret';
  const incoming={action:'edited',issue:{number:3,state:'closed',html_url:'https://github.com/davidop/academyverso-2026/issues/3',body:'### Tipo de objeto\n\nestacion\n\n### Alias del explorador\n\nComandante Dev\n\n### Nombre del objeto\n\nNexus de los Tres Agentes\n\n### Descripción creativa\n\nEstación orbital de los tres agentes con anillos luminosos.'}};
  const raw=JSON.stringify(incoming);
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw)))).map(x=>x.toString(16).padStart(2,'0')).join('');
  let writes=0;
  const env={GITHUB_REPO:'davidop/academyverso-2026',INGEST_SECRET:secret,DB:{prepare(sql){
    assert.match(sql,/INSERT INTO objects/);
    return {bind(...values){assert.equal(values[0],3);return {async run(){writes++;return {success:true}}}}};
  }}};
  const req=new Request('https://academyverso-api.example.workers.dev/api/ingest',{method:'POST',headers:{'content-type':'application/json','x-academyverso-signature':'sha256='+sig},body:raw});
  const res=await worker.fetch(req,env,{waitUntil(){}});
  assert.equal(res.status,200);
  assert.equal((await res.json()).issue_number,3);
  assert.equal(writes,1);
});


const signIngest=async(incoming,secret)=>{
 const raw=JSON.stringify(incoming);
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 return new Request('https://academyverso-api.example.workers.dev/api/ingest',{method:'POST',headers:{'content-type':'application/json','x-academyverso-signature':'sha256='+sig},body:raw});
};
const triageIncoming=(login,commentDescription,bodyDescription)=>({
 action:'labeled',
 issue:{number:9,state:'open',html_url:'https://github.com/davidop/academyverso-2026/issues/9',body:'### Tipo de objeto\n\nplaneta\n\n### Alias del explorador\n\nComandante Python\n\n### Nombre del objeto\n\nPythonia\n\n### Descripción creativa\n\n'+bodyDescription+'\n\n---\nCreado desde el formulario AcademyVerso.\n\n[academyverso-triage:ready:v1]'},
 triage_comment:{id:1,created_at:'2026-11-25T00:00:00Z',user:{login},body:'### Lo que hemos entendido\n\nUn planeta verde.\n\n### Descripción que aparecerá en el planeta\n\n'+commentDescription+'\n\n[academyverso-triage:ready:v1]'}
});
const ingestEnv=(secret,bot, captured)=>({GITHUB_REPO:'davidop/academyverso-2026',INGEST_SECRET:secret,...(bot?{TRIAGE_BOT:bot}:{}),DB:{prepare(sql){
 assert.match(sql,/INSERT INTO objects/);
 return {bind(...values){captured.push(values);return {async run(){return {success:true}}}}};
}}});

test('ingest publishes the description from the trusted triage comment, not the issue body',async()=>{
 const captured=[];
 const env=ingestEnv('integration-test-secret','academyverso-triage[bot]',captured);
 const req=await signIngest(triageIncoming('academyverso-triage[bot]','Un planeta verde de tres lunas','Un planeta azul sin lunas que no debe publicarse'),'integration-test-secret');
 const res=await worker.fetch(req,env,{waitUntil(){}});
 assert.equal(res.status,200);
 assert.equal((await res.json()).issue_number,9);
 assert.equal(captured.length,1);
 assert.equal(captured[0][4],'Un planeta verde de tres lunas');
 assert.equal(captured[0][2],'Pythonia');
});
test('ingest accepts the escaped marker that gh-aw safe outputs actually post',async()=>{
 const captured=[];
 const env=ingestEnv('integration-test-secret','academyverso-triage[bot]',captured);
 const incoming=triageIncoming('academyverso-triage[bot]','\\[GTA:VICE-NEBULA\\] Un planeta verde de tres lunas','Un planeta azul sin lunas');
 incoming.issue.body=incoming.issue.body.replace('[academyverso-triage:ready:v1]','\\[academyverso-triage:ready:v1\\]');
 incoming.triage_comment.body=incoming.triage_comment.body.replace('[academyverso-triage:ready:v1]','\\[academyverso-triage:ready:v1\\]');
 const res=await worker.fetch(await signIngest(incoming,'integration-test-secret'),env,{waitUntil(){}});
 assert.equal(res.status,200);
 assert.equal(captured[0][4],'[GTA:VICE-NEBULA] Un planeta verde de tres lunas');
});
test('ingest rejects a triage comment from an unconfigured or mismatched bot',async()=>{
 for(const [bot,login] of [['academyverso-triage[bot]','impostor[bot]'],[undefined,'academyverso-triage[bot]']]){
  const captured=[];
  const env=ingestEnv('integration-test-secret',bot,captured);
  const req=await signIngest(triageIncoming(login,'Un planeta verde de tres lunas','Un planeta azul sin lunas'),'integration-test-secret');
  const res=await worker.fetch(req,env,{waitUntil(){}});
  assert.equal(res.status,400);
  assert.equal((await res.json()).error,'Texto de triage no verificado');
  assert.equal(captured.length,0);
 }
});

test('WorldGen health only announces enabled when schema migration is present',async()=>{
 const env={WORLDGEN_ENABLED:'true',DB:{prepare(sql){
  if(sql.includes("name IN ('objects','rates')"))return {async first(){return {total:2}}};
  if(sql.includes("name='world_revisions'"))return {async first(){return {total:1}}};
  if(sql.includes('PRAGMA table_info'))return {async all(){return {results:['world_spec','world_status','world_version','world_owner_token_hash'].map(name=>({name}))}}};
  throw Error('unexpected SQL '+sql);
 }}};
 const response=await worker.fetch(request(),env,{});
 assert.equal(response.status,200);
 assert.equal((await response.json()).worldgen_enabled,true);
});
test('WorldGen query failure does not break legacy object listing',async()=>{
 let queries=0;
 const env={WORLDGEN_ENABLED:'true',DB:{prepare(sql){return {async all(){
  queries++;
  if(sql.includes('world_spec'))throw Error('no migration yet');
  return {results:[{issue_number:10,name:'Legacy',type:'planeta'}]};
 }}}}};
 const response=await worker.fetch(new Request('https://api.example.com/api/objects'),env,{});
 assert.equal(response.status,200);
 assert.equal((await response.json()).objects[0].name,'Legacy');
 assert.equal(queries,2);
});
