import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseIssue,validate} from '../../worker/src/validation.mjs';
const digest=s=>createHash('sha256').update(s).digest('hex');
export function prepareProposal(event,kind='valid'){
 if(event){
  const i=event.issue;
  if(event.action!=='opened'||!i||i.pull_request||i.state!=='open'||!Number.isSafeInteger(i.number)||i.number<1||typeof i.body!=='string'||i.body.length>2400)throw Error('Invalid issue event');
  for(const heading of ['Tipo de objeto','Alias del explorador','Nombre del objeto','Descripción creativa']){
   if(i.body.split(/\r?\n/).filter(l=>l.trim()==='### '+heading).length!==1)throw Error('Missing or repeated cosmic field');
  }
  if(/academyverso-(?:triage|factory):ready:/i.test(i.body))throw Error('Unexpected publication marker');
  // Reject hostile markup before normalization can hide it from moderation.
  if(/[<>\x60\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(i.body)||/https?:\/\/|www\.|@\w+\.\w+/i.test(i.body))throw Error('Unsafe raw proposal');
  const fields=parseIssue(i.body);
  return {source:'issue',issue_number:i.number,body_sha256:digest(i.body),...fields};
 }
 const choices={valid:'fixture.json',unsupported:'fixture-negative.json',reject:'fixture-reject.json'};
 if(!Object.hasOwn(choices,kind))throw Error('Unknown fixture');
 const x=JSON.parse(readFileSync(new URL('./'+choices[kind],import.meta.url),'utf8'));
 return {source:'fixture',issue_number:0,body_sha256:null,...validate({...x,alias:x.alias||'QA'})};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const live=process.env.GITHUB_EVENT_NAME==='issues';
 const event=live?JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')):null;
 const proposal=prepareProposal(event,process.env.FIXTURE||'valid');
 mkdirSync('planet-input/proposal',{recursive:true});
 writeFileSync('planet-input/proposal/proposal.json',JSON.stringify(proposal,null,2)+'\n');
}
