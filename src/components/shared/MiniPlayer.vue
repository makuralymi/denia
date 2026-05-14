<template>
  <div class="mini-player-wrapper">
    <!-- 玻璃态控制面板 -->
    <div class="player-panel">
      <!-- 播放/暂停及上一首/下一首控制区 -->
      <div class="controls-area">
        <button class="control-btn" @click="prevSong" title="上一首">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <div 
          class="record-disk" 
          :class="{ 'is-playing': isPlaying }"
          @click="togglePlay"
        >
          <div class="record-center"></div>
        </div>
        <button class="control-btn" @click="nextSong" title="下一首">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
        <button class="control-btn" @click="togglePlaylist" title="播放列表" :class="{ 'active': showPlaylist }">
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
      <div v-show="showPlaylist" class="playlist-panel">
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
        <div class="progress-fill" :style="{ width: progressPercent + '%' }">
          <!-- 进度条端点发光核心 -->
          <div class="progress-glow-head"></div>
          <!-- 随点粒子飘散 -->
          <div v-if="isPlaying" class="particle-emitter">
            <span class="p-1"></span>
            <span class="p-2"></span>
            <span class="p-3"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

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
  // 预留位置，后续添加音频直接写在这里：
  // { name: 'SECOND ROUND', url: '/audio/audio1.mp3' },
  // { name: 'MAIN MENU', url: '/audio/audio2.mp3' }
]);
const currentSongIndex = ref(0);
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

const loadPlaylist = () => {
  if (playlist.value.length > 0) {
    audio.src = playlist.value[0].url;
  }
};

const playSong = (index: number) => {
  currentSongIndex.value = index;
  audio.src = playlist.value[index].url;
  audio.play();
  isPlaying.value = true;
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
  // 必须在用户发生交互后（如点击播放）进行实例化
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512; // 更细腻的频段
  
  // Connect Source -> Analyser -> Destination
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

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 根据屏幕宽度自适应调整间隔与单个波的宽度
  // 为了美观，我们不要画全部频谱(高频很多都是空的)，取一半即可
  const renderLength = Math.floor(dataArray.length * 0.75); 
  const gap = 2; // 条与条之间的固定间隙
  // 每个音柱的宽度自适应 = (总宽度 - 间隙总宽度) / 音柱数量
  const barWidth = Math.max(1, (width - gap * renderLength) / renderLength); 

  let x = 0;
  for (let i = 0; i < renderLength; i++) {
    // 限制高度比例映射
    const barHeight = (dataArray[i] / 255) * height;

    // 采用与主题匹配的从底到上的半透明粉紫渐变色条
    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
    gradient.addColorStop(0, 'rgba(250, 191, 253, 0.8)'); // pink
    gradient.addColorStop(1, 'rgba(173, 206, 253, 0.4)'); // light blue
    
    ctx.fillStyle = gradient;
    
    // Y轴采用高度差，因为 Canvas 的 0,0 在左上角，要从底部伸出
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);

    x += barWidth + gap;
  }
};

const handleResize = () => {
  if (visualizerCanvas.value) {
    visualizerCanvas.value.width = window.innerWidth;
    visualizerCanvas.value.height = 80; // 波谱最大高度
  }
};

// 绑定原生音频事件
onMounted(() => {
  loadPlaylist();
  
  // 初始化画布尺寸
  handleResize();
  window.addEventListener('resize', handleResize);

  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime;
  });
  
  audio.addEventListener('durationchange', () => {
    duration.value = audio.duration;
  });
  
  audio.addEventListener('ended', () => {
    nextSong();
  });
  
  audio.addEventListener('play', () => {
    isPlaying.value = true;
    if (!audioContext) {
      initAudioPath();
    }
    drawVisualizer(); // 开始绘制波谱
  });

  audio.addEventListener('pause', () => {
    isPlaying.value = false;
    cancelAnimationFrame(animationFrameId); // 停止绘制
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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
  pointer-events: none; /* 让顶层 wrapper 透传 */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2rem; /* 距离底部进度条的高度 */
}

/* 玻璃态面板 */
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
  transition: transform 0.3s ease;
}

.player-panel:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--c-pink), 0.4);
}

/* 控制按钮组 */
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
  bottom: calc(100% + 15px); /* 在控制面板上方 */
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

/* 轨道隐藏至仅可被鼠标划过触发，增加呼吸感 */
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

/* 填充条 */
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(var(--c-purple), 0.8), rgb(var(--c-pink)));
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.6);
  position: relative;
  transition: width 0.1s linear;
}

/* 端点发光头 */
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

/* CSS 粒子散波发射器 */
.particle-emitter {
  position: absolute;
  right: 0;
  top: 50%;
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

.p-1 { animation: scatter 1.2s infinite ease-out; animation-delay: 0s; }
.p-2 { animation: scatter 1.5s infinite ease-out; animation-delay: 0.4s; }
.p-3 { animation: scatter 1.8s infinite ease-out; animation-delay: 0.8s; }

@keyframes scatter {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-30px, -40px) scale(0);
    opacity: 0;
  }
}
</style>
