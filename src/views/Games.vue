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
          <button
            class="touch-key touch-key-down"
            @touchstart.prevent.stop="doSpeedDown"
            @mousedown.prevent.stop="doSpeedDown"
            @touchend.prevent.stop="releaseSpeedDown"
            @mouseup.prevent.stop="releaseSpeedDown"
            @mouseleave.prevent.stop="releaseSpeedDown"
          >▼</button>
        </div>
      </div>

      <!-- 中间游戏画布 -->
      <div class="board-wrapper">
        <canvas id="tetris" width="380" height="760"></canvas>

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
          <div class="menu-hint">WASD / ← ↓ → move &nbsp; W / ↑ rotate &nbsp; SPACE drop &nbsp; P pause</div>
        </div>

        <!-- 暂停覆盖层 -->
        <div v-if="gameState === 'paused'" class="board-overlay pause-overlay" @click="resumeGame">
          <div class="overlay-title">PAUSED</div>
          <div class="overlay-hint">CLICK TO RESUME</div>
          <div class="pause-actions">
            <button class="pause-btn-icon" title="重开" @click.stop="startGame">↺</button>
            <button class="pause-btn-icon" title="主页" @click.stop="backToMenu">🏠</button>
          </div>
        </div>

        <!-- 游戏结束覆盖层 -->
        <div v-if="gameState === 'gameover'" class="board-overlay gameover-overlay" @click="backToMenu">
          <div class="overlay-title">GAME OVER</div>
          <div class="final-score">{{ formatScore(score) }}</div>
          <div class="gameover-actions">
            <button class="gameover-action-btn" @click.stop="showLeaderboardModal = true">排行</button>
            <button class="gameover-action-btn" @click.stop="backToMenu">主页</button>
          </div>
          <div class="overlay-hint">点击空白重载</div>
        </div>
      </div>

      <!-- 右侧 HUD：NEXT + 街机圆形按键 -->
      <div class="hud-panel right-panel">
        <div class="next-preview">
          <div class="hud-label next-label">NEXT</div>
          <canvas id="next-piece" width="152" height="152"></canvas>
        </div>
        <div class="info-box lines-box">
          <div class="hud-label">LINES</div>
          <p class="number-text" id="lines-count">00</p>
        </div>
        <!-- 街机风格圆形操作按键：暂停在上，三角形功能键在下 -->
        <div v-if="gameState === 'playing' || gameState === 'paused'" class="arcade-buttons">
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
          <div class="arcade-triangle">
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
            <div class="arcade-triangle-bottom">
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
          </div>
        </div>
      </div>

      <div class="hud-panel leaderboard-panel">
        <div class="lb-header">
          <span class="lb-title">RANKING</span>
          <span class="lb-header-icon">✦</span>
        </div>
        <div class="lb-list lb-list-scroll">
          <div
            v-for="(entry, idx) in leaderboard"
            :key="idx"
            class="lb-row"
            :class="`lb-rank-${idx + 1}`"
          >
            <span class="lb-rank-num">{{ idx + 1 }}</span>
            <span class="lb-rank-id">{{ entry.id }}</span>
            <span class="lb-rank-score">{{ formatLeaderboardScore(entry.score) }}</span>
          </div>
        </div>
        <div class="lb-current-wrap">
          <div class="lb-current-label">YOU</div>
          <div class="lb-row lb-current-row">
            <span class="lb-rank-num">{{ currentRank > 0 ? currentRank : '-' }}</span>
            <span class="lb-rank-id">{{ currentPlayerName }}</span>
            <span class="lb-rank-score">{{ formatLeaderboardScore(score) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏粒子烟花 -->
    <canvas ref="fireworksCanvas" class="fireworks-canvas"></canvas>

    <!-- 新高分弹窗 -->
    <Teleport to="body">
      <div v-if="showHighScoreModal" class="hs-modal-backdrop" @click.self="skipHighScore">
        <div class="hs-modal glass-panel">
          <img :src="jumpGif" class="hs-gif" alt="celebration" />
          <div class="hs-title">NEW HIGH SCORE!</div>
          <div class="hs-score">{{ formatScore(score) }}</div>
          <div class="hs-rank-info">RANK #{{ newRank }}</div>
          <input
            ref="hsNameInput"
            v-model="hsPlayerName"
            class="hs-input"
            placeholder="ENTER YOUR ID"
            maxlength="20"
            @keydown.enter="submitHighScore"
          />
          <div class="hs-buttons">
            <button class="hs-btn submit-btn" @click="submitHighScore">SUBMIT</button>
            <button class="hs-btn skip-btn" @click="skipHighScore">SKIP</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showLeaderboardModal" class="ranking-modal-backdrop" @click.self="showLeaderboardModal = false">
        <div class="ranking-modal glass-panel">
          <div class="lb-header">
            <span class="lb-title">RANKING</span>
            <button class="ranking-close-btn" @click="showLeaderboardModal = false">×</button>
          </div>
          <div class="lb-list">
            <div
              v-for="(entry, idx) in leaderboard"
              :key="idx"
              class="lb-row"
              :class="`lb-rank-${idx + 1}`"
            >
              <span class="lb-rank-num">{{ idx + 1 }}</span>
              <span class="lb-rank-id">{{ entry.id }}</span>
              <span class="lb-rank-score">{{ formatLeaderboardScore(entry.score) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import jumpGif from '@/canvas/effects/jump__2_.gif'

// ==================== 难度体系 ====================
const DIFFICULTIES = [
  { name: 'EASY',    speed: 1000, multiplier: 1 },
  { name: 'NORMAL',  speed: 700,  multiplier: 1.5 },
  { name: 'HARD',    speed: 450,  multiplier: 2.5 },
  { name: 'EXPERT',  speed: 250,  multiplier: 4 },
  { name: 'INSANE',  speed: 120,  multiplier: 6 },
]

// ==================== 音效引擎 ====================
let audioCtx: AudioContext | null = null

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
}

function playSound(type: 'move' | 'rotate' | 'drop' | 'clear' | 'tetris') {
  if (!audioCtx) return
  if (audioCtx.state === 'suspended') audioCtx.resume()

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)

  const t = audioCtx.currentTime
  const vol = 3.0 // 全局音量放大系数

  if (type === 'move') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, t)
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.05)
    gain.gain.setValueAtTime(0.1 * vol, t)
    gain.gain.exponentialRampToValueAtTime(0.01 * vol, t + 0.05)
    osc.start(t)
    osc.stop(t + 0.05)
  } else if (type === 'rotate') {
    osc.type = 'square'
    osc.frequency.setValueAtTime(330, t)
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.05)
    gain.gain.setValueAtTime(0.05 * vol, t)
    gain.gain.exponentialRampToValueAtTime(0.01 * vol, t + 0.05)
    osc.start(t)
    osc.stop(t + 0.05)
  } else if (type === 'drop') {
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1)
    gain.gain.setValueAtTime(0.1 * vol, t)
    gain.gain.exponentialRampToValueAtTime(0.01 * vol, t + 0.1)
    osc.start(t)
    osc.stop(t + 0.1)
  } else if (type === 'clear') {
    osc.type = 'square'
    osc.frequency.setValueAtTime(440, t)
    osc.frequency.setValueAtTime(554.37, t + 0.1)
    gain.gain.setValueAtTime(0.1 * vol, t)
    gain.gain.exponentialRampToValueAtTime(0.01 * vol, t + 0.2)
    osc.start(t)
    osc.stop(t + 0.2)
  } else if (type === 'tetris') {
    osc.type = 'square'
    osc.frequency.setValueAtTime(440, t)
    osc.frequency.setValueAtTime(554.37, t + 0.1)
    osc.frequency.setValueAtTime(659.25, t + 0.2)
    osc.frequency.setValueAtTime(880, t + 0.3)
    gain.gain.setValueAtTime(0.15 * vol, t)
    gain.gain.exponentialRampToValueAtTime(0.01 * vol, t + 0.5)
    osc.start(t)
    osc.stop(t + 0.5)
  }
}

// ==================== 排行榜 (Cloudflare D1) ====================
interface LeaderboardEntry {
  id: string
  score: number
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '想成为人类', score: 934680 },
  { id: '飞行雪绒', score: 915800 },
  { id: '不捣蛋就给糖', score: 796060 },
  { id: '我的论文被谁吃了', score: 406420 },
]

const leaderboard = ref<LeaderboardEntry[]>([...DEFAULT_LEADERBOARD])

async function loadLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard')
    const contentType = res.headers.get('content-type')
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json() as LeaderboardEntry[]
      if (Array.isArray(data) && data.length > 0) {
        leaderboard.value = data
        return
      }
    }
  } catch (err) {
    console.error('Failed to load leaderboard', err)
  }
}

function formatLeaderboardScore(s: number): string {
  return s.toString().padStart(6, '0')
}

// 当前会话中玩家本人取得过的最高分；只有刷新该值时才弹出「提交分数」弹窗
const sessionBestScore = ref(0)

// 检查分数：只有 > 0 且 > 本会话历史最高分 时返回排名（用于弹窗）；
// 排名按当前 leaderboard 实时计算（即使会被排到末尾也会弹）。
function checkHighScore(sc: number): number {
  if (sc <= 0) return 0
  if (sc <= sessionBestScore.value) return 0
  let rank = 1
  for (const entry of leaderboard.value) {
    if (entry.score > sc) rank++
  }
  return rank
}

async function insertScore(id: string, sc: number) {
  // 乐观更新：保留所有条目，按分数降序展示
  const entry: LeaderboardEntry = { id, score: sc }
  const list = [...leaderboard.value, entry]
  list.sort((a, b) => b.score - a.score)
  leaderboard.value = list

  // 记住当前玩家名字用于底部展示
  currentPlayerName.value = id

  // 异步提交到 D1
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, score: sc }),
    })
    // 提交成功后静默重新拉取一下最新数据，以防有并发冲突
    await loadLeaderboard()
  } catch (err) {
    console.error('Failed to submit score', err)
  }
}

// 当前游玩玩家名字（默认 YOU，提交成绩后会更新为玩家输入的 id）
const currentPlayerName = ref('YOU')

// 当前分数在排行榜中的实时排名（0 表示分数为 0 / 不参与排名）
const currentRank = computed(() => {
  const sc = score.value
  if (sc <= 0) return 0
  let rank = 1
  for (const entry of leaderboard.value) {
    if (entry.score > sc) rank++
  }
  return rank
})

// ==================== 新高分弹窗 ====================
const showHighScoreModal = ref(false)
const showLeaderboardModal = ref(false)
const hsPlayerName = ref('')
const newRank = ref(0)
const hsNameInput = ref<HTMLInputElement | null>(null)

function skipHighScore() {
  showHighScoreModal.value = false
  hsPlayerName.value = ''
}

function submitHighScore() {
  const name = hsPlayerName.value.trim() || 'ANONYMOUS'
  insertScore(name, score.value)
  showHighScoreModal.value = false
  hsPlayerName.value = ''
}

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
let isAnimatingClear = false
let blinkingRows: number[] = []
let blinkTick = 0

// canvas / 游戏数据的引用（在 onMounted 中初始化）
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let nextCanvas: HTMLCanvasElement
let nextCtx: CanvasRenderingContext2D

const BLOCK_SIZE = 38
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

  if (typeof isAnimatingClear !== 'undefined' && isAnimatingClear && blinkTick % 2 === 1) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    for (const y of blinkingRows) {
      for (let x = 0; x < COLS; ++x) {
        if (board[y][x] !== 0) {
          ctx.fillRect(x + 0.05, y + 0.05, 0.9, 0.9)
        }
      }
    }
  }
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
    playSound('drop')
    playerReset()
    arenaSweep()
  }
  dropCounter = 0
}

function playerMove(offset: number) {
  if (!player.matrix) return
  player.pos.x += offset
  if (collide()) {
    player.pos.x -= offset
  } else {
    playSound('move')
  }
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
  playSound('rotate')
}

function playerReset() {
  if (!player.nextMatrix) player.nextMatrix = PIECES[Math.floor(Math.random() * 7) + 1]
  player.matrix = player.nextMatrix
  player.nextMatrix = PIECES[Math.floor(Math.random() * 7) + 1]
  player.pos.y = 0
  player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2)

  if (collide()) {
    stopGameLoop()
    gameState.value = 'gameover'
    handleGameOver()
    return
  }
  drawNext()
}

function arenaSweep() {
  const diff = DIFFICULTIES[selectedDifficulty.value]
  const rowsToClear: number[] = []

  outer: for (let y = ROWS - 1; y >= 0; --y) {
    for (let x = 0; x < COLS; ++x) {
      if (board[y][x] === 0) continue outer
    }
    rowsToClear.push(y)
  }

  if (rowsToClear.length > 0) {
    isAnimatingClear = true
    blinkingRows = rowsToClear
    blinkTick = 0

    if (rowsToClear.length >= 4) {
      playSound('tetris')
    } else {
      playSound('clear')
    }

    doBlinkAnimation(diff)
  }
}

function doBlinkAnimation(diff: any) {
  if (blinkTick >= 4) {
    let rowCount = 1
    // 从上至下消除原本被标记的行逻辑，以匹配之前的计分和行清除方式：
    // 这里使用传统的循环直接对 board 重新检测，因为在 blink 期间 board 未变化。
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
    
    isAnimatingClear = false
    blinkingRows = []
  } else {
    blinkTick++
    setTimeout(() => {
      doBlinkAnimation(diff)
    }, 100)
  }
}

function updateScore() {
  document.getElementById('score')!.innerText = formatScore(score.value)
  document.getElementById('lines-count')!.innerText = lines.toString().padStart(2, '0')
}

// ==================== 游戏循环 ====================
function gameLoop(time = 0) {
  if (!gameLoopRunning) return
  const deltaTime = time - lastTime
  lastTime = time

  if (!isAnimatingClear) {
    dropCounter += deltaTime
    if (dropCounter > dropInterval) {
      playerDrop()
    }
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
  initAudio()
  showLeaderboardModal.value = false
  
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
  showLeaderboardModal.value = false
  gameState.value = 'menu'
  document.getElementById('score')!.innerText = '000000'
  document.getElementById('lines-count')!.innerText = '00'
  document.getElementById('difficulty')!.innerText = '---'
}

function handleGameOver() {
  const finalScore = score.value
  const rank = checkHighScore(finalScore)
  if (rank > 0) {
    sessionBestScore.value = finalScore
    newRank.value = rank
    hsPlayerName.value = ''
    showHighScoreModal.value = true
    startFireworks()
    setTimeout(() => {
      hsNameInput.value?.focus()
    }, 100)
  }
}

// ==================== 粒子烟花系统 ====================
const fireworksCanvas = ref<HTMLCanvasElement | null>(null)
let fireworksActive = false
let fireworksAnimId = 0

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

let fireworksParticles: Particle[] = []

function spawnBurst(cx: number, cy: number) {
  const count = 40 + Math.floor(Math.random() * 50)
  const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#ff8800', '#ff0088', '#88ff00', '#fff']
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 6
    const life = 800 + Math.random() * 1200
    fireworksParticles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 3,
    })
  }
}

function triggerFireworkBursts() {
  const w = window.innerWidth
  const h = window.innerHeight
  for (let i = 0; i < 3; i++) {
    const cx = Math.random() * w
    const cy = Math.random() * h * 0.6
    setTimeout(() => spawnBurst(cx, cy), i * 200 + Math.random() * 300)
  }
}

function drawFireworks() {
  if (!fireworksActive) return
  const canvas = fireworksCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i]
    p.life -= 16
    if (p.life <= 0) {
      fireworksParticles.splice(i, 1)
      continue
    }
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.03 // 重力

    const alpha = p.life / p.maxLife
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0

  fireworksAnimId = requestAnimationFrame(drawFireworks)
}

function startFireworks() {
  if (fireworksActive) return
  fireworksActive = true
  fireworksParticles = []

  // 持续发射烟花 4 秒
  let bursts = 0
  const interval = setInterval(() => {
    triggerFireworkBursts()
    bursts++
    if (bursts > 6) {
      clearInterval(interval)
    }
  }, 700)

  triggerFireworkBursts()
  fireworksAnimId = requestAnimationFrame(drawFireworks)

  // 动画最多持续 6 秒
  setTimeout(() => {
    fireworksActive = false
  }, 6000)
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
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); playerMove(-1) }
  else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); playerMove(1) }
  else if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') { event.preventDefault(); playerDrop() }
  else if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') { event.preventDefault(); playerRotate(1) }
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
  playSound('drop')
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
  loadLeaderboard()
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
  fireworksActive = false
  if (fireworksAnimId) cancelAnimationFrame(fireworksAnimId)
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
  gap: 28px;
  align-items: stretch;
  height: 780px;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  text-shadow: 1px 1px 3px rgba(255,255,255,0.4);
  max-width: calc(100vw - 40px);
  flex-wrap: nowrap;
}

.hud-panel {
  background: rgba(140, 100, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 28px 30px;
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
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

/* ==================== 排行榜面板 ==================== */
.leaderboard-panel {
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
}

.lb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(var(--c-light-blue), 0.2);
  flex-shrink: 0;
}

.lb-title {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(var(--c-light-blue), 0.8);
  text-shadow: 0 0 8px rgba(var(--c-light-blue), 0.4);
}

.lb-header-icon {
  color: rgba(var(--c-pink), 0.6);
  font-size: 0.9rem;
  text-shadow: 0 0 6px rgba(var(--c-pink), 0.5);
}

.lb-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 侧边面板版：占满剩余高度，超出滚动 */
.leaderboard-panel .lb-list-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--c-light-blue), 0.35) transparent;
}

.leaderboard-panel .lb-list-scroll::-webkit-scrollbar {
  width: 5px;
}

.leaderboard-panel .lb-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.leaderboard-panel .lb-list-scroll::-webkit-scrollbar-thumb {
  background: rgba(var(--c-light-blue), 0.3);
  border-radius: 3px;
}

.leaderboard-panel .lb-list-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--c-light-blue), 0.55);
}

/* 弹窗版排行榜：限制最大高度并允许滚动 */
.ranking-modal .lb-list {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--c-light-blue), 0.35) transparent;
}

.ranking-modal .lb-list::-webkit-scrollbar {
  width: 5px;
}

.ranking-modal .lb-list::-webkit-scrollbar-thumb {
  background: rgba(var(--c-light-blue), 0.3);
  border-radius: 3px;
}

/* ==================== 底部固定：当前游玩成绩 ==================== */
.lb-current-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px dashed rgba(var(--c-pink), 0.35);
}

.lb-current-label {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.25em;
  color: rgba(var(--c-pink), 0.7);
  text-shadow: 0 0 6px rgba(var(--c-pink), 0.4);
  text-align: center;
  text-transform: uppercase;
}

.lb-current-row {
  background: rgba(var(--c-pink), 0.1);
  border: 1px solid rgba(var(--c-pink), 0.4);
  box-shadow: 0 0 12px rgba(var(--c-pink), 0.2), inset 0 0 8px rgba(var(--c-pink), 0.08);
  border-left: 2px solid rgba(var(--c-pink), 0.8);
  animation: lbCurrentGlow 2.4s ease-in-out infinite;
}

.lb-current-row .lb-rank-num,
.lb-current-row .lb-rank-score {
  color: #fff;
  text-shadow: 0 0 8px rgba(var(--c-pink), 0.7);
}

.lb-current-row .lb-rank-id {
  color: rgba(255, 255, 255, 0.88);
}

@keyframes lbCurrentGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(var(--c-pink), 0.18), inset 0 0 6px rgba(var(--c-pink), 0.06);
  }
  50% {
    box-shadow: 0 0 18px rgba(var(--c-pink), 0.38), inset 0 0 10px rgba(var(--c-pink), 0.12);
  }
}

.lb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

.lb-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.lb-rank-num {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: 900;
  min-width: 22px;
  text-align: center;
}

.lb-rank-id {
  flex: 1;
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 6px;
}

.lb-rank-score {
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* 排行榜排名配色 */
.lb-rank-1 .lb-rank-num,
.lb-rank-1 .lb-rank-score { color: #ffd700; text-shadow: 0 0 6px rgba(255, 215, 0, 0.4); }
.lb-rank-1 .lb-rank-id { color: rgba(255, 215, 0, 0.6); }

.lb-rank-2 .lb-rank-num,
.lb-rank-2 .lb-rank-score { color: #e8e8e8; text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
.lb-rank-2 .lb-rank-id { color: rgba(232, 232, 232, 0.6); }

.lb-rank-3 .lb-rank-num,
.lb-rank-3 .lb-rank-score { color: #c0a060; text-shadow: 0 0 5px rgba(192, 160, 96, 0.3); }
.lb-rank-3 .lb-rank-id { color: rgba(192, 160, 96, 0.6); }

.lb-rank-4 .lb-rank-num,
.lb-rank-4 .lb-rank-score { color: rgba(var(--c-light-blue), 0.8); }
.lb-rank-4 .lb-rank-id { color: rgba(var(--c-light-blue), 0.55); }

.lb-rank-5 .lb-rank-num,
.lb-rank-5 .lb-rank-score { color: rgba(var(--c-pink), 0.7); }
.lb-rank-5 .lb-rank-id { color: rgba(var(--c-pink), 0.5); }

.lb-rank-6 .lb-rank-num,
.lb-rank-6 .lb-rank-score { color: rgba(80, 220, 220, 0.65); }
.lb-rank-6 .lb-rank-id { color: rgba(80, 220, 220, 0.4); }

.lb-rank-1 { border-left: 2px solid #ffd700; }
.lb-rank-2 { border-left: 2px solid #e8e8e8; }
.lb-rank-3 { border-left: 2px solid #c0a060; }
.lb-rank-4 { border-left: 2px solid rgba(var(--c-light-blue), 0.5); }
.lb-rank-5 { border-left: 2px solid rgba(var(--c-pink), 0.4); }
.lb-rank-6 { border-left: 2px solid rgba(80, 220, 220, 0.4); }

/* ==================== 响应式布局 ==================== */

/* -- 860px: 移动端隐藏桌面排行榜，保持原有弹窗行为 -- */
@media screen and (max-width: 860px) {
  .leaderboard-panel {
    display: none;
  }
}

/* -- 1100px: 缩小左右面板 -- */
@media screen and (max-width: 1100px) {
  .game-container {
    gap: 20px;
  }
  .left-panel {
    width: 180px;
    gap: 20px;
    padding: 20px 14px;
  }
  .right-panel {
    width: 165px;
    padding: 20px 16px;
  }
  .leaderboard-panel {
    width: 210px;
    padding: 20px 16px;
    gap: 12px;
  }
  .info-box {
    padding: 14px 4px;
  }
  .hud-label {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .number-text {
    font-size: 22px;
    letter-spacing: 4px;
  }
  .hud-panel::before {
    top: 34px;
    width: 4px;
    height: 50px;
  }
  .arcade-round-btn {
    width: 48px;
    height: 48px;
  }
  .arcade-btn-icon {
    font-size: 1.1rem;
  }
  .arcade-btn-label {
    font-size: 0.48rem;
  }
  .pause-btn {
    width: 56px;
    height: 56px;
  }
  .pause-btn .arcade-btn-icon {
    font-size: 0.95rem;
  }
  .lb-row {
    padding: 8px 10px;
  }
  .lb-rank-id {
    font-size: 0.66rem;
  }
  .lb-rank-score {
    font-size: 0.84rem;
  }
}

/* -- 860px: 竖排布局，侧面板变横排 -- */
@media screen and (max-width: 860px) {
  .game-container {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    height: auto;
    min-height: 100vh;
    padding: 60px 10px 20px;
    position: relative;
    top: auto; left: auto;
    transform: none;
    justify-content: flex-start;
  }
  .board-wrapper {
    order: 1;
  }
  .left-panel {
    order: 2;
    width: 100%;
    max-width: 400px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 14px 16px;
  }
  .left-panel .info-box {
    flex: 1;
    min-width: 120px;
  }
  .left-panel::before {
    display: none;
  }
  .right-panel {
    order: 3;
    width: 100%;
    max-width: 400px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
  }
  .right-panel::before {
    display: none;
  }
  .right-panel .hud-label {
    display: block;
  }
  .right-panel canvas {
    margin-top: 0;
  }
  .arcade-buttons {
    flex-direction: row;
    gap: 14px;
    margin-top: 0;
    padding-top: 0;
    width: auto;
  }
  .arcade-triangle {
    flex-direction: row;
    gap: 10px;
  }
  .arcade-triangle-bottom {
    gap: 12px;
  }
  .pause-group {
    margin-top: 0;
  }
  .touch-dpad {
    width: 100%;
  }
}

/* -- 600px: 进一步缩小 -- */
@media screen and (max-width: 600px) {
  .game-container {
    gap: 8px;
    padding: 44px 6px 12px;
  }
  .left-panel {
    max-width: 100%;
    padding: 10px 8px;
    gap: 8px;
  }
  .right-panel {
    max-width: 100%;
    padding: 10px 8px;
    gap: 8px;
  }
  .info-box {
    padding: 10px 4px;
  }
  .hud-label {
    font-size: 15px;
    letter-spacing: 2px;
    margin-bottom: 6px;
  }
  .number-text {
    font-size: 18px;
    letter-spacing: 3px;
  }
  .arcade-round-btn {
    width: 42px;
    height: 42px;
  }
  .arcade-btn-icon {
    font-size: 1rem;
  }
  .arcade-btn-label {
    font-size: 0.42rem;
  }
  .pause-btn {
    width: 30px;
    height: 30px;
  }
  .pause-btn .arcade-btn-icon {
    font-size: 0.7rem;
  }
}

/* -- 420px: 极小屏，缩放 canvas -- */
@media screen and (max-width: 420px) {
  canvas#tetris {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 2;
  }
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
  border-radius: 5%;
  box-shadow: 0 0 30px rgba(100, 50, 255, 0.3), inset 0 0 40px rgba(0, 0, 20, 0.7);
}

canvas#next-piece {
  width: 168px;
  height: 168px;
  background: rgba(12, 8, 35, 0.18);
  margin-top: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.05);
}

.next-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.next-label {
  font-size: 22px;
}

.lines-box {
  width: 100%;
  padding: 20px 8px;
}

.lines-box .hud-label {
  font-size: 20px;
  margin-bottom: 12px;
}

.lines-box .number-text {
  font-size: 34px;
  letter-spacing: 4px;
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
  font-family: 'Courier New', monospace;
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
  font-family: 'Courier New', monospace;
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

.pause-actions {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.pause-btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
}

.pause-btn-icon:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff033;
  color: #fff033;
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(255, 240, 51, 0.4);
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

.gameover-actions {
  display: flex;
  gap: 12px;
  margin: 8px 0 12px;
}

.gameover-action-btn {
  padding: 9px 16px;
  background: rgba(200, 150, 255, 0.15);
  border: 1px solid rgba(200, 150, 255, 0.5);
  border-radius: 8px;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gameover-action-btn:hover {
  background: rgba(200, 150, 255, 0.28);
  border-color: rgba(200, 150, 255, 0.8);
  box-shadow: 0 0 14px rgba(200, 150, 255, 0.35);
}


.touch-dpad .touch-key {
  flex: 1;
  min-height: 68px;
  font-size: 1.75rem;
  padding: 18px 0;
}
/* ==================== 街机圆形操作按键 ==================== */
.touch-dpad {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: auto;
  margin-bottom: 18px;
  padding-top: 0;
  transform: translateY(-50px);
}

.touch-key-down {
  display: none;
}

.arcade-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  margin-top: auto;
  padding-top: 12px;
}

/* 三角形功能键布局 */
.arcade-triangle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.arcade-triangle-bottom {
  display: flex;
  gap: 36px;
  justify-content: center;
}

.arcade-btn-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rotate-btn,
.speed-btn,
.drop-btn {
  width: 68px;
  height: 68px;
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

/* ==================== 全屏粒子烟花画布 ==================== */
.fireworks-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 500;
}

/* ==================== 新高分弹窗 ==================== */
.hs-modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.103);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.hs-modal.glass-panel {
  background: rgba(20, 10, 30, 0.13);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 2px solid rgba(var(--c-pink), 0.4);
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(var(--c-pink), 0.3), 0 0 80px rgba(var(--c-light-blue), 0.15);
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 380px;
  max-width: 90vw;
  animation: modalIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes modalIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.hs-gif {
  width: 140px;
  height: auto;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 4px;
}

.hs-title {
  font-family: 'Courier New', monospace;
  font-size: 1.8rem;
  font-weight: 900;
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3);
  letter-spacing: 0.12em;
}

.hs-score {
  font-family: 'Courier New', monospace;
  font-size: 2.4rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 10px #fff, 0 0 20px rgba(var(--c-light-blue), 0.5);
  letter-spacing: 0.1em;
}

.hs-rank-info {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: rgba(var(--c-light-blue), 0.7);
  letter-spacing: 0.15em;
  margin-bottom: 4px;
}

.hs-input {
  width: 260px;
  max-width: 80%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(var(--c-pink), 0.4);
  border-radius: 8px;
  color: #fff;
  font-family: 'WuWa Lahai-Roi', 'Courier New', monospace;
  font-size: 1rem;
  text-align: center;
  letter-spacing: 0.1em;
  outline: none;
  transition: all 0.3s ease;
}

.hs-input:focus {
  border-color: rgba(var(--c-pink), 0.8);
  box-shadow: 0 0 16px rgba(var(--c-pink), 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.hs-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.08em;
}

.hs-buttons {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.hs-btn {
  padding: 10px 28px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.submit-btn {
  background: rgba(var(--c-pink), 0.2);
  border: 2px solid rgba(var(--c-pink), 0.5);
  color: #fff;
}

.submit-btn:hover {
  background: rgba(var(--c-pink), 0.35);
  border-color: rgba(var(--c-pink), 0.8);
  box-shadow: 0 0 20px rgba(var(--c-pink), 0.4);
}

.skip-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
}

.skip-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.8);
}

.ranking-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.ranking-modal.glass-panel {
  width: min(92vw, 360px);
  padding: 22px;
  border-radius: 16px;
  background: rgba(20, 10, 30, 0.42);
  border: 1px solid rgba(var(--c-light-blue), 0.28);
  box-shadow: 0 0 34px rgba(var(--c-pink), 0.22), inset 0 0 20px rgba(255, 255, 255, 0.04);
}

.ranking-close-btn {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  line-height: 1;
  font-size: 1.15rem;
}

.ranking-close-btn:hover {
  color: #fff;
  border-color: rgba(var(--c-pink), 0.5);
  box-shadow: 0 0 12px rgba(var(--c-pink), 0.25);
}

/* ==================== 移动端游戏布局：参考掌机面板 ==================== */
@media screen and (max-width: 860px) {
  .crt-tube {
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    border-radius: 28px;
  }

  .game-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 88px;
    grid-template-rows: auto minmax(0, auto) auto;
    align-items: start;
    gap: 8px;
    width: min(100vw - 20px, 430px);
    max-width: none;
    min-height: 0;
    height: 100vh;
    height: 100dvh;
    box-sizing: border-box;
    overflow: hidden;
    padding: 76px 10px 10px;
    position: relative;
    top: auto;
    left: auto;
    transform: none;
  }

  .left-panel,
  .right-panel {
    display: contents;
  }

  .hud-panel {
    background: transparent;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
    padding: 0;
  }

  .hud-panel::before {
    display: none;
  }

  .left-panel .info-box {
    grid-column: 1;
    justify-self: start;
    width: min(48vw, 170px);
    padding: 0;
    text-align: left;
    background: transparent;
    border: 0;
  }

  .left-panel .info-box:first-child {
    grid-row: 1;
  }

  .left-panel .info-box:nth-child(2) {
    grid-row: 1;
    align-self: end;
    transform: translateY(42px);
  }

  .board-wrapper {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
    min-width: 0;
    margin-top: 8px;
  }

  canvas#tetris {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 2;
  }

  .next-preview {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
    justify-self: stretch;
  }

  .next-label,
  .right-panel .hud-label,
  .hud-label {
    font-size: 13px;
    letter-spacing: 1.5px;
    margin-bottom: 4px;
  }

  .number-text {
    font-size: 24px;
    letter-spacing: 1px;
    line-height: 1;
  }

  .diff-text {
    font-size: 14px;
  }

  canvas#next-piece {
    width: 70px;
    height: 70px;
    margin-top: 0;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;
    background: rgba(0, 0, 0, 0.15);
  }

  .lines-box {
    grid-column: 2;
    grid-row: 2;
    align-self: center;
    justify-self: stretch;
    padding: 0;
    text-align: left;
    background: transparent;
    border: 0;
  }

  .lines-box .number-text {
    font-size: 28px;
  }

  .touch-dpad {
    grid-column: 1;
    grid-row: 3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    margin-top: 2px;
    padding-top: 0;
  }

  .touch-dpad .touch-key {
    min-width: 0;
    height: 52px;
    padding: 0;
    font-size: 1.5rem;
    border-radius: 10px;
  }

  .touch-dpad .touch-key:first-child {
    order: 1;
  }

  .touch-dpad .touch-key:nth-child(2) {
    order: 3;
  }

  .touch-key-down {
    display: flex;
    order: 2;
  }

  .arcade-buttons {
    grid-column: 2;
    grid-row: 2 / span 2;
    align-self: end;
    width: 100%;
    gap: 14px;
    margin-top: 0;
    padding-top: 0;
  }

  .arcade-triangle {
    gap: 14px;
  }

  .arcade-triangle-bottom {
    flex-direction: column;
    gap: 14px;
  }

  .arcade-round-btn {
    width: 44px;
    height: 44px;
    border-width: 2px;
  }

  .pause-btn {
    width: 36px;
    height: 36px;
  }

  .rotate-btn,
  .speed-btn,
  .drop-btn {
    width: 52px;
    height: 52px;
  }

  .arcade-btn-icon {
    font-size: 1rem;
  }

  .arcade-btn-label {
    font-size: 0.46rem;
    letter-spacing: 0.05em;
  }

  .menu-title {
    font-size: 1.4rem;
  }

  .menu-subtitle {
    font-size: 0.58rem;
    margin-bottom: 16px;
  }

  .difficulty-selector {
    margin-bottom: 16px;
  }

  .diff-options {
    gap: 5px;
  }

  .diff-btn {
    padding: 7px 12px;
    font-size: 0.66rem;
  }

  .start-btn {
    padding: 10px 22px;
    font-size: 0.78rem;
    margin-bottom: 10px;
  }

  .menu-hint {
    display: none;
  }

  .game-container {
    grid-template-columns: minmax(0, 1fr) 98px;
    grid-template-rows: auto auto auto auto auto 1fr auto;
    align-items: start;
    gap: 8px 10px;
    width: min(100vw - 18px, 440px);
    padding: 76px 9px 10px;
  }

  .board-wrapper {
    grid-column: 1;
    grid-row: 1 / span 6;
    align-self: start;
    margin-top: 0;
  }

  .left-panel .info-box {
    grid-column: 2;
    justify-self: stretch;
    width: auto;
    min-width: 0;
    text-align: center;
    padding: 8px 6px;
    background: rgba(12, 8, 35, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.04);
  }

  .left-panel .info-box:first-child {
    grid-row: 1;
  }

  .left-panel .info-box:nth-child(2) {
    grid-row: 2;
    align-self: start;
    transform: none;
  }

  .next-preview {
    grid-column: 2;
    grid-row: 3;
    justify-self: stretch;
    align-self: start;
    padding: 8px 6px 10px;
    background: rgba(12, 8, 35, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.04);
  }

  .lines-box {
    grid-column: 2;
    grid-row: 4;
    align-self: start;
    justify-self: stretch;
    text-align: center;
    padding: 8px 6px;
    background: rgba(12, 8, 35, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.04);
  }

  .arcade-buttons {
    display: contents;
  }

  .pause-group {
    grid-column: 2;
    grid-row: 5;
    align-self: start;
    margin-top: 4px;
  }

  .arcade-triangle {
    grid-column: 2;
    grid-row: 6;
    align-self: end;
    justify-self: stretch;
    gap: 14px;
  }

  .arcade-triangle-bottom {
    flex-direction: column;
    gap: 14px;
  }

  .touch-dpad {
    grid-column: 1;
    grid-row: 7;
    margin-top: 2px;
  }

  .hud-label,
  .next-label,
  .right-panel .hud-label {
    font-size: 12px;
    letter-spacing: 0.1em;
    line-height: 1.2;
    margin-bottom: 5px;
  }

  .number-text {
    font-size: 20px;
    letter-spacing: 0.04em;
  }

  .diff-text {
    font-size: 13px;
  }

  .lines-box .number-text {
    font-size: 26px;
  }

  canvas#next-piece {
    width: 74px;
    height: 74px;
  }

  .arcade-round-btn {
    width: 42px;
    height: 42px;
  }

  .pause-btn {
    width: 36px;
    height: 36px;
  }

  .rotate-btn,
  .speed-btn,
  .drop-btn {
    width: 50px;
    height: 50px;
  }

  .arcade-btn-label {
    font-size: 0.4rem;
    letter-spacing: 0.03em;
    max-width: 72px;
    text-align: center;
    line-height: 1.15;
  }

  .gameover-actions {
    flex-direction: column;
    gap: 8px;
    width: 72%;
    max-width: 180px;
  }

  .gameover-action-btn {
    width: 100%;
    padding: 8px 10px;
  }
}

@media screen and (max-width: 420px) {
  .game-container {
    grid-template-columns: minmax(0, 1fr) 86px;
    width: calc(100vw - 14px);
    gap: 6px;
    padding: 74px 7px 8px;
  }

  .left-panel .info-box {
    width: auto;
  }

  .number-text {
    font-size: 17px;
  }

  canvas#next-piece {
    width: 66px;
    height: 66px;
  }

  .lines-box .number-text {
    font-size: 22px;
  }

  .touch-dpad .touch-key {
    height: 46px;
  }

  .arcade-round-btn {
    width: 38px;
    height: 38px;
  }

  .pause-btn {
    width: 32px;
    height: 32px;
  }

  .rotate-btn,
  .speed-btn,
  .drop-btn {
    width: 44px;
    height: 44px;
  }
}
</style>