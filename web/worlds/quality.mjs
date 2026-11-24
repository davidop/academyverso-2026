export const LEVELS=Object.freeze(['low','medium','high']);
export const pixelRatioFor=(quality,deviceRatio=1)=>Math.min(deviceRatio,quality==='high'?2:quality==='medium'?1.4:1);
export function initialQuality(cores=4,pixelRatio=1){
 return cores>=10&&pixelRatio<=2?'high':cores>=6?'medium':'low';
}
export function adaptiveQuality(previous,fps){
 const index=LEVELS.indexOf(previous);
 if(index<0)return 'low';
 if(!Number.isFinite(fps))return previous;
 if(fps<25&&index>0)return LEVELS[index-1];
 if(fps>56&&index<LEVELS.length-1)return LEVELS[index+1];
 return previous;
}
