// 汎用計算ページ（sim.html）のデータ。心相は「段階」（0〜50。星5は10ずつ、星4は5ずつ。10段階=1凸）で持ち、ステータスの表は 5段階=1つ分（0〜10）で引く。talentBonus は1つ分(5段階)あたりのダメージ種別の加算。
// 検証済みの式を使うキャラ6人と敵2体。
// ヒットの定義: s=スキル番号(0通常 1主力 2支援 3必殺) / n=Wikiの倍率配列の番号 / c=ヒット数 / t=種別(basic通常・skill スキル・ult必殺・mark印) / name
// 倍率はスキルレベルごとにWiki(data/trekkers.js)の nums から取る。Lv11以上は平均の傾きで延長（セイナ主力 Lv13=123 と一致を確認、推定）。
window.SIM = window.SIM || {};
(function (S) {
  S.EL_JP = { Ventus: "風", Aqua: "水", Lux: "光", Ignis: "火", Terra: "地", Umbra: "闇" };
  const H = (s, n, c, t, name, id, tags) => ({ s, n, c, t, name, id, tags: tags || [] });

  S.CH = [
    { id: "willow", en: "Suntide Willow", jp: "ウィロー（水着）", el: "水", ref: "atk", role: "サポーター", trust0: 26, talent0: 50, talentBonus: { skill: 0.021, ult: 0.043 },
      hits: {
        basic: [H(0, 0, 3, "basic", "バブルガン 1〜3撃目"), H(0, 1, 1, "basic", "バブルガン 4撃目")],
        main: [H(1, 0, 1, "skill", "バブルフロッグ（着地ごと）", "frog")],
        support: [H(2, 0, 1, "skill", "海上の戯れ 初撃"), H(2, 1, 1, "skill", "バブルエリア（3秒ごと・1回分）"), H(2, 2, 1, "skill", "追従バブル（1発）")],
        ult: [H(3, 0, 7, "ult", "必殺 連続攻撃"), H(3, 1, 1, "ult", "必殺 フィニッシュ")],
      } },
    { id: "nazuka", en: "Nazuka", jp: "ナツカ", el: "風", ref: "atk", role: "バランサー", trust0: 17, talent0: 0, talentBonus: {},
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 1, "basic", "2撃目"), H(0, 2, 3, "basic", "3撃目")],
        main: [H(1, 0, 7, "skill", "風車の風")],
        support: [H(2, 0, 1, "skill", "花のオーブ（追撃の1発）", "orb"), H(2, 1, 6, "skill", "花の海（毎秒・6秒間）", "sea"), H(2, 2, 6, "skill", "花びら（6枚）", "petal")],
        ult: [H(3, 0, 3, "ult", "竜巻（3つ・3秒ごと1回分）")],
      } },
    { id: "eleanor", en: "Eleanor", jp: "エレノア", el: "風", ref: "atk", role: "バランサー", trust0: 20, talent0: 0, talentBonus: {},
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 5, "basic", "2撃目"), H(0, 2, 5, "basic", "3撃目"), H(0, 3, 6, "basic", "4撃目"), H(0, 4, 7, "basic", "5撃目")],
        main: [H(1, 0, 2, "skill", "回転"), H(1, 1, 1, "skill", "歩哨（1回分）")],
        support: [H(2, 0, 9, "skill", "跳びはね爆発", "jump"), H(2, 1, 1, "basic", "ドローンの弾（通常攻撃扱い・1発）", "drone")],
        ult: [H(3, 0, 14, "ult", "ロケット弾")],
      } },
    { id: "noya", en: "Firstlight Noya", jp: "セイナ(原点)", el: "光", ref: "hp", role: "ヴァンガード", trust0: 18, talent0: 20, talentBonus: { basic: 0.021, skill: 0.021, elem: 0.015, crit: 0.03 },
      // Wikiにステータスが無いので、基礎値は手元の画面の値。信頼・心相の表は他のキャラの表を流用（要確認）。
      manual: { baseHp: 94662, baseAtk: 6966, tables: "Nazuka", talent: { hp: 690, atk: 0 } },
      // 4撃目の突進は、Wikiでは「スキルダメージ ×3」だが、手元の実測の組み立て(光チームのページ)では「通常攻撃 ×1」で一致していたので、そちらに合わせている。
      hits: {
        basic: [H(0, 0, 2, "basic", "1撃目", "b1", ["great"]), H(0, 1, 3, "basic", "2撃目", "b2", ["great"]), H(0, 2, 2, "basic", "3撃目", "b3", ["great"]),
          H(0, 3, 2, "skill", "4撃目 光刃", "glow4", ["glow", "long"]), H(0, 4, 1, "basic", "4撃目 長剣（突進）", "sprint", ["long"])],
        main: [H(1, 0, 5, "skill", "主力スキル 長剣", "mLong", ["long"]), H(1, 1, 1, "basic", "主力スキル 大剣", "mGreat", ["great"]), H(1, 2, 1, "basic", "主力スキル 星雷", "mStar", ["starfall"]),
          { s: -1, fixed: 70, c: 1, t: "mark", name: "印ダメージ（ルーセント）", tags: [] }],
        support: [H(2, 0, 8, "skill", "支援 長剣", "sLong", ["long"]), H(2, 1, 6, "basic", "衝撃波 連続", "sField", ["great"]), H(2, 2, 1, "basic", "衝撃波 最後", "sLast", ["great"])],
        ult: [H(3, 0, 5, "basic", "必殺 大剣形態 連撃", "uG1", ["great"]), H(3, 1, 1, "basic", "必殺 大剣形態 最後", "uG2", ["great"]), H(3, 2, 7, "skill", "必殺 長剣形態 連撃", "uL1", ["long"]),
          H(3, 3, 7, "skill", "必殺 長剣形態 天剣陣", "uL2", ["long"]), { s: -1, fixed: 70, c: 1, t: "mark", name: "印ダメージ（ルーセント）", tags: [] }],
      } },
    { id: "firefly", en: "Firefly", jp: "ホタル", el: "光", ref: "atk", role: "バランサー", trust0: 4, talent0: 20, talentBonus: { skill: 0.021 },
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目", "f1"), H(0, 1, 1, "basic", "2撃目", "f2"), H(0, 2, 4, "basic", "3撃目", "f3")],
        main: [H(1, 0, 1, "skill", "浮遊砲（1発）", "cannon", ["cannon"])],
        support: [H(2, 0, 1, "basic", "ソードフォーム 1撃目", "sw1", ["giant"]), H(2, 1, 1, "basic", "2撃目", "sw2", ["giant"]), H(2, 2, 1, "basic", "3撃目", "sw3", ["giant"]),
          H(2, 3, 5, "basic", "4撃目", "sw4", ["giant"]), H(2, 4, 1, "skill", "飛ぶ刃（1発）", "blade", ["blade"])],
        ult: [H(3, 0, 2, "ult", "砲撃（1回）", "u1"), H(3, 1, 1, "ult", "斬撃 1", "u2"), H(3, 2, 1, "ult", "斬撃 2", "u3")],
      } },
    { id: "tilia", en: "Tilia", jp: "ティリア", el: "光", ref: "atk", role: "サポーター", trust0: 15, talent0: 50, talentBonus: { skill: 0.021, ult: 0.043 },
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 1, "basic", "2撃目"), H(0, 2, 1, "basic", "3撃目"), H(0, 3, 1, "basic", "4撃目")],
        main: [H(1, 0, 1, "skill", "反撃", "counter")],
        support: [H(2, 0, 6, "skill", "盾（1回跳ねるごと）", "shield")],
        ult: [H(3, 0, 1, "ult", "叩きつけ"), H(3, 1, 1, "skill", "光球")],
      } },
  ];
  // 残りの巡遊者（自動）: data/sim_chars_auto.js（tools/build_chars.py が英語Wikiのスキルの説明文から作ったヒット）。上の手で書いた定義が優先
  (window.SIM_CHARS_AUTO || []).forEach(c => { if (!S.CH.some(x => x.en === c.en)) S.CH.push(c); });

  // 敵。def=防御倍率、res=属性ごとの耐性（書いていない属性は resDefault、無ければ250）、weak=弱点（表示用）、weakMult=弱点補正。
  // extra は、実測に合わせるために入れた原因不明の倍率（「その他倍率」）。
  // ボス（指名手配・首領討伐）は 2026-10-28 の実測で: 防御の倍率0.5（gistの防御の式で DEF500）、弱点（有効）の属性は耐性250、等倍は耐性750、
  //   耐性の属性は耐性2000。記事の「弱点補正×1.875」は、耐性250と750の倍率の比（0.75÷0.40）のことで、別の枠ではない（weakMult=1）。
  //   根拠: テスト5（信頼Lv21・徽章なし）で 未恋ノ禍実（光が弱点）60,655 と 激流ノ角鯨（光は等倍）32,349 が、どちらも防御0.5000で計算と一致。
  //   光耐性貫通35の効き方: 弱点 ×1.0868（深層ノ主・未恋ノ禍実）＝耐性250の式、等倍 ×1.0846（ストンプクラブ・激流ノ角鯨）＝耐性750の式、どちらも4〜5桁一致。
  const BOSS = { def: 0.5, resDefault: 750, weakMult: 1, extra: {} };
  const RES_WEAK = 250, RES_RESIST = 2000;   // 耐性の属性: 翠煌ノ刃(光)で 徽章なし808・両方（光ダメ122%・貫通145）2,763 が耐性2000の式と一致（gistの第3段の上限）
  S.ENEMIES = [
    Object.assign({ id: "stomp", name: "暴走のストンプクラブ", res: { 水: RES_WEAK, 火: RES_WEAK }, weak: ["水", "火"], markX: 1.68, hpBonus: 0,
      note: "ボス（防御0.5・弱点の水と火は耐性250・ほかは等倍の750）。テスト3（信頼Lv21）のセイナ(原点)の通常1撃目 77,865（光は等倍）、光貫通35で 86,380（×1.0846＝耐性750の式）。耐性の属性は未確認。印の倍率は セイナ(光)の実測 ≒1.65〜1.68。" }, BOSS),
    { id: "defense", name: "骸魔防衛戦の雑魚（初段のみ）", def: 1, res: { 光: 250, 水: 250, 風: 250 }, weak: [], weakMult: 1,
      extra: {}, markX: 1, hpBonus: 0, teamHp: 0.15, teamAtk: 0.15, teamCrit: 0.10,
      note: "耐性250・防御1.00（徽章なしのセイナ初段 323,158 が式と完全一致）。全員に 最大HP+15%・攻撃+15%・会心率+10%。雑魚は1撃で倒れるので初段だけ測れる。印の倍率は未確認（1とした）。" },
    Object.assign({ id: "deep", name: "深層ノ主", res: { 風: RES_WEAK, 光: RES_WEAK, 闇: RES_RESIST }, weak: ["風", "光"], markX: 1.41, hpBonus: 0.20,
      note: "ボス（防御0.5・弱点の風と光は耐性250・耐性の闇は2000・ほかは750）。テスト3（信頼Lv21）のセイナ(原点)の通常1撃目 167,421、光貫通35で 186,105（×1.0868＝耐性250の式）。主力の最大HP+20%。" }, BOSS),
    Object.assign({ id: "mikoi", name: "未恋ノ禍実（首領討伐・難易度3）", res: { 光: RES_WEAK, 闇: RES_RESIST }, weak: ["光"], markX: 1, hpBonus: 0,
      note: "首領討伐。光が有効（耐性250）、闇が耐性。テスト5（信頼Lv21）のセイナ(原点)の通常1撃目 60,655、光貫通35で 68,408（×1.0868）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "suikou", name: "翠煌ノ刃（首領討伐・難易度3）", res: { 闇: RES_WEAK, 光: RES_RESIST }, weak: ["闇"], markX: 1, hpBonus: 0,
      note: "首領討伐。闇が有効（耐性250）、光が耐性（2000）。テスト5のセイナ(原点)の通常1撃目 808（徽章なし）、両方の徽章（光ダメ122%・貫通145）で 2,763。最初に測った 1,256・2,186 は取り違え（1,256 は80徽章＝貫通35の予想1,257と一致）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "gekiryu", name: "激流ノ角鯨（首領討伐・難易度3）", res: { 地: RES_WEAK, 水: RES_RESIST }, weak: ["地"], markX: 1, hpBonus: 0,
      note: "首領討伐。地が有効（耐性250）、水が耐性。光は等倍（750）: テスト5のセイナ(原点)の通常1撃目 32,349、光貫通35で 36,410（×1.0846）。印の倍率は未確認（1とした）。" }, BOSS),
  ];
  S.DEFAULT_ENEMY_TRAITS = {
    stomp: [{ id: "crack", name: "ひび割れた好機（必殺後15秒・スキル被ダメ+15%）", on: false }],
    deep: [{ id: "chase", name: "命がけの追撃（印3回後15秒・スキル/通常の被ダメ+24%）", on: false }],
  };

  S.NOTE_KEYS = ["強撃の音符", "幸運の音符", "爆発の音符", "体力の音符", "集中の音符", "器用の音符", "必殺の音符", "水の音符", "風の音符", "光の音符"];
  if (window.NOTES) window.NOTES["光の音符"] = { stat: "elemDmg:光", perLv: 0.003, text: "1レベルごとに光属性ダメージが0.3%増加する" };

  // 既定の徽章（分かっている合計に合わせた仮の配置。違えば画面で選び直す）
  S.EMB_DEFAULT = {
    willow: () => JSON.parse(JSON.stringify(EMBLEM_DEFAULT_CFG)),
    nazuka: () => JSON.parse(JSON.stringify(PARTY.nazuka.embCfg)),
    eleanor: () => JSON.parse(JSON.stringify(PARTY.eleanor.embCfg)),
    noya: () => [
      { name: "三角章（Lv70）", kind: "triangle", slots: [{ k: "hpPct", q: "rainbow" }, { k: "elemDmg", q: "rainbow" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
      { name: "円形章（Lv80）", kind: "circle", slots: [{ k: "resPen", q: "rainbow" }, { k: "elemDmg", q: "rainbow" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
      { name: "六星輝章（Lv90）", kind: "star", slots: [{ k: "markDmg", q: "gold" }, { k: "ultDmg", q: "gold" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
    ],
    firefly: () => [
      { name: "三角章（Lv70）", kind: "triangle", slots: [{ k: "atkPct", q: "green" }, { k: "elemDmg", q: "rainbow" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
      { name: "円形章（Lv80）", kind: "circle", slots: [{ k: "resPen", q: "blue" }, { k: "resPen", q: "green" }, { k: "skillDmg", q: "blue" }, { k: "", q: "gold" }] },
      { name: "六星輝章（Lv90）", kind: "star", slots: [{ k: "elemDmg", q: "blue" }, { k: "", q: "gold" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
    ],
    tilia: () => [
      { name: "三角章（Lv70）", kind: "triangle", slots: [{ k: "baseAtk", q: "green" }, { k: "", q: "gold" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
      { name: "円形章（Lv80）", kind: "circle", slots: [{ k: "", q: "gold" }, { k: "", q: "gold" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
      { name: "六星輝章（Lv90）", kind: "star", slots: [{ k: "elemDmg", q: "rainbow" }, { k: "", q: "gold" }, { k: "", q: "gold" }, { k: "", q: "gold" }] },
    ],
  };
  // 自動の巡遊者は、徽章を空にしておく（画面で選ぶ）
  const EMB_EMPTY = () => ["三角章（Lv70）:triangle", "円形章（Lv80）:circle", "六星輝章（Lv90）:star"].map(s => ({ name: s.split(":")[0], kind: s.split(":")[1], slots: [0, 1, 2, 3].map(() => ({ k: "", q: "gold" })) }));
  S.CH.forEach(c => { if (!S.EMB_DEFAULT[c.id]) S.EMB_DEFAULT[c.id] = EMB_EMPTY; });
})(window.SIM);
