export async function onRequest() {
  const res = await fetch('https://r2-jk.makuraly.xyz/denia/images.json');
  if (!res.ok) {
    return new Response(JSON.stringify({ error: `Upstream fetch failed: ${res.status}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
