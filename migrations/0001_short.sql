-- 短縮URL: id（短いID）→ 共有コード。同じコードには同じIDを返すため、コードのハッシュに一意の制約。
-- ip は、IPアドレスそのものではなく、ハッシュの先頭（作りすぎの制限にだけ使う）
CREATE TABLE short (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  ip TEXT,
  created INTEGER NOT NULL
);
CREATE INDEX short_ip_created ON short (ip, created);
