<template>
  <div v-if="visible" class="splash-screen">
    <!-- 文字层 -->
    <div class="splash-text">
      <h1 class="latin">Do svidaniya</h1>
      <p class="chinese">达斯维达妮娅</p>
      <p class="russian">До свидания</p>
    </div>

    <!-- 泡泡层 — 从开始就在 -->
    <div class="bubbles-layer">
      <img
        v-for="b in bubbles"
        :key="b.id"
        :src="bubbleSrc"
        class="bubble"
        :style="{
          '--drift': b.drift + 'px',
          left: b.left + '%',
          width: b.size + 'px',
          height: b.size + 'px',
          animationDuration: b.duration + 's',
          animationDelay: b.delay + 's',
          opacity: b.opacity,
          filter: b.filter,
        }"
      />
    </div>

    <!-- Doll 动画层 — 文字消失后出现 -->
    <img :src="dollW" class="doll doll-w" />
    <img :src="dollB" class="doll doll-b" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import bubbleSrc from '@/canvas/effects/bubble.png';
import dollW from '@/canvas/effects/doll_w.png';
import dollB from '@/canvas/effects/doll_b.png';

const visible = ref(true);

interface Bubble {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  filter: string;
}

const bubbles = ref<Bubble[]>([]);

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const router = useRouter();

onMounted(() => {
  const count = 80;
  const arr: Bubble[] = [];
  for (let i = 0; i < count; i++) {
    const size = rand(20, 200);
    arr.push({
      id: i,
      left: rand(-5, 105),
      size,
      duration: rand(2, 5),
      delay: rand(0, 3),
      drift: rand(-80, 80),
      opacity: rand(0.25, 0.85),
      filter: `blur(${Math.floor(rand(0, 4))}px) brightness(${rand(0.6, 1.4)})`,
    });
  }
  bubbles.value = arr;

  setTimeout(() => {
    visible.value = false;
    router.push('/');
  }, 4500);
});
</script>

<style scoped>
@font-face {
  font-family: 'WuWa Lahai-Roi';
  src: url('./font/WuWa-Lahai-Roi-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 9999;
  pointer-events: all;
  overflow: hidden;
}

/* 文字层 */
.splash-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  animation: textGlow 2s ease-in-out forwards;
}

.latin {
  font-family: 'WuWa Lahai-Roi', sans-serif;
  color: #fff;
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: normal;
  letter-spacing: 0.15em;
  margin: 0;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
}

.chinese {
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(1rem, 3vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  margin: 1rem 0 0 0;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.russian {
  color: rgba(255, 255, 255, 0.5);
  font-size: clamp(1rem, 3vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.2em;
  margin: 0.6rem 0 0 0;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.25);
}

@keyframes textGlow {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  20%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  80%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
}

/* 泡泡层 */
.bubbles-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bubble {
  position: absolute;
  left: 0;
  animation: bubbleRise ease-out forwards;
  will-change: bottom, transform, opacity;
}

@keyframes bubbleRise {
  0% {
    bottom: -15%;
    transform: scale(0.4) translateX(0);
    opacity: 0;
  }
  8% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
  100% {
    bottom: 105%;
    transform: scale(0.5) translateX(var(--drift, 0px));
    opacity: 0;
  }
}

/* Doll 层 */
.doll {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: auto;
  z-index: 3;
  opacity: 0;
  pointer-events: none;
}

.doll-w {
  animation: dollWAnim 2.5s ease-in 2s forwards;
}

.doll-b {
  animation: dollBAnim 2.5s ease-in 2s forwards;
}

@keyframes dollWAnim {
  0% {
    translate: calc(-50vw + 60px) -50%;
    scale: 1;
    rotate: 0deg;
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  30% {
    translate: calc(-50% - 70px) -50%;
    scale: 1;
    rotate: 0deg;
    opacity: 1;
  }
  38% {
    translate: calc(-50% - 70px) -82%;
    scale: 1.06 0.94;
    rotate: 0deg;
    opacity: 1;
  }
  46% {
    translate: calc(-50% - 70px) -46%;
    scale: 0.94 1.06;
    rotate: 0deg;
    opacity: 1;
  }
  54% {
    translate: calc(-50% - 70px) -92%;
    scale: 1.08 0.92;
    rotate: 0deg;
    opacity: 1;
  }
  62% {
    translate: calc(-50% - 70px) -46%;
    scale: 0.92 1.08;
    rotate: 0deg;
    opacity: 1;
  }
  70% {
    translate: calc(-50% - 70px) 8vh;
    scale: 0.9;
    rotate: 20deg;
    opacity: 0.9;
  }
  80% {
    translate: calc(-50% - 70px) 35vh;
    scale: 0.75;
    rotate: 80deg;
    opacity: 0.6;
  }
  92% {
    translate: calc(-50% - 70px) 80vh;
    scale: 0.55;
    rotate: 145deg;
    opacity: 0.25;
  }
  100% {
    translate: calc(-50% - 70px) 120vh;
    scale: 0.4;
    rotate: 180deg;
    opacity: 0;
  }
}

@keyframes dollBAnim {
  0% {
    translate: calc(50vw - 60px) -50%;
    scale: 1;
    rotate: 0deg;
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  30% {
    translate: calc(-50% + 70px) -50%;
    scale: 1;
    rotate: 0deg;
    opacity: 1;
  }
  38% {
    translate: calc(-50% + 70px) -82%;
    scale: 1.06 0.94;
    rotate: 0deg;
    opacity: 1;
  }
  46% {
    translate: calc(-50% + 70px) -46%;
    scale: 0.94 1.06;
    rotate: 0deg;
    opacity: 1;
  }
  54% {
    translate: calc(-50% + 70px) -92%;
    scale: 1.08 0.92;
    rotate: 0deg;
    opacity: 1;
  }
  62% {
    translate: calc(-50% + 70px) -46%;
    scale: 0.92 1.08;
    rotate: 0deg;
    opacity: 1;
  }
  70% {
    translate: calc(-50% + 70px) 8vh;
    scale: 0.9;
    rotate: -20deg;
    opacity: 0.9;
  }
  80% {
    translate: calc(-50% + 70px) 35vh;
    scale: 0.75;
    rotate: -80deg;
    opacity: 0.6;
  }
  92% {
    translate: calc(-50% + 70px) 80vh;
    scale: 0.55;
    rotate: -145deg;
    opacity: 0.25;
  }
  100% {
    translate: calc(-50% + 70px) 120vh;
    scale: 0.4;
    rotate: -180deg;
    opacity: 0;
  }
}
</style>
