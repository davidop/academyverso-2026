<script setup lang="ts">
import david from '../assets/david-oliva.webp'
import sergio from '../assets/sergio-valverde.webp'
defineProps<{ person: 'david' | 'sergio'; name: string }>()
const photos = { david, sergio }
</script>
<template>
  <img :src="photos[person]" :alt="name" loading="eager" decoding="sync" width="155" height="155" />
</template>
