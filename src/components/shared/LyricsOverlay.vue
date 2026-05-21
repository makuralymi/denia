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
          :class="{ active: i === activeIndex }"
        >
          {{ line.text }}
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
  width: 33.33vw;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.lyrics-mask {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.55) 40%,
    rgba(0, 0, 0, 0.15) 75%,
    transparent 100%
  );
  display: flex;
  align-items: center;
}

.lyrics-scroll {
  width: 100%;
  max-height: 100%;
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding: 0 2rem 0 1rem;
}

.lyrics-spacer {
  height: 45vh;
}

.lyric-line {
  color: rgba(173, 206, 253, 0.65);
  font-size: 0.8rem;
  font-weight: 300;
  letter-spacing: 0.08em;
  text-align: right;
  padding: 0.45rem 0;
  margin: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-shadow: none;
}

.lyric-line.active {
  color: rgb(250, 191, 253);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-shadow:
    0 0 12px rgba(250, 191, 253, 0.9),
    0 0 30px rgba(250, 191, 253, 0.5),
    0 0 60px rgba(250, 191, 253, 0.3);
  padding: 0.7rem 0;
}
</style>
