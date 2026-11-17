<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

import Phaser from 'phaser';
import { MainScene } from '../game/MainScene';

const props = defineProps(['nomUsuari', 'colorAvatar', 'estat', 'pausa']);//Rep la prop des d'App.vue
const contenidor = ref(null); 
let game = null;              

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,          // Tria WebGL automàticament (o Canvas 2D)
    width: 640, height: 400,    // Mides del llenç en píxels
    backgroundColor: '#1e293b', // Fons fosc per distingir l'àrea del joc
    parent: contenidor.value,   // Injecta el <canvas> dins del nostre <div>
    scene: [MainScene]          // Escena inicial que arrencarà el motor
  });

  //Sincronitza el nom actual només acabar d'arrencar (útil amb v-if)
  game.events.once('ready', () => {
    game?.scene.getScene('MainScene')?.actualitzarNom(props.nomUsuari);
  });

});

onUnmounted(() => game?.destroy(true));

//Al MATEIX nivell que onMounted (MAI dins d'onMounted)
watch(() => props.nomUsuari, (nouNom) => {
  const escena = game?.scene.getScene('MainScene');
  escena?.actualitzarNom(nouNom);
});

watch(() => props.colorAvatar, (nouColor) =>{
  const escena = game?.scene.getScene('MainScene');
  escena?.actualitzarColor(nouColor);
});

watch(() => props.estat, (nouEstat) =>{
  const escena = game?.scene.getScene('MainScene');
  escena?.actualitzarEstat(nouEstat);
});

watch(() => props.pausa, (estaPausat) =>{
  const escena =  game?.scene.getScene('MainScene');
  if(estaPausat){
    escena?.scene.pause();
  }else{
    escena?.scene.resume();
  }
});

</script>
<template><div ref="contenidor"></div></template>
