<script setup lang="ts">
import { ref } from 'vue'
const selected = ref('NEÓN-42')
const worlds = [
 { name: 'PYTHONIA', label:'Planeta Pythonia', style:'left:13%;top:46%;width:100px;height:100px;background:radial-gradient(circle at 27% 26%,#E5FFC6,#B1FA63 48%,#4E8A22);' },
 { name: 'NEÓN-42', label:'Planeta Neón-42', style:'left:55%;top:12%;width:132px;height:132px;background:radial-gradient(circle at 32% 20%,#F4F2FF,#DBD6FC 42%,#6F66BE);' },
 { name: 'METEOR', label:'Estrella Meteor', style:'left:78%;top:64%;width:62px;height:62px;background:radial-gradient(circle at 25% 23%,#FFE4D3,#FE7833 55%,#9A3A0B);' },
]
</script>
<template>
  <div class="galaxy-stage" aria-label="Galaxia decorativa con planetas seleccionables">
    <div class="orbit one"></div><div class="orbit two"></div><div class="orbit three"></div>
    <button v-for="w in worlds" :key="w.name" type="button" class="world"
      :style="w.style" :aria-label="w.label" @click="selected = w.name" />
    <div class="star">✦</div>
    <div class="selected">MUNDO SELECCIONADO · <b>{{ selected }}</b></div>
  </div>
</template>
<style scoped>
.galaxy-stage{height:100%;width:100%;position:relative;background:#1F2139 url('../assets/template/fondo-espacio.svg') center/cover;border-radius:4px;box-shadow:6px 6px 0 #243837;overflow:hidden}
.orbit{position:absolute;border:2px dashed #DBD6FC80;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-10deg)}
.one{width:44%;height:47%}.two{width:70%;height:72%}.three{width:90%;height:92%}
.world{position:absolute;cursor:pointer;border:2px solid #F2F4D9aa;box-shadow:inset -12px -9px 30px #24383788;border-radius:50%;animation:planetfloat 5s ease-in-out infinite}
.world:focus-visible{outline:3px solid #B1FA63;outline-offset:4px}
.world:nth-child(2){animation-delay:1.5s}.world:nth-child(3){animation-delay:2.5s}
.star{position:absolute;top:41%;left:47%;font-size:56px;color:#F2F4D9}
.selected{position:absolute;bottom:14px;left:16px;background:#243837;color:#DBD6FC;padding:9px 14px;font-size:14px;font-weight:700;letter-spacing:1px}
.selected b{color:#B1FA63}
@keyframes planetfloat{50%{translate:0 -13px}}
@media(prefers-reduced-motion:reduce){.world{animation:none}}
</style>
