// Public campaign metadata; all actual contributions continue to be GitHub Issues.
// Stable tags are included in the first line of the existing description field.
// No DB migration, secret or new endpoint is required.
export const TERRAFORMING_MISSIONS=Object.freeze([
  Object.freeze({
    id:'vice-nebula',label:'Vice Nebula',tag:'[GTA:VICE-NEBULA]',
    title:'Construir Vice Nebula',type:'planeta',name:'Distrito Neón',
    description:'Una ciudad orbital luminosa con avenidas flotantes, coches antigravedad y rascacielos que responden a los agentes de IA.'
  }),
  Object.freeze({
    id:'colonia-centinela',label:'Colonia Centinela',tag:'[GTA:COLONIA-CENTINELA]',
    title:'Construir Colonia Centinela',type:'planeta',name:'Bastión Centinela',
    description:'Una colonia espacial sostenible con drones de rescate, cúpulas de cristal y rutas seguras creadas por agentes de IA.'
  })
]);
export function terraformMissionFor(description){
  const content=String(description??'').trim().toUpperCase();
  return TERRAFORMING_MISSIONS.find(m=>content.startsWith(m.tag.toUpperCase()))||null;
}
export function terraformCounts(objects=[]){
  const counts=Object.fromEntries(TERRAFORMING_MISSIONS.map(m=>[m.id,0]));
  for(const obj of objects){const mission=terraformMissionFor(obj?.description);if(mission)counts[mission.id]++;}
  return counts;
}
export function terraformProposal(missionId){
  const mission=TERRAFORMING_MISSIONS.find(m=>m.id===missionId);
  if(!mission)throw new Error('Misión desconocida');
  return {type:mission.type,name:mission.name,description:`${mission.tag} ${mission.description}`};
}
export function terraformGitHubUrl(missionId,repo='davidop/academyverso-2026'){
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))throw new Error('Repositorio inválido');
  const proposal=terraformProposal(missionId);
  const query=new URLSearchParams({template:'crear-objeto.yml',tipo:proposal.type,nombre:proposal.name,descripcion:proposal.description,title:'Nuevo objeto cósmico: '+proposal.name});
  return `https://github.com/${repo}/issues/new?${query.toString()}`;
}
