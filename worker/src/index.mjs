import {validate,parseIssue,issueBody} from './validation.mjs';
const HEAD={'content-type':'application/json;charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{...HEAD,...headers}});
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
 if(url.pathname==='/api/objects'&&request.method==='GET'){const result=await env.DB.prepare('SELECT issue_number,type,name,alias,description,issue_url,ai_detail,enriched,created_at FROM objects WHERE hidden=0 ORDER BY issue_number DESC LIMIT 200').all();return respond({objects:result.results||[]})}
 if(url.pathname==='/api/create'&&request.method==='POST'){
  if(!env.GITHUB_TOKEN)return respond({error:'Creación web pendiente de activar en Cloudflare',code:'CREATE_NOT_READY'},503);
  const raw=await request.text();if(raw.length>2400)return respond({error:'Solicitud demasiado grande'},413);
  const data=validate(JSON.parse(raw));const ip=request.headers.get('cf-connecting-ip')||'unverified';await rateLimit(env,ip);
  const result=await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`,{method:'POST',headers:{'accept':'application/vnd.github+json','authorization':`Bearer ${env.GITHUB_TOKEN}`,'x-github-api-version':'2022-11-28','user-agent':'AcademyVerso-Worker','content-type':'application/json'},body:JSON.stringify({title:`${data.type}: ${data.name}`,body:issueBody(data)})});
  if(!result.ok){console.error('GitHub create failed',result.status);return respond({error:'GitHub no pudo registrar la creación'},502)}const issue=await result.json();await upsert(env,issue,data);ctx.waitUntil(enrich(env,issue.number,data));return respond({issue_number:issue.number,issue_url:issue.html_url},201)
 }
 if(url.pathname==='/api/ingest'&&request.method==='POST'){
  const raw=await request.text();if(!env.INGEST_SECRET||!await verifyHmac(request,raw,env.INGEST_SECRET))return respond({error:'Firma incorrecta'},401);
  const incoming=JSON.parse(raw);if(!incoming.issue||incoming.issue.state!=='open')return respond({ignored:true});
  const data=parseIssue(incoming.issue.body);await upsert(env,{number:incoming.issue.number,html_url:incoming.issue.html_url},data);ctx.waitUntil(enrich(env,incoming.issue.number,data));return respond({ok:true,issue_number:incoming.issue.number})
 }
 if(url.pathname==='/api/admin/hide'&&request.method==='POST'){
  if(!env.ADMIN_TOKEN||request.headers.get('authorization')!==`Bearer ${env.ADMIN_TOKEN}`)return respond({error:'No autorizado'},401);
  const {issue_number,hidden=true}=await request.json();const n=Number(issue_number);if(!Number.isInteger(n)||n<1)return respond({error:'Número de Issue inválido'},400);
  await env.DB.prepare('UPDATE objects SET hidden=? WHERE issue_number=?').bind(hidden?1:0,n).run();return respond({ok:true,issue_number:n,hidden})
 }
 return respond({error:'Ruta no encontrada'},404);
 }catch(e){console.error(e);return respond({error:/^(Tipo|name:|alias:|description:|Texto|Límite)/.test(e.message)?e.message:'Error al procesar la solicitud'},/^(Tipo|name:|alias:|description:|Texto|Límite)/.test(e.message)?400:500)}
 }};
