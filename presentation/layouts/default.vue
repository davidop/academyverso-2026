<script setup lang="ts">
// Diseño «Solo título» de la plantilla: fondo lavanda, motivo de píxeles y footer de patrocinadores.
import AvFooter from '../components/AvFooter.vue'
</script>

<template>
  <div class="slidev-layout av-slide av-light">
    <img class="av-pixel" src="../assets/template/pixel-dark.svg" alt="" aria-hidden="true" />
    <div class="av-content"><slot /></div>
    <AvFooter tone="light" />
  </div>
</template>
