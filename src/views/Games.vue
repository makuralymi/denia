<template>
  <div class="crt-tube">
    <div class="bg-grid"></div>
    <div class="bg-deco-shapes">
      <div class="bg-shape-1"></div>
      <div class="bg-shape-2"></div>
      <div class="bg-shape-3"></div>
    </div>
    <div class="glass-glare"></div>
    <div class="crt-overlay"></div>

    <div class="game-container">
      <!-- 左侧 HUD：POINTS + DIFFICULTY + 移动摇杆 -->
      <div class="hud-panel left-panel">
        <div class="info-box">
          <div class="hud-label">POINTS</div>
          <p class="number-text" id="score">000000</p>
        </div>
        <div class="info-box">
          <div class="hud-label">DIFFICULTY</div>
          <p class="number-text diff-text" id="difficulty">---</p>
        </div>
        <!-- 触屏：左右移动摇杆 -->
        <div v-if="gameState === 'playing' || gameState === 'paused'" class="touch-dpad">
          <button
            class="touch-key"
            @touchstart.prevent.stop="moveLeftTouch"
            @mousedown.prevent.stop="moveLeftTouch"
            @touchend.prevent.stop="releaseMoveLeft"
            @mouseup.prevent.stop="releaseMoveLeft"
            @mouseleave.prevent.stop="releaseMoveLeft"
          >◀</button>
          <button
            class="touch-key"
            @touchstart.prevent.stop="moveRightTouch"
            @mousedown.prevent.stop="moveRightTouch"
            @touchend.prevent.stop="releaseMoveRight"
            @mouseup.prevent.stop="releaseMoveRight"
            @mouseleave.prevent.stop="releaseMoveRight"
          >▶</button>
        </div>
      </div>

      <!-- 中间游戏画布 -->
      <div class="board-wrapper">
        <canvas id="tetris" width="360" height="720"></canvas>

        <!-- 开始菜单覆盖层 -->
        <div v-if="gameState === 'menu'" class="board-overlay menu-overlay">
          <div class="menu-title">拉海洛方块</div>
          <div class="menu-subtitle">LA HAILUO BLOCKS</div>
          <div class="difficulty-selector">
            <div class="diff-label">SELECT DIFFICULTY</div>
            <div class="diff-options">
              <button
                v-for="(d, i) in DIFFICULTIES"
                :key="i"
                class="diff-btn"
                :class="{ active: selectedDifficulty === i }"
                @click="selectedDifficulty = i"
              >
                <span class="diff-name">{{ d.name }}</span>
                <span class="diff-mult">×{{ d.multiplier }}</span>
              </button>
            </div>
          </div>
          <button class="start-btn" @click="startGame">▶ START GAME</button>
          <div class="menu-hint">← ↓ → move &nbsp; ↑ rotate &nbsp; SPACE drop &nbsp; P pause</div>
        </div>

        <!-- 暂停覆盖层 -->
        <div v-if="gameState === 'paused'" class="board-overlay pause-overlay" @click="resumeGame">
          <div class="overlay-title">PAUSED</div>
          <div class="overlay-hint">CLICK TO RESUME</div>
        </div>

        <!-- 游戏结束覆盖层 -->
        <div v-if="gameState === 'gameover'" class="board-overlay gameover-overlay" @click="backToMenu">
          <div class="overlay-title">GAME OVER</div>
          <div class="final-score">{{ formatScore(score) }}</div>
          <div class="overlay-hint">CLICK TO RETURN</div>
        </div>
      </div>

      <!-- 右侧 HUD：NEXT + 街机圆形按键 -->
      <div class="hud-panel right-panel">
        <div class="hud-label" style="font-size: 18px;">NEXT</div>
        <canvas id="next-piece" width="144" height="144"></canvas>
        <!-- 街机风格圆形操作按键 -->
        <div v-if="gameState === 'playing' || gameState === 'paused'" class="arcade-buttons">
          <div class="arcade-btn-row">
            <div class="arcade-btn-group">
              <button
                class="arcade-round-btn rotate-btn"
                @touchstart.prevent.stop="doRotate"
                @mousedown.prevent.stop="doRotate"
              >
                <span class="arcade-btn-icon">↻</span>
              </button>
              <span class="arcade-btn-label">ROTATE</span>
            </div>
            <div class="arcade-btn-group">
              <button
                class="arcade-round-btn speed-btn"
                @touchstart.prevent.stop="doSpeedDown"
                @mousedown.prevent.stop="doSpeedDown"
                @touchend.prevent.stop="releaseSpeedDown"
                @mouseup.prevent.stop="releaseSpeedDown"
                @mouseleave.prevent.stop="releaseSpeedDown"
              >
                <span class="arcade-btn-icon">▼</span>
              </button>
              <span class="arcade-btn-label">SPEED</span>
            </div>
            <div class="arcade-btn-group">
              <button
                class="arcade-round-btn drop-btn"
                @touchstart.prevent.stop="doHardDrop"
                @mousedown.prevent.stop="doHardDrop"
              >
                <span class="arcade-btn-icon">⏬</span>
              </button>
              <span class="arcade-btn-label">DROP</span>
            </div>
          </div>
          <div class="arcade-btn-group pause-group">
            <button
              class="arcade-round-btn pause-btn"
              @touchstart.prevent.stop="doTogglePause"
              @mousedown.prevent.stop="doTogglePause"
            >
              <span class="arcade-btn-icon">{{ gameState === 'paused' ? '▶' : '⏸' }}</span>
            </button>
            <span class="arcade-btn-label">{{ gameState === 'paused' ? 'START' : 'PAUSE' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ==================== 难度体系 ====================
const DIFFICULTIES = [
  { name: 'EASY',    speed: 1000, multiplier: 1 },
  { name: 'NORMAL',  speed: 700,  multiplier: 1.5 },
  { name: 'HARD',    speed: 450,  multiplier: 2.5 },
  { name: 'EXPERT',  speed: 250,  multiplier: 4 },
  { name: 'INSANE',  speed: 120,  multiplier: 6 },
]

// ==================== 游戏状态 ====================
type GameState = 'menu' | 'playing' | 'paused' | 'gameover'
const gameState = ref<GameState>('menu')
const selectedDifficulty = ref(0)
const score = ref(0)

// 格式化分数
function formatScore(s: number): string {
  return s.toString().padStart(6, '0')
}

// ==================== 游戏生命周期变量 ====================
let animationId = 0
let gameLoopRunning = false

// canvas / 游戏数据的引用（在 onMounted 中初始化）
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let nextCanvas: HTMLCanvasElement
let nextCtx: CanvasRenderingContext2D

const BLOCK_SIZE = 36
const COLS = 10
const ROWS = 20

const COLORS = [
  null,
  '#00ffff', '#fff033', '#ff4dff', '#4dff4d', '#ff3333', '#3366ff', '#ff9933'
] as const

const PIECES = [
  [],
  [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
  [[2,2], [2,2]],
  [[0,3,0], [3,3,3], [0,0,0]],
  [[0,4,4], [4,4,0], [0,0,0]],
  [[5,5,0], [0,5,5], [0,0,0]],
  [[6,0,0], [6,6,6], [0,0,0]],
  [[0,0,7], [7,7,7], [0,0,0]],
]

let board: number[][]
let lines = 0
let dropCounter = 0
let dropInterval = 1000
let lastTime = 0

const player: {
  pos: { x: number; y: number }
  matrix: number[][] | null
  nextMatrix: number[][] | null
} = { pos: { x: 0, y: 0 }, matrix: null, nextMatrix: null }

// ==================== 绘制函数 ====================
function drawBlock(context: CanvasRenderingContext2D, x: number, y: number, colorId: number) {
  if (colorId === 0) return
  const color = COLORS[colorId]!

  context.fillStyle = color
  context.globalAlpha = 0.85
  context.fillRect(x + 0.05, y + 0.05, 0.9, 0.9)
  context.globalAlpha = 1.0

  context.fillStyle = 'rgba(255, 255, 255, 0.7)'
  context.fillRect(x + 0.25, y + 0.25, 0.5, 0.08)
  context.fillRect(x + 0.25, y + 0.55, 0.15, 0.15)
  context.fillRect(x + 0.60, y + 0.55, 0.15, 0.15)

  context.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  context.lineWidth = 0.05
  context.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9)
  context.shadowBlur = 10
  context.shadowColor = color
  context.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9)
  context.shadowBlur = 0
}

function drawMatrix(matrix: number[][] | null, offset: { x: number; y: number }, context: CanvasRenderingContext2D = ctx) {
  if (!matrix) return
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) drawBlock(context, x + offset.x, y + offset.y, value)
    })
  })
}

function drawGrid() {
  ctx.fillStyle = 'rgba(150, 180, 255, 0.3)'
  const crossLength = 0.08
  const thickness = 0.02
  for (let i = 1; i < COLS; i++) {
    for (let j = 1; j < ROWS; j++) {
      ctx.fillRect(i - crossLength / 2, j - thickness / 2, crossLength, thickness)
      ctx.fillRect(i - thickness / 2, j - crossLength / 2, thickness, crossLength)
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawGrid()
  drawMatrix(board, { x: 0, y: 0 })
  drawMatrix(player.matrix, player.pos)
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height)
  if (player.nextMatrix) {
    const offsetX = (4 - player.nextMatrix[0].length) / 2
    const offsetY = (4 - player.nextMatrix.length) / 2
    drawMatrix(player.nextMatrix, { x: offsetX, y: offsetY }, nextCtx)
  }
}

// ==================== 游戏逻辑 ====================
function collide() {
  const m = player.matrix
  const o = player.pos
  if (!m) return false
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) return true
    }
  }
  return false
}

function merge() {
  if (!player.matrix) return
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) board[y + player.pos.y][x + player.pos.x] = value
    })
  })
}

function rotate(matrix: number[][], dir: number): number[][] {
  const transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
  if (dir > 0) return transposed.map(row => row.reverse())
  return transposed.reverse()
}

function playerDrop() {
  if (!player.matrix) return
  player.pos.y++
  if (collide()) {
    player.pos.y--
    merge()
    playerReset()
    arenaSweep()
  }
  dropCounter = 0
}

function playerMove(offset: number) {
  if (!player.matrix) return
  player.pos.x += offset
  if (collide()) player.pos.x -= offset
}

function playerRotate(dir: number) {
  if (!player.matrix) return
  const pos = player.pos.x
  let offset = 1
  player.matrix = rotate(player.matrix, dir)
  while (collide()) {
    player.pos.x += offset
    offset = -(offset + (offset > 0 ? 1 : -1))
    if (offset > player.matrix[0].length) {
      player.matrix = rotate(player.matrix, -dir)
      player.pos.x = pos
      return
    }
  }
}

function playerReset() {
  if (!player.nextMatrix) player.nextMatrix = PIECES[Math.floor(Math.random() * 7) + 1]
  player.matrix = player.nextMatrix
  player.nextMatrix = PIECES[Math.floor(Math.random() * 7) + 1]
  player.pos.y = 0
  player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2)

  if (collide()) {
    // 游戏结束
    stopGameLoop()
    gameState.value = 'gameover'
    return
  }
  drawNext()
}

function arenaSweep() {
  let rowCount = 1
  const diff = DIFFICULTIES[selectedDifficulty.value]
  outer: for (let y = ROWS - 1; y >= 0; --y) {
    for (let x = 0; x < COLS; ++x) {
      if (board[y][x] === 0) continue outer
    }
    const row = board.splice(y, 1)[0].fill(0)
    board.unshift(row)
    ++y
    score.value += Math.floor(rowCount * 100 * diff.multiplier)
    lines++
    rowCount *= 2
  }
  updateScore()
}

function updateScore() {
  document.getElementById('score')!.innerText = formatScore(score.value)
}

// ==================== 游戏循环 ====================
function gameLoop(time = 0) {
  if (!gameLoopRunning) return
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime
  if (dropCounter > dropInterval) {
    playerDrop()
  }

  draw()
  animationId = requestAnimationFrame(gameLoop)
}

function startGameLoop() {
  gameLoopRunning = true
  lastTime = performance.now()
  dropCounter = 0
  animationId = requestAnimationFrame(gameLoop)
}

function stopGameLoop() {
  gameLoopRunning = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = 0
  }
}

// ==================== 游戏控制 ====================
function startGame() {
  const diff = DIFFICULTIES[selectedDifficulty.value]
  dropInterval = diff.speed

  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  score.value = 0
  lines = 0
  dropCounter = 0

  player.matrix = null
  player.nextMatrix = null

  updateScore()
  document.getElementById('difficulty')!.innerText = diff.name

  gameState.value = 'playing'
  playerReset()

  startGameLoop()
  draw()
  drawNext()
}

function resumeGame() {
  gameState.value = 'playing'
  startGameLoop()
}

function backToMenu() {
  stopGameLoop()
  gameState.value = 'menu'
  document.getElementById('difficulty')!.innerText = '---'
}

// ==================== 键盘控制 ====================
function onKeyDown(event: KeyboardEvent) {
  // 全局：P 键暂停/继续
  if (event.key === 'p' || event.key === 'P') {
    if (gameState.value === 'playing') {
      stopGameLoop()
      gameState.value = 'paused'
      return
    } else if (gameState.value === 'paused') {
      resumeGame()
      return
    }
  }

  // 菜单状态下：Enter / Space 开始游戏
  if (gameState.value === 'menu') {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      startGame()
    }
    return
  }

  // 游戏结束状态下：Enter / Space 返回菜单
  if (gameState.value === 'gameover') {
    if (event.key === 'Enter' || event.key === ' ') {
      backToMenu()
    }
    return
  }

  // 暂停状态忽略游戏按键
  if (gameState.value === 'paused') return

  // 游戏进行中
  if (event.key === 'ArrowLeft') { event.preventDefault(); playerMove(-1) }
  else if (event.key === 'ArrowRight') { event.preventDefault(); playerMove(1) }
  else if (event.key === 'ArrowDown') { event.preventDefault(); playerDrop() }
  else if (event.key === 'ArrowUp') { event.preventDefault(); playerRotate(1) }
  else if (event.key === ' ') {
    event.preventDefault()
    if (!player.matrix) return
    while (!collide()) { player.pos.y++ }
    player.pos.y--
    merge()
    playerReset()
    arenaSweep()
    dropCounter = 0
  }
}

// ==================== 触屏控制 ====================
// 左右移动 — 模拟键盘长按：立即移动一次，400ms 后开始重复（50ms 间隔）
let moveLeftTimer: ReturnType<typeof setTimeout> | null = null
let moveLeftRepeat: ReturnType<typeof setInterval> | null = null
let moveRightTimer: ReturnType<typeof setTimeout> | null = null
let moveRightRepeat: ReturnType<typeof setInterval> | null = null

function moveLeftTouch() {
  if (gameState.value !== 'playing' && gameState.value !== 'paused') return
  if (gameState.value === 'paused') { resumeGame(); return }
  playerMove(-1)
  // 400ms 初始延迟后开始持续移动
  if (moveLeftTimer) clearTimeout(moveLeftTimer)
  if (moveLeftRepeat) clearInterval(moveLeftRepeat)
  moveLeftTimer = setTimeout(() => {
    if (moveLeftRepeat) clearInterval(moveLeftRepeat)
    moveLeftRepeat = setInterval(() => playerMove(-1), 50)
  }, 400)
}

function releaseMoveLeft() {
  if (moveLeftTimer) { clearTimeout(moveLeftTimer); moveLeftTimer = null }
  if (moveLeftRepeat) { clearInterval(moveLeftRepeat); moveLeftRepeat = null }
}

function moveRightTouch() {
  if (gameState.value !== 'playing' && gameState.value !== 'paused') return
  if (gameState.value === 'paused') { resumeGame(); return }
  playerMove(1)
  if (moveRightTimer) clearTimeout(moveRightTimer)
  if (moveRightRepeat) clearInterval(moveRightRepeat)
  moveRightTimer = setTimeout(() => {
    if (moveRightRepeat) clearInterval(moveRightRepeat)
    moveRightRepeat = setInterval(() => playerMove(1), 50)
  }, 400)
}

function releaseMoveRight() {
  if (moveRightTimer) { clearTimeout(moveRightTimer); moveRightTimer = null }
  if (moveRightRepeat) { clearInterval(moveRightRepeat); moveRightRepeat = null }
}

function doRotate() {
  if (gameState.value !== 'playing' && gameState.value !== 'paused') return
  if (gameState.value === 'paused') { resumeGame(); return }
  playerRotate(1)
}

// 加速下落 — 对应键盘 ↓ 键，长按持续软降
let speedDownTimer: ReturnType<typeof setTimeout> | null = null
let speedDownRepeat: ReturnType<typeof setInterval> | null = null

function doSpeedDown() {
  if (gameState.value !== 'playing' && gameState.value !== 'paused') return
  if (gameState.value === 'paused') { resumeGame(); return }
  if (!player.matrix) return
  playerDrop()
  // 模拟键盘长按：立即下落一格，400ms 后持续下落
  if (speedDownTimer) clearTimeout(speedDownTimer)
  if (speedDownRepeat) clearInterval(speedDownRepeat)
  speedDownTimer = setTimeout(() => {
    if (speedDownRepeat) clearInterval(speedDownRepeat)
    speedDownRepeat = setInterval(() => {
      if (!player.matrix || gameState.value !== 'playing') {
        releaseSpeedDown()
        return
      }
      playerDrop()
    }, 50)
  }, 400)
}

function releaseSpeedDown() {
  if (speedDownTimer) { clearTimeout(speedDownTimer); speedDownTimer = null }
  if (speedDownRepeat) { clearInterval(speedDownRepeat); speedDownRepeat = null }
}

function doHardDrop() {
  if (gameState.value !== 'playing' && gameState.value !== 'paused') return
  if (gameState.value === 'paused') { resumeGame(); return }
  if (!player.matrix) return
  while (!collide()) { player.pos.y++ }
  player.pos.y--
  merge()
  playerReset()
  arenaSweep()
  dropCounter = 0
}

function doTogglePause() {
  if (gameState.value === 'playing') {
    stopGameLoop()
    gameState.value = 'paused'
  } else if (gameState.value === 'paused') {
    resumeGame()
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  canvas = document.getElementById('tetris') as HTMLCanvasElement
  ctx = canvas.getContext('2d')!
  nextCanvas = document.getElementById('next-piece') as HTMLCanvasElement
  nextCtx = nextCanvas.getContext('2d')!

  ctx.scale(BLOCK_SIZE, BLOCK_SIZE)
  nextCtx.scale(BLOCK_SIZE, BLOCK_SIZE)

  document.addEventListener('keydown', onKeyDown)

  // 显示初始空棋盘
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  draw()
  drawNext()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  stopGameLoop()
  if (moveLeftTimer) clearTimeout(moveLeftTimer)
  if (moveLeftRepeat) clearInterval(moveLeftRepeat)
  if (moveRightTimer) clearTimeout(moveRightTimer)
  if (moveRightRepeat) clearInterval(moveRightRepeat)
  if (speedDownTimer) clearTimeout(speedDownTimer)
  if (speedDownRepeat) clearInterval(speedDownRepeat)
})
</script>

<style scoped>
/* scoped 占位 */
</style>

<style>
/* ==================== 自定义字体 ==================== */
@font-face {
  font-family: 'WuWa Lahai-Roi';
  src: url('/font/WuWa Lahai-Roi Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* ==================== CRT 显像管与玻璃屏幕外壳 ==================== */
.crt-tube {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: auto;
  background: radial-gradient(circle at 50% 60%, #df99ff 0%, #a255ff 35%, #5e26b5 70%, #1e0947 100%);
  border-radius: 40px;
  box-shadow: inset 0 0 80px rgba(0,0,0,0.6),
              inset 0 0 30px rgba(0,0,0,0.4),
              inset 0 0 10px rgba(255,255,255,0.1);
  animation: crt-flicker 0.12s infinite;
}

/* ==================== 背景装饰 ==================== */
.bg-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: center center;
  z-index: 1;
  opacity: 0.8;
}

.bg-deco-shapes {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 2;
  pointer-events: none;
  filter: blur(4px);
}

.bg-shape-1 {
  position: absolute;
  bottom: 15%; left: 10%;
  width: 120px; height: 120px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)) 40px 0 / 40px 120px no-repeat,
    linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)) 0 40px / 120px 40px no-repeat;
}

.bg-shape-2 {
  position: absolute;
  bottom: 8%; left: 22%;
  width: 160px; height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

.bg-shape-3 {
  position: absolute;
  bottom: 15%; right: 15%;
  width: 80px; height: 120px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)) 0 40px / 80px 40px no-repeat,
    linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)) 40px 80px / 40px 40px no-repeat;
}

/* ==================== 反光与扫描线 ==================== */
.glass-glare {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 200;
  pointer-events: none;
  mix-blend-mode: screen;
  background:
    radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 15%, transparent 35%),
    radial-gradient(ellipse at 80% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 40%),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 0%, transparent 6%);
}

.crt-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 100;
  pointer-events: none;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
  background-size: 100% 4px;
}

@keyframes crt-flicker {
  0% { opacity: 0.98; }
  50% { opacity: 1; }
  100% { opacity: 0.99; }
}

/* ==================== 游戏界面 UI ==================== */
.game-container {
  display: flex;
  gap: 40px;
  align-items: stretch;
  height: 720px;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  text-shadow: 1px 1px 3px rgba(255,255,255,0.4);
}

.hud-panel {
  background: rgba(140, 100, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 28px 22px;
  position: relative;
}

.hud-panel::before {
  content: "";
  position: absolute;
  top: 44px;
  width: 6px;
  height: 70px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
}

.left-panel::before { right: -4px; }
.right-panel::before { left: -4px; }

.left-panel {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.right-panel {
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.info-box {
  text-align: center;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: 18px 6px;
}

.hud-label {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 0 0 8px #fff, 0 0 15px #df99ff;
  margin: 0 0 16px 0;
  text-transform: uppercase;
}

.number-text {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 28px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 6px;
  color: #fff;
  text-shadow: 0 0 10px #fff;
}

.diff-text {
  color: #fff033;
  text-shadow: 0 0 10px #fff033, 0 0 20px rgba(255, 240, 51, 0.5);
}

/* ==================== 游戏画布 ==================== */
.board-wrapper {
  position: relative;
  line-height: 0;
}

canvas#tetris {
  background: rgba(20, 15, 60, 0.8);
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(100, 50, 255, 0.3), inset 0 0 40px rgba(0, 0, 20, 0.7);
}

canvas#next-piece {
  background: transparent;
  margin-top: 16px;
}

/* ==================== 覆盖层通用 ==================== */
.board-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 5, 30, 0.88);
  border-radius: 8px;
  z-index: 20;
  cursor: pointer;
}

.overlay-title {
  font-family: 'Courier New', monospace;
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 10px #fff, 0 0 25px #df99ff;
  letter-spacing: 0.15em;
  margin-bottom: 18px;
}

.overlay-hint {
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
}

/* ==================== 开始菜单覆盖层 ==================== */
.menu-overlay {
  cursor: default;
  gap: 0;
}

.menu-title {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 10px #fff, 0 0 25px #df99ff, 0 0 50px rgba(223, 153, 255, 0.5);
  letter-spacing: 0.12em;
  margin-bottom: 4px;
}

.menu-subtitle {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.3em;
  margin-bottom: 28px;
}

/* 难度选择器 */
.difficulty-selector {
  margin-bottom: 28px;
  width: 90%;
}

.diff-label {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: 10px;
}

.diff-options {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.diff-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.1em;
}

.diff-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.diff-btn.active {
  background: rgba(200, 150, 255, 0.2);
  border-color: rgba(200, 150, 255, 0.6);
  color: #fff;
  box-shadow: 0 0 12px rgba(200, 150, 255, 0.3);
}

.diff-name {
  font-weight: 700;
}

.diff-mult {
  font-size: 0.9rem;
  color: #fff033;
  text-shadow: 0 0 6px rgba(255, 240, 51, 0.6);
}

/* 开始按钮 */
.start-btn {
  padding: 14px 44px;
  background: rgba(200, 150, 255, 0.15);
  border: 2px solid rgba(200, 150, 255, 0.5);
  border-radius: 8px;
  color: #fff;
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 18px;
}

.start-btn:hover {
  background: rgba(200, 150, 255, 0.3);
  border-color: rgba(200, 150, 255, 0.8);
  box-shadow: 0 0 20px rgba(200, 150, 255, 0.4);
  transform: scale(1.05);
}

.menu-hint {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-align: center;
  line-height: 1.6;
}

/* ==================== 暂停覆盖层 ==================== */
.pause-overlay {
  gap: 8px;
}

/* ==================== 游戏结束覆盖层 ==================== */
.gameover-overlay {
  gap: 8px;
}

.final-score {
  font-family: 'Courier New', monospace;
  font-size: 1.4rem;
  color: #fff033;
  text-shadow: 0 0 8px rgba(255, 240, 51, 0.6);
  letter-spacing: 0.15em;
  margin-bottom: 10px;
}

/* ==================== 街机圆形操作按键 ==================== */
.touch-dpad {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: auto;
  padding-top: 8px;
}

.touch-dpad .touch-key {
  flex: 1;
  font-size: 1.4rem;
  padding: 14px 0;
}

.arcade-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: auto;
  padding-top: 12px;
}

.arcade-btn-row {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.arcade-btn-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 圆形按键 */
.arcade-round-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.35);
  background: radial-gradient(circle at 40% 35%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    0 0 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  position: relative;
}

/* 按钮顶部高光 */
.arcade-round-btn::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 12px;
  right: 12px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.arcade-round-btn:active {
  transform: scale(0.9);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.5),
    inset 0 3px 6px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(200, 150, 255, 0.4);
  border-color: rgba(200, 150, 255, 0.7);
}

.arcade-btn-icon {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.arcade-btn-label {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ===== 各按键配色 ===== */

/* ROTATE — 蓝紫色 */
.rotate-btn {
  background: radial-gradient(circle at 40% 30%, rgba(160, 200, 255, 0.5) 0%, rgba(80, 120, 220, 0.7) 40%, rgba(30, 50, 150, 0.9) 100%);
  border-color: rgba(130, 180, 255, 0.6);
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.15),
    0 0 14px rgba(100, 150, 255, 0.3);
}

.rotate-btn:active {
  background: radial-gradient(circle at 40% 30%, rgba(200, 225, 255, 0.6) 0%, rgba(120, 160, 255, 0.8) 40%, rgba(50, 80, 200, 0.95) 100%);
  border-color: rgba(160, 210, 255, 0.9);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.5),
    inset 0 3px 6px rgba(0, 0, 0, 0.4),
    0 0 24px rgba(100, 150, 255, 0.6);
}

/* SPEED — 绿色填充（对应键盘 ↓ 软降加速） */
.speed-btn {
  background: radial-gradient(circle at 40% 30%, rgba(140, 255, 140, 0.5) 0%, rgba(50, 200, 60, 0.7) 40%, rgba(15, 120, 20, 0.9) 100%);
  border-color: rgba(80, 220, 90, 0.6);
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.15),
    0 0 14px rgba(50, 200, 60, 0.3);
}

.speed-btn:active {
  background: radial-gradient(circle at 40% 30%, rgba(180, 255, 180, 0.6) 0%, rgba(80, 230, 90, 0.8) 40%, rgba(20, 150, 30, 0.95) 100%);
  border-color: rgba(100, 240, 110, 0.9);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.5),
    inset 0 3px 6px rgba(0, 0, 0, 0.4),
    0 0 24px rgba(50, 200, 60, 0.6);
}

/* DROP — 红色填充 */
.drop-btn {
  background: radial-gradient(circle at 40% 30%, rgba(255, 160, 160, 0.5) 0%, rgba(220, 70, 70, 0.7) 40%, rgba(150, 20, 20, 0.9) 100%);
  border-color: rgba(255, 120, 120, 0.6);
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.15),
    0 0 14px rgba(255, 80, 80, 0.3);
}

.drop-btn:active {
  background: radial-gradient(circle at 40% 30%, rgba(255, 190, 190, 0.6) 0%, rgba(255, 90, 90, 0.8) 40%, rgba(180, 30, 30, 0.95) 100%);
  border-color: rgba(255, 140, 140, 0.9);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.5),
    inset 0 3px 6px rgba(0, 0, 0, 0.4),
    0 0 24px rgba(255, 80, 80, 0.6);
}

/* PAUSE — 琥珀金色填充 */
.pause-btn {
  width: 42px;
  height: 42px;
  border-width: 2px;
  background: radial-gradient(circle at 40% 30%, rgba(255, 230, 140, 0.5) 0%, rgba(220, 170, 40, 0.7) 40%, rgba(150, 100, 10, 0.9) 100%);
  border-color: rgba(255, 200, 80, 0.6);
}

.pause-btn .arcade-btn-icon {
  font-size: 1rem;
}

.pause-btn:active {
  background: radial-gradient(circle at 40% 30%, rgba(255, 245, 170, 0.6) 0%, rgba(240, 190, 50, 0.8) 40%, rgba(170, 120, 20, 0.95) 100%);
  border-color: rgba(255, 210, 100, 0.9);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.5),
    inset 0 3px 6px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(255, 200, 60, 0.5);
}

.pause-group {
  margin-top: 4px;
}

.pause-group .arcade-btn-label {
  font-size: 0.5rem;
}

.touch-key {
  background: rgba(100, 60, 200, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 1rem;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.12s ease;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  display: flex;
  align-items: center;
  justify-content: center;
}

.touch-key:active {
  background: rgba(200, 150, 255, 0.4);
  border-color: rgba(200, 150, 255, 0.7);
  color: #fff;
  box-shadow: 0 0 16px rgba(200, 150, 255, 0.4);
  transform: scale(0.94);
}
</style>
