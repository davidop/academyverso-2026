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
  gap: 12px;
  width: max-content;
  max-width: 100%;
  padding: 0;
  color: var(--av-green);
  background: transparent;
  border-radius: 0;
  border-bottom: 0;
  box-shadow: none;
}

.qr-surface { display: grid; place-items: center; }
.qr-panel--label-below .qr-surface {
  padding: 12px;
  border-radius: 2px;
  color: #000;
  background: #fff;
  box-shadow: 6px 6px 0 var(--av-green);
}

.qr-panel--label-below .qr-label {
  margin: 0;
  padding: 0;
  color: var(--av-green);
  background: transparent;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 800;
  text-align: center;
  text-wrap: balance;
}

.qr-panel--label-below:focus-visible {
  outline: 3px solid var(--av-orange);
  outline-offset: 6px;
  border-radius: 2px;
}

@media print { .qr-panel--label-below .qr-surface { box-shadow: none; border: 2px solid var(--av-green); } }
</style>