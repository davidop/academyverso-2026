import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {validateWorldSpec} from '../../web/worlds/spec.mjs';
const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);

// El bundle siempre se escribe, también si un subagente rechaza o falla, para poder inspeccionarlo.
// Solo un bundle "complete", aprobado sin hallazgos y con un WorldSpecV1 válido cuenta como acierto.
export function evaluate(x){
 if(!isObject(x))throw Error('Bundle is not a JSON object');
 if(x.status!=='complete'){
  if(!['rejected','failed'].includes(x.status)||!['designer','builder','reviewer'].includes(x.stage))throw Error('Bundle has an invalid status or stage');
  const findings=isObject(x.review)&&Array.isArray(x.review.findings)?': '+x.review.findings.join('; '):'';
  throw Error('Bundle '+x.status+' at '+x.stage+findings);
 }
 if(x.stage!==null)throw Error('Complete bundle must not name a stage');
 if(!isObject(x.brief)||x.brief.decision!=='accept'||!Array.isArray(x.brief.requirements))throw Error('Brief not accepted');
 if(!isObject(x.review)||x.review.decision!=='approve'||!Array.isArray(x.review.findings)||x.review.findings.length)throw Error('Review did not approve without findings');
 const v=validateWorldSpec(x.spec);
 if(v.features.reduce((n,f)=>n+f.count,0)>24)throw Error('Feature budget exceeded');
 return 'Bundle structurally accepted; independently verify actual subagent invocations and fidelity';
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [path]=process.argv.slice(2);
 if(!path){console.error('Usage: node evaluate.mjs <bundle.json>');process.exit(2);}
 try{console.log(evaluate(JSON.parse(readFileSync(path,'utf8'))));}
 catch(e){console.error('FAIL: '+e.message);process.exit(1);}
}
