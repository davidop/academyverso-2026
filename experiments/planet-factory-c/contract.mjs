import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateWorldSpec} from '../../web/worlds/spec.mjs';
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fail=m=>{throw Error(m)};
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const str=(v,max)=>typeof v==='string'&&v.trim()===v&&v.length>0&&v.length<=max;
export function brief(v){
 if(!exact(v,['decision','concept','requirements'])||!['accept','reject'].includes(v.decision)||!str(v.concept,280)||!Array.isArray(v.requirements)||v.requirements.length>10||!v.requirements.every(x=>str(x,100)))fail('Invalid brief');
 if(v.decision!=='accept')fail('Rejected design');
 return v;
}
export function spec(v){const x=validateWorldSpec(v);if(x.features.reduce((n,f)=>n+f.count,0)>24)fail('Feature budget');return x;}
export function review(v,digest){
 if(!exact(v,['decision','spec_sha256','findings'])||v.decision!=='approve'||v.spec_sha256!==digest||!Array.isArray(v.findings)||v.findings.length!==0)fail('Review failed or not bound to exact candidate');
 return v;
}
function read(path){const size=statSync(path).size;if(size<1||size>16384)fail('Artifact size');const bytes=readFileSync(path);return {value:JSON.parse(bytes.toString('utf8')),digest:hash(bytes)};}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const [phase,...paths]=process.argv.slice(2);
 if(phase==='brief')brief(read(paths[0]).value);
 else if(phase==='spec')spec(read(paths[0]).value);
 else if(phase==='review'){const candidate=read(paths[0]);spec(candidate.value);review(read(paths[1]).value,candidate.digest);}
 else fail('Unknown phase');
 console.log('Planet Factory gate passed: '+phase);
}
