import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';

const app = readFileSync('web/app.js', 'utf8');
const css = readFileSync('web/style.css', 'utf8');
const slides = readFileSync('presentation/slides.md', 'utf8');
const components = readdirSync('presentation/components')
  .filter(name => name.endsWith('.vue'))
  .map(name => readFileSync('presentation/components/' + name, 'utf8'));
const deck = [slides, ...components].join('\n');

test('embed mode hides the site chrome and fills the viewport', () => {
  assert.ok(app.includes("has('embed')"), 'app.js must read the embed query parameter');
  assert.ok(app.includes("classList.add('embed')"), 'app.js must flag the body');
  assert.ok(css.includes('body.embed #viewport{height:100dvh'), 'viewport must fill the screen in embed mode');
  for (const chrome of ['.nav', '.intro', '.terraform', '.gallery', '.credits', '#portal-control']) {
    assert.ok(css.includes('body.embed ' + chrome), 'embed mode must hide ' + chrome);
  }
  assert.ok(/body\.embed \.gallery[^{]*\{display:none!important\}/.test(css), 'hidden chrome must use display:none!important');
});

test('the deck embeds the 3D canvas only', () => {
  assert.ok(deck.includes('academyverso-2026/?embed=1#universe'), 'the live iframe must point to embed mode');
  assert.ok(!deck.includes('src="https://davidop.github.io/academyverso-2026/#universe"'), 'no iframe may load the full site');
});