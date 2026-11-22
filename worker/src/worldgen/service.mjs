import {fallbackWorldSpec,numberHash} from '../../../web/worlds/spec.mjs';
import {requestWorldSpec} from './foundry.mjs';
export const worldgenEnabled=env=>String(env.WORLDGEN_ENABLED||'false').toLowerCase()==='true';
export async function generateWorldForIssue(env,issue,data,fetcher=fetch){
 if(!worldgenEnabled(env))return {status:'disabled'};
 const n=Number(issue?.number);
 if(!Number.isInteger(n)||n<1)return {status:'invalid'};
 const fingerprint=String(numberHash(n+'|'+data.type+'|'+data.name+'|'+data.description));
 const fallback=fallbackWorldSpec({issue_number:n,...data});
 try{
  const updated=await env.DB.prepare("UPDATE objects SET world_spec=?,world_status='fallback',world_input_hash=?,world_version=world_version+1,world_updated_at=datetime('now') WHERE issue_number=? AND (world_input_hash IS NULL OR world_input_hash<>?)").bind(JSON.stringify(fallback),fingerprint,n,fingerprint).run();
  if(!updated.meta?.changes)return {status:'unchanged'};
  if(!env.FOUNDRY_ENDPOINT||!env.FOUNDRY_API_KEY||!env.FOUNDRY_DEPLOYMENT)return {status:'fallback'};
  try{
   const spec=await requestWorldSpec(env,data.description,fallback,fetcher);
   await env.DB.prepare("UPDATE objects SET world_spec=?,world_status='ready',world_updated_at=datetime('now') WHERE issue_number=? AND world_input_hash=?").bind(JSON.stringify(spec),n,fingerprint).run();
   return {status:'ready'};
  }catch(error){
   console.warn('WorldGen fallback for issue',n,error?.name==='TimeoutError'?'timeout':'model failure');
   return {status:'fallback'};
  }
 }catch(error){
  console.warn('WorldGen storage unavailable, preserving legacy UX',error?.name);
  return {status:'storage-unavailable'};
 }
}
