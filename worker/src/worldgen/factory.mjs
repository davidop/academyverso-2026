import {validateWorldSpec,numberHash} from '../../../web/worlds/spec.mjs';
import {parseIssue,hasTriageMarker} from '../validation.mjs';
export const FACTORY_MARKER='[academyverso-factory:ready:v1]';
export const factoryEnabled=env=>String(env.PLANET_FACTORY_ENABLED||'false').toLowerCase()==='true';
export const hasFactoryMarker=body=>String(body||'').includes('academyverso-factory:ready:v1');
const HEX=/^[0-9a-f]{64}$/;
const fail=()=>{throw Error('Texto de factoría no verificado')};
export async function sha256(bytes){
 const d=await crypto.subtle.digest('SHA-256',typeof bytes==='string'?new TextEncoder().encode(bytes):bytes);
 return Array.from(new Uint8Array(d),b=>b.toString(16).padStart(2,'0')).join('');
}
export function validateFactorySpec(value,type){
 const s=validateWorldSpec(value);
 const archetype={estrella:'star',luna:'moon',estacion:'station',asteroide:'asteroid','agujero-negro':'black_hole'}[type];
 if(archetype?s.archetype!==archetype:type!=='planeta'||!['terrestrial','ocean','volcanic','ice'].includes(s.archetype))fail();
 if(new Set(s.features.map(f=>f.kind)).size!==s.features.length||s.features.reduce((n,f)=>n+f.count,0)>24)fail();
 return s;
}
function onlyField(text,name){
 const lines=text.split(/\r?\n/).filter(x=>x.startsWith(name+': '));
 if(lines.length!==1)fail();
 return lines[0].slice(name.length+2);
}
export async function parseFactoryCandidate(incoming,data,env){
 const issue=incoming.issue,body=String(incoming.triage_comment?.body||''),bot=String(env.TRIAGE_BOT||'');
 if(!bot.endsWith('[bot]')||incoming.sender?.login!==bot||incoming.triage_comment?.user?.login!==bot||
   incoming.action!=='labeled'||incoming.label?.name!=='planet:ready'||incoming.repository?.full_name!==env.GITHUB_REPO||
   !Number.isSafeInteger(issue?.number)||issue.number<1||issue.html_url!=='https://github.com/'+env.GITHUB_REPO+'/issues/'+issue.number||
   !hasTriageMarker(issue.body)||!hasTriageMarker(body)||body.length>26000||body.split(/\r?\n/).filter(l=>l===FACTORY_MARKER).length!==1)fail();
 const original=parseIssue(issue.body);
 for(const k of ['type','name','alias','description'])if(original[k]!==data[k])fail();
 if(onlyField(body,'factory-issue')!==String(issue.number))fail();
 // Tipo, nombre y alias salen del cuerpo del evento: solo valen si es exactamente el cuerpo que publicó la factoría.
 const bodyHash=onlyField(body,'factory-body-sha256');
 if(!HEX.test(bodyHash)||await sha256(String(issue.body))!==bodyHash)fail();
 const expected=onlyField(body,'factory-spec-sha256'),encoded=onlyField(body,'factory-spec-base64');
 if(!HEX.test(expected)||!encoded||encoded.length>21846||!/^[A-Za-z0-9_-]+$/.test(encoded))fail();
 let bytes,raw;
 try{const base=encoded.replace(/-/g,'+').replace(/_/g,'/');bytes=Uint8Array.from(atob(base+'='.repeat((4-base.length%4)%4)),x=>x.charCodeAt(0));raw=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}
 catch(_){fail();}
 if(bytes.length<1||bytes.length>16384||await sha256(bytes)!==expected)fail();
 validateFactorySpec(raw,data.type);
 const publicationHash=await sha256(JSON.stringify([issue.number,data.type,data.name,data.alias,data.description,expected]));
 const inputHash=String(numberHash(issue.number+'|'+data.type+'|'+data.name+'|'+data.description));
 return {raw,specHash:expected,publicationHash,inputHash};
}
// Atomic D1 batch: exact reviewed bytes and history appear together, without regeneration.
// An existing legacy/blocked/admin-hidden or differently published row is not overwritten.
export async function persistFactoryCandidate(env,issue,data,candidate){
 const db=env.DB,n=issue.number;
 const write=db.prepare(
  "INSERT INTO objects(issue_number,type,name,alias,description,issue_url,created_at,hidden,enriched,world_spec,world_status,world_version,world_input_hash,world_updated_at,factory_state,factory_hash) "+
  "VALUES(?,?,?,?,?,?,datetime('now'),0,0,?,'ready',1,?,datetime('now'),'published',?) "+
  "ON CONFLICT(issue_number) DO UPDATE SET type=excluded.type,name=excluded.name,alias=excluded.alias,description=excluded.description,issue_url=excluded.issue_url,hidden=0,world_spec=excluded.world_spec,world_status='ready',world_version=objects.world_version+1,world_input_hash=excluded.world_input_hash,world_updated_at=datetime('now'),factory_state='published',factory_hash=excluded.factory_hash "+
  "WHERE objects.factory_state='pending' AND objects.hidden=1 AND objects.factory_hash IS NULL"
 ).bind(n,data.type,data.name,data.alias,data.description,issue.html_url,candidate.raw,candidate.inputHash,candidate.publicationHash);
 const history=db.prepare(
  "INSERT OR IGNORE INTO world_revisions(issue_number,version,world_spec,world_status,input_hash,origin) "+
  "SELECT issue_number,world_version,world_spec,world_status,world_input_hash,'create' FROM objects "+
  "WHERE issue_number=? AND factory_state='published' AND factory_hash=? AND world_spec=? AND world_status='ready'"
 ).bind(n,candidate.publicationHash,candidate.raw);
 await db.batch([write,history]);
 const row=await db.prepare("SELECT factory_hash FROM objects WHERE issue_number=? AND factory_state='published'").bind(n).first();
 return row?.factory_hash===candidate.publicationHash;
}
