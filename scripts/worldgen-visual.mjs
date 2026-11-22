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
  }
  results.push({viewport:viewport.name,canvas,objects:4,mission:mission.trim(),history:'ok',travel:viewport.name==='desktop'?'ok':'not-tested'});
  await page.close();
 }
 if(failures.length)throw Error(failures.join('; '));
 await fs.writeFile('artifacts/worldgen/summary.json',JSON.stringify({passed:true,results},null,2));
 console.log('PASS WorldGen browser screenshot and interaction',JSON.stringify(results));
}finally{await browser.close()}
