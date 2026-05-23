<template>
  <div class="ai-chat-view">
    <div class="chat-layout">
      <div class="chat-frame glass-panel">
        <iframe
          src="https://udify.app/chatbot/p4vRovsrRj8atz7G"
          class="chat-iframe"
          frameborder="0"
          allow="microphone"
        />
      </div>
      <div class="chara-container">
        <img :src="charaImg" alt="Denia" class="chara-img" />
        <div class="speech-bubble">
          <span>你好呀，漂泊者</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import charaImg from '@/canvas/effects/chara.png'
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

.chat-layout {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  height: 100%;
  min-height: 700px;
}

.chat-frame {
  width: 1000px;
  flex-shrink: 0;
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

/* ── Character ── */
.chara-container {
  position: relative;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.chara-img {
  display: block;
  height: 100%;
  width: auto;
  max-width: 460px;
  object-fit: contain;
  filter:
    drop-shadow(0 0 12px rgba(255, 182, 193, 0.55))
    drop-shadow(0 0 28px rgba(255, 255, 255, 0.25))
    drop-shadow(0 0 55px rgba(255, 182, 193, 0.35))
    drop-shadow(0 0 90px rgba(255, 200, 220, 0.15));
}

/* ── Speech Bubble ── */
.speech-bubble {
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 10px 18px;
  white-space: nowrap;
  animation: float 3s ease-in-out infinite;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 9px solid rgba(255, 255, 255, 0.22);
}

.speech-bubble span {
  color: #fff;
  font-size: 0.9rem;
  letter-spacing: 0.08rem;
  text-shadow: 0 0 8px rgba(255, 182, 193, 0.5);
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

/* ── Responsive ── */
@media screen and (max-width: 780px) {
  .chat-layout {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .chat-frame {
    width: 100%;
    min-height: 500px;
  }

  .chat-iframe {
    min-height: 500px;
  }

  .chara-container {
    height: 280px;
  }

  .chara-img {
    max-width: 180px;
  }

  .speech-bubble {
    top: -44px;
    padding: 8px 14px;
  }

  .speech-bubble span {
    font-size: 0.8rem;
  }
}

@media screen and (max-width: 680px) {
  .ai-chat-view {
    padding: 12px;
  }
}
</style>
