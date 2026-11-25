<script setup lang="ts">
import {ref} from 'vue'
// This is an operator-updated cue board. No GitHub data is fetched or simulated.
const phases=[
 {name:'COPILOT',role:'CONSTRUIR',description:'Portal entre dos mundos',url:'https://github.com/davidop/academyverso-2026/issues'},
 {name:'CLAUDE',role:'MEJORAR',description:'Energía y movimiento',url:'https://github.com/davidop/academyverso-2026/pulls'},
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
.mission-board{margin-top:22px}
.mission-board-note{letter-spacing:1.5px;color:#DBD6FC;font-size:14px;font-weight:700;margin-bottom:16px}
.mission-board-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.mission-board-item{min-height:250px;padding:22px 22px;border-radius:4px;background:#F2F4D9;color:#243837;box-shadow:6px 6px 0 #B1FA63;display:flex;flex-direction:column;gap:9px}
.mission-board-item:nth-child(2){box-shadow:6px 6px 0 #DBD6FC}.mission-board-item:nth-child(3){box-shadow:6px 6px 0 #FE7833}
.mission-board-item small{letter-spacing:1.4px;color:#00695C;font-size:14px;font-weight:800}
.mission-board-item h3{font-family:'CHANEY','Unbounded',sans-serif;font-size:28px;font-weight:800;color:#243837}
.mission-board-item p{font-size:18px;color:#2F4A48}
.mission-board-item button{border:0;border-radius:2px;background:#243837;color:#B1FA63;cursor:pointer;font-size:15px;padding:11px;margin-top:auto;font-weight:800;font-family:inherit}
.mission-board-item button:focus-visible{outline:3px solid #FE7833;outline-offset:2px}
.mission-board-item a{color:#243837;font-size:14px;font-weight:800}
</style>
