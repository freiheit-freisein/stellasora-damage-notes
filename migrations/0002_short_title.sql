-- 短縮URLのカード（OGP）に出すタイトル（編成の3人の名前など）。作るときにページから送る。無ければ既定のタイトル
ALTER TABLE short ADD COLUMN title TEXT;
