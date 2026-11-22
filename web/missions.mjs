// Fictional, local-only GTA VII exploration milestones. No personal data or D1 writes.
export const MISSIONS=Object.freeze(['vice-nebula','colonia-centinela']);
export const POI_KINDS=Object.freeze(['volcano','floating_city','dome']);
export const emptyMissionState=()=>({visited:[],discovered:[]});
export function missionStars(state){
 const visited=Math.min(2,state.visited.length);
 const poi=Math.min(3,state.discovered.length);
 return Math.min(5,visited+poi);
}
export function missionProgress(state){
 return {stars:missionStars(state),visited:state.visited.length,points:state.discovered.length,complete:missionStars(state)>=5};
}
export function advanceMission(state,event){
 const current=state||emptyMissionState();
 if(!event||!MISSIONS.includes(event.mission))return current;
 if(event.kind==='world-reached'){
  if(current.visited.includes(event.mission))return current;
  return {...current,visited:[...current.visited,event.mission]};
 }
 if(event.kind==='poi-discovered'&&current.visited.includes(event.mission)&&POI_KINDS.includes(event.poi)){
  const id=event.mission+':'+event.poi;
  if(current.discovered.includes(id))return current;
  return {...current,discovered:[...current.discovered,id]};
 }
 return current;
}
