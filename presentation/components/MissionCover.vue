<script setup lang="ts">
import { useIsSlideActive } from '@slidev/client'
import astronaut from '../../web/assets/astronauta.png'
import MissionBrand from './MissionBrand.vue'
import MissionSky from './MissionSky.vue'

const active = useIsSlideActive()
</script>

<template>
  <section class="mission-cover" :data-active="active">
    <MissionSky orbit />
    <img class="mission-astronaut" :src="astronaut" alt="" />
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
  width: 390px;
  right: 65px;
  top: 120px;
  transform: rotate(8deg);
}

.mission-copy { position: relative; padding: 42px 58px; }
.mission-copy h1 {
  margin-top: 37px;
  font-size: 86px;
  line-height: .98;
  font-weight: 900;
  letter-spacing: -4px;
}

.mission-copy h1 em { color: var(--orange); font-style: normal; }
.mission-copy .mission-subtitle {
  margin-top: 24px;
  color: var(--lav);
  opacity: 1;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.15;
}
.mission-copy .mission-speakers { margin-top: 36px; font-size: 24px; font-weight: 700; }

[data-active="true"] h1 { animation: cover-reveal 440ms cubic-bezier(.22, 1, .36, 1) both; }
[data-active="true"] .mission-astronaut { animation: cover-drift 680ms cubic-bezier(.22, 1, .36, 1) both; }

@keyframes cover-reveal {
  from { clip-path: inset(0 0 100%); transform: translateY(12px); }
  to { clip-path: inset(0 0 0); transform: none; }
}
@keyframes cover-drift {
  from { opacity: 0; transform: translate(22px, 15px) rotate(3deg); }
  to { opacity: 1; transform: rotate(8deg); }
}

@media (prefers-reduced-motion: reduce), print {
  [data-active="true"] h1, [data-active="true"] .mission-astronaut { animation: none; }
}
</style>
