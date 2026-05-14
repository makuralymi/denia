<template>
  <div class="lore-container">
    <h2 class="title">LORE</h2>
    <router-link to="/" class="back-btn">RETURN</router-link>
  </div>
</template>

<style scoped>
.lore-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffb6c1;
  pointer-events: none;
}
.title {
  font-size: 4rem;
  letter-spacing: 0.5rem;
}
.back-btn {
  margin-top: 2rem;
  color: #fff;
  text-decoration: none;
  border: 1px solid rgba(255, 182, 193, 0.3);
  padding: 0.8rem 2rem;
  pointer-events: auto;
  transition: all 0.3s ease;
}
.back-btn:hover {
  background: rgba(255, 182, 193, 0.2);
}
</style>
