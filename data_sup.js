// 支援キャラ（ナツカ・エレノア）の素質の効果。数値は data/trekkers.js（Wiki）の nums から取る（Lv7〜9は直線外挿）。
// effects[].k: atkPct=自分の攻撃力% / W=自分の風属性ダメージ加算 / Bs・Bb=スキル・通常攻撃ダメージ加算 / mult=ヒットの倍率を (1+x) 倍 /
//   taken=敵の風属性被ダメージ（別枠の乗算）/ critRate・critDmg / atkPctHit=そのヒットだけの攻撃力% / count=ヒット数の倍率
// num: wiki nums の何番目の配列か。stk: 最大重複数（値に掛ける）。hit: 効く対象（省略=全ヒット）。team: 風属性のアタッカー・バランサーの味方全員に効く。
// over: レベルごとの実測値（Wikiの丸め誤差を避ける。例 花嵐の加護 Lv8=125%）。
// on: 初期の「反映」（false=条件が重い・未検証のもの）。verified: 実測で確認した効果。
window.SUP_HITS = {
  nazuka: ["orb", "sea", "petal"],
  eleanor: ["jump", "drone"],
};
window.SUP_POTS = {
  nazuka: [
    { id: "dazzling", en: "Youth: Dazzling", jp: "花びらの詩", core: true, effects: [{ k: "extra", name: "花びら（詩・18枚）", m: 11, type: "skill", count: 18, as: "petal" }], on: false, note: "使用時、主力の足元に花びら18枚（各11%）。花びらの素質が乗る" },
    { id: "hunting", en: "Youth: Hunting", jp: "花びらの舞", core: true, effects: [{ k: "W", num: 0, hit: "petal" }] },
    { id: "blooming", en: "Youth: Blooming", jp: "散華の歓び", effects: [{ k: "Bs", num: 0, hit: "petal" }, { k: "W", num: 1, stk: 12 }], note: "花びら1枚ごとに風ダメージ（最大12重）" },
    { id: "weakness", en: "Youth: Weakness", jp: "散華の哀しみ", effects: [{ k: "taken", num: 0, stk: 10, hit: ["sea"] }], note: "花びらが当たるごとに敵の風被ダメージ（3秒・10重）。後続のヒットだけに乗る" },
    { id: "annihilation", en: "Youth: Annihilation", jp: "散華の怒り", effects: [{ k: "Bs", num: 0, hit: "petal" }] },
    { id: "waves", en: "Flower Formation: Waves", jp: "花の海・凪", core: true, effects: [{ k: "count", fixed: 1.5, hit: "sea" }], note: "花の海の持続+50%（毎秒の回数が1.5倍）" },
    { id: "turbulent", en: "Flower Formation: Turbulent", jp: "花の海・逆波", core: true, effects: [{ k: "extra", name: "逆波の追撃（味方の風属性が花の海に当てた時・毎秒）", m: 182, type: "skill", count: 6, as: "sea" }], on: false, note: "別の風属性の味方がダメージを与えた時のみ（エレノアが攻撃する場合）" },
    { id: "blast", en: "Flower Formation: Blast", jp: "花の海・怒涛", effects: [{ k: "W", num: 0, hit: "sea" }, { k: "extra", name: "花の海の消滅時の追撃", num: 1, type: "skill", count: 1, as: "sea", noW: true }], note: "花の海の風ダメージ加算＋消滅時に追撃" },
    { id: "convergence", en: "Flower Formation: Convergence", jp: "花の海・さざ波", effects: [{ k: "Bs", num: 0, hit: "sea" }], note: "敵2体以上の追加分は未反映（ボス戦は単体）" },
    { id: "erosion", en: "Flower Formation: Erosion", jp: "花の海・波紋", effects: [{ k: "taken", num: 0, stk: 10, hit: ["sea", "petal"] }], note: "花の海が当たるごとに敵の風被ダメージ（2秒・10重）。使用直後は0〜1重", verified: "1重の差=6%（実測 171,663→181,962）" },
    { id: "leader", en: "Almighty Leader", jp: "嵐の目", effects: [{ k: "W", num: 0, team: true }], verified: "実測一致（常時・加算）" },
    { id: "seed", en: "Wind Demon Seed", jp: "玉風の加護", effects: [{ k: "atkPct", num: 0 }], verified: "実測一致（攻撃力%に加算）" },
    { id: "selfimp", en: "Self-Improvement", jp: "花嵐の加護", effects: [{ k: "Bs", num: 0, hit: ["petal", "sea"], over: { 8: 1.25 } }], verified: "実測一致（Lv6+2=125%・花の海がある間・オーブには入らない）" },
    { id: "multihurricane", en: "Multi-Hurricane", jp: "かまいたちの舞", effects: [], note: "必殺技のみ（未反映）" },
    { id: "aeolus", en: "Aeolus's Blessing", jp: "禊の風", effects: [{ k: "W", num: 0 }], on: false, note: "必殺技を使った後18秒、風ダメージ上昇" },
    { id: "maelstrom", en: "Maelstrom", jp: "一陣の雄風", effects: [{ k: "taken", num: 1, stk: 8, team: true }], on: false, note: "必殺技の竜巻が当たるごとに敵の風被ダメージ（18秒・8重）" },
  ],
  eleanor: [
    { id: "chain", en: "Chain Detonation", jp: "ペイントバースト", core: true, effects: [{ k: "critRate", num: 0, hit: "jump" }], note: "爆発の会心率+20%。爆発回数の増加は未反映" },
    { id: "seismic", en: "Seismic Spread", jp: "キャンバス拡張", core: true, effects: [{ k: "critDmg", num: 0, hit: "jump" }, { k: "mult", fixed: 0.12, stk: 9, hit: "jump" }], verified: "会心ダメージ+24%・爆発ごとの倍率+12%×9（冒険の彩りと同じ枠で加算）を実測確認", note: "爆発のたびに、後続の爆発の倍率+12%（最大9重）。範囲拡大は支援が1人のときだけ" },
    { id: "pull", en: "Field Pull", jp: "冒険の彩り", effects: [{ k: "critRate", fixed: 0.20, hit: "jump" }, { k: "mult", num: 0, hit: "jump" }] },
    { id: "boost", en: "Power Boost", jp: "(未確認)", effects: [{ k: "Bs", num: 0, stk: 10, hit: "jump" }], note: "爆発が当たるごとにスキルダメージ（3秒・10重）" },
    { id: "shatter", en: "Shattering Blow", jp: "(未確認)", effects: [{ k: "mult", num: 0, hit: "jump" }, { k: "W", num: 1, hit: "jump" }] },
    { id: "sustain", en: "Function Sustain", jp: "(未確認)", effects: [{ k: "atkPctHit", fixed: 0.48, hit: "drone" }, { k: "mult", num: 1, stk: 9, hit: "drone" }], note: "ドローンの攻撃力+48%。叩きつけごとに倍率+13.8%（9重）" },
    { id: "cluster", en: "Cluster Barrage", jp: "(未確認)", effects: [{ k: "extra", name: "追撃（弾が3回当たるごと）", m: 117, type: "basic", count: 1, as: "drone" }], on: false },
    { id: "piercing", en: "Piercing Trajectory", jp: "(未確認)", effects: [{ k: "Bb", num: 0, hit: "drone" }], note: "エリート以上の敵に対して" },
    { id: "calib", en: "Precision Calibration", jp: "(未確認)", effects: [{ k: "atkPctHit", num: 0, hit: "drone" }] },
    { id: "analysis", en: "Suppression Analysis", jp: "審美眼", effects: [{ k: "Bb", num: 0, hit: "drone" }, { k: "atkPct", num: 1 }], note: "ドローンの通常攻撃ダメージ＋エレノアの攻撃力" },
    { id: "echo", en: "Annihilation Echo", jp: "お嬢様の本気", effects: [{ k: "taken", num: 0, stk: 3, team: true }], on: false, note: "エレノアがダメージを与えるたびに敵の風被ダメージ（5秒・3重）。エレノアが戦闘に出ているときだけ" },
    { id: "resonance", en: "Wind Resonance", jp: "(未確認)", effects: [{ k: "atkPct", num: 0 }], on: false, note: "風の印が発動した時から3秒" },
    { id: "ampl", en: "Power Amp", jp: "リーダーの片鱗", effects: [{ k: "W", num: 0, stk: 10, team: true, over: { 7: 0.0575 } }], on: false, verified: "Lv7=5.75%/重（最大スタックの実測から逆算・仮置き）", note: "エレノアがダメージを与えるたびに風属性の味方全員の風ダメージ（5秒・10重）。エレノアが戦闘に出ているときだけ" },
    { id: "reinforce", en: "Reinforcement Command", jp: "(未確認)", effects: [{ k: "W", num: 0 }], on: false, note: "必殺技を使った後25秒" },
    { id: "purge", en: "Purge Command", jp: "(未確認)", effects: [{ k: "W", num: 0 }], note: "風ダメージ上昇（常時）。必殺技の重複数は未反映" },
    { id: "focus", en: "Focus Command", jp: "(未確認)", effects: [{ k: "atkPct", num: 0 }], note: "攻撃力上昇（常時）。必殺技の重複数は未反映" },
  ],
};
