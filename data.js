// キャラデータ。ゲーム内の表示値をそのまま入れる。null は未取得。
// stats は「合計値」、statsBase は ステータス詳細 の基礎値、statsBonus は「+」で表示される加算分。
window.CHARACTERS = [
  {
    id: "willow-swimsuit",
    name: "ウィロー（水着）",
    rarity: 5,
    element: "水",
    role: "サポーター",
    level: 90,
    stats: {
      hp: 63994, atk: 9657, def: 290,
      critRate: 0.05, critDmg: 1.5, weakDmg: 0,
      elemDmg: 1.12,          // 水属性ダメージ 112%（扱いは未検証）
      defPen: 0, defIgnore: 0, // 防御貫通 / 防御無視
      resPen: 53, resIgnore: 0, // 水属性耐性貫通 / 無視
      spMax: 285, spMain: 1.0, spSupport: 1.15,
    },
    statsBase: { hp: 52388, atk: 6160, def: 190 },
    statsBonus: { hp: 11606, atk: 3497, def: 100 },
    skills: [
      // 通常攻撃「ソニックバブル」Lv10（上限）。主力スキルのタップでモード切替。
      // 「1〜3撃目: 82%を連続して与える」は1撃ごとに82%と解釈（要検証）。
      { id: "basic-bubble-1", name: "通常攻撃 バブルガン 1撃目", type: "basic", mult: 0.82, hits: 1 },
      { id: "basic-bubble-2", name: "通常攻撃 バブルガン 2撃目", type: "basic", mult: 0.82, hits: 1 },
      { id: "basic-bubble-3", name: "通常攻撃 バブルガン 3撃目", type: "basic", mult: 0.82, hits: 1 },
      { id: "basic-bubble-4", name: "通常攻撃 バブルガン 4撃目", type: "basic", mult: 1.65, hits: 1 },
      { id: "basic-mega-1", name: "通常攻撃 メガホン 1撃目", type: "basic", mult: 0.63, hits: 1 },
      { id: "basic-mega-2", name: "通常攻撃 メガホン 2撃目", type: "basic", mult: 0.63, hits: 1 },
      { id: "basic-mega-3", name: "通常攻撃 メガホン 3撃目", type: "basic", mult: 0.63, hits: 1 },
      { id: "basic-mega-4", name: "通常攻撃 メガホン 4撃目", type: "basic", mult: 1.67, hits: 1 },
      // 主力スキル「瑠璃色バブルフロッグ」Lv10。CD 1秒。デシベル値が100に達するとバブルフロッグを発射。
      // バブルフロッグは3秒ごとに1回ジャンプ、着地のたびに範囲内へ水属性スキルダメージ342%＋「水属性の印：水流」を付与。
      { id: "main-frog", name: "主力 バブルフロッグ（着地ごと）", type: "skill", mult: 3.42, hits: 1, intervalSec: 3 },
      // 支援スキル「海上の戯れ」Lv10。CD 20秒。
      // 水中に飛び込み広範囲に403%、バブルエリア生成（3秒ごとに99%＋水流の印、継続時間は未確認）。
      // その後17秒間、主力巡遊者に追従して泡を発射し62%（発射間隔は未確認）。支援スキルのダメージは全て「水属性の印：水流」を付与。
      { id: "support-dive", name: "支援 海上の戯れ 初撃", type: "skill", mult: 4.03, hits: 1 },
      { id: "support-area", name: "支援 バブルエリア（3秒ごと）", type: "skill", mult: 0.99, hits: 1, intervalSec: 3 },
      { id: "support-bubble", name: "支援 追従バブル（17秒間）", type: "skill", mult: 0.62, hits: 1, durationSec: 17 },
      // 必殺技「砂浜からの警告」Lv10。CD 30秒、消費SP 285（SP上限と同値）。
      // 範囲内に 479%×7 → 839% の水属性の必殺技ダメージ＋「水属性の印：水流」付与。
      { id: "ult-hit", name: "必殺技 連続攻撃（1発）", type: "ult", mult: 4.79, hits: 7 },
      { id: "ult-finish", name: "必殺技 フィニッシュ", type: "ult", mult: 8.39, hits: 1 },
    ],
  },
  { who: "eleanor", skill: "support", hit: "跳びはね爆発199.8%（使用時）", measured: 16700, predicted: 16698, note: "攻撃力21,109・W=1.941・B=1.0138・D(風)=0.2012" },
];

// ゲーム内ツールチップ（ステータス詳細の「!」）からの原文メモ。式の手がかり。
window.MECHANICS_NOTES = {
  def: "ユニットが受けるダメージを軽減するステータス。防御の上限は2000、防御の低下効果の上限は500まで。",
  weakDmg: "弱点ダメージ倍率（弱点特攻）: 属性耐性値がマイナスの対象に与える追加ダメージの倍率。",
  spMax: "SPが最大の時、巡遊者の必殺技を発動できる。",
  spSupport: "支援巡遊者のSP獲得量＝主力巡遊者のSP獲得量×支援巡遊者SP獲得効率。",
  defPen: "対象の防御力をダメージ計算時に無視できる値（固定値）。",
  elemDmg: "水属性ダメージを与える時のダメージ倍率。",
  resPen: "ダメージを与える際、対象の水属性耐性を一部貫通する。効果の適用上限は250。（固定値）",
};

// 注意: 心相の内容・数値はキャラごとに異なる可能性がある（SUMMARY.md 参照）。他キャラに流用しない。
// 心相ステータスボーナス。5つ全て同一値（解放 10/10 時）。合計は「全て」タブと一致を確認済み。
CHARACTERS[0].resonance = {
  count: 5,
  unlock: 10, // 解放進捗 10/10
  perUnit: { baseAtk: 80, baseDef: 20, baseHp: 920, skillDmg: 0.042, ultDmg: 0.086 },
  total:   { baseAtk: 400, baseDef: 100, baseHp: 4600, skillDmg: 0.21, ultDmg: 0.43 },
};

// 徽章を全て外した状態（ステータス詳細）。変化したのは攻撃の加算分だけ。
CHARACTERS[0].noEmblem = {
  atkBonus: 2619,     // 外す前 3497 → 差 878 が徽章由来
  emblemAtk: 878,
  hpBonus: 11606,     // 変化なし（徽章はHPに寄与しない）
  defBonus: 100,      // 変化なし
  // 残り: 攻撃 2619-400(心相)=2219 / HP 11606-4600(心相)=7006 の出どころは未特定
};

// 信頼ボーナス（累計）。Lv25 まで解放済み、次レベルで 基礎HP+333 / 基礎攻撃力+36。
CHARACTERS[0].trust = { baseHp: 7006, baseAtk: 756, atkPct: 0.20, next: { baseHp: 333, baseAtk: 36 } };
// 徽章（推定）: 攻撃力 +12%（878 / 7316 ≒ 12.0%）。徽章画面で要確認。
CHARACTERS[0].emblem = { atkPct: 0.12 };

// スキルが付与するバフ（バフ効果は未検証。攻撃力%が既存の%と加算か乗算かは実測で確認）
CHARACTERS[0].buffs = [
  { id: "frog-atk", source: "主力 バブルフロッグ", stat: "atkPct", value: 0.133, durationSec: 6, maxStacks: 5, target: "team" },
];
// 主力スキルのタップ挙動: デシベル値100未満＝バブルガン/メガホンを交互に切替、100到達＝全消費してフロッグ発射。

// 支援スキル「海上の戯れ」: ウィローがフィールドに存在する間、チーム全体にデシベル値に応じた状態を付与。
CHARACTERS[0].buffs.push(
  { id: "mellow", source: "支援 海上の戯れ（メロウ状態）", condition: "デシベル値 ≤ 40", stat: "elemDmg", value: 0.23, target: "team" },
  { id: "loud", source: "支援 海上の戯れ（ラウド状態）", condition: "デシベル値 41〜100", stat: "atkPct", value: 0.46, target: "team" },
);

CHARACTERS[0].buffs.push(
  { id: "ult-atk", source: "必殺技 砂浜からの警告", stat: "atkPct", value: 0.115, durationSec: 20, maxStacks: 5, target: "team" },
);

// スキルごとの基本情報（すべて Lv10）。CD は秒。cd: null は表示なし。
CHARACTERS[0].skillInfo = [
  { id: "basic", name: "ソニックバブル", kind: "通常攻撃", level: 10, cd: null, sp: null },
  { id: "main",  name: "瑠璃色バブルフロッグ", kind: "主力スキル", level: 10, cd: 1, sp: null },
  { id: "support", name: "海上の戯れ", kind: "支援スキル", level: 10, cd: 20, sp: null },
  { id: "ult", name: "砂浜からの警告", kind: "必殺技", level: 10, cd: 30, sp: 285 },
];
// skills[].group でスキルの所属を示す
{
  const g = { "basic-": "basic", "main-": "main", "support-": "support", "ult-": "ult" };
  CHARACTERS[0].skills.forEach(s => { for (const k in g) if (s.id.startsWith(k)) s.group = g[k]; });
}

// 状態・リソースの説明（ゲーム内ツールチップより）
CHARACTERS[0].statusEffects = {
  bubbleMark: {
    name: "バブルマーク",
    text: "バブルガンモード時の通常攻撃によって4秒間付与される。ウィロー（水着）はバブルマークが付与されている敵に与える水属性ダメージが25%増加する。",
    durationSec: 4, condition: "バブルガンモードの通常攻撃で付与",
    effect: { stat: "elemDmg", value: 0.25, target: "self", on: "バブルマーク付与中の敵" },
  },
  decibel: {
    name: "デシベル値",
    text: "ウィロー（水着）が主力に配置されている時、通常攻撃でデシベル値を獲得できる（上限値100）。通常攻撃1〜3撃目: +3 / 4撃目: +4。",
    max: 100, gain: { basic1to3: 3, basic4: 4 },
  },
  waterCurrent: {
    name: "水属性の印：水流",
    text: "一部の水属性巡遊者が対象に付与できる特殊状態。持続時間は10秒。特定の水属性巡遊者から攻撃を受けると状態が解除され、特殊な効果が発動する。",
    durationSec: 10, note: "解除時の効果は他キャラ側のスキルに依存（ウィロー自身のダメージ計算には直接関与しない可能性）",
  },
};

// 素質（構築レイヤー）。主力タブの一覧。効果値は取得できたものだけ入れる（null = 未取得）。
// コアスキル（ピンク背景）は各構築のうち4つから2つしか取得できない。
CHARACTERS[0].potentials = {
  main: {
    build1: {
      concept: "バブルフロッグを継続的に巨大化させ、広範囲にダメージを与える構築",
      items: [
        { name: "乱れ飛ぶ水泡", core: true, effect: {
          text: "バブルガンモード持続中、バブルマークが付与された敵は一定時間ごとに吸収可能なバブルを生成する。バブルフロッグがバブルを1つ吸収するたびに、サイズが10%増加し、さらに、バブルフロッグの与えるスキルダメージが5%増加する。サイズは最大で100%まで増加する。",
          perBubble: { sizePct: 0.10, frogSkillDmg: 0.05 }, maxSizePct: 1.0,
          // 最大スキルダメージ加算は 10個吸収で +50% と推定（要検証）。生成間隔は未確認。
        } },
        { name: "微震する流光", core: true, effect: {
          text: "バブルガンモード持続中、バブルフロッグは1秒ごとに周囲の敵に攻撃力の146%の水属性のスキルダメージを与えるようになり、水属性の印：水流を付与できる。さらに、8秒間、敵の水属性被ダメージが4%増加する。この効果は4回まで重複できる。",
          tick: { mult: 1.46, intervalSec: 1, type: "skill", condition: "バブルガンモード持続中（フロッグ）" },
          debuff: { stat: "enemyElemTaken", value: 0.04, durationSec: 8, maxStacks: 4, target: "enemy" }, // 最大 +16%
        } },
        { name: "凝りて散らず", core: false, effect: null },
        { name: "久遠に割れぬ泡", core: false, effect: null },
        { name: "夢幻泡影", core: false, effect: null },
      ],
    },
    build2: {
      concept: "バブルフロッグが高頻度で跳ね返り、エコーウェーブを拡散させる構築",
      items: [
        { name: "律動する光泡", core: true, effect: null },
        { name: "跳ね回る七彩", core: true, effect: null },
        { name: "揺らめく浮光", core: false, effect: null },
        { name: "砕沫の余韻", core: false, effect: null },
        { name: "着地からの跳躍", core: false, effect: null },
      ],
    },
    common: { note: "汎用素質（一覧は未取得）", items: [] },
  },
  support: null, // 支援タブは未取得
};

// コアスキルの選び方。4つから2つ（計6通り）。通常は同じ構築の2枚を選ぶ。
CHARACTERS[0].potentials.coreRule = {
  pick: 2,
  typical: [
    ["乱れ飛ぶ水泡", "微震する流光"], // 特化構築1の2枚
    ["律動する光泡", "跳ね回る七彩"], // 特化構築2の2枚
  ],
  rare: "各構築から1枚ずつ（4通り）",
};

// 素質のレベル規則（ユーザー情報）
CHARACTERS[0].potentials.levelRule = {
  core: { hasLevel: false, perTrekker: 2, teamTotal: 6, note: "星の塔（ハクスラ）をクリアすれば必ず1人あたり2枚、合計6枚を取得" },
  other: { defaultMin: 0, defaultMax: 6 },       // コア以外の素質は通常 Lv0〜6
  // 90徽章は特定の素質に +N を付与する（例: 凝りて散らず +3）。N は 1〜3。
  // 付与される素質の一覧はウィローの徽章画面から取得して grants に入れる。
  // 注意: 素質レベル+N は、元の素質を Lv1 以上で取得している場合のみ有効（0+N は 0）。
  emblem90: { bonusMin: 1, bonusMax: 3, requiresBaseLv: 1, grants: [{ name: "凝りて散らず", bonus: 3 }] },
};

// 徽章の強化項目（共通）。出典: ステラソラ攻略Wiki(gamerch) https://gamerch.com/stellasora/947430 （2026/01/08更新、最大倍率は仮値）
// 仕様（ユーザー情報）: 70/80/90徽章の3種。各徽章は強化スロット4つにランダム付与、同じ項目は重複しない。
// 素質強化は90徽章のみ（wiki上は「特例の素質レベル上昇 +1」が最大とされるが、実機では「凝りて散らず+3」の例あり＝wikiの値は要更新）。
// スキルレベル強化は wiki では 80徽章（2番目）枠の記載。
window.EMBLEM_STATS = {
  source: "gamerch ステラソラ攻略Wiki 徽章ページ（最大倍率は暫定値）",
  unlock: [
    { name: "70徽章", trekkerLv: 70, authLv: 20 },
    { name: "80徽章", trekkerLv: 80, authLv: 25 },
    { name: "90徽章", trekkerLv: 90, authLv: 30 },
  ],
  slots: 4, allowDuplicate: false,
  damage: {            // 最大値（割合）
    basicDmg: 0.30, skillDmg: 0.20, ultDmg: 0.30, critDmg: 0.12, elemDmg: 0.12,
    markDmg: 0.90, servantDmg: 0.20, derivedDmg: 0.20,
  },
  stat: {              // 固定値は基礎値への加算、%は各ステータスへの加算
    baseHp: 1020, baseAtk: 105, baseDef: 53, hpPct: 0.12, atkPct: 0.12, defPct: 0.15,
  },
  critRate: { basic: 0.075, skill: 0.075, ult: 0.075, mark: 0.075, servant: 0.075, derived: 0.075 },
  other: { supportSpEff: 0.40 },
  skillLevel: { basic: 3, main: 2, ult: 3 },   // 最大の上昇レベル（仮）
  potentialLevel: { special: 1 },               // 特例の素質レベル上昇（仮。実機では+3の例あり）
  note: "基礎HP/攻撃/防御は％系の下位互換とされる。徽章研磨剤で特性を最大2つロックして再抽選できる。",
};

// 徽章（ウィロー環境の3枚セット）。初級=70徽章 / 中級=80徽章 / 上級=90徽章（解放順と一致、要確認）。
// 同じ項目は3枚の合計が「特性一覧」に表示される（確認済み）。
CHARACTERS[0].emblemSet = [
  { name: "初級徽章：従士の三角章 IV", tier: 70, slots: [
    { kind: "ステータス", stat: "atkPct", value: 0.05 },
    { kind: "ステータス", stat: "spMainEff", value: 0.125 },
    { kind: "ステータス", stat: "baseDef", value: 53 },
    { kind: "ステータス", stat: "defPct", value: 0.12 },
  ] },
  { name: "中級徽章：列福の円形章 II", tier: 80, slots: [
    { kind: "スキルレベル", stat: "supportSkillLv", value: 3 },
    { kind: "ステータス", stat: "resPen", value: 53 },        // 水属性耐性貫通（固定値）
    { kind: "ステータス", stat: "skillCritRate", value: 0.063 },
    { kind: "ステータス", stat: "servantDmg", value: 0.20 },
  ] },
  { name: "上級徽章：開拓者の六星輝章 IV", tier: 90, slots: [
    { kind: "主力素質", target: "風に乗る泡雲", potentialLevel: 2 },
    { kind: "ステータス", stat: "atkPct", value: 0.06 },
    { kind: "ステータス", stat: "basicDmg", value: 0.30 },
    { kind: "ステータス", stat: "skillDmg", value: 0.08 },
  ] },
];
// 特性一覧（3枚合算）の表示値: 攻撃力11% / 基礎防御力53 / 防御力12% / 水属性耐性貫通53 / 通常攻撃ダメージ30% /
//   スキルダメージ8% / 従者ダメージ20% / スキル会心率6.3% / 主力SP獲得効率12.5% / 支援スキルLv+3 / 風に乗る泡雲 Lv+2

// ロスレコ（武器）。編成単位で メイン3枚 / サブ3枚。メインは「コア効果」、サブは「アシスト効果」が効く想定（要確認）。
window.LOSTRECORDS = [
  {
    id: "tomo-no-natsuyasumi",
    name: "友との夏休み",
    rarity: 5, element: "水", tags: ["元素", "攻撃", "必殺技"],
    level: 90, levelMax: 90, // 画面は Lv90/90、突破は満タン表示
    stats: { baseAtk: 1533, elemDmg: 0.12 }, // 水属性ダメージ12%
    core: {
      name: "友との夏休み", rank: "VI",
      text: "水属性のサポーター巡遊者がスキル発動時、あるいは、水属性のサポーター巡遊者がフィールドに5秒間存在するごとに、チーム全体に6秒間、リプルノートを1付与する。リプルノート：水属性ダメージが5%増加する。この効果は最大2回まで重複できる。リプルノートが付与された巡遊者は水属性の印を発動させた時、10秒間、その巡遊者の攻撃力が10%上昇する。",
      ripple: { elemDmg: 0.05, durationSec: 6, maxStacks: 2, trigger: "水属性サポーターのスキル発動 / フィールド滞在5秒ごと" },
      markAtk: { atkPct: 0.10, durationSec: 10, trigger: "水属性の印を発動させた時" },
    },
    assist: { name: "流水のささやき", level: 1, text: "チーム内の水属性巡遊者の必殺技ダメー…（続きは未取得）" },
  },
];

// 友との夏休み: アシスト効果の全文（解放条件は音符の Lv。音符はハクスラ中に獲得、またはサブロスレコの固有加算値で初期値が上がる）。
LOSTRECORDS[0].assist = [
  {
    name: "流水のささやき", level: 1,
    text: "チーム内の水属性巡遊者の必殺技ダメージが6%増加する。リプルノートに追加効果が付与される：リプルノート1ごとに自身の水属性ダメージが1%増加する。",
    effects: [
      { stat: "ultDmg", value: 0.06, target: "team(水属性)" },
      { stat: "elemDmg", valuePerRipple: 0.01, target: "self" },
    ],
    unlock: [{ note: "水の音符", lv: 10 }, { note: "必殺の音符", lv: 10 }],
  },
  {
    name: "島のハミング", level: 1,
    text: "リプルノートが上限に達した時、自身の水属性のスキルダメージが4.5%増加する。",
    effects: [{ stat: "skillDmg", value: 0.045, target: "self", condition: "リプルノートが上限（2）" }],
    unlock: [{ note: "集中の音符", lv: 15 }, { note: "強撃の音符", lv: 15 }, { note: "水の音符", lv: 15 }],
  },
];
// ロスレコの仕様: 左下のステータス(基礎攻撃力・水属性ダメージ)は直接反映。右側の効果は解放条件(音符Lv)を満たした場合のみ発動。
// 音符 = ハクスラ中に獲得する要素。サブに付けたロスレコが固有の加算値を持ち、音符の初期値を増やす。

// 効果のON/OFF方針: 発動条件が戦闘内容に依存する効果は「発動するもの」とみなして既定ON、画面のスイッチで切替可能にする。
//   activation: "always"（常時。スイッチなし）/ "conditional"（条件付き。スイッチあり、既定ON）
//   stacks: 重複する効果は、画面で重複数を指定（既定は最大）
{
  const cond = {
    "frog-atk": { activation: "conditional", trigger: "バブルフロッグがダメージを与えた時" },
    "mellow":   { activation: "conditional", trigger: "デシベル値 ≤ 40（ラウドと排他）", exclusiveWith: "loud" },
    "loud":     { activation: "conditional", trigger: "デシベル値 41〜100（メロウと排他）", exclusiveWith: "mellow" },
    "ult-atk":  { activation: "conditional", trigger: "必殺技発動後20秒間" },
  };
  CHARACTERS[0].buffs.forEach(b => Object.assign(b, cond[b.id] || {}, { enabled: true, stacks: b.maxStacks || 1 }));
}
LOSTRECORDS[0].core.activation = "conditional"; // リプルノートは編成・動き次第 → 既定ON
LOSTRECORDS[0].assist.forEach(a => { a.activation = "conditional"; a.enabled = true; });

// サブに付けた場合: 星ノ塔探索開始時に以下の音符を獲得（初期値）。メインのアシスト効果の解放条件（音符Lv）に加算される。
LOSTRECORDS[0].sub = {
  startNotes: [
    { note: "器用の音符", lv: 7 },
    { note: "爆発の音符", lv: 7 },
  ],
};
// 音符の効果（1レベルあたり、レベルに比例）。ハクスラ中に獲得して上げる。サブロスレコの初期音符、メインのアシスト解放条件にも使う。
// 星ノ塔バッグ「音符効果」画面で確認（Lv1〜8は線形表示を確認、最大Lvは99、線形を確認）。
window.NOTES = {
  "強撃の音符": { stat: "atkPct",    perLv: 0.003,  text: "1レベルごとに攻撃力が0.3%上昇する" },
  "幸運の音符": { stat: "critRate",  perLv: 0.001,  text: "1レベルごとに会心率が0.1%上昇する" },
  "爆発の音符": { stat: "critDmg",   perLv: 0.0046, text: "1レベルごとに会心ダメージが0.46%増加する" },
  "体力の音符": { stat: "hpPct",     perLv: 0.003,  text: "1レベルごとに最大HPが0.3%増加する" },
  "集中の音符": { stat: "basicDmg",  perLv: 0.012,  text: "1レベルごとに通常攻撃ダメージが1.2%増加する" },
  "器用の音符": { stat: "skillDmg",  perLv: 0.0046, text: "1レベルごとにスキルダメージが0.46%増加する" },
  "必殺の音符": { stat: "ultDmg",    perLv: 0.01,   text: "1レベルごとに必殺技ダメージが1%増加する" },
  "水の音符":   { stat: "elemDmg:水", perLv: 0.003,  text: "1レベルごとに水属性ダメージが0.3%増加する" },
  "風の音符":   { stat: "elemDmg:風", perLv: 0.003,  text: "1レベルごとに風属性ダメージが0.3%増加する" },
  // 他の属性の音符（火・光・雷など）がある可能性。画面の下部に未確認の項目あり。
};

// ロスレコ2枚目
LOSTRECORDS.push({
  id: "yurameku-hikari",
  name: "揺らめく光の向こう側",
  rarity: 5, element: "水", tags: ["与ダメージ↑", "会心ダメージ", "チャージ"],
  level: 90, levelMax: 90,
  stats: { baseAtk: 1111, basicDmg: 0.35 }, // 通常攻撃ダメージ35%
  core: {
    name: "揺らめく光の向こう側", rank: "II",
    text: "チーム全体の水属性ダメージが24%増加する。水属性のサポーター巡遊者がスキル発動時、あるいは、水属性のサポーター巡遊者がフィールドに5秒間存在するごとに、チーム全体に6秒間、タイドフリーズを付与する。この効果は最大4回まで重複できる。タイドフリーズが付与された巡遊者は、敵に水属性の印を付与した時、4秒間、敵の水属性のスキル被ダメージが18%増加する。",
    always: { elemDmg: 0.24, target: "team" }, // 前半は無条件（と読める）
    tideFreeze: { durationSec: 6, maxStacks: 4, trigger: "水属性サポーターのスキル発動 / フィールド滞在5秒ごと" },
    markDebuff: { stat: "enemySkillTaken", value: 0.18, durationSec: 4, trigger: "タイドフリーズ付きの巡遊者が水属性の印を付与した時" },
    activation: "conditional",
  },
  assist: [
    {
      name: "蒼海のプリズム", level: 1,
      text: "チーム内の水属性巡遊者の会心ダメージが12%増加する。タイドフリーズが付与されたチーム内の巡遊者が水属性の印を発動させた時、4秒間、その敵の水属性の通常攻撃被ダメージが10%増加する。",
      effects: [
        { stat: "critDmg", value: 0.12, target: "team(水属性)" },
        { stat: "enemyBasicTaken", value: 0.10, durationSec: 4, target: "enemy", condition: "タイドフリーズ付きが水属性の印を発動" },
      ],
      unlock: [{ note: "水の音符", lv: 10 }, { note: "強撃の音符", lv: 10 }],
      activation: "conditional", enabled: true,
    },
    {
      name: "陽光照らす白浜", level: 1,
      text: "タイドフリーズに追加効果が付与される：タイドフリーズ1ごとに自身の水属性ダメージが2%増加する。さらに、水属性のサポーター巡遊者の攻撃力は、タイドフリーズ1ごとに追加で2%上昇する。水属性のサポーター巡遊者が必殺技発動後、タイドフリーズ1ごとに、自身の最大SPの1.5%のSPを獲得する。この効果は最大でSPを20獲得できる。",
      effects: [
        { stat: "elemDmg", valuePerTide: 0.02, target: "self" },
        { stat: "atkPct", valuePerTide: 0.02, target: "水属性サポーター" },
        { stat: "spGain", valuePerTide: "最大SPの1.5%", cap: 20, trigger: "水属性サポーターの必殺技発動後" },
      ],
      unlock: [{ note: "幸運の音符", lv: 15 }, { note: "強撃の音符", lv: 15 }, { note: "水の音符", lv: 15 }],
      activation: "conditional", enabled: true,
    },
  ],
});

// ロスレコ3枚目
LOSTRECORDS.push({
  id: "furuike-no-mizuoto",
  name: "古池の水音",
  rarity: 5, element: "水", tags: ["元素", "スキル", "攻撃"],
  level: 90, levelMax: 90,
  stats: { baseAtk: 981, elemDmg: 0.15 }, // 水属性ダメージ15%
  core: {
    name: "古池の水音", rank: "I",
    text: "チーム全体の水属性ダメージが15%増加する。チーム内の巡遊者が水属性の印を発動させた時から4秒間、味方の水属性ダメージが15%増加する。",
    always: { elemDmg: 0.15, target: "team" },
    onMark: { elemDmg: 0.15, durationSec: 4, trigger: "チーム内の巡遊者が水属性の印を発動させた時", target: "team" },
    activation: "conditional",
  },
  assist: [
    {
      name: "火照りを冷ます飛沫", level: 1,
      text: "水属性の主力巡遊者のダメージを累計で20回与えた後の10秒間、チーム内の水属性巡遊者の攻撃力が14%上昇する。この効果は15秒ごとに1回まで発動する。",
      effects: [{ stat: "atkPct", value: 0.14, durationSec: 10, cooldownSec: 15, target: "team(水属性)", trigger: "水属性の主力が累計20回ダメージを与えた後" }],
      unlock: [{ note: "水の音符", lv: 10 }, { note: "強撃の音符", lv: 10 }],
      activation: "conditional", enabled: true,
    },
    {
      name: "山紫水明", level: 1,
      text: "チーム内の水属性巡遊者の、エリート以上の敵へのスキルダメージが12%増加する。",
      effects: [{ stat: "skillDmg", value: 0.12, target: "team(水属性)", condition: "エリート以上の敵" }],
      unlock: [{ note: "幸運の音符", lv: 15 }, { note: "強撃の音符", lv: 15 }, { note: "水の音符", lv: 15 }],
      activation: "conditional", enabled: true,
    },
  ],
});

// 検証用メインロスレコ3枚（サブなし）。ステータスは直接反映。
window.VERIFY_SET = { main: ["tomo-no-natsuyasumi", "yurameku-hikari", "furuike-no-mizuoto"], sub: [] };

// ロスレコ4枚目（検証の入れ替え候補）
LOSTRECORDS.push({
  id: "asagasumi",
  name: "朝靄",
  rarity: 3, element: "なし", tags: ["汎用"],
  level: 1, levelMax: 10, // 画面は Lv1/10
  stats: { baseHp: 50, baseAtk: 233 },
  core: {
    name: "フォルティシモ", rank: "VI",
    text: "主力巡遊者の攻撃力が14%上昇する。",
    always: { atkPct: 0.14, target: "main" },
    activation: "always",
  },
  assist: [],
});

// 検証パーティの支援（未育成）。ダメージ以外のバフ効果は持たない（支援スキル説明に記載なし）。
window.SUPPORTS = [
  {
    id: "xiemiao", name: "シーミャオ", element: "水", rarity: 4, level: 1,
    skills: {
      support: {
        name: "登竜剣戟", level: 1, cd: 20,
        text: "水しぶきを巻き上げ、攻撃力の12.8%の水属性のスキルダメージを与える。その後、水剣を7本発射し、それぞれ攻撃力の8.3%x5の水属性スキルダメージを与える。水属性の印：水流を発動させることができる。発動させると、攻撃力の48%の水属性の印ダメージを与え、寒冷を付与する。",
        hits: [{ mult: 0.128 }, { mult: 0.083, count: 5, perSword: true, swords: 7 }],
        mark: { name: "水属性の印：水流", dmg: 0.48, applies: "寒冷" },
        // 攻撃力・ダメージバフ効果の記載なし（確認済み）。
      },
    },
  },
];

SUPPORTS.push({
  id: "raar", name: "ラール", element: "光", rarity: 4, level: 1,
  skills: {
    support: {
      name: "ラール・ライトニングピラー", level: 1, cd: 12, sp: 0,
      text: "光エネルギーを地面に注入し、範囲内に攻撃力の52.5%、3.3%x12の光属性のスキルダメージを与える。同時に、雷域をフィールドにランダムで4回展開し、範囲内に攻撃力の57%の光属性のスキルダメージを与える。支援スキルは光属性の印：光明を発動させることができ、発動させると、落雷を発生させ、攻撃力の31%の光属性の印ダメージを与える。",
      hits: [{ mult: 0.525 }, { mult: 0.033, count: 12 }, { mult: 0.57, count: 4, note: "雷域（ランダム4回）" }],
      mark: { name: "光属性の印：光明", dmg: 0.31 },
      // バフ効果の記載なし（確認済み）。
    },
  },
});

// シーミャオの素質（支援）。星ノ塔バッグ「素質収集」画面。獲得は 1/16。
SUPPORTS[0].potentials = {
  build1: {
    items: [
      { name: "宿雨・澄", core: true, owned: false }, { name: "宿雨・雫", core: true, owned: false },
      { name: "リスクチェック", owned: false }, { name: "備品管理", owned: false }, { name: "消防点検", owned: false },
    ],
  },
  build2: {
    items: [
      { name: "宿雨・降", core: true, owned: true,
        text: "シーミャオの支援スキル持続中、シーミャオは主力巡遊者に追従するようになり、1.5秒ごとに次の水剣の与えるスキルダメージが61%増加する。",
        effect: { target: "シーミャオ自身の水剣", skillDmg: 0.61, intervalSec: 1.5 } },
      { name: "宿雨・溜", core: true, owned: false },
      { name: "秘書の役目", owned: false }, { name: "現場管理", owned: false }, { name: "事務補佐", owned: false },
    ],
  },
  common: { items: ["水利専門家", "効率的業務遂行", "貯水管理", "吟詠", "大浪"].map(n => ({ name: n, owned: false })), note: "一覧の下にもう1つあり（未取得）" },
};

// 音符のレベル上限は99（強撃 Lv99=29.7%、幸運 Lv99=9.9% で線形を確認）。
window.NOTE_MAX_LV = 99;

// 敵（実測から逆算した総合補正 D。耐性貫通53を付けた状態の値）。D = 防御補正 × 耐性補正 の合成。
// penOffFactor: 耐性貫通（徽章の resPen）が 0 のときに D に掛ける係数（ストンプクラブで実測、他は未測定のため近似で流用）。
window.ENEMIES = [
  { id: "floor1", name: "星ノ塔 1Fの敵", D: 0.975, penOffFactor: null, source: "実測(1発目31,386/26,516)" },
  { id: "stomp", name: "暴走のストンプクラブ（指名手配）", D: 0.4251, penOffFactor: 0.8878, source: "実測(1発目11,812 / 耐性貫通なし10,487)",
    Dwind: 0.2000, // 風属性・耐性貫通0。ナツカの花びら262%＝18,779から逆算（固定加算+95を入れると 0.2000 ちょうど。「テスト用」の固定加算+2511でも花びら・オーブが誤差0%で一致）
    weak: ["水", "火"], traits: [
      { name: "ひび割れた好機", text: "主力巡遊者が必殺技を発動した時、15秒間、首領のスキル被ダメージ強度が15%増加する。主力巡遊者が必殺技を発動した時、10秒間、首領の印被ダメージ強度が15%増加する。",
        skillTaken: 0.15, skillSec: 15, markTaken: 0.15, markSec: 10, trigger: "主力が必殺技を発動" },
    ] },
  { id: "deep", name: "深層ノ主（指名手配）", D: 0.2266, penOffFactor: null, source: "実測(1発目6,296)",
    weak: ["風", "光"], traits: [
      { name: "命がけの追撃", text: "主力巡遊者の最大HPが20%上昇し、被ダメージが10%増加する。味方が5秒以内に首領へ累計3回の印ダメージを与えた時、15秒間、首領のスキル被ダメージ強度が24%増加し、通常攻撃被ダメージ強度が24%増加する。",
        selfHp: 0.20, selfTaken: 0.10, skillTaken: 0.24, basicTaken: 0.24, sec: 15, trigger: "味方が5秒以内に累計3回の印ダメージを与えた時", verified: false },
    ] },
  { id: "none", name: "補正なし（D=1）", D: 1, penOffFactor: null, source: "" },
];
// 実測との照合用シナリオ（検証タブで再計算して比較する）
window.MEASUREMENTS = [
  { label: "1F・古池の組（徽章3枚）", enemy: "floor1", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "furuike-no-mizuoto"], emblems: [1,1,1], notes: {}, hit: "basic-bubble-1", measured: 31386, fit: true },
  { label: "1F・朝靄の組（徽章3枚）", enemy: "floor1", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1,1,1], notes: {}, hit: "basic-bubble-1", measured: 26516, fit: true },
  { label: "① ストンプクラブ・徽章3枚", enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1,1,1], notes: { "集中の音符": 3, "器用の音符": 3 }, hit: "basic-bubble-1", measured: 11812, fit: true },
  { label: "② ストンプクラブ・中級徽章なし", enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1,0,1], notes: { "集中の音符": 3, "器用の音符": 3 }, hit: "basic-bubble-1", measured: 10487 },
  { label: "③ 深層ノ主・徽章3枚", enemy: "deep", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1,1,1], notes: { "集中の音符": 3, "器用の音符": 3 }, hit: "basic-bubble-1", measured: 6296, fit: true },
  { label: "④ ストンプクラブ・上級徽章なし", enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1,1,0], notes: { "集中の音符": 3, "器用の音符": 3 }, hit: "basic-bubble-1", measured: 9308 },
  { label: "① 2発目（バブルマーク）", enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1,1,1], notes: { "集中の音符": 3, "器用の音符": 3 }, hit: "basic-bubble-2", mark: true, measured: 13984 },
];

// ストンプクラブ戦・メガホンモード・保存ビルド・中級徽章なし（開幕からスキルで切り替え後の通常攻撃を順に記録）
{
  const base = { enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1, 0, 1], notes: { "集中の音符": 3, "器用の音符": 3 } };
  [
    ["メガホン1〜3撃目 リプル1", "basic-mega-1", 1, 0, 8353],
    ["メガホン1〜3撃目 リプル2", "basic-mega-1", 2, 0, 8650],
    ["メガホン4撃目 リプル2", "basic-mega-4", 2, 0, 22931],
    ["メガホン1〜3撃目 リプル2＋心相4×1", "basic-mega-1", 2, 1, 8957],
    ["メガホン4撃目 リプル2＋心相4×1", "basic-mega-4", 2, 1, 23745],
    ["メガホン1〜3撃目 リプル2＋心相4×2", "basic-mega-1", 2, 2, 9265],
    ["メガホン4撃目 リプル2＋心相4×2", "basic-mega-4", 2, 2, 24561],
    ["メガホン1〜3撃目 リプル2＋心相4×3", "basic-mega-1", 2, 3, 9573],
    ["メガホン4撃目 リプル2＋心相4×3", "basic-mega-4", 2, 3, 25377],
  ].forEach(([label, hit, ripple, stack, measured]) =>
    MEASUREMENTS.push(Object.assign({ label: "ストンプ・" + label, hit, ripple, stack, measured }, base)));
  MEASUREMENTS.push(Object.assign({ label: "ストンプ・メガホン1〜3撃目 会心（バフ3）", hit: "basic-mega-1", ripple: 2, stack: 3, crit: true, measured: 14360 }, base));
}

// 心相（凸）の戦闘中効果。5つとも解放進捗 10/10。ステータス加算（resonance）とは別。
CHARACTERS[0].resonanceEffects = [
  { no: 1, name: "碧に溶ける憩い", text: "ウィロー（水着）が敵に水属性の印を付与した時、6秒間、チーム全体の与える水属性ダメージが30%増加する。",
    key: "r1", effect: { stat: "waterAdd", value: 0.30, durationSec: 6, trigger: "ウィローが敵に水属性の印を付与した時" }, verified: false },
  { no: 2, name: "凪がぬ心", text: "バブルエリアのダメージを与える間隔が50%短縮される。チーム全体が敵に対して水属性の印を発動させた後、8秒間、その敵の水属性被ダメージが27%増加する。",
    key: "r2", effect: { stat: "enemyWaterTaken", value: 0.27, durationSec: 8, trigger: "チーム全体が敵に水属性の印を発動させた後", extra: "バブルエリアの間隔 -50%" }, verified: false },
  { no: 3, name: "休みて知る", text: "チーム全体が水属性の印の付与された敵にダメージを与えた後、6秒間、その巡遊者は会心ダメージが32%増加する。",
    key: "r3", effect: { stat: "critDmgAdd", value: 0.32, durationSec: 6, trigger: "水属性の印の付与された敵にダメージを与えた後" }, verified: false },
  { no: 4, name: "波のまにまに", text: "ウィロー（水着）がフィールドにいる時、4秒ごとに主力巡遊者のスキルダメージが6%増加し、通常攻撃ダメージが6%増加する。この効果はそれぞれ最大18%まで増加する。",
    key: "stack", effect: { stat: "skillBasicAdd", perStack: 0.06, intervalSec: 4, maxStacks: 3, applies: ["basic", "skill"] }, verified: "basic" },
  { no: 5, name: "波にさらわれて", text: "ウィロー（水着）がスキルダメージを与えた後、5秒間、その敵の水属性被ダメージが24%増加する。",
    key: "r5", effect: { stat: "enemyWaterTaken", value: 0.24, durationSec: 5, trigger: "ウィローがスキルダメージを与えた後" }, verified: false },
];

// ストンプクラブ戦・保存ビルド・中級徽章なし: バブルフロッグ発射前後の連続ヒット（メガホンモード）
{
  const base = { enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1, 0, 1], notes: { "集中の音符": 3, "器用の音符": 3 }, ripple: 2, stack: 3 };
  const post = { r1: true, r3: true, r5: true };
  const add = (label, hit, measured, extra, crit) =>
    MEASUREMENTS.push(Object.assign({ label: "フロッグ後・" + label, hit, measured, crit: !!crit }, base, extra));
  add("着地1回目（発射直後）", "main-frog", 41325, {});
  add("メガホン1〜3撃目 フロッグ攻撃×1", "basic-mega-1", 15622, Object.assign({ frog: 1 }, post));
  add("メガホン4撃目 フロッグ攻撃×1", "basic-mega-4", 41413, Object.assign({ frog: 1 }, post));
  add("着地2回目 フロッグ攻撃×1", "main-frog", 79577, Object.assign({ frog: 1, tide: true }, post));
  add("メガホン1〜3撃目 フロッグ攻撃×2", "basic-mega-1", 16935, Object.assign({ frog: 2 }, post));
  add("メガホン1〜3撃目 会心 ×2", "basic-mega-1", 30822, Object.assign({ frog: 2 }, post), true);
  add("着地3回目 ×2", "main-frog", 86263, Object.assign({ frog: 2, tide: true }, post));
  add("メガホン1〜3撃目 ×3", "basic-mega-1", 18248, Object.assign({ frog: 3 }, post));
  add("メガホン4撃目 ×3", "basic-mega-4", 48371, Object.assign({ frog: 3 }, post));
  add("着地4回目 ×3", "main-frog", 92949, Object.assign({ frog: 3, tide: true }, post));
  add("メガホン1〜3撃目 ×4", "basic-mega-1", 19560, Object.assign({ frog: 4 }, post));
  add("メガホン4撃目 ×4", "basic-mega-4", 51851, Object.assign({ frog: 4 }, post));
  add("着地5回目 会心 ×4", "main-frog", 181337, Object.assign({ frog: 4, tide: true }, post), true);
  add("メガホン1〜3撃目 ×5", "basic-mega-1", 20873, Object.assign({ frog: 5 }, post));
  add("メガホン4撃目 ×5", "basic-mega-4", 55330, Object.assign({ frog: 5 }, post));
  add("メガホン1〜3撃目 会心 ×5", "basic-mega-1", 37989, Object.assign({ frog: 5 }, post), true);
  add("着地6回目 ×5", "main-frog", 106321, Object.assign({ frog: 5, tide: true }, post));
}

// ストンプクラブ戦・保存ビルド・中級徽章なし: 必殺技（479%×7 → 839%）。バブルマーク付与済み、フロッグ攻撃バフ4〜5、必殺バフ0〜5。
{
  const base = { enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1, 0, 1], notes: { "集中の音符": 3, "器用の音符": 3 }, ripple: 2, stack: 3, r1: true, r3: true, r5: true, mark: true };
  const add = (label, hit, measured, extra, crit) =>
    MEASUREMENTS.push(Object.assign({ label: "必殺技・" + label, hit, measured, crit: !!crit }, base, extra));
  add("連撃1発目 会心（必殺バフ0）", "ult-hit", 236895, { frog: 4, ult: 0 }, true);
  add("連撃 必殺バフ1", "ult-hit", 137715, { frog: 4, ult: 1 });
  add("連撃 必殺バフ2", "ult-hit", 145267, { frog: 4, ult: 2 });
  add("連撃 必殺バフ3", "ult-hit", 152819, { frog: 4, ult: 3 });
  add("連撃 必殺バフ4", "ult-hit", 160372, { frog: 4, ult: 4 });
  add("連撃 必殺バフ5・フロッグ5", "ult-hit", 176658, { frog: 5, ult: 5 });
  add("フィニッシュ 会心（バフ5・フロッグ5）", "ult-finish", 563161, { frog: 5, ult: 5 }, true);
}

// 必殺技の後の通常攻撃（バブルガンモード）。フロッグ攻撃5・必殺バフ5・バブルマーク付与済み。
{
  const base = { enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1, 0, 1], notes: { "集中の音符": 3, "器用の音符": 3 }, ripple: 2, stack: 3, r1: true, r3: true, r5: true, mark: true, frog: 5, ult: 5 };
  MEASUREMENTS.push(Object.assign({ label: "必殺後・バブルガン1〜3撃目", hit: "basic-bubble-1", measured: 39462 }, base));
  MEASUREMENTS.push(Object.assign({ label: "必殺後・バブルガン4撃目", hit: "basic-bubble-4", measured: 79407 }, base));
}

// 必殺後のフロッグ着地: 177,600 = 同条件の予測 154,441 × 1.15（出所不明のスキル被ダメージ+15%）
MEASUREMENTS.push({ label: "必殺後・フロッグ着地（+15%）", enemy: "stomp", lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"], emblems: [1, 0, 1], notes: { "集中の音符": 3, "器用の音符": 3 }, ripple: 2, stack: 3, r1: true, r3: true, r5: true, mark: true, frog: 5, ult: 5, tide: true, skill15: true, hit: "main-frog", measured: 177600 });

// ===== 徽章の強化項目（ステラソラWiki https://stellasora.wikiru.jp/?徽章 より）=====
// 三角章(Lv70) / 円形章(Lv80) / 六星輝章(Lv90) の3種。各徽章に特性4つ（重複なし）。品質は 緑・青・金・虹。
// 円形章はスキルレベル上昇（金・虹のみ）、六星輝章は素質レベル上昇（金・虹のみ）が出る。強化は1徽章につき2回まで（段階の数値表はWikiに無い）。
// 属性ダメージ・属性耐性貫通は巡遊者の属性（ウィローは水）で1つにまとめて扱う。
const _T = (g, b, y, r) => ({ green: g, blue: b, gold: y, rainbow: r });
window.EMBLEM_QUALITY = [["green", "緑"], ["blue", "青"], ["gold", "金"], ["rainbow", "虹"]];
window.EMBLEM_OPTIONS = [
  { key: "basicDmg", label: "通常攻撃ダメージ", type: "stat", fmt: "pct", tiers: _T(0.10, 0.125, 0.15, 0.30) },
  { key: "skillDmg", label: "スキルダメージ", type: "stat", fmt: "pct", tiers: _T(0.07, 0.08, 0.10, 0.20) },
  { key: "ultDmg", label: "必殺技ダメージ", type: "stat", fmt: "pct", tiers: _T(0.10, 0.13, 0.15, 0.30) },
  { key: "elemDmg", label: "属性ダメージ（巡遊者の属性）", type: "stat", fmt: "pct", tiers: _T(0.04, 0.05, 0.06, 0.12) },
  { key: "resPen", label: "属性耐性貫通（巡遊者の属性）", type: "stat", fmt: "flat", tiers: _T(35, 40, 53, 110) },
  { key: "critDmg", label: "会心ダメージ", type: "stat", fmt: "pct", tiers: _T(0.08, 0.10, 0.12, null) },
  { key: "critRate", label: "会心率（全般）", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, 0.15) },
  { key: "basicCritRate", label: "通常攻撃会心率", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, null) },
  { key: "skillCritRate", label: "スキル会心率", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, null) },
  { key: "ultCritRate", label: "必殺技会心率", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, null) },
  { key: "atkPct", label: "攻撃力", type: "stat", fmt: "pct", tiers: _T(0.04, 0.05, 0.06, 0.12) },
  { key: "baseAtk", label: "基礎攻撃力", type: "stat", fmt: "flat", tiers: _T(70, 88, 105, null) },
  { key: "hpPct", label: "HP", type: "stat", fmt: "pct", tiers: _T(0.04, 0.05, 0.06, 0.12) },
  { key: "baseHp", label: "基礎HP", type: "stat", fmt: "flat", tiers: _T(680, 850, 1020, null) },
  { key: "defPct", label: "防御力", type: "stat", fmt: "pct", tiers: _T(0.10, 0.12, 0.15, null) },
  { key: "baseDef", label: "基礎防御力", type: "stat", fmt: "flat", tiers: _T(35, 44, 53, null) },
  { key: "spMain", label: "主力SP獲得効率", type: "stat", fmt: "pct", tiers: _T(0.10, 0.125, 0.15, 0.30) },
  { key: "spSupport", label: "支援SP獲得効率", type: "stat", fmt: "pct", tiers: _T(0.135, 0.17, 0.203, 0.40) },
  { key: "markDmg", label: "印ダメージ", type: "stat", fmt: "pct", tiers: _T(0.27, 0.33, 0.40, 0.80) },
  { key: "markCritRate", label: "印会心率", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, null) },
  { key: "servantDmg", label: "従者ダメージ", type: "stat", fmt: "pct", tiers: _T(0.07, 0.08, 0.10, 0.20) },
  { key: "servantCritRate", label: "従者会心率", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, null) },
  { key: "derivedDmg", label: "派生物ダメージ（現状効果なし）", type: "stat", fmt: "pct", tiers: _T(0.07, 0.08, 0.10, 0.20) },
  { key: "derivedCritRate", label: "派生物会心率（現状効果なし）", type: "stat", fmt: "pct", tiers: _T(0.05, 0.063, 0.075, null) },
  // 円形章のみ（金・虹）。虹は +2〜3 で、ここでは +3 を使う。
  { key: "lvBasic", label: "通常攻撃レベル上昇", type: "skillLv", fmt: "lv", only: "circle", tiers: _T(null, null, 1, 3) },
  { key: "lvMain", label: "主力スキルレベル上昇", type: "skillLv", fmt: "lv", only: "circle", tiers: _T(null, null, 1, 3) },
  { key: "lvSupport", label: "支援スキルレベル上昇", type: "skillLv", fmt: "lv", only: "circle", tiers: _T(null, null, 1, 3) },
  { key: "lvUlt", label: "必殺技レベル上昇", type: "skillLv", fmt: "lv", only: "circle", tiers: _T(null, null, 1, 3) },
  // 六星輝章のみ（金・虹）。1枠につき特定の素質1つ。
  { key: "potMain", label: "主力素質レベル上昇（特定1つ）", type: "potLv", fmt: "lv", only: "star", tiers: _T(null, null, 1, 3) },
  { key: "potSupport", label: "支援素質レベル上昇（特定1つ）", type: "potLv", fmt: "lv", only: "star", tiers: _T(null, null, 1, 3) },
  { key: "potCommon", label: "汎用素質レベル上昇（特定1つ）", type: "potLv", fmt: "lv", only: "star", tiers: _T(null, null, 1, 2) },
];
// 実機の例（ウィロー環境の3枚）。qは品質。
window.EMBLEM_DEFAULT_CFG = [
  { name: "三角章（Lv70）", kind: "triangle", slots: [{ k: "atkPct", q: "blue" }, { k: "spMain", q: "blue" }, { k: "baseDef", q: "gold" }, { k: "defPct", q: "blue" }] },
  { name: "円形章（Lv80）", kind: "circle", slots: [{ k: "lvSupport", q: "rainbow" }, { k: "resPen", q: "gold" }, { k: "skillCritRate", q: "blue" }, { k: "servantDmg", q: "rainbow" }] },
  { name: "六星輝章（Lv90）", kind: "star", slots: [{ k: "potMain", q: "rainbow", note: "風に乗る泡雲 Lv+2" }, { k: "atkPct", q: "gold" }, { k: "basicDmg", q: "rainbow" }, { k: "skillDmg", q: "blue" }] },
];

// ===== ウィロー（水着）の素質（Lv1〜6の数値。出典: miraheze Suntide Willow ／ wikiru ウィロー(水着)。ゲーム内の説明と食い違う場合は画面を優先）=====
// effects[].k: atkPct=攻撃力% / skillB・basicB・ultB=種別ダメージ加算 / frogB=フロッグ着地のみのスキルダメージ加算 /
//   waterAdd=水属性ダメージ加算 / taken=敵の被ダメージ（別枠の乗算）/ critDmg・critRate。
// taken の scope: "water"=敵の水属性被ダメージ（水属性のダメージにだけ乗る）／"all"=全属性被ダメージ（他の属性の味方にも乗る）。
// vals は「最大スタック時の合計」（例: 夢幻泡影は 1スタックの値 × 6）。fixed はレベルの無いコア素質。
// extra: 追加攻撃など、現状の1ヒット比較に入れていない効果（参考表示）。Lv7〜9は徽章の+Nを使う場合の直線外挿（推定）。
// cond: 発動条件（ランキングでは常時発動として計算）。
window.POTENTIALS = [
  // --- 特化構築1（バブルガン） ---
  { id: "midare", jp: "乱れ飛ぶ水泡", en: "Bubble Flurry", grp: "build1", core: true, cond: "バブルマーク付きの敵からバブルを吸収", effects: [{ k: "frogB", fixed: 0.50 }], text: "バブル1個吸収ごとにフロッグ拡大+10%・フロッグのスキルダメージ+5%（上限100%＝+50%）" },
  { id: "bishin", jp: "微震する流光", en: "Rippling Radiance", grp: "build1", core: true, cond: "バブルガン中", effects: [{ k: "taken", scope: "water", fixed: 0.16 }], extra: "フロッグが1秒ごとに周囲へ水ダメージ（ゲーム内表示 攻撃力146%）。敵の水被ダメージ +4%×4", text: "敵の水被ダメージ +4%×最大4重（8秒）" },
  { id: "kodari", jp: "凝りて散らず", en: "Clustered Foam", grp: "build1", cond: "バブルマーク付きの敵", effects: [{ k: "waterAdd", vals: [0.046, 0.073, 0.101, 0.129, 0.156, 0.184] }], extra: "発射バブルが追加で攻撃力 17.1/27.4/37.7/47.9/58.2/68.5% の水ダメージ", text: "バブルマーク付きの敵への水属性ダメージ増加" },
  { id: "kuon", jp: "久遠に割れぬ泡", en: "Enduring Bubble", grp: "build1", cond: "バブルマーク付きの敵にダメージ", effects: [{ k: "taken", scope: "water", vals: [0.10, 0.16, 0.22, 0.28, 0.34, 0.40] }], text: "敵の水被ダメージ 2/3.2/4.4/5.6/6.8/8% ×最大5重（5秒）" },
  { id: "mugen", jp: "夢幻泡影", en: "Dreamlike Illusion", grp: "build1", cond: "自分以外が印を発動", effects: [{ k: "skillB", vals: [0.096, 0.156, 0.216, 0.276, 0.336, 0.396] }], text: "水属性巡遊者のスキルダメージ 1.6/2.6/3.6/4.6/5.6/6.6% ×最大6重（6秒）" },
  // --- 特化構築2（メガホン） ---
  { id: "ritsu", jp: "律動する光泡", en: "Rhythmic Bubbles", grp: "build2", core: true, cond: "メガホン中", effects: [{ k: "frogB", fixed: 0.50 }], extra: "フロッグのジャンプ頻度+100%、ジャンプごとにデシベル+5", text: "フロッグのスキルダメージ+50%" },
  { id: "nanairo", jp: "跳ね回る七彩", en: "Rainbow Rebound", grp: "build2", core: true, cond: "メガホン中", effects: [{ k: "taken", scope: "all", fixed: 0.144 }], extra: "ジャンプごとにエコーウェーブ（攻撃力14.5%×3）", text: "全属性被ダメージ +1.8%×最大8重" },
  { id: "yurameku", jp: "揺らめく浮光", en: "Wavering Glow", grp: "build2", cond: "メガホン中・2ジャンプごと", effects: [{ k: "taken", scope: "all", vals: [0.084, 0.140, 0.192, 0.244, 0.296, 0.348] }], extra: "2回ジャンプごとに広範囲へ攻撃力 21.9/35/48.1/61.2/74.3/87.5% の水ダメージ＋水流", text: "全属性被ダメージ 2.1/3.5/4.8/6.1/7.4/8.7% ×最大4重" },
  { id: "saibotsu", jp: "砕沫の余韻", en: "Foam Echo", grp: "build2", cond: "エコーウェーブがダメージ時", effects: [{ k: "atkPct", vals: [0.184, 0.296, 0.408, 0.520, 0.632, 0.744] }], text: "ウィローと水属性以外の攻撃力 2.3/3.7/5.1/6.5/7.9/9.3% ×最大8重（5秒）" },
  { id: "chakuchi", jp: "着地からの跳躍", en: "Touch 'n' Bounce", grp: "build2", cond: "フロッグのジャンプごと（2.5秒）", effects: [{ k: "skillB", vals: [0.096, 0.160, 0.216, 0.280, 0.336, 0.400] }], text: "チーム全体のスキルダメージ 1.2/2/2.7/3.5/4.2/5% ×最大8重（水属性以外はさらに加算）" },
  // --- 汎用 ---
  { id: "cumulus", jp: "風に乗る泡雲", en: "Cumulus Drift", grp: "common", cond: "フロッグ存在中", effects: [{ k: "atkPct", vals: [0.10, 0.16, 0.22, 0.28, 0.34, 0.40] }], extra: "フロッグの効果時間+3秒", text: "フロッグ存在中、チームの攻撃力上昇" },
  { id: "singing", jp: "碧岸に謡う風", en: "Singing Shores", grp: "common", cond: "回避後8秒（回避が必要）", effects: [{ k: "atkPct", vals: [0.15, 0.24, 0.33, 0.42, 0.51, 0.60] }], extra: "回避発動回数+1", text: "回避後、ウィロー自身の攻撃力上昇" },
  { id: "ocean", jp: "浪を追い風を聴く", en: "Ocean Wanderer", grp: "common", cond: "", effects: [], extra: "フロッグがダメージ時、基礎攻撃力 32.1〜128.7% のシールド（10秒に1回）", text: "シールド（火力には影響しない）" },
  { id: "shiosai", jp: "潮騒の戒め", en: "Tidal Warning", grp: "common", cond: "", effects: [{ k: "ultB", vals: [0.33, 0.53, 0.73, 0.93, 1.13, 1.33] }], extra: "必殺発動後1.5秒ごとにデシベル+3（合計30まで）", text: "必殺技ダメージ増加" },
  { id: "beach", jp: "ビーチ管制", en: "Shore Regulation", grp: "common", cond: "必殺技発動後25秒", effects: [{ k: "atkPct", vals: [0.10, 0.17, 0.23, 0.29, 0.35, 0.42] }], text: "必殺技発動時、チームの攻撃力上昇（25秒）" },
  { id: "kiritsu", jp: "規律敷く海風", en: "Marine Justice", grp: "common", cond: "必殺技がダメージを与えた後20秒", effects: [{ k: "taken", scope: "water", vals: [0.135, 0.215, 0.295, 0.380, 0.460, 0.540] }], text: "敵の水被ダメージ 2.7/4.3/5.9/7.6/9.2/10.8% ×最大5重（20秒）" },
];
// 支援として出場した場合の素質（参考。主力計算には未使用）
window.POTENTIALS_SUPPORT = [
  "飛び散るしぶき（コア）: メロウ・ラウド両方のステータス増加。10射撃ごとに水柱攻撃（攻撃力1190%×3）",
  "岸を覆う激流（コア）: デシベル40消費で広範囲に水柱攻撃（570%×3）",
  "たゆたう音の浪（コア）: 初期デシベル70。100到達で14秒間チーム会心率+10%",
  "耳を震わす浪鳴（コア）: 射撃ごとのデシベル獲得2→4。ラウド中は強化弾（倍率+50%）",
  "低徊する海風: 印ダメージ追加 118〜474%", "変わらぬ戒め: 最大スタック7〜12・敵の水被ダメージ増加",
  "鳴り止まぬ海鳴: メロウ中 チーム水属性ダメージ +12〜47%", "異色の水泡: 青泡41〜163%・チーム会心率+5〜20%・赤泡で主力攻撃力+19〜74%",
  "呑み込む巨浪: エリア内の主力の水ダメージ +18〜70%", "遠ざかる潮騒: デシベル消費ごとにチーム会心ダメージ +0.6〜2.4%（最大16重）",
  "和らぎの浪風: 防御貫通 +9〜34（水属性の味方1人につき）", "流彩の障壁: シールド", "柔らかな海色: ウィローが場にいる間 チーム攻撃力 +10〜42%",
  "汎用: 潮騒の戒め／ビーチ管制／規律敷く海風（主力と同じ）",
];
// 素質レベルの数値（Lv7〜9は直線外挿）
window.potVal = function (vals, lv) {
  if (!vals || lv <= 0) return 0;
  if (lv <= vals.length) return vals[lv - 1];
  const step = vals[vals.length - 1] - vals[vals.length - 2];
  return vals[vals.length - 1] + step * (lv - vals.length);
};


// ===== ロスレコのアシスト効果を計算用に変換（音符のレベルが解放条件を満たすと発動）=====
// eff[].k: atkPct / skillB / ultB / waterAdd / critDmg / takenBasic など（calc.js の applyEff と同じ種類）。
// perRipple: リプルノート1つあたり。条件付きの効果は常時発動として計算（画面の「チームバフ」で個別に外せる）。
(function () {
  const L = id => LOSTRECORDS.find(r => r.id === id);
  const set = (id, name, eff) => { const a = L(id).assist.find(x => x.name === name); if (a) a.eff = eff; };
  set("tomo-no-natsuyasumi", "流水のささやき", [{ k: "ultB", v: 0.06 }, { k: "waterAdd", perRipple: 0.01 }]);
  set("tomo-no-natsuyasumi", "島のハミング", [{ k: "skillB", v: 0.045, needRipple: 2 }]);
  set("yurameku-hikari", "蒼海のプリズム", [{ k: "critDmg", v: 0.12 }]);
  set("yurameku-hikari", "陽光照らす白浜", [{ k: "waterAdd", v: 0.08 }, { k: "atkPct", v: 0.08 }]);
  set("furuike-no-mizuoto", "火照りを冷ます飛沫", [{ k: "atkPct", v: 0.14 }]);
  set("furuike-no-mizuoto", "山紫水明", [{ k: "skillB", v: 0.12 }]);
})();

// ===== 編成の支援キャラ（ユーザーの育成状況。画面スクショから）=====
// 基礎値・スキル倍率は data/trekkers.js（Wiki）。ここには「このユーザーの育成状況」と、画面で確認した値を入れる。
window.PARTY = window.PARTY || {};
window.PARTY.nazuka = {
  en: "Nazuka", jp: "ナツカ", element: "風", role: "バランサー（Versatile）", rarity: 5, level: 90,
  skillLv: { basic: 1, main: 1, support: 8, ult: 7 },
  // スキル画面で確認した倍率（Wikiの値と一致）。主力スキルの印ダメージ69.3%は Lv1。
  seen: {
    basic: { lv: 1, hits: [28, 31, "18.7×3"] },
    main: { lv: 1, hit: "11.8×7", markDmg: 69.3, cd: 8 },
    support: { lv: 8, orb: 476, field: "475/秒×6秒", petal: "262×6", cd: 12, mark: "風属性の印: 風息（そよ風）を付与" },
    ult: { lv: 7, tornado: "320×3（3秒ごと）", cd: 30, sp: 275 },
  },
  // ステータス詳細（外）。「+」は 心相・信頼・徽章 などの合計。内訳は心相・信頼・徽章の画面待ち。
  status: { hp: 51179, hpPlus: 4670, atk: 7484, atkPlus: 1941, def: 190, critRate: 0.05, critDmg: 1.5, weak: 0, spMax: 275,
    spMain: 1.0, spSupport: 1.353, defPen: 0, elemDmg: 1.12, resPen: 0 },
  pending: ["心相", "信頼", "徽章", "素質（支援）"],
};

// ナツカ: 信頼・心相・徽章（スクショ）。検証: 攻撃 = (7484 + 信頼504) × (1 + 信頼12% + 徽章6%) = 9,425.8 → 画面 7484+1941=9,425 と一致。HP = 51,179 + 信頼4,670 = 55,849 と一致。
Object.assign(window.PARTY.nazuka, {
  trustLv: 17, trust: { hp: 4670, atk: 504, atkPct: 0.12, next: { hp: 334, atk: 36 } },
  talentUnlocked: 0, // 心相I〜Vとも解放進捗 0/10（画面で確認済み）
  embCfg: [
    { name: "初級徽章：探検者の三角章 III", kind: "triangle", slots: [{ k: "spSupport", q: "gold" }, { k: "derivedCritRate", q: "blue" }, { k: "basicDmg", q: "blue" }, { k: "elemDmg", q: "rainbow" }] },
    { name: "中級徽章：列福の円形章 II", kind: "circle", slots: [{ k: "spSupport", q: "rainbow" }, { k: "atkPct", q: "gold" }, { k: "ultCritRate", q: "gold" }, { k: "skillCritRate", q: "gold" }] },
    { name: "上級徽章：騎士団長の六星輝章 IV", kind: "star", slots: [{ k: "potSupport", q: "rainbow", note: "花嵐の加護 Lv+2" }, { k: "potSupport", q: "rainbow", note: "散華の歓び Lv+2" }, { k: "ultDmg", q: "green" }, { k: "markDmg", q: "green" }] },
  ],
});
// ナツカの素質の日本語名（wikiru）と英語名の対応（支援）
window.PARTY.nazuka.potentialJp = {
  support: { core1: ["花びらの詩 (Youth: Dazzling)", "花びらの舞 (Youth: Hunting)"], core2: ["花の海・凪 (Flower Formation: Waves)", "花の海・逆波 (Flower Formation: Turbulent)"],
    sub1: ["散華の歓び (Youth: Blooming)", "散華の哀しみ (Youth: Weakness)", "散華の怒り (Youth: Annihilation)"],
    sub2: ["花の海・怒涛 (Blast)", "花の海・さざ波 (Convergence)", "花の海・波紋 (Erosion)"],
    common: ["嵐の目 (Almighty Leader)", "玉風の加護 (Wind Demon Seed)", "花嵐の加護 (Self-Improvement)", "かまいたちの舞 (Multi-Hurricane)", "禊の風 (Aeolus's Blessing)", "一陣の雄風 (Maelstrom)"] },
};
// ナツカの心相（wikiru）。解放していない（talentUnlocked=0）ので現状は効かない。
window.PARTY.nazuka.resonanceJp = [
  "I 巡遊者の矜持: 必殺技の竜巻が存在する間、チーム全体のスキルダメージ+45%",
  "II 爽風の才媛: スキルダメージで風吟→風怒。風怒中12秒、ナツカの風属性ダメージ+20%",
  "III 先導者の責務: ナツカがスキルダメージを与えるたび、その敵の風属性被ダメージ+1.4%（6秒・10重）",
  "IV 鑑の使命: チーム全体が風属性の印を発動すると、6秒間ナツカのスキルダメージ+28%",
  "V 仲間の絆: エリート以上の敵への風属性ダメージ+24%",
];

// ===== エレノア（支援）。画面: 詳細・ステータス詳細（外）=====
// 信頼Lv・心相・徽章は、画面の合計「+」から逆算した推定（HP・攻撃の2式が同時に成立する組み合わせは、信頼Lv20・心相0・基礎値の加算なし）。
window.PARTY.eleanor = {
  // スキル画面で確認した倍率はWikiデータと一致（通常 31.7/20.1×5/32.2×5/25.2×6/11.5×7＋レディ・クロス57.3、主力 94×2＋警戒116、支援 199.8×9＋ドローン120.2、必殺 286×14）。
  en: "Eleanor", jp: "エレノア", element: "風", role: "バランサー（Versatile）", rarity: 5, level: 90,
  status: { hp: 88236, hpPlus: 10952, atk: 7542, atkPlus: 3336, def: 190, critRate: 0.05, critDmg: 1.5, weak: 0, spMax: 275,
    spMain: 1.0, spSupport: 1.123, defPen: 0, elemDmg: 1.16, resPen: 0 },
  inferred: { trustLv: 20, talentUnlocked: 0, emblemAtkPct: 0.18, emblemHpPct: 0.06, emblemElemDmg: 0.16, emblemSpSupport: 0.373, note: "信頼・心相・徽章の画面で確認する" },
  skillLv: { basic: 1, main: 1, support: 9, ult: 8 },
  pending: ["素質（支援）"],
};

// エレノア: 信頼・徽章・心相（スクショ）。逆算した推定と一致: 信頼Lv20（基礎HP+5,338／基礎攻撃+576／攻撃力+16%）、徽章の合計 攻撃力18%・HP6%・風属性ダメージ16%・支援SP37.3%。
Object.assign(window.PARTY.eleanor, {
  trustLv: 20, trust: { hp: 5338, atk: 576, atkPct: 0.16, next: { hp: 333, atk: 36 } },
  talentUnlocked: 0, // 心相I 解放進捗 0/10（無凸）
  embCfg: [
    { name: "初級徽章：探検者の三角章 III", kind: "triangle", slots: [{ k: "basicDmg", q: "gold" }, { k: "atkPct", q: "gold" }, { k: "elemDmg", q: "rainbow" }, { k: "spSupport", q: "blue" }] },
    { name: "中級徽章：列福の円形章 I", kind: "circle", slots: [{ k: "hpPct", q: "gold" }, { k: "basicCritRate", q: "gold" }, { k: "derivedDmg", q: "blue" }, { k: "spSupport", q: "gold" }] },
    { name: "上級徽章：騎士団長の六星輝章 III", kind: "star", slots: [{ k: "potSupport", q: "gold", note: "リーダーの片鱗 Lv+1" }, { k: "potSupport", q: "rainbow", note: "神器転換 Lv+2" }, { k: "elemDmg", q: "green" }, { k: "atkPct", q: "rainbow" }] },
  ],
});
window.PARTY.eleanor.resonanceJp = [
  "I 籠を出た鳥: エレノアが敵に通常攻撃ダメージを与えた時、8秒間その敵の風属性被ダメージ+3.5%（6回まで重複）。次のレベルで基礎攻撃力+50",
];

// ===== 保存済みビルド「テスト用」（記録詳細のスクショ。スコア8250）=====
// 編成: 主力 ウィロー（水着）／支援 ナツカ／支援 エレノア。ウィローは中級徽章（80徽章）を外した状態。
// 画面の「素質の合計」: ウィロー 31+2（レベル合計31＋コア2）、ナツカ 21+2、エレノア 24+1。
LOSTRECORDS.push(
  { id: "eikou-no-shunkan", name: "栄光の瞬間", rarity: 5, element: "風", level: 90, levelMax: 90, stats: { baseAtk: 1533, elemDmg: 0.12 },
    core: { name: "栄光の瞬間", rank: "VI", text: "風属性のバランサー巡遊者が通常攻撃ダメージまたはスキルダメージを与えた時、風属性の主力巡遊者は栄光を1獲得する（15秒、20回まで重複）。栄光が10の時、チーム内の風属性巡遊者が与える風属性ダメージ+10%。栄光が20の時、さらにチーム内の風属性巡遊者が与える通常攻撃ダメージ+10%。", activation: "conditional" },
    assist: [{ name: "祝福の追い風", level: 1, text: "チーム内の風属性巡遊者の攻撃力が2.4%…（続きは未取得）" }] },
  { id: "hakujitsu-no-kaen", name: "白日の花園", rarity: 5, element: "風", level: 90, levelMax: 90, stats: { baseAtk: 1192, elemDmg: 0.15 },
    core: { name: "白日の花園", rank: "III", text: "風属性の主力巡遊者の通常攻撃ダメージとスキルダメージが19.6%増加する。チーム内の巡遊者が風属性の印を発動させた時から4秒間、主力巡遊者の風属性ダメージが16.8%増加する。", activation: "conditional" },
    assist: [{ name: "香しき面影", level: 1, text: "チーム内の風属性巡遊者の必殺技ダメージが8%増加する。風属性の主力巡遊者が必殺技ダメージを与えた時から20秒間、自身の風属性ダメージが4.8%増加する。" }] },
  { id: "ouka-ranman", name: "桜花爛漫", rarity: 5, element: "風", level: 90, levelMax: 90, stats: { baseAtk: 981, elemDmg: 0.15 },
    core: { name: "桜花爛漫", rank: "I", text: "風属性の主力巡遊者がスキルを発動時、自身は10秒間、細雪を1獲得する（3回まで重複）。通常攻撃ダメージを与えた時、細雪の数1/2/3に応じて敵に10秒間、風属性の通常攻撃被ダメージが6%/12%/18%増加する。スキルダメージを与えた時、細雪の数に応じて敵に10秒間、風属性のスキル被ダメージが2.5%/5%/7.5%増加する。", activation: "conditional" },
    assist: [{ name: "春一番", level: 1, text: "（未取得）" }] },
);
window.SAVED_BUILDS = window.SAVED_BUILDS || {};
window.SAVED_BUILDS.test = {
  name: "テスト用", score: 8250, recordLv: 28,
  party: { main: "suntide-willow", support1: "nazuka", support2: "eleanor" },
  lr: ["eikou-no-shunkan", "hakujitsu-no-kaen", "ouka-ranman"],
  lrTotal: "攻撃力が2511、最大HPが23440上昇する（戦闘中に全員の基礎攻撃力・基礎HPへ加算されると実測で確認）",
  flatAtk: 2511, flatHp: 23440,
  willowEmblemsOff: ["中級（80徽章）"],
  notes: { "強撃の音符": 26, "幸運の音符": 25, "爆発の音符": 22, "体力の音符": 24, "集中の音符": 35, "器用の音符": 8, "必殺の音符": 48, "水の音符": 3, "風の音符": 7 },
  assistState: "全て未発動（音符が解放条件に届いていない）",
  potentials: {
    willow: { cores: ["律動する光泡", "跳ね回る七彩"], levels: { "風に乗る泡雲": 8, "揺らめく浮光": 6, "砕沫の余韻": 6, "着地からの跳躍": 6, "久遠に割れぬ泡": 3, "ビーチ管制": 2 } },
    nazuka: { cores: ["花の海・凪", "花の海・逆波"], levels: { "花の海・怒涛": 2, "嵐の目": 2, "花嵐の加護": 8, "花の海・波紋": 6, "玉風の加護": 3 } },
    eleanor: { cores: ["ペイントバースト", "キャンバス拡張"], levels: { "(6)": 6, "(6)": 6, "リーダーの片鱗": 7, "(4)": 4 }, note: "エレノアの一覧は途中で切れている（24+1）。スクロールした画面が必要" },
  },
};

// 支援スキルの実測（ストンプクラブ戦・保存ビルド「テスト用2」＝1Fクリア時点・素質はウィローのコアのみ）
// ナツカ: 攻撃力18,481 / W=1.901 / B=1.0138 / D(風)=0.2012（花びらから逆算）。オーブと花の海は、この D で予測して一致。
window.SUPPORT_MEASUREMENTS = [
  { who: "nazuka", skill: "support", hit: "花びら262%", measured: 18779, crit: 28774, note: "D(風)の逆算に使用" },
  { who: "nazuka", skill: "support", hit: "花のオーブ476%（追撃の1発）", measured: 34119, predicted: 34118 },
  { who: "nazuka", skill: "support", hit: "花の海475%（毎秒）", measured: 34047, predicted: 34046 },
  { who: "eleanor", skill: "support", hit: "跳びはね爆発199.8%（持続中）", measured: 16700, predicted: 16698 },
  { who: "eleanor", skill: "support", hit: "ドローンの弾120.2%（通常攻撃扱い）", measured: 12229, predicted: 12228 },
  { who: "eleanor", skill: "support", hit: "ドローンの弾 会心", measured: 18738, predicted: 18735 },
];


// ===== サブロスレコ（スクショ）。サブは「基本ステータスと追加の音符」を提供。同じ一覧からメイン・サブのどちらにも使える =====
LOSTRECORDS.push(
  { id: "yukidoke-reimei", name: "雪解け告げる黎明", rarity: 5, element: "風", level: 90, levelMax: 90, stats: { baseAtk: 1533, elemDmg: 0.12 }, initNotes: { "必殺の音符": 7, "集中の音符": 7 }, core: null, assist: [] },
  { id: "chitei-no-kanata", name: "地底の彼方へ！", rarity: 5, element: "風", level: 90, levelMax: 90, stats: { baseAtk: 1533, elemDmg: 0.12 }, initNotes: { "風の音符": 7, "爆発の音符": 7 }, core: null, assist: [] },
  { id: "lemonade-koucha", name: "レモネードと紅茶", rarity: null, element: "風", level: 70, levelMax: 90, stats: { baseAtk: 552, elemDmg: 0.10 }, initNotes: { "幸運の音符": 2, "体力の音符": 10 }, core: null, assist: [] },
);
// 検証ビルド「テスト用2」（星ノ塔1Fクリア時点）: ウィロー主力・ナツカ/エレノア支援
window.TEST2_CTX = {
  lr: ["eikou-no-shunkan", "hakujitsu-no-kaen", "ouka-ranman"],
  lrSub: ["yukidoke-reimei", "chitei-no-kanata", "lemonade-koucha"],
  notes: { "強撃の音符": 9, "幸運の音符": 2, "爆発の音符": 7, "体力の音符": 10, "集中の音符": 7, "器用の音符": 3, "必殺の音符": 7, "水の音符": 3, "風の音符": 7 },
  enemy: "stomp",
  flatAtk: 95, flatHp: 890, // 記録詳細の吹き出し「攻撃力が95、最大HPが890上昇する」
};
// 保存ビルド「テスト用」（固定加算+2511・ナツカ素質あり・ウィローは通常攻撃のみ＝チーム効果なし）の再現用
window.TEST_CTX = Object.assign({}, TEST2_CTX, {
  notes: SAVED_BUILDS.test.notes, flatAtk: 2511, flatHp: 23440, willowStk: 0,
  willowPots: { kuon: 3, yurameku: 6, saibotsu: 6, chakuchi: 6, cumulus: 8, beach: 2, ritsu: 1, nanairo: 1 },
  sup: { nazuka: { waves: { lv: 1 }, turbulent: { lv: 1, on: false }, blast: { lv: 2 }, leader: { lv: 2 }, selfimp: { lv: 8 }, erosion: { lv: 6, stk: 0 }, seed: { lv: 3 } },
         eleanor: { chain: { lv: 1 }, seismic: { lv: 1 }, pull: { lv: 6 }, analysis: { lv: 4 }, echo: { lv: 6, on: false }, ampl: { lv: 7, on: false } } },
});
// 「テスト用」のエレノア（支援スキルの終盤＝お嬢様の本気3重・リーダーの片鱗10重・爆発9重のとき）
window.TEST_PLATEAU_CTX = JSON.parse(JSON.stringify(TEST_CTX));
Object.assign(window.TEST_PLATEAU_CTX.sup.eleanor, { echo: { lv: 6, on: true }, ampl: { lv: 7, on: true } });
// ウィローのチーム効果（メガホン中・ナツカの支援スキル）の当てはめ。重複数数は実測の倍率からの推定（砕沫の余韻と七彩は同じエコーウェーブ起点なので同数程度）
window.TEST_W1_CTX = Object.assign(JSON.parse(JSON.stringify(TEST_CTX)), { willowN: { cumulus: 1, saibotsu: 0, nanairo: 4, chakuchi: 1 }, bossLv: 1 });
window.TEST_W2_CTX = Object.assign(JSON.parse(JSON.stringify(TEST_CTX)), { willowN: { cumulus: 1, saibotsu: 8, nanairo: 1, chakuchi: 1 }, bossLv: 4 });
window.TEST_W3_CTX = Object.assign(JSON.parse(JSON.stringify(TEST_CTX)), { willowN: { cumulus: 1, saibotsu: 3, nanairo: 4, yurameku: 1, chakuchi: 1 }, bossLv: 7 });

