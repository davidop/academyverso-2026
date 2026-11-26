import {readFileSync} from 'node:fs';
import {hash,brief,spec,review,read} from './contract.mjs';
import {parseIssue,parseTriagedIssue,TRIAGE_MARKER,hasTriageMarker} from '../../worker/src/validation.mjs';
export const STAGES=['planet:admission','planet:design','planet:build','planet:review','planet:held','planet:rejected','planet:ready'];
const next={
 'planet:admission':['planet:design','planet:held','planet:rejected'],
 'planet:design':['planet:build','planet:held','planet:rejected'],
 'planet:build':['planet:review','planet:held'],
 'planet:review':['planet:held','planet:rejected','planet:ready']
};
export function labelPlan(labels,target){
 if(!STAGES.includes(target))throw Error('Unknown stage');
 const current=labels.filter(n=>STAGES.includes(n));
 if(current.includes('planet:ready')||current.includes('planet:rejected')){if(target==='planet:held'||target==='planet:rejected')return {add:null,remove:[]};throw Error('Terminal issue cannot enter another stage');}
 if(current.length>1)throw Error('Ambiguous stage; manual reconciliation required');
 const from=current[0];
 if(from===target)return {add:null,remove:[]};
 if((!from&&target!=='planet:admission')||(from&&!next[from]?.includes(target)))throw Error('Invalid stage transition');
 return {add:target,remove:from?[from]:[]};
}
function issueBodyWithDescription(body,description){
 if(hasTriageMarker(body))throw Error('Existing publication marker');
 const changed=body.replace(/(^### Descripción creativa[ \t]*\r?\n+)[\s\S]*?(?=\n### |\n---|$)/m,(_m,header)=>header+description+'\n');
 if(changed===body&&!body.includes(description))throw Error('Missing description section');
 return changed.trimEnd()+(changed.includes('\n---')?'\n\n':'\n\n---\n')+TRIAGE_MARKER+'\n';
}
export function publication(proposal,design,candidate,verdict,body){
 if(proposal.source!=='issue'||!Number.isSafeInteger(proposal.issue_number)||proposal.issue_number<1||hash(body)!==proposal.body_sha256)throw Error('Issue changed since admission');
 const original=parseIssue(body);
 for(const k of ['type','alias','name','description'])if(original[k]!==proposal[k])throw Error('Proposal mismatch');
 brief(design,proposal);spec(candidate.value,proposal);review(verdict,candidate.digest);
 if(hash(candidate.bytes)!==candidate.digest)throw Error('Candidate bytes changed');
 const updated=issueBodyWithDescription(body,design.concept);
 const comment='### Lo que hemos entendido\n\nPropuesta revisada por la factoría de planetas.\n\n### Descripción que aparecerá en el planeta\n\n'+design.concept+'\n\n'+TRIAGE_MARKER+'\n\n[academyverso-factory:ready:v1]\nfactory-issue: '+proposal.issue_number+'\nfactory-spec-sha256: '+candidate.digest+'\nfactory-spec-base64: '+Buffer.from(candidate.bytes).toString('base64url')+'\n';
 if(parseTriagedIssue(updated,comment).description!==design.concept||parseIssue(updated).description!==design.concept)throw Error('Curated body/comment mismatch');
 return {body:updated,comment};
}
function apiFactory(token,repo,issueNo){
 if(!token||!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)||!Number.isSafeInteger(issueNo)||issueNo<1)throw Error('Invalid trusted GitHub context');
 const base='https://api.github.com/repos/'+repo;
 return async(method,path,payload,allow404=false)=>{
  const r=await fetch(base+path,{method,headers:{authorization:'Bearer '+token,accept:'application/vnd.github+json','x-github-api-version':'2022-11-28','content-type':'application/json'},...(payload?{body:JSON.stringify(payload)}:{})});
  if(allow404&&r.status===404)return null;
  if(!r.ok)throw Error('GitHub stage operation failed: '+r.status);
  if(r.status===204)return null;return r.json();
 };
}
async function ensureLabel(api,name){
 if(await api('GET','/labels/'+encodeURIComponent(name),null,true))return;
 try{await api('POST','/labels',{name,color:name==='planet:ready'?'0E8A16':name==='planet:rejected'?'B60205':'1D76DB',description:'AcademyVerso planet factory stage'});}
 catch(e){if(!await api('GET','/labels/'+encodeURIComponent(name),null,true))throw e;}
}
async function applyLabel(api,path,labels,target){
 const plan=labelPlan(labels,target);
 if(!plan.add)return;
 await ensureLabel(api,plan.add);
 await api('POST',path+'/labels',{labels:[plan.add]});
 for(const n of plan.remove)await api('DELETE',path+'/labels/'+encodeURIComponent(n),null,true);
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const [command,target]=process.argv.slice(2);
 if(process.env.GITHUB_EVENT_NAME!=='issues'){console.log('Preview only; no GitHub label or publication write');}
 else{
  const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
  if(event.action!=='opened'||event.issue?.pull_request)throw Error('Not a cosmic issue opened event');
  const no=event.issue.number,path='/issues/'+no;
  const api=apiFactory(process.env.GH_TOKEN,process.env.GITHUB_REPOSITORY,no);
  const issue=await api('GET',path),labels=issue.labels.map(x=>x.name);
  if(issue.state!=='open'){if(command==='publish')throw Error('Issue closed');}
  else if(command==='stage')await applyLabel(api,path,labels,target);
  else if(command==='publish'){
   if(process.env.APP_BOT!==process.env.EXPECTED_BOT||!process.env.APP_BOT?.endsWith('[bot]'))throw Error('Wrong publication App');
   if(labels.includes('planet:ready')||!labels.includes('planet:review'))throw Error('Not in publishable state');
   const proposal=read('handoff/proposal/proposal.json').value;
   if(proposal.issue_number!==no)throw Error('Proposal issue mismatch');
   const cand=read('handoff/spec/spec.json');
   const pub=publication(proposal,read('handoff/brief/brief.json').value,cand,read('handoff/review/review.json').value,issue.body);
   const result=await api('POST',path+'/comments',{body:pub.comment});
   if(result.user?.login!==process.env.EXPECTED_BOT)throw Error('Publication comment not from trusted App');
   const fresh=await api('GET',path);
   if(fresh.state!=='open'||hash(fresh.body)!==proposal.body_sha256)throw Error('Issue edited during publication');
   await api('PATCH',path,{body:pub.body});
   const check=await api('GET',path);
   if(check.state!=='open'||check.body!==pub.body)throw Error('Publication body mismatch');
   await applyLabel(api,path,check.labels.map(x=>x.name),'planet:ready');
  }else throw Error('Unknown command');
 }
}
