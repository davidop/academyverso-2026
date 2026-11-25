<script setup lang="ts">
const props = defineProps<{ clicks: number }>()

const steps = [
  { label: 'GitHub Mobile', detail: 'Formulario' },
  { label: 'GitHub Issues', detail: 'Registro público' },
  { label: 'GitHub Actions', detail: 'Validación y firma' },
  { label: 'Worker + D1', detail: 'Datos persistidos en D1' },
  { label: 'Three.js', detail: 'Universo 3D' },
]

const step = () => Math.min(Math.max(props.clicks, 0), steps.length - 1)
const done = () => 10 + (step() / (steps.length - 1)) * 80 + '%'
</script>

<template>
  <section class="mission-trace" :data-step="step()">
    <div class="trace-track" aria-hidden="true">
      <span class="track-base"></span>
      <span class="track-pending"></span>
      <span class="track-done" :style="{ width: done() }"></span>
    </div>

    <ol class="trace" :aria-label="`Recorrido: ${steps.map(s => s.label).join(', ')}`">
      <li
        v-for="(item, index) in steps"
        :key="item.label"
        :class="['step', { pending: index === steps.length - 1 }]"
        :aria-current="step() === index ? 'step' : undefined"
      >
        <span class="marker" aria-hidden="true">{{ index + 1 }}</span>
        <span class="label">{{ item.label }}</span>
        <span class="detail">{{ item.detail }}</span>
        <span v-if="index === steps.length - 2" class="integration">Conexión requerida antes de la sesión</span>
      </li>
    </ol>

    <p class="hint">{{ steps[step()].label }} <span>·</span> recorrido conceptual, no estado en vivo</p>
  </section>
</template>

<style scoped>
.mission-trace { position: relative; margin-top: 62px; }

.trace-track { position: absolute; left: 0; right: 0; top: 15px; height: 0; }
.track-base, .track-pending, .track-done {
  position: absolute; top: 0; height: 4px; border-radius: 2px;
}
.track-base { left: 0; right: 0; background: var(--av-green); opacity: .28; }
.track-pending { left: 10%; right: 10%; border-top: 4px dashed var(--av-green); height: 0; opacity: .55; }
.track-done { left: 0; background: var(--av-lime); box-shadow: 0 0 0 1px var(--av-green) inset; transition: width 440ms cubic-bezier(.22, 1, .36, 1); }


.trace {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;
  margin: 0; padding: 0; list-style: none; position: relative; z-index: 1;
}
.step { display: flex; flex-direction: column; align-items: center; text-align: center; }
.marker {
  display: grid; place-items: center;
  width: 38px; height: 38px; margin-bottom: 16px;
  background: var(--av-green); color: var(--av-lime);
  font: 800 15px var(--av-sans);
  transition: transform 220ms ease, background-color 220ms ease, color 220ms ease;
}
.label { font-size: 22px; line-height: 1.15; font-weight: 800; color: var(--av-green); }
.detail { margin-top: 6px; font-size: 16px; line-height: 1.2; color: var(--av-green-2); max-width: 190px; }
.pending .label { color: var(--av-green-2); }

.integration { margin-top: 10px; max-width: 190px; font-size: 13px; line-height: 1.25; font-weight: 800; color: var(--av-orange); }

.step[aria-current="step"] .marker { background: var(--av-lime); color: var(--av-green); transform: scale(1.16); }
.step[aria-current="step"] .label { color: var(--av-teal-ink); }

.hint { margin-top: 26px; font: 800 15px var(--av-mono); letter-spacing: 1px; color: var(--av-green-2); }
.hint span { color: var(--av-orange); }

@media (prefers-reduced-motion: reduce) {
  .track-done, .marker { transition: none; }
}
@media print { .mission-trace { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
</style>