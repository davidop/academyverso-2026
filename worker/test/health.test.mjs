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
