// 光属性チーム（セイナ(原点)主力・ホタル・ティリア支援）の計算エンジン。DOMに依存しない。
// 出典: 画面のスクショ（ステータス・徽章・心相・信頼・ロスレコ・音符）と、ストンプクラブ戦の実測（手元の計測ログ）。
// 式: ダメージ = 最大HP × 倍率 × W(光属性ダメージ) × B(種別ダメージ) × 被ダメージ(別枠の乗算) × D(貫通込みの敵側補正) [× 会心ダメージ]
//   印ダメージ(ルーセント) = 最大HP × 70% × W × B(印) × 被ダメージ × D（会心なし）
(function (g) {
  const PEN_S = 472.7;                 // 耐性貫通の式 F(p)=S/(S−p)（ウィローの1点から推定）
  const F = p => PEN_S / (PEN_S - p);

  const NOYA = { baseHp: 94662, baseAtk: 6966, trustHp: 5004, talentHp: 2760, lrHp: 6990, trustHpPct: 0.06, emblemHpPct: 0.12,
    emblemLux: 0.24, talentLux: 0.06, lrLux: 0.66, talentBasic: 0.084, talentSkill: 0.084, emblemMark: 0.40, emblemUlt: 0.15,
    pen: 110, astralPenPerLux: 35, luxMembers: 3, vetHp: 9000, coreHp: 0.15, lrCoreBasicSkill: 0.12 };
  const FIREFLY = { baseAtk: 7484, trustAtk: 144, talentAtk: 200, lrAtk: 8565, atkPct: 0.06 + 0.04, luxStatus: 0.17, lrLux: 0.66,
    talentSkill: 0.084, emblemSkill: 0.08, pen: 75 };

  // 実測（手元の計測ログ）
  const MEAS = { strike1a: 245639, strike1b: 252462, markMin: 185279, tiliaPeak: 3368179, tiliaBase: 513076,
    skillNon: 1268743, skillCrit: 2167436, fireflyBlade: 18212, fireflySword1: 40802, tiliaShield1: 6893 };
  const MARK_MULT = 0.70;              // 主力スキル・必殺技が光の印を発動した時の印ダメージ（最大HPの70%）
  const JUSTICE = [0.75, 1.2, 1.65, 2.1, 2.55, 3.0];   // 眩い正義 Lv1〜6（Lv7以降は直線延長）
  const justiceVal = lv => lv <= 0 ? 0 : lv <= 6 ? JUSTICE[lv - 1] : JUSTICE[5] + (JUSTICE[5] - JUSTICE[4]) * (lv - 6);

  const DEFAULT = {
    flatHp: 29690, flatAtk: 3181,
    notes: { atk: 0, luck: 51, burst: 15, hp: 35, focus: 15, skill: 30, ult: 15, lux: 38 },
    heart2: 1, defHp: 0, bossHp: 0,    // 心相2(最大HP+10%・戦闘中のみ)・防衛戦のHPバフ・ボスの主力HP上昇(深層ノ主+0.20)
    lrHp: 6990,                        // メインロスレコの基礎HP合計（願い星の願い=6,990、朝靄/薄暮/長閑=各50）
    vet: 1, coreHp: 1,                 // 歴戦の騎士Lv6（最大HP+9,000）・未来導く明星（チームHP+15%）
    playBase: 1, playFirefly: 0,       // 遊び仲間: 光3体で光ダメ+40%、ホタルが場にいるとさらに+32%
    akatsuki: 0, seigan: 0, kaisetsu: 0, oiuchi: 0,   // 暁光(0〜3) 星願(0〜20) 回折(0〜6) ホタル追撃の光被ダメ(0〜20重)
    argent: 1, comet: 0,               // 閃光の奥義Lv6（スキルダメ+60%・常時）、彗星の構えLv5（残光付きの敵に長剣・光刃の倍率+15.3%）
    akatsukiTaken: 0, merchen: 0,      // 暁光の被ダメ+15%(0/1)、メルヘンなサンセット(0=なし,1=+6%,4=+6%+3%×3)
    window: 0, justiceLv: 7,           // ティリアの光明付与から5秒の窓（眩い正義＋ティリアのほかの光被ダメ）
    bag: { noyaHp: 0, fireflyAtk: 0, tiliaAtk: 0 },   // 星ノ塔バッグ（戦闘前）の実測。0なら式で計算
    calib: { strike: 245639, markMin: 185279, tiliaShield: 6893 },   // 当てはめの基準（開幕の初手1発目など）
    secondHit: 1.0278,                 // 同じ段の2発目は1発目の1.0278倍（実測）
    markEmblem: 1,                     // 90徽章（印ダメージ+40%）を付けているか
    markCrit: 1.74,                    // 印ダメージの会心倍率（実測: 93,524 と 162,732 の2通り・付与した側に関係なく出る）
    critDmg: 1.7084,                   // 実測（予測168.9%）
    // 実測に合わせて決めた補正（原因未解明）
    enemyRes: 250, astral: 1,          // 敵の光属性耐性（実測から250）・綺羅星の輝き（貫通+35×光の人数）の有無
    fit: { D: null, markX: null, tiliaLux: null, pen0: 1, penRef: 215 },
  };

  function hp(st) {
    if (st.bag && st.bag.noyaHp) return st.bag.noyaHp;
    const base = NOYA.baseHp + NOYA.trustHp + NOYA.talentHp + (st.lrHp != null ? st.lrHp : NOYA.lrHp) + st.flatHp + (st.vet ? NOYA.vetHp : 0);
    // 心相2「最大HP+10%」は戦闘中だけ反映（外の画面には出ない）。防衛戦のHPバフは加算で約+16%（ボス戦は0）。深層ノ主は主力HP+20%。
    return base * (1 + NOYA.trustHpPct + NOYA.emblemHpPct + st.notes.hp * 0.003 + (st.coreHp ? NOYA.coreHp : 0) + (st.heart2 ? 0.10 : 0) + (st.defHp || 0) + (st.bossHp || 0));
  }
  function wLux(st, firefly) {
    const lux = (firefly ? FIREFLY.luxStatus : NOYA.emblemLux + NOYA.talentLux) + NOYA.lrLux + st.notes.lux * 0.003;
    return 1 + lux + st.playBase * 0.40 + st.playFirefly * 0.32 + (!firefly && st.seigan >= 20 ? 0.10 : 0);
  }
  function bonus(st, type) {
    const akatsuki = st.akatsuki * 0.15;
    const merchen = st.merchen === 0 ? 0 : 0.06 + 0.03 * Math.max(st.merchen - 1, 0);
    if (type === "basic") return 1 + NOYA.talentBasic + st.notes.focus * 0.012 + NOYA.lrCoreBasicSkill + akatsuki + st.seigan * 0.006;
    if (type === "skill") return 1 + NOYA.talentSkill + st.notes.skill * 0.0046 + NOYA.lrCoreBasicSkill + akatsuki + st.seigan * 0.009 + merchen + st.kaisetsu * 0.01 + st.argent * 0.60;
    if (type === "ult") return 1 + st.notes.ult * 0.01 + NOYA.emblemUlt + akatsuki + merchen + st.argent * 0.60;
    return 1 + (st.markEmblem ? NOYA.emblemMark : 0);                           // mark（印ダメージ+40%は 1+0.40 の加算。90徽章を外すと 1.00）
  }
  function taken(st, type) {
    let t = 1 + 0.02 * st.oiuchi;                                                  // ホタル追撃: 敵の光被ダメ +2%/重
    if (st.akatsukiTaken && (type === "skill" || type === "basic")) t *= 1.15;
    if (st.window) {
      if (type === "mark") t *= 1 + justiceVal(st.justiceLv);                      // 眩い正義（印被ダメージ・別枠）
      t *= 1 + (st.fit.tiliaLux || 0);                                             // ティリアのほかの光被ダメ（実測から逆算）
    }
    return t;
  }
  function penNoya(st) { return NOYA.pen + ((!st || st.astral) ? NOYA.astralPenPerLux * NOYA.luxMembers : 0); }
  // 耐性（コミュニティの解析 gist）: 有効耐性 E = 耐性 − 貫通。E>0 のとき ダメージ倍率 = 1 − 係数、0<E≤250: 0.25×(E/250)²、251〜750: 0.35+0.25×((E−251)/499)²。E≤0 は 1（脆弱なし）。
  // 実測: ティリア(貫通0)・ホタル(75)・セイナ(110)・ウィロー水(53→0で×1.126)が、敵の耐性250でほぼ一致。
  function resMult(E) {
    if (E <= 0) return 1;
    if (E <= 250) return 1 - 0.25 * Math.pow(E / 250, 2);
    if (E <= 750) return 1 - (0.35 + 0.25 * Math.pow((E - 251) / 499, 2));
    return 1 - (0.9 + 0.09 * Math.pow((E - 751) / 1249, 2));
  }
  function dFor(st, pen) { return st.fit.D * resMult(st.enemyRes - pen) / resMult(st.enemyRes - (st.fit.penRef != null ? st.fit.penRef : penNoya(st))); }

  function noyaHit(st, type, mult) {
    const m = type === "mark" ? MARK_MULT : mult / 100;
    const comet = (type === "skill" && st.comet) ? 1.153 : 1;                       // 彗星の構え（長剣・光刃＝スキルダメージ種別のヒット）
    const markX = type === "mark" ? (st.fit.markX || 1) : 1;                         // 印の別枠の倍率（原因未解明）
    return hp(st) * m * wLux(st, false) * bonus(st, type) * taken(st, type) * dFor(st, penNoya(st)) * comet * markX;
  }
  // 順序: 初手の通常攻撃1撃目（スタックなし）で D を決め、印の最小値で印の加算を決め、ティリアの窓の実測比で光被ダメを決める
  function calibrate(st) {
    const base = JSON.parse(JSON.stringify(st));
    base.akatsuki = 0; base.seigan = 0; base.kaisetsu = 0; base.oiuchi = 0; base.akatsukiTaken = 0; base.merchen = 0; base.window = 0; base.comet = 0;
    base.fit = { D: 1, markX: 1, tiliaLux: 0, pen0: 1, penRef: penNoya(base) }; base.markEmblem = 1;
    const unitD = hp(base) * 1.08 * wLux(base, false) * bonus(base, "basic") * taken(base, "basic");
    const D = st.calib.strike / unitD;                                              // 1撃目の1発目
    base.fit.D = D;
    const markNeed = st.calib.markMin ? st.calib.markMin / (hp(base) * MARK_MULT * wLux(base, false) * bonus(base, "mark") * taken(base, "mark") * dFor(base, penNoya(base))) : null;
    const markX = markNeed == null ? (st.fit && st.fit.markX != null ? st.fit.markX : 1.679) : markNeed;
    const ratio = MEAS.tiliaPeak / MEAS.tiliaBase;
    const tiliaLux = ratio / (1 + justiceVal(st.justiceLv)) - 1;
    // ティリアの盾の1発目（貫通0）から pen0 を決める
    base.fit.D = D;
    return { D, markX, tiliaLux, pen0: 1, penRef: penNoya(base) };
  }

  const HITS = {
    basic: [{ n: "1撃目", m: 108, c: 2, t: "basic" }, { n: "2撃目", m: 113, c: 3, t: "basic" }, { n: "3撃目", m: 160, c: 2, t: "basic" },
      { n: "4撃目 光刃", m: 52, c: 2, t: "skill" }, { n: "4撃目 長剣", m: 74, c: 1, t: "basic" }],
    skill: [{ n: "主力スキル 長剣", m: 123, c: 5, t: "skill" }, { n: "主力スキル 大剣", m: 216, c: 1, t: "basic" }, { n: "主力スキル 星雷", m: 76, c: 1, t: "basic" },
      { n: "印ダメージ(ルーセント)", m: 70, c: 1, t: "mark" }],
    ult: [{ n: "必殺 大剣形態 連撃", m: 605, c: 5, t: "basic" }, { n: "必殺 大剣形態 最後", m: 756, c: 1, t: "basic" },
      { n: "必殺 長剣形態 連撃", m: 153, c: 7, t: "skill" }, { n: "必殺 長剣形態 天剣陣", m: 305, c: 7, t: "skill" }, { n: "印ダメージ(ルーセント)", m: 70, c: 1, t: "mark" }],
  };
  function table(st, group) {
    return HITS[group].map(h => {
      const normal = noyaHit(st, h.t, h.m);
      return { name: h.n, mult: h.m, count: h.c, type: h.t, normal, crit: h.t === "mark" ? normal * st.markCrit : normal * st.critDmg, total: normal * h.c };
    });
  }
  function fireflyAtk(st) { if (st.bag && st.bag.fireflyAtk) return st.bag.fireflyAtk; const f = FIREFLY; return (f.baseAtk + f.trustAtk + f.talentAtk + f.lrAtk + st.flatAtk) * (1 + f.atkPct + st.notes.atk * 0.003); }
  function fireflySword1(st) {                                                    // ソードフォーム 1撃目（Lv8 219%・通常攻撃扱い）
    return fireflyAtk(st) * 2.19 * wLux(st, true) * (1 + st.notes.focus * 0.012) * dFor(st, FIREFLY.pen);
  }
  function tiliaShield(st) {                                                      // 支援スキルの盾（Lv10 94%・スキル）。貫通0
    const atk = (st.bag && st.bag.tiliaAtk) ? st.bag.tiliaAtk : (5286 + 432 + 400 + 70 + 8565 + st.flatAtk) * (1 + 0.12 + st.notes.atk * 0.003);
    const W = 1 + 0.12 + NOYA.lrLux + st.notes.lux * 0.003 + st.playBase * 0.40 + st.playFirefly * 0.32;
    const B = 1 + 0.21 + st.notes.skill * 0.0046;
    return atk * 0.94 * W * B * taken(st, "skill") * dFor(st, 0);
  }
  function fireflyBlade(st) {
    const f = FIREFLY;
    const atk = (f.baseAtk + f.trustAtk + f.talentAtk + f.lrAtk + st.flatAtk) * (1 + f.atkPct + st.notes.atk * 0.003);
    const B = 1 + f.talentSkill + st.notes.skill * 0.0046 + f.emblemSkill + (st.merchen === 0 ? 0 : 0.06 + 0.03 * Math.max(st.merchen - 1, 0)) + st.kaisetsu * 0.01;
    return atk * 0.791 * wLux(st, true) * B * taken(st, "skill") * dFor(st, f.pen);
  }

  g.LUX = { DEFAULT, MEAS, NOYA, FIREFLY, hp, wLux, bonus, taken, noyaHit, calibrate, table, fireflyBlade, fireflySword1, tiliaShield, justiceVal, penNoya, F, dFor, resMult };
  if (typeof module !== "undefined") module.exports = g.LUX;
})(typeof window !== "undefined" ? window : globalThis);
