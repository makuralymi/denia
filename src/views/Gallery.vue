<template>
  <div
    class="gallery-view"
    ref="scrollContainer"
  >
    <div class="gallery-scroll-inner">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="skeleton-grid">
          <div
            v-for="n in 8"
            :key="n"
            class="skeleton-card"
            :style="{ height: `${100 + (n % 4) * 60}px` }"
          />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="glass-panel error-panel">
          <p class="error-icon">!</p>
          <p class="error-msg">{{ error }}</p>
          <button class="retry-btn" @click="fetchImages">重试</button>
        </div>
      </div>

      <!-- Masonry Gallery -->
      <div v-else class="gallery-grid">
        <div
          v-for="(img, idx) in images"
          :key="idx"
          :ref="(el) => setItemRef(el as Element, idx)"
          :data-index="idx"
          class="gallery-item"
          @click="openLightbox(idx)"
        >
          <!-- Picture Frame -->
          <div class="picture-frame">
            <!-- Placeholder -->
            <div
              v-if="!img.loaded"
              class="img-placeholder"
              :style="{ aspectRatio: String(img.aspectRatio) }"
            >
              <div class="shimmer"></div>
            </div>
            <!-- Actual Image -->
            <img
              v-show="img.shouldLoad"
              :src="img.url"
              :alt="img.name"
              class="gallery-img"
              :class="{ 'img-ready': img.loaded }"
              @load="onImgLoaded(idx)"
              @error="onImgError(idx)"
            />
          </div>
          <div v-if="img.loaded" class="item-hover">
            <span class="item-res">{{ img.resolution }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <transition name="lb-fade">
        <div
          v-if="lightboxIndex !== null"
          class="lightbox-overlay"
          @click="closeLightbox"
          @keydown="handleKeydown"
          @wheel.prevent="onLbWheel"
          tabindex="0"
          ref="lightboxRef"
        >
          <button class="lb-btn lb-close" @click="closeLightbox">✕</button>
          <button class="lb-btn lb-prev" @click.stop="prevImage">◀</button>
          <div
            class="lb-image-wrap"
            @click.stop
            @mousedown.prevent="onLbMouseDown"
            @mousemove="onLbMouseMove"
            @mouseup="onLbMouseUp"
            @mouseleave="onLbMouseUp"
          >
            <img
              :src="currentImage?.url"
              :alt="currentImage?.name"
              :style="lbImgStyle"
            />
          </div>
          <button class="lb-btn lb-next" @click.stop="nextImage">▶</button>
          <div class="lb-info">
            <span class="lb-name">{{ currentImage?.name }}</span>
            <span class="lb-res">{{ currentImage?.resolution }}</span>
            <span class="lb-counter">{{ lightboxIndex + 1 }} / {{ images.length }}</span>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

interface GalleryImage {
  name: string
  resolution: string
  url: string
  aspectRatio: number
  shouldLoad: boolean
  loaded: boolean
}

const images = ref<GalleryImage[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const lightboxIndex = ref<number | null>(null)
const lightboxRef = ref<HTMLElement | null>(null)
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let panStartX = 0
let panStartY = 0

const lbImgStyle = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
  cursor: zoom.value > 1 ? (isDragging.value ? 'grabbing' : 'grab') : 'default',
  transition: isDragging.value ? 'none' : 'transform 0.15s ease-out'
}))
const scrollContainer = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const currentImage = computed(() => {
  if (lightboxIndex.value === null) return null
  return images.value[lightboxIndex.value] ?? null
})

function parseAspectRatio(resolution: string): number {
  const [w, h] = resolution.split('x').map(Number)
  return w && h ? w / h : 1
}

async function fetchImages() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/gallery')
    if (!res.ok) throw new Error(`HTTP ${res.status}: 无法加载图片列表`)
    const data = await res.json()
    images.value = data.map((item: { name: string; resolution: string }) => ({
      name: item.name,
      resolution: item.resolution,
      url: `https://r2-jk.makuraly.xyz/denia/${encodeURIComponent(item.name)}`,
      aspectRatio: parseAspectRatio(item.resolution),
      shouldLoad: false,
      loaded: false
    }))
    await nextTick()
    setupObserver()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误'
    error.value = `加载图集失败 — ${msg}`
  } finally {
    loading.value = false
  }
}

// ── Intersection Observer for lazy loading ──

function setupObserver() {
  if (!scrollContainer.value) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.index)
          if (!isNaN(idx) && images.value[idx] && !images.value[idx].shouldLoad) {
            images.value[idx].shouldLoad = true
          }
          observer?.unobserve(entry.target)
        }
      })
    },
    {
      root: scrollContainer.value,
      rootMargin: '400px 0px'
    }
  )

  // Observe all existing items
  const items = scrollContainer.value.querySelectorAll('.gallery-item')
  items.forEach((el) => observer?.observe(el))
}

function setItemRef(el: Element | null, _idx: number) {
  if (el && observer) {
    observer.observe(el)
  }
}

function onImgLoaded(idx: number) {
  images.value[idx].loaded = true
}

function onImgError(idx: number) {
  images.value[idx] = {
    ...images.value[idx],
    url: ''
  }
}

onUnmounted(() => {
  observer?.disconnect()
})

// ── Lightbox ──

function openLightbox(idx: number) {
  lightboxIndex.value = idx
  nextTick(() => lightboxRef.value?.focus())
}

function closeLightbox() {
  lightboxIndex.value = null
}

function prevImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value =
    lightboxIndex.value === 0 ? images.value.length - 1 : lightboxIndex.value - 1
}

function nextImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value =
    lightboxIndex.value === images.value.length - 1 ? 0 : lightboxIndex.value + 1
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

function onLbWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? 0.92 : 1.08
  zoom.value = Math.max(0.4, Math.min(6, zoom.value * delta))
  clampPan()
}

function onLbMouseDown(e: MouseEvent) {
  if (zoom.value <= 1) return
  isDragging.value = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  panStartX = panX.value
  panStartY = panY.value
}

function onLbMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  panX.value = panStartX + (e.clientX - dragStartX)
  panY.value = panStartY + (e.clientY - dragStartY)
}

function onLbMouseUp() {
  if (!isDragging.value) return
  isDragging.value = false
  clampPan()
}

function clampPan() {
  if (zoom.value <= 1) {
    panX.value = 0
    panY.value = 0
    return
  }
  const el = document.querySelector('.lb-image-wrap') as HTMLElement | null
  if (!el) return
  const maxX = (zoom.value - 1) * el.clientWidth * 0.5
  const maxY = (zoom.value - 1) * el.clientHeight * 0.5
  panX.value = Math.max(-maxX, Math.min(maxX, panX.value))
  panY.value = Math.max(-maxY, Math.min(maxY, panY.value))
}

watch(lightboxIndex, (val) => {
  document.body.style.overflow = val !== null ? 'hidden' : ''
  if (val !== null) {
    zoom.value = 1
    panX.value = 0
    panY.value = 0
  }
})

fetchImages()
</script>

<style scoped>
.gallery-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  pointer-events: auto;
}

.gallery-view::-webkit-scrollbar {
  width: 4px;
}
.gallery-view::-webkit-scrollbar-track {
  background: transparent;
}
.gallery-view::-webkit-scrollbar-thumb {
  background: rgba(var(--c-pink), 0.25);
  border-radius: 2px;
}

.gallery-scroll-inner {
  padding: 20px 24px 40px;
}

/* ── Loading skeletons ── */
.loading-state {
  width: 100%;
}
.skeleton-grid {
  columns: 4;
  column-gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}
.skeleton-card {
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 6px;
  background: rgba(var(--c-pink), 0.06);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/* ── Error ── */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.error-panel {
  text-align: center;
  padding: 48px 64px;
}
.error-icon {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--c-pink));
  margin: 0 0 12px;
}
.error-msg {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 24px;
  letter-spacing: 0.05rem;
}
.retry-btn {
  background: transparent;
  color: rgb(var(--c-pink));
  border: 1px solid rgba(var(--c-pink), 0.4);
  padding: 8px 28px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  letter-spacing: 0.1rem;
  transition: all 0.3s ease;
}
.retry-btn:hover {
  background: rgba(var(--c-pink), 0.12);
  box-shadow: 0 0 12px rgba(var(--c-pink), 0.3);
}

/* ── Gallery Grid ── */
.gallery-grid {
  columns: 5;
  column-gap: 16px;
  max-width: 1600px;
  margin: 0 auto;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gallery-item:hover {
  transform: translateY(-2px) scale(1.015);
}

/* ── Picture Frame ── */
.picture-frame {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(var(--c-pink), 0.03);
  box-shadow:
    0 0 0 1px rgba(var(--c-pink), 0.22),
    0 0 0 5px rgba(18, 12, 16, 0.5),
    0 0 0 6px rgba(var(--c-pink), 0.12),
    0 8px 32px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.4s ease;
}

.gallery-item:hover .picture-frame {
  box-shadow:
    0 0 0 1px rgba(var(--c-pink), 0.5),
    0 0 0 5px rgba(18, 12, 16, 0.5),
    0 0 0 6px rgba(var(--c-pink), 0.3),
    0 12px 44px rgba(var(--c-pink), 0.35);
}

/* ── Placeholder ── */
.img-placeholder {
  position: relative;
  width: 100%;
  background: rgba(var(--c-pink), 0.05);
  overflow: hidden;
}

.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--c-pink), 0.06) 50%,
    transparent 100%
  );
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ── Image ── */
.gallery-img {
  width: 100%;
  display: block;
  opacity: 0;
  transition: opacity 0.5s ease, filter 0.4s ease;
}

.gallery-img.img-ready {
  opacity: 0.88;
}

.gallery-item:hover .gallery-img.img-ready {
  opacity: 1;
  filter: brightness(1.04);
}

/* ── Hover info ── */
.item-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 12px 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.gallery-item:hover .item-hover {
  opacity: 1;
}

.item-res {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  letter-spacing: 0.06rem;
}

/* ── Lightbox ── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(5, 5, 18, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.3s ease;
}
.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

.lb-btn {
  position: absolute;
  z-index: 10;
  background: rgba(var(--c-pink), 0.08);
  border: 1px solid rgba(var(--c-pink), 0.18);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.lb-btn:hover {
  background: rgba(var(--c-pink), 0.18);
  color: #fff;
  box-shadow: 0 0 20px rgba(var(--c-pink), 0.3);
}

.lb-close {
  top: 24px;
  right: 24px;
}

.lb-prev {
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.lb-next {
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.lb-image-wrap {
  max-width: 85vw;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.lb-image-wrap img {
  max-width: 85vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(var(--c-pink), 0.18), 0 4px 60px rgba(0, 0, 0, 0.5);
  transition: transform 0.15s ease-out;
  cursor: zoom-in;
}

.lb-info {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 24px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  letter-spacing: 0.06rem;
  background: rgba(255, 255, 255, 0.048);
  padding: 8px 20px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.lb-name {
  color: rgba(255, 255, 255, 0.85);
}

.lb-res {
  color: rgba(var(--c-pink), 0.6);
}

.lb-counter {
  color: rgba(255, 255, 255, 0.35);
}

/* ── Responsive ── */
@media screen and (max-width: 1400px) {
  .gallery-grid { columns: 4; }
  .skeleton-grid { columns: 4; }
}

@media screen and (max-width: 1000px) {
  .gallery-grid { columns: 3; }
  .skeleton-grid { columns: 3; }
}

@media screen and (max-width: 680px) {
  .gallery-grid { columns: 2; }
  .skeleton-grid { columns: 2; }
  .gallery-scroll-inner {
    padding: 12px 12px 24px;
  }
  .lb-btn {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }
  .lb-prev { left: 8px; }
  .lb-next { right: 8px; }
  .lb-close { top: 12px; right: 12px; }
  .lb-info {
    gap: 12px;
    font-size: 0.7rem;
    padding: 6px 14px;
  }
}

@media screen and (max-width: 420px) {
  .gallery-grid { columns: 1; }
  .skeleton-grid { columns: 1; }
}
</style>
