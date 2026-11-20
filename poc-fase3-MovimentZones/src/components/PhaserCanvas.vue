<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import Phaser from 'phaser';
    import { OfficeScene } from '../game/OfficeScene';

    // Declarem l'esdeveniment que emetrem cap al component pare (App.vue)
    const emit = defineEmits(['mapaCarregat']);
    const contenidor = ref(null);
    let game = null;

    onMounted(() => {
        game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 640, height: 480,
            backgroundColor: '#0f172a',
            pixelArt: true,             
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 } }
            },
            parent: contenidor.value,
            scene: [OfficeScene]
        });
        game.events.on('canvi-zona', (zona) => emit('canviZona', zona));
    });

    onUnmounted(() => game?.destroy(true));

</script>

<template>
    <div ref="contenidor"></div>
</template>

<style scoped>

</style>