// 徽章一覧のスクリーンショットから、徽章の枠を読み取る（テスト中）。
// 画像はブラウザの中だけで読む（サーバーには送らない）。文字の読み取りは Tesseract.js（最初の1回だけ部品をダウンロード）。
(function (S) {
  const TESS = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  let loading = null;
  const loadTess = () => loading || (loading = new Promise((ok, ng) => {
    if (window.Tesseract) return ok();
    const s = document.createElement("script"); s.src = TESS; s.onload = () => ok(); s.onerror = () => { loading = null; ng(new Error("読み取りの部品を読み込めませんでした（通信を確認してください）")); };
    document.head.appendChild(s);
  }));
  const EL = ["水", "火", "風", "地", "光", "闇"];
  // 画面の項目名 → 計算の項目（属性つきのものは属性を外してまとめる）
  const names = () => {
    const out = [];
    (window.EMBLEM_OPTIONS || []).forEach(o => {
      if (o.type === "potLv") return;
      if (o.key === "elemDmg") EL.forEach(e => out.push([e + "属性ダメージ", o]));
      else if (o.key === "resPen") EL.forEach(e => out.push([e + "属性耐性貫通", o]));
      else if (o.key === "critRate") out.push(["会心率", o]);
      else out.push([o.label.replace(/（.*?）/g, ""), o]);
    });
    return out;
  };
  const lev = (a, b) => {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  };
  // 同じ文字が同じ順に並んでいる数（最長共通部分列）
  const lcs = (a, b) => { const d = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0)); for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]); return d[a.length][b.length]; };
  // mix: 素質名用。崩れた文字が多いときも、合っている文字の数で近いものを選べるように、編集距離と共通の文字の割合を平均する
  const best = (s, cands, mix) => {
    let b = null, bs = 1e9, b2 = 1e9;
    cands.forEach(c => { const L = Math.max(c[0].length, 1), e = lev(s, c[0]) / L, sc = mix ? (e + 1 - lcs(s, c[0]) / L) / 2 : e; if (sc < bs) { b2 = bs; bs = sc; b = c; } else if (sc < b2) b2 = sc; });
    return { c: b, score: bs, gap: b2 - bs };
  };
  const fmtV = (o, v) => o.fmt === "pct" ? String(Math.round(v * 1000) / 10) : String(v);
  // 読んだ数字を、その項目の品質の段階に当てはめる（「129%」→ 12%、「13」→ +3 など）
  function snap(o, raw) {
    const ds = (String(raw).match(/[\d.]+/g) || []).join("");
    if (o.type === "skillLv" || o.type === "potLv") {
      const n = parseInt(ds.replace(/^1(?=[123]$)/, ""), 10);   // 「+」が「1」に読まれることがある
      return n === 1 ? { q: "gold" } : n === 2 ? { q: "rainbow2" } : n === 3 ? { q: "rainbow3" } : null;
    }
    const tiers = Object.entries(o.tiers).filter(([, v]) => v != null);
    const ex = tiers.find(([, v]) => fmtV(o, v) === ds);
    if (ex) return { q: ex[0] };
    const pre = tiers.filter(([, v]) => ds.indexOf(fmtV(o, v)) === 0).sort((a, b) => fmtV(o, b[1]).length - fmtV(o, a[1]).length)[0];
    return pre ? { q: pre[0], fixed: true } : null;
  }
  // 白い表の場所を探す（見つからなければ、PC版の画面の位置を使う）
  function findPanel(img) {
    const W = img.naturalWidth, H = img.naturalHeight, w = 240, h = Math.round(H * w / W);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
    const p = g.getImageData(0, 0, w, h).data, white = (x, y) => { const i = (y * w + x) * 4; return Math.min(p[i], p[i + 1], p[i + 2]) > 232; };
    const rows = []; for (let y = 0; y < h; y++) { let n = 0; for (let x = 0; x < w; x++) if (white(x, y)) n++; rows.push(n); }
    const ys = rows.map((n, y) => n > w * 0.25 ? y : -1).filter(y => y >= 0);
    if (ys.length < h * 0.3) return [0.29, 0.20, 0.71, 0.87];
    const y0 = ys[0], y1 = ys[ys.length - 1];
    const cols = []; for (let x = 0; x < w; x++) { let n = 0; for (let y = y0; y <= y1; y++) if (white(x, y)) n++; cols.push(n); }
    const xs = cols.map((n, x) => n > (y1 - y0) * 0.4 ? x : -1).filter(x => x >= 0);
    if (!xs.length) return [0.29, 0.20, 0.71, 0.87];
    return [xs[0] / w, y0 / h, (xs[xs.length - 1] + 1) / w, (y1 + 1) / h];
  }
  // 切り出して2倍に拡大し、白黒にする
  function prep(img, box) {
    const W = img.naturalWidth, H = img.naturalHeight, [x0, y0, x1, y1] = box, k = Math.max(1, Math.min(3, 1800 / ((x1 - x0) * W)));
    const c = document.createElement("canvas"); c.width = Math.round((x1 - x0) * W * k); c.height = Math.round((y1 - y0) * H * k);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, x0 * W, y0 * H, (x1 - x0) * W, (y1 - y0) * H, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) { const v = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2] < 150 ? 0 : 255; p[i] = p[i + 1] = p[i + 2] = v; }
    g.putImageData(d, 0, 0);
    return c;
  }
  // file: 画像のファイル（貼り付けた画像も）。pots: [[日本語名, 英語名, 項目のキー]]。返り値: 上から順の行 [{ k, q, t, label, warn }]
  S.ocrEmblem = async (file, pots, onMsg) => {
    onMsg && onMsg("読み取りの準備をしています…（初めてのときは少し時間がかかります）");
    await loadTess();
    const url = URL.createObjectURL(file);
    const img = await new Promise((ok, ng) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ng(new Error("画像を開けませんでした")); i.src = url; });
    const c = prep(img, findPanel(img));
    URL.revokeObjectURL(url);
    onMsg && onMsg("文字を読んでいます…");
    const w = await Tesseract.createWorker("jpn"), wn = await Tesseract.createWorker("eng");
    try {
      await w.setParameters({ preserve_interword_spaces: "1" });
      await wn.setParameters({ tessedit_char_whitelist: "0123456789.+%", tessedit_pageseg_mode: "6" });
      const r = await w.recognize(c);
      // 値の列だけを数字で読み直す
      const vx = Math.round(c.width * 0.72), vw = Math.round(c.width * 0.18), vc = document.createElement("canvas"); vc.width = vw; vc.height = c.height;
      vc.getContext("2d").drawImage(c, vx, 0, vw, c.height, 0, 0, vw, c.height);
      const vals = (await wn.recognize(vc)).data.lines.map(x => ({ t: x.text.trim(), y: (x.bbox.y0 + x.bbox.y1) / 2 }));
      const NM = names(), rows = [];
      r.data.lines.forEach(l => {
        const bb = l.bbox, cy = (bb.y0 + bb.y1) / 2, h = bb.y1 - bb.y0;
        const vm = vals.filter(x => Math.abs(x.y - cy) < h * 0.8).sort((a, b) => Math.abs(a.y - cy) - Math.abs(b.y - cy))[0];
        const t = l.text.replace(/[|｜]/g, " ").trim();
        const m = t.match(/^(.*?)\s{2,}(\S+)\s*$/) || t.match(/^(.*?)([+＋]?\d[\d.]*\S*)\s*$/);
        if (!m) return;
        const name = m[1].replace(/^[^ぁ-んァ-ン一-龠A-Za-z]+/, "").replace(/\s/g, ""), val = vm ? vm.t : m[2];
        if (/レベル$/.test(name) && !/上昇$/.test(name)) {   // 素質のレベル上昇（「○○レベル +3」）
          const b = best(name.replace(/レベル$/, ""), pots, true);
          // 素質名は下線つきの色文字で崩れやすい。一番近いものが2番目よりはっきり近ければ、崩れていても当てる（要確認）
          if (!b.c || (b.score > 0.5 && !(b.score <= 0.8 && b.gap >= 0.1))) { rows.push({ k: null, label: name, warn: true, nopot: true, read: t }); return; }   // 素質が見つからなくても、行の位置はずらさない
          const s = snap((window.EMBLEM_OPTIONS || []).find(x => x.key === b.c[2]), val);
          rows.push({ k: b.c[2], q: s && s.q, t: b.c[1], label: b.c[0] + "レベル", warn: !s || b.score > 0.3, read: t });
          return;
        }
        const b = best(name, NM);
        if (!b.c || b.score > 0.5) return;   // 表の行でない文字（見出し・背景）は捨てる
        const s = snap(b.c[1], val);
        rows.push({ k: b.c[1].key, q: s && s.q, label: b.c[0], warn: !s || b.score > 0.3, read: t });
      });
      return rows;
    } finally { await w.terminate(); await wn.terminate(); }
  };
})(window.SIM);
