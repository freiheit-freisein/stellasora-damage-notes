// 誤りの報告を受け取る: POST /api/report {kind, body, contact?, code?, team?, ver?} → {ok: true}
// 管理用の画面はない（D1 の report テーブルを、あとで直接読む。migrations/0003_report.sql に読み方）
// 送りすぎの制限: 同じ接続元から 10分に5件・1日に30件まで
const KINDS = ["計算式・数値", "素質の効果", "ロスレコ・音符", "徽章・ステータス", "表示・使い方", "その他"];
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const str = (v, max) => typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max) : "";

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch (e) { return json({ error: "送信の形式が正しくありません" }, 400); }
  const kind = KINDS.includes(b && b.kind) ? b.kind : null;
  const body = str(b && b.body, 2000);
  if (!kind) return json({ error: "種類を選んでください" }, 400);
  if (body.length < 5) return json({ error: "内容を5文字以上で書いてください" }, 400);
  const code = typeof b.code === "string" && /^[A-Za-z0-9_-]{4,4000}$/.test(b.code) ? b.code : null;

  const ip = (await sha("sim-report:" + (request.headers.get("CF-Connecting-IP") || ""))).slice(0, 16);
  const now = Date.now();
  const cnt = await env.DB.prepare("SELECT SUM(created > ?) AS m, COUNT(*) AS d FROM report WHERE ip = ? AND created > ?").bind(now - 600e3, ip, now - 86400e3).first();
  if ((cnt && cnt.m) >= 5 || (cnt && cnt.d) >= 30) return json({ error: "短時間に送りすぎです。少し待ってから送ってください" }, 429);

  await env.DB.prepare("INSERT INTO report (created, kind, body, contact, code, team, ver, ua, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(now, kind, body, str(b.contact, 100) || null, code, str(b.team, 120) || null, str(b.ver, 20) || null, str(request.headers.get("User-Agent") || "", 200) || null, ip).run();
  return json({ ok: true });
}
