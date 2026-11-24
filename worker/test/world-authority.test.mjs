import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.mjs';

async function signedRequest(payload,secret='test-hmac-secret'){
 const raw=JSON.stringify(payload);
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw));
 const sig='sha256='+[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
 return new Request('https://api.example.com/api/ingest',{method:'POST',headers:{'content-type':'application/json','x-academyverso-signature':sig},body:raw});
}
const issue={number:11,state:'closed',user:{id:10},html_url:'https://github.com/davidop/academyverso-2026/issues/11'};
const comment={action:'created',issue,sender:{id:20},comment:{user:{id:20},body:'/academyverso-evolve Añade dos lunas violetas'}};
test('signed GitHub comment by another user is denied before accessing D1',async()=>{
 const req=await signedRequest(comment);
 const env={INGEST_SECRET:'test-hmac-secret',WORLDGEN_ENABLED:'true',DB:{prepare(){throw Error('DB should not be touched before author check')}}};
 const res=await worker.fetch(req,env,{waitUntil(){}});
 assert.equal(res.status,403);
 assert.match((await res.json()).error,/autor/i);
});
test('signed owner command cannot write when WorldGen is disabled',async()=>{
 const payload={...comment,sender:{id:10},comment:{user:{id:10},body:'/academyverso-evolve Añade dos lunas violetas'}};
 const req=await signedRequest(payload);
 const env={INGEST_SECRET:'test-hmac-secret',WORLDGEN_ENABLED:'false'};
 const res=await worker.fetch(req,env,{waitUntil(){}});
 assert.equal(res.status,503);
});
test('evolution web endpoints require bearer token before querying ownership',async()=>{
 const env={WORLDGEN_ENABLED:'true',DB:{prepare(){throw Error('should reject before DB')}}};
 const request=new Request('https://api.example.com/api/worlds/11/evolve',{method:'POST',body:JSON.stringify({instruction:'Añade dos lunas'})});
 const response=await worker.fetch(request,env,{waitUntil(){}});
 assert.equal(response.status,401);
});
test('history endpoint remains inactive until migration and explicit flag',async()=>{
 const req=new Request('https://api.example.com/api/worlds/11/history');
 const res=await worker.fetch(req,{WORLDGEN_ENABLED:'false'},{});
 assert.equal(res.status,503);
});
