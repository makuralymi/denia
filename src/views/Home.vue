<template>
  <div class="home-layout">
    <!-- 顶部导航栏 -->
    <header class="top-nav glass-nav" :class="{ 'menu-open': isMobileMenuOpen }">
      <div class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span class="bar" :class="{ 'open': isMobileMenuOpen }"></span>
        <span class="bar" :class="{ 'open': isMobileMenuOpen }"></span>
        <span class="bar" :class="{ 'open': isMobileMenuOpen }"></span>
      </div>
      <div class="logo">DENIA</div>
      
      <nav class="nav-items" :class="{ 'is-open': isMobileMenuOpen }">
        <router-link to="/home" exact-active-class="active" class="nav-item" @click="isMobileMenuOpen = false">OVERVIEW</router-link>
        <router-link to="/home/archive" exact-active-class="active" class="nav-item" @click="isMobileMenuOpen = false">ARCHIVE</router-link>
        <router-link to="/home/wiki" exact-active-class="active" class="nav-item" @click="isMobileMenuOpen = false">WIKI</router-link>
        <router-link to="/home/gallery" exact-active-class="active" class="nav-item" @click="isMobileMenuOpen = false">GALLERY</router-link>
        <router-link to="/home/ai" exact-active-class="active" class="nav-item" @click="isMobileMenuOpen = false">AI</router-link>
        <router-link to="/home/games" exact-active-class="active" class="nav-item" @click="isMobileMenuOpen = false">GAMES</router-link>
      </nav>

      <div class="user-block">
        <a href="https://ams.makuraly.xyz" target="_blank" class="nav-item ext-link">前往飞行雪绒</a>
        <router-link to="/" class="exit-btn">EXIT SYSTEM</router-link>
      </div>
    </header>
    
    <!-- 留作后续功能的主区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 移动端折叠菜单状态
const isMobileMenuOpen = ref(false)
</script>

<style scoped>
.home-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* 让背景 Canvas 层能够响应空白处拖拽等事件 */
}

/* 顶部导航栏 - 固定在最上层 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box; /* 强力限制内边距溢出防出界 */
  pointer-events: auto; /* 恢复导航栏自带的鼠标交互 */
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  border-bottom: 1px solid rgba(var(--c-light-blue), 0.15);
  box-shadow: 0 4px 30px rgba(255, 255, 255, 0.202);
  z-index: 100; /* 确保导航栏一直在顶层 */
}

.glass-nav {
  background: rgba(0, 0, 0, 0.2); /* 给予微微的深色底增加毛玻璃折射质感 */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* 移动端菜单切换按钮 */
.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
  z-index: 101; /* 保证在菜单之上 */
}

.mobile-toggle .bar {
  width: 100%;
  height: 2px;
  background-color: rgb(var(--c-pink));
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(var(--c-pink), 0.5);
}

.mobile-toggle .bar.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.mobile-toggle .bar.open:nth-child(2) {
  opacity: 0;
}

.mobile-toggle .bar.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Logo 区 */
.logo {
  flex: 1; /* 均分剩余空间，协助中心对齐 */
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.3rem;
  color: rgb(var(--c-pink));
  text-shadow: 0 0 15px rgba(var(--c-pink), 0.6);
}

/* 导航项 */
.nav-items {
  flex: 2; /* 保证居中 */
  display: flex;
  justify-content: center;
  gap: 3vw;
}

/* 右侧退出块 */
.user-block {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 2rem; /* 增加退出的间距 */
  align-items: center;
}

.ext-link {
  color: rgb(var(--c-pink));
  text-decoration: none;
  font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  letter-spacing: 0.15rem;
  transition: all 0.3s ease;
  position: relative;
}

.ext-link:hover {
  text-shadow: 0 0 10px rgb(var(--c-pink));
}

.nav-item {
  color: rgba(var(--c-light-blue), 0.6);
  text-decoration: none;
  font-size: clamp(0.75rem, 1.5vw, 0.85rem); /* 响应式字体 */
  letter-spacing: 0.15rem;
  text-transform: uppercase;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 1px;
  background: rgb(var(--c-light-blue));
  transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 0 10px rgb(var(--c-light-blue));
}

.nav-item:hover, .nav-item.active {
  color: #ffdaed;
}

.nav-item:hover::after, .nav-item.active::after {
  width: 100%;
}

/* 右侧退出按钮 */
.exit-btn {
  color: rgba(var(--c-pink), 0.8);
  text-decoration: none;
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  letter-spacing: 0.1rem;
  border: 1px solid rgba(var(--c-pink), 0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.exit-btn:hover {
  background: rgba(var(--c-deep-blue), 0.3);
  color: #fff;
  border-color: rgb(var(--c-light-blue));
  box-shadow: 0 0 12px rgba(var(--c-light-blue), 0.4);
}

/* 移动端细化响应式适配 */
@media screen and (max-width: 768px) {
  .top-nav {
    padding: 0 1rem;
    height: 60px;
    justify-content: space-between;
    transition: all 0.3s ease;
  }
  .top-nav.menu-open {
    border-bottom-color: transparent;
    box-shadow: none;
  }
  .mobile-toggle {
    display: flex;
  }
  .logo {
    display: block; /* 恢复显示Logo */
    font-size: 1.2rem;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .nav-items {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100vw;
    height: auto;
    flex-direction: column;
    /* 同步顶栏毛玻璃结构 */
    background: rgba(0, 0, 0, 0.356);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(var(--c-light-blue), 0.15);
    box-shadow: 0 4px 30px rgba(255, 255, 255, 0.202);
    padding: 1rem 0;
    gap: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 99;
  }
  /* 移动端导航-打开 */
  .nav-items.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .nav-items .nav-item {
    padding: 1rem 2rem;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    font-size: 1rem;
  }
  /* 折叠菜单里不需要下划线动画 */
  .nav-items .nav-item::after {
    display: none;
  }
  .user-block {
    flex-shrink: 0;
  }
  .ext-link {
    display: none;
  }
  .exit-btn {
    padding: 0.35rem 0.6rem;
    font-size: 0.7rem;
    white-space: nowrap;
  }
}

/* 内容占位 */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-placeholder p {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 300;
  letter-spacing: 0.2rem;
  font-size: 1.2rem;
}
</style>
