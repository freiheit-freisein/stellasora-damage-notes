// ロスレコ（光チームの検証で使う分）のデータと、コア効果・アシスト効果の適用。
// アシスト効果: 音符のレベルで自動で解放（Lv1=base、Lv2以降は 15 ずつ増える）。値はゲーム画面の◀▶で確認したレベルごとの値。
// 「自身」とある効果は、主力（暁光・星願を受け取る巡遊者）に付くものとして扱う。
(function (S) {
  const L = window.LOSTRECORDS;
  const addRec = r => { if (!L.find(x => x.id === r.id)) L.push(r); };

  addRec({ id: "mirai", name: "未来導く明星", rarity: 5, element: "光", level: 90, levelMax: 90, stats: { baseAtk: 981, elemDmg: 0.15 }, core: { name: "未来導く明星", rank: "I" }, sub: { startNotes: [{ note: "光の音符", lv: 10 }, { note: "幸運の音符", lv: 4 }] } });
  addRec({ id: "negai", name: "願い星の願い", rarity: 5, element: "光", level: 90, levelMax: 90, stats: { baseHp: 6990, baseAtk: 1533 }, core: { name: "願い星の願い", rank: "VI" }, sub: { startNotes: [{ note: "器用の音符", lv: 7 }, { note: "光の音符", lv: 7 }] } });
  addRec({ id: "yuuzu", name: "夕涼み", rarity: 5, element: "光", level: 90, levelMax: 90, stats: { baseAtk: 1533, elemDmg: 0.12 }, core: { name: "夕涼み", rank: "VI" }, sub: { startNotes: [{ note: "爆発の音符", lv: 7 }, { note: "光の音符", lv: 7 }] } });
  // サブのロスレコ（星ノ塔の探索開始時に音符を獲得）。コア効果・アシスト効果は未登録（基礎攻撃・属性ダメージ・初期音符だけ反映）
  addRec({ id: "anaaki", name: "穴あきおサボり", rarity: 5, element: "光", level: 90, levelMax: 90, stats: { baseAtk: 1582, elemDmg: 0.15 }, core: { name: "穴あきおサボり", rank: "?" }, sub: { startNotes: [{ note: "光の音符", lv: 11 }, { note: "幸運の音符", lv: 3 }] } });
  addRec({ id: "kakegae", name: "かけがえのない時間", rarity: 5, element: "光", level: 90, levelMax: 90, stats: { baseAtk: 1533, elemDmg: 0.12 }, core: { name: "かけがえのない時間", rank: "?" }, sub: { startNotes: [{ note: "体力の音符", lv: 11 }, { note: "幸運の音符", lv: 3 }] } });
  addRec({ id: "nitamono", name: "似たもの同士", rarity: 5, element: "光", level: 90, levelMax: 90, stats: { baseAtk: 1533, elemDmg: 0.12 }, core: { name: "似たもの同士", rank: "?" }, sub: { startNotes: [{ note: "集中の音符", lv: 7 }, { note: "必殺の音符", lv: 7 }] } });
  // 音符の合計 = 探索で獲得した分（入力） + サブのロスレコの初期音符
  S.notesTotal = G => {
    const t = Object.assign({}, G.notes || {});
    (G.lrSub || []).filter(Boolean).forEach(id => {
      const r = L.find(x => x.id === id);
      ((r && r.sub && r.sub.startNotes) || []).forEach(n => { t[n.note] = (t[n.note] || 0) + n.lv; });
    });
    return t;
  };
  addRec({ id: "hakubo", name: "薄暮", rarity: 3, element: "なし", level: 1, levelMax: 10, stats: { baseHp: 50, baseAtk: 233 }, core: { name: "薄暮", rank: "VI" }, sub: { startNotes: [] } });
  addRec({ id: "nodoka", name: "長閑", rarity: 3, element: "なし", level: 1, levelMax: 10, stats: { baseHp: 50, baseAtk: 233 }, core: { name: "長閑", rank: "VI" }, sub: { startNotes: [] } });

  // 数を入力するもの（効果の回数・重複数）
  S.LR_COUNTS = [
    { key: "akatsuki", label: "暁光の数（主力）", max: 99 },
    { key: "seigan", label: "星願の数（主力）", max: 20 },
    { key: "yuuzu", label: "夕涼みの光属性ダメージの重複数（印の発動回数）", max: 5 },
    { key: "merchen", label: "メルヘンなサンセット：追加の重複数", max: 3 },
    { key: "kaisetsu", label: "回折の数", max: 6 },
    { key: "shinwa", label: "惹かれ合う星：親和力の数", max: 99, noMax: true },   // 上限はゲームで未確認なので「最大」は出さない
    // 以下も上限はゲームで未確認（Wikiに書かれていない）。共に航るの暗潮だけ、説明文に 1/2/3 とあるので最大3
    { key: "unmei", label: "運命カードの枚数", max: 99, noMax: true },
    { key: "gekiha", label: "レモネードと紅茶：4秒以内に撃破した数", max: 99, noMax: true },
    { key: "keika8", label: "一撃必中：戦闘開始から8秒たった回数", max: 99, noMax: true },
    { key: "gekiha10", label: "敵を10体撃破した回数", max: 99, noMax: true },
    { key: "bakuen", label: "ハナビ：爆炎の数", max: 99, noMax: true },
    { key: "yuuki", label: "迷いを断つ拳：勇気の数", max: 99, noMax: true },
    { key: "yuukiEnd", label: "迷いを断つ拳：終了した勇気の数", max: 99, noMax: true },
    { key: "keii", label: "ミルク色の夢：敬畏の数", max: 99, noMax: true },
    { key: "toufuu", label: "雪解け告げる黎明：凍風の数", max: 99, noMax: true },
    { key: "fuusen", label: "青空を越えて：ドキドキ風船の数", max: 99, noMax: true },
    { key: "shihen", label: "風に舞う想い：紙片のエールの数", max: 99, noMax: true },
    { key: "yozakura", label: "千変万花：夜桜の数", max: 99, noMax: true },
    { key: "kasumi", label: "夜宴に踊る影：花霞の数", max: 99, noMax: true },
    { key: "kouryuu", label: "似たもの同士：光粒の数", max: 99, noMax: true },
    { key: "tide", label: "揺らめく光の向こう側：タイドフリースの数", max: 99, noMax: true },
    { key: "ripple", label: "友との夏休み：リプルノートの数", max: 99, noMax: true },
    { key: "anchou", label: "共に航る：暗潮の数", max: 3 },
    { key: "bigwave", label: "サマーマーチ：ビッグウェーブの数", max: 99, noMax: true },
    { key: "hane", label: "飛びたて、籠の鳥：自由の羽の数", max: 99, noMax: true },
    { key: "eikou", label: "栄光の瞬間：栄光の数", max: 99, noMax: true },
  ];

  // e: { k, v(数 or Lv→数), to: main/sup/lux/all, n: 数の入力のキー, txt }。off=true は既定でオフの条件付き効果。
  S.LR_FX = {
    mirai: {
      core: [
        { id: "hp", txt: "チーム全員のHP +15%", e: [{ k: "hpPct", v: 0.15, to: "all" }] },
        { id: "taken", txt: "暁光が付いた敵への光属性のスキル被ダメージ +15%（5秒）", off: true, e: [{ k: "takenSkill", v: 0.15, to: "lux" }] },
        { id: "crit", txt: "光属性の主力が印を発動して光輝を出したとき、自身の会心率 +15%（8秒）", off: true, e: [{ k: "critRate", v: 0.15, to: "main" }] },
      ],
      assists: [
        { id: "akatsukiShine", name: "暁光の輝き", notes: ["器用の音符", "光の音符"], base: 10, items: [
          { id: "a", txt: lv => `暁光1ごとに、自身の光属性のスキルダメージと通常攻撃ダメージ +${7.5 * lv}%`, n: "akatsuki", e: [{ k: "Bs", v: lv => 0.075 * lv, to: "main" }, { k: "Bb", v: lv => 0.075 * lv, to: "main" }] },
          { id: "b", txt: lv => `暁光が付いた巡遊者が通常攻撃で当てたとき、その敵の光属性の通常攻撃被ダメージ +${5 + 5 * lv}%（5秒）`, off: true, e: [{ k: "takenBasic", v: lv => 0.05 + 0.05 * lv, to: "lux" }] },
        ] },
        { id: "hopeDawn", name: "希望の夜明け", notes: ["器用の音符", "幸運の音符", "光の音符"], base: 15, items: [
          { id: "a", txt: lv => `暁光1ごとに、光属性の主力のスキル会心ダメージ +${2 + lv}%`, n: "akatsuki", e: [{ k: "critDmgSkill", v: lv => 0.02 + 0.01 * lv, to: "main" }] },
          { id: "b", txt: lv => `チーム内の光属性がスキルを発動したとき、光属性の主力の会心ダメージ +${10 + 5 * lv}%（12秒）`, off: true, e: [{ k: "critDmg", v: lv => 0.10 + 0.05 * lv, to: "main" }] },
        ] },
      ],
    },
    negai: {
      core: [
        { id: "skill", txt: "星願1ごとに、光属性のスキルダメージ +1%（最大10）", n: "seigan", e: [{ k: "Bs", v: 0.01, to: "main", cap: 10 }] },
        { id: "elem", txt: "主力が星願を付与されているとき（星願1以上）、チーム全体の光属性ダメージ +10%", need: ["seigan", 1], e: [{ k: "W", v: 0.10, to: "lux" }] },
      ],
      assists: [
        { id: "kirameki", name: "暁光の煌めき", notes: ["体力の音符", "光の音符"], base: 10, items: [
          { id: "a", txt: lv => `星願1ごとに、自身の光属性の通常攻撃ダメージ +${Math.round(0.3 * lv * 10) / 10}%`, n: "seigan", e: [{ k: "Bb", v: lv => 0.003 * lv, to: "main" }] },
        ] },
        { id: "wishLight", name: "願いの光", notes: ["器用の音符", "体力の音符", "光の音符"], base: 15, items: [
          { id: "a", txt: lv => `星願が上限（20）のとき、自身の光属性ダメージ +${5 * lv}%`, need: ["seigan", 20], e: [{ k: "W", v: lv => 0.05 * lv, to: "main" }] },
        ] },
      ],
    },
    yuuzu: {
      core: [
        { id: "main", txt: "光属性の主力の通常攻撃ダメージとスキルダメージ +12%", e: [{ k: "Bb", v: 0.12, to: "main" }, { k: "Bs", v: 0.12, to: "main" }] },
        { id: "elem", txt: "光属性の主力の必殺技の持続中、チーム内が光属性の印を発動したとき、チーム全体の光属性ダメージ +6%（10秒・最大5重）", n: "yuuzu", e: [{ k: "W", v: 0.06, to: "lux" }] },
      ],
      assists: [
        { id: "merchen", name: "メルヘンなサンセット", notes: ["器用の音符", "光の音符"], base: 10, items: [
          { id: "a", txt: lv => `チーム内の光属性のスキルダメージ +${3 * lv}%`, e: [{ k: "Bs", v: lv => 0.03 * lv, to: "lux" }] },
          { id: "b", txt: lv => `スキル発動から10秒、追加で +${Math.round(1.5 * lv * 10) / 10}%（最大3重）`, n: "merchen", e: [{ k: "Bs", v: lv => 0.015 * lv, to: "lux" }] },
        ] },
        { id: "daynight", name: "昼と夜の交わる時間", notes: ["集中の音符", "必殺の音符", "光の音符"], base: 15, items: [
          { id: "a", txt: lv => `回折1つにつき、チーム内の光属性のスキルダメージ +${lv}%（10秒・回折は最大6）`, n: "kaisetsu", e: [{ k: "Bs", v: lv => 0.01 * lv, to: "lux" }] },
        ] },
      ],
    },
    hakubo: { core: [{ id: "skill", txt: "主力のスキルダメージ +20%", e: [{ k: "Bs", v: 0.20, to: "main" }] }], assists: [] },
    nodoka: { core: [{ id: "atk", txt: "支援の攻撃力 +14%", e: [{ k: "atkPct", v: 0.14, to: "sup" }] }], assists: [] },
  };

  // ---- 日本語Wikiから自動で作ったロスレコ（data/lr_auto.js）。ゲーム内では未確認なので、画面では名前に「*」を付ける ----
  // 手で入れたロスレコ（上）は、そのまま使う。手で入れたものに効果の表（LR_FX）がなければ、Wikiの効果だけ足す（autoFx）。
  // コア効果は突破（1〜6、既定1）、アシスト効果は音符で決まるLv（1〜5）の値を使う。重複できるものは最大の重複数。
  const autoFx = r => ({
    auto: true,
    core: r.core.map((it, i) => ({ id: "c" + i, auto: true, skip: it.skip, off: it.off, txt: lv => it.txt[Math.min(lv, it.txt.length) - 1], e: (it.e || []).map(e => Object.assign({}, e, { v: lv => e.v[Math.min(lv, e.v.length) - 1] * (e.stk || 1) })) })),
    assists: r.assists.map(a => ({ id: a.id, name: a.name, notes: a.notes, base: a.base, items: a.items.map((it, i) => ({ id: "i" + i, auto: true, skip: it.skip, off: it.off, txt: lv => it.txt[Math.min(lv, it.txt.length) - 1], e: (it.e || []).map(e => Object.assign({}, e, { v: lv => e.v[Math.min(lv, e.v.length) - 1] * (e.stk || 1) })) })) })),
  });
  (window.LR_AUTO || []).forEach(r => {
    const had = L.find(x => x.name === r.name);
    if (had) {
      if (!S.LR_FX[had.id]) { S.LR_FX[had.id] = autoFx(r); had.autoFx = true; }
      return;
    }
    addRec({ id: r.id, name: r.name, rarity: r.rarity, element: r.element, level: 90, levelMax: 90, stats: r.stats, core: { name: r.coreName, rank: "?" }, sub: { startNotes: r.sub }, auto: true });
    S.LR_FX[r.id] = autoFx(r);
  });
  // ゲームの画面で確かめた初期の音符（Wikiの値と違ったもの）。2026-11-12 惹かれ合う星: 器用 Lv10・幸運 Lv4（Lv90。画面のLv70では器用8。Wikiは 幸運10・器用4 と逆だった）
  [["w45", [{ note: "器用の音符", lv: 10 }, { note: "幸運の音符", lv: 4 }]]].forEach(([id, ns]) => { const r = L.find(x => x.id === id); if (r) r.sub = Object.assign({}, r.sub, { startNotes: ns }); });
  // Wikiにステータスやサブの初期の音符が無かったロスレコに、ゲームの画面で確かめた値を入れる（素質の確認ページ「ロスレコの確認」・2026-11-11）
  //   基礎攻撃力は突破VIの値（Wikiのロスレコは突破VIの値で持つ。突破I〜VIは +130 ずつ）、属性ダメージはそのロスレコの属性
  const GAME_ST = {
    "迷いを断つ拳": { baseAtk: 1533, elemDmg: 0.12 },
    "風に舞う想い": { baseAtk: 1533, elemDmg: 0.12 },
    "私と君の楽園": { baseAtk: 1631, elemDmg: 0.15, notes: ["地の音符", "器用の音符"] },
    "奇跡の創造": { baseAtk: 1533, elemDmg: 0.12, notes: ["必殺の音符", "集中の音符"] },
    "欲しかったもの": { baseAtk: 1631, elemDmg: 0.15, notes: ["器用の音符", "火の音符"] },
    "団らんのひととき": { baseAtk: 1533, elemDmg: 0.12, notes: ["必殺の音符", "集中の音符"] },
    "惹かれ合う星": { baseAtk: 1631, elemDmg: 0.15 },
  };
  Object.keys(GAME_ST).forEach(name => {
    const r = L.find(x => x.name === name), o = GAME_ST[name];
    if (!r) return;
    if (!(r.stats || {}).baseAtk) r.stats = Object.assign({}, r.stats, { baseAtk: o.baseAtk, elemDmg: o.elemDmg });
    if (o.notes && r.sub && r.sub.startNotes) r.sub.startNotes = r.sub.startNotes.map((x, i) => /〇〇/.test(x.note) ? Object.assign({}, x, { note: o.notes[i] }) : x);
  });
  // 惹かれ合う星（w45）: Wikiの取り込みで外れていた「親和力1につき」の2つを、親和力の数の入力で入れる（値はWikiの説明文のまま）
  (fx => {
    if (!fx) return;
    const pick = (arr, lv) => arr[Math.min(lv, arr.length) - 1];
    const c1 = fx.core[1], a0 = fx.assists.find(a => a.id === "a0"), i1 = a0 && a0.items[1];
    if (c1) Object.assign(c1, { skip: false, n: "shinwa", e: [{ k: "W", v: lv => pick([0.03, 0.03, 0.03, 0.03, 0.03, 0.06], lv), to: "main" }] });
    if (i1) Object.assign(i1, { skip: false, n: "shinwa", e: [{ k: "critDmg", v: lv => pick([0.02, 0.02, 0.02, 0.02, 0.04], lv), to: "main" }] });
  })(S.LR_FX.w45);

  // ---- Wikiの取り込みで外れていた効果を、名前と位置（c=コア、a0.1=アシストa0の2つ目）で入れる。値はWikiの説明文のまま（突破I〜VI／Lv1〜5の順） ----
  // n = 数の入力（重複数など）、off = 既定でオフの条件付き効果。why = 計算に入れない理由（info は火力に関係しない文）
  (() => {
    const P = (...a) => a.map(x => x / 100);
    const R6 = (a, b) => P(a, a, a, a, a, b);   // 突破I〜Vが同じ値、VIだけ違う（Wikiの表のまま）
    const at = (a, lv) => a[Math.min(lv, a.length) - 1];
    const itemOf = (name, path) => {
      const r = L.find(x => x.name === name), fx = r && S.LR_FX[r.id];
      if (!fx || !fx.auto) return null;
      if (path[0] === "c") return fx.core[+path.slice(1)];
      const [aid, i] = path.split("."), a = fx.assists.find(q => q.id === aid);
      return a && a.items[+i];
    };
    const FIX = (name, path, o) => {
      const it = itemOf(name, path);
      if (!it) return;
      Object.assign(it, o, { skip: false, e: o.e.map(e => { const a = e.v; return Object.assign({}, e, { v: lv => at(a, lv) }); }) });
    };
    // FIX に加えて、説明文の数字（最大の段の値）も段ごとの値に置き換える（ゲームの画面で確かめた値）
    const FIXV = (name, path, o) => {
      const it = itemOf(name, path);
      if (!it) return;
      const a = o.e[0].v, top = a.length, t0 = typeof it.txt === "function" ? it.txt(top) : it.txt;
      const f = x => String(Math.round(x * 1000) / 10) + "%";
      FIX(name, path, o);
      const re = new RegExp("(?<![0-9.])" + f(a[top - 1]).replace(".", "[.]"));
      if (re.test(t0)) it.txt = lv => t0.replace(re, f(at(a, lv)));
    };
    const WHY = (name, paths, why) => paths.forEach(p => { const it = itemOf(name, p); if (it) it.why = why; });
    const NA_SUMMON = "従者の与えるダメージは計算に未対応", NA_NONUM = "数値の書かれていない効果は計算に未対応", NA_ATKDOWN = "敵の攻撃力の低下は計算に未対応";

    // A. 条件なし
    FIX("寒煙", "c0", { e: [{ k: "Bu", to: "main", v: [0, 0, 0, 0, 0, 0.45] }], note: "Wikiに突破VIの値（45%）しかないため、突破I〜Vは0" });
    FIX("千変万花", "c0", { e: [{ k: "W", to: "el", el: "闇", v: R6(24, 40) }] });
    FIX("夜宴に踊る影", "c0", { e: [{ k: "W", to: "el", el: "闇", v: P(5, 6, 7, 8, 9, 10) }] });

    // B. 条件付き（既定でオフ）
    FIX("晴天の彩花", "a1.1", { off: true, e: [{ k: "Bs", to: "el", el: "水", v: P(4.8, 9.6, 14.4, 19.2, 24) }] });
    FIX("自由自在", "a1.0", { off: true, e: [{ k: "atkPct", to: "main", el: "火", v: P(3, 6, 9, 12, 15) }] });
    FIX("メメント×モリ", "c1", { off: true, e: [{ k: "Bs", to: "el", el: "地", v: R6(8.5, 8.5) }] });
    [["『空白』の序章", "風", P(7.5, 15, 22.5, 30, 37.5), "el"], ["清浄なる祈り", "光", P(10, 20, 30, 40, 50), "el"], ["昼下がりの雨", "水", P(4, 8, 12, 16, 20), "el"],
     ["見据える先に", "闇", P(6, 12, 18, 24, 30), "el"], ["白紙の航海図", "火", P(11, 22, 33, 44, 55), "main"], ["甘く咲く時間", "地", P(10, 20, 30, 40, 50), "el"]].forEach(([nm, el, v, to]) => {
      FIX(nm, "a0.0", { off: true, e: [{ k: "W", to: "el", el, v: P(5, 10, 15, 20, 25) }] });   // シールド獲得から12秒
      FIX(nm, "a1.0", { off: true, e: nm === "見据える先に" ? [{ k: "Bs", to, el, v }, { k: "Bu", to, el, v }] : [{ k: "Bs", to, el, v }] });
    });
    FIX("友と囲む新春の灯火", "c1", { off: true, e: [{ k: "Bu", to: "el", el: "地", v: P(20, 24, 28, 32, 36, 40) }] });
    FIX("ジングルラール", "a1.0", { off: true, e: [{ k: "Bu", to: "el", el: "火", v: P(12, 24, 36, 48, 60) }] });
    FIX("明日へと続く物語", "c2", { off: true, e: [{ k: "takenSkill", to: "el", el: "水", v: P(12, 14.4, 16.8, 19.2, 21.6, 24) }, { k: "takenMark", to: "el", el: "水", v: P(12, 14.4, 16.8, 19.2, 21.6, 24) }] });
    ["アッシュ・アイ:火", "おやすみ:光", "憩いのひと時:風", "蒼梧城の休日:水", "星空に夜露死苦:闇", "騎士様の鍛冶師:地"].forEach(s => {
      const [nm, el] = s.split(":");
      FIX(nm, "c1", { off: true, e: [{ k: "Bs", to: "el", el, v: P(8, 9.6, 11.2, 12.8, 14.4, 16) }] });   // 主力のHPが80%超
    });

    // C. 数（重複数など）を入れて使うもの
    [["レモネードと紅茶", "風"], ["一撃必中", "火"], ["かけがえのない時間", "光"], ["一期一会", "水"], ["真夜中の鈴", "闇"], ["虹を描こう", "地"]].forEach(([nm, el]) =>
      FIX(nm, "c1", { n: "unmei", e: [{ k: "W", to: "el", el, v: R6(2, 2) }] }));
    FIX("レモネードと紅茶", "a1.0", { n: "gekiha", e: [{ k: "atkPct", to: "el", el: "風", v: P(0.6, 1.2, 1.8, 2.4, 3) }] });
    FIX("一撃必中", "a1.1", { n: "keika8", e: [{ k: "atkPct", to: "el", el: "火", v: P(1.36, 1.36, 1.36, 1.36, 1.36) }] });
    FIX("一期一会", "a1.1", { n: "gekiha10", e: [{ k: "Bb", to: "el", el: "水", v: P(1.8, 1.8, 1.8, 1.8, 1.8) }, { k: "Bs", to: "el", el: "水", v: P(1.8, 1.8, 1.8, 1.8, 1.8) }] });
    FIX("虹を描こう", "a1.1", { n: "gekiha10", e: [{ k: "Bs", to: "el", el: "地", v: P(1.8, 1.8, 1.8, 1.8, 1.8) }, { k: "Bu", to: "el", el: "地", v: P(1.8, 1.8, 1.8, 1.8, 1.8) }] });
    FIX("ハナビ", "c2", { n: "bakuen", e: [{ k: "Bb", to: "main", el: "火", v: P(7, 8.4, 9.8, 11.2, 12.6, 14) }] });
    FIX("ハナビ", "a1.0", { n: "bakuen", e: [{ k: "Bs", to: "main", el: "火", v: P(1.5, 3, 4.5, 6, 7.5) }] });
    FIX("迷いを断つ拳", "c1", { n: "yuuki", e: [{ k: "Bu", to: "main", el: "火", v: P(4, 4.8, 5.6, 6.4, 7.2, 8) }] });
    FIX("迷いを断つ拳", "a1.0", { n: "yuukiEnd", e: [{ k: "Bb", to: "main", el: "火", v: P(1.5, 3, 4.5, 6, 7.5) }] });   // 防御力の上昇は火力に関係しない
    FIX("ミルク色の夢", "a1.1", { n: "keii", e: [{ k: "Bs", to: "main", el: "闇", v: P(5, 7.5, 10, 12.5, 15) }] });
    FIX("雪解け告げる黎明", "a0.1", { n: "toufuu", e: [{ k: "atkPct", to: "main", el: "風", v: P(0.5, 1, 1.5, 2, 2.5) }] });
    FIX("雪解け告げる黎明", "a1.0", { n: "toufuu", e: [{ k: "W", to: "main", el: "風", v: P(1, 1.5, 2, 2.5, 3) }] });
    FIX("青空を越えて", "a0.1", { n: "fuusen", e: [{ k: "critDmg", to: "main", el: "水", v: P(0.8, 1, 1.2, 1.4, 1.6) }] });
    FIX("青空を越えて", "a1.0", { n: "fuusen", e: [{ k: "Bs", to: "el", el: "水", v: P(0.4, 0.8, 1.2, 1.6, 2) }] });
    FIX("風に舞う想い", "a0.1", { n: "shihen", e: [{ k: "Bb", to: "main", el: "水", v: P(0.4, 0.6, 0.8, 1, 1.2) }] });
    FIX("風に舞う想い", "a1.0", { n: "shihen", e: [{ k: "Bu", to: "main", el: "水", v: P(0.7, 1.4, 2.1, 2.8, 3.5) }] });
    FIX("千変万花", "a0.1", { n: "yozakura", e: [{ k: "takenUlt", to: "el", el: "闇", v: P(0.6, 0.7, 0.8, 0.9, 1) }] });
    FIX("夜宴に踊る影", "a0.1", { n: "kasumi", e: [{ k: "Bs", to: "main", el: "闇", v: P(0.4, 0.5, 0.6, 0.7, 0.8) }, { k: "Bu", to: "main", el: "闇", v: P(0.4, 0.5, 0.6, 0.7, 0.8) }] });
    FIX("似たもの同士", "a0.1", { n: "kouryuu", e: [{ k: "Bs", to: "main", v: P(0.4, 0.8, 1.2, 1.6, 2) }] });
    FIX("揺らめく光の向こう側", "a1.0", { n: "tide", e: [{ k: "W", to: "el", el: "水", v: P(2, 2, 2, 2, 10) }] });
    FIX("揺らめく光の向こう側", "a1.1", { n: "tide", e: [{ k: "atkPct", to: "role:サポーター", el: "水", v: P(2, 2, 2, 2, 10) }] });
    FIX("友との夏休み", "c0", { n: "ripple", e: [{ k: "W", to: "el", el: "水", v: R6(2.5, 5) }] });
    FIX("友との夏休み", "a0.1", { n: "ripple", e: [{ k: "W", to: "el", el: "水", v: P(1, 1, 1, 1, 5) }] });
    FIX("共に航る", "c1", { n: "anchou", e: [{ k: "takenBasic", to: "el", el: "闇", v: R6(5, 10) }] });
    FIX("共に航る", "c2", { n: "anchou", e: [{ k: "takenUlt", to: "el", el: "闇", v: R6(3, 6) }] });
    FIX("共に航る", "a0.1", { n: "anchou", e: [{ k: "Bu", to: "main", el: "闇", v: P(4, 8, 12, 16, 20) }] });
    FIX("サマーマーチ", "a1.0", { n: "bigwave", e: [{ k: "atkPct", to: "main", el: "闇", v: P(2.4, 4.8, 7.2, 9.6, 12) }] });
    FIX("飛びたて、籠の鳥", "a0.1", { n: "hane", e: [{ k: "critDmgSkill", to: "main", v: P(1.5, 2, 2.5, 3, 3.5) }] });
    FIX("栄光の瞬間", "a0.1", { n: "eikou", e: [{ k: "Bs", to: "main", el: "風", v: P(0.1, 0.2, 0.3, 0.4, 0.5) }] });

    // E. ゲームの画面で確かめた値（素質の確認ページ「ロスレコの確認」で採用・2026-11-11）。突破I〜VI・Lv1〜5で1段ずつ伸びる（Wikiの「I〜Vが同じ」ではない）
    FIXV("惹かれ合う星", "c1", { n: "shinwa", e: [{ k: "W", to: "main", v: P(3, 3.6, 4.2, 4.8, 5.4, 6) }] });
    FIXV("惹かれ合う星", "c3", { e: [{ k: "takenBasic", to: "el", el: "光", v: P(10, 12, 14, 16, 18, 20) }] });
    FIXV("惹かれ合う星", "a0.0", { e: [{ k: "W", to: "el", el: "光", v: P(4, 8, 12, 16, 20) }] });
    FIXV("惹かれ合う星", "a0.1", { n: "shinwa", e: [{ k: "critDmg", to: "main", v: P(2, 2.5, 3, 3.5, 4) }] });
    FIXV("惹かれ合う星", "a1.0", { e: [{ k: "critDmgUlt", to: "main", v: P(15, 20, 25, 30, 35) }] });   // 必殺技の会心ダメージだけ（前はすべての攻撃に入れていた）
    FIXV("惹かれ合う星", "a1.1", { e: [{ k: "critDmgSkill", to: "main", v: P(15, 20, 25, 30, 35) }] });
    FIXV("似たもの同士", "c1", { n: "kouryuu", e: [{ k: "atkPct", to: "main", v: P(1, 1.2, 1.4, 1.6, 1.8, 2) }] });
    FIXV("似たもの同士", "c2", { e: [{ k: "Bb", to: "main", el: "光", v: P(6, 7.2, 8.4, 9.6, 10.8, 12) }] });
    FIXV("かけがえのない時間", "c0", { e: [{ k: "W", to: "el", el: "光", v: P(5, 8, 11, 14, 17, 20) }] });
    FIXV("穴あきおサボり", "a1.0", { e: [{ k: "W", to: "el", el: "光", v: P(1, 2, 3, 4, 5) }] });

    // D. 計算に未対応（理由を出す）
    WHY("魔女の秘薬", ["a0.1", "a1.2"], NA_SUMMON);
    WHY("ジングルラール", ["c1", "a0.1"], NA_SUMMON);
    WHY("ミルク色の夢", ["c2", "c3"], NA_SUMMON);
    WHY("革命の萌芽", ["c0", "c1", "a0.0", "a1.1"], NA_SUMMON);
    WHY("鹿の声", ["c1"], NA_NONUM);
    WHY("メリーサプライズ", ["c1", "c2"], NA_NONUM);
    WHY("メリーサプライズ", ["a1.0"], NA_ATKDOWN);
    WHY("千変万花", ["a1.0"], NA_NONUM);
    WHY("惹かれ合う星", ["c2"], NA_NONUM);
    WHY("明日へと続く物語", ["a0.1"], NA_NONUM);
    // 火力に関係しない文（被ダメージの減少・シールド・SP・重複を得る条件の説明）
    L.forEach(r => {
      const fx = S.LR_FX[r.id];
      if (!fx || !fx.auto) return;
      [...fx.core, ...fx.assists.flatMap(a => a.items)].forEach(it => {
        if (!it.skip || it.why) return;
        const t = it.txt(6) || "";
        if (/被ダメージが[\d.]+%減少|シールドを|SPを|獲得する$|付与する$|リセットされる$|追加効果を得る$|^チーム内の水属性巡遊者のスキルダメージを与えた時/.test(t)) it.why = "info";
      });
    });
  })();

  // 音符のレベルから、アシストの発動Lv（0=未発動）を決める。Lv n の条件は 全ての音符が base + 15×(n−1) 以上
  S.lrAssistLv = (notes, a) => {
    for (let n = 5; n >= 1; n--) {
      const need = a.base + 15 * (n - 1);
      if (a.notes.every(k => ((notes || {})[k] || 0) >= need)) return n;
    }
    return 0;
  };

  // 突破（凸 1〜6）。自動のロスレコは、Wikiの突破ごとの値（既定1）。
  // 手で入れたロスレコは、画面で確かめた突破（データの core.rank）の値を基準に、Wikiと同じ「突破1つごとに 突破1の値の+20%」で伸ばす
  // （突破6 = 突破1の2倍。未来導く明星・願い星の願い・夕涼みのWikiの値と一致）。基礎攻撃力は上の S.lrBaseAtk
  const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
  // 画面の表記（ゲーム内と同じローマ数字）。データは 1〜6 のまま
  S.lrRoman = n => ["", "I", "II", "III", "IV", "V", "VI"][n] || String(n);
  const rankMul = n => 1 + 0.2 * (n - 1);
  // 基礎攻撃力は、★5なら突破1つごとに +130（突破I = 突破VIの値 − 650）。ゲームの画面で確認: 桜花爛漫・未来導く明星（I 981／Wiki最大 1631）、
  // 揺らめく光の向こう側（II 1111）、白日の花園（III 1192／最大 1582）、見据える先に（II 1013／最大 1533）、レモネードと紅茶（I 883／最大 1533）、伝説のアラシ（II 1062／最大 1582）、
  // 古池の水音（III 1241／最大 1631）、晴天の彩花（III 1192／最大 1582）、栄光の瞬間・虹を描こう（VI 1533）。どれも Lv90。2026-11-06
  // 自動（Wiki）のロスレコの値は突破VI（Lv90）。手で入れたものは、画面で確かめた突破（core.rank）の値。突破が分からないものは突破VIの値とみる。
  // 基礎HP・属性ダメージなど、ほかのステータスは突破で変わらない（ゲームの画面では上の段＝基礎攻撃力だけが変わる）
  const ATK_STEP = 130;
  S.lrAtkScalable = r => !!(r && r.rarity === 5 && (r.stats || {}).baseAtk);
  // 突破（1〜6）。保存した値 → 画面で確かめた突破 → 自動は I・手入力で突破が分からないものは VI
  S.lrRankNow = (G, rid) => {
    const r = L.find(x => x.id === rid), v = +((G.lrRank || {})[rid]);
    if (v >= 1 && v <= 6) return v;
    const r0 = ROMAN[(r && r.core && r.core.rank) || ""];
    return r0 || (r && r.auto ? 1 : 6);
  };
  S.lrAtkMax = r => {
    const a = (r.stats || {}).baseAtk || 0, r0 = ROMAN[(r.core && r.core.rank) || ""];
    return r.auto || !r0 ? a : a + ATK_STEP * (6 - r0);
  };
  S.lrBaseAtk = (G, rid) => {
    const r = L.find(x => x.id === rid);
    if (!r) return 0;
    if (!S.lrAtkScalable(r)) return (r.stats || {}).baseAtk || 0;
    return S.lrAtkMax(r) - ATK_STEP * (6 - S.lrRankNow(G, rid));
  };

  // 突破を選べないロスレコの表記。メインは、コア効果を計算している突破（画面で確かめた突破）で固定。サブ（★4以下）は基礎ステータスが突破で変わらない
  // ★5でもステータスが入っていないもの（Wikiに無い）は、突破で何が変わるか分からないので「ステータス未登録」
  S.lrFixedTxt = (G, rid, arr) => {
    const r = L.find(x => x.id === rid);
    if (r && r.rarity >= 5 && !(r.stats || {}).baseAtk) return "ステータス未登録";
    return arr === "lrMain" && S.LR_FX[rid] ? `突破${S.lrRoman(S.lrRankOf(G, rid).rank)}で固定` : "突破で変わらない";
  };
  S.lrRankOf = (G, rid) => {
    const fx = S.LR_FX[rid], r = L.find(x => x.id === rid);
    const v = +((G.lrRank || {})[rid]);
    if (!fx) return { rank: 1, scale: 1, can: false };
    // 突破を選んでいないときは、突破の欄・基礎攻撃力と同じ突破（S.lrRankNow）にそろえる
    if (fx.auto) return { rank: v >= 1 && v <= 6 ? v : S.lrRankNow(G, rid), scale: 1, can: true };
    const r0 = ROMAN[(r && r.core && r.core.rank) || ""];
    if (!r0 || !r || r.rarity < 5) return { rank: r0 || 1, scale: 1, can: false };   // 星3など、突破ごとの値が分からないもの
    const rank = v >= 1 && v <= 6 ? v : r0;
    return { rank, r0, scale: rankMul(rank) / rankMul(r0), can: true };
  };

  // 効果を集計して、各巡遊者の集計(out)へ足す。呼び出し元: sim_pots.js の collect
  S.lrCollect = function (G, team, chs, out) {
    const mains = (G.lrMain || []).filter(Boolean);
    const on = G.lrOn || {}, N = G.lrN || {};
    const luxIds = team.filter((id, i) => chs[i].el === "光");
    // 受け取る味方。e.el があれば、その属性の味方だけ（「X属性の主力」は、主力がX属性のときだけ）
    const recv = e => {
      const to = e.to, el = e.el, ok = i => !el || chs[i].el === el;
      if (to === "main") return ok(0) ? [team[0]] : [];
      if (to === "sup") return team.filter((id, i) => i > 0 && ok(i));
      if (to === "lux") return luxIds;
      if (to === "el") return team.filter((id, i) => ok(i));
      if (to && to.indexOf("role:") === 0) return team.filter((id, i) => chs[i].role === to.slice(5) && ok(i));
      return team.filter((id, i) => ok(i));
    };
    const put = (e, v, rid) => {
      const a = out[rid];
      if (!a || !v) return;
      if (e.k === "critRate" || e.k === "critDmg") a.mods.push({ k: e.k, v, tags: null, ht: null, cond: null });
      else if (e.k === "critDmgSkill") a.mods.push({ k: "critDmg", v, tags: null, ht: "skill", cond: null });
      else if (e.k === "critDmgUlt") a.mods.push({ k: "critDmg", v, tags: null, ht: "ult", cond: null });
      else if (e.k === "takenSkill") a.takenSkill *= 1 + v;
      else if (e.k === "takenBasic") a.takenBasic = (a.takenBasic || 1) * (1 + v);
      else if (e.k === "takenUlt") a.takenUlt = (a.takenUlt || 1) * (1 + v);
      else if (e.k === "takenMark") a.takenMark = (a.takenMark || 1) * (1 + v);
      else if (e.k === "taken") { a.takenAdd += v; a.taken = 1 + a.takenAdd; }
      else if (e.k === "mark") a.markAdd += v;
      else if (a[e.k] != null) a[e.k] += v;
    };
    const apply = (key, item, lv, mul) => {
      if (item.skip) return;
      const isOn = on[key] == null ? !item.off : on[key];
      if (!isOn) return;
      if (item.need && (+N[item.need[0]] || 0) < item.need[1]) return;
      const cnt = item.n ? Math.max(0, +N[item.n] || 0) : 1;
      item.e.forEach(e => {
        let v = (typeof e.v === "function" ? e.v(lv) : e.v) * (mul || 1);
        const c = e.cap != null ? Math.min(cnt, e.cap) : cnt;
        v *= c;
        recv(e).forEach(rid => put(e, v, rid));
      });
    };
    mains.forEach(rid => {
      const fx = S.LR_FX[rid];
      if (!fx) return;
      const rk = S.lrRankOf(G, rid);
      fx.core.forEach(it => apply(rid + ":c:" + it.id, it, rk.rank, rk.scale));
      fx.assists.forEach(a => {
        const dec = (G._lrAssistDec || {})[rid + ":" + a.id] || 0;   // ビルド検証で、Lvを下げて比べるとき
        const lv = Math.min(5, Math.max(0, S.lrAssistLv(S.notesTotal(G), a) - dec));   // 上げて比べるときは dec が負
        if (!lv) return;
        a.items.forEach(it => apply(rid + ":" + a.id + ":" + it.id, it, lv));
      });
    });
  };
  // ---- スキルのバフ効果（Wikiの説明文のうち、他のキャラ・自身の火力に関わるもの。値はスキルLvで変わる）----
  // skill: main=主力スキル／support=支援スキル／ult=必殺技、idx=skills の番号、n=nums の番号。
  // 主力のときは 主力スキル・必殺技、支援のときは 支援スキル だけが使える。
  S.SKILL_FX = {
    noya: [
      { id: "ult", skill: "ult", idx: 3, n: 4, k: "critRate", to: "main", txt: v => `必殺技の発動時、自身の会心率 +${v}%（30秒）` },
    ],
    // ナズナの主力スキル: ペンギンのダメージから5秒、敵の地属性被ダメージ（Lv10 +129%）。被ダメージは素質・心相と足し算（実測）
    nazuna: [
      { id: "main", skill: "main", idx: 1, n: 1, k: "taken", to: "lux", nodict: true, txt: v => `ぬいぐるみペンギンがダメージを与えてから5秒、敵の地属性被ダメージ +${v}%` },
    ],
    tilia: [
      { id: "main", skill: "main", idx: 1, n: 1, k: "atkPct", to: "all", off: true, txt: v => `防御姿勢が終わったときの反撃のあと、チーム全員の攻撃力 +${v}%（10秒）` },
      { id: "support", skill: "support", idx: 2, n: 1, k: "atkPct", to: "all", off: true, txt: v => `盾がダメージを与えると、チーム全員の攻撃力 +${v}%（10秒）` },
    ],
  };
  // エリー: 主力スキルの愛のしるし（1つにつき自身の水属性ダメージ +3.3%・最大3。母の愛で5まで）、必殺技1段目「一掃」のおしおきモード（自身の攻撃力、15秒）
  S.SKILL_FX.allie = [
    { id: "love", skill: "main", idx: 1, n: 2, k: "W", to: "self", mul: 3, nodict: true, txt: v => `愛のしるし3つ：自身の水属性ダメージ +${Math.round(v * 3 * 10) / 10}%（1つ +${v}%。母の愛で増える4・5つ目は素質の側で足す）` },
    { id: "ult", skill: "ult", idx: 3, n: 1, k: "atkPct", to: "self", nodict: true, txt: v => `一掃のおしおきモード：自身の攻撃力 +${v}%（15秒）` },
  ];
  S.SKILL_NAME = { basic: "通常攻撃", main: "主力スキル", support: "支援スキル", ult: "必殺技" };

  S.skillCollect = function (G, team, chs, out) {
    team.forEach((id, i) => {
      const list = S.SKILL_FX[id];
      if (!list) return;
      const c = chs[i], cs = G.chars[id], isMain = i === 0;
      const lvB = S.emblemExtra(cs.emb, cs.embOn).lv;
      const luxIds = team.filter((x, j) => chs[j].el === c.el);   // 「同じ属性の全員」
      list.forEach(fx => {
        const usable = isMain ? (fx.skill === "main" || fx.skill === "ult") : fx.skill === "support";
        if (!usable) return;
        const key = id + ":" + fx.id;
        const on = (G.skOn || {})[key] == null ? !fx.off : G.skOn[key];
        if (!on) return;
        const lv = (((cs.skillLv || {})[fx.skill]) || 10) + (lvB[fx.skill] || 0);
        const v = S.engine.skillVal(c, fx.idx, fx.n, lv) / 100 * (fx.mul || 1);
        const rec = fx.to === "main" ? [team[0]] : fx.to === "self" ? [id] : fx.to === "lux" ? luxIds : team.slice();
        rec.forEach(rid => {
          const a = out[rid];
          if (!a) return;
          if (fx.k === "critRate") a.mods.push({ k: "critRate", v, tags: null, ht: null, cond: null });
          else if (fx.k === "taken") { a.takenAdd += v; a.taken = 1 + a.takenAdd; }
          else if (a[fx.k] != null) a[fx.k] += v;
        });
      });
    });
  };
})(window.SIM);
