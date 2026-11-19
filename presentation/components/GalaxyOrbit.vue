<script setup lang="ts">
import { ref } from 'vue'
const selected = ref('NEÓN-42')
const worlds = [
 { name: 'PYTHONIA', label:'Planeta Pythonia', style:'left:13%;top:48%;width:106px;height:106px;background:radial-gradient(circle at 27% 26%,#b6f8db,#2795a7 64%,#103f75);' },
 { name: 'NEÓN-42', label:'Planeta Neón-42', style:'left:55%;top:14%;width:144px;height:144px;background:radial-gradient(circle at 32% 20%,#f5d1ff,#a765ca 61%,#32235a);' },
 { name: 'METEOR', label:'Estrella Meteor', style:'left:76%;top:68%;width:66px;height:66px;background:radial-gradient(circle at 25% 23%,#fffbd4,#ffb25c 65%,#9b4a48);' },
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
.galaxy-stage{height:100%;width:100%;position:relative;background:radial-gradient(ellipse at 50% 44%,#5654a245,transparent 67%);border-radius:27px;overflow:hidden}
.orbit{position:absolute;border:1px dashed #a2f2e578;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-10deg)}
.one{width:44%;height:47%}.two{width:70%;height:72%}.three{width:90%;height:92%}
.world{position:absolute;cursor:pointer;border:2px solid #ffffff7a;box-shadow:0 0 36px #76d8e74f,inset -13px -9px 35px #18243f69;border-radius:50%;animation:planetfloat 5s ease-in-out infinite}
.world:nth-child(2){animation-delay:1.5s}.world:nth-child(3){animation-delay:2.5s}
.star{position:absolute;top:43%;left:47%;font-size:64px;color:#fff7c9;filter:drop-shadow(0 0 20px #ffdb8f)}
.selected{position:absolute;bottom:16px;left:20px;background:#121f3eda;color:#d6eaf2;padding:10px 15px;border-radius:13px;font-size:14px;letter-spacing:1px}
.selected b{color:#85f0df}
@keyframes planetfloat{50%{translate:0 -13px}}
@media(prefers-reduced-motion:reduce){.world{animation:none}}
</style>
