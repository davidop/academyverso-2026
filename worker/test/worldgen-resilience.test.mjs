// Resiliencia de WorldGen (#13): timeout, 429/5xx, respuestas inválidas, límite
// diario y condiciones de carrera. Ejecuta el SQL real del servicio contra una
// SQLite en memoria con schema.sql y las migraciones aditivas de D1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {fallbackWorldSpec} from '../../web/worlds/spec.mjs';
import {requestWorldSpec} from '../src/worldgen/foundry.mjs';
import {generateWorldForIssue} from '../src/worldgen/service.mjs';
import {reserveFoundryCall} from '../src/worldgen/budget.mjs';

const root=new URL('../',import.meta.url);
const foundry={
 FOUNDRY_ENDPOINT:'https://sample.openai.azure.com/openai/v1/chat/completions',
 FOUNDRY_DEPLOYMENT:'test-model',
 FOUNDRY_API_KEY:'not-a-real-key'
};
const planet={type:'planeta',name:'Nebula',description:'Un océano con dos lunas'};

// Adaptador mínimo con la forma de D1 (prepare → bind → run/first). Cada llamada
// es asíncrona, así que dos generaciones concurrentes se intercalan como en el Worker.
function d1(db){
 return {prepare(sql){return {bind(...params){return {
  async run(){const r=db.prepare(sql).run(...params);return {meta:{changes:Number(r.changes)}}},
  async first(){return db.prepare(sql).get(...params)??null}
 }}}}};
}
function database(){
 const db=new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('schema.sql',root),'utf8'));
 for(const file of readdirSync(new URL('migrations/',root)).filter(f=>f.endsWith('.sql')).sort()){
  db.exec(readFileSync(new URL('migrations/'+file,root),'utf8'));
 }
 return db;
}
function insertObject(db,issue,data=planet){
 db.prepare("INSERT INTO objects(issue_number,type,name,alias,description,issue_url,created_at) VALUES(?,?,?,?,?,?,datetime('now'))")
  .run(issue,data.type,data.name,'QA',data.description,'https://github.com/davidop/academyverso-2026/issues/'+issue);
}
function setup(extra={}){
 const db=database();
 const env={...foundry,WORLDGEN_ENABLED:'true',DB:d1(db),...extra};
 return {db,env};
}
const row=(db,issue)=>db.prepare('SELECT world_status,world_version,world_spec FROM objects WHERE issue_number=?').get(issue);
const revisions=(db,issue)=>db.prepare('SELECT version,world_status FROM world_revisions WHERE issue_number=? ORDER BY version').all(issue).map(r=>({...r}));
const objectCount=db=>Number(db.prepare('SELECT COUNT(*) AS n FROM objects').get().n);
const reply=content=>new Response(JSON.stringify({choices:[{message:{content}}]}),{status:200});
const validReply=issue=>reply(JSON.stringify(fallbackWorldSpec({issue_number:issue,...planet})));
function quietWarnings(t){return t.mock.method(console,'warn',()=>{})}

test('timeout: the request carries an abort signal and a timeout falls back without losing the object',async t=>{
 const warn=quietWarnings(t);
 const {db,env}=setup();insertObject(db,42);
 let signal=null;
 const result=await generateWorldForIssue(env,{number:42},planet,async(_url,options)=>{
  signal=options.signal;
  throw new DOMException('The operation was aborted due to timeout','TimeoutError');
 });
 assert.ok(signal instanceof AbortSignal,'the Foundry request must be bounded by an AbortSignal');
 assert.equal(result.status,'fallback');
 const stored=row(db,42);
 assert.equal(stored.world_status,'fallback');
 assert.equal(stored.world_version,1);
 assert.ok(JSON.parse(stored.world_spec).features.length>0,'the visitor still sees a procedural fallback world');
 assert.equal(objectCount(db),1,'no duplicate object is created');
 assert.ok(warn.mock.calls.some(c=>c.arguments.includes('timeout')),'a timeout is logged as such, not as a model failure');
});

for(const status of [429,500,502,503]){
 test('HTTP '+status+' from Foundry keeps the fallback world and a single revision',async t=>{
  quietWarnings(t);
  const {db,env}=setup();insertObject(db,7);
  const result=await generateWorldForIssue(env,{number:7},planet,async()=>new Response('busy',{status}));
  assert.equal(result.status,'fallback');
  assert.equal(row(db,7).world_status,'fallback');
  assert.deepEqual(revisions(db,7),[{version:1,world_status:'fallback'}]);
  assert.equal(objectCount(db),1);
 });
}

test('invalid model responses are rejected before touching the stored world',async t=>{
 const base=fallbackWorldSpec({issue_number:5,...planet});
 const cases={
  'not JSON':reply('{"schemaVersion":1,'),
  'missing choices':new Response(JSON.stringify({error:'nope'}),{status:200}),
  'non-string content':new Response(JSON.stringify({choices:[{message:{content:{archetype:'ocean'}}}]}),{status:200}),
  'oversized content':reply(' '.repeat(12001)),
  'wrong schema version':reply(JSON.stringify({...base,schemaVersion:2}))
 };
 for(const [name,response] of Object.entries(cases)){
  await assert.rejects(requestWorldSpec(foundry,'Texto',base,async()=>response.clone()),undefined,name+' must be rejected');
 }
 quietWarnings(t);
 const {db,env}=setup();insertObject(db,5);
 const result=await generateWorldForIssue(env,{number:5},planet,async()=>reply('{"schemaVersion":1,'));
 assert.equal(result.status,'fallback');
 assert.equal(row(db,5).world_status,'fallback');
});

test('daily budget: the cap is enforced in D1 and an exhausted budget skips Foundry',async()=>{
 const {db,env}=setup({FOUNDRY_DAILY_MAX:'1'});insertObject(db,1);insertObject(db,2,{...planet,name:'Otra'});
 let calls=0;
 const fetcher=async()=>{calls++;return validReply(1)};
 assert.equal((await generateWorldForIssue(env,{number:1},planet,fetcher)).status,'ready');
 const second=await generateWorldForIssue(env,{number:2},{...planet,name:'Otra'},fetcher);
 assert.deepEqual(second,{status:'fallback',reason:'daily-budget-exhausted'});
 assert.equal(calls,1,'no paid call once the daily cap is reached');
 assert.equal(row(db,2).world_status,'fallback');
});

test('daily budget: invalid or extreme limits are clamped and each UTC day starts again',async()=>{
 const day=new Date('2026-11-26T10:00:00Z'),next=new Date('2026-11-27T00:00:01Z');
 const reserveAll=async(env,now,max=600)=>{let n=0;while(n<max&&await reserveFoundryCall(env,now))n++;return n};
 assert.equal(await reserveAll({DB:d1(database()),FOUNDRY_DAILY_MAX:'abc'},day),75,'non-numeric falls back to 75');
 assert.equal(await reserveAll({DB:d1(database()),FOUNDRY_DAILY_MAX:'9999'},day),500,'capped at 500');
 assert.equal(await reserveAll({DB:d1(database()),FOUNDRY_DAILY_MAX:'0'},day),1,'at least one call');
 const env={DB:d1(database()),FOUNDRY_DAILY_MAX:'2'};
 assert.equal(await reserveAll(env,day),2);
 assert.equal(await reserveAll(env,next),2,'a new UTC day has its own budget');
});

test('race: two concurrent deliveries of the same Issue call Foundry once and keep one revision',async()=>{
 const {db,env}=setup();insertObject(db,42);
 let calls=0;
 const fetcher=async()=>{calls++;await new Promise(r=>setTimeout(r,5));return validReply(42)};
 const results=await Promise.all([
  generateWorldForIssue(env,{number:42},planet,fetcher),
  generateWorldForIssue(env,{number:42},planet,fetcher)
 ]);
 assert.deepEqual(results.map(r=>r.status).sort(),['ready','unchanged']);
 assert.equal(calls,1);
 assert.equal(row(db,42).world_version,1);
 assert.deepEqual(revisions(db,42),[{version:1,world_status:'ready'}]);
});

test('race: an edit while Foundry is answering supersedes the stale result',async()=>{
 const {db,env}=setup();insertObject(db,42);
 const edited='Un volcán con ciudades flotantes';
 const result=await generateWorldForIssue(env,{number:42},planet,async()=>{
  // The author edits the Issue before the model answers the original description.
  db.prepare('UPDATE objects SET description=? WHERE issue_number=42').run(edited);
  return validReply(42);
 });
 assert.equal(result.status,'superseded');
 assert.equal(row(db,42).world_status,'fallback','the stale model answer is not stored');
});

test('race: a delayed old event cannot overwrite a newer description',async()=>{
 const {db,env}=setup();insertObject(db,42,{...planet,description:'Descripción nueva'});
 let calls=0;
 const result=await generateWorldForIssue(env,{number:42},planet,async()=>{calls++;return validReply(42)});
 assert.equal(result.status,'unchanged');
 assert.equal(calls,0);
 assert.equal(row(db,42).world_version,0);
});

test('storage failure keeps the legacy scene and never calls Foundry',async t=>{
 quietWarnings(t);
 let calls=0;
 const DB={prepare(){return {bind(){return {async run(){throw new Error('D1 unavailable')}}}}}};
 const result=await generateWorldForIssue({...foundry,WORLDGEN_ENABLED:'true',DB},{number:42},planet,async()=>{calls++;return validReply(42)});
 assert.equal(result.status,'storage-unavailable');
 assert.equal(calls,0);
});
