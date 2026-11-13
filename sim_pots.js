// 光チーム（セイナ(原点)・ホタル・ティリア）の素質の効果。Wiki（英語）の文章を読んで、計算に入れる効果に分類した表。
// 数値は data/trekkers.js の nums（Lv1〜6）から取る（Lv7以降は直線延長）。Wikiの文章にだけある数値は raw / arr に書く。
// 効果 e:  k = 効果の種類
//   W/Bs/Bb/Bu = 属性/スキル/通常/必殺ダメージ加算   atkPct = 攻撃力%   hpFlat/atkFlat = 基礎HP/基礎攻撃力の加算(掛け算の前)
//   pen = 属性耐性貫通   mark = 印ダメージ加算   critRate/critDmg = 会心率/会心ダメージ(ht=種別 tags=対象のタグ)
//   mult = ヒットの倍率を (1+x) 倍(tags=対象)   taken = 敵の光属性被ダメージ(別枠の乗算)   takenMark/takenSkill = 敵の印/スキル被ダメージ
//   extra = 追加ヒット(group=技グループ、'*'は全て、m=倍率%、c=回数)   count = ヒット回数の加算(hit)   drop = ヒットの置き換え(hit)
//   n = nums の番号 / raw = 割合の固定値 / m(extra) = 倍率% / arr = 文章にだけある Lv別の値(%)  flat = 割合ではなく実数
//   stk = 最大の重複数   perLux = 光属性の人数を掛ける   to = 効く相手(self 既定 / lux 光の全員 / all 全員 / main 主力 / luxVers 光のバランサー)
//   cond = 条件(glimmer 敵に残光 / allLux 全員が光)   sk = 重複数の入力名   perGlow / perTag = 回数を グロウ・タグの数に合わせる
// off:true = 条件が重いので既定で反映しない。txt = 反映した内容（画面に表示）。
window.SIM = window.SIM || {};
(function (S) {
  const X = (group, name, o) => Object.assign({ k: "extra", group, name, t: "skill", c: 1 }, o);
  // コア素質（素質のLvなし）の追加ヒットの倍率は、つながるスキルのLvで伸びる（lv: "main" など。m はそのスキルが Lv10 のときの値）。
  // 主力スキルLv13（徽章+3）で 60%→72%、徽章を外すと 60%（流星の閃きのカード・2026-11-04）、支援スキルLv2 で 256%→106% など（画面）
  const SPEC = {
    noya: {
      "Lucent Blitz": { txt: "主力スキル：長剣 +4回、光刃9発（各60%・スキル。主力スキルのLvで伸びる）", e: [{ k: "count", hit: "mLong", add: 4 }, X("main", "光刃（Lucent Blitz）", { m: 60, lv: "main", c: 9, tags: ["glow", "long"] })] },
      "Dawnflare": { txt: "主力スキル：暁光乱刃 376%×6（スキル）／通常攻撃の突進：光刃3発（各60%）。どちらも主力スキルのLvで伸びる", e: [X("main", "暁光乱刃（Dawnflare）", { m: 376, lv: "main", c: 6, tags: ["long"] }), X("basic", "突進の光刃（Dawnflare）", { m: 60, lv: "main", c: 3, tags: ["glow", "long"] })] },
      "Prism Warp": { txt: "光刃が戻って追加ダメージ（スキル）＋長剣・光刃のスキル会心率（会心率は(Max!)でLv6から上がらない）", e: [X("*", "光刃の戻り（Prism Warp）", { n: 0, perGlow: true, tags: ["glow"] }), { k: "critRate", n: 1, tags: ["long", "glow"], ht: "skill", ext: "cap" }] },
      "Resolve: Blitz": { txt: "残光の敵に、長剣・光刃の倍率 ×(1+x)", e: [{ k: "mult", n: 0, tags: ["long", "glow"], cond: "glimmer" }] },
      "Lucent Tide": { txt: "（逆転の光明）光刃が印を発動できる（未反映）／主力スキル後12秒：セイナのスキル会心率＋（(Max!)でLv6から上がらない）、光のバランサーのスキル会心ダメ＋（2重）", e: [{ k: "critRate", n: 0, ht: "skill", stk: 2, ext: "cap" }, { k: "critDmg", n: 1, ht: "skill", stk: 2, to: "luxVers" }] },
      "Stardust Descent": { txt: "主力スキル：星雷2本（各64%・通常・主力スキルのLvで伸びる）／突進が大剣250%（通常攻撃のLvで伸びる・推定）＋星雷に置き換わる（印の発動で星雷1本は未反映）", e: [X("main", "星雷（Stardust Descent）", { m: 64, lv: "main", c: 2, t: "basic", tags: ["starfall"] }), { k: "drop", hit: "sprint" }, X("basic", "突進の大剣（Stardust Descent）", { m: 250, lv: "basic", t: "basic", tags: ["great"] }), X("basic", "突進の星雷", { m: 64, lv: "main", t: "basic", tags: ["starfall"] })] },
      "Sinbreaker": { txt: "特殊通常攻撃「星震の斬撃」 623%×2（通常・大剣・主力スキルのLvで伸びる）／通常攻撃の中の大剣の攻撃だけ、通常攻撃ダメージ +20%", e: [X("basic", "星震の斬撃（特殊通常攻撃）", { m: 623, lv: "main", c: 2, t: "basic", tags: ["great"] }), { k: "Bb", raw: 0.20, tags: ["great"], grp: "basic" }] },
      "Eclipse Phantom": { txt: "ジャッジメント後のフィールド 41〜165%×6（通常）＋大剣・スターフォールの通常会心率", e: [X("basic", "フィールド（Eclipse Phantom）", { n: 0, c: 6, t: "basic", tags: ["great"] }), { k: "critRate", n: 1, tags: ["great", "starfall"], ht: "basic" }] },
      "Gavel of Absolution": { txt: "スターフォール消滅時の雷撃（通常）＋通常会心率", e: [X("*", "雷撃（Gavel of Absolution）", { n: 0, t: "basic", perTag: "starfall" }), { k: "critRate", n: 1, ht: "basic" }] },
      "Resolve: Sunder": { txt: "大剣の攻撃と星雷に防御貫通 +15〜60（空壺ノ王で実測と一致・2026-11-11）", e: [{ k: "defPen", n: 0, tags: ["great", "starfall"] }] },
      "Astral Brilliance": { txt: "光属性の人数×耐性貫通", e: [{ k: "pen", n: 0, flat: true, perLux: true }] },
      "Searing Sun": { txt: "残光の敵に光属性ダメージ＋、最大HP＋（基礎値に加算）", e: [{ k: "W", n: 0, cond: "glimmer" }, { k: "hpFlat", n: 1, flat: true }] },
      "Veteran's Grit": { txt: "最大HP＋（基礎値に加算）", e: [{ k: "hpFlat", n: 0, flat: true }] },
      "Argent Mirage: Legion's End": { txt: "スキルダメージ＋／必殺（長剣形態）に光刃7発（スキル）", e: [{ k: "Bs", n: 1, over: { 7: 65, 8: 70, 9: 75 } }, X("ult", "光刃（Argent Mirage）", { n: 0, c: 7, tags: ["glow", "long"], over: { 7: 130, 8: 140, 9: 150 } })] },
      "Empyrean Starfall: Devil's End": { txt: "通常攻撃ダメージ＋／必殺（大剣形態）のフィールド 41〜165%×6（通常）", e: [{ k: "Bb", n: 1 }, X("ult", "フィールド（Devil's End）", { n: 0, c: 6, t: "basic", tags: ["great"] })] },
      "Guiding Star": { txt: "（閃星の戦乙女）閃星効果中の会心ダメージ＋（Lv6 +60%・Lv7 +65%・Lv8 +70%・Lv9 +75%）", e: [{ k: "critDmg", n: 0, over: { 7: 65, 8: 70, 9: 75 } }] },   // Lv9=75% は画面で確認（2026-11-03・Discord）
      "Tempest Scourge": { txt: "支援スキル：大剣の攻撃のあと、星雷陣 256%×6（通常・支援スキルのLvで伸びる）", e: [X("support", "星雷陣（Tempest Scourge）", { m: 256, lv: "support", c: 6, t: "basic", tags: ["great"] })] },
      "Inquisitor's Edge": { txt: "支援スキル：大剣の攻撃時、星雷11本（各140%・通常・支援スキルのLvで伸びる）", e: [X("support", "星雷（Inquisitor's Edge）", { m: 140, lv: "support", c: 11, t: "basic", tags: ["starfall"] })] },
      "Radiant Sever": { txt: "通常攻撃ダメージ＋（最大3重）", e: [{ k: "Bb", n: 0, stk: 3 }] },
      "Aegis: Sunder": { txt: "光属性ダメージ＋（長剣が当たるたび・最大5重）", e: [{ k: "W", n: 0, stk: 5 }] },
      "Fiendbreaker": { txt: "大剣・スターフォールの倍率 ×(1+x)", e: [{ k: "mult", n: 0, tags: ["great", "starfall"] }] },
      "Skyrend Flash": { txt: "支援スキル：長剣の攻撃時、光刃を連射（各79%・スキル・支援スキルのLvで伸びる）。回数は不明のため仮に10回", e: [X("support", "光刃（Skyrend Flash）", { m: 79, lv: "support", c: 10, tags: ["glow", "long"], edit: true })] },
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
      "Persistent Warmth": { txt: "必殺後、次のスキル発動から30秒、光属性ダメージ＋", e: [{ k: "W", n: 0 }] },   // ゲームの画面は「光属性ダメージ」（Wikiの日本語は「光属性スキルダメージ」・2026-11-03 画面で確認）
      "Ultimate Radiance": { txt: "必殺技ダメージ＋", e: [{ k: "Bu", n: 0 }] },
      "Radiance of Shattered Stars": { txt: "HP80%未満の敵に必殺技ダメージ＋", e: [{ k: "Bu", n: 0 }] },
      "Radiance Blade: Twin Shadow": { txt: "全員が光のとき、飛ぶ刃のスキル会心率＋0.3%・スキルダメ＋3%（各20重）", e: [{ k: "critRate", raw: 0.003, stk: 20, tags: ["blade"], ht: "skill", cond: "allLux" }, { k: "Bs", raw: 0.03, stk: 20, tags: ["blade"], cond: "allLux" }] },
      "Radiance Blade: Firefly": { txt: "飛ぶ刃のスキル会心率 +15%／飛ぶ刃が当たるたび 41%（スキル）", e: [{ k: "critRate", raw: 0.15, tags: ["blade"], ht: "skill" }, X("support", "追撃（Radiance Blade: Firefly）", { m: 41, perTag: "blade", tags: ["blade"] })] },
      "Lightforged Blade": { txt: "飛ぶ刃：グロウ1つごとに会心率＋、ハロー1つごとにスキルダメ＋（各最大20）", e: [{ k: "critRate", n: 0, stk: 20, sk: "glow", tags: ["blade"], ht: "skill" }, { k: "Bs", n: 1, stk: 20, sk: "halo", tags: ["blade"] }] },
      "Stellar Crash": { txt: "飛ぶ刃 19.8〜79.1%（スキル）＋敵の光被ダメージ＋（残光の重複数×、最大20）。刃の回数は仮に3回", e: [X("support", "飛ぶ刃（Stellar Crash）", { n: 0, c: 3, tags: ["blade"], edit: true }), { k: "taken", n: 1, stk: 20, to: "enemy" }] },
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
    nazuna: {
      // 実測（印テスト3・深層ノ主）: Lv4 +290% は、徽章の印ダメージ+107%と足し算にならず 2.07×3.90 で効く（115,690 が一致）
      "Touch of Nature": { txt: "（みんな寝転んで）地属性の全員の印ダメージ＋（別枠の掛け算）。眩い正義などと重なったときの形は未確認（掛け算で計算）", e: [{ k: "markMult", n: 0, to: "lux" }] },
    },
    tilia: {
      "Shield Counter": { txt: "主力スキル：反撃の追加 245%（スキル）＋8秒間 敵の防御力 -110", e: [X("main", "反撃（Shield Counter）", { m: 245, tags: ["counter"] }), { k: "defDown", n: 1, to: "enemy" }] },
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
  S.POT_SPEC_BUILTIN = JSON.parse(JSON.stringify(SPEC));   // 手で書いた表だけ（共有データの builtin・編集ページの「組み込み」）
  // edit.html で入力した効果（data/spec_user.js とブラウザの保存）を、組み込みの表より優先して重ねる
  const US = JSON.parse(JSON.stringify(window.SPEC_USER || {}));
  try { const sv = JSON.parse(localStorage.getItem("stellasora-spec-user-v1")); if (sv) Object.keys(sv).forEach(t => { US[t] = Object.assign(US[t] || {}, sv[t]); }); } catch (err) { /* 保存なしでも動く */ }
  (S.CH || []).forEach(c => {
    const u = US[c.en];
    if (!u) return;
    SPEC[c.id] = SPEC[c.id] || {};
    Object.keys(u).forEach(name => { SPEC[c.id][name] = { txt: u[name].txt || "", off: !!u[name].off, offUnless: u[name].offUnless, ext: u[name].ext, e: u[name].e || [], st: u[name].draft ? "draft" : "ok" }; });
  });
  // まだ表も入力もない素質は、自動の下書き（data/spec_draft.js：日本語Wikiの説明文からルールで作った、確認前の内容）を使う
  const KN = { W: "属性ダメ", Bs: "スキルダメ", Bb: "通常ダメ", Bu: "必殺ダメ", mark: "印ダメ", atkPct: "攻撃力%", hpPct: "最大HP%", hpFlat: "最大HP", critRate: "会心率", critDmg: "会心ダメ",
    taken: "敵の被ダメ", takenSkill: "敵のスキル被ダメ", takenBasic: "敵の通常被ダメ", takenMark: "敵の印被ダメ", markMult: "印ダメ（別枠）", extra: "追加ヒット", defDown: "敵の防御低下", defPen: "防御貫通" };
  const TO = { all: "全員", main: "主力", lux: "同じ属性の全員", others: "自分以外", enemy: "" };
  const summary = e => e.map(x => (KN[x.k] || x.k) + (x.to && TO[x.to] ? "（" + TO[x.to] + "）" : "") + (x.stk > 1 ? "×" + x.stk + "重" : "") + (x.k === "extra" && x.m ? " " + x.m + "%" : "")).join("・");
  (S.CH || []).forEach(c => {
    const dr = (window.SPEC_DRAFT || {})[c.en];
    if (!dr || !c.auto) return;   // 手で書いた6人は使わない（ウィロー・ナツカ・エレノアは別の仕組みで素質を計算しているので、二重になる）
    ["main", "support"].forEach(role => Object.keys(dr[role] || {}).forEach(name => {
      const d = dr[role][name];
      SPEC[c.id] = SPEC[c.id] || {};
      if (SPEC[c.id][name]) return;
      const e = d.e || [];
      if (!e.length && !d.none) return;   // 分類できなかった（要確認）ものは入れない（画面では「計算に未反映」）
      SPEC[c.id][name] = { txt: e.length ? "下書き：" + summary(e) + (d.review ? "（ほかに分類できなかった文あり）" : "") : "火力に影響しない（自動判定）", e, st: "auto", review: !!d.review };
    }));
  });
  // 説明（txt）が空の素質は、効果の中身から短い説明を作る（edit.html で説明を書かずに保存したもの）
  Object.keys(SPEC).forEach(id => Object.keys(SPEC[id]).forEach(name => {
    const sp = SPEC[id][name];
    if (!sp.txt) sp.txt = sp.e && sp.e.length ? summary(sp.e) : "火力に影響しない";
  }));
  S.POT_SPEC = SPEC;
  // エレノアの素質は、以前は支援用の別の表（data_sup.js の SUP_POTS・入力は chars.eleanor.sup）で計算していた。
  // 今はほかの巡遊者と同じ表（data/spec_user.js・入力は pots2）なので、前の入力（保存・共有コード）を読み替える（2026-11-06）
  // ナツカも同じ（2026-11-07）
  S.migrateSup = G => ["eleanor", "nazuka"].forEach(id => {
    const cs = G && G.chars && G.chars[id];
    if (!cs || !cs.sup || !Object.keys(cs.sup).length) return;
    cs.pots2 = cs.pots2 || {}; cs.pon = cs.pon || {}; cs.pstk = cs.pstk || {};
    ((window.SUP_POTS || {})[id] || []).forEach(x => {
      const s = cs.sup[x.id];
      if (!s) return;
      const key = S.potKey(x.en);
      if (+s.lv > 0 && !(+cs.pots2[key] > 0)) cs.pots2[key] = x.core ? 1 : +s.lv;
      if (s.on != null && cs.pon[key] == null) cs.pon[key] = !!s.on;
      if (s.stk != null && s.stk !== "" && cs.pstk[key] == null) cs.pstk[key] = +s.stk;
    });
    cs.sup = {};
  });
  S.potKey = name => name.replace(/[^A-Za-z0-9]/g, "_");
  // ウィロー（水着）の素質は、以前は別の表（data.js の POTENTIALS・入力は chars.willow.pots）で計算していた。
  // 今はほかの巡遊者と同じ表（data/spec_user.js・入力は pots2）なので、前の入力（保存・共有コード）を読み替える。両方に値があれば前の入力を使う（2026-11-07）
  S.migrateWillow = G => {
    const cs = G && G.chars && G.chars.willow;
    if (!cs || !cs.pots || !Object.keys(cs.pots).length) return;
    const t = TREKKERS.find(x => x.en === "Suntide Willow"), ja = (window.POTENTIAL_JA || {})["Suntide Willow"] || {};
    cs.pots2 = cs.pots2 || {};
    ((t && t.potentials.main) || []).flatMap(g => g.potentials).forEach(p => {
      const x = (window.POTENTIALS || []).find(q => q.jp === ja[p.name]);
      if (!x || cs.pots[x.id] == null) return;
      const key = S.potKey(p.name);
      if (+cs.pots[x.id] > 0 || !(+cs.pots2[key] > 0)) cs.pots2[key] = x.core ? (+cs.pots[x.id] > 0 ? 1 : 0) : +cs.pots[x.id];
    });
    cs.pots = {};
  };

  const last = a => a[a.length - 1];
  const numsOf = (c, name) => {
    const t = TREKKERS.find(x => x.en === c.en);
    for (const grp of ["main", "support"]) for (const b of (t.potentials[grp] || [])) for (const p of b.potentials) if (p.name === name) return { nums: p.nums, core: p.type === 1 };
    return { nums: [], core: false };
  };
  // Lv7以降は、既定では直前の差のまま延長（眩い正義 Lv7=+345% と一致）。値が分かっているものは over で上書きする。
  // 閃光の奥義 Lv9 は、直前の差で延長した値（光刃174%・スキルダメ+87%）より低い実値（150%・+75%(Max表示)）なので over に入れてある。
  // Lv7以降: ext="cap" ならLv6のまま（上がらない・未確定）、既定は直前の増え方で延長（推定）。over で、Lvごとの値を直接指定
  const lvVal = (arr, lv, over, ext) => {
    lv = Math.max(lv, 1);
    if (over && over[lv] != null) return over[lv];
    if (arr.length < 2 || lv <= arr.length) return arr[Math.min(lv, arr.length) - 1];
    if (ext === "cap") return arr[arr.length - 1];
    return arr[arr.length - 1] + (arr[arr.length - 1] - arr[arr.length - 2]) * (lv - arr.length);
  };

  // 心相（凸）の戦闘中の効果。段階が 10×n 以上で有効。説明文はゲームの画面から。
  const HEART = {
    noya: [
      { n: 1, name: "血と砂の過去", txt: "閃星の効果中、会心ダメージ +12%。ダメージを与えた時に閃星を獲得（5分に1回）。下の「閃星」中のチェックで、すべての攻撃の会心に入る", e: [] },
      { n: 2, name: "閃銀騎士の責務", txt: "最大HP +10%（戦闘中だけ。外の画面には出ない）。特殊主力スキル・特殊通常攻撃は、残光が付いた敵へのダメージ倍率 +36%（この倍率は未反映）", e: [{ k: "hpPct", raw: 0.10 }] },
      { n: 3, name: "運命を超える覚悟", txt: "エリート以上の敵への光属性ダメージ +18%（未反映）", e: [] },
      { n: 4, name: "闇夜に輝く一番星", txt: "光の印を発動した後8秒、通常攻撃ダメージ +24%（未反映）", e: [] },
      { n: 5, name: "最高の名前", txt: "HPが20%超のとき、長剣の倍率 +21%・大剣の倍率 +18%（未反映）", e: [] },
    ],
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
  // グレイ・ナズナ（2026-10-29 画面で確認。印テスト1〜3で、乗るタイミングも実測と一致）
  HEART.gerie = [
    { n: 1, name: "ワタシの原罪", txt: "グレイのスキルダメージの後5秒、攻撃力 +2.5%（1秒に1回・最大8重）", e: [{ k: "atkPct", raw: 0.025, stk: 8 }] },
    { n: 2, name: "白き御座の仰ぎ", txt: "グレイが地の印を発動した後4秒、地属性ダメージ +2.5%（最大8重）", e: [{ k: "W", raw: 0.025, stk: 8 }] },
    { n: 3, name: "サマエルの祝福", txt: "グレイの必殺技の後20秒、スキルダメージ +8.3%（最大7重。必殺後なので既定は反映しない）", off: true, e: [{ k: "Bs", raw: 0.083, stk: 7 }] },
    { n: 4, name: "黄昏の呪縛", txt: "味方が地の印を付与した後5秒、グレイの攻撃力 +20%", e: [{ k: "atkPct", raw: 0.20 }] },
    { n: 5, name: "シュワキマセリ", txt: "エリート以上の敵に、地属性ダメージ +24%", e: [{ k: "W", raw: 0.24 }] },
  ];
  HEART.nazuna = [
    { n: 1, name: "二度寝の誘惑", txt: "地の印を発動した後8秒、チーム全体の地属性ダメージ +14%", e: [{ k: "W", raw: 0.14, to: "lux" }] },
    { n: 2, name: "次から本気出す", txt: "ナズナの必殺技の後20秒、主力のその敵への地属性ダメージ +40%（必殺後なので既定は反映しない）", off: true, e: [{ k: "W", raw: 0.40, to: "main" }] },
    { n: 3, name: "ボディが甘い！", txt: "ナズナが地の印を付与した後8秒、敵の地属性被ダメージ +14%（被ダメージは足し算）", e: [{ k: "taken", raw: 0.14, to: "enemy" }] },
    { n: 4, name: "あいつは任せた", txt: "ナズナのスキルダメージの後5秒、主力の攻撃力 +20%", e: [{ k: "atkPct", raw: 0.20, to: "main" }] },
    { n: 5, name: "芝生に寝転んで", txt: "地属性が3人のとき、チーム全体の地属性ダメージ +14%（出撃していない支援も数える）", e: [{ k: "W", raw: 0.14, to: "lux", cond: "allLux" }] },
  ];
  // クルニス（華服）（2026-10-30 画面で確認。04・05は未登録）
  HEART.springseek_coronis = [
    { n: 1, name: "異邦の旅人", txt: "クルニス（華服）のスキルダメージの後12秒、敵の地属性被ダメージ +4.7%（最大3重。被ダメージは足し算）", e: [{ k: "taken", raw: 0.047, stk: 3, to: "enemy" }] },
    // 説明文は「クルニス（華服）の」スキルダメージだが、実測ではグレイのスキルにも乗る（印テスト3・4）。編成にいれば、出撃していなくても乗る（付与はナズナ）。
    // 印を付与する前のグレイのスキルには乗らない（印テスト4の開幕 19,471 が一致）＝出どころはこの心相
    { n: 2, name: "新たな知見", txt: "味方が地の印を付与した後6秒、地属性の全員のスキルダメージ +28.5%（説明文はクルニス自身だが、実測でグレイにも乗る）", e: [{ k: "Bs", raw: 0.285, to: "lux" }] },
    { n: 3, name: "医術の融合", txt: "クルニス（華服）の必殺技の後20秒、敵の地属性被ダメージ +3.5%（最大6重。必殺後なので既定は反映しない）", off: true, e: [{ k: "taken", raw: 0.035, stk: 6, to: "enemy" }] },
  ];
  // 手で書いていない巡遊者は、日本語Wikiの心相の表から作ったもの（data/heart_wiki.js）を使う
  (S.CH || []).forEach(c => { if (!HEART[c.id] && (window.HEART_WIKI || {})[c.en]) HEART[c.id] = window.HEART_WIKI[c.en]; });
  S.HEART_SPEC = HEART;

  // チーム全体の効果の集計。返り値: id → 集計
  // 敵の光被ダメージ(taken)は、足し算の1つの束にする（実測: ホタル心相1 +14% を含む束に ナイトパンチ +57% を足すと、印の増幅 ×6.67 と一致）。
  // 追加ヒットの名前は、素質の日本語名で出す。名前が英語の素質名そのもの／空なら日本語名に、「光刃（Lucent Blitz）」のような英語の括弧は（日本語名）に置き換える
  const jaHit = (nm, pn, ten) => {
    const ja = pn && ((window.POTENTIAL_JA || {})[ten] || {})[pn];
    if (!ja) return nm;
    if (!nm || nm === pn || nm === "追加ヒット") return ja;
    return nm.replace(/（[\x20-\x7e]+）/, "（" + ja + "）");
  };
  // コア素質の追加ヒットで、スキルLvで伸びるもの（data/core_lv.js）。値（Lv10のとき）が表にあれば、そのスキルのLvで伸ばす
  // 組み込みの効果には、英語Wikiの値（スキルLv1のとき）で入れてあるものがある。その値なら、Lv10の値に直してから伸ばす
  const SKI = { basic: 0, main: 1, support: 2, ult: 3 };
  const lv1Ratio = (en, k) => { const t = (window.TREKKERS || []).find(x => x.en === en), n = t && t.skills && t.skills[SKI[k]] && t.skills[SKI[k]].nums; return n && n[0] && n[9] ? n[0][0][0] / n[9][0][0] : null; };
  const coreLvHit = (en, pn, m) => {
    const c = ((window.CORE_LV || {})[en] || {})[pn];
    if (!c || !(m > 0)) return null;
    const v10 = c.vals.find(v => Math.abs(v - m) < 0.05);
    if (v10 != null) return { k: c.k, m: m };
    const r1 = lv1Ratio(en, c.k), v1 = r1 && c.vals.find(v => Math.abs(v * r1 - m) <= Math.max(0.1, 0.02 * m));
    return v1 != null ? { k: c.k, m: v1 } : null;
  };
  const coreLvOf = (en, pn, m) => { const h = coreLvHit(en, pn, m); return h ? h.k : null; };
  const DEFK = { defDown: 1, defPen: 1 };   // 実数で持つ効果（防御力低下・防御貫通）
  // 確率: prob = 決まった確率、probN = 素質の数値の番号（Lvで変わる確率。probOver でLvごとに上書き）
  const probOf = (e, lv, info) => e.prob != null ? e.prob : e.probN != null ? lvVal(info.nums[e.probN] || [0], lv, e.probOver, e.ext || info.ext) / 100 : null;
  function collect(G, team) {
    const chs = team.map(id => S.CH.find(c => c.id === id));
    // 「光属性の全員」などは、効果を持つ巡遊者と同じ属性の全員として扱う（光チーム以外にも使えるようにした）
    const elOf = oid => chs[team.indexOf(oid)].el;
    const sameN = oid => chs.filter(c => c.el === elOf(oid)).length;
    const out = {};
    team.forEach(id => { out[id] = { atkPct: 0, W: 0, Bs: 0, Bb: 0, Bu: 0, markAdd: 0, markMult: 1, hpFlat: 0, atkFlat: 0, pen: 0, defDown: 0, defPen: 0, takenAdd: 0, taken: 1, takenMark: 1, takenSkill: 1, takenBasic: 1, hpPct: 0, mods: [], xhits: [], count: {}, countMul: {}, drop: {}, retype: [], markFromBb: null, applied: [] }; });
    const cond = (k, oid) => !k || (k === "glimmer" ? G.glimmer !== false : k === "allLux" ? sameN(oid) === chs.length : k === "mainSame" ? chs[0].el === elOf(oid) : k === "isMain" ? team[0] === oid : true);
    const recvOf = (to, oid, e) => {
      const el = elOf(oid);
      if (to === "lux") return team.filter((id, i) => chs[i].el === el);
      if (to === "all") return team.slice();
      if (to === "main") return [team[0]];
      if (to === "sup") return team.slice(1);   // 支援の巡遊者（2人）
      if (to === "others") return team.filter(id => id !== oid);   // 自分以外の味方（例: アンズの友達の力）
      if (to === "selfNonEl") return team.filter((id, i) => id === oid || chs[i].el !== el);   // 自分と、自分と違う属性の味方（例: ウィローの砕沫の余韻）
      if (to === "nonEl") return team.filter((id, i) => id !== oid && chs[i].el !== el);   // 自分と違う属性の味方だけ
      if (to === "luxAB") return team.filter((id, i) => chs[i].el === el && (chs[i].role === "アタッカー" || chs[i].role === "バランサー"));   // 同じ属性のアタッカー・バランサー（例: ナツカの嵐の目）
      if (to === "luxVers") return team.filter((id, i) => chs[i].el === el && chs[i].role === "バランサー");
      if (to === "enemy") return e && e.k !== "taken" ? team.slice() : team.filter((id, i) => chs[i].el === ((e && e.el) || el));   // 属性の被ダメージ(taken)はその属性の味方だけ、スキル・通常・印の被ダメージは全員
      return [oid];
    };
    // 1件の効果の適用。key=状態のキー、ei=効果の番号、info=Wikiの数値
    const apply = (e, ei, key, oid, cs, lv, info) => {
      if (!cond(e.cond, oid)) return;
      let v = 0;
      if (e.raw != null) v = e.raw;
      else if (e.arr) v = lvVal(e.arr, lv, e.over, e.ext || info.ext) / (e.k === "extra" ? 1 : 100);
      else if (e.n != null) v = lvVal(info.nums[e.n] || [0], lv, e.over, e.ext || info.ext) / (e.flat || e.k === "extra" || DEFK[e.k] ? 1 : 100);   // 防御貫通・防御力低下は実数
      const skey = key + (e.sk ? ":" + e.sk : "");
      let stk = (cs.pstk || {})[skey];
      if (stk == null || stk === "") stk = e.stk0 != null ? e.stk0 : (e.stk || 1);   // stk0 = 既定の重複数（最大の stk と違うとき）
      v *= stk;
      if (e.perLux) v *= sameN(oid);
      const pr = probOf(e, lv, info); if (pr != null) v *= pr;   // 確率で起きる効果は期待値（例: フリージアの反証論破 50%）
      recvOf(e.to, oid, e).forEach(rid => {
        const a = out[rid];
        if (e.k === "count") { a.count[e.hit] = (a.count[e.hit] || 0) + e.add; return; }
        if (e.k === "countMul") { a.countMul[e.hit] = (a.countMul[e.hit] || 1) * e.mul; return; }   // ヒット回数を何倍かに（例: ナツカの持続時間+100%・間隔-50%）
        if (e.k === "drop") { a.drop[e.hit] = true; return; }
        if (e.k === "retype") { a.retype.push({ tags: e.tags, t: e.t }); return; }   // ダメージの種類の変換（tags のヒットを t の種類に）
        if (e.k === "markFromBb") { a.markFromBb = { r: e.ratio, cap: v }; return; }   // 通常攻撃ダメージ ×ratio を印ダメージに（最大 v）
        if (e.k === "extra") {
          let cnt = e.c;
          const cc = (cs.pcnt || {})[key + "#" + ei];
          if (cc != null && cc !== "") cnt = +cc;
          else if (e.perLuxOther) cnt *= Math.max(0, sameN(oid) - 1);   // 自分以外の同じ属性の人数ぶん（例: トーナのオマケの一矢）
          let m = e.m != null ? e.m * (pr != null ? pr : 1) : v, lvOf = e.lv || null;   // m を書いた追加ヒットも、確率があれば期待値に
          if (!lvOf) { const h = coreLvHit(chs[team.indexOf(oid)].en, info.pn, m); if (h) { lvOf = h.k; m = h.m; } }   // m はスキルLv10の値、計算のときに今のスキルLvに直す
          a.xhits.push({ group: e.group, name: jaHit(e.name, info.pn, chs[team.indexOf(oid)].en), m, c: cnt, t: e.t, tags: e.tags || [], perGlow: !!e.perGlow, perTag: e.perTag || null, tagDiv: e.tagDiv || 0, tagAdd: e.tagAdd || 0, tagMul: e.tagMul || 0, tagBonus: e.tagBonus || null, lvOf, owner: oid, key: key + "#" + ei });
          return;
        }
        if (e.k === "taken" && e.tags) { a.mods.push({ k: "taken", v, tags: e.tags, ht: null, grp: null, cond: null }); return; }   // 特定の攻撃だけに乗る被ダメージ（例: ナツカの花の海・波紋）。同じ被ダメージの足し算に入る
        if (e.k === "taken") { a.takenAdd += v; a.taken = 1 + a.takenAdd; return; }
        if (e.k === "takenMark") { if (G.markDebuff !== false) a.takenMark *= 1 + v; return; }
        if (e.k === "markMult") { a.markMult *= 1 + v; return; }   // 印ダメージの別枠（印ダメージ+の足し算とは別に掛ける）
        if (e.k === "takenSkill") { a.takenSkill *= 1 + v; return; }
        if (e.k === "takenBasic") { a.takenBasic = (a.takenBasic || 1) * (1 + v); return; }
        if (e.k === "mult" || e.k === "critRate" || e.k === "critDmg" || ((e.tags || e.grp) && (e.k === "Bs" || e.k === "Bb" || e.k === "Bu" || e.k === "W" || e.k === "atkPctHit"))) { a.mods.push({ k: e.k, v, tags: e.tags || null, ht: e.ht || null, grp: e.grp || null, cond: e.cond || null }); return; }
        if (e.k === "defPen" && (e.tags || e.ht || e.grp)) { a.mods.push({ k: "defPen", v, tags: e.tags || null, ht: e.ht || null, grp: e.grp || null, cond: null }); return; }   // 特定の攻撃だけの防御貫通
        if (e.k === "mark") { a.markAdd += v; return; }
        if (a[e.k] != null) a[e.k] += v;
      });
    };
    team.forEach((oid, oi) => {
      const c = chs[oi], cs = G.chars[oid], spec = SPEC[oid];
      if (!spec) return;
      const roleT = TREKKERS.find(x => x.en === c.en), roleList = new Set();
      ((roleT && roleT.potentials && roleT.potentials[oi === 0 ? "main" : "support"]) || []).forEach(g => g.potentials.forEach(x => roleList.add(x.name)));   // 主力のときは主力の素質だけ、支援のときは支援の素質だけ
      Object.keys(spec).forEach(name => {
        if (roleList.size && !roleList.has(name)) return;
        const key = S.potKey(name);
        const lv0 = (cs.pots2 || {})[key] || 0;
        const ov = (G._potLv || {})[oid + ":" + name];   // ビルド確認の「比べる値」: 徽章込みのLvをこの値にする（Lv7〜9も）
        if (ov != null ? !ov : !lv0) return;
        const lv = ov != null ? ov : lv0 + ((S.emblemExtra(cs.emb, cs.embOn).pot[name]) || 0);   // 徽章の素質レベル上昇（取得している素質だけ）
        const sp = spec[name];
        const onSet = (cs.pon || {})[key];
        if (onSet == null ? S.potDefOff(sp, cs) : !onSet) return;
        const info = Object.assign({}, numsOf(c, name), { ext: sp.ext, pn: name });
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
    if (S.lrCollect) S.lrCollect(G, team, chs, out);
    if (S.skillCollect) S.skillCollect(G, team, chs, out);
    return out;
  }
  // 徽章の「スキルレベル上昇」「素質レベル上昇」を集計。slot.t = 対象の素質（英語名）
  const LVKEY = { lvBasic: "basic", lvMain: "main", lvSupport: "support", lvUlt: "ult" };
  S.emblemExtra = (cfg, on) => {
    const r = { lv: { basic: 0, main: 0, support: 0, ult: 0 }, pot: {} };
    (cfg || []).forEach((e, i) => {
      if (on && on[i] === 0) return;
      e.slots.forEach(sl => {
        if (!sl.k) return;
        const o = EMBLEM_OPTIONS.find(x => x.key === sl.k);
        if (!o) return;
        const v = (o.type === "skillLv" || o.type === "potLv") ? ({ gold: 1, rainbow2: 2, rainbow3: 3, rainbow: 3 }[sl.q]) : o.tiers[sl.q];   // レベル上昇: 金 +1／虹 +2・+3
        if (v == null) return;
        if (o.type === "skillLv") r.lv[LVKEY[sl.k]] += v;
        else if (o.type === "potLv" && sl.t) r.pot[sl.t] = (r.pot[sl.t] || 0) + v;
      });
    });
    return r;
  };
  S.collectPots = collect;
  S.potNums = numsOf;
  // 既定でオフか。off: true ならいつもオフ。offUnless: "素質の英語名" なら、その素質を取っていないときだけオフ（例: 侵食観察はマーカー追加があるときだけ常時とみる）
  S.potDefOff = (sp, cs) => !!(sp && (sp.off || (sp.offUnless && !+((cs && cs.pots2 || {})[S.potKey(sp.offUnless)]))));
  // 計算に使っている中身を、そのLvの値つきの短い文にする（素質カードの「計算: …」）
  const KJ = { W: el => el + "属性ダメージ", Bs: "スキルダメージ", Bb: "通常攻撃ダメージ", Bu: "必殺技ダメージ", mark: "印ダメージ", markMult: "印ダメージ（別枠の掛け算）",
    atkPct: "攻撃力", hpPct: "最大HP", hpFlat: "基礎HP", atkFlat: "基礎攻撃力", pen: "耐性貫通", critRate: "会心率", critDmg: "会心ダメージ", atkPctHit: "攻撃力",
    taken: el => "敵の" + el + "属性被ダメージ", takenSkill: "敵のスキル被ダメージ", takenBasic: "敵の通常攻撃被ダメージ", takenMark: "敵の印被ダメージ（別枠の掛け算）", mult: "ダメージ（別枠の掛け算）", defDown: "敵の防御力低下", defPen: "防御貫通" };
  const TAGJ = { obs: "観測点", scan: "スキャニング", radar: "レーダーマップ", anchor: "グランドアンカー", frogJump: "バブルフロッグのジャンプ", bubbleShot: "バブルガンの射撃", bubbleArea: "バブルエリア", followBubble: "追従バブル", echoWave: "エコーウェーブ", waterPillar: "水柱", hovering: "低徊する海風の印ダメージ", nightShot: "主力スキルの射撃", tearRain: "催涙雨", bombard: "轟撃", foxfire: "狐火", parasol: "花の傘", parasolBlast: "花の傘の爆発", doomfall: "天誅", sange: "散華の小さい弾丸", frog: "バブルフロッグ", wave: "震動波", shovel: "チェーンシャベル", cage: "鉄の牢獄", main: "主力スキル", support: "支援スキル", basic: "通常攻撃", ult: "必殺技", long: "長剣", giant: "大剣", great: "大剣", starfall: "星雷", glow: "光刃", cannon: "浮遊砲", blade: "飛ぶ刃",
    jump: "叩きつけの爆発", drone: "ドローン", vigil: "警戒", s15: "通常攻撃の1〜5撃目", final: "最終撃", scale: "流閃・鱗", rush: "連撃", mirror: "鏡影", serpent: "騰蛇", penguin: "ぬいぐるみペンギン", statue: "ペンギン像", heart: "ハートアロー", sweep: "掃射", shitsuke: "ママのしつけ", iceBlade: "氷刃", iceEdge: "アイスエッジ", frostBloom: "追加の華", sweepSlash: "スイープスラッシュ", icicle: "アイシクルスラッシュ", crystal: "氷晶", dust: "一掃", purge: "粛清", purgeX: "粛清の残像", orb: "花のオーブ", sea: "花の海", petal: "花びら", seaEnd: "花の海の消滅時の追撃", arrow: "スプラッシュアロー", cascade: "カスケードルート", tail: "矢尾への追加ダメージ", pullOut: "矢尾の引き抜き", pursuit: "追い打ち", track: "トラッキングウェーブ", agile: "速達状態", minion: "従者", gust: "突風", vortex: "旋風", counter: "反撃", bomb: "ネコ神爆弾", bombLand: "爆弾の着地", bombKai: "ネコ神爆弾改", fall: "空に堕ちる焔", scar: "魔痕", flare: "インフィニティフレア", glare: "アビスグレア", curse: "覗き込む闇", markDark: "漆黒の刻印", roll: "ローリング射撃", pierce: "貫通弾", pierceX: "追加の貫通弾", split: "小型貫通弾", puni: "ぷにぷにボム", bless: "黒き祝福", eye: "魔眼の射手", normal: "通常（狂化でない）", berserk: "狂化中の通常攻撃", flower: "氷華", seed: "氷の種", triple: "三塁打", double: "二塁打", noRespite: "連続打撃の追加ダメージ", glowBurst: "光輝炸裂", thunder: "落雷", moon: "フォルモント・ネールモント", star: "星芒", shutout: "完封欲求", arc: "ジャストミート", b5: "通常攻撃5撃目" };
  const TOJ = { selfNonEl: "自分と違う属性の味方・自分", nonEl: "自分と違う属性の味方", all: "全員", main: "主力", lux: "同じ属性の全員", luxVers: "同じ属性のバランサー", luxAB: "同じ属性のアタッカー・バランサー", sup: "支援の2人", others: "自分以外の味方" };
  const HTJ = { skill: "スキル", basic: "通常攻撃", ult: "必殺技", mark: "印" };
  const CONDJ = { allLux: "全員が同じ属性のとき", mainSame: "主力が同じ属性のとき", glimmer: "敵に残光が付いているとき", isMain: "主力のとき" };
  S.TAGJ = TAGJ; S.HTJ = HTJ;
  S.potCalcText = (cid, name, lv) => {
    const sp = (S.POT_SPEC[cid] || {})[name];
    if (!sp || !sp.e || !sp.e.length) return "";
    const c = S.CH.find(x => x.id === cid), info = numsOf(c, name), ext = sp.ext || info.ext;
    const r1 = x => Math.round(x * 10) / 10;
    return sp.e.map(e => {
      let v = 0;
      if (e.raw != null) v = e.raw;
      else if (e.arr) v = lvVal(e.arr, lv, e.over, e.ext || ext) / (e.k === "extra" ? 1 : 100);
      else if (e.n != null) v = lvVal(info.nums[e.n] || [0], lv, e.over, e.ext || ext) / (e.flat || e.k === "extra" || DEFK[e.k] ? 1 : 100);
      const xh = e.k === "extra" && !e.lv ? coreLvHit(c && c.en, name, e.m != null ? e.m : v) : null, xlv = e.k === "extra" ? (e.lv || (xh && xh.k)) : null;
      if (e.k === "extra") {
        const tj = t => TAGJ[t] || t;
        const cntT = e.perTag ? `×（${tj(e.perTag)}の回数${e.tagAdd ? (e.tagAdd > 0 ? "+" : "") + e.tagAdd : ""}${e.tagDiv ? "÷" + e.tagDiv : ""}）${e.tagMul ? "×" + e.tagMul : ""}` : e.perLuxOther ? `×${e.c || 1}×（自分以外の同じ属性の人数）` : `×${e.c || 1}`;
        const bon = e.tagBonus ? `、${tj(e.tagBonus.tag)}1回につき +${r1(e.tagBonus.r * 100)}%（最大${e.tagBonus.cap}回）` : "";
        const xpr = probOf(e, lv, Object.assign({}, info, { ext })), prT = xpr != null ? `（確率${r1(xpr * 100)}%の期待値）` : "";
        return `追加ヒット ${r1(xh ? xh.m : (e.m != null ? e.m : v))}%${xlv ? `（${({ basic: "通常攻撃", main: "主力スキル", support: "支援スキル", ult: "必殺技" })[xlv]}Lv10のとき・Lvで伸びる）` : ""}（${HTJ[e.t] || ""}）${cntT}${bon}${prT}`;
      }
      if (e.k === "count" || e.k === "countMul") {
        const hh = c && Object.values(c.hits || {}).flat().find(h => h.id === e.hit), cn = e.cond ? "（" + (CONDJ[e.cond] || e.cond) + "）" : "";
        return `${hh ? hh.name + "の" : ""}ヒット回数 ${e.k === "count" ? "+" + e.add : "×" + Math.round(e.mul * 100) / 100}${cn}`;
      }
      if (e.k === "drop") return "";
      if (e.k === "retype") return `${(e.tags || []).map(t => TAGJ[t] || t).join("・")}のダメージを${HTJ[e.t] || e.t}ダメージに変換${e.cond ? "（" + (CONDJ[e.cond] || e.cond) + "）" : ""}`;
      if (e.k === "markFromBb") return `通常攻撃ダメージ ${r1(100 / e.ratio / 100)}%ごとに印ダメージ +1%（最大 +${r1(v * 100)}%）`;
      const kn = typeof KJ[e.k] === "function" ? KJ[e.k](e.el || c.el) : (KJ[e.k] || e.k);
      const flat = e.flat || e.k === "hpFlat" || e.k === "atkFlat" || e.k === "pen" || DEFK[e.k];
      const tg = (e.grp ? (S.SKILL_NAME && S.SKILL_NAME[e.grp] || e.grp) + "の中の" : "") + (e.tags && e.tags.length ? e.tags.map(t => TAGJ[t] || t).join("・") + "の" : "");
      const notes = [];
      if (e.k === "taken" && !e.to) notes.push("自分の攻撃だけ");
      else if (e.to && e.to !== "enemy") notes.push(TOJ[e.to] || e.to);
      else if (!e.to && !/^taken/.test(e.k)) notes.push("自分");
      if (e.perLux) notes.push("同じ属性の人数ぶん");
      if (e.stk > 1) notes.push(`最大${e.stk}重${e.stk0 != null ? `・既定${e.stk0}重` : ""}`);
      { const pr = probOf(e, lv, Object.assign({}, info, { ext })); if (pr != null) notes.push(`確率${r1(pr * 100)}%の期待値で計算`); }
      if (e.ht) notes.push(`${HTJ[e.ht] || e.ht}だけ`);
      if (e.cond) notes.push(CONDJ[e.cond] || e.cond);
      return `${tg}${kn} ${v < 0 ? "" : "+"}${flat ? r1(v) : r1(v * 100) + "%"}${notes.length ? "（" + notes.join("・") + "）" : ""}`;
    }).filter(Boolean).join("、");
  };
})(window.SIM);
