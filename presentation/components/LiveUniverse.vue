<script setup lang="ts">
import { ref } from 'vue'
const loaded = ref(false)
// El iframe usa el modo embed (solo el lienzo 3D); los enlaces abren el sitio
// completo, que conserva el control del portal y la navegación (paso de S16).
const url = 'https://davidop.github.io/academyverso-2026/?embed=1#universe'
const fullUrl = 'https://davidop.github.io/academyverso-2026/#universe'
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
      <a class="live-backup" :href="fullUrl" target="_blank" rel="noopener noreferrer">Abrir la galaxia en otra pestaña ↗</a>
    </div>
    <!-- Siempre visible: si el iframe falla (también dispara load), queda un enlace al sitio completo. -->
    <div class="live-flag"><template v-if="loaded">● APP REAL　</template><a :href="fullUrl" target="_blank" rel="noopener noreferrer">ABRIR EN PANTALLA COMPLETA ↗</a></div>
  </div>
  <div class="live-note">
    Datos desde Cloudflare D1. Hasta activar Worker + D1 la galaxia muestra objetos de ejemplo, no contribuciones del público. Las Issues nuevas pueden tardar por la cola de GitHub Actions: verificar la URL y el estado real durante la demo.
  </div>
</template>