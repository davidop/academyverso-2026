import test from 'node:test';
import assert from 'node:assert/strict';
import {webMcpEnabled,createWebMcpTools,registerWebMcp} from '../webmcp.mjs';

function fixture(){
  let source='demo',phase='galaxy',active=null,webgl=true,busy=false,opened=null;
  let objects=[
    {issue_number:1,type:'planeta',name:'Nexus',description:'Datos públicos',edit_token:'PRIVATE',alias:'private-alias',internal:{secret:'PRIVATE'}},
    {issue_number:2,type:'estrella',name:'Faro',description:'Otra descripción'},
    {issue_number:3,type:'luna',name:'Duplicado A'},
    {issue_number:3,type:'luna',name:'Duplicado B'},
    {issue_number:-1,type:'planeta',name:'Inválido'}
  ];
  const adapter={
    snapshot:()=>({source,objects}),
    canTravel:o=>webgl&&o.issue_number===1,
    navigation:()=>({phase,active_issue_number:active,webgl,secret:'PRIVATE'}),
    explore:o=>{if(busy)return 'UI_BUSY';opened=o.issue_number;return null;},
    travel:o=>{if(busy)return 'UI_BUSY';phase='travelling';active=o.issue_number;return null;},
    returnHome:()=>{if(busy)return 'UI_BUSY';phase='galaxy';active=null;return null;}
  };
  const tools=createWebMcpTools(adapter);
  const call=(name,input={},options)=>tools.find(t=>t.name===name).execute(input,options);
  return {adapter,tools,call,setSource:v=>source=v,setObjects:v=>objects=v,setBusy:v=>busy=v,setWebgl:v=>webgl=v,opened:()=>opened};
}

test('WebMCP requires exact opt-in, never runs in embed',()=>{
  assert.equal(webMcpEnabled(''),false);
  assert.equal(webMcpEnabled('?webmcp=0'),false);
  assert.equal(webMcpEnabled('?webmcp=1'),true);
  assert.equal(webMcpEnabled('?webmcp=1',true),false);
});

test('allowlisted tools only; no server write tools or private fields',()=>{
  const f=fixture();
  assert.deepEqual(f.tools.map(t=>t.name),['list_cosmic_objects','explore_cosmic_object','travel_to_cosmic_object','get_navigation_state','return_to_galaxy']);
  assert.equal(f.tools[0].annotations.readOnlyHint,true);
  assert.equal(f.tools[0].annotations.untrustedContentHint,true);
  assert.equal(f.tools[1].annotations.readOnlyHint,false);
  const result=f.call('list_cosmic_objects');
  assert.equal(result.source,'demo');
  assert.equal(result.total,2);
  assert.deepEqual(result.objects,[{issue_number:1,type:'planeta',name:'Nexus',travel_available:true},{issue_number:2,type:'estrella',name:'Faro',travel_available:false}]);
  for(const r of [result,f.call('explore_cosmic_object',{issue_number:1}),f.call('get_navigation_state')]){
    assert.doesNotMatch(JSON.stringify(r),/PRIVATE|private-alias|edit_token|internal/);
  }
});

test('filters, pagination, bounds and current data provenance',()=>{
  const f=fixture();
  assert.equal(f.call('list_cosmic_objects',{type:'estrella'}).total,1);
  assert.equal(f.call('list_cosmic_objects',{limit:1,offset:1}).objects[0].issue_number,2);
  for(const input of [null,[],{limit:0},{limit:51},{limit:1.2},{offset:-1},{offset:201},{type:'unknown'},{query:'x'},{limit:'1'}]){
    assert.equal(f.call('list_cosmic_objects',input).error.code,'INVALID_INPUT');
  }
  f.setSource('live');
  f.setObjects([]);
  assert.deepEqual(f.call('list_cosmic_objects'),{ok:true,source:'live',total:0,offset:0,objects:[]});
  f.setSource('cached');
  assert.equal(f.call('get_navigation_state').source,'cached');
});

test('exploration and navigation validate IDs and return actual phase',()=>{
  const f=fixture();
  for(const id of [0,-1,1.5,'1',Number.MAX_SAFE_INTEGER+1]){
    assert.equal(f.call('explore_cosmic_object',{issue_number:id}).error.code,'INVALID_INPUT');
  }
  for(const id of [3,99])assert.equal(f.call('explore_cosmic_object',{issue_number:id}).error.code,'OBJECT_NOT_FOUND');
  assert.equal(f.call('explore_cosmic_object',{issue_number:1,extra:1}).error.code,'INVALID_INPUT');
  assert.equal(f.call('explore_cosmic_object',{issue_number:1}).status,'opened');
  assert.equal(f.opened(),1);
  assert.equal(f.call('travel_to_cosmic_object',{issue_number:2}).error.code,'TRAVEL_UNAVAILABLE');
  assert.equal(f.call('travel_to_cosmic_object',{issue_number:1}).phase,'travelling');
  assert.equal(f.call('get_navigation_state').active_issue_number,1);
  assert.equal(f.call('return_to_galaxy').phase,'galaxy');
  f.setBusy(true);
  assert.equal(f.call('explore_cosmic_object',{issue_number:1}).error.code,'UI_BUSY');
  assert.equal(f.call('return_to_galaxy').error.code,'UI_BUSY');
  f.setWebgl(false);
  assert.equal(f.call('travel_to_cosmic_object',{issue_number:1}).error.code,'TRAVEL_UNAVAILABLE');
});

test('registration detects unsupported browsers and aborts a partial registration',async()=>{
  const f=fixture();
  let touched=false;
  const doc={get modelContext(){touched=true;return undefined;}};
  assert.equal(await registerWebMcp({enabled:false,document:doc,adapter:f.adapter}),'disabled');
  assert.equal(touched,false);
  assert.equal(await registerWebMcp({enabled:true,document:doc,adapter:f.adapter}),'unsupported');
  const registrations=[];
  const context={async registerTool(tool,options){registrations.push({tool,options});}};
  assert.equal(await registerWebMcp({enabled:true,document:{modelContext:context},adapter:f.adapter}),'registered');
  assert.equal(registrations.length,5);
  assert.ok(registrations.every(r=>!r.options.signal.aborted));
  const partial=[];
  assert.equal(await registerWebMcp({enabled:true,document:{modelContext:{async registerTool(tool,options){partial.push(options.signal);if(partial.length===2)throw Error('unavailable');}}},adapter:f.adapter}),'failed');
  assert.ok(partial.every(signal=>signal.aborted));
});

test('cancelled calls do not act; unexpected failures do not leak exception data',()=>{
  const f=fixture();
  const c=new AbortController();c.abort();
  assert.throws(()=>f.call('explore_cosmic_object',{issue_number:1},{signal:c.signal}),{name:'AbortError'});
  assert.equal(f.opened(),null);
  f.adapter.explore=()=>{throw Error('PRIVATE');};
  const r=f.call('explore_cosmic_object',{issue_number:1});
  assert.equal(r.error.code,'ACTION_FAILED');
  assert.doesNotMatch(JSON.stringify(r),/PRIVATE/);
});
