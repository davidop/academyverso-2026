import test from 'node:test';
import assert from 'node:assert/strict';
import {parseWorldCommand,authorizedWorldComment,evolveWorld,rollbackWorld} from '../src/worldgen/history.mjs';
import {fallbackWorldSpec} from '../../web/worlds/spec.mjs';

const issue={number:42,user:{id:123},state:'closed',body:'### Tipo de objeto'};
const valid={action:'created',issue,sender:{id:123},comment:{user:{id:123},body:'/academyverso-evolve Añade dos lunas y una ciudad flotante'}};
test('evolution commands require exact syntax, bounded text and no URLs',()=>{
 assert.deepEqual(parseWorldCommand('/academyverso-evolve Añade dos lunas'),{action:'evolve',instruction:'Añade dos lunas'});
 assert.deepEqual(parseWorldCommand('/academyverso-rollback 2'),{action:'rollback',version:2});
 assert.equal(parseWorldCommand('Anything else'),null);
 assert.throws(()=>parseWorldCommand('/academyverso-evolve https://host.example'));
 assert.throws(()=>parseWorldCommand('/academyverso-evolve abc'));
});
test('only the authenticated GitHub Issue author can mutate the world',()=>{
 assert.equal(authorizedWorldComment(valid),true);
 assert.equal(authorizedWorldComment({...valid,sender:{id:999}}),false);
 assert.equal(authorizedWorldComment({...valid,comment:{...valid.comment,user:{id:999}}}),false);
 assert.equal(authorizedWorldComment({...valid,issue:{...issue,user:{id:0}}}),false);
 assert.equal(authorizedWorldComment({...valid,action:'edited'}),false);
});
function makeDb(){
 const row={issue_number:42,type:'planeta',name:'Oceania',description:'Un planeta azul de océanos',hidden:0,world_version:1,world_spec:JSON.stringify(fallbackWorldSpec({type:'planeta',issue_number:42,name:'Oceania',description:'Un planeta azul de océanos'}))};
 const operations=[];
 const prior={world_spec:row.world_spec};
 const db={
  prepare(sql){return {bind(...args){return {
   async first(){if(sql.startsWith('SELECT world_spec FROM world_revisions'))return prior;return row;},
   async run(){operations.push({sql,args});if(sql.startsWith('UPDATE objects')){row.world_version++;row.world_spec=args[0];}return {meta:{changes:1}}}
  }}}}
 };
 return {db,row,operations};
}
test('evolution builds a new version using fallback without requiring live model',async()=>{
 const {db,row,operations}=makeDb();
 const result=await evolveWorld({WORLDGEN_ENABLED:'true',DB:db},42,'Añade dos lunas y volcanes');
 assert.equal(result.status,'fallback');assert.equal(result.version,2);
 assert.equal(row.world_version,2);
 assert.ok(operations.some(x=>x.sql.includes('INSERT INTO world_revisions')));
});
test('rollback restores stored spec as a newer version (immutable history)',async()=>{
 const {db,row,operations}=makeDb();
 row.world_version=3;
 const result=await rollbackWorld({WORLDGEN_ENABLED:'true',DB:db},42,1);
 assert.equal(result.status,'restored');assert.equal(result.version,4);
 assert.equal(row.world_version,4);
 assert.ok(operations.some(x=>x.sql.includes('INSERT INTO world_revisions')));
});
test('rollback cannot select future or current version; disabled feature makes no SQL calls',async()=>{
 const {db}=makeDb();
 assert.equal((await rollbackWorld({WORLDGEN_ENABLED:'true',DB:db},42,1)).status,'invalid');
 assert.equal((await evolveWorld({},42,'Añade dos lunas')).status,'disabled');
 assert.equal((await rollbackWorld({},42,1)).status,'disabled');
});
