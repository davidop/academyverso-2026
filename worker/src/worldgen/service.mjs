import {fallbackWorldSpec,numberHash} from '../../../web/worlds/spec.mjs';
import {requestWorldSpec} from './foundry.mjs';

export const worldgenEnabled=env=>String(env.WORLDGEN_ENABLED||'false').toLowerCase()==='true';

async function recordRevision(env,issueNumber,origin,fingerprint){
 // A saved revision is always based on the committed object; never trust user-provided spec data.
 await env.DB.prepare(
  "INSERT INTO world_revisions(issue_number,version,world_spec,world_status,input_hash,origin) " +
  "SELECT issue_number,world_version,world_spec,world_status,world_input_hash,? FROM objects " +
  "WHERE issue_number=? AND world_input_hash=? AND world_version>0 AND world_spec IS NOT NULL " +
  "ON CONFLICT(issue_number,version) DO UPDATE SET " +
  "world_spec=excluded.world_spec,world_status=excluded.world_status,input_hash=excluded.input_hash"
 ).bind(origin,issueNumber,fingerprint).run();
}

export async function generateWorldForIssue(env,issue,data,fetcher=fetch){
 if(!worldgenEnabled(env))return {status:'disabled'};
 const n=Number(issue?.number);
 if(!Number.isInteger(n)||n<1)return {status:'invalid'};
 const fingerprint=String(numberHash(n+'|'+data.type+'|'+data.name+'|'+data.description));
 const fallback=fallbackWorldSpec({issue_number:n,...data});
 const origin=issue?.worldgen_action==='edited'?'edit':'create';
 try{
  // A delayed old event must not overwrite a newer Issue description.
  const update=await env.DB.prepare(
   "UPDATE objects SET world_spec=?,world_status='fallback',world_input_hash=?," +
   "world_version=world_version+1,world_updated_at=datetime('now') " +
   "WHERE issue_number=? AND description=? AND type=? AND name=? " +
   "AND (world_input_hash IS NULL OR world_input_hash<>?)"
  ).bind(JSON.stringify(fallback),fingerprint,n,data.description,data.type,data.name,fingerprint).run();
  if(!update.meta?.changes)return {status:'unchanged'};
  await recordRevision(env,n,origin,fingerprint);
  if(!env.FOUNDRY_ENDPOINT||!env.FOUNDRY_API_KEY||!env.FOUNDRY_DEPLOYMENT)return {status:'fallback'};
  try{
   const spec=await requestWorldSpec(env,data.description,fallback,fetcher);
   const result=await env.DB.prepare(
    "UPDATE objects SET world_spec=?,world_status='ready',world_updated_at=datetime('now') " +
    "WHERE issue_number=? AND world_input_hash=? AND description=?"
   ).bind(JSON.stringify(spec),n,fingerprint,data.description).run();
   if(!result.meta?.changes)return {status:'superseded'};
   await recordRevision(env,n,origin,fingerprint);
   return {status:'ready'};
  }catch(error){
   console.warn('WorldGen fallback for issue',n,error?.name==='TimeoutError'?'timeout':'model failure');
   return {status:'fallback'};
  }
 }catch(error){
  console.warn('WorldGen storage unavailable; legacy scene remains operational',error?.name);
  return {status:'storage-unavailable'};
 }
}
