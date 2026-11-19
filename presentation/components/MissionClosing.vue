<script setup lang="ts">
import { useIsSlideActive } from '@slidev/client'
import MissionBrand from './MissionBrand.vue'
import MissionSky from './MissionSky.vue'
import QrPortal from './QrPortal.vue'

const active = useIsSlideActive()
const repository = 'https://github.com/davidop/academyverso-2026'
</script>

<template>
  <section class="mission-closing" :data-active="active">
    <MissionSky orbit />
    <div class="closing-copy">
      <MissionBrand />
      <h1>Tu móvil delega.<br /><em>Tú decides qué entra.</em></h1>
      <p class="closing-steps">Delegar · Revisar · Validar</p>
    </div>
    <div class="closing-qr">
      <QrPortal :url="repository" label="Código y documentación" />
    </div>
  </section>
</template>

<style scoped>
.mission-closing {
  position: absolute !important;
  inset: 0 0 7px;
  display: grid;
  grid-template-columns: 1fr 330px;
  align-items: center;
  gap: 42px;
  overflow: hidden;
  isolation: isolate;
  padding: 44px 58px;
  background: #121b30;
}

.closing-copy, .closing-qr { position: relative; z-index: 1; }
.closing-copy h1 {
  margin: 54px 0 0;
  font-size: 64px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -3px;
}
.closing-copy h1 em { color: var(--orange); font-style: normal; }
.closing-steps {
  margin: 40px 0 0;
  color: var(--mint);
  opacity: 1;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 800;
}
.closing-qr { justify-self: center; width: 290px; text-align: center; }
.closing-qr :deep(.qr-panel) {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 4px;
  color: #000;
  background: #fff;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
}
.closing-qr :deep(.qr-panel:focus-visible) {
  outline: 4px solid var(--mint);
  outline-offset: 6px;
}

[data-active="true"] :deep(.mission-sky) { animation: closing-sky 440ms ease-out both; }
@keyframes closing-sky {
  from { opacity: .25; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce), print {
  .mission-closing *, .mission-closing *::before, .mission-closing *::after { animation: none !important; }
}
</style>
