// 短縮URLを作る: POST /api/short  {"code": "共有コード"} → {"id": "k7Qx2mA", "url": "https://…/s/k7Qx2mA"}
// 受け付けるのは、共有コードとして正しいもの（英数字と - _、長さ、末尾のチェックの1バイト）だけ。
// 同じコードには同じIDを返す。作りすぎの制限: 同じ接続元から 1分に10件・1日に200件まで。
const MAX_LEN = 4000;
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";   // 見間違えやすい 0 O 1 l I を除く

const crc8 = u8 => { let c = 0; for (let i = 0; i < u8.length; i++) { c ^= u8[i]; for (let k = 0; k < 8; k++) c = (c & 0x80) ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff; } return c; };
const unb64 = t => { const s = atob(t.replace(/-/g, "+").replace(/_/g, "/")); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

function valid(code) {
  if (typeof code !== "string" || code.length < 4 || code.length > MAX_LEN || !/^[A-Za-z0-9_-]+$/.test(code)) return false;
  try {
    const u = unb64(code);
    return u.length >= 3 && crc8(u.subarray(0, u.length - 1)) === u[u.length - 1];
  } catch (e) { return false; }
}
function newId() {
  const r = crypto.getRandomValues(new Uint8Array(7));
  return [...r].map(b => ALPHA[b % ALPHA.length]).join("");
}

// 短縮URLの中身（共有コード）を返す: GET /api/short?id=k7Qx2mA → {"code": "…"}（ページを移動せずに読み込むため）
export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get("id") || "";
  const row = /^[A-Za-z0-9]{4,16}$/.test(id) ? await env.DB.prepare("SELECT code FROM short WHERE id = ?").bind(id).first() : null;
  return row ? json({ code: row.code }) : json({ error: "この短縮URLは見つかりませんでした" }, 404);
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "送信の形式が正しくありません" }, 400); }
  const code = body && body.code;
  if (!valid(code)) return json({ error: "共有コードが正しくありません" }, 400);
  // カードに出すタイトル（編成の3人の名前など）。制御文字を除き、80文字まで。画面に出すときにエスケープする
  const title = typeof body.title === "string" ? body.title.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, 80) || null : null;
  const origin = new URL(request.url).origin;
  const hash = await sha(code);
  const had = await env.DB.prepare("SELECT id, title FROM short WHERE hash = ?").bind(hash).first();
  if (had) {
    if (!had.title && title) await env.DB.prepare("UPDATE short SET title = ? WHERE id = ?").bind(title, had.id).run();
    return json({ id: had.id, url: origin + "/s/" + had.id });
  }

  const ip = (await sha("sim-short:" + (request.headers.get("CF-Connecting-IP") || ""))).slice(0, 16);
  const now = Date.now();
  const cnt = await env.DB.prepare("SELECT SUM(created > ?) AS m, COUNT(*) AS d FROM short WHERE ip = ? AND created > ?").bind(now - 60e3, ip, now - 86400e3).first();
  if ((cnt && cnt.m) >= 10 || (cnt && cnt.d) >= 200) return json({ error: "短時間に作りすぎです。少し待ってから試してください" }, 429);

  for (let i = 0; i < 5; i++) {
    const id = newId();
    try {
      await env.DB.prepare("INSERT INTO short (id, code, hash, ip, created, title) VALUES (?, ?, ?, ?, ?, ?)").bind(id, code, hash, ip, now, title).run();
      return json({ id, url: origin + "/s/" + id });
    } catch (e) {
      // 同じIDが既にある（まれ）か、同時に同じコードが登録された
      const again = await env.DB.prepare("SELECT id FROM short WHERE hash = ?").bind(hash).first();
      if (again) return json({ id: again.id, url: origin + "/s/" + again.id });
    }
  }
  return json({ error: "短縮URLを作れませんでした" }, 500);
}
