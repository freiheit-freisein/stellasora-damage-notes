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
    let b = null, bs = 1e9;
    cands.forEach(c => { const L = Math.max(c[0].length, 1), e = lev(s, c[0]) / L, sc = mix ? (e + 1 - lcs(s, c[0]) / L) / 2 : e; if (sc < bs) { bs = sc; b = c; } });
    return { c: b, score: bs };
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
  // 切り出して拡大し、白黒にする。mode（読み比べ用）: bin 明るさ150で分ける（既定）／gray 灰色のまま／color 色の濃い画素も文字にする／sauvola 場所ごとに境を変える
  function prep(img, box, mode) {
    const W = img.naturalWidth, H = img.naturalHeight, [x0, y0, x1, y1] = box, k = Math.max(1, Math.min(3, 1800 / ((x1 - x0) * W)));
    const c = document.createElement("canvas"); c.width = Math.round((x1 - x0) * W * k); c.height = Math.round((y1 - y0) * H * k);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, x0 * W, y0 * H, (x1 - x0) * W, (y1 - y0) * H, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    const W2 = c.width, H2 = c.height, Y = new Float32Array(W2 * H2);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) Y[j] = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
    let out;
    if (mode === "gray") out = j => Y[j];
    else if (mode === "color") out = j => { const i = j * 4, sat = Math.max(p[i], p[i + 1], p[i + 2]) - Math.min(p[i], p[i + 1], p[i + 2]); return Y[j] < 150 || sat > 60 ? 0 : 255; };
    else if (mode === "sauvola") {
      // 積分画像で、まわりの平均と散らばりから境を決める（Sauvola: T = m × (1 + k × (s / 128 − 1))）
      const I = new Float64Array((W2 + 1) * (H2 + 1)), I2 = new Float64Array((W2 + 1) * (H2 + 1)), r = Math.max(8, Math.round(W2 / 90)), k = 0.2;
      for (let y = 0; y < H2; y++) { let a = 0, b = 0; for (let x = 0; x < W2; x++) { const v = Y[y * W2 + x]; a += v; b += v * v; const q = (y + 1) * (W2 + 1) + x + 1; I[q] = I[q - W2 - 1] + a; I2[q] = I2[q - W2 - 1] + b; } }
      out = j => { const x = j % W2, y = (j - x) / W2, x0 = Math.max(0, x - r), y0 = Math.max(0, y - r), x1 = Math.min(W2, x + r + 1), y1 = Math.min(H2, y + r + 1), n = (x1 - x0) * (y1 - y0);
        const A = (T, a, b) => T[b * (W2 + 1) + a], sm = A(I, x1, y1) - A(I, x0, y1) - A(I, x1, y0) + A(I, x0, y0), sq = A(I2, x1, y1) - A(I2, x0, y1) - A(I2, x1, y0) + A(I2, x0, y0);
        const m = sm / n, sd = Math.sqrt(Math.max(0, sq / n - m * m)); return Y[j] < m * (1 + k * (sd / 128 - 1)) ? 0 : 255; };
    } else out = j => Y[j] < 150 ? 0 : 255;
    for (let i = 0, j = 0; i < p.length; i += 4, j++) { const v = out(j); p[i] = p[i + 1] = p[i + 2] = v; }
    g.putImageData(d, 0, 0);
    return c;
  }
  // file: 画像のファイル（貼り付けた画像も）。pots: [[日本語名, 英語名, 項目のキー]]。返り値: 上から順の行 [{ k, q, t, label, warn }]
  // opt（読み比べ用。ふだんは渡さない）: { pre: prep の mode, potRe: 素質名を読み直す画像の mode（既定 gray、"" で読み直さない）, psm: 名前を読むときの区切り方, dpi }
  S.ocrEmblem = async (file, pots, onMsg, opt) => {
    opt = opt || {};
    onMsg && onMsg("読み取りの準備をしています…（初めてのときは少し時間がかかります）");
    await loadTess();
    const url = URL.createObjectURL(file);
    const img = await new Promise((ok, ng) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ng(new Error("画像を開けませんでした")); i.src = url; });
    const box = findPanel(img), c = prep(img, box, opt.pre), potRe = opt.potRe != null ? opt.potRe : "gray", cg = potRe ? prep(img, box, potRe) : null;
    URL.revokeObjectURL(url);
    onMsg && onMsg("文字を読んでいます…");
    const w = await Tesseract.createWorker("jpn"), wn = await Tesseract.createWorker("eng");
    try {
      await w.setParameters(Object.assign({ preserve_interword_spaces: "1" }, opt.psm ? { tessedit_pageseg_mode: String(opt.psm) } : {}, opt.dpi ? { user_defined_dpi: String(opt.dpi) } : {}));
      await wn.setParameters({ tessedit_char_whitelist: "0123456789.+%", tessedit_pageseg_mode: "6" });
      const r = await w.recognize(c);
      // 値の列だけを数字で読み直す
      const vx = Math.round(c.width * 0.72), vw = Math.round(c.width * 0.18), vc = document.createElement("canvas"); vc.width = vw; vc.height = c.height;
      vc.getContext("2d").drawImage(c, vx, 0, vw, c.height, 0, 0, vw, c.height);
      const vals = (await wn.recognize(vc)).data.lines.map(x => ({ t: x.text.trim(), y: (x.bbox.y0 + x.bbox.y1) / 2 }));
      const NM = names(), rows = [];
      // 素質名の読み直し: 下線つきの色文字は白黒にすると崩れやすいので、その行の名前の所だけを灰色のまま切り出して読み、近いほうを使う
      // 左の端は、項目名の列の始まり（どの行も項目名は同じ位置から始まる）。ほかの行の白黒で読んだ最初の文字の位置の真ん中の値を使う。
      // 素質の行の文字そのものは使わない（解像度が低いと、色文字の素質名が白黒で消えて「レベル」だけが読まれ、そこから切ってしまうため）
      const firstX = l => { const wd = (l.words || []).find(x => /[ぁ-んァ-ン一-龠]/.test(x.text)); return wd ? wd.bbox.x0 : null; };
      const xs = r.data.lines.filter(l => !/レベル\s*\S*\s*$/.test(l.text) || /上昇/.test(l.text)).map(firstX).filter(x => x != null).sort((a, b) => a - b);
      const colX = xs.length ? xs[xs.length >> 1] : null;
      const reread = async (bb, words) => {
        const wd = (words || []).find(x => /[ぁ-んァ-ン一-龠]/.test(x.text)), pad = Math.round((bb.y1 - bb.y0) * 0.35);
        const x0 = Math.max(0, (colX != null ? colX : wd ? wd.bbox.x0 : bb.x0) - pad), x1 = Math.round(c.width * 0.72), y0 = Math.max(0, bb.y0 - pad), y1 = Math.min(c.height, bb.y1 + pad);
        const rc = document.createElement("canvas"); rc.width = x1 - x0; rc.height = y1 - y0; rc.getContext("2d").drawImage(cg, x0, y0, rc.width, rc.height, 0, 0, rc.width, rc.height);
        return (await w.recognize(rc)).data.text.replace(/\s/g, "").replace(/^[^ぁ-んァ-ン一-龠]+/, "").replace(/^(主力|支援|汎用)?素質/, "");
      };
      const re = {};
      if (cg) for (const l of r.data.lines) if (/レベル\s*\S*\s*$/.test(l.text) && !/上昇/.test(l.text)) re[l.bbox.y0] = await reread(l.bbox, l.words);
      r.data.lines.forEach(l => {
        const bb = l.bbox, cy = (bb.y0 + bb.y1) / 2, h = bb.y1 - bb.y0;
        const vm = vals.filter(x => Math.abs(x.y - cy) < h * 0.8).sort((a, b) => Math.abs(a.y - cy) - Math.abs(b.y - cy))[0];
        const t = l.text.replace(/[|｜]/g, " ").trim();
        const m = t.match(/^(.*?)\s{2,}(\S+)\s*$/) || t.match(/^(.*?)([+＋]?\d[\d.]*\S*)\s*$/);
        if (!m) return;
        const name = m[1].replace(/^[^ぁ-んァ-ン一-龠A-Za-z]+/, "").replace(/\s/g, ""), val = vm ? vm.t : m[2];
        if (/レベル$/.test(name) && !/上昇$/.test(name)) {   // 素質のレベル上昇（「○○レベル +3」）
          let b = best(name.replace(/レベル$/, ""), pots, true), nm2 = re[l.bbox.y0];
          if (nm2) { const b2 = best(nm2.replace(/レベル.*$/, ""), pots, true); if (b2.score < b.score) b = Object.assign(b2, { re: nm2 }); }
          // 1文字だけ違う（足りない・多い・違う）ものは、部分一致として当てる
          const d = b.c ? lev((b.re || name).replace(/レベル.*$/, ""), b.c[0]) : 99;
          // 当てるのは、1文字違いまでか、近さ0.5以下のときだけ（ゆるく当てると、別の巡遊者の画面で似た名前の素質に当たってしまう）
          if (!b.c || (d > 1 && b.score > 0.5)) { rows.push({ k: null, label: name, warn: true, nopot: true, read: t, name: b.re || name, score: b.score }); return; }   // 素質が見つからなくても、行の位置はずらさない
          const s = snap((window.EMBLEM_OPTIONS || []).find(x => x.key === b.c[2]), val);
          rows.push({ k: b.c[2], q: s && s.q, t: b.c[1], label: b.c[0] + "レベル", part: d === 1, warn: !s || (d > 1 && b.score > 0.3), read: t, name: b.re || name, score: b.score });
          return;
        }
        const b = best(name, NM);
        if (!b.c || b.score > 0.5) return;   // 表の行でない文字（見出し・背景）は捨てる
        const s = snap(b.c[1], val);
        rows.push({ k: b.c[1].key, q: s && s.q, label: b.c[0], warn: !s || b.score > 0.3, read: t, name, score: b.score });
      });
      return rows;
    } finally { await w.terminate(); await wn.terminate(); }
  };


  // ==== 記録の画面（記録 →「記録詳細」）のスクリーンショット: ロスレコスキル画面・素質収集画面 ====
  // 解像度や切り取り範囲が違っても読めるように、決まった座標は使わず、画面の中の白い枠（素質カードの名前の帯・アシスト効果の枠）を見つけて、
  // その大きさから縮尺（ゲームの画面 1920x1080 での大きさとの比）を決める。ほかの部分の位置は、その枠からの相対で決める
  // 下の数字（px）は、どれも 1920x1080 の画面（2026-11-21 のユーザーのスクショ）で測った値
  const EL_HUE = { 火: 0, 地: 26, 光: 42, 風: 90, 水: 200, 闇: 315 };
  // 地 26・光 42 はロスレコスキル画面で測った値。水・火・風・闇は、ロスレコの詳細画面の音符アイコン（2026-11-21 ユーザーのスクショ）の見た目から決めた値
  //   （闇はピンク寄りの赤紫、風は黄緑。ステータスの音符の体力〈緑〉・必殺〈ピンク〉とは並び順で分けるので重ならない）
  const hueOf = (P, x, y, s) => {
    const hs = [];
    for (let yy = Math.max(0, y - s); yy < Math.min(P.H, y + s); yy++) for (let xx = Math.max(0, x - s); xx < Math.min(P.W, x + s); xx++) {
      const i = (yy * P.W + xx) * 4, r = P.D[i], g = P.D[i + 1], b = P.D[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      if (mx - mn < 80 || mx < 120) continue;
      const h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
      hs.push((h * 60 + 360) % 360);
    }
    hs.sort((a, b) => a - b);
    return hs.length > 10 ? hs[hs.length >> 1] : null;
  };
  const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
  // 名前の候補を、行の文字の中から近い順に探す（空白を除いた文字で、同じ長さの区間ごとに編集距離を見る）
  const normA = t => t.replace(/[!！]/g, "！").replace(/[?？]/g, "？").replace(/[・･]/g, "・").replace(/[〜~～]/g, "～");
  const findIn = (line, name) => {
    let bestD = 99;
    for (let L = Math.max(1, name.length - 1); L <= name.length + 1; L++)
      for (let i = 0; i + L <= line.length; i++) bestD = Math.min(bestD, lev(line.slice(i, i + L), name));
    return bestD;
  };
  const loadImg = async file => {
    const url = URL.createObjectURL(file);
    try { return await new Promise((ok, ng) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ng(new Error("画像を開けませんでした")); i.src = url; }); }
    finally { URL.revokeObjectURL(url); }
  };
  const pixels = img => {
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    return { img, W: c.width, H: c.height, D: g.getImageData(0, 0, c.width, c.height).data };
  };
  // 白い画素（RGB すべて thr より上）が続く区間を、行ごとに集める: [{ x, e, y }]
  // gap: これ以下の白くない切れ目（文字の線など）はつないで1つの区間にする
  const whiteRuns = (P, thr, minL, gap) => {
    const out = [], step = P.H > 1500 ? 2 : 1, isW = j => P.D[j] > thr && P.D[j + 1] > thr && P.D[j + 2] > thr;
    gap = gap || 0;
    for (let y = 0; y < P.H; y += step) {
      let x = 0;
      while (x < P.W) {
        const i = (y * P.W + x) * 4;
        if (!(P.D[i] > thr && P.D[i + 1] > thr && P.D[i + 2] > thr)) { x++; continue; }
        let e = x + 1;
        for (;;) {
          while (e < P.W && isW((y * P.W + e) * 4)) e++;
          let f = e; while (f < P.W && f - e <= gap && !isW((y * P.W + f) * 4)) f++;
          if (gap && f < P.W && f - e <= gap && f > e) { e = f; continue; }
          break;
        }
        if (e - x >= minL) out.push({ x, e, y });
        x = e;
      }
    }
    return out;
  };
  // 切り出して、高さが h 画素ほどになるよう拡大し、黒い文字の白黒にする。座標は画像の画素
  // mode: dark＝暗い文字（明るさ140で分ける）、light＝明るい文字（200で分けて入れ替える）、otsu＝大津の方法で分け、明るい文字なら入れ替える
  const cropBW = (img, x0, y0, x1, y1, h, mode) => {
    x0 = Math.max(0, Math.round(x0)); y0 = Math.max(0, Math.round(y0)); x1 = Math.min(img.naturalWidth, Math.round(x1)); y1 = Math.min(img.naturalHeight, Math.round(y1));
    if (x1 - x0 < 2 || y1 - y0 < 2) return null;
    const s = Math.max(1, h / (y1 - y0));
    const c = document.createElement("canvas"); c.width = Math.round((x1 - x0) * s); c.height = Math.round((y1 - y0) * s);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, x0, y0, x1 - x0, y1 - y0, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data, Y = new Uint8Array(p.length / 4), hist = new Array(256).fill(0);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) { Y[j] = Math.round(0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]); hist[Y[j]]++; }
    let th = mode === "light" ? 200 : 140;
    if (mode === "otsu") { let sum = 0; const n = Y.length; for (let i = 0; i < 256; i++) sum += i * hist[i]; let sB = 0, wB = 0, best = -1; for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = n - wB; if (!wF) break; sB += i * hist[i]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; th = i; } } }
    let dark = 0; for (let j = 0; j < Y.length; j++) if (Y[j] <= th) dark++;
    const inv = mode === "light" || (mode === "otsu" && dark > Y.length / 2);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) { let v = Y[j] <= th ? 0 : 255; if (inv) v = 255 - v; p[i] = p[i + 1] = p[i + 2] = v; }
    g.putImageData(d, 0, 0);
    return { c, s, x0, y0 };
  };

  // ---- 素質収集画面: 素質のカードを見つける ----
  // カード（1920x1080 で幅 158・高さ 205、横の間隔 177.5）の下に、名前の白い帯（高さ 約40）がある。左上の白い札に紺色の数字でLv（コア素質は数字なし）
  // 白い区間の幅でいちばん多いものを、カードの幅とみる
  const findCards = P => {
    const runs = whiteRuns(P, 228, Math.max(20, Math.round(P.W * 0.03)), Math.max(2, Math.round(P.W * 0.004)));
    if (!runs.length) return { cards: [], s: 0 };
    const bins = {};
    runs.forEach(r => { const b = Math.round((r.e - r.x) / 4); bins[b] = (bins[b] || 0) + 1; });
    // 幅 bb（4画素ごと）の白い区間を、カードの名前の帯とみたときのカード
    const build = bb => {
      const near = runs.filter(r => Math.abs((r.e - r.x) / 4 - bb) <= 1.5);
      const cw = near.reduce((a, r) => a + (r.e - r.x), 0) / near.length, s = cw / 158;
      const groups = [];
      near.sort((a, b) => a.y - b.y).forEach(r => {
        const g = groups.find(g => Math.abs(g.x - r.x) < cw * 0.08 && r.y - g.y1 <= Math.max(3, 30 * s));   // 文字の行で白が途切れても、帯の上と下の余白をつなぐ
        if (g) { g.y1 = r.y; g.e = Math.max(g.e, r.e); } else groups.push({ x: r.x, e: r.e, y0: r.y, y1: r.y });
      });
      // 帯の高さ: 紫のカードは絵の白い部分が帯のすぐ上まで来て、帯の上の余白が取れないことがあるので、下の余白だけ（約12）でもよい
      //   絵の白い部分とつながって縦に長くなったものは、下の端（帯の下の端）だけを使う
      //   高さの上限 80（紫のカードで下の行とつながっても 約60）。これより高いものはアイコンなどの白い部分
      const cs = groups.filter(g => g.y1 - g.y0 >= 9 * s && g.y1 - g.y0 <= 80 * s).map(g => ({ x: g.x, e: g.e, y0: g.y0, y1: g.y1 }));
      // カードは横に 177.5 間隔で並ぶ。同じ行で、間隔の整数倍の所にほかのカードがあるものだけを残す（ボタンやアイコンの白い部分を捨てる）
      //   1枚だけの行（2行目の1枚など）は、上の行のカードと同じ列にあれば残す
      const pitch = 177.5 * s, onGrid = (c, d, z) => { const k = Math.abs(d.x - c.x) / pitch; return (z || k > 0.5) && Math.abs(k - Math.round(k)) < 0.08; };
      let cards = cs.filter(c => cs.some(d => d !== c && Math.abs(d.y1 - c.y1) < 10 * s && onGrid(c, d)));
      //   1枚だけの行（2行目の1枚など）は、ほかの行のカードと同じ並び（間隔の整数倍の位置）にあれば残す（真上がコア素質で白い帯がないこともある）
      //   位置は、見つかったカードの左の端から2列左（コア素質の分）〜右の端まで
      const mnx = Math.min(...cards.map(c => c.x)), mxx = Math.max(...cards.map(c => c.x));
      cards = cards.concat(cs.filter(c => cards.indexOf(c) < 0 && c.x >= mnx - 2.1 * pitch && c.x <= mxx + 0.1 * pitch && cards.some(d => Math.abs(d.y1 - c.y1) > 150 * s && onGrid(c, d, true))));
      return { cards, s };
    };
    // 白い区間の幅の候補（多い順に8つ）ごとに試し、カードとしていちばんよく並ぶ幅を使う（小さい画面では、アイコンの白い部分のほうが多いことがある）
    const cand = Object.keys(bins).map(Number).sort((a, b) => bins[b] - bins[a]).slice(0, 8);
    let res = { cards: [], s: 0 };
    //   比べ方は 枚数×縮尺²（カードの面積の合計に比例）。小さいアイコンの白い部分は、枚数は多くても面積が小さい（幅856の切り取りで、正しい幅108は7枚、アイコンの幅36は25枚）
    const score = r => r.cards.length >= 2 ? r.cards.length * r.s * r.s : 0;
    cand.forEach(bb => { const r = build(bb); if (score(r) > score(res)) res = r; });
    const { cards, s } = res;
    // 帯の下の端は、同じ行のカードの真ん中の値にそろえる（紫のカードは、下の行のカードの白い上端とつながって、下にずれることがある）
    cards.forEach(c => { const ys = cards.filter(d => Math.abs(d.y1 - c.y1) < 25 * s).map(d => d.y1).sort((a, b) => a - b); c.y1m = ys[ys.length >> 1]; });
    // 帯の上の端は、文字が入るように下の端から 40 上にそろえる
    cards.forEach(c => { c.y1 = c.y1m; c.y0 = c.y1 - 40 * s; c.top = c.y1 - 205 * s; delete c.y1m; });
    return { cards, s };
  };
  // 画面の種類: 素質のカードが2枚以上あれば素質収集、なければロスレコスキル
  S._ocrDbg = { findCards: f => findCards(f), pixels: i => pixels(i), whiteRuns: (P, t, m) => whiteRuns(P, t, m) };   // 読み比べ用
  S.recScreen = async file => { const P = pixels(await loadImg(file)); return { kind: findCards(P).cards.length >= 2 ? "pot" : "rec" }; };

  // ---- 素質収集画面から、素質とLvを読む ----
  // どの巡遊者の段かは、段の見出しの巡遊者名で決める（撮るときは、巡遊者名とカードが映っていることが条件・2026-11-22 ユーザー）。見出しが読めないときだけ、素質名がどの巡遊者の素質に当たるかで決める
  // 巡遊者の絵は使わない（ゲームの素材なので・2026-11-22 ユーザー）。スクロールして何枚かに分けて撮ったものをまとめて読む
  // 見出しの右の数字（例: 34、32+4）は、その巡遊者の素質Lvの合計（コアは1）と徽章の分。カードの数字は徽章の分も入った値（ナズナ 32+4 でカードの合計 36）
  // cands: [{ slot, jp, pots: [{ ja, key, core }] }]。返り値: { got: { slot: { key: { lv, ja, core, warn } } }, sums: { slot: { base, emb } }, miss: [読めなかった名前] }
  // 読み取りの部品（日本語・数字）は、1回作ったら使い回す（作るのに数秒かかるため。素質・ロスレコの読み取りで共用。徽章の読み取りは別に作る）
  let WK = null;
  const workers = () => WK || (WK = (async () => ({ w: await Tesseract.createWorker("jpn"), wn: await Tesseract.createWorker("eng") }))().catch(e => { WK = null; throw e; }));
  // 読んだ文字と素質名の、全角・半角の記号のゆれをそろえる（！？：（）など）
  const normJ = t => t.replace(/[!！]/g, "！").replace(/[?？]/g, "？").replace(/[:：]/g, "：").replace(/[(（]/g, "（").replace(/[)）]/g, "）").replace(/[・･]/g, "・");
  // only: 読む巡遊者（slot）。指定したら、その巡遊者の段だけを読み、ほかの段は飛ばす（素質の画面は1人ずつなので速くなる）
  S.ocrPotentials = async (files, cands, onMsg, only) => {
    onMsg && onMsg("読み取りの準備をしています…（初めてのときは少し時間がかかります）");
    await loadTess();
    const { w, wn } = await workers();
    const got = {}, sums = {}, miss = [], POOL = [];
    cands.forEach(c => c.pots.forEach(p => POOL.push([normJ(p.ja), c.slot, p])));
    try {
      // 読める文字を、編成の3人の素質名と巡遊者名に出てくる文字だけにしぼる（読み違いが減る）
      const chars = [...new Set(POOL.map(x => x[0]).concat(cands.map(c => normJ(c.jp))).join(""))].join("");
      await w.setParameters({ tessedit_pageseg_mode: "7", tessedit_char_whitelist: chars });
      await wn.setParameters({ tessedit_char_whitelist: "0123456789+", tessedit_pageseg_mode: "7" });
      let fi = 0;
      for (const file of files) {
        fi++;
        onMsg && onMsg(`文字を読んでいます…（${fi}/${files.length} 枚目）`);
        const img = await loadImg(file), P = pixels(img), { cards, s } = findCards(P);
        // 段に分ける: カードの上端が近いものを1行、行の間が 1920x1080 で 240 より開いたら次の巡遊者の段（行の間隔は 221、段の間は見出しの分だけ広い）
        const rowsY = [];
        cards.slice().sort((a, b) => a.top - b.top).forEach(c => { const r = rowsY.find(r => Math.abs(r.top - c.top) < 20 * s); if (r) r.cards.push(c); else rowsY.push({ top: c.top, cards: [c] }); });
        const secs = [];
        rowsY.forEach(r => { const last = secs[secs.length - 1]; if (last && r.top - last.rows[last.rows.length - 1].top <= 240 * s) last.rows.push(r); else secs.push({ rows: [r] }); });
        for (const sec of secs) {
          // コア素質（1行目の左の2枚）は名前の帯が白くないので見つからない。1行目の左に、カードの間隔（177.5）で2枚分の位置を足して読む
          const r0 = sec.rows[0], rx = Math.min(...r0.cards.map(c => c.x)), ry1 = r0.cards[0].y1, virt = [];
          for (let k = 1; k <= 2 && r0.cards.length + virt.length < 6; k++) { const x = rx - k * 177.5 * s; if (x >= -5 * s) virt.push({ x, e: x + 158 * s, y0: ry1 - 40 * s, y1: ry1, top: ry1 - 205 * s, virt: true }); }
          const T = r0.top, all = virt.concat(...sec.rows.map(r => r.cards)), x0 = Math.min(...all.map(c => c.x));
          // 見出しの巡遊者名: カードの左端から 120 左〜420 右、カードの上端から 28〜64 上（白い文字）
          let slot = null;
          if (T - 64 * s >= 0) {
            const hv = cropBW(img, x0 - 120 * s, T - 64 * s, x0 + 420 * s, T - 28 * s, 60, "light");
            const hn = hv ? (await w.recognize(hv.c)).data.text.replace(/[\s|｜]/g, "") : "";
            const hb = hn ? best(normJ(hn.replace(/^[^ぁ-んァ-ン一-龠]+/, "")), cands.map(c => [normJ(c.jp), c.slot])) : {};
            if (hb.c && hb.score <= 0.4) slot = hb.c[1];
            sec.head = hn;
          }
          // 素質名を読む（巡遊者が決まっていれば、その巡遊者の素質の中から当てる）
          const readName = async (c, h, mode) => { const cv = cropBW(img, c.x + 2 * s, c.y0 - 2 * s, c.e - 2 * s, c.y1 + 3 * s, h, mode); return cv ? normJ((await w.recognize(cv.c)).data.text.replace(/\s/g, "")) : ""; };
          const poolOf = sl => sl ? POOL.filter(x => x[1] === sl) : POOL;
          const hits = (nm, sl) => { const b = best(nm, poolOf(sl), true); return b.c && (lev(nm, b.c[0]) <= Math.max(1, Math.floor(b.c[0].length * 0.3)) || b.score <= 0.4) ? b : null; };
          const first = new Map();   // 先に読んだ名前（同じカードを2回読まない）
          if (!slot) {   // 見出しが読めないときは、白い帯のカードを3枚まで読み、素質名がいちばん多く当たる巡遊者
            const vote = {};
            for (const c of all.filter(c => !c.virt).slice(0, 3)) {
              const nm = await readName(c, 70, "dark"); first.set(c, nm);
              const b = best(nm, POOL, true); if (b.c && b.score <= 0.35) vote[b.c[1]] = (vote[b.c[1]] || 0) + 1;
            }
            slot = Object.keys(vote).sort((a, b) => vote[b] - vote[a])[0] || null;
          }
          if (only && slot && slot !== only) continue;   // ほかの巡遊者の段は読まない
          const reads = [];
          for (const c of all) {
            let nm = first.has(c) ? first.get(c) : await readName(c, 70, "dark");
            // 当たらないとき（解像度が低い画面など）は、大きくして大津の方法で読み直し、当たるほうを使う
            if (!hits(nm, slot)) { const nm2 = await readName(c, 110, "otsu"); if (hits(nm2, slot)) nm = nm2; }
            if (/[ぁ-んァ-ン一-龠]/.test(nm)) reads.push({ c, nm });
          }
          if (!slot) { reads.forEach(r => miss.push(r.nm)); continue; }
          const pool = POOL.filter(x => x[1] === slot), o = (got[slot] = got[slot] || {});
          for (const r of reads) {
            const b = best(r.nm, pool, true);
            const ok = !!b.c && (lev(r.nm, b.c[0]) <= Math.max(1, Math.floor(b.c[0].length * 0.3)) || b.score <= 0.4);
            if (!ok) { if (!r.c.virt) miss.push(r.nm); continue; }   // 足した位置（コアの枠）で当たらないものは、カードがないとみて黙って捨てる
            const [ja, , p] = b.c;
            let lv = p.core ? 1 : null;
            if (!p.core && r.c.top >= -2 * s) {
              // Lvの数字（1文字）は読みがゆれるので、読めないときは白黒の分け方・大きさを変えて読み直す
              for (const [h, mode] of [[80, "otsu"], [120, "dark"], [60, "otsu"]]) {
                const lc = cropBW(img, r.c.x + 10 * s, r.c.top + 2 * s, r.c.x + 48 * s, r.c.top + 30 * s, h, mode);
                const t = lc ? (await wn.recognize(lc.c)).data.text.replace(/\D/g, "") : "";
                lv = t.length === 1 && +t >= 1 ? +t : null;
                if (lv != null) break;
              }
            }
            if (!o[p.key] || o[p.key].lv == null) o[p.key] = { ja, core: p.core, lv, warn: !p.core && lv == null };
          }
          // 見出しの数字（素質Lvの合計+徽章の分）: カードの上端から 26〜62 上、6列目のカードの右寄り（列の左から 70〜160）
          const cx = x0 + 5 * 177.5 * s;
          if (!sums[slot] && T - 62 * s >= 0 && cx + 158 * s <= P.W + 2) {
            const cv = cropBW(img, cx + 82 * s, T - 62 * s, cx + 160 * s, T - 26 * s, 60, "light");
            const t = cv ? (await wn.recognize(cv.c)).data.text.replace(/\s/g, "") : "";
            const m = t.match(/^(\d+)(?:\+(\d+))?/);
            if (m) sums[slot] = { base: +m[1], emb: m[2] ? +m[2] : 0 };
          }
        }
      }
      return { got, sums, miss };
    } catch (e) { WK = null; throw e; }
  };

  // ---- ロスレコスキル画面から、音符の数とメインのロスレコを読む ----
  // アシスト効果の枠が 2列×3段 に並ぶ（1920x1080 で、左の枠の左端から右の枠の右端まで 1176）。同じ行に、同じ幅の明るい区間が2つ並ぶところを探す
  // そこから: 音符の数字は 枠の上端から 58〜103 上・左端から 168〜998、アイコンの真ん中は 枠の上端から 136 上
  // 音符: 左から ステータスの7つ（S.NOTE_BASE の順）、そのあとに属性の音符。属性はアイコンの色（色相）で決める（幸運と地は色が近いので、並び順で分ける）
  // メインのロスレコ: アシスト効果の名前から引く（名前はロスレコごとに違う）。1行がロスレコ1枚（左右がそのロスレコのアシスト2つ）
  const findAssist = P => {
    const runs = whiteRuns(P, 200, Math.max(60, Math.round(P.W * 0.08))), byY = {};
    runs.forEach(r => { (byY[r.y] = byY[r.y] || []).push(r); });
    const rows = [];
    Object.keys(byY).forEach(y => {
      const rs = byY[y];
      for (let i = 0; i + 1 < rs.length; i++) {
        const a = rs[i], b = rs[i + 1], la = a.e - a.x, lb = b.e - b.x;
        if (Math.abs(la - lb) < Math.max(la, lb) * 0.06 && b.x - a.e < la * 0.1) rows.push({ y: +y, x0: a.x, x1: b.e });
      }
    });
    if (rows.length < 5) return null;
    const xs0 = rows.map(r => r.x0).sort((a, b) => a - b), xs1 = rows.map(r => r.x1).sort((a, b) => a - b);
    const x0 = xs0[xs0.length >> 1], x1 = xs1[xs1.length >> 1], tol = Math.max(4, (x1 - x0) * 0.01);
    const ok = rows.filter(r => Math.abs(r.x0 - x0) < tol && Math.abs(r.x1 - x1) < tol);
    // 下の端は、未発動のアシスト（灰色の枠）で見つからないことがあるので、上の端から3段ぶん（1920x1080 で 375）とする
    const y0 = Math.min(...ok.map(r => r.y)), sc = (x1 - x0) / 1176;
    return { x0, x1, y0, y1: Math.min(P.H, y0 + 375 * sc), s: sc };
  };
  S.ocrRecord = async (file, onMsg) => {
    onMsg && onMsg("読み取りの準備をしています…（初めてのときは少し時間がかかります）");
    await loadTess();
    const img = await loadImg(file), P = pixels(img), A = findAssist(P);
    if (!A) throw new Error("アシスト効果の枠が見つかりませんでした。ロスレコスキル画面を、音符とアシスト効果が全部入るように撮ってください");
    const s = A.s;
    onMsg && onMsg("文字を読んでいます…");
    const { w, wn } = await workers();
    try {
      await wn.setParameters({ tessedit_char_whitelist: "0123456789", tessedit_pageseg_mode: "7" });
      const nc = cropBW(img, A.x0 + 168 * s, A.y0 - 103 * s, A.x0 + 998 * s, A.y0 - 58 * s, 90, "light");
      const nums = nc ? (await wn.recognize(nc.c)).data.words.filter(x => /^\d+$/.test(x.text)).map(x => ({ n: +x.text, x: nc.x0 + (x.bbox.x0 + x.bbox.x1) / 2 / nc.s })) : [];
      const notes = [], warn = [];
      nums.forEach((o, i) => {
        if (i < S.NOTE_BASE.length) { notes.push({ note: S.NOTE_BASE[i], n: o.n }); return; }
        const h = hueOf(P, Math.round(o.x), Math.round(A.y0 - 136 * s), Math.max(3, Math.round(22 * s)));
        const e = h == null ? null : Object.keys(EL_HUE).sort((a, b) => hueDist(h, EL_HUE[a]) - hueDist(h, EL_HUE[b]))[0];
        notes.push({ note: e ? e + "の音符" : null, n: o.n, hue: h, elem: true });
      });
      if (nums.length < S.NOTE_BASE.length) warn.push(`音符の数が ${nums.length} 個しか読めませんでした（ステータスの音符だけで7個あるはずです）`);
      // アシスト効果の名前: 枠を1つずつ切り出して1行として読む（3段まとめて読むと、行を読み落とすことがあった・2026-11-22）
      //   1920x1080 で、段の間隔 119、右の列は左の列から 596 右。名前は枠の上から 12〜60・左から 100〜560
      const AS = [];
      LOSTRECORDS.forEach(x => ((S.LR_FX[x.id] || {}).assists || []).forEach(a => a.name && AS.push([normA(a.name), x.id, a.name])));
      // 読める文字を、アシスト名に出てくる文字だけにしぼる（読み違いが減る。部品は共用なので毎回決め直す）
      await w.setParameters({ tessedit_pageseg_mode: "7", tessedit_char_whitelist: [...new Set(AS.map(x => x[0]).join(""))].join("") });
      // 読んだ文字と、ロスレコごとの近さ（0〜1、小さいほど近い）。アシスト名との 編集距離 ÷ 名前の長さ（文字の一部に含まれる形でも見る）
      const nearOf = t => { const o = {}; if (!t) return o; AS.forEach(([nm, id, raw]) => { const d = Math.min(lev(t, nm), findIn(t, nm)) / nm.length; if (o[id] == null || d < o[id].d) o[id] = { d, nm: raw }; }); return o; };
      const okD = 0.3;
      // メインのロスレコは必ず3枚（ないと出発できない）で、同じものは2枚入らない（2026-11-22 ユーザー）。なので、段は必ず3つ読み、ロスレコは重ならないように決める
      const rowsR = [];
      for (let row = 0; row < 3; row++) {
        const ry = A.y0 + row * 119 * s, got = [];
        for (const cx of [0, 596]) {
          const x = A.x0 + cx * s;
          let t = "", near = {};
          if (ry + 60 * s <= P.H + 2) for (const [h, mode] of [[60, "dark"], [90, "otsu"]]) {
            const cv = cropBW(img, x + 100 * s, ry + 12 * s, x + 560 * s, ry + 60 * s, h, mode);
            t = cv ? normA((await w.recognize(cv.c)).data.text.replace(/\s/g, "")) : "";
            near = nearOf(t);
            if (Object.values(near).some(o => o.d <= okD)) break;
          }
          got.push({ t, near });
          if (Object.values(near).some(o => o.d === 0)) break;   // 名前がぴったり合ったら、右の枠は読まない（速くするため）
        }
        // 段ごとに、左右の名前のうち近いほうを、そのロスレコの近さとする
        const near = {};
        got.forEach(g => Object.keys(g.near).forEach(id => { if (!near[id] || g.near[id].d < near[id].d) near[id] = g.near[id]; }));
        rowsR.push({ got, near });
      }
      // 近い組から順に決める（同じロスレコは1段だけ）
      const pairs = [];
      rowsR.forEach((r, i) => Object.keys(r.near).forEach(id => { if (r.near[id].d <= okD) pairs.push({ i, id, d: r.near[id].d }); }));
      pairs.sort((a, b) => a.d - b.d);
      const pick = [null, null, null], used = new Set();
      pairs.forEach(p => { if (pick[p.i] == null && !used.has(p.id)) { pick[p.i] = p; used.add(p.id); } });
      const lrs = rowsR.map((r, i) => {
        const p = pick[i], read = r.got.map(g => g.t).join(" / ");
        if (!p) return { id: null, read };
        const names = r.got.map(g => g.near[p.id]).filter(o => o && o.d <= okD).map(o => o.nm);
        return { id: p.id, names, read, other: p.d > 0.15 };   // 少し離れているもの（2文字ほど違う）は「要確認」
      });
      return { notes, lrs, warn };
    } catch (e) { WK = null; throw e; }
  };
})(window.SIM);
