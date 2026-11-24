import test from 'node:test';
import assert from 'node:assert/strict';
import {reserveFoundryCall} from '../src/worldgen/budget.mjs';
test('daily Foundry budget is atomic, bounded and keyed by UTC calendar day',async()=>{
 const calls=[];
 const env={FOUNDRY_DAILY_MAX:5,DB:{prepare(sql){return {bind(...params){return {async run(){calls.push({sql,params});return {meta:{changes:calls.length<=5?1:0}}}}}}}}};
 const date=new Date('2026-11-22T23:00:00Z');
 assert.equal(await reserveFoundryCall(env,date),true);
 for(let i=0;i<4;i++)assert.equal(await reserveFoundryCall(env,date),true);
 assert.equal(await reserveFoundryCall(env,date),false);
 assert.equal(calls[0].params[0],'foundry:2026-11-22');
 assert.equal(calls[0].params[2],5);
 assert.match(calls[0].sql,/WHERE rates.count</);
});
