<script setup lang="ts">
import david from '../assets/david-oliva.png'
import sergio from '../assets/sergio-valverde.png'
defineProps<{ person: 'david' | 'sergio'; name: string }>()
const photos = { david, sergio }
</script>
<template>
  <img :src="photos[person]" :alt="name" loading="eager" decoding="sync" width="250" height="250" />
</template>