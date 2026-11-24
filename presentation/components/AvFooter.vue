<script setup lang="ts">
// Footer de patrocinadores tal como aparece en el patrón de la plantilla Academyverso (.potx).
import eventekkiDark from '../assets/template/logo-eventekki-dark.svg'
import eventekkiLight from '../assets/template/logo-eventekki-light.svg'
import tajamarDark from '../assets/template/logo-tajamar-dark.svg'
import tajamarLight from '../assets/template/logo-tajamar-light.svg'
import vvalleyDark from '../assets/template/logo-vvalley-dark.svg'
import vvalleyLight from '../assets/template/logo-vvalley-light.svg'
import badge from '../assets/template/logo-academyverso-badge.svg'

const props = withDefaults(defineProps<{ tone?: 'light' | 'dark'; badge?: boolean }>(), { tone: 'light', badge: true })
const onDark = props.tone === 'dark'
</script>

<template>
  <div class="av-footer" aria-label="Organiza Eventekki · Colaboran Tajamar y V-Valley · AcademyVerso">
    <img class="av-logo-eventekki" :src="onDark ? eventekkiLight : eventekkiDark" alt="Eventekki" />
    <img class="av-logo-tajamar" :src="onDark ? tajamarLight : tajamarDark" alt="Tajamar" />
    <img class="av-logo-vvalley" :src="onDark ? vvalleyLight : vvalleyDark" alt="V-Valley" />
    <img v-if="props.badge" class="av-logo-badge" :src="badge" alt="AcademyVerso" />
  </div>
</template>

<style scoped>
/* Coordenadas tomadas del patrón de diapositivas (lienzo 1280×720). */
.av-footer { position: absolute; inset: auto 0 0 0; height: 100px; pointer-events: none; z-index: 5; }
.av-footer img { position: absolute; display: block; }
/* El footer empieza en y=620: patrón Eventekki y=670, Tajamar y=667, V-Valley y=663, insignia y=626. */
.av-logo-eventekki { left: 40px; top: 50px; width: 210px; height: 25px; }
.av-logo-tajamar { left: 487px; top: 47px; width: 88px; height: 31px; }
.av-logo-vvalley { left: 620px; top: 43px; width: 171px; height: 39px; }
.av-logo-badge { left: 1014px; top: 6px; width: 248px; height: 83px; }
</style>
