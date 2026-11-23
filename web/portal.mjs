// AcademyVerso 2026: deterministic, frontend-only portal navigation.
// World IDs always come from accepted API objects (or visibly labelled offline demo data).
import {flightPose,numberHash} from './travel.mjs';
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
export function portalChoices(objects=[]){
  const seen=new Set();
  return [...objects].filter(world=>{
    const id=Number(world?.issue_number);
    if(!Number.isSafeInteger(id)||id<1||!String(world?.name||'').trim()||seen.has(id))return false;
    seen.add(id);return true;
  }).sort((a,b)=>a.issue_number-b.issue_number).slice(0,200);
}
export function selectPortalPair(objects,preferred={}){
  const choices=portalChoices(objects);
  if(choices.length<2)return null;
  const source=choices.find(x=>String(x.issue_number)===String(preferred.source))||choices[0];
  const target=choices.find(x=>String(x.issue_number)===String(preferred.target)&&x.issue_number!==source.issue_number)
    ||choices.find(x=>x.issue_number!==source.issue_number);
  return target?{source,target}:null;
}
// Segment-by-segment camera route: approach the origin, cross, arrive at destination.
// The transition is a visualization, not real-time 3D teleport/network travel.
export function portalFlightPose(flight,now){
  const duration=Math.max(0,Number(flight.duration)||0);
  if(duration===0)return {...flight.to,done:true,progress:1,stage:'arrived'};
  const elapsed=Math.max(0,now-flight.startedAt);
  const t=clamp(elapsed/duration);
  const segments=[
    {start:0,end:.32,from:flight.from,to:flight.entry,stage:'approach'},
    {start:.32,end:.74,from:flight.entry,to:flight.exit,stage:'crossing'},
    {start:.74,end:1,from:flight.exit,to:flight.to,stage:'arriving'}
  ];
  const segment=segments.find(s=>t<s.end)||segments[segments.length-1];
  const local=clamp((t-segment.start)/(segment.end-segment.start));
  const pose=flightPose({from:segment.from,to:segment.to,startedAt:0,duration:1},local);
  return {...pose,done:t>=1,progress:t,stage:t>=1?'arrived':segment.stage};
}
export function portalColor(issueNumber){
  return numberHash('academyverso-portal-'+String(issueNumber))%2===0?0x68f6df:0xd9a2ff;
}
