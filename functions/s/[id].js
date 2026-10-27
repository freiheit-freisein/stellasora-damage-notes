// 短縮URLを開く: GET /s/<id>
// 人が開いたとき: 計算ページ（/sim#c=共有コード）へすぐ移動する。
// X などがリンクのカードを作るとき: このページのカード用の情報（タイトル＝編成の3人など、画像は共通の og.png）を読む。
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SITE = "巡遊者の計算ノート";

export async function onRequestGet({ params, env, request }) {
  const id = String(params.id || "");
  const row = /^[A-Za-z0-9]{4,16}$/.test(id) ? await env.DB.prepare("SELECT code, title FROM short WHERE id = ?").bind(id).first() : null;
  const origin = new URL(request.url).origin;
  if (!row) {
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>${SITE}</title><p>この短縮URLは見つかりませんでした。</p><p><a href="/sim">計算ページへ</a></p>`,
      { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
  }
  const to = "/sim#c=" + row.code;   // 共有コードは英数字と - _ だけ（作るときに確認済み）
  const title = row.title ? `${row.title} | ${SITE}` : `ビルドの共有 | ${SITE}`;
  const desc = "素質・徽章・ロスレコ・音符まで入れて、巡遊者のダメージを計算した結果を共有しています（ステラソラの非公式ツール）";
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(origin + "/s/" + id)}">
<meta property="og:image" content="${esc(origin + "/og.png")}">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${esc(to)}">
</head><body><p><a href="${esc(to)}">${SITE}で開く</a></p><script>location.replace(${JSON.stringify(to)});</script></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
}
