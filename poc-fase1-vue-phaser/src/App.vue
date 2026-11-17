<script setup>
import { ref } from 'vue';
// Importem el component pont que conté el <canvas> de Phaser
import PhaserCanvas from './components/PhaserCanvas.vue';

// Variable reactiva que guarda el nom escrit a la caixa de text
const nom = ref('Anna');
const color = ref('');
// Booleà per muntar/desmuntar el joc i verificar onMounted / onUnmounted
const mostrarJoc = ref(true);
const estat = ref('Disponible');
const pausa=ref('false');
</script>

<template>
  <main class="contenidor-app">
    <!-- Tota la interfície d'usuari (inputs, botons) es fa en HTML/CSS dins de Vue -->
    <div class="controls" id="container">
      <input v-model="nom" placeholder="Escriu el teu nom d'usuari..." />

      <input type="color" v-model="color" id="selectorColor">

      <select v-model="estat" id="selectEstat">
        <option>Disponible</option>
        <option>Ocupat</option>
        <option>Absent</option>
      </select>

      <button @click="mostrarJoc = !mostrarJoc" id="btnMostrar">
        {{ mostrarJoc ? 'Amaga el llenç' : 'Mostra el llenç' }}
      </button>

      <button @click="pausa = !pausa" id="btnPausar">
        {{ pausa ? 'Reprèn' : 'Pausa' }}
      </button>
    </div>

    <!-- Passem 'nom' cap avall amb :nomUsuari i controlem el cicle amb v-if -->
    <PhaserCanvas v-if="mostrarJoc" :nomUsuari="nom" :colorAvatar="color" :estat="estat" :pausa="pausa"/>
  </main>
</template>

<style>
  #container{
    margin-bottom: 25px;
    margin-top: 20px;
  }
  #btnMostrar, #selectorColor, #selectEstat, #btnPausar{
    margin-left: 15px;
  }
</style>
