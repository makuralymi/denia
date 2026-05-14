<template>
  <div class="app-container">
    <!-- 最底层的 WebGL 动态背景 -->
    <div class="canvas-wrapper">
      <canvas ref="canvasRef" class="webgl-canvas"></canvas>
    </div>

    <!-- 前端透明 UI 悬浮层 -->
    <main class="ui-layer">
      <!-- 页面进入/退出的过渡动画 (强化游戏感交互) -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from './composables/useCanvas';

// 唤醒并挂载我们的 WebGL 引擎
const { canvasRef } = useCanvas();
</script>

<style>
/* 全局色彩定义 */
:root {
  --c-pink: 250, 191, 253;
  --c-purple: 49, 27, 126;
  --c-light-blue: 173, 206, 253;
  --c-deep-blue: 41, 84, 227;
}

/* 
  全局基础样式可以移到 assets 里的 css 中，
  这里为了明确层级结构，定义核心的容器样式。
*/
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #000; /* 兜底底色 */
  overflow: hidden; /* 必须无轨(Trackless)，禁止全局原生滚动 */
  font-family: sans-serif; /* 之后可以换成游戏的专属字体 */
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  /* 注入主图，铺满全屏 */
  background-image: url('/image/denia.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 核心：深度层级 - 底层 */
.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 铺在最底层 */
}

.webgl-canvas {
  width: 100%;
  height: 100%;
  display: block; /* 消除 canvas 默认 inline 带来的下边缘留白 */
}

/* 核心：深度层级 - UI 悬浮层 */
.ui-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* 悬浮于 Canvas 之上 */
  pointer-events: none; /* 让事件默认穿透，UI 组件内按需开启 pointer-events: auto */
  overflow-y: auto; /* UI 层自身允许滚动 (如果需要的话) */
}

.ui-layer > * {
  /* 恢复子级 UI 的交互响应 */
  pointer-events: auto; 
}

/* 交互反馈：路由切换时的游戏感过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
