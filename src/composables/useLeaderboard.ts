import { computed, ref, shallowRef } from 'vue'

export interface LeaderboardEntry {
  id: string
  score: number
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '想成为人类', score: 934680 },
  { id: '飞行雪绒', score: 915800 },
  { id: '不捣蛋就给糖', score: 796060 },
  { id: '我的论文被谁吃了', score: 406420 },
]

const PLAYER_NAME_KEY = 'denia.player_name'
const SESSION_BEST_KEY = 'denia.session_best'

function safeReadLocalStorage(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

function safeWriteLocalStorage(key: string, value: string) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
  } catch {
    /* ignore quota / privacy errors */
  }
}

/**
 * 全局单例：游戏排行榜（Cloudflare D1）
 * - 数据：完整排行榜（已在后端按玩家去重取最高分）
 * - 行为：拉取、提交、计算当前分数排名、判断是否值得弹出「提交分数」弹窗
 * - 持久化：玩家昵称、会话最高分用 localStorage 保存（便于跨刷新沿用）
 */
const leaderboard = shallowRef<LeaderboardEntry[]>([...DEFAULT_LEADERBOARD])
const isLoading = ref(false)
const lastError = ref<unknown>(null)

const playerName = ref<string>(safeReadLocalStorage(PLAYER_NAME_KEY) || '')

const initialBest = Number.parseInt(safeReadLocalStorage(SESSION_BEST_KEY) || '0', 10)
const personalBestScore = ref<number>(Number.isFinite(initialBest) && initialBest > 0 ? initialBest : 0)

let didInitialLoad = false

async function loadLeaderboard(force = false): Promise<void> {
  if (isLoading.value) return
  if (didInitialLoad && !force) return
  isLoading.value = true
  try {
    const res = await fetch('/api/leaderboard', { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`leaderboard fetch failed: ${res.status}`)
    const data = (await res.json()) as LeaderboardEntry[]
    if (Array.isArray(data) && data.length > 0) {
      leaderboard.value = data
    }
    didInitialLoad = true
  } catch (err) {
    lastError.value = err
    // 静默失败：保留 DEFAULT_LEADERBOARD，避免影响游玩
    // eslint-disable-next-line no-console
    console.error('[useLeaderboard] load failed', err)
  } finally {
    isLoading.value = false
  }
}

/** 计算分数在当前榜单中的实时排名（1-based）。 */
function rankFor(score: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0
  let rank = 1
  for (const entry of leaderboard.value) {
    if (entry.score > score) rank++
  }
  return rank
}

/**
 * 提交成绩：
 *  - 先做乐观更新（保持每个玩家只显示最高分），随后请求 API
 *  - 提交成功后强制重新拉取一次，与后端对齐
 *  - 同步保存玩家名字
 */
async function submitScore(name: string, score: number): Promise<void> {
  const trimmedName = (name || '').trim().slice(0, 32) || 'ANONYMOUS'
  const safeScore = Math.max(0, Math.floor(score || 0))

  playerName.value = trimmedName
  safeWriteLocalStorage(PLAYER_NAME_KEY, trimmedName)

  // 乐观更新：将本玩家以最高分覆盖（保持去重语义）
  const next: LeaderboardEntry[] = []
  let inserted = false
  for (const entry of leaderboard.value) {
    if (entry.id === trimmedName) {
      // 同名玩家：保留更高分，跳过低分
      if (entry.score >= safeScore) {
        next.push(entry)
      } else {
        next.push({ id: trimmedName, score: safeScore })
      }
      inserted = true
    } else {
      next.push(entry)
    }
  }
  if (!inserted) next.push({ id: trimmedName, score: safeScore })
  next.sort((a, b) => b.score - a.score)
  leaderboard.value = next

  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: trimmedName, score: safeScore }),
    })
    await loadLeaderboard(true)
  } catch (err) {
    lastError.value = err
    // eslint-disable-next-line no-console
    console.error('[useLeaderboard] submit failed', err)
  }
}

/**
 * 是否应该为这一局成绩弹出「提交分数」弹窗。
 * 规则：分数 > 0 且严格大于本会话历史最高分。
 */
function shouldPromptSubmit(score: number): boolean {
  if (!Number.isFinite(score) || score <= 0) return false
  return score > personalBestScore.value
}

/** 标记本会话最高分（弹窗触发时调用，避免反复弹）。 */
function markPersonalBest(score: number) {
  if (Number.isFinite(score) && score > personalBestScore.value) {
    personalBestScore.value = Math.floor(score)
    safeWriteLocalStorage(SESSION_BEST_KEY, String(personalBestScore.value))
  }
}

/** 设置/获取玩家名字（弹窗 input 预填用）。 */
function setPlayerName(name: string) {
  const v = (name || '').trim().slice(0, 32)
  playerName.value = v
  if (v) safeWriteLocalStorage(PLAYER_NAME_KEY, v)
}

/** 把分数 padStart 到 6 位的标准格式，便于在 UI 一致呈现。 */
function formatScore(s: number): string {
  return Math.max(0, Math.floor(Number.isFinite(s) ? s : 0))
    .toString()
    .padStart(6, '0')
}

export function useLeaderboard() {
  return {
    // state
    leaderboard,
    isLoading,
    lastError,
    playerName,
    personalBestScore,

    // helpers
    rankFor,
    formatScore,

    // actions
    loadLeaderboard,
    submitScore,
    shouldPromptSubmit,
    markPersonalBest,
    setPlayerName,

    // computed factory：给定一个 score ref，返回对应的 1-based 排名
    useRankOf: (scoreRef: { value: number }) => computed(() => rankFor(scoreRef.value)),
  }
}