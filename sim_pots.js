// 光チーム（セイナ(原点)・ホタル・ティリア）の素質の効果。Wiki（英語）の文章を読んで、計算に入れる効果に分類した表。
// 数値は data/trekkers.js の nums（Lv1〜6）から取る（Lv7以降は直線延長）。Wikiの文章にだけある数値は raw / arr に書く。
// 効果 e:  k = 効果の種類
//   W/Bs/Bb/Bu = 属性/スキル/通常/必殺ダメージ加算   atkPct = 攻撃力%   hpFlat/atkFlat = 基礎HP/基礎攻撃力の加算(掛け算の前)
//   pen = 属性耐性貫通   mark = 印ダメージ加算   critRate/critDmg = 会心率/会心ダメージ(ht=種別 tags=対象のタグ)
//   mult = ヒットの倍率を (1+x) 倍(tags=対象)   taken = 敵の光属性被ダメージ(別枠の乗算)   takenMark/takenSkill = 敵の印/スキル被ダメージ
//   extra = 追加ヒット(group=技グループ、'*'は全て、m=倍率%、c=回数)   count = ヒット回数の加算(hit)   drop = ヒットの置き換え(hit)
//   n = nums の番号 / raw = 割合の固定値 / m(extra) = 倍率% / arr = 文章にだけある Lv別の値(%)  flat = 割合ではなく実数
//   stk = 最大の重なり   perLux = 光属性の人数を掛ける   to = 効く相手(self 既定 / lux 光の全員 / all 全員 / main 主力 / luxVers 光のバランサー)
//   cond = 条件(glimmer 敵に残光 / allLux 全員が光)   sk = 重なりの入力名   perGlow / perTag = 回数を グロウ・タグの数に合わせる
// off:true = 条件が重いので既定で反映しない。txt = 反映した内容（画面に表示）。
window.SIM = window.SIM || {};
(function (S) {
  const X = (group, name, o) => Object.assign({ k: "extra", group, name, t: "skill", c: 1 }, o);
  const SPEC = {
    noya: {
      "Lucent Blitz": { txt: "主力スキル：長剣 +4回、光刃9発（各21%・スキル）", e: [{ k: "count", hit: "mLong", add: 4 }, X("main", "光刃（Lucent Blitz）", { m: 21, c: 9, tags: ["glow", "long"] })] },
      "Dawnflare": { txt: "主力スキル：ブレードライト 134%×6（スキル）／通常攻撃の突進：光刃3発（各21%）", e: [X("main", "ブレードライト（Dawnflare）", { m: 134, c: 6, tags: ["long"] }), X("basic", "突進の光刃（Dawnflare）", { m: 21, c: 3, tags: ["glow", "long"] })] },
      "Prism Warp": { txt: "光刃が戻って追加ダメージ（スキル）＋長剣・光刃のスキル会心率", e: [X("*", "光刃の戻り（Prism Warp）", { n: 0, perGlow: true, tags: [] }), { k: "critRate", n: 1, tags: ["long", "glow"], ht: "skill" }] },
      "Resolve: Blitz": { txt: "残光の敵に、長剣・光刃の倍率 ×(1+x)", e: [{ k: "mult", n: 0, tags: ["long", "glow"], cond: "glimmer" }] },
      "Lucent Tide": { txt: "（逆転の光明）光刃が印を発動できる（未反映）／主力スキル後12秒：セイナのスキル会心率＋、光のバランサーのスキル会心ダメ＋（2重）", e: [{ k: "critRate", n: 0, ht: "skill", stk: 2 }, { k: "critDmg", n: 1, ht: "skill", stk: 2, to: "luxVers" }] },
      "Stardust Descent": { txt: "主力スキル：スターフォール2個（各23%・通常）／突進が大剣89%＋スターフォールに置き換わる", e: [X("main", "スターフォール（Stardust Descent）", { m: 23, c: 2, t: "basic", tags: ["starfall"] }), { k: "drop", hit: "sprint" }, X("basic", "突進の大剣（Stardust Descent）", { m: 89, t: "basic", tags: ["great"] }), X("basic", "突進のスターフォール", { m: 23, t: "basic", tags: ["starfall"] })] },
      "Sinbreaker": { txt: "ジャッジメントスターフォール 222%×2（通常）／通常攻撃ダメージ +20%", e: [X("basic", "ジャッジメントスターフォール", { m: 222, c: 2, t: "basic", tags: ["great"] }), { k: "Bb", raw: 0.20 }] },
      "Eclipse Phantom": { txt: "ジャッジメント後のフィールド 41〜165%×6（通常）＋大剣・スターフォールの通常会心率", e: [X("basic", "フィールド（Eclipse Phantom）", { n: 0, c: 6, t: "basic", tags: ["great"] }), { k: "critRate", n: 1, tags: ["great", "starfall"], ht: "basic" }] },
      "Gavel of Absolution": { txt: "スターフォール消滅時の雷撃（通常）＋通常会心率", e: [X("*", "雷撃（Gavel of Absolution）", { n: 0, t: "basic", perTag: "starfall" }), { k: "critRate", n: 1, ht: "basic" }] },
      "Resolve: Sunder": { txt: "防御貫通（防御の式が未確認のため計算に未反映）", e: [] },
      "Astral Brilliance": { txt: "光属性の人数×耐性貫通", e: [{ k: "pen", n: 0, flat: true, perLux: true }] },
      "Searing Sun": { txt: "残光の敵に光属性ダメージ＋、最大HP＋（基礎値に加算）", e: [{ k: "W", n: 0, cond: "glimmer" }, { k: "hpFlat", n: 1, flat: true }] },
      "Veteran's Grit": { txt: "最大HP＋（基礎値に加算）", e: [{ k: "hpFlat", n: 0, flat: true }] },
      "Argent Mirage: Legion's End": { txt: "スキルダメージ＋／必殺（長剣形態）に光刃7発（スキル）", e: [{ k: "Bs", n: 1, over: { 9: 75 } }, X("ult", "光刃（Argent Mirage）", { n: 0, c: 7, tags: ["glow", "long"], over: { 9: 150 } })] },
      "Empyrean Starfall: Devil's End": { txt: "通常攻撃ダメージ＋／必殺（大剣形態）のフィールド 41〜165%×6（通常）", e: [{ k: "Bb", n: 1 }, X("ult", "フィールド（Devil's End）", { n: 0, c: 6, t: "basic", tags: ["great"] })] },
      "Guiding Star": { txt: "（閃星の戦乙女）閃星効果中の会心ダメージ＋（Lv6 +60%）", e: [{ k: "critDmg", n: 0 }] },
      "Tempest Scourge": { txt: "支援スキル：大剣のフィールド 92%×6（通常）", e: [X("support", "フィールド（Tempest Scourge）", { m: 92, c: 6, t: "basic", tags: ["great"] })] },
      "Inquisitor's Edge": { txt: "支援スキル：スターフォール11個（各50%・通常）", e: [X("support", "スターフォール（Inquisitor's Edge）", { m: 50, c: 11, t: "basic", tags: ["starfall"] })] },
      "Radiant Sever": { txt: "通常攻撃ダメージ＋（最大3重）", e: [{ k: "Bb", n: 0, stk: 3 }] },
      "Aegis: Sunder": { txt: "光属性ダメージ＋（長剣が当たるたび・最大5重）", e: [{ k: "W", n: 0, stk: 5 }] },
      "Fiendbreaker": { txt: "大剣・スターフォールの倍率 ×(1+x)", e: [{ k: "mult", n: 0, tags: ["great", "starfall"] }] },
      "Skyrend Flash": { txt: "支援スキル：光刃を連射（各28%・スキル）。回数は不明のため仮に10回", e: [X("support", "光刃（Skyrend Flash）", { m: 28, c: 10, tags: ["glow", "long"], edit: true })] },
      "Galeblade": { txt: "支援スキル：長剣 +10回", e: [{ k: "count", hit: "sLong", add: 10 }] },
      "Sunfire Cleave": { txt: "長剣・光刃のスキルダメージ＋", e: [{ k: "Bs", n: 0, tags: ["long", "glow"] }] },
      "Aegis: Blitz": { txt: "光属性ダメージ＋（大剣が当たるたび・最大3重）", e: [{ k: "W", n: 0, stk: 3 }] },
      "Breath of Light": { txt: "長剣・光刃の倍率 ×(1+x)", e: [{ k: "mult", n: 0, tags: ["long", "glow"] }] },
      "No More Goodbyes": { txt: "光属性の人数×（光属性の全員の光属性ダメージ＋）", e: [{ k: "W", n: 0, perLux: true, to: "lux" }] },
      "No More Sorrow": { txt: "光属性の主力が主力スキルを使うと、光属性ダメージ＋（15秒）", e: [{ k: "W", n: 0 }] },
      "No More Chains": { txt: "光属性ダメージ＋（最大3重・10秒）", e: [{ k: "W", n: 0, stk: 3 }] },
    },
    firefly: {
      "Firefly Glow: Radiance": { txt: "主力スキル：浮遊砲の同時射撃 11.9%×4（通常）。回数は仮に112回（14秒÷0.5秒×4）", e: [X("main", "同時射撃（Glow: Radiance）", { m: 11.9, c: 112, t: "basic", tags: ["cannon"], edit: true })] },
      "Firefly Glow: Luminary": { txt: "フォーカス12重で通常攻撃ダメージ +65%", e: [{ k: "Bb", raw: 0.65 }] },
      "Radiant Rainfall": { txt: "6秒ごとの一斉射 34〜138%×4＋爆発 115〜460%（通常）。14秒で2回と仮定", e: [X("main", "一斉射（Radiant Rainfall）", { n: 0, c: 8, t: "basic", tags: ["cannon"], edit: true }), X("main", "爆発（Radiant Rainfall）", { n: 1, c: 2, t: "basic", tags: ["cannon"], edit: true })] },
      "Tide of Starmarks": { txt: "全員の攻撃力%（最大100重）", e: [{ k: "atkPct", n: 0, stk: 100, to: "all" }] },
      "Lone Star Gleam": { txt: "通常攻撃ダメージ＋（単体の敵）", e: [{ k: "Bb", n: 0 }] },
      "Firefly Glow: Convergence": { txt: "主力スキル：サンレイ 85%（スキル）。10秒に1回×5発×… 仮に10回", e: [X("main", "サンレイ（Glow: Convergence）", { m: 85, c: 10, tags: ["cannon"], edit: true })] },
      "Firefly Glow: Scatter Beam": { txt: "反射は同じ敵に2度当たらないため、単体の敵では効果なし", e: [] },
      "Astral Album": { txt: "主力スキル：エネルギー弾＋爆発（スキル）", e: [X("main", "エネルギー弾（Astral Album）", { n: 0 }), X("main", "爆発（Astral Album）", { n: 1 })] },
      "Luminous Rhythm": { txt: "射撃間隔が不明のため計算に未反映", e: [] },
      "Flash Resonance": { txt: "全員の攻撃力%（最大5重）", e: [{ k: "atkPct", n: 0, stk: 5, to: "all" }] },
      "Blazing Radiance": { txt: "印ダメージ＋、印を出すたびに光属性ダメージ＋（最大10重）", e: [{ k: "mark", n: 0 }, { k: "W", n: 1, stk: 10 }] },
      "Phantom Blast": { txt: "回避時の影（スキル）。回避が必要なので既定は反映しない", off: true, e: [X("main", "影（Phantom Blast）", { n: 0 })] },
      "Absolute Brilliance": { txt: "必殺の印（ルーセント）＋攻撃力%（最大3重）", e: [X("ult", "ルーセント（Absolute Brilliance）", { arr: [17, 22, 27.1, 32.2, 37.2, 42.3], t: "mark" }), { k: "atkPct", n: 0, stk: 3 }] },
      "Persistent Warmth": { txt: "必殺後、次のスキル発動で光属性ダメージ＋", e: [{ k: "W", n: 0 }] },
      "Ultimate Radiance": { txt: "必殺技ダメージ＋", e: [{ k: "Bu", n: 0 }] },
      "Radiance of Shattered Stars": { txt: "HP80%未満の敵に必殺技ダメージ＋", e: [{ k: "Bu", n: 0 }] },
      "Radiance Blade: Twin Shadow": { txt: "全員が光のとき、飛ぶ刃のスキル会心率＋0.3%・スキルダメ＋3%（各20重）", e: [{ k: "critRate", raw: 0.003, stk: 20, tags: ["blade"], ht: "skill", cond: "allLux" }, { k: "Bs", raw: 0.03, stk: 20, tags: ["blade"], cond: "allLux" }] },
      "Radiance Blade: Firefly": { txt: "飛ぶ刃のスキル会心率 +15%／飛ぶ刃が当たるたび 41%（スキル）", e: [{ k: "critRate", raw: 0.15, tags: ["blade"], ht: "skill" }, X("support", "追撃（Radiance Blade: Firefly）", { m: 41, perTag: "blade", tags: ["blade"] })] },
      "Lightforged Blade": { txt: "飛ぶ刃：グロウ1つごとに会心率＋、ハロー1つごとにスキルダメ＋（各最大20）", e: [{ k: "critRate", n: 0, stk: 20, sk: "glow", tags: ["blade"], ht: "skill" }, { k: "Bs", n: 1, stk: 20, sk: "halo", tags: ["blade"] }] },
      "Stellar Crash": { txt: "飛ぶ刃 19.8〜79.1%（スキル）＋敵の光被ダメージ＋（残光の重なり×、最大20）。刃の回数は仮に3回", e: [X("support", "飛ぶ刃（Stellar Crash）", { n: 0, c: 3, tags: ["blade"], edit: true }), { k: "taken", n: 1, stk: 20, to: "enemy" }] },
      "Blade of Falling Petals": { txt: "ソードフォーム終了時 34〜138%×2×4本（スキル）＋スキル会心ダメ＋（最大12重）", e: [X("support", "花びらの斬撃（Falling Petals）", { n: 0, c: 8, tags: ["blade"] }), { k: "critDmg", n: 1, ht: "skill", stk: 12 }] },
      "Radiance Blade: Blazing Edge": { txt: "全員が光のとき、大剣の通常攻撃ダメージ +31%／大剣が当たるたび追撃 163%（通常）", e: [{ k: "Bb", raw: 0.31, tags: ["giant"], cond: "allLux" }, X("support", "追撃（Blazing Edge）", { m: 163, t: "basic", perTag: "giant", tags: ["giant"] })] },
      "Radiance Blade: Pursuing Slash": { txt: "大剣8回ごとのドミネイティングスラッシュ 195＋220×2＋171×3（通常）", e: [X("support", "斬撃1", { m: 195, t: "basic" }), X("support", "斬撃2", { m: 220, c: 2, t: "basic" }), X("support", "斬撃3", { m: 171, c: 3, t: "basic" })] },
      "Radiant Ripple": { txt: "大剣が当たるたび（1秒に1回）追撃 185〜738%（通常）。16秒で16回と仮定", e: [X("support", "追撃（Radiant Ripple）", { n: 0, c: 16, t: "basic", tags: ["giant"], edit: true })] },
      "Blade Flash": { txt: "大剣の通常攻撃ダメージ＋（最大15重）", e: [{ k: "Bb", n: 0, stk: 15, tags: ["giant"] }] },
      "Luminous Onslaught": { txt: "敵の光被ダメージ＋（最大10重）／ホタルの攻撃力%（最大10重）", e: [{ k: "taken", n: 0, stk: 10, to: "enemy" }, { k: "atkPct", n: 1, stk: 10 }] },
      "Domain of Purity": { txt: "全員が光のとき光属性ダメージ＋（光の全員）／ホタルが場にいるとさらに＋", e: [{ k: "W", n: 0, to: "lux", cond: "allLux" }, { k: "W", n: 1, to: "lux", cond: "allLux" }] },
      "Sanctuary of Light": { txt: "盾（火力には影響しない）", e: [] },
      "Cosmic Brilliance": { txt: "光属性の全員の攻撃力%", e: [{ k: "atkPct", n: 0, to: "lux" }] },
    },
    tilia: {
      "Shield Counter": { txt: "主力スキル：反撃の追加 245%（スキル）", e: [X("main", "反撃（Shield Counter）", { m: 245, tags: ["counter"] })] },
      "Perfect Triangle Formation": { txt: "防御の効果（火力には影響しない）", e: [] },
      "Bright Counter": { txt: "全員の攻撃力%（最大12重）", e: [{ k: "atkPct", n: 0, stk: 12, to: "all" }] },
      "Block Enhancement: Lux": { txt: "全員の攻撃力%", e: [{ k: "atkPct", n: 0, to: "all" }] },
      "Block Enhancement: ATK": { txt: "主力スキル：追加の範囲ダメージ（スキル）", e: [X("main", "追加（Block Enhancement: ATK）", { n: 0, tags: ["counter"] })] },
      "Unity of Offense and Defense": { txt: "構え中 10.1%×32回（スキル）＋敵の光被ダメージ＋3.2%（最大10重）", e: [X("main", "連撃（Unity）", { m: 10.1, c: 32, tags: ["counter"] }), { k: "taken", raw: 0.032, stk: 10, to: "enemy" }] },
      "Holy Domain": { txt: "敵のスキル被ダメージ＋6%（最大4重）", e: [{ k: "takenSkill", raw: 0.06, stk: 4, to: "enemy" }] },
      "Unyielding Will": { txt: "復活（火力には影響しない）", e: [] },
      "Aegis Blessing": { txt: "全員の攻撃力%（最大5重・確率50%）", e: [{ k: "atkPct", n: 0, stk: 5, to: "all" }] },
      "Strike Back": { txt: "全員のスキルダメージ＋", e: [{ k: "Bs", n: 0, to: "all" }] },
      "Light Curtain": { txt: "敵の印被ダメージ＋（別枠の乗算。眩い正義と同じ形）", e: [{ k: "takenMark", n: 0, to: "enemy" }] },
      "Revolt Call": { txt: "防御（火力には影響しない）", e: [] },
      "Wild Spirit": { txt: "全員のスキルダメージ＋（ボス）", e: [{ k: "Bs", n: 0, to: "all" }] },
      "Knight Oath: Skyfall": { txt: "ティリアの必殺技ダメージ＋", e: [{ k: "Bu", n: 0 }] },
      "Knight Oath: Chalk Armor": { txt: "盾（火力には影響しない）", e: [] },
      "Knight Oath: Courage": { txt: "必殺技後、全員の攻撃力%", e: [{ k: "atkPct", n: 0, to: "all" }] },
      "Holy Inscription": { txt: "（栄光の凱旋）盾が当たると光の球ができ、球の中の敵の光被ダメージ +18%。実測では効いていないので既定は反映しない", off: true, e: [{ k: "taken", raw: 0.18, to: "enemy" }] },
      "Renewed Spectrum": { txt: "（光の系譜）盾が当たると支援スキルのCT -1秒（火力には影響しない）", e: [] },
      "Enemy Counter": { txt: "（ナイトパンチ）盾が当たるたび 5.7〜15.2%（スキル）＋敵の光被ダメージ＋（スタン無効の敵）", e: [X("support", "追加（Enemy Counter）", { n: 0, c: 6, tags: ["shield"] }), { k: "taken", n: 1, to: "enemy" }] },
      "Blinding Beam": { txt: "（眩い正義）光明の付与から5秒、敵の印被ダメージ＋（Lv7=345%）", e: [{ k: "takenMark", n: 0, to: "enemy" }] },
      "Knight's Seal": { txt: "（騎士の聖印）味方が印を出すと全員の攻撃力%（3秒）", e: [{ k: "atkPct", n: 0, to: "all" }] },
      "Perfect Spiral": { txt: "盾が主力に当たると 8.8%（スキル）＋敵のスキル被ダメージ＋4.6%（最大4重）", e: [X("support", "主力に命中（Perfect Spiral）", { m: 8.8, tags: ["shield"] }), { k: "takenSkill", raw: 0.046, stk: 4, to: "enemy" }] },
      "Mystery of Gyration": { txt: "複数の敵に投げる（単体では効果なし）", e: [] },
      "Brilliant Relay": { txt: "主力の攻撃力%（最大4重）", e: [{ k: "atkPct", n: 0, stk: 4, to: "main" }] },
      "Revealed Flaw": { txt: "（好機発見）HPの低い敵に追加 8.8〜14.9%（スキル。ゲームの Lv6 は 20.2% と表示されるので、その値を使う）＋敵のスキル被ダメージ＋4.6%（最大4重）。HP条件があるので既定は反映しない", off: true,
        e: [X("support", "追加（Revealed Flaw）", { arr: [8.8, 9.6, 10.5, 13.1, 14, 14.9], over: { 6: 20.2 }, c: 6, tags: ["shield"] }), { k: "takenSkill", raw: 0.046, stk: 4, to: "enemy" }] },
      "Trick Boost": { txt: "全員の攻撃力%（最大6重）", e: [{ k: "atkPct", n: 0, stk: 6, to: "all" }] },
      "Banner of Glory": { txt: "防御（火力には影響しない）", e: [] },
      "Guardian's Resolve": { txt: "主力の攻撃力%", e: [{ k: "atkPct", n: 0, to: "main" }] },
      "Creed of Fortification": { txt: "ティリアの攻撃力%", e: [{ k: "atkPct", n: 0 }] },
    },
  };
  S.POT_SPEC = SPEC;
  S.potKey = name => name.replace(/[^A-Za-z0-9]/g, "_");

  const last = a => a[a.length - 1];
  const numsOf = (c, name) => {
    const t = TREKKERS.find(x => x.en === c.en);
    for (const grp of ["main", "support"]) for (const b of (t.potentials[grp] || [])) for (const p of b.potentials) if (p.name === name) return { nums: p.nums, core: p.type === 1 };
    return { nums: [], core: false };
  };
  // Lv7以降は、既定では直前の差のまま延長（眩い正義 Lv7=+345% と一致）。値が分かっているものは over で上書きする。
  // 閃光の奥義 Lv9 は、直前の差で延長した値（光刃174%・スキルダメ+87%）より低い実値（150%・+75%(Max表示)）なので over に入れてある。
  const lvVal = (arr, lv, over) => {
    lv = Math.max(lv, 1);
    if (over && over[lv] != null) return over[lv];
    if (arr.length < 2 || lv <= arr.length) return arr[Math.min(lv, arr.length) - 1];
    return arr[arr.length - 1] + (arr[arr.length - 1] - arr[arr.length - 2]) * (lv - arr.length);
  };

  // 心相（凸）の戦闘中の効果。段階が 10×n 以上で有効。説明文はゲームの画面から。
  const HEART = {
    firefly: [
      { n: 1, name: "無邪気な光", txt: "チーム内が光の印を発動した後6秒、敵の光被ダメージ +14%", e: [{ k: "taken", raw: 0.14, to: "enemy" }] },
      { n: 2, name: "適合者の才能", txt: "ホタルのスキル発動後30秒、攻撃力 +20%", e: [{ k: "atkPct", raw: 0.20 }] },
      { n: 3, name: "師の教え", txt: "ホタルが敵にダメージを与えた後8秒、敵の光被ダメージ +2%（最大7重）", e: [{ k: "taken", raw: 0.02, stk: 7, to: "enemy" }] },
      { n: 4, name: "感情の萌芽", txt: "チーム内が光の印を付与した後10秒、ホタルの攻撃力 +20%", e: [{ k: "atkPct", raw: 0.20 }] },
      { n: 5, name: "友のための剣", txt: "エリート以上の敵に、ホタルの光属性ダメージ +24%", e: [{ k: "W", raw: 0.24 }] },
    ],
    tilia: [
      { n: 1, name: "聖槍の制裁", txt: "光の印が付いた敵にダメージを与えた後6秒、チーム全体の攻撃力 +8.4%", e: [{ k: "atkPct", raw: 0.084, to: "all" }] },
      { n: 2, name: "栄光の集う場所", txt: "主力が必殺技を発動した後15秒、主力の攻撃力 +24%（必殺後なので既定は反映しない）", off: true, e: [{ k: "atkPct", raw: 0.24, to: "main" }] },
      { n: 3, name: "騎士への憧憬", txt: "ティリアが光の印を付与した後6秒、チーム全体の必殺技ダメージ +28%", e: [{ k: "Bu", raw: 0.28, to: "all" }] },
      { n: 4, name: "思い描く夢", txt: "光の印を発動した後6秒、主力の必殺技ダメージ +12%", e: [{ k: "Bu", raw: 0.12, to: "main" }] },
      { n: 5, name: "正義とともに", txt: "光属性が3人のとき、チーム全体のスキルダメージ +13%", e: [{ k: "Bs", raw: 0.13, to: "all", cond: "allLux" }] },
    ],
  };
  S.HEART_SPEC = HEART;

  // チーム全体の効果の集計。返り値: id → 集計
  // 敵の光被ダメージ(taken)は、足し算の1つの束にする（実測: ホタル心相1 +14% を含む束に ナイトパンチ +57% を足すと、印の増幅 ×6.67 と一致）。
  function collect(G, team) {
    const chs = team.map(id => S.CH.find(c => c.id === id));
    const luxN = chs.filter(c => c.el === "光").length;
    const allLux = luxN === chs.length;
    const out = {};
    team.forEach(id => { out[id] = { atkPct: 0, W: 0, Bs: 0, Bb: 0, Bu: 0, markAdd: 0, hpFlat: 0, atkFlat: 0, pen: 0, takenAdd: 0, taken: 1, takenMark: 1, takenSkill: 1, mods: [], xhits: [], count: {}, drop: {}, applied: [] }; });
    const cond = k => !k || (k === "glimmer" ? G.glimmer !== false : k === "allLux" ? allLux : true);
    const recvOf = (to, oid) => {
      if (to === "lux") return team.filter((id, i) => chs[i].el === "光");
      if (to === "all") return team.slice();
      if (to === "main") return [team[0]];
      if (to === "luxVers") return team.filter((id, i) => chs[i].el === "光" && chs[i].role === "バランサー");
      if (to === "enemy") return team.filter((id, i) => chs[i].el === "光");
      return [oid];
    };
    // 1件の効果の適用。key=状態のキー、ei=効果の番号、info=Wikiの数値
    const apply = (e, ei, key, oid, cs, lv, info) => {
      if (!cond(e.cond)) return;
      let v = 0;
      if (e.raw != null) v = e.raw;
      else if (e.arr) v = (e.over && e.over[lv] != null ? e.over[lv] : lvVal(e.arr, lv)) / (e.k === "extra" ? 1 : 100);
      else if (e.n != null) v = lvVal(info.nums[e.n] || [0], lv, e.over) / (e.flat || e.k === "extra" ? 1 : 100);
      const skey = key + (e.sk ? ":" + e.sk : "");
      let stk = (cs.pstk || {})[skey];
      if (stk == null || stk === "") stk = e.stk || 1;
      v *= stk;
      if (e.perLux) v *= luxN;
      recvOf(e.to, oid).forEach(rid => {
        const a = out[rid];
        if (e.k === "count") { a.count[e.hit] = (a.count[e.hit] || 0) + e.add; return; }
        if (e.k === "drop") { a.drop[e.hit] = true; return; }
        if (e.k === "extra") {
          let cnt = e.c;
          const cc = (cs.pcnt || {})[key + "#" + ei];
          if (cc != null && cc !== "") cnt = +cc;
          a.xhits.push({ group: e.group, name: e.name, m: e.m != null ? e.m : v, c: cnt, t: e.t, tags: e.tags || [], perGlow: !!e.perGlow, perTag: e.perTag || null, owner: oid, key: key + "#" + ei });
          return;
        }
        if (e.k === "taken") { a.takenAdd += v; a.taken = 1 + a.takenAdd; return; }
        if (e.k === "takenMark") { if (G.markDebuff !== false) a.takenMark *= 1 + v; return; }
        if (e.k === "takenSkill") { a.takenSkill *= 1 + v; return; }
        if (e.k === "mult" || e.k === "critRate" || e.k === "critDmg" || (e.tags && (e.k === "Bs" || e.k === "Bb"))) { a.mods.push({ k: e.k, v, tags: e.tags || null, ht: e.ht || null, cond: e.cond || null }); return; }
        if (e.k === "mark") { a.markAdd += v; return; }
        if (a[e.k] != null) a[e.k] += v;
      });
    };
    team.forEach((oid, oi) => {
      const c = chs[oi], cs = G.chars[oid], spec = SPEC[oid];
      if (!spec) return;
      Object.keys(spec).forEach(name => {
        const key = S.potKey(name);
        const lv = (cs.pots2 || {})[key] || 0;
        if (!lv) return;
        const sp = spec[name];
        const onSet = (cs.pon || {})[key];
        if (onSet == null ? sp.off : !onSet) return;
        const info = numsOf(c, name);
        sp.e.forEach((e, ei) => apply(e, ei, key, oid, cs, lv, info));
        out[oid].applied.push(name);
      });
      (HEART[oid] || []).forEach(h => {
        if ((cs.talent || 0) < h.n * 10) return;
        const key = "heart" + h.n;
        const onSet = (cs.pon || {})[key];
        if (onSet == null ? h.off : !onSet) return;
        h.e.forEach((e, ei) => apply(e, ei, key, oid, cs, 1, { nums: [] }));
        out[oid].applied.push("心相" + h.n);
      });
    });
    return out;
  }
  S.collectPots = collect;
  S.potNums = numsOf;
})(window.SIM);
