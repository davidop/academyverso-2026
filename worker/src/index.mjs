import {parseWorldCommand,authorizedWorldComment,evolveWorld,rollbackWorld} from './worldgen/history.mjs';
import {generateWorldForIssue,worldgenEnabled} from './worldgen/service.mjs';
import {validate,parseIssue,issueBody} from './validation.mjs';
const HEAD={'content-type':'application/json;charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{...HEAD,...headers}});

function issueEditToken(){
 const bytes=crypto.getRandomValues(new Uint8Array(32));
 return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function tokenDigest(token){
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
 return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
function equalConstantTime(actual,expected){
 if(typeof actual!=='string'||typeof expected!=='string'||actual.length!==expected.length)return false;
 let diff=0;for(let i=0;i<actual.length;i++)diff|=actual.charCodeAt(i)^expected.charCodeAt(i);
 return diff===0;
}

const originHeaders=(origin,env)=>{const allowed=String(env.ALLOWED_ORIGIN||'');return origin&&origin===allowed?{'access-control-allow-origin':origin,'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,authorization','vary':'origin'}:{'vary':'origin'}};
async function upsert(env,issue,data){await env.DB.prepare(`INSERT INTO objects(issue_number,type,name,alias,description,issue_url,created_at,hidden,enriched) VALUES(?,?,?,?,?,?,datetime('now'),0,0) ON CONFLICT(issue_number) DO UPDATE SET type=excluded.type,name=excluded.name,alias=excluded.alias,description=excluded.description,issue_url=excluded.issue_url`).bind(issue.number,data.type,data.name,data.alias,data.description,issue.html_url).run()}
async function enrich(env,issueNo,data){if(!env.AI)return;try{const text=await env.AI.run('@cf/meta/llama-3.1-8b-instruct',{messages:[{role:'system',content:'Eres un asistente de diseño de mundos infantiles. Reescribe la descripción dada en una frase positiva y apta para todos los públicos, 100 caracteres máximo. No inventes funciones técnicas. Devuelve SOLO una frase.'},{role:'user',content:data.description}]});const description=String(text.response||'').trim().slice(0,100);if(description)await env.DB.prepare('UPDATE objects SET enriched=1, ai_detail=? WHERE issue_number=?').bind(description,issueNo).run()}catch(e){console.warn('Enrichment skipped',e?.message)}}
async function rateLimit(env,ip){const since=Date.now()-3600_000;const key=`ip:${ip}`;const prior=await env.DB.prepare('SELECT last_at,count FROM rates WHERE key=?').bind(key).first();if(prior&&prior.last_at>since&&prior.count>=5)throw new Error('Límite de 5 creaciones por hora alcanzado');await env.DB.prepare('INSERT INTO rates(key,last_at,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET last_at=excluded.last_at,count=CASE WHEN rates.last_at<? THEN 1 ELSE rates.count+1 END').bind(key,Date.now(),since).run()}
async function verifyHmac(request,raw,secret){const sig=request.headers.get('x-academyverso-signature')||'';const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(raw));const expected='sha256='+Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');return sig.length===expected.length&&[...sig].reduce((a,ch,i)=>a|(ch.charCodeAt(0)^expected.charCodeAt(i)),0)===0}
export default {async fetch(request,env,ctx){const url=new URL(request.url);const origin=request.headers.get('origin');const cors=originHeaders(origin,env);const respond=(obj,code=200)=>json(obj,code,cors);if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});if(origin&&origin!==env.ALLOWED_ORIGIN)return respond({error:'Origen no permitido'},403);
 try{
 if(url.pathname==='/api/health'){
   if(!env.DB)return respond({ok:false,database_connected:false,error:'D1 no vinculada'},503);
   try{
     const check=await env.DB.prepare("SELECT COUNT(*) AS total FROM sqlite_master WHERE type='table' AND name IN ('objects','rates')").first();
     const ready=Number(check?.total||0)===2;
     return respond({ok:ready,database_connected:ready,repo:env.GITHUB_REPO||'davidop/academyverso-2026',ai_enabled:!!env.AI,create_enabled:!!env.GITHUB_TOKEN},ready?200:503);
   }catch(err){console.warn('D1 health check failed',err?.message);return respond({ok:false,database_connected:false,error:'D1 no disponible'},503)}
 }
 if(url.pathname==='/api/objects'&&request.method==='GET'){const fields=worldgenEnabled(env)?'issue_number,type,name,alias,description,issue_url,ai_detail,enriched,created_at,world_spec,world_status,world_version':'issue_number,type,name,alias,description,issue_url,ai_detail,enriched,created_at';const result=await env.DB.prepare('SELECT '+fields+' FROM objects WHERE hidden=0 ORDER BY issue_number DESC LIMIT 200').all();return respond({objects:result.results||[]})}
 if(/^\/api\/worlds\/\d+\/history$/.test(url.pathname)&&request.method==='GET'){
  if(!worldgenEnabled(env))return respond({error:'Historial de mundos desactivado'},503);
  const id=Number(url.pathname.split('/')[3]);
  const row=await env.DB.prepare('SELECT issue_number FROM objects WHERE issue_number=? AND hidden=0').bind(id).first();
  if(!row)return respond({error:'Mundo no encontrado'},404);
  const history=await env.DB.prepare('SELECT version,world_status,origin,created_at FROM world_revisions WHERE issue_number=? ORDER BY version DESC LIMIT 12').bind(id).all();
  return respond({issue_number:id,versions:history.results||[]});
 }
 const worldMutation=url.pathname.match(/^\/api\/worlds\/(\d+)\/(evolve|rollback)$/);
 if(worldMutation&&request.method==='POST'){
  if(!worldgenEnabled(env))return respond({error:'Evolución de mundos desactivada'},503);
  const id=Number(worldMutation[1]),op=worldMutation[2];
  const token=(request.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
  if(!/^[A-Za-z0-9_-]{43}$/.test(token))return respond({error:'Identificación necesaria'},401);
  const candidate=await env.DB.prepare('SELECT world_owner_token_hash FROM objects WHERE issue_number=? AND hidden=0').bind(id).first();
  if(!candidate?.world_owner_token_hash||!equalConstantTime(candidate.world_owner_token_hash,await tokenDigest(token)))return respond({error:'No autorizado'},403);
  const bodyText=await request.text();
  if(bodyText.length>600)return respond({error:'Solicitud excesiva'},413);
  const body=JSON.parse(bodyText);
  await rateLimit(env,'evolution:'+id+':'+(request.headers.get('cf-connecting-ip')||'unknown'));
  const result=op==='evolve'?await evolveWorld(env,id,body.instruction):await rollbackWorld(env,id,body.version);
  if(['ready','fallback','restored'].includes(result.status))return respond({ok:true,issue_number:id,...result});
  return respond({error:'Evolución no realizada',code:result.status},result.status==='conflict'?409:result.status==='limit'?429:400);
 }
 if(url.pathname==='/api/create'&&request.method==='POST'){
  if(!env.GITHUB_TOKEN)return respond({error:'Creación web pendiente de activar en Cloudflare',code:'CREATE_NOT_READY'},503);
  const raw=await request.text();if(raw.length>2400)return respond({error:'Solicitud demasiado grande'},413);
  const data=validate(JSON.parse(raw));const ip=request.headers.get('cf-connecting-ip')||'unverified';await rateLimit(env,ip);
  const result=await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`,{method:'POST',headers:{'accept':'application/vnd.github+json','authorization':`Bearer ${env.GITHUB_TOKEN}`,'x-github-api-version':'2022-11-28','user-agent':'AcademyVerso-Worker','content-type':'application/json'},body:JSON.stringify({title:`${data.type}: ${data.name}`,body:issueBody(data)})});
  if(!result.ok){console.error('GitHub create failed',result.status);return respond({error:'GitHub no pudo registrar la creación'},502)}const issue=await result.json();await upsert(env,issue,data);
  let edit_token;
  if(worldgenEnabled(env)){
   try{
    edit_token=issueEditToken();
    await env.DB.prepare('UPDATE objects SET world_owner_token_hash=? WHERE issue_number=?').bind(await tokenDigest(edit_token),issue.number).run();
   }catch(err){console.warn('Owner token not persisted',err?.name);edit_token=undefined}
  }
  ctx.waitUntil(enrich(env,issue.number,data));if(worldgenEnabled(env))ctx.waitUntil(generateWorldForIssue(env,issue,data));
  return respond({issue_number:issue.number,issue_url:issue.html_url,...(edit_token?{edit_token}:{})},201)
 }
 if(url.pathname==='/api/ingest'&&request.method==='POST'){
  const raw=await request.text();if(!env.INGEST_SECRET||!await verifyHmac(request,raw,env.INGEST_SECRET))return respond({error:'Firma incorrecta'},401);
  const incoming=JSON.parse(raw);
  if(!incoming.issue)return respond({ignored:true});
  if(incoming.comment){
   const command=parseWorldCommand(incoming.comment.body);
   if(!command)return respond({ignored:true});
   if(!authorizedWorldComment(incoming))return respond({error:'Solo el autor verificado de la Issue puede evolucionar o restaurar el mundo'},403);
   const id=Number(incoming.issue.number);
   const result=command.action==='evolve'
     ? await evolveWorld(env,id,command.instruction)
     : await rollbackWorld(env,id,command.version);
   if(['ready','fallback','restored'].includes(result.status))return respond({ok:true,issue_number:id,...result});
   const status=result.status==='conflict'?409:result.status==='limit'?429:result.status==='disabled'?503:400;
   return respond({error:'Operación de mundo no realizada',code:result.status,issue_number:id},status);
  }
  if(!['open','closed'].includes(incoming.issue.state))return respond({ignored:true});
  if(worldgenEnabled(env)&&incoming.action==='edited'){
    const author=Number(incoming.issue.user?.id),actor=Number(incoming.sender?.id);
    if(!author||actor!==author)return respond({error:'Solo el autor de la Issue puede modificar su mundo'},403);
  }
  const data=parseIssue(incoming.issue.body);
  await upsert(env,{number:incoming.issue.number,html_url:incoming.issue.html_url},data);
  ctx.waitUntil(enrich(env,incoming.issue.number,data));
  if(worldgenEnabled(env))ctx.waitUntil(generateWorldForIssue(env,{...incoming.issue,worldgen_action:incoming.action},data));
  return respond({ok:true,issue_number:incoming.issue.number})
 }
 if(url.pathname==='/api/admin/hide'&&request.method==='POST'){
  if(!env.ADMIN_TOKEN||request.headers.get('authorization')!==`Bearer ${env.ADMIN_TOKEN}`)return respond({error:'No autorizado'},401);
  const {issue_number,hidden=true}=await request.json();const n=Number(issue_number);if(!Number.isInteger(n)||n<1)return respond({error:'Número de Issue inválido'},400);
  await env.DB.prepare('UPDATE objects SET hidden=? WHERE issue_number=?').bind(hidden?1:0,n).run();return respond({ok:true,issue_number:n,hidden})
 }
 return respond({error:'Ruta no encontrada'},404);
 }catch(e){console.error(e);return respond({error:/^(Tipo|name:|alias:|description:|Texto|Límite)/.test(e.message)?e.message:'Error al procesar la solicitud'},/^(Tipo|name:|alias:|description:|Texto|Límite)/.test(e.message)?400:500)}
 }};
