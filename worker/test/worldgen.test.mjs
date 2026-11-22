import test from 'node:test';
import assert from 'node:assert/strict';
import {fallbackWorldSpec} from '../../web/worlds/spec.mjs';
import {WORLD_SCHEMA,requestWorldSpec} from '../src/worldgen/foundry.mjs';
import {worldgenEnabled,generateWorldForIssue} from '../src/worldgen/service.mjs';
const base=fallbackWorldSpec({type:'planeta',issue_number:42,name:'Nebula',description:'Un océano con dos lunas'});
const env={FOUNDRY_ENDPOINT:'https://sample.openai.azure.com/openai/v1/chat/completions',FOUNDRY_DEPLOYMENT:'test-model',FOUNDRY_API_KEY:'not-a-real-key'};
const response=x=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(x)}}]}),{status:200});
test('strict output schema and server seed enforcement',async()=>{
 assert.equal(WORLD_SCHEMA.additionalProperties,false);
 let count=0;
 const mock=async(url,options)=>{
  count++;
  assert.equal(url,env.FOUNDRY_ENDPOINT);
  assert.equal(options.headers['api-key'],env.FOUNDRY_API_KEY);
  assert.equal(JSON.parse(options.body).response_format.json_schema.strict,true);
  return response({...base,seed:1});
 };
 const spec=await requestWorldSpec(env,'Ocean world',base,mock);
 assert.equal(spec.seed,base.seed);assert.equal(count,1);
});
test('reject unsafe extra fields and unsupported object types',async()=>{
 const unsafe={...base,sourceCode:'alert(1)'};
 await assert.rejects(requestWorldSpec(env,'Dangerous',base,async()=>response(unsafe)));
 const moon=fallbackWorldSpec({type:'luna',issue_number:9,name:'Moon',description:'Lunar craters'});
 await assert.rejects(requestWorldSpec(env,'Invalid',moon,async()=>response({...moon,archetype:'ocean'})));
});
test('unapproved endpoints and no credentials are rejected',async()=>{
 await assert.rejects(requestWorldSpec({...env,FOUNDRY_ENDPOINT:'https://example.com/openai/v1/chat/completions'},'Text',base,async()=>response(base)));
 await assert.rejects(requestWorldSpec({...env,FOUNDRY_API_KEY:''},'Text',base,async()=>response(base)));
});
test('off by default; never touches D1 on a disabled generation',async()=>{
 assert.equal(worldgenEnabled({}),false);
 const result=await generateWorldForIssue({},{number:42},{type:'planeta',name:'N',description:'A'});
 assert.deepEqual(result,{status:'disabled'});
});
test('fallback is persisted if the external model fails; ingestion remains successful',async()=>{
 const calls=[];
 const DB={prepare(sql){return {bind(...params){return {async run(){calls.push({sql,params});return {meta:{changes:1}}}}}}}};
 const res=await generateWorldForIssue({...env,DB,WORLDGEN_ENABLED:'true'},{number:42},{type:'planeta',name:'N',description:'Luna y océano'},async()=>new Response('offline',{status:503}));
 assert.equal(res.status,'fallback');
 assert.equal(calls.length,2);
 assert.ok(calls[1].sql.includes('INSERT INTO world_revisions'));
 assert.ok(JSON.parse(calls[0].params[0]).features.length>0);
});
