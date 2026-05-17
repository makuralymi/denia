<template>
  <div class="archive-view">
    <!-- 右侧导航及返回顶部 -->
    <div class="side-nav" :class="{ 'collapsed': isNavCollapsed }">
      <button class="toggle-btn" @click="toggleNav" :title="isNavCollapsed ? '展开导航' : '收起导航'">
        {{ isNavCollapsed ? '◀' : '▶' }}
      </button>
      <div class="nav-content">
        <button class="nav-btn" @click="scrollTo('info')">基础信息</button>
        <button class="nav-btn" @click="scrollTo('gallery')">养成&展示</button>
        <button class="nav-btn" @click="scrollTo('skills')">技能说明</button>
        <button class="nav-btn" @click="scrollTo('showcase')">共鸣者展示</button>
        <button class="nav-btn" @click="scrollTo('meet')">认识达妮娅</button>
        <button class="nav-btn" @click="scrollTo('design')">角色设计</button>
        <button class="nav-btn" @click="scrollTo('hobby')">喜好</button>
        <button class="nav-btn" @click="scrollTo('action')">动作展示</button>
        <button class="nav-btn top-btn" @click="scrollTo('top')" title="返回顶部">▲</button>
      </div>
    </div>

    <!-- 顶部主图 Banner -->
    <div id="top" class="banner-section" :style="{ backgroundImage: `url(${currentBanner})` }">
      <!-- 三分之一中心位置的按钮组 -->
      <div class="banner-actions">
        <button class="banner-btn" @click="scrollTo('info')">档案公示</button>
        <button class="banner-btn" @click="scrollTo('showcase')">寰宇人类注释</button>
      </div>
    </div>

    <!-- 向下滚动后的主体信息集 -->
    <div class="content-section">
      <div id="info" class="role-card glass-panel">
        
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

      <!-- 详细档案补充，基于提供的HTML进行风格适配 -->
      <div class="archive-details glass-panel">
        <header class="article-header">
          <h1 class="article-title">档案公开 | 泡影视阈——达妮娅</h1>
          <div class="article-meta">
            <span>文章发布 2026-05-17 11:05</span>
            <span>档案来源：星炬学院</span>
          </div>
        </header>

        <div class="article-content">
          <div class="img-card">
            <img src="https://prod-alicdn-community.kurobbs.com/forum/bb13559d8be54557a8f330be4a0ca98320260516.jpeg?x-oss-process=image%2Fformat%2Cwebp" alt="达妮娅 KV">
          </div>
          
          <p class="data-loading"><strong>&gt;&gt;&gt;资料加载中&gt;&gt;&gt;</strong></p>
          <p>&nbsp;</p>
          <p class="highlight-text"><strong>✦达妮娅✦</strong></p>
          <p>星炬学院虚质科学部学生，终日懒散摸鱼打瞌睡。</p>
          <p>出席过绝大多数学生活动，常用“温柔”的笑容面对大家。</p>

          <!-- 角色动态及静态展示资料图 -->
          <div id="gallery" class="gallery-grid">
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/6bb82b01c1d442418e94e716a9f8c33120260516.jpeg?x-oss-process=image%2Fformat%2Cwebp" alt="立绘1"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/bea3555d7fa84af28488d13aea35b6ab20260516.jpeg?x-oss-process=image%2Fformat%2Cwebp" alt="立绘2"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/8ddc49908059438b8297ff0ca1f59a4c20260516.gif" alt="展示动画1"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/e783975dcf854c69b38c7164b8a0f73320260516.gif" alt="展示动画2"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/e68433de89a540188c2eb878588d749f20260516.gif" alt="展示动画3"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/094945940ff847dabbaa414b9dabfadd20260516.gif" alt="展示动画4"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/c241f415d969449685ef1a4288d7f6dd20260516.gif" alt="展示动画5"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/ffb1d57625e84c97898d1173e85409fb20260516.gif" alt="展示动画6"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/7fc69fcf556b42968ba30bd39c42a4ef20260516.gif" alt="展示动画7"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/632c91a488b6495886658687c5bb396020260516.gif" alt="展示动画8"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/cd61bb1bc41d49bfa4da39719a6f118620260516.gif" alt="展示动画9"></div>
            <div class="img-card"><img src="https://prod-alicdn-community.kurobbs.com/forum/6df058366f824b13974dd394ea34992620260516.gif" alt="展示动画10"></div>
          </div>
          <div id="skills" class="img-card full-width">
            <img src="https://prod-alicdn-community.kurobbs.com/forum/622ab41e72624482a8c7462216e3082f20260516.jpeg?x-oss-process=image%2Fformat%2Cwebp" alt="长图展示">
          </div>
        </div>

        <footer class="article-footer">
          <span>访问权限：已授权</span>
          <button class="action-btn hover-glow" @click="scrollTo('top')">返回顶部</button>
        </footer>
      </div>

      <!-- 寰宇人类注疏展示 -->
      <div id="showcase" class="archive-details glass-panel">
        <header class="article-header">
          <h1 class="article-title">《寰宇人类注疏：群星交错》共鸣者展示 | 达妮娅</h1>
          <div class="article-meta">
            <span>文章发布 2026-05-17 12:00</span>
            <span>星炬学院</span>
          </div>
        </header>

        <div class="article-content">
          <div class="img-card full-width">
            <img src="https://prod-alicdn-community.kurobbs.com/forum/42f4cd1f35ae43269c72cfe6f507813620260515.jpeg?x-oss-process=image%2Fformat%2Cwebp" alt="Cover">
          </div>
          
          <p class="highlight-text" style="font-size: 1.2rem; text-align: center;">见到我很意外吗？哈哈，别紧张嘛，我说过我们会再见面的。</p>
          <p class="lore-desc" style="text-align: center;">*动图画质有压缩，请以游戏内实际效果为准。</p>

          <div class="single-column-gallery">
            <div id="meet" class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/2a10757804814ba983cd843526865c4820260515.jpeg?x-oss-process=image%2Fformat%2Cwebp" loading="lazy"></div>
            <div id="design" class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/ac23c0816aa34aaa9b97f3879a5e155920260515.jpeg?x-oss-process=image%2Fformat%2Cwebp" loading="lazy"></div>
            <div id="hobby" class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/f94e1a34374e46e8b712f2686671c45920260515.jpeg?x-oss-process=image%2Fformat%2Cwebp" loading="lazy"></div>
            <div id="action" class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/aa431142a25f47de986e7e4fb8eaf5c720260515.gif" loading="lazy"></div>
            <div class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/88b1a438d4ff47fbad55e776b3162fe820260516.gif" loading="lazy"></div>
            <div class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/83338415971b4514b6c7cb2f5570520020260515.gif" loading="lazy"></div>
            <div class="img-card full-width"><img src="https://prod-alicdn-community.kurobbs.com/forum/24d8ebd5f9684aa881f6b32e22f7d1bb20260515.jpeg?x-oss-process=image%2Fformat%2Cwebp" loading="lazy"></div>
          </div>
        </div>

        <footer class="article-footer">
          <span>---</span>
          <button class="action-btn hover-glow" @click="scrollTo('top')">返回顶部</button>
        </footer>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentBanner = ref('/image/archive.jpeg')
const isNavCollapsed = ref(false)

onMounted(() => {
  const images = ['/image/archive.jpeg', '/image/archive1.jpeg']
  currentBanner.value = images[Math.floor(Math.random() * images.length)]
})

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}
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
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center 20%; /* 根据图片主体位置可以微调 */
  background-attachment: fixed; /* 实现基础滚动视差 (Parallax) */
  box-shadow: inset 0 -150px 100px -50px rgba(10, 5, 10, 0.9); /* 底部平滑渐暗过渡到下文 */
  transition: background-image 0.5s ease-in-out;
}

/* Banner 内的动作按钮 */
.banner-actions {
  position: absolute;
  top: 66.6%; /* 三分之一中心位置 (距顶部2/3处) */
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
  z-index: 10;
}

.banner-btn {
  background: rgba(20, 10, 20, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--c-pink), 0.5);
  color: #fff;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.15rem;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(228, 144, 179, 0.4), inset 0 0 10px rgba(var(--c-pink), 0.2);
  transition: all 0.3s ease;
}

.banner-btn:hover {
  background: rgba(var(--c-pink), 0.3);
  border-color: rgba(var(--c-pink), 0.8);
  box-shadow: 0 5px 25px rgba(var(--c-pink), 0.6), inset 0 0 15px rgba(var(--c-pink), 0.4);
  transform: translateY(-3px);
}

/* 主要内容区域 */
.content-section {
  position: relative;
  width: 100vw;
  min-height: 100vh; /* 保证高度足以撑起排版 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 6rem 2rem;
  background: linear-gradient(180deg, rgba(10, 5, 10, 0.9) 0%, rgba(var(--c-purple), 0.4) 100%);
}

/* 玻璃态角色卡片 */
.role-card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  max-width: 1400px;
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

/* --- 新增档案详情样式 --- */
.archive-details {
  width: 100%;
  max-width: 1200px;
  border-radius: 16px;
  background: rgba(20, 10, 20, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(var(--c-pink), 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 3rem 4vw;
  color: rgba(255, 255, 255, 0.9);
}

.article-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(var(--c-pink), 0.3);
  padding-bottom: 1.5rem;
  text-align: center;
}

.article-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #fff;
  text-shadow: 0 0 15px rgba(var(--c-pink), 0.6);
  letter-spacing: 0.1rem;
}

.article-meta {
  font-size: 0.9rem;
  color: rgb(var(--c-light-blue));
  display: flex;
  justify-content: center;
  gap: 2rem;
  opacity: 0.8;
}

.article-content {
  font-size: 1.05rem;
  line-height: 1.8;
  letter-spacing: 0.05rem;
}

.article-content p {
  margin: 1.5rem 0;
  text-align: center;
}

.data-loading {
  text-align: center;
  color: rgb(var(--c-pink));
  font-size: 1.2rem;
  letter-spacing: 0.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; text-shadow: 0 0 10px rgba(var(--c-pink), 0.8); }
  100% { opacity: 0.5; }
}

.highlight-text {
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--c-pink), 0.8);
}

.img-card {
  margin: 2rem auto;
  text-align: center;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(var(--c-pink), 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.img-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(var(--c-pink), 0.2);
  border-color: rgba(var(--c-pink), 0.5);
}

.img-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.gallery-grid .img-card {
  margin: 0;
}

.single-column-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 3rem 0;
}

.single-column-gallery .img-card {
  margin: 0;
  width: 100%;
}

.full-width {
  max-width: 100%;
}

.article-footer {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  border-top: 1px solid rgba(var(--c-pink), 0.3);
  padding-top: 1.5rem;
}

.action-btn {
  background: rgba(var(--c-deep-blue), 0.3);
  border: 1px solid rgba(var(--c-light-blue), 0.4);
  color: rgb(var(--c-light-blue));
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-btn.hover-glow:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.4);
}

/* --- 右侧导航样式 --- */
.side-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: flex-start;
  z-index: 100;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-nav.collapsed {
  transform: translate(calc(100% + 20px), -50%);
}

.toggle-btn {
  background: transparent;
  border: none;
  color: rgba(var(--c-pink), 0.8);
  padding: 15px 5px;
  cursor: pointer;
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: transparent;
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--c-pink), 0.8);
  transform: translateY(-50%) scale(1.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

/* 隐藏滚动条 */
.nav-content::-webkit-scrollbar {
  display: none;
}

/* 防止页面缩放时按钮变小或排版错乱 */
.nav-btn {
  flex-shrink: 0;
  background: rgba(20, 10, 20, 0.7);
  border: 1px solid rgba(var(--c-pink), 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px; /* 使用px代替rem避免严重缩放问题 */
  writing-mode: vertical-lr;
  text-align: center;
  min-height: 60px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.5);
  transform: translateX(-5px); /* 悬浮时微微左移 */
}

.top-btn {
  writing-mode: horizontal-tb;
  height: auto;
  min-height: auto;
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  letter-spacing: 0;
}
</style>
