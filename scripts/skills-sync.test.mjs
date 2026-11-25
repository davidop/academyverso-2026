import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const SOURCE = '.apm/skills';
const TARGETS = ['.agents/skills', '.claude/skills', '.github/skills'];

const skills = readdirSync(SOURCE).filter(name => existsSync(join(SOURCE, name, 'SKILL.md')));

test('cada skill local declara name y description', () => {
  assert.ok(skills.length >= 5, 'se esperan al menos cinco skills locales');
  for (const skill of skills) {
    const text = readFileSync(join(SOURCE, skill, 'SKILL.md'), 'utf8');
    assert.match(text, /^---\r?\n[\s\S]*?name:\s*\S+/m, skill + ' must declare a name');
    assert.match(text, /^---\r?\n[\s\S]*?description:\s*\S+/m, skill + ' must declare a description');
  }
});

test('las copias desplegadas coinciden con la fuente y no hay huerfanas', () => {
  for (const target of TARGETS) {
    assert.ok(existsSync(target), target + ' must exist after apm install --legacy-skill-paths');
    const deployed = readdirSync(target).filter(name => existsSync(join(target, name, 'SKILL.md')));
    for (const skill of skills) {
      const path = join(target, skill, 'SKILL.md');
      assert.ok(existsSync(path), 'missing ' + path + '; run apm install --legacy-skill-paths');
      assert.equal(
        readFileSync(path, 'utf8'),
        readFileSync(join(SOURCE, skill, 'SKILL.md'), 'utf8'),
        'drift in ' + path + '; run apm install --legacy-skill-paths'
      );
    }
    const orphans = deployed.filter(name => !skills.includes(name));
    assert.deepEqual(orphans, [], 'orphan skills in ' + target + ': ' + orphans.join(', '));
  }
});