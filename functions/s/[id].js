// 短縮URLを開く: GET /s/<id> → 計算ページ（/sim#c=共有コード）へ移動。見つからなければ、その旨のページ
export async function onRequestGet({ params, env, request }) {
  const id = String(params.id || "");
  const row = /^[A-Za-z0-9]{4,16}$/.test(id) ? await env.DB.prepare("SELECT code FROM short WHERE id = ?").bind(id).first() : null;
  if (row) return Response.redirect(new URL("/sim#c=" + row.code, request.url).toString(), 302);
  return new Response('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>巡遊者ダメージ計算</title><p>この短縮URLは見つかりませんでした。</p><p><a href="/sim">計算ページへ</a></p>',
    { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
}
