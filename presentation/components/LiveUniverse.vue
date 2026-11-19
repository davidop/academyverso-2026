<script setup lang="ts">
import { ref } from 'vue'
const loaded = ref(false)
const url = 'https://davidop.github.io/academyverso-2026/'
</script>

<template>
  <div class="live-frame">
    <iframe
      title="AcademyVerso 3D interactivo"
      :src="url"
      loading="lazy"
      @load="loaded = true"
    />
    <div v-if="!loaded" class="live-loading" role="status" aria-live="polite">
      <div class="loading-orbit" aria-hidden="true">🌌</div>
      <strong>Cargando el universo 3D…</strong>
      <p>La visualización depende de la conexión.</p>
      <a class="live-backup" :href="url" target="_blank" rel="noopener noreferrer">Abrir la galaxia en otra pestaña ↗</a>
    </div>
    <div class="live-flag">
      ● GALAXIA 3D · <a :href="url" target="_blank" rel="noopener noreferrer">ABRIR EN PANTALLA COMPLETA ↗</a>
    </div>
  </div>
  <div class="live-note">
    Hasta activar Cloudflare Worker + D1, la galaxia muestra objetos de ejemplo. No son contribuciones del público en directo.
  </div>
</template>
