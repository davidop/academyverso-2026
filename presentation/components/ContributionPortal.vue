<script setup lang="ts">
import MissionBrand from './MissionBrand.vue'
import planet from '../assets/mission-planet.webp'
import QrPortal from './QrPortal.vue'

defineProps<{ clicks: number }>()

const issueUrl = 'https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml'
</script>

<template>
  <section class="portal-scene" :data-open="clicks >= 1">
    <div class="portal-copy">
      <header class="portal-brand">
        <MissionBrand />
        <span>07 · TU PRIMERA CONTRIBUCIÓN</span>
      </header>
      <h1><span>Escanea. Imagina.</span><br /><em>Crea tu planeta.</em></h1>
      <div class="portal-action">
        <QrPortal :url="issueUrl" label="CREAR OBJETO EN GITHUB" label-below />
        <div class="portal-instructions">
          <ol>
            <li>Abre el QR con el móvil o selecciona el enlace.</li>
            <li>Elige un planeta, estrella, luna o estación.</li>
            <li>Indica nombre, alias y descripción; envía la Issue.</li>
          </ol>
          <p>Necesitas iniciar sesión en GitHub.</p>
        </div>
      </div>
    </div>
    <div class="portal-art" aria-hidden="true">
      <div class="portal-window"><img :src="planet" alt="" class="portal-planet" /></div>
      <span class="portal-orbit portal-orbit--outer"></span>
      <span class="portal-orbit portal-orbit--inner"></span>
      <svg class="portal-sparkle portal-sparkle--one" viewBox="0 0 24 24"><path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
      <svg class="portal-sparkle portal-sparkle--two" viewBox="0 0 24 24"><path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
      <svg class="portal-sparkle portal-sparkle--three" viewBox="0 0 24 24"><path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
    </div>
  </section>
</template>

<style scoped>
.portal-scene {
  position: absolute !important;
  inset: 0 0 7px;
  overflow: hidden;
  isolation: isolate;
  background: radial-gradient(ellipse at 87% 55%, #2c2d50 0%, #182039 48%, #121b30 100%);
}

.portal-copy { position: relative; z-index: 1; padding: 42px 0 0 58px; width: 673px; }
.portal-brand { display: flex; align-items: center; gap: 23px; color: var(--mint); font: 700 15px Consolas, monospace; letter-spacing: 2px; }
.portal-brand :deep(.mission-brand) { width: 144px; }
.portal-scene h1 { margin: 24px 0 0; font-size: 64px; font-weight: 950; line-height: .98; letter-spacing: -3px; }
.portal-scene h1 span { white-space: nowrap; }
.portal-scene h1 em { display: inline-block; margin-top: 9px; color: var(--orange); font-style: normal; transform: translateX(-6px); transition: transform .62s cubic-bezier(.22, 1, .36, 1); }
.portal-action { display: grid; grid-template-columns: 264px minmax(0, 1fr); gap: 26px; align-items: center; margin-top: 45px; }
.portal-action :deep(.qr-panel) { border-radius: 4px; }
.portal-action :deep(.qr-panel:focus-visible) { outline: 4px solid var(--mint); outline-offset: 5px; }
.portal-instructions { color: var(--white); font-size: 20px; line-height: 1.35; }
.portal-instructions ol { margin: 0; padding-left: 30px; }
.portal-instructions li + li { margin-top: 14px; }
.portal-instructions li::marker { color: var(--mint); font-weight: 700; }
.portal-instructions p { margin: 18px 0 0 30px; color: var(--lav); font-size: 17px; }

.portal-art { position: absolute; top: 22px; left: 704px; width: 630px; height: 655px; pointer-events: none; }
.portal-window { position: absolute; inset: 45px 10px 38px; overflow: hidden; border-radius: 50%; clip-path: ellipse(40% 10% at 55% 58%); transform: rotate(-18deg) scale(.91); transition: clip-path .95s cubic-bezier(.22, 1, .36, 1), transform .95s cubic-bezier(.22, 1, .36, 1); }
.portal-planet { position: absolute; top: 82px; left: 83px; width: 546px; max-width: none; transform: translate(25px, 95px) rotate(-12deg) scale(.92); transition: transform 1.12s cubic-bezier(.22, 1, .36, 1); }
.portal-orbit { position: absolute; display: block; border: solid; border-radius: 50%; transition: transform .88s cubic-bezier(.22, 1, .36, 1), opacity .62s ease-out; }
.portal-orbit--outer { inset: 4px 5px 5px -14px; border-width: 18px 22px 4px 5px; border-color: var(--mint); transform: rotate(-27deg) scale(.77); opacity: .43; }
.portal-orbit--inner { inset: 42px 18px 39px 14px; border-width: 14px 20px 8px 4px; border-color: var(--lav); transform: rotate(17deg) scale(.83); opacity: .47; }
.portal-sparkle { position: absolute; width: 17px; height: 17px; fill: var(--orange); opacity: .9; transform-origin: center; }
.portal-sparkle--one { top: 145px; left: 286px; width: 26px; height: 26px; }
.portal-sparkle--two { top: 282px; left: 45px; fill: var(--lav); width: 13px; height: 13px; }
.portal-sparkle--three { top: 104px; right: 103px; fill: var(--lav); width: 11px; height: 11px; }
[data-open="true"] h1 em { transform: none; }
[data-open="true"] .portal-window { clip-path: ellipse(50% 50%); transform: none; }
[data-open="true"] .portal-planet { transform: none; }
[data-open="true"] .portal-orbit--outer { transform: rotate(-23deg); opacity: 1; }
[data-open="true"] .portal-orbit--inner { transform: rotate(13deg); opacity: 1; }
[data-open="true"] .portal-sparkle--one { animation: portal-sparkle-open 620ms cubic-bezier(.22, 1, .36, 1) both; }
@keyframes portal-sparkle-open { 0% { opacity: .45; transform: scale(.3) rotate(-35deg); } 55% { opacity: 1; transform: scale(1.35) rotate(16deg); } 100% { opacity: .9; transform: scale(1) rotate(0); } }
@media (prefers-reduced-motion: reduce), print { .portal-scene h1 em, .portal-window, .portal-planet, .portal-orbit, .portal-sparkle { transition: none; animation: none !important; } }
@media print { .portal-scene h1 em { transform: none; } .portal-window { clip-path: ellipse(50% 50%); transform: none; } .portal-planet { transform: none; } .portal-orbit--outer { transform: rotate(-23deg); opacity: 1; } .portal-orbit--inner { transform: rotate(13deg); opacity: 1; } }
</style>
