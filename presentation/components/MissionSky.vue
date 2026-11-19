<script setup lang="ts">
import planet from '../assets/mission-planet.webp'

defineProps<{ orbit?: boolean }>()
</script>

<template>
  <div class="mission-sky" aria-hidden="true">
    <img class="mission-horizon" :src="planet" alt="" />
    <svg viewBox="0 0 1280 720" class="mission-lines">
      <path v-if="orbit" d="M 1285 179 C 943 242 724 487 782 579" class="mission-orbit" />
      <path d="M837 89 q2 13 15 15 q-13 2 -15 15 q-2 -13 -15 -15 q13 -2 15 -15Z
        M868 504 q2 9 11 11 q-9 2 -11 11 q-2 -9 -11 -11 q9 -2 11 -11Z
        M1174 455 q2 11 13 13 q-11 2 -13 13 q-2 -11 -13 -13 q11 -2 13 -13Z" class="mission-stars" />
    </svg>
  </div>
</template>

<style scoped>
.mission-sky, .mission-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.mission-horizon {
  position: absolute;
  width: 1000px;
  max-width: none;
  left: 636px;
  top: 500px;
  transform: rotate(-13deg);
}

.mission-orbit { fill: none; stroke: var(--mint); stroke-width: 2.5; opacity: .72; }
.mission-stars { fill: var(--lav); }
</style>
