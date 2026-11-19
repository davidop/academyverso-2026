<script setup lang="ts">
import { useIsSlideActive } from '@slidev/client'
import astronaut from '../assets/mission-astronaut.webp'
import MissionBrand from './MissionBrand.vue'
import MissionSky from './MissionSky.vue'

const active = useIsSlideActive()
</script>

<template>
  <section class="mission-cover" :data-active="active">
    <MissionSky orbit />
    <img class="mission-astronaut" :src="astronaut" alt="" aria-hidden="true" />
    <div class="mission-copy">
      <MissionBrand />
      <h1>¿Y si dirigieras<br />un repo<br /><em>desde el móvil?</em></h1>
      <p class="mission-subtitle">Programa con IA desde tu móvil:<br />GitHub Copilot, Claude y Codex</p>
      <p class="mission-speakers">David Oliva · Sergio Valverde</p>
    </div>
  </section>
</template>

<style scoped>
.mission-cover {
  position: absolute !important;
  inset: 0 0 7px;
  overflow: hidden;
  isolation: isolate;
  background: #121b30;
}

.mission-astronaut {
  position: absolute;
  width: 414px;
  right: 54px;
  top: 81px;
  transform: rotate(5deg);
  transform-origin: 50% 60%;
}

.mission-copy { position: relative; width: 862px; padding: 42px 58px; }
.mission-copy h1 {
  margin-top: 52px;
  font-size: 96px;
  line-height: .96;
  font-weight: 900;
  letter-spacing: -4.5px;
}

.mission-copy h1 em { color: var(--orange); font-style: normal; white-space: nowrap; }
.mission-copy .mission-subtitle {
  margin-top: 22px;
  color: var(--lav);
  opacity: 1;
  font-size: 35px;
  font-weight: 700;
  line-height: 1.15;
}
.mission-copy .mission-speakers { margin-top: 36px; font-size: 29px; font-weight: 700; }

[data-active="true"] h1 { animation: cover-reveal 440ms cubic-bezier(.22, 1, .36, 1) both; }
[data-active="true"] .mission-astronaut { animation: cover-drift 1450ms cubic-bezier(.22, 1, .36, 1) both; }

/* Keep this horizon enlargement local to S01; MissionSky is shared by other scenes. */
.mission-cover :deep(.mission-horizon) {
  width: 1200px;
  left: 520px;
  top: 472px;
}

@keyframes cover-reveal {
  from { clip-path: inset(0 0 100%); transform: translateY(12px); }
  to { clip-path: inset(0 0 0); transform: none; }
}
@keyframes cover-drift {
  0% { opacity: 0; transform: translate(20px, 28px) rotate(2deg); }
  68% { opacity: 1; transform: translate(-3px, -5px) rotate(6deg); }
  100% { opacity: 1; transform: translate(0, 0) rotate(5deg); }
}

@media (prefers-reduced-motion: reduce), print {
  [data-active="true"] h1, [data-active="true"] .mission-astronaut { animation: none; }
}
</style>
