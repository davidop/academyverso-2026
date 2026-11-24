// Public client helpers for authenticated world changes; never interpolate untrusted HTML.
export function evolutionComment(instruction){
 const value=String(instruction??'').trim();
 if(value.length<8||value.length>240||/https?:\/\/|www\.|[<>]/i.test(value))throw Error('Introduce una instrucción de 8 a 240 caracteres, sin enlaces');
 return '/academyverso-evolve '+value;
}
export const worldUrl=(api,issueNumber,action)=>{
 const id=Number(issueNumber);
 if(!Number.isSafeInteger(id)||id<1||!['evolve','rollback','history'].includes(action))throw Error('Parámetros de mundo inválidos');
 return String(api).replace(/\/$/,'')+'/api/worlds/'+id+'/'+action;
};
export async function mutateWorld(api,id,action,token,payload,fetcher=fetch){
 if(!['evolve','rollback'].includes(action))throw Error('Acción no permitida');
 if(!/^[A-Za-z0-9_-]{43}$/.test(token))throw Error('Introduce la clave de edición privada de 43 caracteres');
 const response=await fetcher(worldUrl(api,id,action),{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+token},body:JSON.stringify(payload)});
 const data=await response.json();
 if(!response.ok)throw Error(data.error||'No se pudo evolucionar el mundo');
 return data;
}
