import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync('web/sesion.html','utf8');
const slides=readFileSync('presentation/slides.md','utf8');
test('session portal has real audience links and mobile viewport',()=>{
 for(const url of ['./#grand-terraforming-agents','./#universe','./presentation/','https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml'])
   assert.ok(page.includes('href="'+url+'"'),'missing '+url);
 assert.ok(page.includes('<html lang="es">'));
 assert.ok(page.includes('name="viewport"'));
});
test('slides QR points to portal and no misleading agent PR numbers',()=>{
 assert.ok(slides.includes('QrPortal url="https://davidop.github.io/academyverso-2026/sesion.html"'));
 for(const label of ['PR #1','PR #2','PR #3'])assert.ok(!slides.includes('<small>'+label+'</small>'));
});
