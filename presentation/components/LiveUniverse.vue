<script setup lang="ts">
import { ref } from 'vue'
const loaded = ref(false)
const url = 'https://davidop.github.io/academyverso-2026/?embed=1#universe'
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
    <div v-if="loaded" class="live-flag">● APP REAL　<a :href="url" target="_blank" rel="noopener noreferrer">ABRIR EN PANTALLA COMPLETA ↗</a></div>
  </div>
  <div class="live-note">
    Datos desde Cloudflare D1. Hasta activar Worker + D1 la galaxia muestra objetos de ejemplo, no contribuciones del público. Las Issues nuevas pueden tardar por la cola de GitHub Actions: verificar la URL y el estado real durante la demo.
  </div>
</template>