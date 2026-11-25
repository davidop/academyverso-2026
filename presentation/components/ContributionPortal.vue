<script setup lang="ts">
import planet from '../assets/mission-planet.webp'
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
      <div class="portal-glow"></div>
      <img class="portal-planet" :src="planet" alt="" />
      <span class="portal-orbit outer"></span>
      <span class="portal-orbit inner"></span>
      <span class="portal-iris"></span>
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
  align-items: center;
  height: 100%;
  padding-bottom: 104px;
}

.portal-copy { display: grid; grid-template-columns: 252px 1fr; gap: 26px; align-items: center; }
.portal-copy :deep(.qr-label) { color: var(--av-lav); }
.portal-copy :deep(.qr-panel--label-below:focus-visible) { outline-color: var(--av-lime); }

.portal-steps { display: flex; flex-direction: column; gap: 13px; }
.portal-steps p { display: flex; align-items: flex-start; gap: 12px; font-size: 19px; line-height: 1.3; color: var(--av-cream); }
.portal-steps p b {
  display: grid; place-items: center; flex-shrink: 0;
  width: 30px; height: 30px;
  background: var(--av-lime); color: var(--av-green);
  font-size: 15px; font-weight: 800;
}
.portal-steps small { font-size: 14px; line-height: 1.45; color: var(--av-lav); opacity: .8; }

.portal-art { position: relative; height: 480px; }
.portal-glow {
  position: absolute; left: 40px; top: 46px;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, #b1fa6340 0%, #dbd6fc26 42%, transparent 70%);
  filter: blur(6px);
}
.portal-planet {
  position: absolute; left: 30px; top: 54px;
  width: 350px; height: auto;
  filter: drop-shadow(0 18px 46px #0b0d1acc);
}
.portal-orbit {
  position: absolute; left: -6px; top: 214px;
  border: 4px solid var(--av-lime); border-radius: 50%;
  width: 474px; height: 118px; transform: rotate(-19deg);
  opacity: .85;
}
.portal-orbit.inner { left: 52px; top: 244px; width: 348px; height: 84px; border-color: var(--av-orange); transform: rotate(18deg); }

.portal-iris {
  position: absolute; left: 230px; top: 240px;
  width: 0; height: 0; border-radius: 50%;
  background: radial-gradient(circle, #f2f4d9e6 0%, #b1fa63c9 34%, #b1fa6300 70%);
  transform: translate(-50%, -50%) scale(.2);
  opacity: 0;
  transition: width 950ms cubic-bezier(.22, 1, .36, 1), height 950ms cubic-bezier(.22, 1, .36, 1), opacity 950ms ease-out;
}
[data-open="true"] .portal-iris { width: 500px; height: 500px; opacity: 1; }

.portal-sparkle { position: absolute; fill: var(--av-orange); transition: transform 440ms cubic-bezier(.22, 1, .36, 1); }
.portal-sparkle.one { left: 352px; top: 24px; width: 27px; height: 27px; }
.portal-sparkle.two { left: 10px; top: 330px; width: 15px; height: 15px; fill: var(--av-lime); }
.portal-sparkle.three { right: 8px; top: 120px; width: 13px; height: 13px; fill: var(--av-lav); }
[data-open="true"] .portal-sparkle.one { transform: scale(1.35) rotate(12deg); }

@media (prefers-reduced-motion: reduce) {
  .portal-iris, .portal-sparkle { transition: none; }
}
</style>