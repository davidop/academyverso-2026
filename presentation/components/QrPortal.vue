<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
defineProps<{ url: string; label: string }>()
</script>
<template>
  <a class="qr-panel" :href="url" target="_blank" rel="noopener noreferrer" :aria-label="label">
    <QrcodeVue :value="url" :size="240" level="M" render-as="svg" />
    <span>{{ label }} ↗</span>
  </a>
</template>
