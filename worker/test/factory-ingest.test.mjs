import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createHmac,createHash} from 'node:crypto';
import worker from '../src/index.mjs';
import {issueBody} from '../src/validation.mjs';
import {fallbackWorldSpec,resolvedWorldSpec} from '../../web/worlds/spec.mjs';
import {prepareProposal} from '../../experiments/planet-factory-c/prepare.mjs';
import {publication} from '../../experiments/planet-factory-c/stages.mjs';
const repo='davidop/academyverso-2026',bot='academyverso-triage[bot]',secret='test-only-hmac';
const data={type:'planeta',alias:'QA',name:'Nexus',description:'Planeta oceánico con tres lunas'};
function setup(){
 const db=new DatabaseSync(':memory:');
 for(const p of ['../schema.sql','../migrations/0001_world_specs.sql','../migrations/0002_world_revisions.sql','../migrations/0003_planet_factory.sql'])db.exec(readFileSync(new URL(p,import.meta.url),'utf8'));
 const DB={prepare(sql){
  const s=db.prepare(sql);
  const bound=args=>({async first(){return s.get(...args)??null},async all(){return {results:s.all(...args)}},async run(){return {meta:{changes:Number(s.run(...args).changes)}}}});
  return {...bound([]),bind(...args){return bound(args)}};
 },async batch(statements){db.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());db.exec('COMMIT');return result}catch(e){db.exec('ROLLBACK');throw e}}};
 return {db,env:{DB,GITHUB_REPO:repo,TRIAGE_BOT:bot,INGEST_SECRET:secret,WORLDGEN_ENABLED:'true',PLANET_FACTORY_ENABLED:'true',ADMIN_TOKEN:'test-only-admin'}};
}
function makeEvent(n=42){
 const body=issueBody(data),proposal=prepareProposal({action:'opened',issue:{number:n,state:'open',body}});
 const value={...fallbackWorldSpec({issue_number:n,...data}),palette:{primary:'#AA12EF',secondary:'#FFCC00',emissive:'#112233'}};
 const raw=JSON.stringify(value,null,2)+'\n',bytes=Buffer.from(raw),digest=createHash('sha256').update(bytes).digest('hex');
 const design={decision:'accept',concept:'Planeta oceánico con tres lunas.',requirements:['tres lunas']};
 const pub=publication(proposal,design,{value,bytes,digest},{decision:'approve',spec_sha256:digest,findings:[]},body);
 return {event:{action:'labeled',label:{name:'planet:ready'},sender:{login:bot},repository:{full_name:repo},issue:{number:n,state:'open',html_url:'https://github.com/'+repo+'/issues/'+n,body:pub.body},triage_comment:{user:{login:bot},body:pub.comment}},value,raw,digest};
}
async function ingest(env,event,valid=true){
 const raw=JSON.stringify(event),sig=createHmac('sha256',valid?secret:'wrong').update(raw).digest('hex');
 return worker.fetch(new Request('https://worker.test/api/ingest',{method:'POST',body:raw,headers:{'x-academyverso-signature':'sha256='+sig}}),env,{waitUntil(){throw Error('Factory must not launch background generator')}});
}
async function objects(env){const r=await worker.fetch(new Request('https://worker.test/api/objects'),env,{});return (await r.json()).objects}
async function hide(env,n,hidden){return worker.fetch(new Request('https://worker.test/api/admin/hide',{method:'POST',headers:{authorization:'Bearer test-only-admin'},body:JSON.stringify({issue_number:n,hidden})}),env,{})}
function pending(db,n,state='pending'){db.prepare("INSERT INTO objects(issue_number,type,name,alias,description,issue_url,created_at,hidden,factory_state) VALUES(?,?,?,?,?,?,datetime('now'),1,?)").run(n,data.type,data.name,data.alias,data.description,'https://github.com/'+repo+'/issues/'+n,state)}
test('signed reviewed bytes flow through real SQL, GET and existing resolver, not fallback',async()=>{
 const {db,env}=setup(),{event,value,raw,digest}=makeEvent();pending(db,42);
 assert.equal((await objects(env)).length,0);
 const r=await ingest(env,event);assert.equal(r.status,200);assert.equal((await r.json()).spec_sha256,digest);
 const [object]=await objects(env);assert.equal(object.world_spec,raw);assert.equal(object.world_status,'ready');assert.equal(object.world_version,1);
 assert.deepEqual(resolvedWorldSpec(object),{spec:value,source:'persisted'});
 assert.equal(db.prepare('SELECT world_spec FROM world_revisions WHERE issue_number=42').get().world_spec,raw);
 assert.equal((await ingest(env,event)).status,200);
 assert.equal(db.prepare('SELECT world_version FROM objects WHERE issue_number=42').get().world_version,1);
 assert.equal((await hide(env,42,true)).status,200);
 assert.equal((await ingest(env,event)).status,200);
 assert.equal((await objects(env)).length,0);db.close();
});
test('direct issue inserts, invalid signature, sender, spec and flags fail closed',async()=>{
 const {db,env}=setup(),{event}=makeEvent(43);
 assert.equal((await ingest(env,event,false)).status,401);
 assert.equal((await ingest({...env,PLANET_FACTORY_ENABLED:'false'},event)).status,503);
 assert.equal((await ingest({...env,WORLDGEN_ENABLED:'false'},event)).status,503);
 assert.equal((await ingest(env,{...event,sender:{login:'attacker'}})).status,400);
 assert.equal((await ingest(env,{...event,triage_comment:{...event.triage_comment,body:event.triage_comment.body.replace(/factory-spec-sha256: [0-9a-f]+/,'factory-spec-sha256: '+'0'.repeat(64))}})).status,400);
 assert.equal((await objects(env)).length,0);
 assert.equal((await ingest(env,event)).status,200);assert.equal((await objects(env)).length,1);db.close();
});
test('pending admin block cannot be undone by replay or unhide; legacy row not mistaken for pending',async()=>{
 const {db,env}=setup();pending(db,44);pending(db,45,'legacy');
 assert.equal((await hide(env,44,true)).status,200);
 assert.equal((await hide(env,44,false)).status,409);
 assert.equal((await ingest(env,makeEvent(44).event)).status,409);
 assert.equal((await ingest(env,makeEvent(45).event)).status,409);
 assert.equal((await objects(env)).length,0);db.close();
});

test('una Issue sin fila (abierta desde GitHub) se puede bloquear antes de publicarse; desocultar algo inexistente da 404',async()=>{
 const {db,env}=setup();
 assert.equal((await hide(env,46,false)).status,404);
 assert.equal((await hide(env,46,true)).status,200);
 assert.equal(db.prepare('SELECT factory_state,hidden FROM objects WHERE issue_number=46').get().factory_state,'blocked');
 assert.equal((await ingest(env,makeEvent(46).event)).status,409);
 assert.equal((await hide(env,46,false)).status,409);
 assert.equal((await objects(env)).length,0);db.close();
});
test('un cuerpo editado después de publicar (nombre, alias o tipo) no se ingiere',async()=>{
 const {db,env}=setup(),{event}=makeEvent(47);pending(db,47);
 const edited={...event,issue:{...event.issue,body:event.issue.body.replace('### Nombre del objeto\n\nNexus','### Nombre del objeto\n\nOtro nombre')}};
 assert.notEqual(edited.issue.body,event.issue.body);
 assert.equal((await ingest(env,edited)).status,400);
 assert.equal((await objects(env)).length,0);
 assert.equal((await ingest(env,event)).status,200);db.close();
});
test('con la factoría activa, evolve/rollback no tocan un mundo publicado por la factoría',async()=>{
 const {db,env}=setup(),{event}=makeEvent(48);pending(db,48);
 assert.equal((await ingest(env,event)).status,200);
 const r=await worker.fetch(new Request('https://worker.test/api/worlds/48/evolve',{method:'POST',headers:{authorization:'Bearer '+'a'.repeat(43)},body:JSON.stringify({instruction:'volcanes'})}),env,{waitUntil(){}});
 assert.equal(r.status,409);
 assert.equal(db.prepare('SELECT world_version FROM objects WHERE issue_number=48').get().world_version,1);db.close();
});
test('una combinación de flags sin WorldGen sirve el universo clásico y lo avisa en /api/health',async()=>{
 const {db,env}=setup();pending(db,49,'legacy');db.prepare('UPDATE objects SET hidden=0 WHERE issue_number=49').run();
 const off={...env,WORLDGEN_ENABLED:'false'};
 const r=await worker.fetch(new Request('https://worker.test/api/objects'),off,{});
 assert.equal(r.status,200);assert.equal((await r.json()).objects.length,1);
 const h=await (await worker.fetch(new Request('https://worker.test/api/health'),off,{})).json();
 assert.equal(h.factory_enabled,true);assert.equal(h.factory_ready,false);
 const h2=await (await worker.fetch(new Request('https://worker.test/api/health'),env,{})).json();
 assert.equal(h2.factory_ready,true);db.close();
});
