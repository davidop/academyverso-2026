import {readFileSync} from 'node:fs';
import {validateWorldSpec} from '../../web/worlds/spec.mjs';
const x=JSON.parse(readFileSync(process.argv[2],'utf8'));
if(x.brief?.decision!=='accept'||!Array.isArray(x.brief?.requirements)||x.review?.decision!=='approve'||!Array.isArray(x.review.findings)||x.review.findings.length)throw Error('Bundle rejected');
const v=validateWorldSpec(x.spec);
if(v.features.reduce((n,f)=>n+f.count,0)>24)throw Error('Feature budget exceeded');
console.log('Bundle structurally accepted; independently verify actual subagent invocations and fidelity');
