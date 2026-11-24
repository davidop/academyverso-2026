import test from 'node:test';
import assert from 'node:assert/strict';
import {evolutionComment,worldUrl,mutateWorld} from '../worlds/evolution-ui.mjs';
const token='A'.repeat(43);
test('GitHub command rejects executable fragments, URLs and short content',()=>{
 assert.equal(evolutionComment('Añade dos lunas'),'/academyverso-evolve Añade dos lunas');
 assert.throws(()=>evolutionComment('Add'));
 assert.throws(()=>evolutionComment('Añade https://evil.example'));
});
test('evolution requests use bearer token only in Authorization header',async()=>{
 let called=false;
 const mock=async(url,args)=>{
  called=true;
  assert.equal(url,'https://api.example.com/api/worlds/10/evolve');
  assert.equal(args.headers.authorization,'Bearer '+token);
  assert.doesNotMatch(args.body,/A{40}/);
  return new Response(JSON.stringify({ok:true,version:2}),{status:200});
 };
 assert.equal((await mutateWorld('https://api.example.com/',10,'evolve',token,{instruction:'Añade dos lunas'},mock)).version,2);
 assert.equal(called,true);
 assert.throws(()=>worldUrl('https://api.example.com','oops','history'));
 await assert.rejects(()=>mutateWorld('https://api.example.com',10,'rollback','wrong',{version:1},mock));
});
