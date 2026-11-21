import test from 'node:test';
import assert from 'node:assert/strict';
import {TERRAFORMING_MISSIONS,terraformMissionFor,terraformCounts,terraformProposal,terraformGitHubUrl} from '../terraforming.mjs';

test('proposals preserve valid legacy object types and stable tags',()=>{
  for(const mission of TERRAFORMING_MISSIONS){
    const value=terraformProposal(mission.id);
    assert.equal(value.type,'planeta');
    assert.ok(value.description.startsWith(mission.tag+' '));
    assert.ok(value.description.length<=280);
    assert.ok(value.name.length<=48);
    assert.equal(terraformMissionFor(value.description)?.id,mission.id);
  }
});
test('counts only real tagged objects, not demo text or unrelated creations',()=>{
  const list=[
    {description:terraformProposal('vice-nebula').description},
    {description:'  [gta:vice-nebula] Otra avenida espacial'},
    {description:terraformProposal('colonia-centinela').description},
    {description:'Una ciudad de nombre Vice Nebula sin etiqueta'},
    {description:'No es etiqueta [GTA:VICE-NEBULA]'},
    {description:null}
  ];
  assert.deepEqual(terraformCounts(list),{'vice-nebula':2,'colonia-centinela':1});
  assert.deepEqual(terraformCounts([]),{'vice-nebula':0,'colonia-centinela':0});
});
test('GitHub mobile prefills valid Issue template with mission and leaves alias user-controlled',()=>{
  const url=new URL(terraformGitHubUrl('vice-nebula'));
  assert.equal(url.origin,'https://github.com');
  assert.equal(url.searchParams.get('template'),'crear-objeto.yml');
  assert.equal(url.searchParams.get('tipo'),'planeta');
  assert.ok(url.searchParams.get('descripcion').startsWith('[GTA:VICE-NEBULA] '));
  assert.equal(url.searchParams.has('alias'),false);
  assert.throws(()=>terraformProposal('other'),/Misión desconocida/);
  assert.throws(()=>terraformGitHubUrl('vice-nebula','https://evil.invalid'),/Repositorio inválido/);
});
