<template>
  <div class="home-container">
    <h1 class="title">DENIA</h1>
    <p class="subtitle">System Initialization Complete</p>
    
    <div class="nav-links">
      <router-link to="/gallery" class="nav-btn">ENTER GALLERY</router-link>
      <router-link to="/lore" class="nav-btn">READ LORE</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页面板逻辑
</script>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffb6c1; /* 粉色系文字配合底色 */
  text-align: center;
  pointer-events: none; /* 让大部分区域不阻挡背景交互 */
}

.title {
  font-size: 6rem;
  letter-spacing: 0.5rem;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 182, 193, 0.4);
}

.subtitle {
  font-size: 1.2rem;
  letter-spacing: 0.2rem;
  opacity: 0.8;
  margin-top: 1rem;
}

.nav-links {
  margin-top: 4rem;
  display: flex;
  gap: 2rem;
  pointer-events: auto; /* 恢复按钮交互 */
}

.nav-btn {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  padding: 0.8rem 2rem;
  border: 1px solid rgba(255, 182, 193, 0.3);
  background: rgba(255, 182, 193, 0.05);
  backdrop-filter: blur(4px);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-btn:hover {
  background: rgba(255, 182, 193, 0.2);
  border-color: rgba(255, 182, 193, 0.8);
  box-shadow: 0 0 15px rgba(255, 182, 193, 0.3);
  transform: scale(1.05);
}
</style>
