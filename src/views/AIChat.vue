<template>
  <div class="ai-chat-view">
    <div class="chat-frame glass-panel">
      <iframe
        src="https://udify.app/chatbot/p4vRovsrRj8atz7G"
        class="chat-iframe"
        frameborder="0"
        allow="microphone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ai-chat-view {
  width: 100%;
  min-height: 100%;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.chat-frame {
  width: 100%;
  max-width: 900px;
  height: 100%;
  min-height: 700px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(148, 123, 255, 0.007);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow:
    0 0 0 1px rgba(var(--c-pink), 0.2),
    0 8px 40px rgba(255, 255, 255, 0.123);
}

.chat-iframe {
  width: 100%;
  height: 100%;
  min-height: 700px;
  border: none;
  background: transparent;
  opacity: 0.92;
}

@media screen and (max-width: 680px) {
  .ai-chat-view {
    padding: 12px;
  }
}
</style>
