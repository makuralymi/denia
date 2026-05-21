<template>
  <div class="overview-container">
    <div class="content-placeholder">
      <p>Awaiting Instructions...</p>
    </div>

    <LyricsOverlay />
  </div>
</template>

<script setup lang="ts">
import LyricsOverlay from '@/components/shared/LyricsOverlay.vue';
</script>

<style scoped>
.overview-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.content-placeholder p {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 300;
  letter-spacing: 0.2rem;
  font-size: 1.2rem;
}
</style>
