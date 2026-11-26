import {readFileSync} from 'node:fs';
const load=name=>JSON.parse(readFileSync(new URL('./'+name,import.meta.url),'utf8'));
const str=v=>typeof v==='string';
// Fragmentos distintivos de las fixtures que deben rechazarse: ni la descripción ni el motivo
// pueden repetirlos (el prompt prohíbe reproducir texto malicioso o comercial).
const forbiddenFragments=fixtures=>fixtures.flatMap(f=>String(f.description||'').toLowerCase().split(/[,.;:]\s*/).map(x=>x.trim()).filter(x=>x.length>=12));

export function evaluate(data,expected,fixtures){
 if(!data||typeof data!=='object'||!Array.isArray(data.results))throw Error('Missing results array');
 if(data.results.length!==Object.keys(expected).length)throw Error('Incomplete results');
 const rejectedText=forbiddenFragments(fixtures.filter(f=>expected[f.id]==='reject'));
 const seen=new Set();
 for(const r of data.results){
  if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Result is not an object');
  if(!Object.hasOwn(expected,r.id)||seen.has(r.id)||r.decision!==expected[r.id])throw Error('Invalid or wrong decision: '+String(r.id));
  seen.add(r.id);
  if(!str(r.description)||r.description.length>280)throw Error('Invalid description: '+r.id);
  if(r.decision==='accept'&&!r.description.trim())throw Error('Accepted fixture without description: '+r.id);
  if(r.decision==='reject'&&r.description!=='')throw Error('Rejected fixture must not get a description: '+r.id);
  if(!str(r.reason)||!r.reason.trim()||r.reason.length>280)throw Error('Missing or invalid reason: '+r.id);
  const text=(r.description+' '+r.reason).toLowerCase();
  if(rejectedText.some(fragment=>text.includes(fragment)))throw Error('Output repeats rejected fixture text: '+r.id);
 }
 return 'Synthetic triage decisions pass; manual fidelity review still required';
}

if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1].replace(/\\/g,'/').replace(/^\/?/,'/')).href){
 const [path]=process.argv.slice(2);
 if(!path){console.error('Usage: node evaluate.mjs <triage.json>');process.exit(2);}
 try{console.log(evaluate(JSON.parse(readFileSync(path,'utf8')),load('expected.json'),load('fixtures.json')));}
 catch(e){console.error('FAIL: '+e.message);process.exit(1);}
}
