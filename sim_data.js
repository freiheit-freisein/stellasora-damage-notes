// 汎用計算ページ（sim.html）のデータ。検証済みの式を使うキャラ6人と敵2体。
// ヒットの定義: s=スキル番号(0通常 1主力 2支援 3必殺) / n=Wikiの倍率配列の番号 / c=ヒット数 / t=種別(basic通常・skill スキル・ult必殺・mark印) / name
// 倍率はスキルレベルごとにWiki(data/trekkers.js)の nums から取る。Lv11以上は平均の傾きで延長（セイナ主力 Lv13=123 と一致を確認、推定）。
window.SIM = window.SIM || {};
(function (S) {
  S.EL_JP = { Ventus: "風", Aqua: "水", Lux: "光", Ignis: "火", Terra: "地", Umbra: "闇" };
  const H = (s, n, c, t, name, id, tags) => ({ s, n, c, t, name, id, tags: tags || [] });

  S.CH = [
    { id: "willow", en: "Suntide Willow", jp: "ウィロー（水着）", el: "水", ref: "atk", role: "サポーター", trust0: 26, talent0: 10, talentBonus: { skill: 0.021, ult: 0.043 },
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
    { id: "noya", en: "Firstlight Noya", jp: "セイナ(原点)", el: "光", ref: "hp", role: "ヴァンガード", trust0: 18, talent0: 4, talentBonus: { basic: 0.021, skill: 0.021, elem: 0.015 },
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
    { id: "firefly", en: "Firefly", jp: "ホタル", el: "光", ref: "atk", role: "バランサー", trust0: 4, talent0: 4, talentBonus: { skill: 0.021 },
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目", "f1"), H(0, 1, 1, "basic", "2撃目", "f2"), H(0, 2, 4, "basic", "3撃目", "f3")],
        main: [H(1, 0, 1, "skill", "浮遊砲（1発）", "cannon", ["cannon"])],
        support: [H(2, 0, 1, "basic", "ソードフォーム 1撃目", "sw1", ["giant"]), H(2, 1, 1, "basic", "2撃目", "sw2", ["giant"]), H(2, 2, 1, "basic", "3撃目", "sw3", ["giant"]),
          H(2, 3, 5, "basic", "4撃目", "sw4", ["giant"]), H(2, 4, 1, "skill", "飛ぶ刃（1発）", "blade", ["blade"])],
        ult: [H(3, 0, 2, "ult", "砲撃（1回）", "u1"), H(3, 1, 1, "ult", "斬撃 1", "u2"), H(3, 2, 1, "ult", "斬撃 2", "u3")],
      } },
    { id: "tilia", en: "Tilia", jp: "ティリア", el: "光", ref: "atk", role: "サポーター", trust0: 15, talent0: 10, talentBonus: { skill: 0.021 },
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 1, "basic", "2撃目"), H(0, 2, 1, "basic", "3撃目"), H(0, 3, 1, "basic", "4撃目")],
        main: [H(1, 0, 1, "skill", "反撃", "counter")],
        support: [H(2, 0, 6, "skill", "盾（1回跳ねるごと）", "shield")],
        ult: [H(3, 0, 1, "ult", "叩きつけ"), H(3, 1, 1, "skill", "光球")],
      } },
  ];

  // 敵。def=防御倍率、res=属性ごとの耐性（既定250）、weak=弱点、weakMult=弱点補正（記事の値）。
  // extra は、実測に合わせるために入れた原因不明の倍率（「その他倍率」）。
  S.ENEMIES = [
    { id: "stomp", name: "暴走のストンプクラブ", def: 0.2, res: { 光: 250, 水: 250, 風: 0 }, weak: ["水", "火"], weakMult: 1.875,
      extra: { 水: 1.342 }, markX: 1.68, hpBonus: 0,
      note: "風は耐性0とすると実測 D=0.2000 と一致。水の ×1.342 は原因不明（実測合わせ）。印の倍率は セイナ(光)の実測 ≒1.65〜1.68。" },
    { id: "deep", name: "深層ノ主", def: 0.2, res: { 光: 250, 水: 250, 風: 250 }, weak: ["風", "光"], weakMult: 1.875,
      extra: { 光: 1.13 }, markX: 1.41, hpBonus: 0.20,
      note: "弱点補正1.875×防御0.2×耐性 で D≒0.35 になるが実測は 0.39〜0.40（×1.13は実測合わせ）。主力の最大HP+20%。" },
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
})(window.SIM);
