// ステラソラ ダメージ計算エンジン（DOM非依存）
// 検証済みの式:
//   攻撃力 = (基礎 + 心相 + 信頼 + ロスレコ基礎攻撃) × (1 + 信頼% + 徽章% + ロスレココア% + 強撃の音符)
//   ダメージ = 攻撃力 × スキル倍率 × W × B × D
//     W = 1 + 水属性ダメージ加算（ロスレコstat + コア無条件 + 水の音符 + リプルノート + バブルマーク）
//     B = 1 + 種別ダメージ加算（通常攻撃: 徽章+ロスレコ+集中の音符）
//     D = 敵側の総合補正（実測、耐性貫通を外すと penOffFactor を掛ける）
// 会心: 会心ダメージ(150%)がそのまま倍率（×1.5）。実測 14,360 / 9,573 = 1.5001 で確認。
// 心相4「波のまにまに」: 4秒ごとに通常攻撃ダメージ・スキルダメージ +6%（最大3スタック=18%）。通常攻撃は実測で確認（足元の剣アイコン）。
// 心相1・2・3・5 の戦闘中効果は未検証（画面のスイッチで既定OFF）。
// 未検証: スキル/必殺技の B の中身、HP%の掛け方。

const CRIT_BASE_RATE = 0.05;
const CRIT_BASE_DMG = 1.5;
const MARK_BONUS = 0.25;   // バブルマーク: 付与された敵への水属性ダメージ
const RIPPLE_BONUS = 0.05; // リプルノート1つあたりの水属性ダメージ
const PEN_S = 472.4;       // 耐性貫通モデルの定数（53÷(1−0.8878)）
const STACK_B = 0.06;      // 心相4: 1スタックあたりの通常攻撃/スキルダメージ加算

// 徽章の合計。cfg は EMBLEM_DEFAULT_CFG と同じ形（3枚×4枠の {k, q}）。on は [1,1,1]（0で外す）。
function emblemTotals(c, on, cfg) {
  const t = {};
  (cfg || EMBLEM_DEFAULT_CFG).forEach((e, i) => {
    if (on && on[i] === 0) return;
    e.slots.forEach(sl => {
      const o = EMBLEM_OPTIONS.find(x => x.key === sl.k);
      const v = o && o.tiers[sl.q];
      if (v != null && o.type === "stat") t[sl.k] = (t[sl.k] || 0) + v;
    });
  });
  return t;
}

function lostRecordTotals(ids, element, subIds) {
  const t = { baseAtk: 0, baseHp: 0, elemDmg: 0, basicDmg: 0, coreElem: 0, atkPct: 0 };
  const add = (id, isMain) => {
    const r = LOSTRECORDS.find(x => x.id === id);
    if (!r) return;
    const s = r.stats || {};
    const match = !element || r.element === element; // 属性ダメージは、同じ属性のキャラにだけ乗る
    t.baseAtk += s.baseAtk || 0;
    t.baseHp += s.baseHp || 0;
    if (match) t.elemDmg += s.elemDmg || 0;
    t.basicDmg += s.basicDmg || 0;
    const a = isMain && r.core && r.core.always;
    if (a) { if (match) t.coreElem += a.elemDmg || 0; t.atkPct += a.atkPct || 0; }
  };
  (ids || []).forEach(id => add(id, true));
  (subIds || []).forEach(id => add(id, false));
  return t;
}

function noteTotals(notes) {
  const t = { atkPct: 0, critRate: 0, critDmg: 0, hpPct: 0, basicDmg: 0, skillDmg: 0, ultDmg: 0, water: 0, wind: 0 };
  const key = { atkPct: "atkPct", critRate: "critRate", critDmg: "critDmg", hpPct: "hpPct", basicDmg: "basicDmg", skillDmg: "skillDmg", ultDmg: "ultDmg", "elemDmg:水": "water", "elemDmg:風": "wind" };
  Object.entries(notes || {}).forEach(([name, lv]) => {
    const n = NOTES[name];
    if (!n || !key[n.stat]) return;
    t[key[n.stat]] += n.perLv * Math.min(Math.max(lv || 0, 0), NOTE_MAX_LV);
  });
  return t;
}

// 効果1件を pa（加算の集計）と taken（乗算）へ足す
function applyEff(pa, tk, e, v, ctx) {
  if (e.k === "taken") tk.v *= 1 + v;
  else if (e.k === "takenBasic") tk.basic *= 1 + v;
  else pa[e.k] = (pa[e.k] || 0) + v;
}

// state: { emblems:[1,1,1], lr:[id,id,id], notes:{名前:Lv}, enemy:id, ripple:0..2, mark:bool }
function compute(state) {
  const c = CHARACTERS[0];
  const em = emblemTotals(c, state.emblems, state.embCfg);
  Object.entries(state.extraEm || {}).forEach(([k, v]) => { em[k] = (em[k] || 0) + v; });
  const lr = lostRecordTotals(state.lr, "水", state.lrSub);
  const nt = noteTotals(state.notes);
  const b = c.statsBase, r = c.resonance.total, t = c.trust;

  // 素質（主力）。レベルはその素質の実効レベル（徽章の+Nは元が1以上のときだけ足して入力する）
  const pa = { atkPct: 0, skillB: 0, basicB: 0, ultB: 0, frogB: 0, waterAdd: 0, critDmg: 0, critRate: 0 };
  const tk = { v: 1, basic: 1 };
  POTENTIALS.forEach(p => {
    const lv = (state.pots || {})[p.id] || 0;
    if (!lv) return;
    p.effects.forEach(e => {
      const v = e.fixed != null ? e.fixed : potVal(e.vals, lv);
      applyEff(pa, tk, e, v);
    });
  });

  // ロスレコのアシスト効果: 解放条件の音符レベルを満たすと発動（音符の入力から自動判定）
  const assistOn = [];
  (state.lr || []).forEach(id => {
    const rec = LOSTRECORDS.find(x => x.id === id);
    if (!rec || !rec.assist) return;
    rec.assist.forEach(a => {
      if (!a.eff || !a.unlock) return;
      const ok = a.unlock.every(u => ((state.notes || {})[u.note] || 0) >= u.lv);
      if (!ok) return;
      assistOn.push(a.name);
      a.eff.forEach(e => {
        if (e.needRipple && (state.ripple || 0) < e.needRipple) return;
        const v = e.perRipple != null ? e.perRipple * (state.ripple || 0) : e.v;
        applyEff(pa, tk, { k: e.k }, v);
      });
    });
  });

  // チームバフ（支援キャラなどの効果を手入力）
  (state.teamBuffs || []).forEach(tb => {
    if (!tb.on || !tb.value) return;
    applyEff(pa, tk, { k: tb.kind }, tb.value / 100);
  });

  const atkBase = b.atk + r.baseAtk + t.baseAtk + lr.baseAtk + (em.baseAtk || 0) + (state.flatAtk || 0);
  const ULT_ATK = 0.115;  // 必殺技: チーム攻撃力+11.5%（最大5スタック、20秒）
  const FROG_ATK = 0.133; // バブルフロッグがダメージを与えるたび +13.3%（最大5、6秒）
  const atkPct = t.atkPct + (em.atkPct || 0) + lr.atkPct + nt.atkPct + (state.frog || 0) * FROG_ATK + (state.ult || 0) * ULT_ATK + pa.atkPct;
  const atk = atkBase * (1 + atkPct);
  const hp = (b.hp + r.baseHp + t.baseHp + lr.baseHp + (em.baseHp || 0) + (state.flatHp || 0)) * (1 + nt.hpPct + (em.hpPct || 0));
  const def = (b.def + r.baseDef + (em.baseDef || 0)) * (1 + (em.defPct || 0));

  const ripple = state.ripple || 0;
  const waterAdd = lr.elemDmg + lr.coreElem + nt.water + ripple * RIPPLE_BONUS + (state.mark ? MARK_BONUS : 0) + (state.r1 ? 0.30 : 0) + (em.elemDmg || 0) + pa.waterAdd;
  const W = 1 + waterAdd;

  const bAdd = {
    basic: (em.basicDmg || 0) + lr.basicDmg + nt.basicDmg + (state.stack || 0) * STACK_B + pa.basicB,
    skill: (r.skillDmg || 0) + (em.skillDmg || 0) + nt.skillDmg + (state.stack || 0) * STACK_B + pa.skillB,
    ult: (r.ultDmg || 0) + nt.ultDmg + (em.ultDmg || 0) + pa.ultB,
  };
  const critRate = {
    basic: CRIT_BASE_RATE + nt.critRate + (em.critRate || 0) + (em.basicCritRate || 0) + pa.critRate,
    skill: CRIT_BASE_RATE + nt.critRate + (em.critRate || 0) + (em.skillCritRate || 0) + pa.critRate,
    ult: CRIT_BASE_RATE + nt.critRate + (em.critRate || 0) + (em.ultCritRate || 0) + pa.critRate,
  };
  const critDmg = CRIT_BASE_DMG + nt.critDmg + (state.r3 ? 0.32 : 0) + (em.critDmg || 0) + pa.critDmg;
  // 心相2・5: 敵の水属性被ダメージ（別枠の乗算として仮置き・未検証）
  const taken = (state.r2 ? 1.27 : 1) * (state.r5 ? 1.24 : 1) * tk.v;
  // 揺らめく光の向こう側のコア: タイドフリーズ付きが印を付与した後4秒、敵の水属性スキル被ダメージ+18%（スキルのみ・別枠の乗算）
  // ボス特性「ひび割れた好機」（暴走のストンプクラブ）: 主力が必殺技を発動した後15秒、スキル被ダメージ+15%（実測 177,600 = 154,441×1.15）
  const tideSkill = (state.tide ? 1.18 : 1) * (state.skill15 ? 1.15 : 1);
  // ボス特性「命がけの追撃」（深層ノ主）: 印ダメージ3回後15秒、通常攻撃・スキルの被ダメージ+24%（未検証）
  const deepTaken = state.deep24 ? 1.24 : 1;

  const enemy = ENEMIES.find(e => e.id === state.enemy) || ENEMIES[ENEMIES.length - 1];
  // 属性耐性貫通: ストンプクラブで 貫通53あり/なし の比 ×1.1263 を実測。D(p) = D53 × F(p)/F(53)、F(p)=S/(S−p) と置く（形は1点からの推定）。
  const pen = em.resPen || 0;
  let D = enemy.D, dApprox = false;
  if (enemy.id !== "none") {
    const F = p => PEN_S / (PEN_S - Math.min(p, PEN_S - 1));
    D = enemy.D * F(pen) / F(53);
    if (enemy.penOffFactor == null && Math.abs(pen - 53) > 1e-9) dApprox = true;
  }

  return { atk, atkBase, atkPct, hp, def, W, waterAdd, bAdd, critRate, critDmg, taken, takenBasic: tk.basic, assistOn, frogB: pa.frogB, tideSkill, deepTaken, D, dApprox, enemy, em, lr, nt, ripple, mark: !!state.mark };
}

// 1ヒットあたりのダメージ（非会心 / 会心 / 期待値）
function hitDamage(res, skill) {
  const type = skill.type || "basic";
  const B = 1 + res.bAdd[type] + (skill.id === "main-frog" ? res.frogB : 0);
  const tide = type === "skill" ? res.tideSkill : 1;
  const deep = type === "ult" ? 1 : res.deepTaken;
  const tb = type === "basic" ? res.takenBasic : 1;
  const normal = res.atk * skill.mult * res.W * B * res.taken * tb * tide * deep * res.D;
  const crit = normal * res.critDmg;
  const rate = Math.min(Math.max(res.critRate[type], 0), 1);
  return { normal, crit, avg: normal * (1 - rate) + crit * rate, B, rate, hits: skill.hits || 1 };
}

// 主力として使うスキル（支援スキルは対象外）
function mainSkills() {
  return CHARACTERS[0].skills.filter(s => s.group !== "support");
}

// 実測との照合
function runMeasurement(m) {
  const res = compute({ emblems: m.emblems, lr: m.lr, notes: m.notes, enemy: m.enemy, ripple: m.ripple || 0, mark: !!m.mark, stack: m.stack || 0, frog: m.frog || 0, ult: m.ult || 0, tide: !!m.tide, skill15: !!m.skill15, deep24: !!m.deep24, r1: !!m.r1, r3: !!m.r3, r5: !!m.r5, r2: !!m.r2 });
  const skill = CHARACTERS[0].skills.find(s => s.id === m.hit);
  const d = hitDamage(res, skill);
  const predicted = m.crit ? d.crit : d.normal;
  return { predicted, measured: m.measured, diff: predicted / m.measured - 1 };
}

// 素質を1つ取った（またはレベルを上げた）ときの期待ダメージの増加率
function potentialGains(state, id, lv) {
  const out = {};
  const base = compute(state);
  const plus = compute(Object.assign({}, state, { pots: Object.assign({}, state.pots, { [id]: lv }) }));
  Object.entries(RANK_HITS).forEach(([type, hid]) => {
    const sk = CHARACTERS[0].skills.find(x => x.id === hid);
    out[type] = hitDamage(plus, sk).avg / hitDamage(base, sk).avg - 1;
  });
  return out;
}

// 徽章の強化項目を1つ足したときの期待ダメージの増加率（通常攻撃・スキル・必殺技）
const RANK_HITS = { basic: "basic-bubble-1", skill: "main-frog", ult: "ult-hit" };
function emblemGains(state, key, value) {
  const out = {};
  const base = compute(state);
  const plus = compute(Object.assign({}, state, { extraEm: Object.assign({}, state.extraEm, { [key]: ((state.extraEm || {})[key] || 0) + value }) }));
  Object.entries(RANK_HITS).forEach(([type, id]) => {
    const sk = CHARACTERS[0].skills.find(x => x.id === id);
    out[type] = hitDamage(plus, sk).avg / hitDamage(base, sk).avg - 1;
  });
  return out;
}


// ---- 支援キャラ（ナツカ・エレノア）の外のステータス ----
// 攻撃 = (Wiki基礎 + 信頼 + 心相の加算 + 徽章の基礎値) × (1 + 信頼% + 徽章% + 心相の%)  ← ウィローで確認した式と同じ形
// 風属性ダメージ・支援SP獲得効率は 基礎（100% / 75%）+ 徽章。画面の値と一致を確認（下の検証参照）。
function partyStatus(key, over) {
  const m = PARTY[key];
  const t = TREKKERS.find(x => x.en === m.en);
  const st = t.stats;
  const lv = st.hp.length - 1; // 最終要素 = Lv90（Wikiの配列は 10,20,…の突破前後を別項目で持つため 99 要素）
  const talent = Math.min(Math.max(over && over.talent != null ? over.talent : (m.talentUnlocked || 0), 0), 10);
  const tr = m.trust;
  const em = {};
  (over && over.embCfg || m.embCfg).forEach(e => e.slots.forEach(sl => {
    const o = EMBLEM_OPTIONS.find(x => x.key === sl.k);
    const v = o && o.tiers[sl.q];
    if (v != null && o.type === "stat") em[sl.k] = (em[sl.k] || 0) + v;
  }));
  const baseHp = st.hp[lv] + tr.hp + (st.talent.hp[talent] || 0) + (em.baseHp || 0);
  const baseAtk = st.atk[lv] + tr.atk + (st.talent.atk[talent] || 0) + (em.baseAtk || 0);
  const baseDef = st.def[lv] + (st.talent.def[talent] || 0) + (em.baseDef || 0);
  const hp = baseHp * (1 + (em.hpPct || 0));
  const atk = baseAtk * (1 + tr.atkPct + (em.atkPct || 0));
  const def = baseDef * (1 + (em.defPct || 0));
  return {
    baseHp, baseAtk, atkPctSum: tr.atkPct + (em.atkPct || 0), hpPctSum: em.hpPct || 0,
    hp, atk, def, hpPlus: hp - st.hp[lv], atkPlus: atk - st.atk[lv],
    critRate: 0.05 + (em.critRate || 0), critDmg: 1.5 + (em.critDmg || 0),
    elemDmg: 1 + (em.elemDmg || 0), spSupport: 0.75 + (em.spSupport || 0), spMain: 1 + (em.spMain || 0),
    resPen: em.resPen || 0, em,
  };
}

// ---- 支援キャラ（ナツカ・エレノア）の支援スキルのダメージ ----
// ダメージ = 攻撃力 × 倍率 × W × B × D。攻撃力 = (Wiki基礎+信頼+心相+徽章基礎+メイン基礎攻撃+サブ基礎攻撃)×(1+信頼%+徽章%+強撃の音符+コア%)
//   W = 1 + 同属性の(徽章+メイン+サブ+コア無条件+属性の音符)。B(スキル)=1+徽章+器用の音符。B(通常攻撃扱い)=1+徽章+集中の音符。
// 記録の固定加算（記録詳細の吹き出し「攻撃力が+N、最大HPが+M」）は、戦闘中に基礎攻撃力・基礎HPへ全員一律に加算される（ステータス画面には出ない）。
// 素質・心相の戦闘中効果は未反映（素質なしの状態で実測と一致を確認）。
function enemyWindD(enemyId) {
  const e = ENEMIES.find(x => x.id === enemyId);
  if (!e) return { D: 1, approx: true };
  if (e.Dwind != null) return { D: e.Dwind, approx: false };
  if (e.id === "floor1") return { D: e.D, approx: false };
  if (e.id === "none") return { D: 1, approx: false };
  return { D: e.D, approx: true };
}
function supportInRun(key, ctx) {
  const m = PARTY[key];
  const ps = partyStatus(key);
  const nt = noteTotals(ctx.notes);
  const lr = lostRecordTotals(ctx.lr, m.element, ctx.lrSub);
  const atk = (ps.baseAtk + lr.baseAtk + (ctx.flatAtk || 0)) * (1 + ps.atkPctSum + nt.atkPct + lr.atkPct);
  const hp = (ps.baseHp + lr.baseHp + (ctx.flatHp || 0)) * (1 + ps.hpPctSum + nt.hpPct);
  const elemNote = m.element === "風" ? nt.wind : m.element === "水" ? nt.water : 0;
  const W = 1 + (ps.em.elemDmg || 0) + lr.elemDmg + lr.coreElem + elemNote;
  const Bs = 1 + (ps.em.skillDmg || 0) + nt.skillDmg;
  const Bb = 1 + (ps.em.basicDmg || 0) + lr.basicDmg + nt.basicDmg;
  const critDmg = 1.5 + nt.critDmg + (ps.em.critDmg || 0);
  const rateBase = 0.05 + nt.critRate + (ps.em.critRate || 0);
  return { m, ps, nt, lr, atk, hp, atkRaw: ps.baseAtk + lr.baseAtk + (ctx.flatAtk || 0), pctSum: ps.atkPctSum + nt.atkPct + lr.atkPct, W, Bs, Bb, critDmg, rateSkill: rateBase + (ps.em.skillCritRate || 0), rateBasic: rateBase + (ps.em.basicCritRate || 0) };
}
const ENEMY_LV_DROP = 0; // ボスのレベルはダメージに影響しない（セイナの印ダメで Lv2=Lv9 が同値）。レベル＝HPゲージを空にした回数。
function supportHits(key) {
  const m = PARTY[key];
  const t = TREKKERS.find(x => x.en === m.en);
  const n = t.skills[2].nums[m.skillLv.support - 1].map(a => a[0]);
  if (key === "nazuka") return [
    { id: "orb", name: "花のオーブ（追撃の1発）", m: n[0], type: "skill", count: 1 },
    { id: "sea", name: "花の海（毎秒・6秒間）", m: n[1], type: "skill", count: 6 },
    { id: "petal", name: "花びら（6枚）", m: n[2], type: "skill", count: 6 }];
  if (key === "eleanor") return [
    { id: "jump", name: "跳びはね爆発", m: n[0], type: "skill", count: 9 },
    { id: "drone", name: "ドローンの弾（通常攻撃扱い・1発）", m: n[1], type: "basic", count: 1 }];
  return [];
}

// ---- 支援素質・ウィローのチーム効果の集計 ----
function supNums(key, en) {
  const t = TREKKERS.find(x => x.en === PARTY[key].en);
  for (const g of t.potentials.support) for (const p of g.potentials) if (p.name === en) return p.nums;
  return [];
}
function supEffVal(key, pot, e, lv) {
  if (e.fixed != null) return e.fixed;
  if (e.over && e.over[lv] != null) return e.over[lv];
  const arr = (supNums(key, pot.en)[e.num || 0]) || [0];
  return (arr.length === 1 ? arr[0] : potVal(arr, lv)) / 100;
}
const hitIn = (h, id) => h == null || (Array.isArray(h) ? h.indexOf(id) >= 0 : h === id);
// ctx.sup = { nazuka: { id: { lv, on, stk } }, eleanor: {...} }。on 省略時は素質定義の on（既定true）、stk 省略時は最大。
function supEntries(key, ctx) {
  const out = [];
  (SUP_POTS[key] || []).forEach(pot => {
    const s = ((ctx.sup || {})[key] || {})[pot.id];
    if (!s || !(s.lv > 0)) return;
    if (s.on == null ? pot.on === false : !s.on) return;
    pot.effects.forEach(e => out.push({ key, pot, e, lv: s.lv, stk: s.stk != null ? s.stk : (e.stk || 1) }));
  });
  return out;
}
// ウィローのチーム効果（風属性の味方に乗るもの）を最大スタックの willowStk 倍で集計
function willowTeam(ctx) {
  const r = { atkPct: (ctx.willowFrog || 0) * (ctx.frogV != null ? ctx.frogV : 0.133) + (ctx.willowUlt || 0) * (ctx.ultV != null ? ctx.ultV : 0.115), skillB: 0, taken: 1 }; // バブルフロッグのATK+13.3%/重・必殺技のATK+11.5%/重（チーム全体）
  const f = Math.min(Math.max(ctx.willowStk || 0, 0), 1);
  const N = ctx.willowN || {};
  const MAXS = { cumulus: 1, beach: 1, saibotsu: 8, nanairo: 8, yurameku: 4, chakuchi: 8 };
  // 重複数数: 個別指定があればそれ、なければ 最大×重複数率
  const cnt = id => (N[id] != null && N[id] !== "" ? Math.min(Math.max(+N[id], 0), MAXS[id]) : f * MAXS[id]);
  const pots = ctx.willowPots || {};
  const wt = TREKKERS.find(x => x.en === "Suntide Willow");
  const nums = en => { for (const g of wt.potentials.main) for (const p of g.potentials) if (p.name === en) return p.nums; return []; };
  POTENTIALS.forEach(p => {
    const lv = pots[p.id] || 0;
    if (!lv || !MAXS[p.id]) return;
    const share = cnt(p.id) / MAXS[p.id]; // 最大スタックに対する割合
    p.effects.forEach(e => {
      const v = e.fixed != null ? e.fixed : potVal(e.vals, lv); // 最大スタック時の合計
      if (e.k === "taken" && e.scope === "all") r.taken *= 1 + v * share;
      else if (p.id === "cumulus" || p.id === "beach" || p.id === "saibotsu") r.atkPct += v * share;
      else if (p.id === "chakuchi") {
        r.skillB += v * share;
        const ex = nums("Touch 'n' Bounce")[1];
        if (ex) r.skillB += potVal(ex, lv) / 100 * 8 * share; // 水属性以外はさらに加算（×最大8重）
      }
    });
  });
  return r;
}
function supMods(key, ctx) {
  const other = key === "nazuka" ? "eleanor" : "nazuka";
  const wt = willowTeam(ctx);
  const m = { atkPct: wt.atkPct, W: 0, taken: wt.taken, Bs: wt.skillB, hit: {}, extras: [], count: {} };
  const H = id => (m.hit[id] = m.hit[id] || { Bs: 0, Bb: 0, mult: 0, W: 0, critRate: 0, critDmg: 0, atkPctHit: 0, taken: 1 });
  const ids = (SUP_HITS[key] || []);
  const apply = (en, own) => {
    const v = supEffVal(en.key, en.pot, en.e, en.lv) * en.stk;
    const targets = en.e.hit == null ? ids : (Array.isArray(en.e.hit) ? en.e.hit : [en.e.hit]);
    switch (en.e.k) {
      case "atkPct": if (own) m.atkPct += v; break;
      case "W": if (own) { if (en.e.hit == null) m.W += v; else targets.forEach(t => (H(t).W += v)); } else if (en.e.team) m.W += v; break;
      case "taken": if (own || en.e.team) { if (en.e.hit == null) m.taken *= 1 + v; else targets.forEach(t => (H(t).taken *= 1 + v)); } break;
      case "Bs": case "Bb": case "mult": case "critRate": case "critDmg": case "atkPctHit":
        if (own) { if (en.e.hit == null) { if (en.e.k === "Bs") m.Bs += v; else ids.forEach(t => (H(t)[en.e.k] += v)); } else targets.forEach(t => (H(t)[en.e.k] += v)); }
        break;
      case "count": if (own) targets.forEach(t => (m.count[t] = (m.count[t] || 1) * (en.e.fixed != null ? en.e.fixed : 1 + v))); break;
      case "extra": if (own) m.extras.push({ id: "x:" + en.pot.id, name: en.e.name, m: en.e.num != null ? supNums(en.key, en.pot.en)[en.e.num][Math.min(Math.max(en.lv, 1), 6) - 1] : en.e.m, type: en.e.type, count: en.e.count, as: en.e.as, noW: !!en.e.noW }); break;
    }
  };
  supEntries(key, ctx).forEach(en => apply(en, true));
  supEntries(other, ctx).forEach(en => { if (en.e.team) apply(en, false); });
  return m;
}

function supportDamage(key, ctx) {
  const r = supportInRun(key, ctx);
  const d0 = enemyWindD(ctx.enemy);
  // ボスのレベルが上がるごとにDが下がる（実測の仮説: 1レベルあたり約1.2%）。Lv1=1
  const d = Object.assign({}, d0, { D: d0.D * Math.pow(1 - ENEMY_LV_DROP, Math.max((ctx.bossLv || 1) - 1, 0)) });
  const md = supMods(key, ctx);
  const one = (h, mh) => {
    mh = mh || md.hit[h.id] || {};
    const base = h.as ? (md.hit[h.as] || {}) : mh;
    const B = h.type === "basic" ? r.Bb + (base.Bb || 0) : r.Bs + md.Bs + (base.Bs || 0);
    const atk = r.atkRaw * (1 + r.pctSum + md.atkPct + (base.atkPctHit || 0));
    const W = r.W + md.W + (h.noW ? 0 : (base.W || 0));
    const cr = Math.min(Math.max((h.type === "basic" ? r.rateBasic : r.rateSkill) + (base.critRate || 0), 0), 1);
    const cd = r.critDmg + (base.critDmg || 0);
    const taken = md.taken * (base.taken || 1);
    const normal = atk * (h.m / 100) * (1 + (base.mult || 0)) * W * B * taken * d.D;
    const crit = normal * cd;
    const cnt = h.count * (md.count[h.id] || 1);
    return Object.assign({}, h, { normal, crit, avg: normal * (1 - cr) + crit * cr, rate: cr, count: cnt, total: (normal * (1 - cr) + crit * cr) * cnt, atk, W, B, taken });
  };
  const rows = supportHits(key).map(h => one(h));
  md.extras.forEach(x => rows.push(one({ id: x.id, name: x.name, m: x.m, type: x.type, count: x.count, as: x.as, noW: x.noW })));
  return Object.assign({}, r, { D: d.D, dApprox: d.approx, rows, mods: md });
}

if (typeof module !== "undefined") module.exports = { compute, hitDamage, runMeasurement, mainSkills, emblemGains, supportDamage };
