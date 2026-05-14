<template>
  <div class="archive-view">
    <!-- 顶部主图 Banner -->
    <div class="banner-section">
      <!-- 这里预留了滚动视差设计的余地 -->
    </div>

    <!-- 向下滚动后的主体信息集 -->
    <div class="content-section">
      <div class="role-card glass-panel">
        
        <!-- 左侧角色大图 -->
        <div class="role-visual">
          <img 
            class="figure" 
            src="https://prod-alicdn-community.kurobbs.com/forum/4377406adbfd4f13ada59f6328d3de4820260401.png?x-oss-process=image/format,webp" 
            alt="Denia Figure"
          />
        </div>

        <!-- 右侧档案信息 -->
        <div class="role-profile">
          <!-- 头部简介 -->
          <div class="main-info">
            <img 
              class="attr-icon" 
              src="https://prod-alicdn-community.kurobbs.com/forum/a8a304ec837d4c22bc13cc7aa3c7f72420260401.png" 
              alt="热熔"
            />
            <div class="name-block">
              <h2 class="name">达妮娅</h2>
              <div class="name-en">DENIA</div>
            </div>
          </div>
          
          <div class="divider"></div>

          <!-- 背景设定述 -->
          <div class="lore-block">
            <h3 class="lore-title">共鸣能力：泡影视阈</h3>
            <p class="lore-desc">
              星炬学院虚质科学部学生达妮娅，总对大家展露出“温柔”的微笑，偶尔也会说上几句俏皮话。<br/>
              她经常懒懒地打盹，静静地观察与自己一起生活的人们，那些热闹真切的笑容让她感到温暖安心。
            </p>
          </div>

          <!-- 游戏化 Tag -->
          <div class="tags-block">
            <span class="tag">性别：女</span>
            <span class="tag">武器：音感仪</span>
            <span class="tag">属性：热熔</span>
          </div>

          <!-- span -->
          <div class="span">
            <p class="lore-desc">
              “不要看，不要听，然后忘掉吧……有些事情，还是不知道比较幸福。”——达妮娅
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* 允许容器垂直滚动 */
.archive-view {
  width: 100vw;
  height: 100vh;
  overflow-y: overlay;
  overflow-x: hidden;
  pointer-events: auto; /* 允许页面级别滚动与交互 */
  scroll-behavior: smooth;
}

/* 隐藏滚动条增强沉浸感 */
.archive-view::-webkit-scrollbar {
  width: 6px;
}
.archive-view::-webkit-scrollbar-thumb {
  background: rgba(var(--c-pink), 0.3);
  border-radius: 10px;
}

/* 顶部全屏主图 */
.banner-section {
  width: 100vw;
  height: 100vh;
  background-image: url('/image/archive.jpeg');
  background-size: cover;
  background-position: center 20%; /* 根据图片主体位置可以微调 */
  background-attachment: fixed; /* 实现基础滚动视差 (Parallax) */
  box-shadow: inset 0 -150px 100px -50px rgba(10, 5, 10, 0.9); /* 底部平滑渐暗过渡到下文 */
}

/* 主要内容区域 */
.content-section {
  position: relative;
  width: 100vw;
  min-height: 100vh; /* 保证高度足以撑起排版 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6rem 2rem;
  background: linear-gradient(180deg, rgba(10, 5, 10, 0.9) 0%, rgba(var(--c-purple), 0.4) 100%);
}

/* 玻璃态角色卡片 */
.role-card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  max-width: 1200px;
  border-radius: 16px;
  background: rgba(20, 10, 20, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(var(--c-pink), 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

/* 左侧立绘 */
.role-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: end;
  background: radial-gradient(circle at center, rgba(var(--c-deep-blue), 0.2) 0%, transparent 60%);
  position: relative;
}

.figure {
  height: 700px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(var(--c-pink), 0.15));
  mask-image: linear-gradient(to top, transparent 0%, black 15%);
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 15%);
}

/* 右侧档案信息 */
.role-profile {
  flex: 1;
  padding: 4rem 4vw; /* 响应式内边距 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.attr-icon {
  width: clamp(48px, 6vw, 72px); /* 响应式图标尺寸 */
  height: auto;
  filter: drop-shadow(0 0 10px rgba(var(--c-pink), 0.6));
}

.name-block {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: clamp(2rem, 4vw, 3.5rem); /* 响应式标题尺寸 */
  margin: 0;
  color: #fff;
  letter-spacing: 0.2rem;
  text-shadow: 0 0 15px rgba(var(--c-pink), 0.5);
  white-space: nowrap;
}

.name-en {
  font-size: clamp(0.9rem, 1.5vw, 1.2rem);
  color: rgb(var(--c-light-blue));
  letter-spacing: 0.4rem;
  margin-top: -5px;
}

.divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(var(--c-pink), 0.8), transparent);
  margin: 2rem 0;
}

.lore-title {
  color: rgb(var(--c-pink));
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  letter-spacing: 0.1rem;
  margin-bottom: 1rem;
}

.lore-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  line-height: 1.8;
  letter-spacing: 0.05rem;
  font-weight: 300;
}

.tags-block {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tag {
  background: rgba(var(--c-deep-blue), 0.3);
  border: 1px solid rgba(var(--c-light-blue), 0.4);
  color: rgb(var(--c-light-blue));
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  font-size: clamp(0.8rem, 1.2vw, 0.95rem);
  letter-spacing: 0.1rem;
  box-shadow: 0 0 10px rgba(var(--c-deep-blue), 0.2);
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
}

/* 额外的描述性文本 */
.span {
  margin-top: 2rem;
  font-size: clamp(0.9rem, 1.4vw, 1rem);
  color: rgb(255, 255, 255);
}

/* 响应式断点：针对平板和手机改变布局方向 */
@media screen and (max-width: 992px) {
  .content-section {
    padding: 6rem 1rem 2rem 1rem;
  }
  .role-card {
    flex-direction: column;
  }
  .figure {
    height: 450px;
  }
  .role-profile {
    padding: 2rem;
  }
  .tags-block {
    justify-content: center;
  }
  .main-info {
    justify-content: center;
  }
  .name-block {
    align-items: center;
  }
  .divider {
    background: linear-gradient(90deg, transparent, rgba(var(--c-pink), 0.8), transparent);
  }
  .lore-title, .lore-desc {
    text-align: center;
  }
}
</style>
