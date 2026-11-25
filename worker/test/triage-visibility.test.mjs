// El formulario web no publica nada hasta que el triage lo aprueba (#67).
// Recorre /api/create → /api/objects → /api/ingest contra una SQLite real.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker from '../src/index.mjs';
import {issueBody} from '../src/validation.mjs';

const root=new URL('../',import.meta.url);
const API='https://academyverso-api.example.workers.dev';
const SECRET='integration-test-secret';
const BOT='academyverso-triage[bot]';
const ESCAPED_MARKER='\\[academyverso-triage:ready:v1\\]';

function d1(db){
 const statement=(sql,params=[])=>({
  async run(){const r=db.prepare(sql).run(...params);return {meta:{changes:Number(r.changes)}}},
  async first(){return db.prepare(sql).get(...params)??null},
  async all(){return {results:db.prepare(sql).all(...params)}}
 });
 return {prepare(sql){return {...statement(sql),bind(...params){return statement(sql,params)}}}};
}
function setup(){
 const db=new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('schema.sql',root),'utf8'));
 for(const file of readdirSync(new URL('migrations/',root)).filter(f=>f.endsWith('.sql')).sort())
  db.exec(readFileSync(new URL('migrations/'+file,root),'utf8'));
 return {db,env:{GITHUB_REPO:'davidop/academyverso-2026',GITHUB_TOKEN:'not-a-real-token',ALLOWED_ORIGIN:'https://davidop.github.io',INGEST_SECRET:SECRET,TRIAGE_BOT:BOT,DB:d1(db)}};
}
const ctx={waitUntil(){}};
const proposal={type:'planeta',alias:'Comandante Python',name:'Pythonia',description:'Un planeta verde de tres lunas'};

async function create(env,number){
 const realFetch=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({number,html_url:`https://github.com/davidop/academyverso-2026/issues/${number}`}),{status:201});
 try{
  const res=await worker.fetch(new Request(API+'/api/create',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'203.0.113.'+number},body:JSON.stringify(proposal)}),env,ctx);
  return {status:res.status,body:await res.json()};
 }finally{globalThis.fetch=realFetch}
}
async function visible(env){
 const res=await worker.fetch(new Request(API+'/api/objects'),env,ctx);
 return (await res.json()).objects;
}
async function ingest(env,number,{triaged=true,description='Un planeta verde de tres lunas revisado por el agente'}={}){
 const incoming={action:'labeled',issue:{number,state:'open',html_url:`https://github.com/davidop/academyverso-2026/issues/${number}`,body:issueBody(proposal)+'\n\n'+ESCAPED_MARKER}};
 if(triaged)incoming.triage_comment={id:1,created_at:'2026-11-25T00:00:00Z',user:{login:BOT},body:`### Lo que hemos entendido\n\nUn planeta verde.\n\n### Descripción que aparecerá en el planeta\n\n${description}\n\n${ESCAPED_MARKER}`};
 const raw=JSON.stringify(incoming);
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw))),b=>b.toString(16).padStart(2,'0')).join('');
 const res=await worker.fetch(new Request(API+'/api/ingest',{method:'POST',headers:{'content-type':'application/json','x-academyverso-signature':'sha256='+sig},body:raw}),env,ctx);
 return res.status;
}

test('el formulario web guarda la propuesta oculta y avisa de que espera al triage',async()=>{
 const {db,env}=setup();
 const created=await create(env,101);
 assert.equal(created.status,201);
 assert.equal(created.body.issue_number,101);
 assert.equal(created.body.pending_triage,true);
 assert.equal(db.prepare('SELECT hidden FROM objects WHERE issue_number=101').get().hidden,1);
 assert.deepEqual((await visible(env)).map(o=>o.issue_number),[]);
});

test('la ingesta con triage verificado publica la propuesta del formulario con el texto del agente',async()=>{
 const {env}=setup();
 await create(env,102);
 assert.equal(await ingest(env,102),200);
 const objects=await visible(env);
 assert.deepEqual(objects.map(o=>o.issue_number),[102]);
 assert.equal(objects[0].description,'Un planeta verde de tres lunas revisado por el agente');
});

test('una propuesta rechazada por el triage nunca llega al universo',async()=>{
 const {env}=setup();
 await create(env,103);
 // planet:rejected no dispara la ingesta: no hay más llamadas.
 assert.deepEqual((await visible(env)).map(o=>o.issue_number),[]);
});

test('un comentario de triage de otro autor no publica la propuesta oculta',async()=>{
 const {env}=setup();
 await create(env,104);
 env.TRIAGE_BOT='otra-app[bot]';
 assert.equal(await ingest(env,104),400);
 assert.deepEqual((await visible(env)).map(o=>o.issue_number),[]);
});

test('la ruta legacy sin comentario de triage no destapa una propuesta pendiente',async()=>{
 const {env}=setup();
 await create(env,105);
 assert.equal(await ingest(env,105,{triaged:false}),200);
 assert.deepEqual((await visible(env)).map(o=>o.issue_number),[]);
});

test('una Issue creada desde GitHub y aprobada por el triage se publica sin pasar por el formulario',async()=>{
 const {env}=setup();
 assert.equal(await ingest(env,106),200);
 assert.deepEqual((await visible(env)).map(o=>o.issue_number),[106]);
});
