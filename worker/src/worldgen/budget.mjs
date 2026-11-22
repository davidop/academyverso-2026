// Daily server-side cap for paid Foundry invocations. One atomic D1 write per attempt.
export async function reserveFoundryCall(env,now=new Date()){
 const configured=Number(env.FOUNDRY_DAILY_MAX||75);
 const limit=Number.isFinite(configured)?Math.max(1,Math.min(500,Math.floor(configured))):75;
 const date=now.toISOString().slice(0,10);
 const key='foundry:'+date;
 const result=await env.DB.prepare(
  "INSERT INTO rates(key,last_at,count) VALUES(?,?,1) "+
  "ON CONFLICT(key) DO UPDATE SET last_at=excluded.last_at,count=rates.count+1 WHERE rates.count<?"
 ).bind(key,now.getTime(),limit).run();
 return Number(result.meta?.changes||0)>0;
}
