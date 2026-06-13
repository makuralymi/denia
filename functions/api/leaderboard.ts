export interface Env {
  DB: D1Database;
}

interface LeaderboardRow {
  id: string;
  score: number;
}

/**
 * GET /api/leaderboard?limit=&offset=
 * - 不带 limit 时默认返回 200 条（足够长，前端可滚动展示）
 * - 按 player_name 去重，只保留每个玩家的最高分
 * - 排序：score 降序，相同分数取最早提交者在前
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get('limit') || '200', 10) || 200, 1),
      1000
    );
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10) || 0, 0);

    const { results } = await context.env.DB.prepare(
      `
      SELECT player_name AS id, MAX(score) AS score
      FROM leaderboard
      GROUP BY player_name
      ORDER BY score DESC, MIN(timestamp) ASC
      LIMIT ? OFFSET ?
      `
    )
      .bind(limit, offset)
      .all<LeaderboardRow>();

    return Response.json(results || [], {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * POST /api/leaderboard
 * body: { id: string; score: number }
 * - 简单校验：名字非空、限制长度，分数为非负整数
 * - 始终插入新记录（保留历史数据），由 GET 端去重取最高分
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ id?: unknown; score?: unknown }>();
    const rawId = typeof body.id === 'string' ? body.id.trim() : '';
    const id = rawId.slice(0, 32);
    const score = typeof body.score === 'number' && Number.isFinite(body.score)
      ? Math.max(0, Math.floor(body.score))
      : NaN;

    if (!id || Number.isNaN(score)) {
      return new Response(JSON.stringify({ error: 'invalid id or score' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'INSERT INTO leaderboard (player_name, score) VALUES (?, ?)'
    )
      .bind(id, score)
      .run();

    return Response.json({ success: true, id, score });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};