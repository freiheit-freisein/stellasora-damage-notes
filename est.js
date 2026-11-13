// 一部の値（Lv1 など）から、ほかの Lv・突破の値を推定する（2026-11-13）。
// 推定した値は、ゲームの画面・確認ページで確かめた値が入れば、そちらに置き換える（推定は「足りないところを埋める」だけ）。
// 伸び方の根拠:
// - スキルの倍率: 英語Wikiの全巡遊者のスキルの数値は、Lv10 が Lv1 の約2.79倍になる型（A）と、約2.30倍の型（B）の2つだけ。
//   Lvごとの比は、読み込んだ TREKKERS から毎回求める（中央値）。どちらの型かは Lv2 の値で決まる（A は Lv2 が1.15倍、B は1.10倍）。
//   ゲームのスキル説明の「(xx%↑)」が次の Lv の値なので、Lv1 の画面1枚で決まる。Lv2 が分からなければ、多いほうの A とみる（type "A?"）
//   Lv10 の値しか分からないときは skillFrom10（Lv10 はそのまま、Lv1〜9 は A の型で推定）
// - 巡遊者の HP・攻撃力: Lv1〜90 の伸び方の形が全員ほぼ同じ（HP は0.3%以内）。Lv1 と Lv90 の2つから、形の中央値で間を埋める。
//   防御はLvで変わらない
// - ロスレコのコア効果（突破I〜VI）: 確かめた9件すべてで、1段ごとに突破Iの値の +20%（突破VI = 突破I の2倍）。
//   突破Iと突破VIの2つが分かれば、その間をまっすぐつなぐ。突破Iだけなら +20% ずつ
// - ロスレコのアシスト効果（Lv1〜5）: 「Lv1 の値 × Lv」か「基準 + 刻み × Lv」のどちらか（どちらもまっすぐ）。
//   Lv1 と Lv5 が分かれば、その間をまっすぐつなぐ（どちらの形でも合う）。Lv1 だけなら「Lv1 の値 × Lv」とみる（基準のある形だと外れる）
// - ロスレコの基礎攻撃力（★5）: 突破1つごとに +130（sim_lr.js の S.lrBaseAtk）
window.EST = (function () {
  const med = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return !n ? NaN : n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const r1 = x => Math.round(x * 10) / 10, r4 = x => Math.round(x * 10000) / 10000;

  // ---- スキルの倍率 ----
  let SK = null;
  function skillCurves() {
    if (SK) return SK;
    const G = { A: [], B: [] };
    (window.TREKKERS || []).forEach(t => (t.skills || []).slice(0, 4).forEach(s => {
      const n = s.nums || [];
      if (n.length < 10) return;
      (n[0] || []).forEach((x, j) => {
        const a = x && x[0];
        if (!a || a < 20) return;   // 小さい数（秒数など）は丸めの誤差が大きいので使わない
        const r = n.slice(0, 10).map(l => l && l[j] && l[j][0] / a);
        if (r.some(v => !v)) return;
        if (Math.abs(r[9] - 2.79) < 0.03) G.A.push(r); else if (Math.abs(r[9] - 2.30) < 0.02) G.B.push(r);
      });
    }));
    const curve = rs => rs.length ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => med(rs.map(r => r[k]))) : null;
    SK = { A: curve(G.A), B: curve(G.B), nA: G.A.length, nB: G.B.length };
    return SK;
  }
  // Lv1 の値（と、分かれば Lv2 の値）→ { v: Lv1〜10 の値, type: "A" | "B" | "A?" }
  function skill(v1, v2) {
    const c = skillCurves();
    if (!c.A || !c.B) return null;
    let type = "A?";
    if (v2) type = Math.abs(v2 / v1 - c.A[1]) <= Math.abs(v2 / v1 - c.B[1]) ? "A" : "B";
    const cv = type === "B" ? c.B : c.A;
    return { v: cv.map(r => r1(v1 * r)), type };
  }
  // Lv10 の値だけから（ゲームのスキル画面は育てたLvの値しか出ないとき）。型が分からないので、多いほうの A とみる。Lv10 はその値のまま
  function skillFrom10(v10, type) {
    const c = skillCurves(), cv = type === "B" ? c.B : c.A;
    if (!cv) return null;
    return { v: cv.map((r, k) => k === 9 ? v10 : r1(v10 / cv[9] * r)), type: type || "A?" };
  }
  // スキルの数値の一覧（ヒットごとの [Lv1, Lv2]）→ trekkers.js の nums の形（nums[Lv-1][ヒット] = [値]）
  function skillNums(pairs) {
    // { v10 } なら Lv10 の値から。{ v1, v2, v10 } のように画面で見た Lv があれば、その Lv はその値のまま（型は Lv1 と Lv2 から決める）
    const per = pairs.map(p => {
      if (!p || Array.isArray(p)) return skill(p[0], p[1]);
      const type = p.type || (p.v1 && p.v2 ? skill(p.v1, p.v2).type : undefined);
      const r = p.v10 != null ? skillFrom10(p.v10, type) : skill(p.v1, p.v2);
      if (r) { if (p.v1 != null) r.v[0] = p.v1; if (p.v2 != null) r.v[1] = p.v2; }
      return r;
    });
    if (per.some(x => !x)) return null;
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => per.map(p => [p.v[k]]));
  }

  // ---- 巡遊者の HP・攻撃力（Lv1〜90 の99段。10+ などの突破の段を含む） ----
  const SHAPE = {};
  function statShape(key) {
    if (SHAPE[key]) return SHAPE[key];
    const rows = (window.TREKKERS || []).map(t => t.stats && t.stats[key]).filter(a => a && a.length && a[0] && a[a.length - 1] > a[0]);
    if (!rows.length) return null;
    const n = rows[0].length;
    SHAPE[key] = [...Array(n)].map((_, i) => med(rows.filter(a => a.length === n).map(a => (a[i] - a[0]) / (a[n - 1] - a[0]))));
    return SHAPE[key];
  }
  function stat(key, v1, v90) {
    const sh = statShape(key);
    return sh ? sh.map(s => Math.round(v1 + (v90 - v1) * s)) : null;
  }

  // ---- ロスレコ: 分かっている段（1つ＝最初の段、2つ＝最初と最後の段）→ n 段 ----
  // kind: "core"（突破I〜VI）／"assist"（Lv1〜5）
  function steps(known, n, kind) {
    if (!known || !known.length || known.length >= n) return known;
    if (known.length === 2) { const a = known[0], b = known[1]; return [...Array(n)].map((_, i) => r4(a + (b - a) * i / (n - 1))); }
    if (known.length === 1) { const a = known[0]; return [...Array(n)].map((_, i) => r4(kind === "core" ? a * (1 + 0.2 * i) : a * (i + 1))); }
    return known;   // 3段以上で途中が欠けているものは、どの段か分からないので推定しない
  }
  // 分かっている段の番号（1〜n）。推定の段かどうかの判定に使う
  const knownLv = (len, n) => len >= n ? null : len === 2 ? [1, n] : len === 1 ? [1] : null;

  return { skill, skillFrom10, skillNums, skillCurves, stat, statShape, steps, knownLv };
})();
