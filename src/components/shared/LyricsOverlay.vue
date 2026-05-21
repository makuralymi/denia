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

          <!-- Active line: dual-layer KTV fill + particles -->
          <template v-if="i === activeIndex">
            <span class="lyric-fill-wrap">
              <span class="lyric-fill-base">{{ line.text }}</span>
              <span class="lyric-fill-overlay" :style="fillClipStyle">{{ line.text }}</span>
            </span>
            <span
              v-for="(p, pi) in particles"
              :key="pi"
              class="lyric-particle"
              :style="p"
            ></span>
          </template>

          <!-- Inactive lines: simple text -->
          <span v-else class="lyric-text">{{ line.text }}</span>
        </p>
        <div class="lyrics-spacer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { useLyrics } from '@/composables/useLyrics';
import { useAudioStore } from '@/stores/audioStore';

const { lyricLines, activeIndex } = useLyrics();
const audioStore = useAudioStore();

const scrollRef = ref<HTMLElement | null>(null);
const lineRefs = ref<Record<number, HTMLElement>>({});

function setLineRef(el: HTMLElement | null, i: number) {
  if (el) {
    lineRefs.value[i] = el;
  }
}

// ── Arc layout ──────────────────────────────────────────────
function lineStyle(i: number) {
  const dist = i - activeIndex.value;
  const absDist = Math.abs(dist);

  const arcX = -Math.max(0, 50 - absDist * absDist * 2.2);
  const scale = 1 - Math.min(absDist * 0.05, 0.22);
  const opacity = 1 - Math.min(absDist * 0.12, 0.55);

  return {
    '--lx': `${arcX.toFixed(1)}px`,
    '--ls': scale.toFixed(2),
    '--lo': opacity.toFixed(2),
  };
}

// ── KTV fill progress (0–1) ─────────────────────────────────
const lineProgress = computed(() => {
  const idx = activeIndex.value;
  if (idx < 0 || lyricLines.value.length === 0) return 0;

  const lines = lyricLines.value;
  const lineStart = lines[idx].time;
  const now = audioStore.currentTime;

  const lineEnd =
    idx + 1 < lines.length ? lines[idx + 1].time : lineStart + 4;

  const duration = lineEnd - lineStart;
  if (duration <= 0) return 1;

  return Math.min(1, Math.max(0, (now - lineStart) / duration));
});

const fillClipStyle = computed(() => ({
  clipPath: `inset(0 ${((1 - lineProgress.value) * 100).toFixed(1)}% 0 0)`,
}));

// ── Glow particles ──────────────────────────────────────────
const particles = computed(() => {
  const idx = activeIndex.value;
  const items: Record<string, string>[] = [];
  for (let i = 0; i < 20; i++) {
    const s1 = pseudoRandom(idx * 131 + i * 97);
    const s2 = pseudoRandom(idx * 257 + i * 163);
    const s3 = pseudoRandom(idx * 389 + i * 211);
    const s4 = pseudoRandom(idx * 541 + i * 307);
    items.push({
      '--ppx': `${(s1 * 180 - 10).toFixed(0)}px`,
      '--ppy': `${(s2 * 36 - 18).toFixed(0)}px`,
      '--ppd': `${(s3 * 2.2).toFixed(2)}s`,
      '--pps': `${(2 + s4 * 3).toFixed(1)}px`,
      '--ppx-drift': `${((s2 - 0.5) * 16).toFixed(0)}px`,
    });
  }
  return items;
});

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Scroll tracking ─────────────────────────────────────────
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

/* ── Line base ──────────────────────────────────────────── */
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

.lyric-line.prev-line,
.lyric-line.next-line {
  color: rgba(188, 215, 255, 0.6);
  filter: blur(0px);
}

/* ── Accent bar ─────────────────────────────────────────── */
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

/* ── Active line layout ─────────────────────────────────── */
.lyric-line.active {
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  padding: 0.65rem 0;
  filter: blur(0px);
}

/* ── KTV dual-layer fill ────────────────────────────────── */
.lyric-fill-wrap {
  display: inline-grid;
  grid-template: 1fr / 1fr;
}

.lyric-fill-base {
  grid-area: 1 / 1;
  color: rgba(173, 206, 253, 0.55);
}

.lyric-fill-overlay {
  grid-area: 1 / 1;
  color: rgb(250, 191, 253);
  text-shadow:
    0 0 8px rgba(250, 191, 253, 0.7),
    0 0 20px rgba(250, 191, 253, 0.45),
    0 0 40px rgba(250, 191, 253, 0.25),
    0 0 80px rgba(250, 191, 253, 0.1);
  animation: ktv-glow-pulse 2s ease-in-out infinite;
}

@keyframes ktv-glow-pulse {
  0%, 100% {
    text-shadow:
      0 0 8px rgba(250, 191, 253, 0.7),
      0 0 20px rgba(250, 191, 253, 0.45),
      0 0 40px rgba(250, 191, 253, 0.25);
  }
  50% {
    text-shadow:
      0 0 14px rgba(255, 200, 255, 1),
      0 0 32px rgba(255, 200, 255, 0.75),
      0 0 55px rgba(250, 191, 253, 0.45),
      0 0 90px rgba(250, 191, 253, 0.15);
  }
}

/* ── Glow particles ─────────────────────────────────────── */
.lyric-particle {
  position: absolute;
  right: var(--ppx, 0px);
  top: 50%;
  margin-top: var(--ppy, 0px);
  width: var(--pps, 3px);
  height: var(--pps, 3px);
  border-radius: 50%;
  background: rgb(250, 191, 253);
  box-shadow:
    0 0 4px rgba(250, 191, 253, 0.9),
    0 0 8px rgba(250, 191, 253, 0.5);
  pointer-events: none;
  opacity: 0;
  animation: particle-float 2.8s ease-in-out infinite;
  animation-delay: var(--ppd, 0s);
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(1);
  }
  15% {
    opacity: 0.9;
    transform: translate(var(--ppx-drift, 4px), -6px) scale(1.6);
  }
  40% {
    opacity: 0.5;
    transform: translate(calc(var(--ppx-drift, 4px) * -0.6), -14px) scale(0.7);
  }
  70% {
    opacity: 0.1;
    transform: translate(calc(var(--ppx-drift, 4px) * 0.3), -6px) scale(0.3);
  }
  100% {
    opacity: 0;
    transform: translate(0, 0) scale(1);
  }
}
</style>
