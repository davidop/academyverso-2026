<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
withDefaults(defineProps<{ url: string; label: string; labelBelow?: boolean }>(), {
  labelBelow: false,
})
</script>
<template>
  <a
    class="qr-panel"
    :class="{ 'qr-panel--label-below': labelBelow }"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
  >
    <span class="qr-surface"><QrcodeVue :value="url" :size="240" :margin="4" level="M" render-as="svg" /></span>
    <span class="qr-label">{{ label }}<template v-if="!labelBelow"> ↗</template></span>
  </a>
</template>

<style scoped>
.qr-panel--label-below {
  display: grid;
  justify-items: center;
  gap: 13px;
  width: max-content;
  max-width: 100%;
  padding: 0;
  color: #fff;
  background: transparent;
  border-radius: 0;
  border-bottom: 0;
  box-shadow: none;
  text-decoration: none;
}

.qr-surface { display: grid; place-items: center; }
.qr-panel--label-below .qr-surface {
  padding: 12px;
  border-radius: 3px;
  color: #000;
  background: #fff;
}

.qr-panel--label-below .qr-label {
  color: #fff;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 800;
  text-align: center;
  text-wrap: balance;
}

.qr-panel--label-below:focus-visible {
  outline: 4px solid var(--mint);
  outline-offset: 7px;
  border-radius: 2px;
}
</style>
