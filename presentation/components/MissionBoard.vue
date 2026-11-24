<script setup lang="ts">
import {ref} from 'vue'
// This is an operator-updated cue board. No GitHub data is fetched or simulated.
const phases=[
 {name:'COPILOT',role:'CONSTRUIR',description:'Portal entre dos mundos',url:'https://github.com/davidop/academyverso-2026/issues'},
 {name:'CLAUDE',role:'DISEÑAR',description:'Energía y movimiento',url:'https://github.com/davidop/academyverso-2026/pulls'},
 {name:'CODEX',role:'VERIFICAR',description:'Pruebas y accesibilidad',url:'https://github.com/davidop/academyverso-2026/actions'}
]
const labels=['PREPARADA','EN CURSO','REVISAR PR','RESPALDO','VERIFICADA']
const states=ref([0,0,0])
const advance=(index:number)=>{states.value[index]=(states.value[index]+1)%labels.length}
</script>
<template>
 <div class="mission-board">
  <div class="mission-board-note">ESTADO MANUAL DEL PRESENTADOR · «VERIFICADA» SOLO CON EVIDENCIA REAL</div>
  <div class="mission-board-grid">
   <div v-for="(phase,i) in phases" :key="phase.name" class="mission-board-item">
    <small>0{{i+1}} · {{phase.role}}</small>
    <h3>{{phase.name}}</h3>
    <p>{{phase.description}}</p>
    <button type="button" :aria-label="`Cambiar estado de ${phase.name}`" @click="advance(i)">{{labels[states[i]]}} ↻</button>
    <a :href="phase.url" target="_blank" rel="noopener noreferrer">VER EVIDENCIA ↗</a>
   </div>
  </div>
 </div>
</template>
<style scoped>
.mission-board{margin-top:36px}
.mission-board-note{letter-spacing:1.5px;color:#d3e1f1;font-size:14px;margin-bottom:20px}
.mission-board-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.mission-board-item{min-height:275px;padding:27px 24px;border-radius:24px;background:linear-gradient(135deg,#294069ee,#1b2948);border:1px solid #8efae885;display:flex;flex-direction:column;gap:12px}
.mission-board-item:nth-child(2){border-color:#be91f1}.mission-board-item:nth-child(3){border-color:#efb17d}
.mission-board-item small{letter-spacing:1.4px;color:#9ff6e5;font-size:16px;font-weight:800}
.mission-board-item h3{font-size:37px;font-weight:900;color:white}
.mission-board-item p{font-size:20px;color:#cfdbef}
.mission-board-item button{border:1px solid #aff1e7;border-radius:12px;background:#224d5c;color:white;cursor:pointer;font-size:15px;padding:12px;margin-top:auto;font-weight:800}
.mission-board-item button:focus-visible{outline:3px solid #fff}
.mission-board-item a{color:#9eeada;font-size:14px;font-weight:800}
</style>
