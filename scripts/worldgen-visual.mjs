// Browser smoke test with real WebGL canvas and reproducible fictional test data.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const base='http://127.0.0.1:8765';
const objects=[
 {issue_number:102,type:'planeta',name:'Oceania Neon',alias:'QA-1',description:'[GTA:VICE-NEBULA] Planeta oceánico con tres lunas, dos ciudades flotantes, volcanes y atmósfera violeta',issue_url:'https://github.com/davidop/academyverso-2026/issues/10'},
 {issue_number:103,type:'estacion',name:'Nexo Orbital',alias:'QA-2',description:'Una estación orbital con drones y antenas de cristal',issue_url:'https://github.com/davidop/academyverso-2026/issues/3'},
 {issue_number:104,type:'agujero-negro',name:'Singularidad',alias:'QA-3',description:'Agujero negro con anillos de energía',issue_url:'https://github.com/davidop/academyverso-2026/issues/4'},
 {issue_number:105,type:'luna',name:'Luna Cristal',alias:'QA-4',description:'Una luna lavanda cubierta de cráteres',issue_url:'https://github.com/davidop/academyverso-2026/issues/4'}
];
await fs.mkdir('artifacts/worldgen',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const failures=[],results=[];
try{
 for(const viewport of [{width:390,height:844,name:'mobile'},{width:1440,height:900,name:'desktop'}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  page.on('pageerror',err=>failures.push(viewport.name+': '+err.message));
  await page.route('**/api/objects',route=>route.fulfill({json:{objects},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await page.route('**/api/health',route=>route.fulfill({json:{ok:true,database_connected:true,create_enabled:false,worldgen_enabled:true},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await page.route('**/api/worlds/*/history',route=>route.fulfill({json:{issue_number:102,versions:[{version:1,world_status:'ready',origin:'create',created_at:'2026-11-22 12:00:00'}]},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#viewport canvas',{timeout:20000});
  await page.waitForFunction(()=>document.querySelector('#count')?.textContent==='4',{timeout:20000});
  const canvas=await page.locator('#viewport canvas').evaluate(el=>({width:el.width,height:el.height}));
  if(canvas.width<100||canvas.height<100)throw Error('WebGL canvas too small');
  await page.waitForTimeout(1500);
  if(!await page.locator('#portal-launch').isEnabled())throw Error('Portal should be enabled for 4 distinct worlds');
  if(await page.locator('#portal-source option').count()!==4)throw Error('Portal source choices mismatch');
  await page.screenshot({path:'artifacts/worldgen/'+viewport.name+'.png',fullPage:true,animations:'disabled'});
  const mission=await page.locator('#vice-nebula-count').innerText();
  if(mission.trim()!=='1')throw Error('Mission count '+mission+' is not one');
  await page.locator('#cards .body-card').filter({hasText:'Oceania Neon'}).click();
  await page.waitForSelector('#detail-dialog[open]');
  await page.waitForFunction(()=>!document.querySelector('#world-evolve-panel').hidden);
  await page.locator('#world-evolve-panel summary').click();
  await page.locator('#world-history-button').click();
  await page.waitForFunction(()=>document.querySelector('#world-history-list')?.textContent.includes('Versión 1'));
  await page.screenshot({path:'artifacts/worldgen/'+viewport.name+'-detail.png',animations:'disabled'});
  await page.locator('#close-detail').click();
  if(viewport.name==='desktop'){
    await page.locator('#cards .body-card').filter({hasText:'Oceania Neon'}).click();
    await page.locator('#travel-to-world').click();
    await page.waitForFunction(()=>document.querySelector('#travel-phase')?.textContent.includes('Destino alcanzado'),{timeout:10000});
    await page.waitForFunction(()=>document.querySelector('#mission-progress')?.textContent.startsWith('1/5'));
    await page.locator('#mission-reset').click();
    await page.waitForFunction(()=>document.querySelector('#mission-progress')?.textContent.startsWith('0/5'));
    await page.screenshot({path:'artifacts/worldgen/desktop-travel.png',animations:'disabled'});
    await page.locator('#return-home').click();
    await page.waitForFunction(()=>document.querySelector('#travel-panel')?.hidden===true,{timeout:10000});
    await page.locator('#portal-source').selectOption('102');
    await page.locator('#portal-target').selectOption('103');
    await page.locator('#portal-launch').click();
    await page.waitForFunction(()=>document.querySelector('#travel-phase')?.textContent.includes('Portal atravesado'),{timeout:10000});
    await page.screenshot({path:'artifacts/worldgen/desktop-portal.png',animations:'disabled'});
    await page.locator('#return-home').click();
  }else{
    await page.locator('#portal-source').selectOption('102');
    await page.locator('#portal-target').selectOption('103');
    await page.locator('#portal-launch').click();
    await page.waitForFunction(()=>document.querySelector('#travel-phase')?.textContent.includes('Portal atravesado'),{timeout:10000});
    await page.screenshot({path:'artifacts/worldgen/mobile-portal.png',animations:'disabled'});
    await page.locator('#return-home').click();
  }
  results.push({viewport:viewport.name,canvas,objects:4,mission:mission.trim(),history:'ok',travel:viewport.name==='desktop'?'ok':'not-tested'});
  await page.close();
 }
 // Load a synthetic 50-object crowd to catch WebGL crashes and gross layout failures.
 try{
  const baseline=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  await baseline.route('**/api/objects',route=>route.fulfill({json:{objects},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await baseline.route('**/api/health',route=>route.fulfill({json:{ok:true,database_connected:true,create_enabled:false},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await baseline.goto('https://davidop.github.io/academyverso-2026/',{waitUntil:'domcontentloaded',timeout:20000});
  await baseline.waitForFunction(()=>document.querySelector('#count')?.textContent==='4',{timeout:20000});
  await baseline.waitForTimeout(800);
  await baseline.screenshot({path:'artifacts/worldgen/baseline-main-mobile.png',fullPage:true,animations:'disabled'});
  results.push({baseline:'main-production',captured:true});
  await baseline.close();
 }catch(error){
  console.warn('Nonblocking baseline capture unavailable:',error.message);
  results.push({baseline:'main-production',captured:false});
 }

 // Portal safety in low-data situations: NEVER manufacture two audience worlds.
 for(const [label,subset] of [['empty',[]],['single',[objects[0]]]]){
  const edge=await browser.newPage({viewport:{width:390,height:844}});
  edge.on('pageerror',err=>failures.push(label+': '+err.message));
  await edge.route('**/api/objects',route=>route.fulfill({json:{objects:subset},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await edge.route('**/api/health',route=>route.fulfill({json:{ok:true,database_connected:true,create_enabled:true},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
  await edge.goto(base,{waitUntil:'domcontentloaded'});
  await edge.waitForFunction(n=>document.querySelector('#count')?.textContent===String(n),subset.length,{timeout:20000});
  if(await edge.locator('#portal-launch').isEnabled())throw Error('Portal enabled with '+subset.length+' worlds');
  if(!((await edge.locator('#portal-feedback').innerText()).includes('al menos dos')))throw Error('Missing accessible empty-state feedback');
  results.push({case:label,portalDisabled:true});
  await edge.close();
 }
 // Reduced-motion users can reach the same destination without animated flight.
 const accessible=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 accessible.on('pageerror',err=>failures.push('reduced: '+err.message));
 await accessible.route('**/api/objects',route=>route.fulfill({json:{objects},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
 await accessible.route('**/api/health',route=>route.fulfill({json:{ok:true,database_connected:true,create_enabled:true},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
 await accessible.goto(base,{waitUntil:'domcontentloaded'});
 await accessible.waitForFunction(()=>document.querySelector('#count')?.textContent==='4',{timeout:20000});
 await accessible.locator('#portal-source').selectOption('102');
 await accessible.locator('#portal-target').selectOption('103');
 await accessible.locator('#portal-launch').click();
 await accessible.waitForFunction(()=>document.querySelector('#travel-phase')?.textContent.includes('Portal atravesado'),{timeout:5000});
 if(await accessible.locator('#viewport').evaluate(el=>el.classList.contains('travelling')))throw Error('Reduced motion should never animate the portal');
 await accessible.locator('#return-home').click();
 await accessible.waitForFunction(()=>document.querySelector('#travel-panel')?.hidden===true,{timeout:5000});
 results.push({case:'reduced-motion',instantArrivalAndReturn:true});
 await accessible.close();

 const crowd=Array.from({length:50},(_,i)=>({...objects[i%objects.length],issue_number:2000+i,name:'Objeto de ensayo '+(i+1)}));
 const stress=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 stress.on('pageerror',err=>failures.push('crowd: '+err.message));
 await stress.route('**/api/objects',route=>route.fulfill({json:{objects:crowd},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
 await stress.route('**/api/health',route=>route.fulfill({json:{ok:true,database_connected:true,create_enabled:false,worldgen_enabled:false},status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'}}));
 await stress.goto(base,{waitUntil:'domcontentloaded'});
 await stress.waitForFunction(()=>document.querySelector('#count')?.textContent==='50',{timeout:30000});
 await stress.waitForTimeout(1700);
 const perf={canvas:(await stress.locator('#viewport canvas').count())===1};
 if(!perf.canvas)throw Error('50-object canvas missing');
 await stress.screenshot({path:'artifacts/worldgen/mobile-50-objects.png',fullPage:true,animations:'disabled'});
 results.push({viewport:'mobile-50',objects:50,renderedCanvas:perf.canvas});
 await stress.close();
 if(failures.length)throw Error(failures.join('; '));
 await fs.writeFile('artifacts/worldgen/summary.json',JSON.stringify({passed:true,results},null,2));
 console.log('PASS WorldGen browser screenshot and interaction',JSON.stringify(results));
}finally{await browser.close()}
