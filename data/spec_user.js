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
     "raw": 0.05
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Rippling Radiance": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "微震する流光",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 146
    },
    {
     "k": "taken",
     "raw": 0.04,
     "to": "enemy",
     "stk": 4
    }
   ],
   "txt": ""
  },
  "Rhythmic Bubbles": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "raw": 0.5
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Rainbow Rebound": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "raw": 0.018000000000000002,
     "to": "enemy",
     "stk": 8
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Clustered Foam": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 1,
     "to": "all"
    }
   ],
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
  },
  "Wavering Glow": {
   "done": true,
   "e": [
    {
     "k": "taken",
     "n": 1,
     "to": "enemy",
     "stk": 4
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Foam Echo": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 8
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Touch 'n' Bounce": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 8
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Cumulus Drift": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Singing Shores": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Ocean Wanderer": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
  },
  "Tidal Warning": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
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
   "txt": ""
  },
  "Agony Cascade": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "raw": 0.5
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Deeper into Sin": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "重ね続けた罪",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 120
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Curtain Call": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "終わらぬ余興",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 40
    }
   ],
   "txt": ""
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
     "m": 28
    }
   ],
   "txt": ""
  },
  "Earthshaker": {
   "done": true,
   "e": [],
   "note": "振動波の与えるスキルダメージが32%増加し、とあるのでダメージには影響しているかと。",
   "txt": "振動波の与えるスキルダメージが32%増加し、とあるのでダメージには影響しているかと。"
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
   "txt": "",
   "verified": "確認済み"
  },
  "Hexacalamity: Grief's Toll": {
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
  "Hexacalamity: Tyrant's March": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
  },
  "Hexacalamity: Erosion": {
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
  "Hexacalamity: Death": {
   "done": true,
   "e": [],
   "note": "スキルダメージが上がるけど、火力に影響しない？",
   "txt": "スキルダメージが上がるけど、火力に影響しない？"
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
   "txt": "地属性の味方1体につき、グレイの攻撃力 +（画面の文で確認）",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
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
     "c": 1,
     "edit": true,
     "n": 1
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Quadrifrons' Lore": {
   "done": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Samsara's Judgment": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
  },
  "Piercing Sorrow": {
   "done": true,
   "e": [],
   "txt": "",
   "verified": "確認済み"
  },
  "Slanderous Strike": {
   "done": true,
   "e": [],
   "off": true,
   "txt": ""
  },
  "Everyone's Invited": {
   "done": true,
   "e": [],
   "txt": ""
  },
  "Shared Sensation": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "",
   "verified": "確認済み"
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
   "txt": "",
   "verified": "確認済み"
  },
  "Hunt is On": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "No Safeword": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "note": "ブレイク中のみの効果は別で適用できるようにしておくほうがよい",
   "txt": "ブレイク中のみの効果は別で適用できるようにしておくほうがよい"
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
   "txt": "",
   "verified": "確認済み"
  },
  "Lingering Hunger": {
   "done": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "txt": "",
   "verified": "確認済み"
  },
  "Endless Throes": {
   "done": true,
   "e": [],
   "off": true,
   "note": "追撃が発動、値は155%",
   "txt": "追撃が発動、値は155%"
  }
 }
};
