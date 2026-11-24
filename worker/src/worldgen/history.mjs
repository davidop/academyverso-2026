import {reserveFoundryCall} from './budget.mjs';
// Evolving and restoring worlds via *authenticated* GitHub Issue comments.
// The only caller is the Worker after validating GitHub Actions HMAC.
// No anonymous endpoint is exposed; alias is never an ownership credential.
import {fallbackWorldSpec,validateWorldSpec} from '../../../web/worlds/spec.mjs';
import {requestWorldSpec} from './foundry.mjs';
import {worldgenEnabled} from './service.mjs';

const MAX_VERSIONS=8;
export function parseWorldCommand(message){
 const content=String(message??'').trim().normalize('NFKC');
 const evolve=content.match(/^\/academyverso-evolve\s+([\s\S]+)$/i);
 if(evolve){
  const instruction=evolve[1].trim();
  if(instruction.length<8||instruction.length>240||/https?:\/\/|www\.|[<>]/i.test(instruction))throw Error('Invalid evolution instruction');
  return {action:'evolve',instruction};
 }
 const rollback=content.match(/^\/academyverso-rollback\s+(\d{1,3})$/i);
 if(rollback)return {action:'rollback',version:Number(rollback[1])};
 return null;
}
export function authorizedWorldComment(event){
 if(event?.action!=='created'||!event.comment||!event.issue||!event.sender)return false;
 const sender=Number(event.sender.id),author=Number(event.issue.user?.id),commenter=Number(event.comment.user?.id);
 return Number.isSafeInteger(sender)&&sender>0&&sender===author&&sender===commenter;
}
async function fetchWorld(env,number){
 const row=await env.DB.prepare('SELECT issue_number,type,name,description,hidden,world_version,world_spec,world_status FROM objects WHERE issue_number=?').bind(number).first();
 if(!row||row.hidden)return null;
 return row;
}
async function saveRevision(env,id,expected,spec,status,origin){
 const serialized=JSON.stringify(validateWorldSpec(spec));
 const updated=await env.DB.prepare(
  "UPDATE objects SET world_spec=?,world_status=?,world_version=world_version+1,world_updated_at=datetime('now') WHERE issue_number=? AND world_version=? AND hidden=0"
 ).bind(serialized,status,id,expected).run();
 if(!updated.meta?.changes)return {status:'conflict'};
 const version=expected+1;
 // The SELECT binds the history row to the currently committed object and version.
 await env.DB.prepare(
  "INSERT INTO world_revisions(issue_number,version,world_spec,world_status,input_hash,origin) "+
  "SELECT issue_number,world_version,world_spec,world_status,world_input_hash,? FROM objects "+
  "WHERE issue_number=? AND world_version=? ON CONFLICT(issue_number,version) DO UPDATE SET "+
  "world_spec=excluded.world_spec,world_status=excluded.world_status,origin=excluded.origin"
 ).bind(origin,id,version).run();
 return {status,version};
}
export async function evolveWorld(env,issueNumber,instruction,fetcher=fetch){
 if(!worldgenEnabled(env))return {status:'disabled'};
 const command=parseWorldCommand('/academyverso-evolve '+instruction);
 const id=Number(issueNumber);
 if(!Number.isInteger(id)||id<1||!command||command.action!=='evolve')return {status:'invalid'};
 const row=await fetchWorld(env,id);
 if(!row)return {status:'not-found'};
 const v=Number(row.world_version||0);
 if(v>=MAX_VERSIONS)return {status:'limit'};
 let current;
 try{current=validateWorldSpec(row.world_spec)}catch(_){current=fallbackWorldSpec(row)}
 const prompt=row.description+'\nEvolution requested by the verified GitHub issue author: '+command.instruction+
  '\nPreserve all existing world features unless the user explicitly requests their removal. The current specification is supplied as reference.';
 let proposed=fallbackWorldSpec({...row,description:row.description+' '+command.instruction}),status='fallback';
 if(env.FOUNDRY_ENDPOINT&&env.FOUNDRY_DEPLOYMENT&&env.FOUNDRY_API_KEY&&await reserveFoundryCall(env)){
  try{proposed=await requestWorldSpec(env,prompt,current,fetcher);status='ready'}
  catch(error){console.warn('World evolution used procedural fallback',error?.name)}
 }
 return saveRevision(env,id,v,proposed,status,'edit');
}
export async function rollbackWorld(env,issueNumber,version){
 if(!worldgenEnabled(env))return {status:'disabled'};
 const id=Number(issueNumber),target=Number(version);
 if(!Number.isInteger(id)||id<1||!Number.isInteger(target)||target<1)return {status:'invalid'};
 const row=await fetchWorld(env,id);
 if(!row)return {status:'not-found'};
 const current=Number(row.world_version||0);
 if(current>=MAX_VERSIONS)return {status:'limit'};
 if(target>=current)return {status:'invalid'};
 const old=await env.DB.prepare('SELECT world_spec FROM world_revisions WHERE issue_number=? AND version=?').bind(id,target).first();
 if(!old)return {status:'not-found'};
 return saveRevision(env,id,current,validateWorldSpec(old.world_spec),'restored','rollback');
}
