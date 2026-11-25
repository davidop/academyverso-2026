<script setup lang="ts">
import QrPortal from './QrPortal.vue'

defineProps<{ clicks: number }>()

const issueUrl = 'https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml'
</script>

<template>
  <section class="portal-scene" :data-open="clicks >= 1">
    <div class="portal-copy">
      <QrPortal :url="issueUrl" label="CREAR OBJETO EN GITHUB" label-below />
      <div class="portal-steps">
        <p><b>1</b> Abre el QR en GitHub Mobile o navegador.</p>
        <p><b>2</b> Elige planeta, estrella, luna o estación.</p>
        <p><b>3</b> Escribe nombre, alias y descripción.</p>
        <p><b>4</b> Envía la Issue: tu idea queda registrada.</p>
        <small>Necesitas iniciar sesión en GitHub. La alternativa web sin cuenta usa un Cloudflare Worker.</small>
      </div>
    </div>

    <div class="portal-art" aria-hidden="true">
      <span class="portal-orbit outer"></span>
      <span class="portal-orbit inner"></span>
      <span class="portal-iris"></span>
      <div class="portal-sphere"></div>
      <svg class="portal-sparkle one" viewBox="0 0 24 24"><path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
      <svg class="portal-sparkle two" viewBox="0 0 24 24"><path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
      <svg class="portal-sparkle three" viewBox="0 0 24 24"><path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
    </div>
  </section>
</template>

<style scoped>
.portal-scene {
  display: grid;
  grid-template-columns: 1fr 430px;
  gap: 30px;
  align-items: start;
  margin-top: 22px;
}

.portal-copy { display: grid; grid-template-columns: 264px 1fr; gap: 26px; align-items: start; }
.portal-copy :deep(.qr-panel) { border-radius: 2px; }

.portal-steps { display: flex; flex-direction: column; gap: 11px; }
.portal-steps p { display: flex; align-items: flex-start; gap: 12px; font-size: 19px; line-height: 1.3; }
.portal-steps p b {
  display: grid; place-items: center; flex-shrink: 0;
  width: 28px; height: 28px;
  background: var(--av-green); color: var(--av-lime);
  font-size: 15px; font-weight: 800;
}
.portal-steps small { font-size: 14px; line-height: 1.4; color: var(--av-green-2); }

.portal-art { position: relative; width: 100%; height: 400px; }
.portal-sphere {
  position: absolute; left: 66px; top: 70px;
  width: 220px; height: 220px; border-radius: 50%;
  background: radial-gradient(circle at 30% 28%, #ece9ff, var(--av-lav) 32%, #7c73c9 72%, #3b3670);
  box-shadow: inset -22px -18px 42px #1f213999;
}
.portal-orbit {
  position: absolute; left: 8px; top: 120px;
  border: 5px solid var(--av-green); border-radius: 50%;
  width: 340px; height: 96px; transform: rotate(-22deg);
}
.portal-orbit.inner { left: 52px; top: 142px; width: 258px; height: 74px; border-color: var(--av-orange); transform: rotate(20deg); }

.portal-iris {
  position: absolute; left: 176px; top: 180px;
  width: 0; height: 0; border-radius: 50%;
  background: radial-gradient(circle, #f2f4d9f2 0%, #b1fa63d9 38%, #b1fa6300 72%);
  transform: translate(-50%, -50%) scale(.2);
  opacity: 0;
  transition: width 950ms cubic-bezier(.22, 1, .36, 1), height 950ms cubic-bezier(.22, 1, .36, 1), opacity 950ms ease-out;
}
[data-open="true"] .portal-iris { width: 410px; height: 410px; opacity: 1; }

.portal-sparkle { position: absolute; fill: var(--av-orange); transition: transform 440ms cubic-bezier(.22, 1, .36, 1); }
.portal-sparkle.one { left: 268px; top: 40px; width: 24px; height: 24px; }
.portal-sparkle.two { left: 34px; top: 268px; width: 14px; height: 14px; fill: var(--av-lime); }
.portal-sparkle.three { right: 26px; top: 112px; width: 12px; height: 12px; fill: var(--av-lime); }
[data-open="true"] .portal-sparkle.one { transform: scale(1.35) rotate(12deg); }

@media (prefers-reduced-motion: reduce) {
  .portal-iris, .portal-sparkle { transition: none; }
}
</style>