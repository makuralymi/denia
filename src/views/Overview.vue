<template>
  <div class="overview-container">
    <div class="tetris-decor-layer" aria-hidden="true">
      <div
        v-for="piece in decorativePieces"
        :key="piece.id"
        class="tetris-piece"
        :style="getPieceStyle(piece)"
      >
        <div
          v-for="cell in piece.cells"
          :key="`${piece.id}-${cell[0]}-${cell[1]}`"
          class="tetris-cell"
          :style="getCellStyle(piece, cell)"
        ></div>
      </div>
    </div>

    <div class="content-placeholder">
      <p>Awaiting Instructions...</p>
    </div>

    <LyricsOverlay />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import LyricsOverlay from '@/components/shared/LyricsOverlay.vue'

type CellPoint = [number, number]

interface DecorativePiece {
  id: number
  shapeIndex: number
  turns: number
  cells: CellPoint[]
  shapeWidth: number
  shapeHeight: number
  color: string
  x: number
  y: number
  size: number
  speed: number
  drift: number
  rotation: number
  rotateSpeed: number
  opacity: number
  nextDirectionChange: number
}

const BLOCK_COLORS = [
  '#00ffff',
  '#fff033',
  '#ff4dff',
  '#4dff4d',
  '#ff3333',
  '#3366ff',
  '#ff9933',
]

const TETROMINOES: number[][][] = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
]

const decorativePieces = ref<DecorativePiece[]>([])

let pieceId = 0
let animationFrameId = 0
let lastTimestamp = 0
let viewportWidth = 0
let viewportHeight = 0

function rotateMatrix(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]).reverse())
}

function getRotatedShape(shapeIndex: number, turns: number) {
  let matrix = TETROMINOES[shapeIndex].map((row) => [...row])

  for (let i = 0; i < turns; i++) {
    matrix = rotateMatrix(matrix)
  }

  const cells: CellPoint[] = []
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        cells.push([x, y])
      }
    })
  })

  return {
    cells,
    width: matrix[0]?.length ?? 0,
    height: matrix.length,
  }
}

function getPieceCount() {
  if (viewportWidth < 640) return 6
  if (viewportWidth < 1024) return 8
  return 12
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomSigned(min: number, max: number) {
  const value = randomRange(min, max)
  return Math.random() > 0.5 ? value : -value
}

function applyShape(piece: DecorativePiece, shapeIndex: number, turns: number) {
  const rotated = getRotatedShape(shapeIndex, turns)

  piece.shapeIndex = shapeIndex
  piece.turns = turns
  piece.cells = rotated.cells
  piece.shapeWidth = rotated.width
  piece.shapeHeight = rotated.height
  piece.color = BLOCK_COLORS[shapeIndex]
}

function resetPiece(piece: DecorativePiece, initial = false) {
  const shapeIndex = Math.floor(Math.random() * TETROMINOES.length)
  const turns = Math.floor(Math.random() * 4)
  applyShape(piece, shapeIndex, turns)

  piece.size = randomRange(22, 38)
  piece.speed = randomRange(28, 70)
  piece.drift = randomSigned(8, 26)
  piece.rotation = randomRange(0, 360)
  piece.rotateSpeed = randomSigned(8, 28)
  piece.opacity = randomRange(0.18, 0.36)
  piece.nextDirectionChange = randomRange(1.2, 3.2)

  const maxStartX = Math.max(0, viewportWidth - piece.shapeWidth * piece.size)
  piece.x = randomRange(0, maxStartX)
  piece.y = initial
    ? randomRange(-viewportHeight, viewportHeight * 0.7)
    : -piece.shapeHeight * piece.size - randomRange(piece.size * 2, viewportHeight * 0.35)
}

function createPiece(initial = false): DecorativePiece {
  const piece: DecorativePiece = {
    id: ++pieceId,
    shapeIndex: 0,
    turns: 0,
    cells: [],
    shapeWidth: 0,
    shapeHeight: 0,
    color: BLOCK_COLORS[0],
    x: 0,
    y: 0,
    size: 28,
    speed: 40,
    drift: 0,
    rotation: 0,
    rotateSpeed: 0,
    opacity: 0.25,
    nextDirectionChange: 2,
  }

  resetPiece(piece, initial)
  return piece
}

function syncViewport() {
  viewportWidth = window.innerWidth
  viewportHeight = window.innerHeight
}

function syncPieceCount() {
  const targetCount = getPieceCount()

  while (decorativePieces.value.length < targetCount) {
    decorativePieces.value.push(createPiece(true))
  }

  if (decorativePieces.value.length > targetCount) {
    decorativePieces.value.splice(targetCount)
  }

  decorativePieces.value.forEach((piece) => {
    const maxX = Math.max(0, viewportWidth - piece.shapeWidth * piece.size)
    piece.x = Math.min(Math.max(piece.x, 0), maxX)
  })
}

function randomizeDirection(piece: DecorativePiece) {
  piece.drift = randomSigned(8, 30)
  piece.rotateSpeed = randomSigned(8, 32)
  piece.nextDirectionChange = randomRange(1.1, 3)

  if (Math.random() > 0.45) {
    const turnDelta = Math.random() > 0.5 ? 1 : 3
    const nextTurns = (piece.turns + turnDelta) % 4
    applyShape(piece, piece.shapeIndex, nextTurns)

    const maxX = Math.max(0, viewportWidth - piece.shapeWidth * piece.size)
    piece.x = Math.min(Math.max(piece.x, 0), maxX)
  }
}

function animatePieces(timestamp: number) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp
  }

  const delta = Math.min(48, timestamp - lastTimestamp)
  lastTimestamp = timestamp

  decorativePieces.value.forEach((piece) => {
    piece.y += (piece.speed * delta) / 1000
    piece.x += (piece.drift * delta) / 1000
    piece.rotation += (piece.rotateSpeed * delta) / 1000
    piece.nextDirectionChange -= delta / 1000

    if (piece.nextDirectionChange <= 0) {
      randomizeDirection(piece)
    }

    const minX = -piece.size * 0.35
    const maxX = Math.max(minX, viewportWidth - piece.shapeWidth * piece.size + piece.size * 0.35)

    if (piece.x < minX) {
      piece.x = minX
      piece.drift = Math.abs(piece.drift)
    } else if (piece.x > maxX) {
      piece.x = maxX
      piece.drift = -Math.abs(piece.drift)
    }

    if (piece.y > viewportHeight + piece.shapeHeight * piece.size) {
      resetPiece(piece)
    }
  })

  animationFrameId = window.requestAnimationFrame(animatePieces)
}

function handleResize() {
  syncViewport()
  syncPieceCount()
}

function getPieceStyle(piece: DecorativePiece): CSSProperties {
  return {
    width: `${piece.shapeWidth * piece.size}px`,
    height: `${piece.shapeHeight * piece.size}px`,
    transform: `translate3d(${piece.x}px, ${piece.y}px, 0) rotate(${piece.rotation}deg)`,
    opacity: piece.opacity.toString(),
    '--cell-size': `${piece.size}px`,
  } as CSSProperties
}

function getCellStyle(piece: DecorativePiece, cell: CellPoint): CSSProperties {
  return {
    left: `${cell[0] * piece.size}px`,
    top: `${cell[1] * piece.size}px`,
    '--piece-color': piece.color,
  } as CSSProperties
}

onMounted(() => {
  syncViewport()
  syncPieceCount()
  animationFrameId = window.requestAnimationFrame(animatePieces)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.overview-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.tetris-decor-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.tetris-decor-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 28%),
    radial-gradient(circle at 80% 30%, rgba(223, 153, 255, 0.12) 0%, transparent 30%),
    radial-gradient(circle at 50% 100%, rgba(94, 38, 181, 0.12) 0%, transparent 42%);
  opacity: 0.8;
}

.tetris-piece {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  will-change: transform;
}

.tetris-cell {
  position: absolute;
  width: calc(var(--cell-size) - 4px);
  height: calc(var(--cell-size) - 4px);
  border-radius: 10px;
  background: var(--piece-color);
  box-shadow:
    0 0 18px var(--piece-color),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85),
    inset 0 -10px 14px rgba(0, 0, 0, 0.22);
  opacity: 0.85;
}

.tetris-cell::before {
  content: '';
  position: absolute;
  top: 16%;
  left: 22%;
  width: 48%;
  height: 10%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.tetris-cell::after {
  content: '';
  position: absolute;
  left: 22%;
  bottom: 20%;
  width: 16%;
  height: 16%;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0.36em 0 0 rgba(255, 255, 255, 0.45);
}

.content-placeholder {
  position: relative;
  z-index: 1;
}

.content-placeholder p {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 300;
  letter-spacing: 0.2rem;
  font-size: 1.2rem;
  text-align: center;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .content-placeholder p {
    font-size: 1rem;
    letter-spacing: 0.14rem;
  }

  .tetris-cell {
    border-radius: 8px;
  }
}
</style>