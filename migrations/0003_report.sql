-- 誤りの報告（β版の間、計算式などの誤りを送ってもらう）。管理用の画面はなく、wrangler d1 execute で読む:
--   npx wrangler d1 execute stellasora-sim-short --remote --command "SELECT id, datetime(created/1000,'unixepoch','+9 hours') AS jst, kind, body, contact, team, ver, status FROM report ORDER BY id DESC LIMIT 50"
-- code = 送った人のその時の入力（共有コード。計算ページで「共有コード」の読込に貼ると、同じ状態を再現できる）
-- ip は、IPアドレスそのものではなくハッシュの先頭（送りすぎの制限にだけ使う）。status: new → 見た（seen）→ 直した（fixed）など
CREATE TABLE report (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created INTEGER NOT NULL,
  kind TEXT NOT NULL,
  body TEXT NOT NULL,
  contact TEXT,
  code TEXT,
  team TEXT,
  ver TEXT,
  ua TEXT,
  ip TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX report_ip_created ON report (ip, created);
