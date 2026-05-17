<template>
  <div class="welcome-container">
    <!-- 玻璃态拟物卡片结构 (Glassmorphism) -->
    <div class="glass-panel">
      <h1 class="title">DENIA</h1>
      <div class="divider">⚠️正在制作娅娅对话语音AI,敬请期待！</div>
      <p class="subtitle">System Initialization Complete</p>
      
      <div class="nav-links">
        <router-link to="/home" class="nav-btn">ENTER SYSTEM<br>进入站点</router-link>
        <a href="https://ams.makuraly.xyz" target="_blank" class="nav-btn ext-btn">前往飞行雪绒<br>Fleet Snowfluff</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 欢迎页面逻辑
</script>

<style scoped>
.welcome-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  pointer-events: none; /* 让大部分区域不阻挡背景交互 */
}

/* 现代玻璃态面板 */
.glass-panel {
  pointer-events: auto; /* 面板区域拦截交互 */
  padding: clamp(2rem, 5vw, 4rem) clamp(2rem, 8vw, 6rem);
  width: 90%;
  max-width: 800px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05); /* 半透明白底 */
  backdrop-filter: blur(16px); /* 强毛玻璃效果 */
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15); /* 高光边缘 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.glass-panel:hover {
  transform: translateY(-5px); /* 悬浮时的微动 */
}

.title {
  font-size: 5rem;
  letter-spacing: 0.8rem;
  margin: 0;
  font-weight: 300;
  text-shadow: 0 0 20px rgba(var(--c-pink), 0.7), 0 0 40px rgba(var(--c-deep-blue), 0.4);
}

.divider {
  width: 100%;
  height: 1px;
  font-size: 25px;
  color: rgba(255, 239, 239, 0.747);
  margin: 1.5rem auto;
  background: linear-gradient(90deg, transparent, rgba(var(--c-light-blue), 0.8), transparent);
}

.subtitle {
  font-size: 1rem;
  letter-spacing: 0.3rem;
  opacity: 0.8;
  margin-top: 1rem;
  font-weight: 300;
  text-transform: uppercase;
  color: rgb(var(--c-pink));
}

.nav-links {
  margin-top: 3.5rem;
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.nav-btn {
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.15rem;
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  border: 1px solid rgba(var(--c-pink), 0.5);
  background: rgba(var(--c-purple), 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-btn:hover {
  background: rgba(var(--c-deep-blue), 0.4);
  border-color: rgb(var(--c-light-blue));
  box-shadow: 0 0 20px rgba(var(--c-light-blue), 0.5);
  transform: scale(1.05);
}
</style>
