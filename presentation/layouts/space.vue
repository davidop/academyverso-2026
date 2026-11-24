<script setup lang="ts">
// Diseño oscuro de la plantilla: fondo espacial, píxeles lavanda y logos en blanco.
import AvFooter from '../components/AvFooter.vue'
</script>

<template>
  <div class="slidev-layout av-slide av-space">
    <img class="av-pixel" src="../assets/template/pixel-light.svg" alt="" aria-hidden="true" />
    <div class="av-content"><slot /></div>
    <AvFooter tone="dark" />
  </div>
</template>
