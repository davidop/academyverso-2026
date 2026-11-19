<script setup lang="ts">
import MissionSky from './MissionSky.vue'

defineProps<{ clicks: number }>()

const steps = ['Issue', 'Validación', 'Worker + D1', 'Three.js']
</script>

<template>
  <section class="mission-trace" :data-step="Math.min(Math.max(clicks, 0), 3)">
    <MissionSky />
    <h1>Cada mundo tiene<br /><em>una historia en GitHub.</em></h1>

    <svg class="route" viewBox="0 0 1280 713" preserveAspectRatio="none" aria-hidden="true">
      <path class="route-base" d="M 55 516 Q 110 492 157 479 Q 325 440 493 440 T 870 420" />
      <path class="route-pending" d="M 870 420 Q 1050 397 1165 402 L 1200 404" />
    </svg>
    <ol class="trace" aria-label="Recorrido de una Issue hasta el universo Three.js">
      <li v-for="(step, index) in steps" :key="step" :class="`step step-${index}`" :aria-current="clicks === index ? 'step' : undefined">
        <span class="marker" aria-hidden="true">{{ index + 1 }}</span>
        <span class="label">{{ step }}</span>
        <span v-if="index === 2" class="integration">Integración necesaria<br />a partir de aquí</span>
      </li>
    </ol>
    <p class="hint">{{ steps[Math.min(Math.max(clicks, 0), 3)] }} <span>·</span> recorrido conceptual, no estado en vivo</p>
  </section>
</template>

<style scoped>
.mission-trace { position:absolute!important; inset:0 0 7px; overflow:hidden; isolation:isolate; background:#121b30; color:#f5f7ff; }
h1 { position:relative; margin:74px 58px 0; font-size:66px; line-height:1.03; letter-spacing:-3px; font-weight:900; }
h1 em { color:var(--mint); font-style:normal; }
.trace { position:absolute; inset:0; margin:0; padding:0; list-style:none; }
.route { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.route path { fill:none; stroke:var(--mint); stroke-width:4; stroke-linecap:round; }
.route-pending { stroke-dasharray:11 14; opacity:.72; }
.step { position:absolute; width:200px; text-align:center; transform:translateX(-50%); }
.step-0 { left:12.3%; top:465px; }
.step-1 { left:38.5%; top:426px; }
.step-2 { left:68%; top:406px; }
.step-3 { left:91%; top:388px; }
.marker { display:grid; place-items:center; margin:0 auto 13px; width:28px; height:28px; border-radius:50%; background:var(--lav); color:#182039; font:700 15px Consolas,monospace; }
.label { display:block; font-size:27px; line-height:1.1; font-weight:800; white-space:nowrap; }
.integration { position:absolute; width:260px; left:50%; top:-68px; transform:translateX(-50%); color:var(--orange); font-size:19px; line-height:1.2; font-weight:700; }
.step-3 .label { color:var(--lav); }
.hint { position:absolute; left:58px; bottom:35px; margin:0; color:var(--lav); font:700 17px Consolas,monospace; letter-spacing:1px; }
.hint span { color:var(--orange); }
.step .marker, .step .label { transition:transform 220ms ease, color 220ms ease, background-color 220ms ease; }
.step[aria-current="step"] .marker { background:var(--mint); transform:scale(1.2); }
.step[aria-current="step"] .label { color:var(--mint); transform:translateY(-2px); }
@media (prefers-reduced-motion:reduce), print { .step .marker,.step .label { transition:none; } }
@media print { .mission-trace { print-color-adjust:exact; -webkit-print-color-adjust:exact; } }
</style>
