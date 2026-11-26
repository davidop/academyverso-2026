import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validate} from '../../worker/src/validation.mjs';
import {validateWorldSpec} from '../../web/worlds/spec.mjs';
import {validateFactorySpec} from '../../worker/src/worldgen/factory.mjs';
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fail=m=>{throw Error(m)};
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const str=(v,max)=>typeof v==='string'&&v.trim()===v&&v.length>0&&v.length<=max;
export function classifyBrief(v,proposal){
 if(!exact(v,['decision','concept','requirements'])||!['accept','reject'].includes(v.decision)||!str(v.concept,280)||!Array.isArray(v.requirements)||v.requirements.length>10||!v.requirements.every(x=>str(x,100)))fail('Invalid brief');
 if(v.decision==='reject'){if(v.requirements.length!==0)fail('Rejected brief must not expose requirements');return 'reject';}
 if(proposal){
  if(v.concept.includes('\n')||v.concept.includes('\r')||/[<>@`]/.test(v.concept)||/academyverso-(?:triage|factory):ready:/i.test(v.concept))fail('Unsafe description');
  const checked=validate({...proposal,description:v.concept});
  if(checked.description!==v.concept)fail('Description normalized unexpectedly');
  const marker=proposal.description.match(/^\[GTA:(?:VICE-NEBULA|COLONIA-CENTINELA)\]/)?.[0];
  const next=v.concept.match(/^\[GTA:(?:VICE-NEBULA|COLONIA-CENTINELA)\]/)?.[0];
  if(marker!==next)fail('GTA marker changed');
 }
 return 'accept';
}
export function brief(v,proposal){if(classifyBrief(v,proposal)!=='accept')fail('Rejected design');return v;}

export function spec(v,proposal){const x=proposal?validateFactorySpec(v,proposal.type):validateWorldSpec(v);if(new Set(x.features.map(f=>f.kind)).size!==x.features.length||x.features.reduce((n,f)=>n+f.count,0)>24)fail('Feature budget or duplicate feature');return x;}
export function review(v,digest){
 if(!exact(v,['decision','spec_sha256','findings'])||v.decision!=='approve'||v.spec_sha256!==digest||!Array.isArray(v.findings)||v.findings.length!==0)fail('Review failed or not bound to exact candidate');
 return v;
}
export function read(path){const size=statSync(path).size;if(size<1||size>16384)fail('Artifact size');const bytes=readFileSync(path);return {value:JSON.parse(bytes.toString('utf8')),digest:hash(bytes),bytes};}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const [phase,...paths]=process.argv.slice(2);
 if(phase==='brief'){const decision=classifyBrief(read(paths[0]).value,paths[1]?read(paths[1]).value:undefined);if(process.env.GITHUB_OUTPUT)await import('node:fs').then(({appendFileSync})=>appendFileSync(process.env.GITHUB_OUTPUT,'decision='+decision+'\n'));else if(decision!=='accept')fail('Rejected design');}
 else if(phase==='spec')spec(read(paths[0]).value,paths[1]?read(paths[1]).value:undefined);
 else if(phase==='review'){const candidate=read(paths[0]);spec(candidate.value);review(read(paths[1]).value,candidate.digest);}
 else fail('Unknown phase');
 console.log('Planet Factory gate passed: '+phase);
}
