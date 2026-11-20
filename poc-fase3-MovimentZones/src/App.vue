<script setup>
import { ref } from 'vue';
import PhaserCanvas from './components/PhaserCanvas.vue';

const zonaActiva = ref(null); // null = passadís | { nom: '...' } = dins d'una sala
</script>

<template>
  <main style="display: flex; gap: 20px; padding: 20px; font-family: sans-serif;">
    <PhaserCanvas @canvi-zona="zonaActiva = $event" />

    <aside style="width: 280px; background: #1e293b; color: white; padding: 18px; border-radius: 12px;">
      <h3>Estat de Proximitat</h3>
      <div v-if="zonaActiva" style="background: #065f46; border: 2px solid #10b981; padding: 14px; border-radius: 8px;">
        <strong>Dins de: {{ zonaActiva.nom }}</strong>
        <p style="margin: 6px 0 0; font-size: 13px; color: #a7f3d0;">Àudio de sala actiu (llest per Fase 4)</p>
      </div>
      <div v-else style="background: #334155; padding: 14px; border-radius: 8px;">
        <strong>Passadís / Zona comuna</strong>
        <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1;">Sense conversa activa</p>
      </div>
      <p style="margin-top: 16px; font-size: 12px; color: #94a3b8;">Controls: WASD o Fletxes per moure en George.</p>
    </aside>
  </main>
</template>
