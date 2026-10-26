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

  // 数を入力するもの（効果の回数・重なり）
  S.LR_COUNTS = [
    { key: "akatsuki", label: "暁光の数（主力）", max: 99 },
    { key: "seigan", label: "星願の数（主力）", max: 20 },
    { key: "yuuzu", label: "夕涼みの光属性ダメージの重なり（印の発動回数）", max: 5 },
    { key: "merchen", label: "メルヘンなサンセット：追加の重なり", max: 3 },
    { key: "kaisetsu", label: "回折の数", max: 6 },
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

  // 音符のレベルから、アシストの発動Lv（0=未発動）を決める。Lv n の条件は 全ての音符が base + 15×(n−1) 以上
  S.lrAssistLv = (notes, a) => {
    for (let n = 5; n >= 1; n--) {
      const need = a.base + 15 * (n - 1);
      if (a.notes.every(k => ((notes || {})[k] || 0) >= need)) return n;
    }
    return 0;
  };

  // 効果を集計して、各巡遊者の集計(out)へ足す。呼び出し元: sim_pots.js の collect
  S.lrCollect = function (G, team, chs, out) {
    const mains = (G.lrMain || []).filter(Boolean);
    const on = G.lrOn || {}, N = G.lrN || {};
    const luxIds = team.filter((id, i) => chs[i].el === "光");
    const recv = to => to === "main" ? [team[0]] : to === "sup" ? team.slice(1) : to === "lux" ? luxIds : team.slice();
    const put = (e, v, rid) => {
      const a = out[rid];
      if (!a || !v) return;
      if (e.k === "critRate" || e.k === "critDmg") a.mods.push({ k: e.k, v, tags: null, ht: null, cond: null });
      else if (e.k === "critDmgSkill") a.mods.push({ k: "critDmg", v, tags: null, ht: "skill", cond: null });
      else if (e.k === "takenSkill") a.takenSkill *= 1 + v;
      else if (e.k === "takenBasic") a.takenBasic = (a.takenBasic || 1) * (1 + v);
      else if (a[e.k] != null) a[e.k] += v;
    };
    const apply = (key, item, lv) => {
      const isOn = on[key] == null ? !item.off : on[key];
      if (!isOn) return;
      if (item.need && (+N[item.need[0]] || 0) < item.need[1]) return;
      const cnt = item.n ? Math.max(0, +N[item.n] || 0) : 1;
      item.e.forEach(e => {
        let v = typeof e.v === "function" ? e.v(lv) : e.v;
        const c = e.cap != null ? Math.min(cnt, e.cap) : cnt;
        v *= c;
        recv(e.to).forEach(rid => put(e, v, rid));
      });
    };
    mains.forEach(rid => {
      const fx = S.LR_FX[rid];
      if (!fx) return;
      fx.core.forEach(it => apply(rid + ":c:" + it.id, it, 1));
      fx.assists.forEach(a => {
        const lv = S.lrAssistLv(S.notesTotal(G), a);
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
      { id: "ult", skill: "ult", idx: 3, n: 4, k: "critRate", to: "main", off: true, txt: v => `必殺技の発動時、自身の会心率 +${v}%（30秒）` },
    ],
    tilia: [
      { id: "main", skill: "main", idx: 1, n: 1, k: "atkPct", to: "all", off: true, txt: v => `防御姿勢が終わったときの反撃のあと、チーム全員の攻撃力 +${v}%（10秒）` },
      { id: "support", skill: "support", idx: 2, n: 1, k: "atkPct", to: "all", off: true, txt: v => `盾がダメージを与えると、チーム全員の攻撃力 +${v}%（10秒）` },
    ],
  };
  S.SKILL_NAME = { basic: "通常攻撃", main: "主力スキル", support: "支援スキル", ult: "必殺技" };

  S.skillCollect = function (G, team, chs, out) {
    team.forEach((id, i) => {
      const list = S.SKILL_FX[id];
      if (!list) return;
      const c = chs[i], cs = G.chars[id], isMain = i === 0;
      const lvB = S.emblemExtra(cs.emb, cs.embOn).lv;
      const luxIds = team.filter((x, j) => chs[j].el === "光");
      list.forEach(fx => {
        const usable = isMain ? (fx.skill === "main" || fx.skill === "ult") : fx.skill === "support";
        if (!usable) return;
        const key = id + ":" + fx.id;
        const on = (G.skOn || {})[key] == null ? !fx.off : G.skOn[key];
        if (!on) return;
        const lv = (((cs.skillLv || {})[fx.skill]) || 10) + (lvB[fx.skill] || 0);
        const v = S.engine.skillVal(c, fx.idx, fx.n, lv) / 100;
        const rec = fx.to === "main" ? [team[0]] : fx.to === "lux" ? luxIds : team.slice();
        rec.forEach(rid => {
          const a = out[rid];
          if (!a) return;
          if (fx.k === "critRate") a.mods.push({ k: "critRate", v, tags: null, ht: null, cond: null });
          else if (a[fx.k] != null) a[fx.k] += v;
        });
      });
    });
  };
})(window.SIM);
