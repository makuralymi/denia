<template>
  <div v-if="lyricLines.length > 0" class="lyrics-overlay">
    <div class="lyrics-mask">
      <div class="lyrics-scroll" ref="scrollRef">
        <div class="lyrics-spacer"></div>
        <p
          v-for="(line, i) in lyricLines"
          :key="i"
          :ref="el => setLineRef(el as HTMLElement | null, i)"
          class="lyric-line"
          :class="{
            active: i === activeIndex,
            'prev-line': i === activeIndex - 1,
            'next-line': i === activeIndex + 1,
          }"
          :style="lineStyle(i)"
        >
          <span class="lyric-accent"></span>
          <span class="lyric-text">{{ line.text }}</span>
        </p>
        <div class="lyrics-spacer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useLyrics } from '@/composables/useLyrics';

const { lyricLines, activeIndex } = useLyrics();

const scrollRef = ref<HTMLElement | null>(null);
const lineRefs = ref<Record<number, HTMLElement>>({});

function setLineRef(el: HTMLElement | null, i: number) {
  if (el) {
    lineRefs.value[i] = el;
  }
}

function lineStyle(i: number) {
  const dist = i - activeIndex.value;
  const absDist = Math.abs(dist);

  // Arc bulge toward screen center (leftward, so negative X)
  // Active line is the peak; falls off quadratically with distance
  const arcX = -Math.max(0, 50 - absDist * absDist * 2.2);

  // Scale crescendo toward the active line
  const scale = 1 - Math.min(absDist * 0.05, 0.22);

  // Opacity decays with distance
  const opacity = 1 - Math.min(absDist * 0.12, 0.55);

  return {
    '--lx': `${arcX.toFixed(1)}px`,
    '--ls': scale.toFixed(2),
    '--lo': opacity.toFixed(2),
  };
}

watch(activeIndex, async (idx) => {
  if (idx < 0 || !scrollRef.value) return;
  await nextTick();
  const el = lineRefs.value[idx];
  if (el) {
    const container = scrollRef.value!;
    const containerHeight = container.clientHeight;
    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const scrollTarget = elTop - containerHeight / 2 + elHeight / 2;
    container.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
  }
});
</script>

<style scoped>
.lyrics-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 40vw;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.lyrics-mask {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      to left,
      rgba(0, 0, 0, 0.88) 0%,
      rgba(0, 0, 0, 0.6) 35%,
      rgba(0, 0, 0, 0.2) 65%,
      rgba(0, 0, 0, 0.05) 85%,
      transparent 100%
    );
  display: flex;
  align-items: center;
  backdrop-filter: blur(1px);
}

.lyrics-scroll {
  width: 100%;
  max-height: 100%;
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding: 0 2.5rem 0 1.5rem;
}

.lyrics-spacer {
  height: 45vh;
}

.lyric-line {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  color: rgba(173, 206, 253, 0.45);
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-align: right;
  padding: 0.4rem 0;
  margin: 0;

  /* Dynamic transforms via CSS custom properties */
  transform:
    translateX(var(--lx, 0px))
    scale(var(--ls, 1));
  opacity: var(--lo, 1);

  filter: blur(0.4px);
  transition:
    transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.5s ease,
    color 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
    font-size 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
    font-weight 0.5s ease,
    letter-spacing 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
    padding 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
    filter 0.6s ease;
}

/* Adjacent lines */
.lyric-line.prev-line,
.lyric-line.next-line {
  color: rgba(188, 215, 255, 0.6);
  filter: blur(0px);
}

.lyric-accent {
  display: inline-block;
  width: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(250, 191, 253, 0.8),
    rgb(250, 191, 253)
  );
  border-radius: 1px;
  transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
  flex-shrink: 0;
}

.lyric-line.active .lyric-accent {
  width: 1.5rem;
  height: 2px;
  box-shadow:
    0 0 6px rgba(250, 191, 253, 0.8),
    0 0 14px rgba(250, 191, 253, 0.4);
}

.lyric-line.active {
  color: rgb(250, 191, 253);
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  padding: 0.65rem 0;
  filter: blur(0px);
  text-shadow:
    0 0 8px rgba(250, 191, 253, 0.7),
    0 0 20px rgba(250, 191, 253, 0.45),
    0 0 40px rgba(250, 191, 253, 0.25),
    0 0 80px rgba(250, 191, 253, 0.1);
}

/* Shimmer animation on active text */
.lyric-line.active .lyric-text {
  background: linear-gradient(
    120deg,
    rgb(250, 191, 253) 0%,
    rgb(255, 220, 250) 30%,
    rgb(250, 191, 253) 50%,
    rgb(255, 210, 245) 70%,
    rgb(250, 191, 253) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lyric-shimmer 2.5s ease-in-out infinite;
}

@keyframes lyric-shimmer {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}
</style>
