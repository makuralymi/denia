<template>
  <div class="mini-player-wrapper">
    <!-- 玻璃态控制面板（可拖曳） -->
    <div
      ref="playerPanelRef"
      class="player-panel"
      :class="{ dragging: isDragging, collapsed: collapsed }"
      :style="{ transform: `translateX(${panelTranslateX})` }"
      @mousedown.prevent="onDragStart"
      @touchstart.prevent="onTouchDragStart"
    >
      <!-- 拖曳手柄视觉提示 -->
      <div class="drag-handle" :class="{ active: isDragging }">
        <span></span><span></span><span></span>
      </div>

      <!-- 播放/暂停及上一首/下一首控制区 -->
      <div class="controls-area">
        <button class="control-btn" @click.stop="prevSong" title="上一首">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <div
          class="record-disk"
          :class="{ 'is-playing': isPlaying }"
          @click.stop="togglePlay"
        >
          <div class="record-center"></div>
        </div>
        <button class="control-btn" @click.stop="nextSong" title="下一首">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
        <button class="control-btn" @click.stop="togglePlaylist" title="播放列表" :class="{ 'active': showPlaylist }">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
      </div>

      <div class="song-info">
        <div class="song-title">{{ currentSong?.name || 'DENIA THEME' }}</div>
        <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
      </div>
    </div>

    <!-- 播放列表弹窗 -->
    <transition name="fade">
      <div v-show="showPlaylist && !collapsed" class="playlist-panel">
        <div class="playlist-header">PLAYLIST</div>
        <div class="playlist-items">
          <div
            v-for="(song, index) in playlist"
            :key="song.url"
            class="playlist-item"
            :class="{ 'active': currentSongIndex === index }"
            @click="playSong(index)"
          >
            <div class="song-idx">{{ index + 1 }}</div>
            <div class="song-name">{{ song.name }}</div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 底部自适应视觉波谱 -->
    <canvas ref="visualizerCanvas" class="visualizer-canvas"></canvas>

    <!-- 底部全局悬浮发光进度条 -->
    <div class="progress-bar-container" @click="seek">
      <div class="progress-track">
        <!-- Doll 固定于进度条尾部 -->
        <img :src="dollW" class="progress-doll-tail" />
        <div class="progress-fill" :style="{ width: progressPercent + '%' }">
          <!-- 进度条端点发光核心 -->
          <div class="progress-glow-head"></div>
          <!-- Doll 跟随进度条头 -->
          <img :src="dollB" class="progress-doll-head" />
          <!-- 随点粒子飘散 -->
          <div v-if="isPlaying" class="particle-emitter">
            <span class="p-1" style="--rand: 0.8"></span>
            <span class="p-2" style="--rand: 0.4"></span>
            <span class="p-3" style="--rand: 1.0"></span>
            <span class="p-4" style="--rand: 0.6"></span>
            <span class="p-5" style="--rand: 0.2"></span>
            <span class="p-6" style="--rand: 0.9"></span>
            <span class="p-7" style="--rand: 0.5"></span>
            <span class="p-8" style="--rand: 0.7"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAudioStore } from '@/stores/audioStore';
import dollW from '@/canvas/effects/doll_w.png';
import dollB from '@/canvas/effects/doll_b.png';

const route = useRoute();
const audioStore = useAudioStore();

// 音频系统状态
const audio = new Audio();
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const showPlaylist = ref(false);

interface Song {
  name: string;
  url: string;
}

const playlist = ref<Song[]>([
  { name: '枯音染秽无凭裂章', url: '/audio/audio.mp3' },
  { name: '坠入虚无 (Decensus Ad Nihilum) - 鸣潮先约电台、Crywolf、kahoca', url: '/audio/audio2.mp3' },
  { name: '直到下次再见 (Dasvidaniya) - 鸣潮先约电台、Crywolf、Cxssidy', url: '/audio/audio3.mp3' },
  { name: '予以宽慰的黑夜', url: '/audio/audio4.mp3' },
]);
const currentSongIndex = ref(2); // 默认播放 audio3
const currentSong = computed(() => playlist.value[currentSongIndex.value]);

// 计算进度条百分比
const progressPercent = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

// 格式化时间
const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// ==================== 拖曳与边缘吸附 ====================
const playerPanelRef = ref<HTMLElement | null>(null);
const panelWidth = ref(460); // 初始估算值，会在 onMounted 中实测
const isDragging = ref(false);
const collapsed = ref(false);
const dragCurrent = ref(0); // 拖曳中的实时偏移

// 拖曳起始状态
let dragStartMouseX = 0;
let dragStartOffset = 0;

// 最终面板偏移（含收起状态）
const COLLAPSED_VISIBLE = 36; // 收起时露出的像素
const SNAP_THRESHOLD_RATIO = 0.35; // 拖动超过面板宽度的35%即触发收起

const panelTranslateX = computed(() => {
  if (isDragging.value) {
    return `${dragCurrent.value}px`;
  }
  if (collapsed.value) {
    return `${-(panelWidth.value - COLLAPSED_VISIBLE)}px`;
  }
  return '0px';
});

function onDragStart(e: MouseEvent) {
  // 如果已经收起，点击即展开
  if (collapsed.value) {
    expand();
    return;
  }
  // 如果点在按钮上，不触发拖曳
  const target = e.target as HTMLElement;
  if (target.closest('button') || target.closest('.record-disk')) return;

  isDragging.value = true;
  dragStartMouseX = e.clientX;
  dragStartOffset = collapsed.value
    ? -(panelWidth.value - COLLAPSED_VISIBLE)
    : dragCurrent.value;
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const delta = e.clientX - dragStartMouseX;
  const newOffset = dragStartOffset + delta;
  // 允许从0到面板宽度的范围拖曳
  dragCurrent.value = Math.min(0, Math.max(-panelWidth.value, newOffset));
}

function onDragEnd(_e: MouseEvent) {
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  isDragging.value = false;

  // 判断是否吸附收起
  if (dragCurrent.value < -(panelWidth.value * SNAP_THRESHOLD_RATIO)) {
    collapsed.value = true;
    dragCurrent.value = 0;
  } else {
    collapsed.value = false;
    dragCurrent.value = 0;
  }
}

// 触控拖曳
function onTouchDragStart(e: TouchEvent) {
  if (collapsed.value) {
    expand();
    return;
  }
  const target = e.target as HTMLElement;
  if (target.closest('button') || target.closest('.record-disk')) return;

  const touch = e.touches[0];
  isDragging.value = true;
  dragStartMouseX = touch.clientX;
  dragStartOffset = collapsed.value
    ? -(panelWidth.value - COLLAPSED_VISIBLE)
    : dragCurrent.value;
  document.addEventListener('touchmove', onTouchDragMove, { passive: false });
  document.addEventListener('touchend', onTouchDragEnd);
}

function onTouchDragMove(e: TouchEvent) {
  if (!isDragging.value) return;
  e.preventDefault();
  const touch = e.touches[0];
  const delta = touch.clientX - dragStartMouseX;
  const newOffset = dragStartOffset + delta;
  dragCurrent.value = Math.min(0, Math.max(-panelWidth.value, newOffset));
}

function onTouchDragEnd(_e: TouchEvent) {
  document.removeEventListener('touchmove', onTouchDragMove);
  document.removeEventListener('touchend', onTouchDragEnd);
  isDragging.value = false;

  if (dragCurrent.value < -(panelWidth.value * SNAP_THRESHOLD_RATIO)) {
    collapsed.value = true;
    dragCurrent.value = 0;
  } else {
    collapsed.value = false;
    dragCurrent.value = 0;
  }
}

function expand() {
  collapsed.value = false;
  dragCurrent.value = 0;
}

// ==================== 路由监听：games 页面默认收起 ====================
watch(
  () => route.name,
  (name) => {
    if (name === 'games') {
      collapsed.value = true;
      dragCurrent.value = 0;
    }
  },
  { immediate: true }
);

// ==================== 音频播放逻辑 ====================
const loadPlaylist = () => {
  if (playlist.value.length > 0) {
    audio.src = playlist.value[currentSongIndex.value].url;
  }
  audioStore.playlist = playlist.value;
  audioStore.currentSongIndex = currentSongIndex.value;
};

// 监听用户首次交互触发播放
watch(() => audioStore.playTrigger, () => {
  if (audio.src && audio.paused) {
    audio.play().catch(() => {});
  }
});

const playSong = (index: number) => {
  currentSongIndex.value = index;
  audio.src = playlist.value[index].url;
  audio.play();
  isPlaying.value = true;
  audioStore.currentSongIndex = index;
};

const togglePlay = () => {
  if (playlist.value.length === 0) return;

  if (!audioContext) {
    initAudioPath();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying.value = !audio.paused;
};

const nextSong = () => {
  if (playlist.value.length === 0) return;
  const next = (currentSongIndex.value + 1) % playlist.value.length;
  playSong(next);
};

const prevSong = () => {
  if (playlist.value.length === 0) return;
  const prev = (currentSongIndex.value - 1 + playlist.value.length) % playlist.value.length;
  playSong(prev);
};

const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value;
};

const seek = (e: MouseEvent) => {
  if (!duration.value) return;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, clickX / rect.width));
  const newTime = percent * duration.value;
  audio.currentTime = newTime;
  currentTime.value = newTime;
};

// --- Web Audio API 波谱相关 ---
const visualizerCanvas = ref<HTMLCanvasElement | null>(null);
let audioContext: AudioContext;
let analyser: AnalyserNode;
let dataArray: Uint8Array;
let animationFrameId: number;

const initAudioPath = () => {
  if (audioContext) return;
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;

  const source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount) as any;
};

const drawVisualizer = () => {
  if (!visualizerCanvas.value) return;
  const ctx = visualizerCanvas.value.getContext('2d');
  if (!ctx) return;

  const width = visualizerCanvas.value.width;
  const height = visualizerCanvas.value.height;

  animationFrameId = requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray as any);

  ctx.clearRect(0, 0, width, height);

  const renderLength = Math.floor(dataArray.length * 0.75);
  const gap = 2;
  const barWidth = Math.max(1, (width - gap * renderLength) / renderLength);

  let x = 0;
  for (let i = 0; i < renderLength; i++) {
    const barHeight = (dataArray[i] / 255) * height;

    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
    gradient.addColorStop(0, 'rgba(255, 180, 200, 1)');
    gradient.addColorStop(1, 'rgba(190, 220, 255, 0.9)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + gap;
  }
};

const handleResize = () => {
  if (visualizerCanvas.value) {
    visualizerCanvas.value.width = window.innerWidth;
    visualizerCanvas.value.height = 80;
  }
};

// 绑定原生音频事件
onMounted(() => {
  loadPlaylist();

  // 实测面板宽度
  nextTick(() => {
    if (playerPanelRef.value) {
      panelWidth.value = playerPanelRef.value.offsetWidth;
    }
  });

  handleResize();
  window.addEventListener('resize', handleResize);

  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime;
    audioStore.currentTime = audio.currentTime;
  });

  audio.addEventListener('durationchange', () => {
    duration.value = audio.duration;
    audioStore.duration = audio.duration;
  });

  audio.addEventListener('ended', () => {
    nextSong();
  });

  audio.addEventListener('play', () => {
    isPlaying.value = true;
    audioStore.isPlaying = true;
    if (!audioContext) {
      initAudioPath();
    }
    drawVisualizer();
  });

  audio.addEventListener('pause', () => {
    isPlaying.value = false;
    audioStore.isPlaying = false;
    cancelAnimationFrame(animationFrameId);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  document.removeEventListener('touchmove', onTouchDragMove);
  document.removeEventListener('touchend', onTouchDragEnd);
  cancelAnimationFrame(animationFrameId);
  if (audioContext) {
    audioContext.close();
  }
  audio.pause();
  audio.src = '';
});
</script>

<style scoped>
.mini-player-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2rem;
}

/* ==================== 拖曳手柄 ==================== */
.drag-handle {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 6px;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-left: -4px;
  margin-right: 2px;
}

.player-panel:hover .drag-handle,
.drag-handle.active {
  opacity: 0.5;
}

.drag-handle span {
  display: block;
  width: 12px;
  height: 2px;
  background: rgba(var(--c-light-blue), 0.8);
  border-radius: 1px;
}

/* ==================== 玻璃态面板 ==================== */
.player-panel {
  pointer-events: auto;
  margin-left: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.5rem 0.8rem 0.8rem;
  border-radius: 50px;
  background: rgba(20, 10, 20, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(var(--c-light-blue), 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(var(--c-pink), 0.1);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s ease, border-color 0.35s ease;
  position: relative;
  user-select: none;
}

.player-panel.dragging {
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
  box-shadow: 0 15px 40px rgba(var(--c-pink), 0.4), inset 0 0 0 1px rgba(var(--c-pink), 0.2);
  border-color: rgba(var(--c-pink), 0.5);
  cursor: grabbing;
}

.player-panel.collapsed {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(var(--c-pink), 0.15);
  border-color: rgba(var(--c-pink), 0.3);
}

.player-panel:not(.dragging):not(.collapsed):hover {
  transform: translateX(0) translateY(-3px) !important;
  border-color: rgba(var(--c-pink), 0.4);
}

/* ==================== 控制按钮组 ==================== */
.controls-area {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.control-btn {
  background: none;
  border: none;
  color: rgba(var(--c-light-blue), 0.8);
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  color: rgb(var(--c-pink));
  transform: scale(1.1);
}

.control-btn.active {
  color: rgb(var(--c-pink));
  background: rgba(var(--c-pink), 0.1);
}

/* 动态唱片 */
.record-disk {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, #222 30%, #111 70%, #000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(var(--c-pink), 0.5);
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.3);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.record-disk:hover {
  box-shadow: 0 0 25px rgba(var(--c-pink), 0.8);
}

.record-center {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(var(--c-light-blue));
  box-shadow: inset 0 0 4px rgba(0,0,0,0.8);
}

/* 旋转动画 */
.is-playing {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 曲目信息 */
.song-info {
  display: flex;
  flex-direction: column;
}

.song-title {
  color: #fff;
  font-size: 0.9rem;
  letter-spacing: 0.15rem;
  font-weight: 300;
  text-shadow: 0 0 10px rgba(var(--c-pink), 0.5);
  white-space: nowrap;
}

.time-display {
  color: rgba(var(--c-light-blue), 0.8);
  font-size: 0.7rem;
  letter-spacing: 0.1rem;
  margin-top: 4px;
}

/* 播放列表弹窗 */
.playlist-panel {
  pointer-events: auto;
  position: absolute;
  bottom: calc(100% + 15px);
  left: 3rem;
  width: 280px;
  max-height: 250px;
  overflow-y: auto;
  background: rgba(15, 10, 25, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--c-light-blue), 0.3);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--c-pink), 0.5) transparent;
}

.playlist-panel::-webkit-scrollbar {
  width: 6px;
}
.playlist-panel::-webkit-scrollbar-thumb {
  background-color: rgba(var(--c-pink), 0.5);
  border-radius: 3px;
}

.playlist-header {
  font-size: 0.8rem;
  color: rgba(var(--c-light-blue), 0.8);
  letter-spacing: 0.2rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-items {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ccc;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.playlist-item.active {
  background: rgba(var(--c-pink), 0.15);
  color: rgb(var(--c-pink));
  border-left: 2px solid rgb(var(--c-pink));
}

.song-idx {
  font-size: 0.7rem;
  margin-right: 0.8rem;
  opacity: 0.6;
  width: 15px;
  text-align: right;
}

.song-name {
  font-size: 0.8rem;
  font-weight: 300;
  letter-spacing: 0.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 视觉波谱画布 */
.visualizer-canvas {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  pointer-events: none;
  opacity: 0.8;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
}

/* 全局悬浮发光进度条 */
.progress-bar-container {
  pointer-events: auto;
  width: 100%;
  height: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.progress-track {
  width: 100%;
  height: 2px;
  background: rgba(var(--c-light-blue), 0.1);
  position: absolute;
  bottom: 0;
  transition: height 0.2s ease;
}

.progress-bar-container:hover .progress-track {
  height: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(var(--c-purple), 0.8), rgb(var(--c-pink)));
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.6);
  position: relative;
  transition: width 0.1s linear;
}

.progress-glow-head {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 14px;
  background: #fff;
  box-shadow: 0 0 20px 4px rgba(var(--c-pink), 0.9), 0 0 40px 10px rgba(var(--c-light-blue), 0.5);
  border-radius: 4px;
}

.progress-doll-head {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(40%, -85%);
  width: 48px;
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 0 8px rgba(250, 191, 253, 0.7));
}

.progress-doll-tail {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(40%, -85%);
  width: 48px;
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(173, 206, 253, 0.5));
}

/* CSS 粒子散波发射器 */
.particle-emitter {
  position: absolute;
  right: 0;
  top: 80%;
}

.particle-emitter span {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 4px;
  height: 4px;
  background: rgb(var(--c-pink));
  border-radius: 50%;
  box-shadow: 0 0 10px rgb(var(--c-pink));
  opacity: 0;
}

.p-1 { animation: scatter 1.0s infinite ease-out; animation-delay: 0s; }
.p-2 { animation: scatter 1.2s infinite ease-out; animation-delay: 0.15s; }
.p-3 { animation: scatter 1.5s infinite ease-out; animation-delay: 0.3s; }
.p-4 { animation: scatter 1.1s infinite ease-out; animation-delay: 0.45s; }
.p-5 { animation: scatter 1.4s infinite ease-out; animation-delay: 0.6s; }
.p-6 { animation: scatter 1.6s infinite ease-out; animation-delay: 0.75s; }
.p-7 { animation: scatter 1.3s infinite ease-out; animation-delay: 0.9s; }
.p-8 { animation: scatter 1.7s infinite ease-out; animation-delay: 1.05s; }

@keyframes scatter {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-20px - 30px * var(--rand, 1)), calc(-30px - 20px * var(--rand, 1))) scale(0);
    opacity: 0;
  }
}
</style>
