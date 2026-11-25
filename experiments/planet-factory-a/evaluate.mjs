import {readFileSync} from 'node:fs';
const expected=JSON.parse(readFileSync(new URL('./expected.json',import.meta.url)));
const [path]=process.argv.slice(2);
const data=JSON.parse(readFileSync(path,'utf8'));
if(!Array.isArray(data.results)||data.results.length!==Object.keys(expected).length)throw Error('Incomplete results');
const seen=new Set();
for(const r of data.results){
 if(!Object.hasOwn(expected,r.id)||seen.has(r.id)||r.decision!==expected[r.id])throw Error('Invalid or wrong decision: '+String(r.id));
 seen.add(r.id);
 if(typeof r.description!=='string'||r.description.length>280||(r.decision==='reject'&&r.description!==''))throw Error('Unsafe description');
}
console.log('Synthetic triage decisions pass; manual fidelity review still required');
