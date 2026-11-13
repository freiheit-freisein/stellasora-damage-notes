// 汎用計算エンジン（DOM非依存）。式は SUMMARY.md の「確認済みの事実」に従う。
//   ステータス = (基礎 + 信頼 + 心相 + ロスレコ基礎 + 記録レベル固定加算 + 徽章の基礎値 + その他の基礎加算) × (1 + %の加算) ＋ ③実数値(既定0)
//   戦闘中の値 = ステータス × ④開幕乗算(既定1) + ⑤戦闘中の実数値(既定0)    ※③④⑤は「今のところ見つかっていない」ので 0・1 のまま
//   ダメージ = 参照ステータス × 倍率 × W(属性) × B(種別) × 被ダメージ(別枠) × D(敵: 防御×弱点×耐性×その他) [× 会心] [× 印の別枠]
(function (S) {
  const last = a => a[a.length - 1];
  const TK = en => TREKKERS.find(x => x.en === en);
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  // 耐性（コミュニティの式 + 実測）。E = 耐性 − 貫通。貫通は 250 まで（ゲーム内の説明「効果の適用上限は250」）
  const PEN_CAP = 250;
  function resMult(E) {
    if (E <= 0) return 1;
    if (E <= 250) return 1 - 0.25 * Math.pow(E / 250, 2);
    if (E <= 750) return 1 - (0.35 + 0.25 * Math.pow((E - 251) / 499, 2));
    return 1 - (0.9 + 0.09 * Math.pow((E - 751) / 1249, 2));
  }
  // 防御（コミュニティの式＋空壺ノ王の実測8点で確認・2026-11-11）。係数 = 1 − 40D ÷ (32D + 24000)、D = 防御力 − 防御貫通 − 防御力低下（0より下にならない）
  //   敵ごとの防御倍率（en.def。ボス 0.5 ＝防御力500）から防御力を逆算して、防御貫通・防御力低下（defX）を引く。防御倍率 1 の敵は防御力0なので変わらない
  const defCoef = D => 1 - 40 * D / (32 * D + 24000);
  const defOf = c => c >= 1 ? 0 : 24000 * (1 - c) / (32 * c + 8);
  function defMult(c, x) {
    if (!(x > 0)) return c;
    return defCoef(Math.max(0, defOf(c) - x));
  }
  function enemyD(en, el, pen, G, defX) {
    const res = en.res[el] != null ? en.res[el] : (en.resDefault != null ? en.resDefault : 250);   // 書いていない属性は resDefault（ボスは等倍＝750）
    const weak = en.weak.indexOf(el) >= 0;
    const parts = { def: defMult(en.def, defX || 0), defX: defX || 0, weak: weak ? en.weakMult : 1, res: resMult(res - Math.min(pen || 0, PEN_CAP)), extra: (en.extra && en.extra[el]) || 1 };
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
  // charMain = この巡遊者が主力か。メインのロスレコのコア効果のうち、対象が主力のもの（朝靄など）は主力にだけ乗る（2026-10-29 実測）
  function lrSum(G, el, charMain) {
    const t = { baseAtk: 0, baseHp: 0, elem: 0, basicDmg: 0, skillDmg: 0, ultDmg: 0, atkPct: 0 };
    const add = (id, isMain) => {
      const r = (window.LOSTRECORDS || []).find(x => x.id === id);
      if (!r) return;
      const s = r.stats || {}, m = !r.element || r.element === el;
      t.baseAtk += S.lrBaseAtk ? S.lrBaseAtk(G, id) : (s.baseAtk || 0); t.baseHp += s.baseHp || 0;   // 基礎攻撃力は突破で変わる（sim_lr.js）
      if (m) t.elem += s.elemDmg || 0;
      t.basicDmg += s.basicDmg || 0; t.skillDmg += s.skillDmg || 0; t.ultDmg += s.ultDmg || 0;
      const a = isMain && r.core && r.core.always && (r.core.always.target !== "main" || charMain) && r.core.always;
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
    ag = ag || { atkFlat: 0, hpFlat: 0, pen: 0, hpPct: 0 };
    const el = c.el;
    const em = emblemSum(cs.emb, cs.embOn);
    const nt = noteSum(S.notesTotal ? S.notesTotal(G) : G.notes, el);
    const lr = lrSum(G, el, isMain);
    const rec = recordBonus(G.recordLv || 0);
    const w = TK(c.en), wst = w && w.stats;
    const tab = (wst || TK(c.manual.tables).stats);
    const tl = clamp(cs.trustLv || 0, 0, 99), tu = clamp((cs.talent || 0) / 5, 0, 10);   // 心相は段階(0〜50)で持つ。表は5段階ごと
    const baseHp0 = wst ? last(wst.hp) : c.manual.baseHp, baseAtk0 = wst ? last(wst.atk) : c.manual.baseAtk;
    const trustHp = tab.trust.hp[tl], trustAtk = tab.trust.atk[tl];
    const trustPct = wst ? tab.trust.atkPct[tl] : tab.trust.atkPct[tl] * 0.5;   // 手入力キャラは、借りた表の%を半分に（セイナ: 信頼Lv21で 基礎HP5,671・基礎攻撃612・HP8%、Lv22で+334・+36 と画面で確認済み）
    const talHp = wst ? (wst.talent.hp[tu] || 0) : tu * c.manual.talent.hp;
    const talAtk = wst ? (wst.talent.atk[tu] || 0) : tu * c.manual.talent.atk;
    const talPct = wst ? (wst.talent.atkPct[tu] || 0) : 0;
    // 戦闘中だけの心相（外の画面には出ない）
    let battleHpPct = 0;
    if (isMain && G.enemyObj && G.enemyObj.hpBonus) battleHpPct += G.enemyObj.hpBonus;   // 深層ノ主: 主力の最大HP+20%
    const eo = G.enemyObj || {};      // 防衛戦: 全員の最大HP+15%・攻撃+15%・会心率+10%（実測で確認）
    battleHpPct += eo.teamHp || 0;
    const o = cs.add || {};
    const tb = c.talentBonus || {};   // 心相で付くダメージ種別の加算（1段階あたり）
    const baseAtk = baseAtk0 + trustAtk + talAtk + lr.baseAtk + rec.atk + (em.baseAtk || 0) + (o.atkFlat || 0) + ag.atkFlat;
    const baseHp = baseHp0 + trustHp + talHp + lr.baseHp + rec.hp + (em.baseHp || 0) + (o.hpFlat || 0) + ag.hpFlat;
    const atkPct = (c.ref === "atk" ? trustPct : 0) + talPct + (em.atkPct || 0) + lr.atkPct + nt.atkPct + (o.atkPct || 0) + (eo.teamAtk || 0);
    const hpPct = (c.ref === "hp" ? trustPct : 0) + (em.hpPct || 0) + nt.hpPct + battleHpPct + (o.hpPct || 0) + (ag.hpPct || 0);
    const slot = { atk3: 0, atk4: 1, atk5: 0, hp3: 0, hp4: 1, hp5: 0 };   // ③実数値 ④開幕乗算 ⑤戦闘中の実数値（未発見のため 0・1）
    let atk = (baseAtk * (1 + atkPct) + slot.atk3) * slot.atk4 + slot.atk5;
    let hp = (baseHp * (1 + hpPct) + slot.hp3) * slot.hp4 + slot.hp5;
    const r = {
      baseAtk, baseHp, atkPct, hpPct, atk, hp, trustAtk, trustHp, talAtk, talHp, rec, em, nt, lr, baseHp0, baseAtk0,
      elemAdd: lr.elem + nt.elem + (em.elemDmg || 0) + (o.elem || 0) + tu * (tb.elem || 0),
      basicAdd: (em.basicDmg || 0) + lr.basicDmg + nt.basicDmg + (o.basic || 0) + tu * (tb.basic || 0),
      skillAdd: (em.skillDmg || 0) + lr.skillDmg + nt.skillDmg + (o.skill || 0) + tu * (tb.skill || 0),
      ultAdd: (em.ultDmg || 0) + lr.ultDmg + nt.ultDmg + (o.ult || 0) + tu * (tb.ult || 0),
      markAdd: (em.markDmg || 0) + (o.mark || 0),
      critRate: 0.05 + nt.critRate + (em.critRate || 0) + (o.critRate || 0) + (eo.teamCrit || 0),
      critDmg: 1.5 + nt.critDmg + (em.critDmg || 0) + (o.critDmg || 0) + tu * (tb.crit || 0),
      pen: (em.resPen || 0) + (o.pen || 0) + ag.pen,
      rateAdd: { basic: em.basicCritRate || 0, skill: em.skillCritRate || 0, ult: em.ultCritRate || 0, mark: em.markCritRate || 0 },
      mode: "auto",
    };
    r.lvBonus = S.emblemExtra(cs.emb, cs.embOn).lv;
    // 直接入力: 入力のある欄は「戦闘中の最終の値」として使う（素質・ロスレコなどの戦闘中の効果は、その欄には足さない）。空欄は計算のまま。
    // 長剣・光刃など、攻撃を限った効果と、ヒットごとの効果だけは、入力した値にも足す
    const m = cs.manual || {};
    const has = k => G.directPriority !== false && m[k] != null && m[k] !== "";
    if (has("hp")) r.hp = +m.hp;
    if (has("atk")) { r.atk = +m.atk; r.mode = "manual"; }
    if (has("elem")) r.elemAdd = m.elem / 100;
    if (has("basic")) r.basicAdd = m.basic / 100;
    if (has("skill")) r.skillAdd = m.skill / 100;
    if (has("ult")) r.ultAdd = m.ult / 100;
    if (has("mark")) r.markAdd = m.mark / 100;
    if (has("critRate")) r.critRate = m.critRate / 100;
    if (has("critDmg")) r.critDmg = m.critDmg / 100;
    if (has("pen")) r.pen = +m.pen;
    r.man = {};
    ["hp", "atk", "elem", "basic", "skill", "ult", "mark", "critRate", "critDmg", "pen"].forEach(k => { if (has(k)) r.man[k] = true; });
    return r;
  }


  // 「ステータス画面」の値（外の画面）。ロスレコ・記録・音符・戦闘中の効果は入らない（実測で確認）
  function outsideStats(c, cs) {
    const em = emblemSum(cs.emb, cs.embOn);
    const w = TK(c.en), wst = w && w.stats;
    const tab = (wst || TK(c.manual.tables).stats);
    const tl = clamp(cs.trustLv || 0, 0, 99), tu = clamp((cs.talent || 0) / 5, 0, 10);
    const baseHp0 = wst ? last(wst.hp) : c.manual.baseHp, baseAtk0 = wst ? last(wst.atk) : c.manual.baseAtk;
    const trustPct = wst ? tab.trust.atkPct[tl] : tab.trust.atkPct[tl] * 0.5;
    const talHp = wst ? (wst.talent.hp[tu] || 0) : tu * c.manual.talent.hp;
    const talAtk = wst ? (wst.talent.atk[tu] || 0) : tu * c.manual.talent.atk;
    const talPct = wst ? (wst.talent.atkPct[tu] || 0) : 0;
    const tb = c.talentBonus || {};
    const hp = (baseHp0 + tab.trust.hp[tl] + talHp + (em.baseHp || 0)) * (1 + (c.ref === "hp" ? trustPct : 0) + (em.hpPct || 0));
    const atk = (baseAtk0 + tab.trust.atk[tl] + talAtk + (em.baseAtk || 0)) * (1 + (c.ref === "atk" ? trustPct : 0) + talPct + (em.atkPct || 0));
    return { hp, atk, critRate: 0.05 + (em.critRate || 0), critDmg: 1.5 + (em.critDmg || 0) + tu * (tb.crit || 0), elemAdd: (em.elemDmg || 0) + tu * (tb.elem || 0), pen: em.resPen || 0 };
  }

  // 素質などの効果（検証済みの分だけ）。返り値は 全ヒット共通の加算と、ヒットごとの加算
  function effects(c, cs, G, team, ag) {
    const e = { atkPct: 0, W: 0, Bb: 0, Bs: 0, Bu: 0, taken: 1, takenSkill: 1, hit: {}, count: {}, extras: [], applied: [] };
    const inTeam = id => team.indexOf(id) >= 0;
    // ウィローがいるとき: チーム効果（風属性の味方に乗るもの）
    if (c.id !== "willow" && inTeam("willow") && G.chars.willow) {   // 主力スキル・必殺技の攻撃力アップ（素質は data/spec_user.js の表で計算）
      const wc = S.CH.find(x => x.id === "willow"), wcs = G.chars.willow, wlb = S.emblemExtra(wcs.emb, wcs.embOn).lv;
      const ctx = { willowPots: {}, willowStk: G.willowStk != null ? G.willowStk : 1, willowN: G.willowN || {}, willowFrog: G.willowFrog || 0, willowUlt: G.willowUlt || 0,
        frogV: skillVal(wc, 1, 1, ((wcs.skillLv || {}).main || 10) + wlb.main) / 100, ultV: skillVal(wc, 3, 2, ((wcs.skillLv || {}).ult || 10) + wlb.ult) / 100 };   // バフの値はスキルLvで変わる
      const wt = willowTeam(ctx);
      e.atkPct += wt.atkPct; e.Bs += wt.skillB; e.taken *= wt.taken;
      e.applied.push("ウィローのチーム効果");
    }
    // ナツカ・エレノアの素質も、ほかの巡遊者と同じ data/spec_user.js（素質の表）で計算する（ナツカは 2026-11-07 から）
    if (ag) {
      e.atkPct += ag.atkPct; e.W += ag.W; e.Bs += ag.Bs; e.Bb += ag.Bb; e.Bu += ag.Bu; e.taken *= ag.taken; e.ag = ag;
      if (ag.applied.length) e.applied.push("素質など " + ag.applied.length + "件");
    }
    return e;
  }

  // 会心のうち、攻撃の種類で決まる個別の分（徽章の種類別の会心率＋種類を指定した素質・ロスレコの効果）。共通の分は入れない
  function typeCrit(st, ag, k0, t) {
    let v = k0 === "critRate" ? (st.rateAdd[t] || 0) : 0;
    (ag.mods || []).forEach(mo => { if (mo.k === k0 && !mo.tags && !mo.grp && mo.ht === t) v += mo.v; });
    return v;
  }
  const TYPE_NAME = { basic: "通常攻撃", skill: "スキル", ult: "必殺技", mark: "印" };
  // 技グループ（basic/main/support/ult）の全ヒットを計算
  function groupDamage(c, cs, G, team, group, isMain, st, ef) {
    const lvKey = { basic: "basic", main: "main", support: "support", ult: "ult" }[group];
    const lv = (((cs.skillLv || {})[lvKey]) || 10) + ((st.lvBonus && st.lvBonus[lvKey]) || 0);   // 徽章のスキルレベル上昇を足す
    const en = G.enemyObj;
    const ag = ef.ag || { mods: [], xhits: [], count: {}, drop: {}, markAdd: 0, takenMark: 1, takenSkill: 1 };
    // ヒットの一覧: 基本のヒット（置き換え・回数の加算を反映）＋素質の追加ヒット
    const defs = (c.hits[group] || []).filter(h => !(h.id && ag.drop[h.id])).map(h => Object.assign({}, h, { c: (h.c + ((h.id && ag.count[h.id]) || 0)) * ((h.id && (ag.countMul || {})[h.id]) || 1) }));
    const xs = ag.xhits.filter(x => x.group === group || x.group === "*");
    // コア素質の追加ヒット（lvOf）は、つながるスキルのLv（徽章込み）で伸ばす（m は Lv10 の値）
    const lvScale = k => { const i = { basic: 0, main: 1, support: 2, ult: 3 }[k], L = ((cs.skillLv || {})[k] || 10) + ((st.lvBonus && st.lvBonus[k]) || 0); return skillVal(c, i, 0, L) / skillVal(c, i, 0, 10); };
    xs.forEach(x => { if (x.lvOf) x = Object.assign(x, { m0: x.m0 != null ? x.m0 : x.m }), x.m = x.m0 * lvScale(x.lvOf); });
    xs.filter(x => !x.perGlow && !x.perTag && !x.tagBonus).forEach(x => defs.push({ fixed: x.m, c: x.c, t: x.t, name: x.name, tags: x.tags, extra: true }));
    const tagCount = tag => defs.reduce((n, h) => n + ((h.tags || []).indexOf(tag) >= 0 ? h.c : 0), 0);
    xs.filter(x => x.perGlow || x.perTag).forEach(x => {
      let n = tagCount(x.perGlow ? "glow" : x.perTag);
      if (x.tagAdd || x.tagDiv || x.tagMul) n = Math.floor(Math.max(0, n + x.tagAdd) / (x.tagDiv || 1)) * (x.tagMul || 1);   // 例: 3回当たるごとに1回（tagDiv）、1回につき3つ（tagMul）
      if (n > 0) defs.push({ fixed: x.m, c: n, t: x.t, name: x.name, tags: x.tags, extra: true });
    });
    // 回数に応じて倍率が上がるヒット（例: トーナのお届けターゲット。矢尾1本につき +10%、最大30本）
    xs.filter(x => x.tagBonus).forEach(x => defs.push({ fixed: x.m * (1 + x.tagBonus.r * Math.min(x.tagBonus.cap || 1e9, tagCount(x.tagBonus.tag))), c: x.c, t: x.t, name: x.name, tags: x.tags, extra: true }));
    const other = G.other || {};
    const traits = G.traits || {};
    let totMult = 0, totExp = 0, totNon = 0, totCrit = 0;
    const rows = defs.map(h => {
      const m = h.fixed != null ? h.fixed : skillVal(c, h.s, h.n, lv);
      const rt = (ag.retype || []).find(r => (h.tags || []).some(t => r.tags.indexOf(t) >= 0));   // ダメージの種類の変換（例: エリーの断捨離タイムで通常攻撃・一掃が印ダメージに）
      const type = rt ? rt.t : h.t;
      const hid = h.id || null;
      const mh = (hid && ef.hit[hid]) || {};
      const tags = h.tags || [];
      // タグで指定された効果（長剣・光刃など）
      let mAdd = 0, bAdd = 0, crAdd = 0, cdAdd = 0, wAdd = 0, aAdd = 0, tAdd = 0, dpAdd = 0;
      const man = st.man || {};
      ag.mods.forEach(mo => {
        if (mo.tags && !mo.tags.some(t => tags.indexOf(t) >= 0)) return;
        if (mo.ht && mo.ht !== type) return;
        if (mo.grp && mo.grp !== group) return;   // 技の指定（例: 通常攻撃の中の大剣だけ）
        const typeLevel = !mo.tags && !mo.grp;     // 攻撃の種類だけで決まる効果（戦闘中のステータスに入る分）
        if (mo.k === "mult") mAdd += mo.v;
        else if (mo.k === "critRate") { if (!(man.critRate && typeLevel)) crAdd += mo.v; }
        else if (mo.k === "critDmg") { if (!(man.critDmg && typeLevel)) cdAdd += mo.v; }
        else if (mo.k === "Bs" && type === "skill") bAdd += mo.v;
        else if (mo.k === "Bb" && type === "basic") bAdd += mo.v;
        else if (mo.k === "Bu" && type === "ult") bAdd += mo.v;   // 特定の攻撃だけの必殺技ダメージ（例: オトハの万象は闇へ。花の傘だけ）
        else if (mo.k === "W") wAdd += mo.v;
        else if (mo.k === "taken") tAdd += mo.v;   // その攻撃だけに乗る敵の被ダメージ（被ダメージの足し算に入れる）
        else if (mo.k === "defPen") dpAdd += mo.v;   // その攻撃だけの防御貫通（例: セイナ(原点)の極星の構え）
        else if (mo.k === "atkPctHit") aAdd += mo.v;   // そのヒットだけの攻撃力%（例: エレノアのドローン）   // 特定の攻撃だけの属性ダメージ（例: チトセの通常攻撃の6撃目だけ）
      });
      let refVal;
      if (c.ref === "hp") refVal = st.hp;
      else if (man.atk) refVal = st.atk * (1 + (mh.atkPctHit || 0) + aAdd);
      else if (st.mode === "auto") refVal = st.baseAtk * (1 + st.atkPct + ef.atkPct + (mh.atkPctHit || 0) + aAdd);   // 素質由来の攻撃力%を足す
      else refVal = st.atk * (1 + ef.atkPct + (mh.atkPctHit || 0) + aAdd);
      const W = 1 + st.elemAdd + (man.elem ? 0 : ef.W) + (mh.W || 0) + wAdd;
      let B;
      if (type === "basic") B = 1 + st.basicAdd + (man.basic ? 0 : ef.Bb) + (mh.Bb || 0) + bAdd;
      else if (type === "skill") B = 1 + st.skillAdd + (man.skill ? 0 : ef.Bs) + (mh.Bs || 0) + bAdd;
      else if (type === "ult") B = 1 + st.ultAdd + (man.ult ? 0 : ef.Bu) + bAdd;
      else B = 1 + st.markAdd + (man.mark ? 0 : ag.markAdd) + (ag.markFromBb ? Math.min(ag.markFromBb.cap, (st.basicAdd + (man.basic ? 0 : ef.Bb)) * ag.markFromBb.r) : 0);   // 通常攻撃ダメージの増加ぶんを印ダメージにも（エリーの断捨離タイム）
      let taken = (ef.taken + tAdd) * (mh.taken || 1) * (other.taken || 1);
      if (type === "mark") taken *= ag.takenMark * (ag.markMult || 1);
      if (type === "skill") taken *= ag.takenSkill;
      if (type === "basic") taken *= ag.takenBasic || 1;
      if (type === "ult") taken *= ag.takenUlt || 1;
      (S.DEFAULT_ENEMY_TRAITS[G.enemy] || []).forEach(tr => { if (traits[tr.id] && tr.ht.indexOf(type) >= 0) taken *= tr.x; });   // 敵の特性
      const dd = enemyD(en, c.el, st.pen, G, (ag.defDown || 0) + (ag.defPen || 0) + dpAdd);   // 防御力低下（敵）＋防御貫通（自分の全部の攻撃）＋この攻撃だけの防御貫通
      const markX = type === "mark" && c.id === "noya" ? (en.markX || 1) : 1;   // セイナ(原点)の印だけの別枠。ほかの印にはかからない（グレイの地の印で実測）
      const mult = m / 100 * (1 + (mh.mult || 0)) * (1 + mAdd);
      const normal = refVal * mult * W * B * taken * dd.D * markX * (other.mult || 1);
      let cd = st.critDmg + (mh.critDmg || 0) + cdAdd;
      if (G.heartCrit && c.id === "noya" && !man.critDmg) cd += 0.12;   // 心相1 閃星中: 会心ダメージ+12%。印だけでなく通常・スキルにも乗る（空壺ノ王で 突進・2撃目・3撃目の会心が 1.7400 倍。2026-11-04）
      // 直接入力の会心は共通の値。種類ごとの個別の分は、その上に足す
      if (man.critDmg) cd += typeCrit(st, ag, "critDmg", type);
      const rate = clamp(st.critRate + (man.critRate ? typeCrit(st, ag, "critRate", type) : (st.rateAdd[type] || 0)) + (mh.critRate || 0) + crAdd, 0, 1);
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
    if (S.migrateSup) S.migrateSup(G);   // エレノアの前の入力（sup）を読み替える
    if (S.migrateWillow) S.migrateWillow(G);   // ウィローの前の入力（pots）を pots2 に読み替える
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

  // 画面に出す「戦闘中」のステータス（直接入力の欄は、その値のまま）。属性ダメージなどは 100% を除いた加算分
  function battleView(o, G) {
    const st = o.st, ef = o.ef, ag = ef.ag || {}, man = st.man || {};
    // 会心: common = 全部の攻撃に乗る共通の値。extra = 種類ごと・特定の攻撃だけの上乗せ（[種類の名前か攻撃の名前, 値]）
    const crit = k0 => {
      let common = st[k0];
      if (!man[k0]) {
        if (k0 === "critDmg" && G.heartCrit && o.c.id === "noya") common += 0.12;
        (ag.mods || []).forEach(mo => { if (mo.k === k0 && !mo.tags && !mo.grp && !mo.ht) common += mo.v; });
      }
      const extra = [];
      ["basic", "skill", "ult", "mark"].forEach(t => { const v = typeCrit(st, ag, k0, t); if (Math.abs(v) > 1e-9) extra.push({ ht: t, v }); });
      (ag.mods || []).forEach(mo => { if (mo.k === k0 && (mo.tags || mo.grp)) extra.push({ tags: mo.tags, grp: mo.grp, ht: mo.ht, v: mo.v }); });
      return { common, extra };
    };
    return {
      hp: st.hp,
      atk: man.atk ? st.atk : st.mode === "auto" ? st.baseAtk * (1 + st.atkPct + ef.atkPct) : st.atk * (1 + ef.atkPct),
      critRate: crit("critRate"), critDmg: crit("critDmg"),
      elem: st.elemAdd + (man.elem ? 0 : ef.W), basic: st.basicAdd + (man.basic ? 0 : ef.Bb), skill: st.skillAdd + (man.skill ? 0 : ef.Bs),
      ult: st.ultAdd + (man.ult ? 0 : ef.Bu), mark: st.markAdd + (man.mark ? 0 : (ag.markAdd || 0)), pen: st.pen, taken: ef.taken,
    };
  }

  S.engine = { calcTeam, battleView, outsideStats, stats, skillVal, enemyD, defMult, resMult, recordBonus, emblemSum, noteSum, lrSum, TYPE_NAME };
  if (typeof module !== "undefined") module.exports = S.engine;
})(window.SIM);
