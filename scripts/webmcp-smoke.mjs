// Browser integration with a mock WebMCP registration API, not a native client test.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base='http://127.0.0.1:8765/';
const objects=[
  {issue_number:102,type:'planeta',name:'Nexus QA',alias:'Explorador QA',description:'[GTA:VICE-NEBULA] Planeta coral con tres lunas',edit_token:'PRIVATE'},
  {issue_number:103,type:'estrella',name:'Faro QA',alias:'QA',description:'Estrella violeta'}
];
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:1000,height:800},reducedMotion:'reduce'});
const errors=[],writes=[];
let offline=false;
try{
  page.on('pageerror',err=>errors.push(err.message));
  await page.route('**/api/**',async route=>{
    const req=route.request(),path=new URL(req.url()).pathname;
    if(req.method()!=='GET'){writes.push(req.method()+' '+path);return route.abort();}
    const headers={'access-control-allow-origin':'*','content-type':'application/json'};
    if(path==='/api/objects')return offline?route.fulfill({status:503,headers,json:{error:'mock unavailable'}}):route.fulfill({status:200,headers,json:{objects}});
    if(path==='/api/health')return route.fulfill({status:200,headers,json:{ok:true,database_connected:true,create_enabled:false,worldgen_enabled:false}});
    return route.abort();
  });
  await page.addInitScript(()=>{
    window.__webmcpTestTools=new Map();
    Object.defineProperty(document,'modelContext',{configurable:true,value:{
      async registerTool(tool,{signal}){
        window.__webmcpTestTools.set(tool.name,tool);
        signal.addEventListener('abort',()=>window.__webmcpTestTools.delete(tool.name),{once:true});
      }
    }});
  });
  const load=async query=>{
    await page.goto(base+query,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#count')?.textContent==='2',null,{timeout:20000});
  };
  const call=(name,input={})=>page.evaluate(({name,input})=>window.__webmcpTestTools.get(name).execute(input),{name,input});
  await load('');
  assert.equal(await page.evaluate(()=>window.__webmcpTestTools.size),0);
  await load('?webmcp=1&embed=1');
  assert.equal(await page.evaluate(()=>window.__webmcpTestTools.size),0);
  await load('?webmcp=1');
  await page.waitForFunction(()=>window.__webmcpTestTools.size===5);
  const list=await call('list_cosmic_objects');
  assert.equal(list.source,'live');assert.equal(list.total,2);
  assert.equal(list.objects.find(o=>o.issue_number===102).travel_available,true);
  assert.doesNotMatch(JSON.stringify(list),/PRIVATE/);
  assert.equal((await call('explore_cosmic_object',{issue_number:999})).error.code,'OBJECT_NOT_FOUND');
  assert.equal((await call('explore_cosmic_object',{issue_number:102})).status,'opened');
  await page.waitForSelector('#detail-dialog[open]');
  assert.equal(await page.locator('#detail-title').textContent(),'Nexus QA');
  assert.equal((await call('travel_to_cosmic_object',{issue_number:103})).error.code,'TRAVEL_UNAVAILABLE');
  assert.equal((await call('travel_to_cosmic_object',{issue_number:102})).phase,'world');
  assert.equal((await call('get_navigation_state')).active_issue_number,102);
  assert.equal((await call('return_to_galaxy')).phase,'galaxy');
  assert.equal(await page.locator('#travel-panel').evaluate(el=>el.hidden),true);
  await page.locator('#open-form').click();
  assert.equal((await call('explore_cosmic_object',{issue_number:102})).error.code,'UI_BUSY');
  await page.locator('#close-form').click();
  offline=true;
  await page.waitForFunction(()=>document.querySelector('#connection')?.textContent==='Sincronización no disponible',null,{timeout:20000});
  assert.equal((await call('list_cosmic_objects')).source,'cached');
  assert.deepEqual(writes,[]);
  assert.deepEqual(errors,[]);
  console.log('WebMCP mock browser smoke: opt-in, embed guard, list, explore, travel, return, form guard, cached state; zero API writes');
}finally{await browser.close();}
