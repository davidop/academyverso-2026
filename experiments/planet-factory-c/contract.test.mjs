import test from 'node:test';
import assert from 'node:assert/strict';
import {brief,spec,review,hash} from './contract.mjs';
import {fallbackWorldSpec} from '../../web/worlds/spec.mjs';
test('brief accepts only bounded design or rejects closed',()=>{
 assert.equal(brief({decision:'accept',concept:'Oceans',requirements:['three moons']}).decision,'accept');
 assert.throws(()=>brief({decision:'reject',concept:'bad',requirements:[]}));
 assert.throws(()=>brief({decision:'accept',concept:'x',requirements:[],code:'eval()'}));
});
test('spec rejects unknown executable fields',()=>{
 const valid=fallbackWorldSpec({issue_number:1,type:'planeta',description:'tres lunas'});
 assert.doesNotThrow(()=>spec(valid));
 assert.throws(()=>spec({...valid,script:'alert(1)'}));
});
test('factory candidate accepts only validated declarative ring glow',()=>{
 const value=fallbackWorldSpec({issue_number:130,type:'planeta',name:'Marea Azul',description:'Anillo dorado que brilla al amanecer'});
 assert.equal(value.features.find(f=>f.kind==='ring').glow,'dawn');
 assert.doesNotThrow(()=>spec(value,{type:'planeta'}));
});
test('review must approve exact hash and contain no findings',()=>{
 const h=hash('candidate');
 assert.doesNotThrow(()=>review({decision:'approve',spec_sha256:h,findings:[]},h));
 assert.throws(()=>review({decision:'approve',spec_sha256:hash('different'),findings:[]},h));
 assert.throws(()=>review({decision:'reject',spec_sha256:h,findings:[]},h));
 assert.throws(()=>review({decision:'approve',spec_sha256:h,findings:['missing moon']},h));
});

import {prepareProposal} from './prepare.mjs';
import {labelPlan,publication} from './stages.mjs';
import {classifyBrief} from './contract.mjs';
import {issueBody,parseIssue} from '../../worker/src/validation.mjs';
test('fixture selection and deterministic preparation',()=>{
 assert.equal(prepareProposal(null,'reject').source,'fixture');
 assert.throws(()=>prepareProposal(null,'../../secret'));
 const data={type:'planeta',alias:'QA',name:'Nexus',description:'[GTA:VICE-NEBULA] Planeta oceánico con tres lunas'};
 const event={action:'opened',issue:{number:42,state:'open',body:issueBody(data)}};
 const p=prepareProposal(event);assert.equal(p.description,data.description);
 assert.equal(prepareProposal({...event,action:'reopened'}).issue_number,42);
 assert.throws(()=>prepareProposal({...event,issue:{...event.issue,body:event.issue.body+'\n### Tipo de objeto\nplaneta'}}));
 assert.throws(()=>classifyBrief({decision:'accept',concept:'Sin marcador',requirements:[]},p));
 assert.equal(classifyBrief({decision:'reject',concept:'No apta',requirements:[]},p),'reject');
});
test('labels are a projection, never a way to bypass sequencing',()=>{
 assert.deepEqual(labelPlan(['cosmic-object','planet:admission'],'planet:design'),{add:'planet:design',remove:['planet:admission']});
 assert.throws(()=>labelPlan(['planet:design'],'planet:ready'));
 assert.deepEqual(labelPlan(['planet:ready'],'planet:held'),{add:null,remove:[]});
 assert.throws(()=>labelPlan(['planet:build','planet:review'],'planet:ready'));
});
test('only a deliberately reopened held issue can restart at admission',()=>{
 assert.deepEqual(labelPlan(['planet:held'],'planet:admission',{allowHeldRetry:true}),{add:'planet:admission',remove:['planet:held']});
 assert.throws(()=>labelPlan(['planet:held'],'planet:admission'));
 assert.throws(()=>labelPlan(['planet:ready'],'planet:admission',{allowHeldRetry:true}));
});
test('publication binds exact candidate, issue snapshot, curated text and review',()=>{
 const data={type:'planeta',alias:'QA',name:'Nexus',description:'Planeta oceánico con tres lunas'};
 const body=issueBody(data),p=prepareProposal({action:'opened',issue:{number:42,state:'open',body}});
 const value=fallbackWorldSpec({issue_number:42,...data}),bytes=Buffer.from(JSON.stringify(value,null,2)+'\n');
 const candidate={value,bytes,digest:hash(bytes)},design={decision:'accept',concept:'Planeta oceánico con tres lunas.',requirements:['tres lunas']},verdict={decision:'approve',spec_sha256:candidate.digest,findings:[]};
 const pub=publication(p,design,candidate,verdict,body);
 assert.equal(parseIssue(pub.body).description,design.concept);
 assert.ok(pub.comment.includes(candidate.digest));
 assert.ok(pub.comment.includes(bytes.toString('base64url')));
 assert.throws(()=>publication(p,design,candidate,verdict,body+'edit'));
 assert.throws(()=>publication(p,design,candidate,{...verdict,spec_sha256:hash('other')},body));
});

test('raw HTML and links fail deterministic admission rather than being cleaned away',()=>{
 const body=issueBody({type:'planeta',alias:'QA',name:'Nexus',description:'Planeta oceánico con tres lunas'});
 const event={action:'opened',issue:{number:42,state:'open',body:body.replace('tres lunas','tres lunas <span>oculto</span>')}};
 assert.throws(()=>prepareProposal(event),ProposalRejected);
});

import {ProposalRejected} from './prepare.mjs';
function publishFor(body,n=42){
 const p=prepareProposal({action:'opened',issue:{number:n,state:'open',body}});
 const data={type:p.type,name:p.name,alias:p.alias,description:p.description};
 const value=fallbackWorldSpec({issue_number:n,...data}),bytes=Buffer.from(JSON.stringify(value,null,2)+'\n');
 const candidate={value,bytes,digest:hash(bytes)},design={decision:'accept',concept:'Planeta azul con tres lunas.',requirements:['tres lunas']};
 return publication(p,design,candidate,{decision:'approve',spec_sha256:candidate.digest,findings:[]},body);
}
test('publication replaces a multi-line description (LF y CRLF) entera, sin perder la sección siguiente',()=>{
 const lf=issueBody({type:'planeta',alias:'QA',name:'Nexus',description:'Planeta azul\ncon tres lunas visibles'});
 for(const body of [lf,lf.replace(/\n/g,'\r\n'),lf.split('\n\n---')[0]]){
  const pub=publishFor(body);
  assert.equal(parseIssue(pub.body).description,'Planeta azul con tres lunas.');
  assert.doesNotMatch(pub.body,/con tres lunas visibles/);
  assert.equal(parseIssue(pub.body).name,'Nexus');
 }
});
test('el comentario ata la publicación al cuerpo exacto que se publica',()=>{
 const pub=publishFor(issueBody({type:'planeta',alias:'QA',name:'Nexus',description:'Planeta azul con tres lunas'}));
 assert.match(pub.comment,new RegExp('^factory-body-sha256: '+hash(pub.body)+'$','m'));
});
test('el estado terminal se puede aplicar aunque la admisión no llegara a etiquetarse',()=>{
 assert.deepEqual(labelPlan(['cosmic-object'],'planet:held'),{add:'planet:held',remove:[]});
 assert.deepEqual(labelPlan([],'planet:rejected'),{add:'planet:rejected',remove:[]});
 assert.throws(()=>labelPlan([],'planet:ready'));
});
test('los rechazos de contenido son deterministas (rejected); un evento inválido no',()=>{
 const body=issueBody({type:'planeta',alias:'QA',name:'Nexus',description:'Planeta azul con tres lunas'});
 assert.throws(()=>prepareProposal({action:'opened',issue:{number:42,state:'open',body:body.replace('planeta','script')}}),ProposalRejected);
 assert.throws(()=>prepareProposal({action:'opened',issue:{number:42,state:'open',body:body+'\n### Nombre del objeto\nOtro'}}),ProposalRejected);
 assert.throws(()=>prepareProposal({action:'edited',issue:{number:42,state:'open',body}}),e=>!(e instanceof ProposalRejected));
});
