// 与ダメへの寄与率（1つ変えると3分間のダメージが何%変わるか）と、その前提の3分間の回数・初期状態。
// 計算ノート（sim_ui.js）と、ビルド比較（compare.js）の両方で使う。DOMには触らない。
(function (S) {
  const E = S.engine;
  const clone = o => JSON.parse(JSON.stringify(o));
  const TK = en => TREKKERS.find(x => x.en === en);
  const chOf = id => S.CH.find(c => c.id === id);
  const JA = (en, id) => { const c = id && chOf(id); const m = (window.POTENTIAL_JA || {})[c ? c.en : ""] || {}; return m[en] || en; };
  const fmt = n => (n == null || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("ja-JP");
  const pct = n => (Math.round(n * 1000) / 10) + "%";
  const SLOTS = [["main", "主力"], ["s1", "支援1"], ["s2", "支援2"]];
  const KIND_NAME = { triangle: "初級", circle: "中級", star: "上級" };
  const POT_LV_MAX = 6, POT_LV_EMB_MAX = 9;   // 取得はLv6まで。徽章の素質レベル上昇でLv9まで

  // ---- 初期状態 ----
  function defChar(id) {
    const c = chOf(id);
    const lv = { nazuka: { basic: 1, main: 1, support: 8, ult: 7 }, eleanor: { basic: 1, main: 1, support: 9, ult: 8 } }[id] || { basic: 10, main: 10, support: 10, ult: 10 };
    return { skillLv: clone(lv), trustLv: c.trust0, talent: c.talent0, emb: S.EMB_DEFAULT[id](), embOn: [1, 1, 1], add: {},
      manual: {}, pots: {}, sup: {}, pots2: {}, pon: {}, pstk: {}, pcnt: {} };
  }
  function defState() {
    const G = { team: { main: "willow", s1: "nazuka", s2: "eleanor" }, recordLv: 4, enemy: "stomp", traits: {}, enemyOv: { res: {}, extra: {} }, directPriority: true,
      notes: clone(TEST2_CTX.notes), lrMain: clone(TEST2_CTX.lr), lrSub: clone(TEST2_CTX.lrSub), lrOn: {}, lrN: {},
      lrManual: { baseAtk: 0, baseHp: 0, elem: 0, elemEl: "", basicDmg: 0, skillDmg: 0, atkPct: 0 },
      other: { mult: 1, taken: 1 }, heartCrit: false, glimmer: true, markDebuff: true, chars: {} };
    S.CH.forEach(c => { G.chars[c.id] = defChar(c.id); });
    return G;
  }
  function merge(a, b) {
    Object.keys(b).forEach(k => { if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k])) merge(a[k], b[k]); else a[k] = b[k]; });
    return a;
  }

  // ---- 徽章の枠の表記 ----
  // 項目の区分（左から 区分 → 項目 → 値 の順にドロップダウンで選ぶ）
  const EMB_CATS = [
    ["ステータス", ["hpPct", "baseHp", "atkPct", "baseAtk", "defPct", "baseDef"]],
    ["会心", ["critRate", "basicCritRate", "skillCritRate", "ultCritRate", "markCritRate", "critDmg"]],
    ["ダメージ・貫通", ["resPen", "elemDmg", "basicDmg", "skillDmg", "ultDmg", "markDmg"]],
    ["従者・派生", ["servantDmg", "servantCritRate", "derivedDmg", "derivedCritRate"]],
    ["スキル・素質", ["lvBasic", "lvMain", "lvSupport", "lvUlt", "potMain", "potSupport", "potCommon"]],
    ["その他", ["spMain", "spSupport"]],
  ];
  const catOfKey = key => { const c = EMB_CATS.find(x => x[1].indexOf(key) >= 0); return c ? c[0] : ""; };
  // 素質のレベル上昇の対象の候補（英語名の一覧）
  function potTargets(G, id, key) {
    const t = TK(chOf(id).en);
    if (!t || !t.potentials) return [];
    // 汎用素質は、主力と支援で一覧が違う（シアの「月の海の兎たち」は支援だけ）ので、編成の位置で決める
    const role = key === "potSupport" ? "support" : key === "potCommon" ? (G.team.main === id ? "main" : "support") : "main";
    const groups = (t.potentials[role] || []).filter(g => key === "potCommon" ? /Generic/i.test(g.title) : !/Generic/i.test(g.title));
    return groups.reduce((a, g) => a.concat(g.potentials.map(x => ({ en: x.name, core: x.type === 1 }))), []).filter(x => !x.core);
  }
  const optOf = key => EMBLEM_OPTIONS.find(o => o.key === key);
  const LV_Q = [["gold", "金"], ["rainbow2", "虹"], ["rainbow3", "虹"]];   // スキル・素質レベル上昇は 金 +1／虹 +2・+3
  const isLv = o => o.type === "skillLv" || o.type === "potLv";
  const lvAmt = q => q === "gold" ? 1 : q === "rainbow2" ? 2 : 3;
  const qualOf = o => isLv(o) ? LV_Q : EMBLEM_QUALITY.filter(([q]) => o.tiers[q] != null);   // 値がある品質だけ
  const qVal = (o, q) => isLv(o) ? lvAmt(q) : o.tiers[q];
  const valTxt = (o, v) => o.fmt === "pct" ? pct(v) : o.fmt === "lv" ? "+" + v : fmt(v);
  // 短い名前: 素質のレベル上昇は素質名と値、ほかは項目名（かっこの補足は外す）と値（「HP 12%」「ナイトパンチ +3」）
  const embShort = (id, sl) => {
    const o = optOf(sl.k); if (!o) return "";
    const v = qVal(o, sl.q), vt = v != null ? " " + valTxt(o, v) : "";
    return (o.type === "potLv" && sl.t ? JA(sl.t, id) : o.label.replace(/（.*?）/g, "")) + vt;
  };

  // ---- 3分間の回数（目安）----
  // 回数は G.rot[巡遊者][basic|main|ult|support] で上書きできる
  const FIGHT_SEC = 180;
  const CT_GAME = { "Firstlight Noya": { main: 10, support: 12, ult: 30 } };   // ゲーム内の表示（2026-10-28 ユーザー）
  const BASIC_SEC = { "Firstlight Noya": 5 };   // 通常1ローテの秒数（最終段から最終段までを目で見た値）。ほかは未測定
  const BASIC_SEC_DEFAULT = 5;
  function rotDefault(id) {
    const c = chOf(id), ct = Object.assign({}, (window.SKILL_CT || {})[c.en] || {}, CT_GAME[c.en] || {});
    const n = k => ct[k] ? Math.ceil(FIGHT_SEC / ct[k]) : null;
    const bs = BASIC_SEC[c.en];
    return { ct, basicSec: bs || BASIC_SEC_DEFAULT, basicMeasured: !!bs, basic: Math.floor(FIGHT_SEC / (bs || BASIC_SEC_DEFAULT)), main: n("main"), ult: n("ult"), support: n("support") };
  }
  function rotCount(g, id, k) {
    const v = ((g.rot || {})[id] || {})[k];
    if (v != null && v !== "") return Math.max(0, +v);
    return rotDefault(id)[k] || 0;
  }
  // 巡遊者ごとの対象のダメージ（3分間）: 主力は 通常×回数＋主力スキル×回数＋必殺技×回数（印を含む）、支援は 支援スキル×回数＋必殺技×回数
  function dmgParts(g) {
    const r = E.calcTeam(clone(g)), mid = g.team.main, m = r.team[mid], n = (id, k) => rotCount(g, id, k);
    const sup = id => r.team[id].groups.support.totExp * n(id, "support") + r.team[id].groups.ult.totExp * n(id, "ult");
    return { main: m.groups.basic.totExp * n(mid, "basic") + m.groups.main.totExp * n(mid, "main") + m.groups.ult.totExp * n(mid, "ult"),
      s1: sup(g.team.s1), s2: sup(g.team.s2) };
  }
  const sum3 = d => d.main + d.s1 + d.s2;

  // ---- 寄与率 ----
  // 項目ごとの「比べる値」。素質はLv、アシスト効果はLv、コア効果は突破。既定は今の1つ下（下げられなければ1つ上）。cmp[key] で変えられる
  const cmpOf = (cmp, key, cur, lo, hi) => {
    let t = (cmp || {})[key];
    t = t == null ? (cur > lo ? cur - 1 : cur + 1) : Math.min(hi, Math.max(lo, +t));
    return t === cur ? (cur > lo ? cur - 1 : cur + 1) : t;
  };
  // G のまま、1つの項目だけ変えたときの3分間のダメージの変化。返り値は大きい順の
  //   { kind: 素質|徽章|ロスレコ, label, cmp: {key,cur,t,lo,hi,unit} | null, uid, team: 下がる割合 }
  // opts.cmp = 比べる値の上書き、opts.more({ k, id, pot, potLvSet }) = 項目を足す（計算ノートの「未取得の素質も表示」）
  function calcContrib(G, opts) {
    opts = opts || {};
    const d0 = dmgParts(G), t0 = sum3(d0), items = [];
    const drop = (kind, label, slot, fn, cmp, uid) => {
      const g = clone(G); fn(g); const d = dmgParts(g);
      items.push({ kind, label, cmp, uid: kind + "|" + (uid || label), team: t0 > 0 ? 1 - sum3(d) / t0 : 0 });
    };
    // 比べる値つきの項目（lo〜hi の範囲。今と同じ値は飛ばす）
    const cmpItem = (kind, label, slot, key, cur, lo, hi, unit, set) => {
      if (hi <= lo) return;
      const t = cmpOf(opts.cmp, key, cur, lo, hi);
      drop(kind, label, slot, g => set(g, t), { key, cur, t, lo, hi, unit });
    };
    SLOTS.forEach(([k]) => {
      const id = G.team[k], cs = G.chars[id], c = chOf(id), tk = TK(c.en), role = k === "main" ? "main" : "support";
      const core = new Set();   // コア素質（取得するかどうかだけ。Lvは0か1）
      ((tk && tk.potentials[role]) || []).forEach(gr => gr.potentials.forEach(p => { if (p.type === 1) core.add(S.potKey(p.name)); }));
      const pot = (key, name, lv, max, set) => cmpItem("素質", `${c.jp}：${name}`, k, key, lv, 0, Math.max(max, lv), "Lv", set);   // 取得できるのはLv6まで（前の入力で7以上のものは、その値まで）
      // 素質の選択（pots2）のコア以外は、徽章でLv9まで上げられるので、徽章込みのLvで0〜9を比べる
      const bonus = S.emblemExtra(cs.emb, cs.embOn).pot, potLvSet = en => (g, v) => { g._potLv = Object.assign({}, g._potLv, { [id + ":" + en]: v }); };
      Object.keys(cs.pots2 || {}).filter(p => +cs.pots2[p] > 0).forEach(p => {
        const en = (Object.keys(S.POT_SPEC[id] || {}).find(n => S.potKey(n) === p)) || p, b = bonus[en] || 0;
        if (core.has(p)) pot(`p2:${id}:${p}`, JA(en, id), +cs.pots2[p], 1, (g, v) => { g.chars[id].pots2[p] = v; });
        else pot(`p2:${id}:${p}`, JA(en, id) + (b ? `（徽章+${b}込み）` : ""), +cs.pots2[p] + b, POT_LV_EMB_MAX, potLvSet(en));
      });
      Object.keys(cs.pots || {}).filter(p => +cs.pots[p] > 0).forEach(p => {
        const x = (window.POTENTIALS || []).find(q => q.id === p) || {};
        pot(`p:${id}:${p}`, x.jp || p, +cs.pots[p], x.core ? 1 : POT_LV_MAX, (g, v) => { g.chars[id].pots[p] = v; });
      });
      Object.keys(cs.sup || {}).filter(p => cs.sup[p] && +cs.sup[p].lv > 0).forEach(p => pot(`sp:${id}:${p}`, (((window.SUP_POTS || {})[id] || []).find(x => x.id === p) || {}).jp || p, +cs.sup[p].lv, POT_LV_MAX, (g, v) => { g.chars[id].sup[p].lv = v; }));
      if (opts.more) opts.more({ k, id, pot, potLvSet });
      (cs.emb || []).forEach((e, i) => {
        if (!cs.embOn[i] || !e.slots.some(sl => sl.k)) return;
        e.slots.forEach((sl, j) => { if (sl.k) drop("徽章", `${c.jp}：${KIND_NAME[e.kind] || ""}\n${embShort(id, sl)}`, k, g => { g.chars[id].emb[i].slots[j].k = ""; }, null, `${id}:${i}:${j}`); });
      });
    });
    // ロスレコ（メインのものだけ効果がある）: アシスト効果はLv（0〜5。未発動も、上げたときを見られる）、コア効果は突破（1〜6）
    const LR = window.LOSTRECORDS || [];
    (G.lrMain || []).filter(Boolean).forEach(rid => {
      const fx = S.LR_FX[rid], r = LR.find(x => x.id === rid); if (!fx || !r) return;
      const rk = S.lrRankOf(G, rid);
      if (rk.can) cmpItem("ロスレコ", `${r.name}：コア効果`, null, `lrc:${rid}`, rk.rank, 1, 6, "突破", (g, v) => { g.lrRank = Object.assign({}, g.lrRank, { [rid]: v }); });
      fx.assists.forEach(a => {
        const lv = S.lrAssistLv(S.notesTotal(G), a);
        cmpItem("ロスレコ", `${r.name}：${a.name}`, null, `lra:${rid}:${a.id}`, lv, 0, 5, "Lv", (g, v) => { g._lrAssistDec = Object.assign({}, g._lrAssistDec, { [rid + ":" + a.id]: lv - v }); });
      });
    });
    items.sort((a, b) => Math.abs(b.team) - Math.abs(a.team));
    return items;
  }

  // ---- オススメ強化ポイント（1つだけ変えたとき、3分間のダメージがどれだけ伸びるか）----
  // 候補（ゲームのきまり。2026-11-10 ユーザー）:
  //   心相: 1凸上げる（★5は10段階、★4は5段階）。上限は50段階
  //   ロスレコ: 突破を1つ上げる（メインとサブ。サブは基礎攻撃力だけ変わる）
  //   しずく: 徽章の1つの値を1段階上げる（緑→青→金→虹、レベル上昇は 金+1→虹+2→虹+3）。1枚の徽章に2回まで（使った回数はデータに無いので、ここでは数えない）
  //   素質の付け替え: 合計5まで、取った素質を下げて別の素質を上げられる。Lv1→0 と Lv6→7 はできない。巡遊者をまたいでもよい（2026-11-10 ユーザー）
  //   音符の付け替え: 合計15個まで、ある音符を減らして別の音符に足せる。1→0 はできない
  // 返り値は伸びの大きい順: { kind, label, gain（割合）, apply(g) }
  function calcUpgrades(G) {
    const t0 = sum3(dmgParts(G)), out = [];
    if (!(t0 > 0)) return out;
    const tryG = fn => { const g = clone(G); fn(g); return sum3(dmgParts(g)) / t0 - 1; };
    const MIN = 0.001;   // 伸びが0.1%未満の手は出さない
    const add = (kind, label, fn, src) => { const gain = tryG(fn); if (gain >= MIN) out.push({ kind, label, gain, apply: fn, src }); };
    const pots = [];   // 付け替えできる素質（3人分。コア素質は対象外）
    const LR = window.LOSTRECORDS || [];
    SLOTS.forEach(([k]) => {
      const id = G.team[k], cs = G.chars[id], c = chOf(id), tk = TK(c.en);
      // 心相
      const step = tk && tk.rarity >= 5 ? 10 : 5, tal = +cs.talent || 0;
      if (tal + step <= 50) add("心相", `${c.jp}：心相 ${tal / 10}凸 → ${(tal + step) / 10}凸`, g => { g.chars[id].talent = tal + step; });
      // しずく（徽章の値を1段階）
      (cs.emb || []).forEach((e, i) => {
        if (!cs.embOn[i]) return;
        e.slots.forEach((sl, j) => {
          const o = sl.k && optOf(sl.k); if (!o || !sl.q) return;
          const qs = qualOf(o).map(x => x[0]), qi = qs.indexOf(sl.q);
          if (qi < 0 || qi + 1 >= qs.length) return;
          const nq = qs[qi + 1];
          add("しずく", `${c.jp}：${KIND_NAME[e.kind] || ""} ${embShort(id, sl)} → ${qVal(o, nq) != null ? valTxt(o, qVal(o, nq)) : nq}`, g => { g.chars[id].emb[i].slots[j].q = nq; });
        });
      });
      // 付け替えできる素質を集める
      const core = new Set();
      const role = k === "main" ? "main" : "support";
      ((tk && tk.potentials[role]) || []).forEach(gr => gr.potentials.forEach(p => { if (p.type === 1) core.add(S.potKey(p.name)); }));
      Object.keys(cs.pots2 || {}).filter(p => +cs.pots2[p] > 0 && !core.has(p)).forEach(p => pots.push({ id, p, lv: +cs.pots2[p],
        name: `${c.jp}の${JA((Object.keys(S.POT_SPEC[id] || {}).find(n => S.potKey(n) === p)) || p, id)}` }));
    });
    // 素質の付け替え（巡遊者をまたいでもよい）: 1つ下げたときの損と1つ上げたときの得を先に出し、得の大きい5つ×損の小さい5つの組み合わせを実際に計算する
    if (pots.length > 1) {
      const setLv = (x, v) => g => { g.chars[x.id].pots2[x.p] = v; };
      const ups = pots.filter(x => x.lv < POT_LV_MAX).map(x => ({ x, d: tryG(setLv(x, x.lv + 1)) })).sort((a, b) => b.d - a.d).slice(0, 5);
      const downs = pots.filter(x => x.lv > 1).map(x => ({ x, d: tryG(setLv(x, x.lv - 1)) })).sort((a, b) => b.d - a.d).slice(0, 5);
      ups.forEach(u => downs.forEach(dn => {
        if (u.x === dn.x) return;
        add("素質", `${dn.x.name} Lv${dn.x.lv}→${dn.x.lv - 1}、${u.x.name} Lv${u.x.lv}→${u.x.lv + 1}`, g => { setLv(dn.x, dn.x.lv - 1)(g); setLv(u.x, u.x.lv + 1)(g); }, "p");
      }));
    }
    // ロスレコの突破
    ["lrMain", "lrSub"].forEach(arr => (G[arr] || []).filter(Boolean).forEach(rid => {
      const r = LR.find(x => x.id === rid); if (!r) return;
      const fxCan = arr === "lrMain" && S.lrRankOf(G, rid).can, atkCan = S.lrAtkScalable(r);
      if (!fxCan && !atkCan) return;
      const now = S.lrRankNow(G, rid);
      if (now >= 6) return;
      add("ロスレコ", `${r.name}：突破${S.lrRoman(now)} → ${S.lrRoman(now + 1)}${arr === "lrSub" ? "（サブ）" : ""}`, g => { g.lrRank = Object.assign({}, g.lrRank, { [rid]: now + 1 }); });
    }));
    // 音符の付け替え（減らす音符は自分で取ったものだけ。1個は残す）。動かす数は 1・5・10・15（できる分まで）を試して、いちばん伸びるもの
    const own = G.notes || {}, names = S.NOTE_ALL || Object.keys(own);
    names.forEach(a => {
      const na = +own[a] || 0; if (na <= 1) return;
      names.forEach(b => {
        if (a === b) return;
        let best = null;
        [1, 5, 10, 15].map(n => Math.min(n, na - 1)).filter((n, i, xs) => xs.indexOf(n) === i).forEach(n => {
          const fn = g => { g.notes = Object.assign({}, g.notes); g.notes[a] = na - n; g.notes[b] = (+g.notes[b] || 0) + n; };
          const gain = tryG(fn);
          if (!best || gain > best.gain) best = { n, gain, fn };
        });
        if (best && best.gain >= MIN) out.push({ kind: "音符", label: `${a.replace("の音符", "")} −${best.n} → ${b.replace("の音符", "")} +${best.n}`, gain: best.gain, apply: best.fn, src: "n" });
      });
    });
    out.sort((x, y) => y.gain - x.gain);
    return out;   // 付け替え（src あり）の重なりを外すかどうかは、画面の側で決める（すべての種類を出すときだけ1つにまとめる）
  }

  // ---- 記録レベルからビルドを作る（試作）----
  // 記録のスコア = コア素質×180 + サブ素質のLv合計×60 + 音符×15 + アシスト効果のLv合計×120（ユーザーの記録Lv34ほか4件で検算済み）
  const SC = { core: 180, sub: 60, note: 15, assist: 120 };
  function potList(G, k) {   // 巡遊者の素質（その位置で取れるもの）: [{ key, core }]
    const id = G.team[k], tk = TK(chOf(id).en), role = k === "main" ? "main" : "support";
    const out = [];
    ((tk && tk.potentials && tk.potentials[role]) || []).forEach(gr => gr.potentials.forEach(p => { const key = S.potKey(p.name); if (!out.some(x => x.key === key)) out.push({ key, core: p.type === 1 }); }));
    return out;
  }
  function recordScore(G) {
    let s = 0;
    SLOTS.forEach(([k]) => {
      const cs = G.chars[G.team[k]], pl = potList(G, k);
      pl.forEach(p => { const lv = +((cs.pots2 || {})[p.key]) || 0; if (lv > 0) s += p.core ? SC.core : lv * SC.sub; });
    });
    S.NOTE_ALL.forEach(n => { s += (+((G.notes || {})[n]) || 0) * SC.note; });
    const nt = S.notesTotal(G);
    (G.lrMain || []).filter(Boolean).forEach(rid => { const fx = S.LR_FX[rid]; if (fx) fx.assists.forEach(a => { s += S.lrAssistLv(nt, a) * SC.assist; }); });
    return s;
  }
  // ロスレコのおすすめ順: 巡遊者の属性（と属性なし）のロスレコを、メインに1枚だけ入れたときのダメージの大きい順（突破I・音符なし・素質なし）
  function recommendLR(G) {
    const els = new Set(SLOTS.map(([k]) => chOf(G.team[k]).el).concat(["なし"]));
    const base = clone(G);
    base.notes = {}; base.lrMain = ["", "", ""]; base.lrSub = ["", "", ""]; base.lrRank = {};
    SLOTS.forEach(([k]) => { const cs = base.chars[base.team[k]]; cs.pots2 = {}; cs.pots = {}; cs.sup = {}; });
    const t0 = sum3(dmgParts(base));
    return (window.LOSTRECORDS || []).filter(r => els.has(r.element)).map(r => {
      const g = clone(base); g.lrMain = [r.id, "", ""]; g.lrRank = { [r.id]: 1 };
      return { id: r.id, name: r.name, el: r.element, rarity: r.rarity, gain: t0 > 0 ? sum3(dmgParts(g)) / t0 - 1 : 0 };
    }).sort((a, b) => b.gain - a.gain);
  }
  // 記録Lvの必要スコアを予算にして、「1点あたりのダメージの伸び」が大きいものから取っていく（素質・音符・アシストの発動）
  // opts: { lrMain: [id…], recordLv }。返り値 { g, score, budget, log: [{ label, cost }] }
  function planBuild(G, opts) {
    const g = clone(G);
    g.recordLv = opts.recordLv; g.lrMain = (opts.lrMain || []).concat(["", "", ""]).slice(0, 3); g.lrSub = ["", "", ""];
    g.lrRank = {}; g.lrMain.filter(Boolean).forEach(rid => { g.lrRank[rid] = 1; });   // 突破は I から（持っている突破は分からないので）
    g.notes = {};
    SLOTS.forEach(([k]) => { const cs = g.chars[g.team[k]]; cs.pots2 = {}; cs.pots = {}; cs.sup = {}; });
    // アシスト効果の条件付きの効果（「必殺技の発動時から」など）は、既定ではオフ。ビルドを作るときは、条件を満たしている前提でオンにして選ぶ
    g.lrOn = Object.assign({}, g.lrOn);
    g.lrMain.filter(Boolean).forEach(rid => { const fx = S.LR_FX[rid]; if (fx) fx.assists.forEach(a => a.items.forEach(it => { if (it.off && !it.skip) g.lrOn[rid + ":" + a.id + ":" + it.id] = true; })); });
    const row = (window.RECORD_LEVELS || []).find(x => x[0] === +opts.recordLv);
    const budget = row ? row[1] : 0, log = [], memo = new Map();
    const nm = (id, key) => JA((Object.keys(S.POT_SPEC[id] || {}).find(n => S.potKey(n) === key)) || key, id);
    for (let step = 0; step < 400; step++) {
      const s0 = recordScore(g), d0 = sum3(dmgParts(g));
      if (s0 >= budget) break;
      const cands = [];
      SLOTS.forEach(([k]) => {
        const id = g.team[k], cs = g.chars[id], pl = potList(g, k), c = chOf(id);
        const nCore = pl.filter(p => p.core && +cs.pots2[p.key] > 0).length;
        pl.forEach(p => {
          const lv = +cs.pots2[p.key] || 0;
          if (p.core ? (lv > 0 || nCore >= 2) : lv >= POT_LV_MAX) return;
          cands.push({ key: `p:${id}:${p.key}`, label: `${c.jp}：${nm(id, p.key)}${p.core ? "（コア）" : ` Lv${lv + 1}`}`, fn: x => { x.chars[id].pots2[p.key] = lv + 1; } });
        });
      });
      S.NOTE_ALL.forEach(n => [1, 5].forEach(m => cands.push({ key: `n:${n}:${m}`, label: `${n.replace("の音符", "")}の音符 +${m}`, fn: x => { x.notes = Object.assign({}, x.notes); x.notes[n] = (+x.notes[n] || 0) + m; } })));
      // アシスト効果の次のLvまで、足りない音符をまとめて足す（片方の音符だけ足しても発動しないため）
      const nt = S.notesTotal(g);
      g.lrMain.filter(Boolean).forEach(rid => { const fx = S.LR_FX[rid], r = (window.LOSTRECORDS || []).find(x => x.id === rid); if (fx) fx.assists.forEach(a => {
        const lv = S.lrAssistLv(nt, a); if (lv >= 5) return;
        const need = a.base + 15 * lv;
        cands.push({ key: `a:${rid}:${a.id}`, label: `${r ? r.name : rid}：${a.name} Lv${lv + 1}（音符をそろえる）`, fn: x => { x.notes = Object.assign({}, x.notes); a.notes.forEach(k => { const cur = S.notesTotal(x)[k] || 0; if (cur < need) x.notes[k] = (+x.notes[k] || 0) + (need - cur); }); } });
      }); });
      // 速くするため、前の段で出した「1点あたりの伸び」を覚えておき、大きそうな順に計算し直す（伸びはふつう段ごとに小さくなるので、
      // 計算し直した値が、まだ計算し直していない候補の前の値より大きければ、それより下は調べなくてよい）
      const evalC = cd => {
        const x = clone(g); cd.fn(x);
        const cost = recordScore(x) - s0; if (cost <= 0 || s0 + cost > budget) return { r: -1, cost };
        if (S.NOTE_ALL.some(n => (+((x.notes || {})[n]) || 0) > 99)) return { r: -1, cost };   // 音符は1種類99個まで（入力欄と同じ）
        const gain = sum3(dmgParts(x)) - d0;
        return { r: gain > 0 ? gain / cost : -1, cost };
      };
      cands.forEach(cd => { cd.stale = memo.has(cd.key) ? memo.get(cd.key) : Infinity; });
      cands.sort((a, b) => b.stale - a.stale);
      let best = null;
      for (const cd of cands) {
        if (best && cd.stale <= best.r) break;
        const e = evalC(cd); memo.set(cd.key, e.r);
        if (e.r > 0 && (!best || e.r > best.r)) best = { r: e.r, cd, cost: e.cost };
      }
      if (!best) break;
      best.cd.fn(g); log.push({ label: best.cd.label, cost: best.cost });
    }
    return { g, score: recordScore(g), budget, log };
  }

  S.contrib = { SLOTS, KIND_NAME, EMB_CATS, catOfKey, potTargets, POT_LV_MAX, POT_LV_EMB_MAX, defChar, defState, merge, optOf, LV_Q, isLv, lvAmt, qualOf, qVal, valTxt, embShort,
    rotDefault, rotCount, dmgParts, sum3, cmpOf, calcContrib, calcUpgrades, recordScore, recommendLR, planBuild };
})(window.SIM);
