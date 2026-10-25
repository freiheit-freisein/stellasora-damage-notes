// 汎用計算エンジン（DOM非依存）。式は SUMMARY.md の「確認済みの事実」に従う。
//   ステータス = (基礎 + 信頼 + 心相 + ロスレコ基礎 + 記録レベル固定加算 + 徽章の基礎値 + その他の基礎加算) × (1 + %の加算) ＋ ③実数値(既定0)
//   戦闘中の値 = ステータス × ④開幕乗算(既定1) + ⑤戦闘中の実数値(既定0)    ※③④⑤は「今のところ見つかっていない」ので 0・1 のまま
//   ダメージ = 参照ステータス × 倍率 × W(属性) × B(種別) × 被ダメージ(別枠) × D(敵: 防御×弱点×耐性×その他) [× 会心] [× 印の別枠]
(function (S) {
  const last = a => a[a.length - 1];
  const TK = en => TREKKERS.find(x => x.en === en);
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  // 耐性（コミュニティの式 + 実測）。E = 耐性 − 貫通。
  function resMult(E) {
    if (E <= 0) return 1;
    if (E <= 250) return 1 - 0.25 * Math.pow(E / 250, 2);
    if (E <= 750) return 1 - (0.35 + 0.25 * Math.pow((E - 251) / 499, 2));
    return 1 - (0.9 + 0.09 * Math.pow((E - 751) / 1249, 2));
  }
  function enemyD(en, el, pen, G) {
    const res = en.res[el] != null ? en.res[el] : 250;
    const weak = en.weak.indexOf(el) >= 0;
    const parts = { def: en.def, weak: weak ? en.weakMult : 1, res: resMult(res - pen), extra: (en.extra && en.extra[el]) || 1 };
    parts.D = parts.def * parts.weak * parts.res * parts.extra;
    return parts;
  }

  // 敵の数値の上書き（空欄は既定のまま）
  function mergeEnemy(base, ov) {
    const e = JSON.parse(JSON.stringify(base));
    if (!ov) return e;
    ["def", "weakMult", "markX"].forEach(k => { if (ov[k] != null && ov[k] !== "") e[k] = +ov[k]; });
    Object.keys(ov.res || {}).forEach(el => { if (ov.res[el] != null && ov.res[el] !== "") e.res[el] = +ov.res[el]; });
    e.extra = e.extra || {};
    Object.keys(ov.extra || {}).forEach(el => { if (ov.extra[el] != null && ov.extra[el] !== "") e.extra[el] = +ov.extra[el]; });
    return e;
  }

  // 倍率（%）。Lv11以上は (Lv10−Lv1)/9 の傾きで延長
  function skillVal(c, s, n, lv) {
    const arr = TK(c.en).skills[s].nums;
    lv = Math.max(1, Math.round(lv));
    if (lv <= arr.length) return arr[lv - 1][n][0];
    const v10 = arr[arr.length - 1][n][0], v1 = arr[0][n][0];
    return v10 + (v10 - v1) / (arr.length - 1) * (lv - arr.length);
  }
  function recordBonus(lv) {
    const r = (window.RECORD_LEVELS || []).find(x => x[0] === lv);
    return r ? { atk: r[2], hp: r[3] } : { atk: 0, hp: 0 };
  }
  function emblemSum(cfg, on) {
    const t = {};
    (cfg || []).forEach((e, i) => {
      if (on && on[i] === 0) return;
      e.slots.forEach(sl => {
        if (!sl.k) return;
        const o = EMBLEM_OPTIONS.find(x => x.key === sl.k);
        const v = o && o.tiers[sl.q];
        if (v != null && o.type === "stat") t[sl.k] = (t[sl.k] || 0) + v;
      });
    });
    return t;
  }
  function noteSum(notes, el) {
    const t = { atkPct: 0, critRate: 0, critDmg: 0, hpPct: 0, basicDmg: 0, skillDmg: 0, ultDmg: 0, elem: 0 };
    const key = { atkPct: "atkPct", critRate: "critRate", critDmg: "critDmg", hpPct: "hpPct", basicDmg: "basicDmg", skillDmg: "skillDmg", ultDmg: "ultDmg" };
    Object.entries(notes || {}).forEach(([name, lv]) => {
      const n = NOTES[name];
      if (!n) return;
      const v = n.perLv * clamp(lv || 0, 0, 99);
      if (key[n.stat]) t[key[n.stat]] += v;
      else if (n.stat === "elemDmg:" + el) t.elem += v;
    });
    return t;
  }
  function lrSum(G, el) {
    const t = { baseAtk: 0, baseHp: 0, elem: 0, basicDmg: 0, skillDmg: 0, atkPct: 0 };
    const add = (id, isMain) => {
      const r = (window.LOSTRECORDS || []).find(x => x.id === id);
      if (!r) return;
      const s = r.stats || {}, m = !r.element || r.element === el;
      t.baseAtk += s.baseAtk || 0; t.baseHp += s.baseHp || 0;
      if (m) t.elem += s.elemDmg || 0;
      t.basicDmg += s.basicDmg || 0;
      const a = isMain && r.core && r.core.always;
      if (a) { if (m) t.elem += a.elemDmg || 0; t.atkPct += a.atkPct || 0; }
    };
    (G.lrMain || []).forEach(id => add(id, true));
    (G.lrSub || []).forEach(id => add(id, false));
    const u = G.lrManual || {};
    t.baseAtk += u.baseAtk || 0; t.baseHp += u.baseHp || 0; t.basicDmg += u.basicDmg || 0; t.skillDmg += u.skillDmg || 0; t.atkPct += u.atkPct || 0;
    if (u.elem && (!u.elemEl || u.elemEl === el)) t.elem += u.elem;
    return t;
  }

  // 1人分のステータス。cs.mode==="manual" なら画面の値の手入力をそのまま使う
  function stats(c, cs, G, isMain, ag) {
    ag = ag || { atkFlat: 0, hpFlat: 0, pen: 0 };
    const el = c.el;
    const em = emblemSum(cs.emb, cs.embOn);
    const nt = noteSum(G.notes, el);
    const lr = lrSum(G, el);
    const rec = recordBonus(G.recordLv || 0);
    const w = TK(c.en), wst = w && w.stats;
    const tab = (wst || TK(c.manual.tables).stats);
    const tl = clamp(cs.trustLv || 0, 0, 99), tu = clamp((cs.talent || 0) / 5, 0, 10);   // 心相は段階(0〜50)で持つ。表は5段階ごと
    const baseHp0 = wst ? last(wst.hp) : c.manual.baseHp, baseAtk0 = wst ? last(wst.atk) : c.manual.baseAtk;
    const trustHp = tab.trust.hp[tl], trustAtk = tab.trust.atk[tl];
    const trustPct = wst ? tab.trust.atkPct[tl] : tab.trust.atkPct[tl] * 0.5;   // 手入力キャラは推定（セイナ: 信頼HP+6%）
    const talHp = wst ? (wst.talent.hp[tu] || 0) : tu * c.manual.talent.hp;
    const talAtk = wst ? (wst.talent.atk[tu] || 0) : tu * c.manual.talent.atk;
    const talPct = wst ? (wst.talent.atkPct[tu] || 0) : 0;
    // 戦闘中だけの心相（外の画面には出ない）
    let battleHpPct = 0;
    if (c.id === "noya" && tu >= 4) battleHpPct += 0.10;          // 心相2: 最大HP+10%
    if (isMain && G.enemyObj && G.enemyObj.hpBonus) battleHpPct += G.enemyObj.hpBonus;   // 深層ノ主: 主力の最大HP+20%
    const o = cs.add || {};
    const tb = c.talentBonus || {};   // 心相で付くダメージ種別の加算（1段階あたり）
    const baseAtk = baseAtk0 + trustAtk + talAtk + lr.baseAtk + rec.atk + (em.baseAtk || 0) + (o.atkFlat || 0) + ag.atkFlat;
    const baseHp = baseHp0 + trustHp + talHp + lr.baseHp + rec.hp + (em.baseHp || 0) + (o.hpFlat || 0) + ag.hpFlat;
    const atkPct = (c.ref === "atk" ? trustPct : 0) + talPct + (em.atkPct || 0) + lr.atkPct + nt.atkPct + (o.atkPct || 0);
    const hpPct = (c.ref === "hp" ? trustPct : 0) + (em.hpPct || 0) + nt.hpPct + battleHpPct + (o.hpPct || 0);
    const slot = { atk3: 0, atk4: 1, atk5: 0, hp3: 0, hp4: 1, hp5: 0 };   // ③実数値 ④開幕乗算 ⑤戦闘中の実数値（未発見のため 0・1）
    let atk = (baseAtk * (1 + atkPct) + slot.atk3) * slot.atk4 + slot.atk5;
    let hp = (baseHp * (1 + hpPct) + slot.hp3) * slot.hp4 + slot.hp5;
    const r = {
      baseAtk, baseHp, atkPct, hpPct, atk, hp, trustAtk, trustHp, talAtk, talHp, rec, em, nt, lr, baseHp0, baseAtk0,
      elemAdd: lr.elem + nt.elem + (em.elemDmg || 0) + (o.elem || 0) + tu * (tb.elem || 0),
      basicAdd: (em.basicDmg || 0) + lr.basicDmg + nt.basicDmg + (o.basic || 0) + tu * (tb.basic || 0),
      skillAdd: (em.skillDmg || 0) + lr.skillDmg + nt.skillDmg + (o.skill || 0) + tu * (tb.skill || 0),
      ultAdd: (em.ultDmg || 0) + nt.ultDmg + (o.ult || 0) + tu * (tb.ult || 0),
      markAdd: (em.markDmg || 0) + (o.mark || 0),
      critRate: 0.05 + nt.critRate + (em.critRate || 0) + (o.critRate || 0),
      critDmg: 1.5 + nt.critDmg + (em.critDmg || 0) + (o.critDmg || 0) + tu * (tb.crit || 0),
      pen: (em.resPen || 0) + (o.pen || 0) + ag.pen,
      rateAdd: { basic: em.basicCritRate || 0, skill: em.skillCritRate || 0, ult: em.ultCritRate || 0, mark: em.markCritRate || 0 },
      mode: "auto",
    };
    if (cs.mode === "manual") {
      const m = cs.manual || {};
      r.mode = "manual";
      r.atk = m.atk || 0; r.hp = m.hp || 0;
      r.elemAdd = (m.elem || 0) / 100; r.basicAdd = (m.basic || 0) / 100; r.skillAdd = (m.skill || 0) / 100; r.ultAdd = (m.ult || 0) / 100; r.markAdd = (m.mark || 0) / 100;
      r.critRate = (m.critRate != null ? m.critRate : 5) / 100; r.critDmg = (m.critDmg != null ? m.critDmg : 150) / 100; r.pen = (m.pen || 0) + ag.pen;
      r.rateAdd = { basic: 0, skill: 0, ult: 0, mark: 0 };
    }
    return r;
  }

  // 素質などの効果（検証済みの分だけ）。返り値は 全ヒット共通の加算と、ヒットごとの加算
  function effects(c, cs, G, team, ag) {
    const e = { atkPct: 0, W: 0, Bb: 0, Bs: 0, Bu: 0, taken: 1, takenSkill: 1, hit: {}, count: {}, extras: [], applied: [] };
    const inTeam = id => team.indexOf(id) >= 0;
    // ウィローがいるとき: チーム効果（風属性の味方に乗るもの）
    if (c.id !== "willow" && inTeam("willow") && G.chars.willow && G.chars.willow.pots) {
      const ctx = { willowPots: G.chars.willow.pots, willowStk: G.willowStk != null ? G.willowStk : 1, willowN: G.willowN || {}, willowFrog: G.willowFrog || 0, willowUlt: G.willowUlt || 0 };
      const wt = willowTeam(ctx);
      e.atkPct += wt.atkPct; e.Bs += wt.skillB; e.taken *= wt.taken;
      e.applied.push("ウィローのチーム効果");
    }
    if (c.id === "willow") {
      const pa = { atkPct: 0, skillB: 0, ultB: 0, frogB: 0, waterAdd: 0 };
      const tk = { v: 1 };
      (POTENTIALS || []).forEach(p => {
        const lv = ((cs.pots || {})[p.id]) || 0;
        if (!lv) return;
        p.effects.forEach(x => {
          const v = x.fixed != null ? x.fixed : potVal(x.vals, lv);
          if (x.k === "taken") tk.v *= 1 + v; else pa[x.k] = (pa[x.k] || 0) + v;
        });
      });
      e.atkPct += pa.atkPct; e.Bs += pa.skillB; e.Bu += pa.ultB; e.W += pa.waterAdd; e.taken *= tk.v;
      e.hit.frog = { Bs: pa.frogB };
      e.applied.push("ウィローの素質");
    }
    if (c.id === "nazuka" || c.id === "eleanor") {
      const ctx = { sup: { nazuka: inTeam("nazuka") ? (G.chars.nazuka.sup || {}) : {}, eleanor: inTeam("eleanor") ? (G.chars.eleanor.sup || {}) : {} }, willowPots: {} };
      const md = supMods(c.id, ctx);
      e.atkPct += md.atkPct; e.W += md.W; e.Bs += md.Bs; e.taken *= md.taken; e.hit = Object.assign(e.hit, md.hit); e.count = md.count; e.extras = md.extras;
      e.applied.push("素質(検証済み分)");
    }
    if (ag) {
      e.atkPct += ag.atkPct; e.W += ag.W; e.Bs += ag.Bs; e.Bb += ag.Bb; e.Bu += ag.Bu; e.taken *= ag.taken; e.ag = ag;
      if (ag.applied.length) e.applied.push("光チームの素質 " + ag.applied.length + "件");
    }
    return e;
  }

  const TYPE_NAME = { basic: "通常攻撃", skill: "スキル", ult: "必殺技", mark: "印" };
  // 技グループ（basic/main/support/ult）の全ヒットを計算
  function groupDamage(c, cs, G, team, group, isMain, st, ef) {
    const lvKey = { basic: "basic", main: "main", support: "support", ult: "ult" }[group];
    const lv = ((cs.skillLv || {})[lvKey]) || 10;
    const en = G.enemyObj;
    const ag = ef.ag || { mods: [], xhits: [], count: {}, drop: {}, markAdd: 0, takenMark: 1, takenSkill: 1 };
    // ヒットの一覧: 基本のヒット（置き換え・回数の加算を反映）＋素質の追加ヒット
    const defs = (c.hits[group] || []).filter(h => !(h.id && ag.drop[h.id])).map(h => Object.assign({}, h, { c: h.c + ((h.id && ag.count[h.id]) || 0) }));
    const xs = ag.xhits.filter(x => x.group === group || x.group === "*");
    xs.filter(x => !x.perGlow && !x.perTag).forEach(x => defs.push({ fixed: x.m, c: x.c, t: x.t, name: x.name, tags: x.tags, extra: true }));
    const tagCount = tag => defs.reduce((n, h) => n + ((h.tags || []).indexOf(tag) >= 0 ? h.c : 0), 0);
    xs.filter(x => x.perGlow || x.perTag).forEach(x => {
      const n = tagCount(x.perGlow ? "glow" : x.perTag);
      if (n > 0) defs.push({ fixed: x.m, c: n, t: x.t, name: x.name, tags: x.tags, extra: true });
    });
    const other = G.other || {};
    const traits = G.traits || {};
    let totMult = 0, totExp = 0, totNon = 0, totCrit = 0;
    const rows = defs.map(h => {
      const m = h.fixed != null ? h.fixed : skillVal(c, h.s, h.n, lv);
      const type = h.t;
      const hid = h.id || null;
      const mh = (hid && ef.hit[hid]) || {};
      const tags = h.tags || [];
      // タグで指定された効果（長剣・光刃など）
      let mAdd = 0, bAdd = 0, crAdd = 0, cdAdd = 0;
      ag.mods.forEach(mo => {
        if (mo.tags && !mo.tags.some(t => tags.indexOf(t) >= 0)) return;
        if (mo.ht && mo.ht !== type) return;
        if (mo.k === "mult") mAdd += mo.v;
        else if (mo.k === "critRate") crAdd += mo.v;
        else if (mo.k === "critDmg") cdAdd += mo.v;
        else if (mo.k === "Bs" && type === "skill") bAdd += mo.v;
        else if (mo.k === "Bb" && type === "basic") bAdd += mo.v;
      });
      let refVal;
      if (c.ref === "hp") refVal = st.hp;
      else if (st.mode === "auto") refVal = st.baseAtk * (1 + st.atkPct + ef.atkPct + (mh.atkPctHit || 0));   // 素質由来の攻撃力%を足す
      else refVal = st.atk * (1 + ef.atkPct + (mh.atkPctHit || 0));
      const W = 1 + st.elemAdd + ef.W + (mh.W || 0);
      let B;
      if (type === "basic") B = 1 + st.basicAdd + ef.Bb + (mh.Bb || 0) + bAdd;
      else if (type === "skill") B = 1 + st.skillAdd + ef.Bs + (mh.Bs || 0) + bAdd;
      else if (type === "ult") B = 1 + st.ultAdd + ef.Bu;
      else B = 1 + st.markAdd + ag.markAdd;
      let taken = ef.taken * (mh.taken || 1) * (other.taken || 1);
      if (type === "mark") taken *= ag.takenMark;
      if (type === "skill") taken *= ag.takenSkill;
      if (traits.crack && type === "skill") taken *= 1.15;
      if (traits.chase && (type === "skill" || type === "basic")) taken *= 1.24;
      const dd = enemyD(en, c.el, st.pen, G);
      const markX = type === "mark" ? (en.markX || 1) : 1;
      const mult = m / 100 * (1 + (mh.mult || 0)) * (1 + mAdd);
      const normal = refVal * mult * W * B * taken * dd.D * markX * (other.mult || 1);
      let cd = st.critDmg + (mh.critDmg || 0) + cdAdd;
      if (type === "mark" && G.heartCrit && c.id === "noya") cd += 0.12;           // 心相1 閃星中: 会心+12%（印の会心 1.74）
      const rate = clamp(st.critRate + (st.rateAdd[type] || 0) + (mh.critRate || 0) + crAdd, 0, 1);
      const crit = normal * cd;
      const avg = normal * (1 - rate) + crit * rate;
      const cnt = h.c * ((hid && ef.count[hid]) || 1);
      totMult += mult * cnt; totExp += avg * cnt; totNon += normal * cnt; totCrit += crit * cnt;
      return { name: h.name, type, mult: mult * 100, count: cnt, normal, crit, avg, total: avg * cnt, W, B, taken, D: dd.D, rate, markX, extra: !!h.extra };
    });
    return { rows, totMult, totExp, totNon, totCrit };
  }

  // ---- 全体 ----
  // G = { team:{main,s1,s2}, recordLv, enemy, traits, notes, lrMain, lrSub, lrManual, other, chars:{id:cs} }
  function calcTeam(G) {
    G.enemyObj = mergeEnemy(S.ENEMIES.find(x => x.id === G.enemy) || S.ENEMIES[0], G.enemyOv);
    const team = [G.team.main, G.team.s1, G.team.s2];
    const out = { team: {}, G };
    const agg = S.collectPots ? S.collectPots(G, team) : {};
    team.forEach((id, i) => {
      const c = S.CH.find(x => x.id === id);
      const cs = G.chars[id];
      const isMain = i === 0;
      const st = stats(c, cs, G, isMain, agg[id]);
      const ef = effects(c, cs, G, team, agg[id]);
      const o = { c, cs, st, ef, isMain, groups: {} };
      ["basic", "main", "support", "ult"].forEach(g => { o.groups[g] = groupDamage(c, cs, G, team, g, isMain, st, ef); });
      out.team[id] = o;
    });
    return out;
  }

  S.engine = { calcTeam, stats, skillVal, enemyD, resMult, recordBonus, emblemSum, noteSum, lrSum, TYPE_NAME };
  if (typeof module !== "undefined") module.exports = S.engine;
})(window.SIM);
