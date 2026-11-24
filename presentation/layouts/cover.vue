<script setup lang="ts">
// Diseño «Diapositiva de título» de la plantilla: espacio, cometa, asteroides y astronauta con capa.
import AvFooter from '../components/AvFooter.vue'
</script>

<template>
  <div class="slidev-layout av-slide av-space av-cover">
    <img class="av-cover-asteroid big" src="../assets/template/asteroide-2.svg" alt="" aria-hidden="true" />
    <img class="av-cover-comet" src="../assets/template/cometa.svg" alt="" aria-hidden="true" />
    <img class="av-cover-asteroid small" src="../assets/template/asteroide-1.svg" alt="" aria-hidden="true" />
    <img class="av-cover-astronaut" src="../assets/template/astronauta-portada.svg" alt="Astronauta AcademyVerso" />
    <div class="av-content"><slot /></div>
    <AvFooter tone="dark" :badge="false" />
  </div>
</template>
