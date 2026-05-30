export interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT player_name as id, score FROM leaderboard ORDER BY score DESC, timestamp ASC LIMIT 6"
    ).all();
    return Response.json(results || []);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { id, score } = await context.request.json<{ id: string; score: number }>();
    if (!id || typeof score !== 'number') {
      return new Response("Bad Request", { status: 400 });
    }

    await context.env.DB.prepare(
      "INSERT INTO leaderboard (player_name, score) VALUES (?, ?)"
    ).bind(id, score).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};