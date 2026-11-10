// 素質の効果の入力（edit.html で作成して書き出した内容）。キー: 巡遊者の英語名 → 素質の英語名 → { txt, off, done, draft, e }。
// e は sim_pots.js の効果の形式。draft=true は下書き（原文から作った。未確認）。sim.html は、ここにある内容を、組み込みの効果の表より優先して使う。
window.SPEC_USER = {
 "Teresa": {
  "Stream: Cascade Strike": {
   "done": true,
   "draft": false,
   "e": [
    {
     "k": "mult",
     "raw": 0.16,
     "tags": [
      "main"
     ]
    },
    {
     "k": "extra",
     "group": "main",
     "name": "波の追加（飛水・爆撃）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 125
    }
   ],
   "txt": "主力スキル +16%／追加の波 125%（スキル）",
   "note": "ゲーム内の説明は 波=攻撃力の125%（Wikiは57%）。ゲーム内の値を使った。主力スキルの +16% は、技の構造の登録後に、タグ main で効く想定",
   "verified": "ゲーム内の説明文（画面）"
  },
  "Stream: True Charged Strike": {
   "done": true,
   "draft": false,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "溜め斬り1",
     "t": "skill",
     "c": 2,
     "edit": true,
     "m": 71
    },
    {
     "k": "extra",
     "group": "main",
     "name": "溜め斬り2",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 119
    },
    {
     "k": "extra",
     "group": "main",
     "name": "溜め斬り3",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 79
    }
   ],
   "txt": "主力スキルの2段目：71%×2・119%・79%（スキル）",
   "note": "遅らせて撃つと、敵の水被ダメージ +10%（6秒）の効果は、条件が重いので未反映",
   "verified": "日本語Wikiの文章（ゲーム内の画面では未確認）"
  },
  "Cordiality": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "stk": 5
    }
   ],
   "txt": "スキルダメージを与えると、全員の攻撃力 +（6秒・最大5重）",
   "verified": "確認済み"
  },
  "Magic Sword Smack": {
   "done": true,
   "e": [],
   "txt": "靭性削りの効率（火力に影響なし）"
  },
  "Muddy Engulf": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 1,
     "to": "enemy"
    }
   ],
   "txt": "スキルダメージを与えると、敵の水被ダメージ +（6秒）。靭性が壊れていない敵の値を使う",
   "verified": "確認済み",
   "note": "靭性が壊れている敵は、番号0の値"
  },
  "Stream: Cloud Ring": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "波（飛水・環雲）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 112
    }
   ],
   "txt": "魔盾を得たとき、波 112%（スキル）。回数は仮に1回"
  },
  "Stream: Drip's Overturn": {
   "done": true,
   "e": [],
   "txt": "エネルギーの付与（火力に影響なし）",
   "verified": "確認済み"
  },
  "Restarting": {
   "done": true,
   "e": [],
   "txt": "魔盾の付与（火力に影響なし）"
  },
  "Guardsman Blessing": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "arr": [
      7,
      11,
      15,
      19,
      23,
      27
     ],
     "to": "all",
     "stk": 3
    }
   ],
   "txt": "魔盾を得たとき、全員の攻撃力 +（5秒・最大3重）",
   "verified": "確認済み",
   "note": "データの数値表が空だったので、文章の値を入れた"
  },
  "Magic Sword Siphoning": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "スキルダメージ +",
   "verified": "確認済み"
  },
  "Unbreakable Bond": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "perLux": true
    }
   ],
   "txt": "水属性の巡遊者の人数 × 全員の攻撃力 +",
   "verified": "確認済み"
  },
  "Power Strike": {
   "done": true,
   "e": [],
   "txt": "スタン（火力に影響なし）",
   "verified": "確認済み"
  },
  "Magic Shield Enhancement": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "txt": "魔盾を得たとき、通常攻撃ダメージ +（8秒）",
   "verified": "確認済み"
  },
  "Wave Breaker": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy"
    }
   ],
   "note": "水属性のみ",
   "txt": "敵の水属性被ダメージ +（必殺技が当たったとき）"
  },
  "Power Unbound": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "必殺技の発動時、全員の攻撃力 +（20秒）",
   "verified": "確認済み"
  },
  "Demonic Devour": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "必殺技ダメージ +（印が付いた敵）",
   "verified": "確認済み"
  },
  "Surge: Infinite": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "raw": 0.219,
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "txt": "魔盾の間、水属性の主力の攻撃力 +21.9%",
   "verified": "確認済み"
  },
  "Surge: Ripple": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "波（絶流・波紋）",
     "t": "skill",
     "c": 10,
     "edit": true,
     "m": 60
    }
   ],
   "note": "60%",
   "txt": "魔盾の間、主力がダメージを与えると波 60%（スキル・0.5秒に1回）。回数は仮に10回"
  },
  "Isn't It Awesome!": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "txt": "魔盾の間、水属性の主力の攻撃力 +",
   "verified": "確認済み"
  },
  "Hold On!": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main"
    }
   ],
   "txt": "魔盾の間、主力の攻撃力 +",
   "verified": "確認済み"
  },
  "I'll Protect You!": {
   "done": true,
   "e": [],
   "txt": "吸収量（火力に影響なし）",
   "verified": "確認済み"
  },
  "Surge: Immortality": {
   "done": true,
   "e": [],
   "txt": "水の領域の継続時間 +67%（ヒット回数の増加は、技の構造の登録後に反映）",
   "verified": "確認済み",
   "note": "領域のヒット回数が増える効果。技の構造の登録後に入力"
  },
  "Surge: Thunderbolt": {
   "done": true,
   "e": [],
   "txt": "水の領域の倍率 +44%（技の構造の登録後に反映）",
   "verified": "確認済み",
   "note": "領域のヒットの倍率が増える効果。技の構造の登録後に入力"
  },
  "Let Me Help!": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "to": "lux",
     "stk": 5
    }
   ],
   "txt": "領域内の水属性の通常攻撃ダメージ +（毎秒・最大5重）",
   "verified": "確認済み"
  },
  "Stay Away!": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main",
     "stk": 10
    }
   ],
   "txt": "領域がダメージを与えると、主力の攻撃力 +（6秒・最大10重）／領域の間隔 −50%",
   "verified": "確認済み",
   "note": "領域の間隔の短縮（ヒット回数の増加）は、技の構造の登録後に入力"
  },
  "How About This!": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "間欠泉（決めるにゃ！）",
     "t": "skill",
     "c": 5,
     "edit": true,
     "n": 0
    }
   ],
   "off": true,
   "note": "確率発動かつ主力の行動による",
   "txt": "領域内の水属性の主力がダメージを与えると、50%で間欠泉（スキル）。回数は仮に5回"
  },
  "Shortcut Seeker": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "水属性の巡遊者の攻撃力 +",
   "verified": "確認済み"
  },
  "Band-aid Collector": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "テレサが場にいるとき、全員の攻撃力 +",
   "verified": "確認済み"
  },
  "Magic Sword Wielder": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "テレサの攻撃力 +",
   "verified": "確認済み"
  }
 },
 "Suntide Willow": {
  "Bubble Flurry": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 1,
     "stk": 10,
     "tags": [
      "frog"
     ]
    }
   ],
   "txt": "バブル吸収ごとにフロッグのスキルダメージ +5%（最大10重＝+50%）",
   "verified": "確認済み",
   "draft": false
  },
  "Rippling Radiance": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 1,
     "to": "enemy",
     "stk": 4
    }
   ],
   "txt": "敵の水属性被ダメージ +4%（最大4重）。フロッグの周囲への水ダメージ（攻撃力146%）は計算に入れていない（前の計算と同じ）。ほかの被ダメージの効果とは足し算で計算（足し算か掛け算かはゲームで未確認）",
   "draft": false
  },
  "Rhythmic Bubbles": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 1,
     "tags": [
      "frog"
     ]
    }
   ],
   "txt": "フロッグのスキルダメージ +50%",
   "verified": "確認済み",
   "draft": false
  },
  "Rainbow Rebound": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 2,
     "to": "all",
     "stk": 8
    }
   ],
   "txt": "敵の全属性被ダメージ +1.8%（最大8重。全員の攻撃に乗る）。ほかの被ダメージの効果とは足し算で計算（足し算か掛け算かはゲームで未確認）",
   "verified": "確認済み",
   "draft": false
  },
  "Clustered Foam": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 1,
     "to": "lux"
    }
   ],
   "txt": "バブルマーク付きの敵への水属性ダメージ（水属性の全員）",
   "verified": "確認済み",
   "draft": false
  },
  "Enduring Bubble": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "stk": 5
    }
   ],
   "txt": "敵の水属性被ダメージ（最大5重）。ほかの被ダメージの効果とは足し算で計算（足し算か掛け算かはゲームで未確認）",
   "verified": "確認済み",
   "draft": false
  },
  "Dreamlike Illusion": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "to": "lux",
     "stk": 6
    }
   ],
   "txt": "水属性の全員のスキルダメージ（最大6重）",
   "verified": "確認済み",
   "draft": false
  },
  "Wavering Glow": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 1,
     "to": "all",
     "stk": 4
    }
   ],
   "txt": "敵の全属性被ダメージ（最大4重。全員の攻撃に乗る）。ほかの被ダメージの効果とは足し算で計算（足し算か掛け算かはゲームで未確認）",
   "verified": "確認済み",
   "draft": false
  },
  "Foam Echo": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "selfNonEl",
     "stk": 8
    }
   ],
   "txt": "ウィローと水属性以外の味方の攻撃力（最大8重）",
   "verified": "確認済み",
   "draft": false
  },
  "Touch 'n' Bounce": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "to": "all",
     "stk": 8
    },
    {
     "k": "Bs",
     "n": 1,
     "to": "nonEl",
     "stk": 8,
     "sk": "b"
    }
   ],
   "txt": "全員のスキルダメージ（最大8重）。水属性以外の味方はさらに加算（最大8重）",
   "verified": "確認済み",
   "draft": false
  },
  "Cumulus Drift": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "フロッグがいる間、全員の攻撃力",
   "verified": "確認済み",
   "draft": false
  },
  "Singing Shores": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "回避後、ウィロー自身の攻撃力",
   "verified": "確認済み",
   "draft": false
  },
  "Ocean Wanderer": {
   "done": true,
   "e": [],
   "txt": "シールド（火力に影響しない）",
   "verified": "確認済み",
   "draft": false
  },
  "Tidal Warning": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "必殺技ダメージ",
   "verified": "確認済み",
   "draft": false
  },
  "Shore Regulation": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "必殺技の後25秒、全員の攻撃力",
   "verified": "確認済み",
   "draft": false
  },
  "Marine Justice": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "stk": 5
    }
   ],
   "txt": "敵の水属性被ダメージ（最大5重）。ほかの被ダメージの効果とは足し算で計算（足し算か掛け算かはゲームで未確認）",
   "verified": "確認済み",
   "draft": false
  }
 },
 "Shia": {
  "Kindred Bound": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "雪兎の火力支援",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 6.4
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Twin Moons": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "夜兎の支援攻撃",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 10
    }
   ],
   "txt": ""
  },
  "Bunny Torrent": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
  },
  "Rabbit Flip": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "アブナイウェイヴ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 4.1
    }
   ],
   "txt": ""
  },
  "Dance of the Riptide": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
  },
  "Snowfall's Heartbeat": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 24
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Eclipse Blast": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Flow Reversal": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Kick the Wave": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
  },
  "Catch the Wave": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 12
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Moonfall": {
   "done": true,
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Tidal Charge": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Counter Current": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Howl to the Moon": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 20
    }
   ],
   "txt": "",
   "verified": "確認済み",
   "note": "中間のLvは直線補間（未確認）"
  },
  "Silent Tide": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "note": "中間のLvは直線補間（未確認）",
   "txt": "中間のLvは直線補間（未確認）"
  },
  "Wave to Oblivion": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "note": "中間のLvは直線補間（未確認）",
   "txt": "中間のLvは直線補間（未確認）"
  },
  "Phantom Step Radiance": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "光の雪兎",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 396
    }
   ],
   "txt": ""
  },
  "Rimecrystal Edge": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "スノーフォール",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 635
    },
    {
     "k": "extra",
     "group": "main",
     "name": "スノーフォール",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 396
    }
   ],
   "txt": ""
  },
  "Moonlight Overflow": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "月の夜兎",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 127
    },
    {
     "k": "W",
     "raw": 0.05,
     "stk": 10
    }
   ],
   "txt": ""
  },
  "Astral Pirouette": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "ナイトフォロー",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 129
    },
    {
     "k": "W",
     "raw": 0.05,
     "stk": 10
    }
   ],
   "txt": ""
  },
  "Subzero Dominion": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "main"
    }
   ],
   "txt": "",
   "verified": "確認済み",
   "note": "中間のLvは直線補間（未確認）"
  },
  "Glacial Dash": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "note": "中間のLvは直線補間（未確認）",
   "txt": "中間のLvは直線補間（未確認）"
  },
  "Rimeheart Pulse": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6
    }
   ],
   "note": "中間のLvは直線補間（未確認）",
   "txt": "中間のLvは直線補間（未確認）"
  },
  "Lunar Detonation": {
   "done": true,
   "e": [],
   "txt": ""
  },
  "Final Crescent": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "stk": 5
    }
   ],
   "txt": "",
   "verified": "確認済み",
   "note": "中間のLvは直線補間（未確認）"
  },
  "Lunar Combo": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "to": "main"
    }
   ],
   "txt": "",
   "verified": "確認済み",
   "note": "中間のLvは直線補間（未確認）"
  },
  "Leporine Gale": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み",
   "note": "中間のLvは直線補間（未確認）"
  },
  "Rabbit's Beam": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "arr": [
      5,
      7.8,
      10.6,
      13.4,
      16.2,
      19
     ],
     "stk": 2
    }
   ],
   "note": "中間のLvは直線補間（未確認）",
   "txt": "中間のLvは直線補間（未確認）"
  },
  "Hare's Pursuit": {
   "done": true,
   "e": [
    {
     "k": "W",
     "arr": [
      24,
      38.4,
      52.8,
      67.2,
      81.6,
      96
     ]
    }
   ],
   "note": "中間のLvは直線補間（未確認）",
   "txt": "中間のLvは直線補間（未確認）"
  }
 },
 "Gerie": {
  "Beyond All Control": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "raw": 0.47
    }
   ],
   "txt": "殺伐状態のとき、通常攻撃ダメージ +47%",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Avalanche of Stone": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "地を砕く円匙",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 67
    }
   ],
   "txt": "通常攻撃でダメージを与えたとき、追加で 67%（通常攻撃）",
   "note": "ゲームの画面は 67%（Wikiは33.7%）を確認（2026-10-30）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Agony Cascade": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "raw": 0.5
    }
   ],
   "txt": "スキルダメージ +50%",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Deeper into Sin": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "raw": 0.11,
     "tags": [
      "shovel"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "重ね続けた罪",
     "t": "skill",
     "c": 2,
     "edit": true,
     "m": 120,
     "tags": [
      "shovel"
     ]
    }
   ],
   "txt": "チェーンシャベルのダメージ +11%（その攻撃だけの別枠の掛け算で計算・未実測）、支援スキル発動時に追加のチェーンシャベル 120%×2本（スキル）",
   "note": "ゲームの画面は 120%（Wikiは131%）を確認（2026-10-30）。「追加で2本」なので2回にした。+11%はヒットの倍率として計算（未実測）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Curtain Call": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "raw": 0.11,
     "tags": [
      "shovel"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "終わらぬ余興",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 40,
     "tags": [
      "shovel"
     ]
    }
   ],
   "txt": "チェーンシャベルのダメージ +11%（その攻撃だけの別枠の掛け算で計算・未実測）、回収時にチェーンシャベル 40%（スキル）",
   "note": "ゲームの画面は 40%（Wikiは43.8%）を確認（2026-10-30）。+11%はヒットの倍率として計算（未実測）。回収時の本数は仮に1",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Sin-Bound Echo": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "魂の解放",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 28,
     "tags": [
      "wave"
     ]
    }
   ],
   "txt": "支援スキル発動後6秒、1秒ごとに震動波 28%（スキル）",
   "note": "ゲームの画面は 28%（Wikiは30.7%）を確認（2026-10-30）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Earthshaker": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "raw": 0.32,
     "tags": [
      "wave"
     ]
    }
   ],
   "txt": "震動波（支援スキルの攻撃・魂の解放）のダメージ +32%（その攻撃だけの別枠の掛け算で計算・未実測）",
   "note": "ゲームの画面で 32% を確認（2026-10-30）。範囲+40%は火力に影響しない",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hexacalamity: Hallowed Chains": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "六罪：強制殉教",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "チェーンシャベルが命中したとき、追加ダメージ（スキル）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hexacalamity: Grief's Toll": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "支援スキル発動から3秒、スキルダメージ +",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hexacalamity: Tyrant's March": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "shovel"
     ]
    }
   ],
   "txt": "HP70%未満の敵へのチェーンシャベルのダメージ +（その攻撃だけの別枠の掛け算で計算・未実測）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hexacalamity: Famine": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "六罪：苦痛渇望",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "震動波が終わるとき、追加ダメージ（スキル）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hexacalamity: Erosion": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "支援スキル中、1秒ごとにスキルダメージ +（1つ分で計算）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hexacalamity: Death": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "wave"
     ]
    }
   ],
   "txt": "震動波のダメージ +（その攻撃だけの別枠の掛け算で計算・未実測）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Anima Resonance": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "perLux": true
    }
   ],
   "txt": "地属性の味方1体につき、グレイの攻撃力 +",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Twilight's Verdict": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 4
    }
   ],
   "txt": "地の印を発動してから8秒、地属性ダメージ +（最大4重）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Twilight's Hunt": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 2
    }
   ],
   "txt": "ほかの巡遊者がスキルか必殺技を使ってから8秒、攻撃力 +（最大2重）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Emberwing's Proclamation": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    },
    {
     "k": "extra",
     "group": "ult",
     "name": "恩恵：焔の終焉",
     "t": "ult",
     "c": 2,
     "edit": true,
     "n": 1
    }
   ],
   "txt": "必殺技ダメージ +、巨大チェーンシャベル ×2本（必殺技）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Quadrifrons' Lore": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    },
    {
     "k": "Bu",
     "n": 1
    }
   ],
   "txt": "必殺技ダメージ +、地の印の発動から15秒はその敵へさらに +",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Samsara's Judgment": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0
    }
   ],
   "off": true,
   "txt": "必殺技の発動から15秒、敵がグレイから受けるダメージ +（被ダメージの足し算）。必殺技のあとの効果なので既定はオフ",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Piercing Sorrow": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "cage"
     ]
    }
   ],
   "txt": "鉄の牢獄のダメージ +（その攻撃だけの別枠の掛け算で計算・未実測）",
   "note": "持続時間+50%（ヒット回数）は未反映",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Slanderous Strike": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0
    }
   ],
   "off": true,
   "txt": "移動速度が下がった敵（鉄の牢獄で繋がれた敵）へのダメージ +（その攻撃だけの別枠の掛け算で計算・未実測）。条件付きなので既定はオフ",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Everyone's Invited": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "cage"
     ]
    }
   ],
   "txt": "鉄の牢獄のダメージ +（その攻撃だけの別枠の掛け算で計算・未実測）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Shared Sensation": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "perLux": true
    }
   ],
   "txt": "地属性の味方1体につき、グレイの攻撃力 +",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Shadow Law": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 2
    }
   ],
   "txt": "ほかの巡遊者の支援スキル発動から10秒、スキルダメージ +（最大2重）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Hunt is On": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "回避のあと8秒、攻撃力 +",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "No Safeword": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "note": "ブレイク中の敵への効果は、別に入れられるようにするとよい（ユーザー）",
   "txt": "通常攻撃ダメージ +（ブレイク中の敵へのさらに + は未反映）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Delight in Ruin": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6
    }
   ],
   "txt": "通常攻撃のダメージを与えてから8秒、攻撃力 +（最大6重）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Lingering Hunger": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "txt": "通常攻撃ダメージ +",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  },
  "Endless Throes": {
   "done": true,
   "e": [],
   "off": true,
   "txt": "鉄の牢獄で繋がれたほかの敵に 155%（スキル）。敵が1体では発動しないので計算しない",
   "note": "ゲームの画面は 155%（Wikiは127%）を確認（2026-10-30）",
   "verified": "確認済み",
   "checked": "2026-10-30 ゲームの画面と数字を確認"
  }
 },
 "Otoha": {
  "Cycle of Four Seasons": {
   "draft": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "stk": 10
    },
    {
     "k": "Bu",
     "n": 1,
     "stk": 10
    }
   ],
   "txt": "通常攻撃のあと5秒、通常攻撃ダメージ＋・必殺技ダメージ＋（10重）",
   "note": "2026-11-03 文と入力の種類の点検で直した（数値はWiki・画面では未確認）"
  }
 },
 "Karin": {
  "Dark Shackle Detonation": {
   "draft": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "チェインバースト",
     "t": "basic",
     "c": 1,
     "edit": true,
     "n": 0
    },
    {
     "k": "Bb",
     "n": 1
    }
   ],
   "txt": "デスデスの消失時に追加ダメージ（通常）、そのあと8秒 通常攻撃ダメージ＋",
   "note": "2026-11-03 文と入力の種類の点検で直した（数値はWiki・画面では未確認）"
  }
 },
 "Firenze": {
  "Nimble Step": {
   "draft": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "しなやかステップ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 188
    },
    {
     "k": "Bs",
     "raw": 0.05
    }
   ],
   "txt": "領域が0.5秒ごとに 188%（スキル）、領域の中でスキルダメージ +5%",
   "note": "2026-11-03 文と入力の種類の点検で直した（数値はWiki・画面では未確認）"
  }
 },
 "Nazuna": {
  "Small Force": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "raw": 0.1,
     "to": "enemy",
     "el": "地",
     "stk": 5
    }
   ],
   "txt": "ぬいぐるみペンギンが当たった敵の地属性被ダメージ +10%（最大5重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-10-29）"
  },
  "Wobble Dance": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "ダンス（みんなで踊ろう）",
     "t": "skill",
     "c": 11,
     "edit": true,
     "m": 4.6,
     "lv": "main",
     "tags": [
      "penguin"
     ]
    }
   ],
   "txt": "ぬいぐるみペンギンのダンス 4.6%×11（スキル・主力スキルのLvで伸びる）。回復は火力に影響しない",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは「火力に影響しない」になっていたのを直した。ダメージの種類は文に無いので、主力スキルと同じスキルダメージにした（画面の確認 2026-10-29）"
  },
  "Cuddle of Terror": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "penguin"
     ]
    }
   ],
   "txt": "ぬいぐるみペンギンのダメージ＋（スキルダメージの加算として計算。移動の終わりに飛び込む動きは火力に影響しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "「ダメージが増加」をスキルダメージの加算にした（未実測）。下書きは分類できていなかった（画面の確認 2026-11-06）"
  },
  "Cutie's Rally": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "ぬいぐるみペンギンがいる間、全員の攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Beat Maestro": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 3
    }
   ],
   "txt": "矢の装填から5秒、ナズナのスキルダメージ＋（最大3重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Roll the Dice": {
   "done": true,
   "e": [],
   "txt": "通常攻撃で30%の確率（主力スキルのCT中は50%）で、矢2本を使って3本撃つ（計算に未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "矢の本数が増える効果は、通常攻撃の回数の決め方がないので入れていない（画面の確認 2026-11-06）"
  },
  "Graceful Turn": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "回転射撃（くるっと回って）",
     "t": "basic",
     "c": 6,
     "edit": true,
     "m": 19.8,
     "lv": "basic"
    },
    {
     "k": "atkPct",
     "raw": 0.1,
     "to": "all"
    }
   ],
   "txt": "矢の装填のとき、回転射撃 19.8%×6本（通常・通常攻撃のLvで伸びる）／装填から4秒、全員の攻撃力 +10%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 14.4%（通常攻撃Lv6のときの値。Lv10は19.8%）・10%。回数は装填1回分（画面の確認 2026-11-06）"
  },
  "Clean Sweep": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "幸運のたまご",
     "t": "basic",
     "c": 0.2,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "通常攻撃のとき20%の確率で、幸運のたまご 21.5〜86%（通常）。回数は通常攻撃1回につき0.2回",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは主力スキルに付けていたのを、通常攻撃に直した（画面の確認 2026-11-06）"
  },
  "Fill the Gap": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 5,
     "to": "sup"
    }
   ],
   "txt": "矢の装填から6秒、支援の2人のスキルダメージ＋（最大5重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きはナズナ自身に付けていたのを、支援の巡遊者に直した（画面の確認 2026-11-06）"
  },
  "Focus Fire": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "主力スキルのCT中、全員の攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Swiftstep": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "回避から2秒、全員の攻撃力%（回避の回数+1は火力に影響しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Wily Wonder": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "主力スキルから5秒、地属性の全員の地属性ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "「チーム全体の地属性ダメージ」なので、地属性の巡遊者に付けた（画面の確認 2026-11-06）"
  },
  "Operation: Pandemonium": {
   "done": true,
   "e": [
    {
     "k": "critRate",
     "n": 0,
     "to": "all",
     "ht": "skill"
    }
   ],
   "txt": "必殺技から15秒、全員のスキル会心率＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Balloonado": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "必殺技ダメージ＋（敵を引き寄せる効果は火力に影響しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Rocket Cart": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "el": "地",
     "stk": 5
    }
   ],
   "txt": "必殺技が当たると30%の確率で、敵の地属性被ダメージ＋（最大5重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Bold Assertion": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "raw": 1.133,
     "to": "all"
    },
    {
     "k": "count",
     "hit": "sStatue",
     "add": 3
    }
   ],
   "txt": "ペンギンのキスが強化され、3.5秒 全員の攻撃力 +113.3%／ペンギン像の攻撃が10回（+3回）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Feel the Beat": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "raw": 0.05,
     "to": "enemy",
     "el": "地",
     "stk": 5
    }
   ],
   "txt": "ペンギン像が当たった敵の地属性被ダメージ +5%（最大5重）。ペンギンの出る確率の上昇は未反映",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Jubilant Spin": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "to": "main"
    }
   ],
   "txt": "ペンギン像のとき、7秒 主力のスキルダメージ＋（ナズナの掃射1回の追加は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Feather Frenzy": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "ペンギンショー（掃射の追加）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "掃射のとき、ペンギンがハートより多ければ 2.98〜11.9%（スキル）を追加",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは「火力に影響しない」になっていたのを直した。ダメージの種類は文に無いのでスキルにした（画面の確認 2026-11-06）"
  },
  "Twinkle Toss": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "自爆（あの星に敬礼！）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "ペンギン像が消えるとき自爆 30〜122%（スキル）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは「火力に影響しない」になっていたのを直した。ダメージの種類は文に無いのでスキルにした（画面の確認 2026-11-06）"
  },
  "Arrow of Affection": {
   "done": true,
   "e": [
    {
     "k": "count",
     "hit": "sHeart",
     "add": 1
    }
   ],
   "txt": "ハートアローが1回跳ね渡る（+1回）。ハートの出る確率の上昇は未反映",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Sweetheart Bloom": {
   "done": true,
   "e": [
    {
     "k": "W",
     "raw": 0.32,
     "to": "lux"
    }
   ],
   "txt": "愛のキスが強化され、3.5秒 地属性の全員の地属性ダメージ +32%（2次爆発は倍率が分からないので未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 32%（Wikiは57%）。スキルLvの伸び方とは合わないので、画面の値をそのまま入れた（画面の確認 2026-11-06）"
  },
  "Rain of Passion": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "main"
    }
   ],
   "txt": "ハートアローのあと7秒、主力の地属性ダメージ＋（ナズナの掃射1回の追加は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Love's True Strike": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "el": "地"
    }
   ],
   "txt": "ハートがペンギンより多いときの掃射で、敵の地属性被ダメージ＋（7秒）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Honeyed Arrow": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "sweep",
      "heart"
     ]
    }
   ],
   "txt": "掃射とハートアローのダメージ＋（スキルダメージの加算として計算）。回復の上昇は火力に影響しない",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは分類できていなかった（画面の確認 2026-11-06）"
  },
  "Lucky Drop": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "ナズナがいる間、地属性の全員の地属性ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Progressive Jackpot": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 3
    }
   ],
   "txt": "スロットから7秒、ナズナの攻撃力%（最大3重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Double Delight": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "スロットが続けて全部ペンギンか全部ハートのとき、10秒 地属性の全員の地属性ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "「チーム全体の地属性ダメージ」なので、地属性の巡遊者に付けた（画面の確認 2026-11-06）"
  }
 },
 "Chitose": {
  "Serpent's Glide": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "騰蛇（蛟龍の型）",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 52.9,
     "tags": [
      "serpent"
     ]
    }
   ],
   "txt": "主力スキルの後、通常攻撃で騰蛇 52.9%（通常）。騰蛇は水の印を発動できる（印は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の文は、Wikiの文の末尾に「生成した騰蛇は水属性の印を発動させることができる。」が付く。回数は仮に通常攻撃1回につき1回（画面の確認 2026-11-05）"
  },
  "Mirror Blade": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "raw": 0.6,
     "tags": [
      "basic"
     ]
    }
   ],
   "txt": "主力スキルの後12秒、通常攻撃のときに60%のダメージ倍率の鏡影が通常攻撃をする（通常攻撃の倍率 ×1.6 として計算）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の文: 主力スキル発動後、12秒間、通常攻撃時にチトセの60%のダメージ倍率を持つ鏡影を生成し、鏡影が通常攻撃を行う。この間、中断耐性が上昇（Wikiは「攻撃力の60%」）。鏡影が同じ通常攻撃をする扱いは未実測（画面の確認 2026-11-05）"
  },
  "Aqueous Phantasm": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "追加の騰蛇（蛟龍の尾）",
     "t": "basic",
     "c": 2,
     "edit": true,
     "n": 0,
     "tags": [
      "serpent"
     ]
    }
   ],
   "txt": "騰蛇が当たると、追加の騰蛇 37〜148%×2（通常）。3秒ごと・3回まで。騰蛇は水の印を発動できる（印は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 Lv1=37%・Lv6=148%、それぞれ×2（画面の確認 2026-11-05）"
  },
  "Tremble and Fall": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    },
    {
     "k": "W",
     "n": 1,
     "tags": [
      "s15"
     ]
    }
   ],
   "txt": "通常攻撃ダメージ＋／瞬刃があるとき、通常攻撃の1〜5撃目の水属性ダメージ＋（瞬刃は最終撃で5つ・1〜5撃目で1つ使う）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "Wikiの文の「最襲撃」は「最終撃」の誤り。回避の回数+1は火力に影響しない（画面の確認 2026-11-05）"
  },
  "Dance of Elegance": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "stk": 10
    },
    {
     "k": "W",
     "n": 1,
     "stk": 8,
     "tags": [
      "final"
     ]
    }
   ],
   "txt": "騰蛇のダメージから3秒、通常攻撃ダメージ＋（最大10重）／通常攻撃の最終撃（6撃目）の水属性ダメージ＋（最大8重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは通常攻撃ダメージを8重にしていたのを、文に合わせて直した（画面の確認 2026-11-05）"
  },
  "Cascade of Ruin": {
   "done": true,
   "e": [
    {
     "k": "drop",
     "hit": "mScale"
    },
    {
     "k": "extra",
     "group": "main",
     "name": "流閃・鱗（滝斬の型）",
     "t": "skill",
     "c": 4,
     "edit": true,
     "m": 529,
     "lv": "main",
     "tags": [
      "main",
      "scale"
     ]
    }
   ],
   "txt": "流閃・鱗が主力スキル1回ごとに出て、強化されて 529%×4（スキル・主力スキルのLvで伸びる）。元の流閃・鱗（356%×3）と置き換え",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "529%×4 は主力スキルLv10の値として入れた（画面の確認 2026-11-05）"
  },
  "Against the Flow": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "raw": 0.5,
     "tags": [
      "main"
     ]
    }
   ],
   "txt": "主力スキルのCT -50%（未反映）／主力スキルのとき50%のダメージ倍率の鏡影がスキルを使う（主力スキルの倍率 ×1.5 として計算）。鏡影は水の印を発動できる（未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の文は「50%ダメージ倍率を持つ鏡影」（Wikiは「攻撃力の50%」）。鏡影が同じ主力スキルを使う扱いは未実測（画面の確認 2026-11-05）"
  },
  "Flowing Circle": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "スキルダメージ＋（主力スキルの回数+1は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Serpent in Tide": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 3
    }
   ],
   "txt": "主力スキルから6秒、スキルダメージ＋（最大3重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは主力の巡遊者に付けていたのを、チトセ自身に直した（画面の確認 2026-11-05）"
  },
  "Returning Tide": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "スキルダメージ＋（流閃・鱗に変わる効果は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Azure Embrace": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "自分以外の水属性の巡遊者がいるとき、チトセの攻撃力%（条件は計算で見ていない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは同じ属性の全員に付けていたのを、チトセ自身に直した（画面の確認 2026-11-05）"
  },
  "Waltz of Ripples": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "回避の後6秒、攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Adamant Scales": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    },
    {
     "k": "atkPct",
     "n": 1
    }
   ],
   "txt": "攻撃力%＋（攻撃を受けたとき・主力スキルから8秒）さらに攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きに無かった2つ目の攻撃力%を足した（画面の確認 2026-11-05）"
  },
  "Serpent's Saliva": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "必殺技ダメージ＋（寒冷の追加は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Serpent Dance": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "必殺技から20秒、攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Tide of Serpent Bones": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "寒冷か凍結の敵に、必殺技ダメージ＋（チトセの水の印で寒冷が付く前提）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "「ダメージが増加」を必殺技ダメージの加算として計算（未実測）（画面の確認 2026-11-05）"
  },
  "Submerged Fang": {
   "done": true,
   "e": [
    {
     "k": "count",
     "hit": "sRush",
     "add": 8
    },
    {
     "k": "critRate",
     "raw": 0.15,
     "ht": "skill",
     "tags": [
      "rush"
     ]
    }
   ],
   "txt": "支援スキルの連撃 +2回（+8ヒット）、連撃の会心率 +15%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の文: 連撃の会心率が15%上昇し、連撃の回数が2回増加（Wikiは「増加分の連撃の会心率」）（画面の確認 2026-11-05）"
  },
  "Whirl Blade": {
   "done": true,
   "e": [
    {
     "k": "critRate",
     "raw": 0.35,
     "ht": "skill",
     "tags": [
      "rush"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "追加の連撃（呑流の渦刃）",
     "t": "skill",
     "c": 4,
     "edit": true,
     "m": 5.9,
     "lv": "support",
     "tags": [
      "rush"
     ]
    }
   ],
   "txt": "連撃の会心率 +35%／連撃で会心が出ると追加の連撃 5.9%×4（スキル・支援スキルのLvで伸びる）。追加の回数は仮に1回",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 4.3%（支援スキルLv6のときの値。Lv10は5.9%）（画面の確認 2026-11-05）"
  },
  "Luminous Blade Song": {
   "done": true,
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "ht": "skill"
    },
    {
     "k": "count",
     "hit": "sRush",
     "add": 4
    }
   ],
   "txt": "スキル会心ダメージ＋／支援スキルの連撃 +1回（+4ヒット）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Blink Combo Slash": {
   "done": true,
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "ht": "skill",
     "tags": [
      "rush"
     ]
    }
   ],
   "txt": "連撃で会心が出たとき、残りの連撃の会心ダメージ＋（全部の連撃に乗る扱い）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "（画面の確認 2026-11-05）"
  },
  "Sing with Steel": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 2,
     "tags": [
      "rush"
     ]
    }
   ],
   "txt": "連撃を出すたびに、連撃のダメージ＋（3回の連撃の平均で2重として計算）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "重ね方は未実測（画面の確認 2026-11-05）"
  },
  "Blade of the Deep": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "鏡影（滝壺の水影）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 66,
     "lv": "support",
     "tags": [
      "mirror"
     ]
    }
   ],
   "txt": "支援スキルのとき鏡影 66%（スキル・支援スキルのLvで伸びる）。鏡影は6体まで",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 48%（支援スキルLv6のときの値。Lv10は66%）（画面の確認 2026-11-05）"
  },
  "Where Shadows Drown": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "爆発（砕滝の飛沫）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 48,
     "lv": "support",
     "perTag": "mirror"
    }
   ],
   "txt": "鏡影が当たると爆発 48%（スキル・支援スキルのLvで伸びる）。水の印の発動は未反映",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 34.9%（支援スキルLv6のときの値。Lv10は48%）（画面の確認 2026-11-05）"
  },
  "Shattered Breath": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "mirror"
     ]
    }
   ],
   "txt": "鏡影の、HPが70%未満の敵へのスキルダメージ＋（HPの条件があるので既定は反映しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の文: 鏡影はHPが70%未満の敵に与えるスキルダメージが138%増加する（Lv6）（画面の確認 2026-11-05）",
   "off": true
  },
  "Unseen Aquatic Blade": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "perLux": true
    }
   ],
   "txt": "チーム内の水属性の巡遊者1人につき、チトセの水属性ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは同じ属性の全員に付けていたのを、チトセ自身（水属性の人数ぶん）に直した（画面の確認 2026-11-06）"
  },
  "Water Edge": {
   "done": true,
   "e": [
    {
     "k": "mark",
     "n": 0
    }
   ],
   "txt": "チトセと鏡影の印ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Waterflow Blade": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "チトセの攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Mirror Tide": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "mirror"
     ]
    }
   ],
   "txt": "鏡影が当たると、鏡影の攻撃力＋（支援スキルの終わりでリセット）。鏡影の倍率 ×(1+x) として計算",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "鏡影だけの攻撃力%は計算の枠がないので、鏡影のヒットの倍率にした（近い値）。重複するかは文に書いていないので1回分（画面の確認 2026-11-06）"
  },
  "Shadow Cutter": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "mirror"
     ]
    }
   ],
   "txt": "鏡影のスキルダメージ＋（鏡影が敵を倒したときの、ほかの鏡影の＋は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは2つともチトセ全体のスキルダメージにしていたのを、鏡影だけに直した。撃破の条件の分は、ボス1体では起きないので入れない（画面の確認 2026-11-06）"
  }
 },
 "Eleanor": {
  "Tactical Protocol: Threshold": {
   "done": true,
   "e": [],
   "txt": "レディ・クロスの攻撃+1回・風属性ダメージ +20%（レディ・クロスは計算のヒットに無いので未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Tactical Protocol: Detonation": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "爆弾（令嬢戦術：爆花）",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 201
    }
   ],
   "txt": "令嬢のひらめきを得る・使うたびに爆弾 201%（通常）。回数は仮に1回",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 201%。どのスキルのLvで伸びるかは未確認なので、固定の値にした（画面の確認 2026-11-06）"
  },
  "Double Rifts": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "レディ・クロスの爆発（レディ・ブレイク）",
     "t": "basic",
     "c": 1,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "レディ・クロスの追加の爆発 60〜240%（通常）。回数は仮に1回。エリート以上へのレディ・クロスの風属性ダメージ＋は未反映",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Battle Fury": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "レディ・クロスから6秒、攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Vortex Boost": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "txt": "警戒の間、通常攻撃ダメージ＋（通常攻撃の最終段の風の印は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Tactical Protocol: Overload": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "raw": 0.4
    }
   ],
   "txt": "レディ・クロスから15秒、攻撃力 +40%（警戒の間隔の短縮は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Tactical Protocol: Synergy": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "追加ダメージ（令嬢戦術：嵐花）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 540,
     "lv": "main",
     "tags": [
      "vigil"
     ]
    },
    {
     "k": "W",
     "raw": 0.2
    }
   ],
   "txt": "警戒が2回当たるたびに 540%（スキル・主力スキルのLvで伸びる）。回数は仮に1回／主力スキルから10秒、風属性ダメージ +20%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 193%（主力スキルLv1のときの値。Lv10は540%）（画面の確認 2026-11-06）"
  },
  "Area Volley": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "vigil"
     ]
    }
   ],
   "txt": "警戒のスキルダメージ＋（範囲の拡大は火力に影響しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Zone Detection": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 3
    }
   ],
   "txt": "主力スキルのとき、周りの敵1体につき攻撃力%（最大3重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Chain Echo": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 5
    }
   ],
   "txt": "通常攻撃ダメージを与えると、スキルダメージ＋（最大5重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Wind Bond": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 3,
     "to": "lux"
    }
   ],
   "txt": "風の印のとき、風属性の全員の攻撃力%（最大3重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは全員に付けていたのを、風属性の巡遊者に直した（画面の確認 2026-11-06）"
  },
  "Annihilation Pulse": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "txt": "風属性ダメージ＋（必殺技の風の印は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Flicker Sequence": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "攻撃力%（回避のCT短縮は火力に影響しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Reinforcement Command": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "txt": "必殺技から25秒、風属性ダメージ＋（必殺技の後なので既定は反映しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06",
   "off": true
  },
  "Purge Command": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0
    },
    {
     "k": "Bu",
     "n": 1,
     "stk": 5
    }
   ],
   "txt": "風属性ダメージ＋／必殺技が当たると、必殺技ダメージ＋（最大5重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Focus Command": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    },
    {
     "k": "Bu",
     "n": 1,
     "stk": 5
    }
   ],
   "txt": "攻撃力%／風属性の味方が主力・支援スキルを使うと、エレノアの必殺技ダメージ＋（最大5重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは必殺技ダメージを同じ属性の全員に付けていたのを、エレノア自身に直した（画面の確認 2026-11-06）"
  },
  "Chain Detonation": {
   "done": true,
   "e": [
    {
     "k": "critRate",
     "raw": 0.2,
     "ht": "skill",
     "tags": [
      "jump"
     ]
    }
   ],
   "txt": "叩きつけの爆発の会心率 +20%（爆発の回数の増加は未反映）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Seismic Spread": {
   "done": true,
   "e": [
    {
     "k": "critDmg",
     "raw": 0.24,
     "ht": "skill",
     "tags": [
      "jump"
     ]
    },
    {
     "k": "mult",
     "raw": 0.12,
     "stk": 9,
     "tags": [
      "jump"
     ]
    }
   ],
   "txt": "叩きつけの爆発の会心ダメージ +24%／爆発のたびに、後の爆発の倍率 +12%（最大9重・冒険の彩りと同じ枠で足し算）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "以前の計算（data_sup.js）の実測の確認: 会心ダメージ+24%・倍率+12%×9 を実測で確認（画面の確認 2026-11-06）"
  },
  "Field Pull": {
   "done": true,
   "e": [
    {
     "k": "critRate",
     "raw": 0.2,
     "ht": "skill",
     "tags": [
      "jump"
     ]
    },
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "jump"
     ]
    }
   ],
   "txt": "叩きつけの爆発の会心率 +20%・倍率＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Power Boost": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 10,
     "tags": [
      "jump"
     ]
    },
    {
     "k": "critDmg",
     "n": 1,
     "stk": 15,
     "ht": "skill",
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "txt": "爆発が当たるたびに、エレノアの爆発のスキルダメージ＋（最大10重）／主力が風属性のとき、主力のスキル会心ダメージ＋（最大15重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "主力の会心ダメージの分は、以前の計算には入っていなかった。「アタッカー」の条件は見ていない（画面の確認 2026-11-06）"
  },
  "Shattering Blow": {
   "done": true,
   "e": [
    {
     "k": "mult",
     "n": 0,
     "tags": [
      "jump"
     ]
    },
    {
     "k": "W",
     "n": 1,
     "tags": [
      "jump"
     ]
    }
   ],
   "txt": "叩きつけの爆発の倍率＋・風属性ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Function Sustain": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "raw": 0.48,
     "tags": [
      "drone"
     ]
    },
    {
     "k": "mult",
     "n": 1,
     "stk": 9,
     "tags": [
      "drone"
     ]
    }
   ],
   "txt": "ドローンの攻撃力 +48%／叩きつけのたびに、ドローンの倍率 +13.8%（最大9重）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 13.8%（Wikiの日本語は18%）（画面の確認 2026-11-06）"
  },
  "Cluster Barrage": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "追撃（追撃ガード）",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 324,
     "lv": "support",
     "tags": [
      "drone"
     ]
    }
   ],
   "txt": "ドローンの弾が3回当たるたびに追撃 324%（通常・支援スキルのLvで伸びる）。回数は仮に1回。既定は反映しない",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の値 296%（支援スキルLv9のときの値。Lv10は324%）（画面の確認 2026-11-06）",
   "off": true
  },
  "Piercing Trajectory": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "tags": [
      "drone"
     ]
    }
   ],
   "txt": "エリート以上の敵に、ドローンの通常攻撃ダメージ＋（弾の貫通は火力に影響しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Precision Calibration": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "tags": [
      "drone"
     ]
    },
    {
     "k": "Bb",
     "n": 1,
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "txt": "ドローンの攻撃力＋／ドローンが3体いるとき、主力が風属性なら主力の通常攻撃ダメージ＋",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "主力の通常攻撃ダメージの分は、以前の計算には入っていなかった。「アタッカー」の条件は見ていない（画面の確認 2026-11-06）"
  },
  "Suppression Analysis": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "tags": [
      "drone"
     ]
    },
    {
     "k": "atkPct",
     "n": 1
    }
   ],
   "txt": "ドローンの通常攻撃ダメージ＋／エレノアの攻撃力%",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06"
  },
  "Annihilation Echo": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "stk": 3,
     "to": "enemy",
     "el": "風"
    }
   ],
   "txt": "エレノアがダメージを与えるたびに、敵の風属性被ダメージ＋（最大3重）。エレノアが戦闘に出ているときだけなので既定は反映しない",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "画面の確認 2026-11-06",
   "off": true
  },
  "Wind Resonance": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "風の印から3秒、エレノアの攻撃力%（既定は反映しない）",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "下書きは全員に付けていたのを、エレノア自身に直した（画面の確認 2026-11-06）",
   "off": true
  },
  "Power Amp": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 10,
     "to": "lux",
     "over": {
      "7": 5.75
     }
    }
   ],
   "txt": "エレノアがダメージを与えるたびに、風属性の全員の風属性ダメージ＋（最大10重）。エレノアが戦闘に出ているときだけなので既定は反映しない",
   "verified": "ゲームの素質の画面（Lv1・Lv6）で確認",
   "note": "以前の計算（data_sup.js）の実測の確認: Lv7=5.75%/重（最大の重複数の実測から逆算・仮置き）（画面の確認 2026-11-06）",
   "off": true
  }
 },
 "Nazuka": {
  "Youth: Dazzling": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "花びら（花びらの詩・18枚）",
     "t": "skill",
     "c": 18,
     "m": 11,
     "tags": [
      "petal"
     ]
    }
   ],
   "txt": "支援スキルのとき、主力の足元に花びら18枚（各11%）。花びらの素質が乗る。どのスキルのLvで伸びるかは未確認なので、前の計算と同じ固定の値（既定は反映しない）",
   "draft": false,
   "off": true
  },
  "Youth: Hunting": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "petal"
     ]
    }
   ],
   "txt": "花びらの風属性ダメージ＋",
   "draft": false
  },
  "Youth: Blooming": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "petal"
     ]
    },
    {
     "k": "W",
     "n": 1,
     "stk": 12
    }
   ],
   "txt": "花びらのダメージ＋／花びら1枚ごとに風属性ダメージ＋（最大12重）",
   "draft": false
  },
  "Youth: Weakness": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "stk": 10,
     "tags": [
      "sea",
      "seaEnd"
     ]
    }
   ],
   "txt": "花びらが当たるごとに、敵の風属性被ダメージ＋（3秒・最大10重）。前の計算と同じく、後から当たる花の海だけに乗せる",
   "draft": false
  },
  "Youth: Annihilation": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "petal"
     ]
    }
   ],
   "txt": "花びらのダメージ＋（ノーマルの敵の即撃破は火力に関係しない）",
   "draft": false
  },
  "Flower Formation: Waves": {
   "done": true,
   "e": [
    {
     "k": "count",
     "hit": "sea",
     "add": 3
    }
   ],
   "txt": "花の海の持続+50%（毎秒のヒットが6回→9回）",
   "draft": false
  },
  "Flower Formation: Turbulent": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "逆波の追撃（味方の風属性が花の海に当てた時・毎秒）",
     "t": "skill",
     "c": 6,
     "m": 182,
     "tags": [
      "sea"
     ]
    }
   ],
   "txt": "自分以外の風属性の味方が花の海の中の敵に当てた時、毎秒 182% の追撃（6回）。どのスキルのLvで伸びるかは未確認なので、前の計算と同じ固定の値（既定は反映しない）",
   "draft": false,
   "off": true
  },
  "Flower Formation: Blast": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "sea"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "花の海の消滅時の追撃",
     "t": "skill",
     "c": 1,
     "n": 1,
     "tags": [
      "seaEnd"
     ]
    }
   ],
   "txt": "花の海の風属性ダメージ＋／花の海の消滅時に追撃（スキル・1回）",
   "draft": false
  },
  "Flower Formation: Convergence": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "sea",
      "seaEnd"
     ]
    }
   ],
   "txt": "花の海のダメージ＋（敵2体以上のときの追加分は未反映。ボス戦は1体）",
   "draft": false
  },
  "Flower Formation: Erosion": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "stk": 10,
     "tags": [
      "sea",
      "seaEnd",
      "petal"
     ]
    }
   ],
   "txt": "花の海が当たるごとに、敵の風属性被ダメージ＋（2秒・最大10重）。前の計算と同じく、ナツカの花の海・花びらだけに乗せる",
   "draft": false,
   "verified": "以前の計算（data_sup.js）の実測の確認: 1重の差=6%（171,663→181,962）"
  },
  "Almighty Leader": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "luxAB"
    }
   ],
   "txt": "風属性のアタッカー・バランサーの全員の風属性ダメージ＋",
   "draft": false,
   "verified": "以前の計算（data_sup.js）の実測の確認: 実測一致（常時・加算）"
  },
  "Wind Demon Seed": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "ナツカの攻撃力%（必殺技の風の印は未反映）",
   "draft": false,
   "verified": "以前の計算（data_sup.js）の実測の確認: 実測一致（攻撃力%に加算）"
  },
  "Self-Improvement": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "over": {
      "8": 125
     },
     "tags": [
      "petal",
      "sea",
      "seaEnd"
     ]
    }
   ],
   "txt": "花の海がある間、ナツカのスキルダメージ＋（花のオーブには乗らない）",
   "draft": false,
   "verified": "以前の計算（data_sup.js）の実測の確認: 実測一致（Lv6+2=125%・花の海がある間・オーブには入らない）"
  },
  "Multi-Hurricane": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "ナツカの必殺技ダメージ＋（竜巻の数の増加は未反映）",
   "draft": false
  },
  "Aeolus's Blessing": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "txt": "必殺技の後18秒、風属性ダメージ＋（既定は反映しない）",
   "draft": false,
   "off": true
  },
  "Maelstrom": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    },
    {
     "k": "taken",
     "n": 1,
     "stk": 8,
     "to": "enemy"
    }
   ],
   "txt": "ナツカの必殺技ダメージ＋／必殺技の竜巻が当たるごとに、敵の風属性被ダメージ＋（18秒・最大8重。風属性の全員の攻撃に乗る）（既定は反映しない）",
   "draft": false,
   "off": true
  }
 },
 "Caramel": {
  "Earcatch Riff": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "stk": 9,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "悪魔のスピーカー（従者の攻撃）だけの攻撃力%（最大9重）",
   "note": "2026-11-10 キャラメル本人の攻撃にもかかっていたのを直した"
  }
 }
};
