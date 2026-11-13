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
     "to": "enemy",
     "over": {
      "7": 50,
      "8": 56,
      "9": 63
     }
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
     "perLux": true,
     "over": {
      "7": 17,
      "8": 19,
      "9": 21
     }
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
     "n": 0,
     "over": {
      "8": 211,
      "9": 235
     }
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
     "to": "enemy",
     "over": {
      "7": 75,
      "8": 85,
      "9": 95
     }
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
     "n": 0,
     "over": {
      "7": 172,
      "8": 194,
      "9": 217
     }
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
     "m": 77
    }
   ],
   "note": "60%",
   "txt": "魔盾の間、主力がダメージを与えると波 77%（スキル・支援スキルのLvで伸びる・0.5秒に1回）。回数は仮に10回"
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
     "stk": 5,
     "over": {
      "7": 58,
      "8": 66,
      "9": 73
     }
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
     "n": 0,
     "over": {
      "8": 46.6,
      "9": 51.3
     }
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
     "to": "all",
     "over": {
      "8": 57,
      "9": 64
     }
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
     "n": 0,
     "over": {
      "8": 47,
      "9": 52
     }
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
   "txt": "バブルガンモードの間、バブルフロッグが1秒ごとに周りへ 52.3%（スキル）。ジャンプは3秒ごとなので、ジャンプ1回につき3回として計算。敵の水属性被ダメージ＋（4重）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "微震する流光",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 52.3,
     "perTag": "frogJump",
     "tagMul": 3,
     "tags": [
      "frog"
     ]
    },
    {
     "k": "taken",
     "n": 1,
     "to": "enemy",
     "stk": 4
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
  },
  "Rhythmic Bubbles": {
   "done": true,
   "txt": "メガホンモードの間、バブルフロッグのジャンプの頻度 +100%（着地のダメージ2倍の回数）・バブルフロッグのスキルダメージ +50%",
   "e": [
    {
     "k": "countMul",
     "hit": "frog",
     "mul": 2
    },
    {
     "k": "Bs",
     "n": 1,
     "tags": [
      "frog"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
  },
  "Rainbow Rebound": {
   "done": true,
   "txt": "メガホンモードの間、ジャンプごとにエコーウェーブ（3回まで反響・各14.5%・スキル）。ジャンプ1回につき3回として計算。敵の全属性被ダメージ＋（8重）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "エコーウェーブ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 14.5,
     "perTag": "frogJump",
     "tagMul": 3,
     "tags": [
      "echoWave"
     ]
    },
    {
     "k": "taken",
     "n": 2,
     "to": "all",
     "stk": 8
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
  },
  "Clustered Foam": {
   "done": true,
   "txt": "バブルガンモードの間、バブルガンの射撃ごとに追加ダメージ（スキル）。水属性の味方の、バブルマークの敵への水属性ダメージ＋（付いている前提）",
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "凝りて散らず",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "perTag": "bubbleShot",
     "tags": [
      "bubbleShot"
     ]
    },
    {
     "k": "W",
     "n": 1,
     "to": "lux"
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
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
   "txt": "バブルフロッグが2回ジャンプするごとに広範囲へ追加ダメージ（スキル）。ジャンプの回数÷2 で計算。敵の全属性被ダメージ＋（4重）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "揺らめく浮光",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "perTag": "frogJump",
     "tagDiv": 2
    },
    {
     "k": "taken",
     "n": 1,
     "to": "all",
     "stk": 4
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
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
  },
  "Balmy Surf": {
   "done": true,
   "txt": "水属性の味方1人ごとに、チーム全体の防御貫通 +9〜34（ゲームの画面: Lv6で34。%ではない）",
   "e": [
    {
     "k": "defPen",
     "n": 0,
     "to": "all",
     "perLux": true,
     "over": {
      "7": 35,
      "8": 36,
      "9": 37
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Flying Droplets": {
   "done": true,
   "txt": "メロウ状態でもラウド状態の効果を得る。メロウ状態で10回射撃するごとに水柱（スキル×3・支援スキルのLvで伸びる）。射撃の回数が分からないので1回分（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "水柱（飛び散るしぶき）",
     "t": "skill",
     "c": 3,
     "edit": true,
     "m": 1190,
     "lv": "support",
     "tags": [
      "waterPillar"
     ]
    }
   ],
   "note": "2026-11-14 ゲームの文は 427%〜1088%×3（Lv1〜Lv9の範囲と見られる）。Lv10 1190% は岸を覆う激流の伸び（570÷204）と合う"
  },
  "Flooding Shore": {
   "done": true,
   "txt": "デシベル値が40以上のとき、40消費して回転しながら水柱（スキル×3・支援スキルのLvで伸びる）。1回分（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "水柱（岸を覆う激流）",
     "t": "skill",
     "c": 3,
     "edit": true,
     "m": 570,
     "lv": "support",
     "tags": [
      "waterPillar"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Hovering Gale": {
   "done": true,
   "txt": "スマイルパニッシュの敵に水属性の印を発動させたとき、印ダメージ（1.5秒に1回まで・1回分）。スマイルパニッシュ1つごとに、この印ダメージ＋（数は入力・既定1。ゲームでは発動させた巡遊者の攻撃力で計算されるが、ここではウィローの攻撃力で計算）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "低徊する海風",
     "t": "mark",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "hovering"
     ]
    },
    {
     "k": "mult",
     "n": 1,
     "tags": [
      "hovering"
     ],
     "stk": 12,
     "stk0": 1,
     "over": {
      "8": 10.9,
      "9": 12.2
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Words Unchanged": {
   "done": true,
   "txt": "支援スキルの飛び込みもスマイルパニッシュを付与。上限が7〜12に。スマイルパニッシュ1つごとに敵の水属性被ダメージ＋（数は入力・既定1）",
   "e": [
    {
     "k": "taken",
     "n": 1,
     "to": "enemy",
     "stk": 12,
     "stk0": 1
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Eternal Tide": {
   "done": true,
   "txt": "メロウ状態の間、チーム全体の水属性ダメージ＋（メロウ状態の前提）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "all"
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Rhythm Surge": {
   "done": true,
   "txt": "デシベル値が100に達すると14秒間、チーム全体の会心率 +10%",
   "e": [
    {
     "k": "critRate",
     "raw": 0.1,
     "to": "all"
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Thunderous Surf": {
   "done": true,
   "txt": "ラウド状態の間、追従バブルがソニックウェーブになりダメージ倍率 +50%。当たった敵の水属性被ダメージ +1.1%（16重）",
   "e": [
    {
     "k": "mult",
     "raw": 0.5,
     "tags": [
      "followBubble"
     ]
    },
    {
     "k": "taken",
     "raw": 0.011,
     "to": "enemy",
     "stk": 16
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
  },
  "Prismatic Bubbles": {
   "done": true,
   "txt": "8回射撃するごとにブルーバブル（スキル・1回分）。9秒間チーム全体の会心率＋。50%でレッドバブルになり、主力の攻撃力＋（期待値）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "ブルーバブル",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "over": {
      "7": 187,
      "8": 211,
      "9": 236
     }
    },
    {
     "k": "critRate",
     "n": 1,
     "to": "all",
     "over": {
      "7": 21,
      "8": 22,
      "9": 23
     }
    },
    {
     "k": "atkPct",
     "n": 2,
     "to": "main",
     "prob": 0.5
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Engulfing Tide": {
   "done": true,
   "txt": "主力がバブルエリアの中にいるとき、主力の水属性ダメージ＋（中にいる前提）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "main",
     "over": {
      "7": 81,
      "8": 92,
      "9": 102
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Receding Echoes": {
   "done": true,
   "txt": "デシベル値を消費するたびに9秒間、チーム全体の会心ダメージ＋（16重）",
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "to": "all",
     "stk": 16,
     "over": {
      "8": 3.1,
      "9": 3.5
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
  },
  "Prismatic Barrier": {
   "done": true,
   "txt": "主力にシールド（火力に入れない）",
   "e": [],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ）"
  },
  "Tender Seas": {
   "done": true,
   "txt": "ウィローがフィールドにいるとき、チーム全体の攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "over": {
      "7": 48,
      "8": 54,
      "9": 60
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値に合わせた（Lv7〜9も）"
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
   "done": true,
   "txt": "通常攻撃のあと5秒、通常攻撃ダメージ＋・必殺技ダメージ＋（10重）",
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
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ripple of Shadow": {
   "done": true,
   "txt": "催涙雨の前進で轟撃10回（スキル・支援スキルのLvで伸びる）。2回当たる確率は1%から1回ごとに+5%（10回の平均23.5%を期待値で入れる）。催涙雨・轟撃の防御貫通 +100。スキルダメージ +13%",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "轟撃（瞑き浮き波）",
     "t": "skill",
     "c": 10,
     "edit": true,
     "m": 82,
     "lv": "support",
     "tags": [
      "bombard"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "轟撃の2回目（確率）",
     "t": "skill",
     "c": 10,
     "edit": true,
     "m": 82,
     "lv": "support",
     "prob": 0.235,
     "tags": [
      "bombard"
     ]
    },
    {
     "k": "defPen",
     "raw": 100,
     "flat": true,
     "tags": [
      "tearRain",
      "bombard"
     ]
    },
    {
     "k": "Bs",
     "raw": 0.13
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Evening Rain": {
   "done": true,
   "txt": "全員が闇属性のとき、催涙雨がもう1つ（スキル・支援スキルのLvで伸びる。1回分）。闇属性の印か暗鎖の付いた敵に、催涙雨・轟撃の防御貫通 +100（付いている前提）。スキルダメージ +13%",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "催涙雨（衣濡らす暮雨）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 328,
     "lv": "support",
     "cond": "allLux",
     "tags": [
      "tearRain"
     ]
    },
    {
     "k": "defPen",
     "raw": 100,
     "flat": true,
     "tags": [
      "tearRain",
      "bombard"
     ]
    },
    {
     "k": "Bs",
     "raw": 0.13
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Devouring Shadow": {
   "done": true,
   "txt": "闇属性が3人のとき、闇属性の全員に 闇属性ダメージ＋・防御貫通＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "lux",
     "cond": "allLux"
    },
    {
     "k": "defPen",
     "n": 1,
     "to": "lux",
     "cond": "allLux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Subtle Tremor": {
   "done": true,
   "txt": "主力スキルの射撃で天誅を3回（必殺技ダメージ・主力スキルのLvで伸びる）。必殺技のクールタイム短縮・SPは火力に入れない",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "天誅（徒花）",
     "t": "ult",
     "c": 3,
     "edit": true,
     "m": 61.5,
     "lv": "main",
     "tags": [
      "doomfall"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Hymn of Gloom": {
   "done": true,
   "txt": "主力スキルの移動後にシールド（5秒）。シールドの間、1秒ごとに天誅（必殺技ダメージ・主力スキルのLvで伸びる）。5秒で5回として計算（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "天誅（陰翳礼賛）",
     "t": "ult",
     "c": 5,
     "edit": true,
     "m": 61.5,
     "lv": "main",
     "tags": [
      "doomfall"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Umbral Depth": {
   "done": true,
   "txt": "通常攻撃が5回当たるごとに天誅（必殺技ダメージ。2秒に1回まで）。通常攻撃の当たる回数÷5 で計算",
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "天誅（仄かな闇）",
     "t": "ult",
     "c": 1,
     "edit": true,
     "n": 0,
     "perTag": "basic",
     "tagDiv": 5,
     "tags": [
      "doomfall"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Shadow Soulknell": {
   "done": true,
   "txt": "主力スキルのあと8秒、闇属性ダメージ＋（攻撃速度は火力に入れない）",
   "e": [
    {
     "k": "W",
     "n": 1,
     "over": {
      "7": 41,
      "8": 46,
      "9": 51
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Solemn Echo": {
   "done": true,
   "txt": "主力スキルの弾丸が2回多く反射する（射撃が2回多く当たる）",
   "e": [
    {
     "k": "count",
     "hit": "mShot",
     "add": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Petal-Shower Grace": {
   "done": true,
   "txt": "主力スキルの弾丸の爆発で小さい弾丸8発（スキル・主力スキルのLvで伸びる）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "散華の小さい弾丸",
     "t": "skill",
     "c": 8,
     "edit": true,
     "m": 34.7,
     "lv": "main",
     "tags": [
      "sange"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Twilight Gleam": {
   "done": true,
   "txt": "主力スキルの使用回数+1（回数は入力）。主力スキルのあと5秒、闇属性ダメージ＋（2重）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 2,
     "over": {
      "7": 35,
      "8": 39,
      "9": 44
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Duskfall": {
   "done": true,
   "txt": "暗鎖の付いた敵への主力スキルのダメージ＋（暗鎖が付いている前提）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "main"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Fading Candle Flame": {
   "done": true,
   "txt": "主力スキルの移動中は無敵（火力に入れない）。攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Shadow Blossom": {
   "done": true,
   "txt": "闇属性の印を発動させたあと4秒、闇属性ダメージ＋（2重）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 2,
     "over": {
      "7": 35,
      "8": 39,
      "9": 44
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Bewitching Phantom": {
   "done": true,
   "txt": "回避+1。回避のあと4秒、攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Night Tide Rush": {
   "done": true,
   "txt": "必殺技で闇属性の印を発動できる（印のダメージは入れない）。攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Blossom-Eroded Abyss": {
   "done": true,
   "txt": "花の傘が敵を引き寄せる（火力に入れない）。闇属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "over": {
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ultimate Darkness": {
   "done": true,
   "txt": "暗鎖の付いた敵への必殺技（花の傘）のダメージ＋（暗鎖が付いている前提。天誅には入れない）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "tags": [
      "parasol"
     ],
     "over": {
      "7": 147,
      "8": 166,
      "9": 185
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Moonlit Edge": {
   "done": true,
   "txt": "必殺技のあと30秒、攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Lonely Twin Shadows": {
   "done": true,
   "txt": "狐火が11秒に（0.5秒ごとなので22回）。必殺技ダメージ +32.2%・必殺技の会心率 +5%（クールタイム短縮・SPは火力に入れない）",
   "e": [
    {
     "k": "count",
     "hit": "sFox",
     "add": 10
    },
    {
     "k": "Bu",
     "raw": 0.322
    },
    {
     "k": "critRate",
     "raw": 0.05,
     "ht": "ult"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Night-Walker": {
   "done": true,
   "txt": "闇属性の主力が狐火の敵に当てると天誅（必殺技ダメージ・支援スキルのLvで伸びる。1秒に1回まで）。狐火の6秒間に1秒1回として6回（回数は入力）。必殺技ダメージ +14%・必殺技の会心率 +10%",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "天誅（暗夜行路）",
     "t": "ult",
     "c": 6,
     "edit": true,
     "m": 306,
     "lv": "support",
     "tags": [
      "doomfall"
     ]
    },
    {
     "k": "Bu",
     "raw": 0.14
    },
    {
     "k": "critRate",
     "raw": 0.1,
     "ht": "ult"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Solitary Lantern": {
   "done": true,
   "txt": "必殺技ダメージを与えたとき80%の確率で射撃3回（必殺技ダメージ。2秒に1回まで。必殺技1回につき1回として期待値）。必殺技の会心率＋",
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "射撃（揺るる狐灯）",
     "t": "ult",
     "c": 3,
     "edit": true,
     "n": 0,
     "prob": 0.8,
     "over": {
      "8": 317,
      "9": 354
     }
    },
    {
     "k": "critRate",
     "n": 1,
     "ht": "ult",
     "over": {
      "7": 30,
      "8": 30,
      "9": 30
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Without A Trace": {
   "done": true,
   "txt": "支援スキルのクールタイム中、必殺技ダメージ＋（クールタイム中の前提）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "8": 198,
      "9": 221
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Hollow Steps": {
   "done": true,
   "txt": "闇属性の味方が主力スキル・支援スキルを使ったあと6.5秒、必殺技の会心率＋・会心ダメージ＋（5重）",
   "e": [
    {
     "k": "critRate",
     "n": 0,
     "ht": "ult",
     "stk": 5,
     "over": {
      "7": 3.2,
      "8": 3.4,
      "9": 3.6
     }
    },
    {
     "k": "critDmg",
     "n": 1,
     "ht": "ult",
     "stk": 5
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Rain-Woven Sorrow": {
   "done": true,
   "txt": "催涙雨が遅くなる（当たる回数の増え方は不明なので入れない）。催涙雨・轟撃のスキルダメージ＋",
   "e": [
    {
     "k": "Bs",
     "n": 1,
     "tags": [
      "tearRain",
      "bombard"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Inevitable End": {
   "done": true,
   "txt": "催涙雨・轟撃のエリート以上の敵への闇属性ダメージ＋（ボスはエリート以上）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "tearRain",
      "bombard"
     ],
     "over": {
      "7": 64,
      "8": 72,
      "9": 80
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Bone-Chilling Rain": {
   "done": true,
   "txt": "催涙雨・轟撃が当たったあと4秒、敵の闇属性被ダメージ＋（20重）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "stk": 20
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Murmur of Annihilation": {
   "done": true,
   "txt": "闇属性の人数×（闇属性の全員の闇属性ダメージ＋）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "perLux": true,
     "to": "lux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Silent Knell": {
   "done": true,
   "txt": "必殺技で闇属性の印：暗影を付与できる（印のダメージは入れない）。攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
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
     ],
     "over": {
      "9": 215
     }
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
     "n": 0,
     "over": {
      "7": 57,
      "8": 64,
      "9": 72
     }
    },
    {
     "k": "W",
     "n": 1,
     "tags": [
      "s15"
     ],
     "over": {
      "7": 153,
      "8": 156,
      "9": 160
     }
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
     ],
     "over": {
      "7": 33.5,
      "8": 34.4,
      "9": 35.3
     }
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
     "n": 0,
     "over": {
      "8": 159,
      "9": 177
     }
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
     "n": 0,
     "over": {
      "9": 70
     }
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
     "n": 0,
     "over": {
      "7": 49,
      "8": 56,
      "9": 62
     }
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
     "n": 0,
     "over": {
      "8": 31,
      "9": 35
     }
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
     "n": 0,
     "over": {
      "8": 127,
      "9": 142
     }
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
     "n": 0,
     "over": {
      "7": 335,
      "8": 379,
      "9": 422
     }
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
     "ht": "skill",
     "over": {
      "8": 218,
      "9": 243
     }
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
     ],
     "over": {
      "8": 179,
      "9": 200
     }
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
     "n": 0,
     "over": {
      "7": 217,
      "8": 245,
      "9": 274
     }
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
     ],
     "over": {
      "7": 29,
      "8": 33,
      "9": 37
     }
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
     ],
     "over": {
      "8": 55,
      "9": 61
     }
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
     "n": 0,
     "over": {
      "7": 56.7,
      "8": 59.4,
      "9": 62.1
     }
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
     "n": 0,
     "over": {
      "7": 63,
      "8": 66,
      "9": 69
     }
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
     "stk": 3,
     "over": {
      "7": 19.6,
      "8": 20.6,
      "9": 21.5
     }
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
     "stk": 5,
     "over": {
      "7": 12.6,
      "8": 13.2,
      "9": 13.8
     }
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
     "n": 0,
     "over": {
      "7": 50.4,
      "8": 52.8,
      "9": 55.2
     }
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
     "n": 0,
     "over": {
      "7": 32.8,
      "8": 34.3,
      "9": 35.9
     }
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
     "n": 0,
     "over": {
      "7": 67.2,
      "8": 70.4,
      "9": 73.6
     }
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
     "n": 0,
     "over": {
      "7": 42,
      "8": 44,
      "9": 46
     }
    },
    {
     "k": "Bu",
     "n": 1,
     "stk": 5,
     "over": {
      "7": 10,
      "8": 10.5,
      "9": 10.9
     }
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
     "n": 0,
     "over": {
      "7": 50.4,
      "8": 52.8,
      "9": 55.2
     }
    },
    {
     "k": "Bu",
     "n": 1,
     "stk": 5,
     "over": {
      "7": 6.7,
      "8": 7,
      "9": 7.4
     }
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
     ],
     "over": {
      "8": 48,
      "9": 54
     }
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
     ],
     "over": {
      "7": 4.2,
      "8": 4.4,
      "9": 4.6
     }
    },
    {
     "k": "critDmg",
     "n": 1,
     "stk": 15,
     "ht": "skill",
     "to": "main",
     "cond": "mainSame",
     "over": {
      "7": 5.3,
      "8": 5.5,
      "9": 5.8
     }
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
     ],
     "over": {
      "7": 19.8,
      "8": 20.7,
      "9": 21.6
     }
    },
    {
     "k": "W",
     "n": 1,
     "tags": [
      "jump"
     ],
     "over": {
      "7": 84,
      "8": 88,
      "9": 92
     }
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
     ],
     "over": {
      "7": 44.1,
      "8": 46.2,
      "9": 48.3
     }
    },
    {
     "k": "Bb",
     "n": 1,
     "to": "main",
     "cond": "mainSame",
     "over": {
      "7": 63,
      "8": 66,
      "9": 69
     }
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
     ],
     "over": {
      "7": 37.8,
      "8": 39.6,
      "9": 41.4
     }
    },
    {
     "k": "atkPct",
     "n": 1,
     "over": {
      "7": 75.6,
      "8": 79.2,
      "9": 82.8
     }
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
     "el": "風",
     "over": {
      "9": 29.1
     }
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
     "n": 0,
     "over": {
      "7": 84,
      "8": 88,
      "9": 92
     }
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
      "7": 5.5,
      "8": 5.7,
      "9": 6
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
     ],
     "over": {
      "7": 28,
      "8": 32,
      "9": 36
     }
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
     ],
     "over": {
      "8": 101,
      "9": 113
     }
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
     ],
     "over": {
      "7": 133,
      "8": 150,
      "9": 167
     }
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
     ],
     "over": {
      "7": 484,
      "8": 547,
      "9": 610
     }
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
     ],
     "over": {
      "7": 68,
      "8": 77,
      "9": 86
     }
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
      "8": 125,
      "9": 139
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
     "n": 0,
     "over": {
      "7": 28,
      "8": 32,
      "9": 36
     }
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
     "n": 0,
     "over": {
      "7": 102,
      "8": 115,
      "9": 129
     }
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
     "n": 0,
     "over": {
      "9": 46
     }
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
  },
  "Blooming Gale": {
   "done": true,
   "txt": "主力スキル中、移動速度・攻撃範囲 +40%／主力スキルのダメージ間隔 -50%（同じ時間でヒットが2倍）",
   "e": [
    {
     "k": "countMul",
     "hit": "mWind",
     "mul": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Everlasting Elegance": {
   "done": true,
   "txt": "主力スキルの持続時間 +100%（ヒットが2倍）。中断されたときのクールタイム短縮は火力に入れない",
   "e": [
    {
     "k": "countMul",
     "hit": "mWind",
     "mul": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Unyielding Leaves": {
   "done": true,
   "txt": "主力スキル中、1秒ごとにナツカのスキルダメージ＋（スキル終了でリセット）。上限が書かれていないので、重ねる数は入力（既定1、入力は20まで）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 20,
     "over": {
      "7": 41,
      "8": 46,
      "9": 51
     },
     "stk0": 1
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Wind Erosion Impact": {
   "done": true,
   "txt": "主力スキルの風属性ダメージ＋／8秒間、当たった敵の風属性被ダメージ＋（10重）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "grp": "main"
    },
    {
     "k": "taken",
     "n": 1,
     "to": "enemy",
     "stk": 10
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Gale Shield": {
   "done": true,
   "txt": "主力スキル中、防御力＋／攻撃を受けたとき反撃（1秒に1回）。攻撃を受ける前提なので既定は反映しない",
   "off": true,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "反撃（風刃の加護）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "tags": [
      "counter"
     ],
     "over": {
      "7": 140,
      "8": 158,
      "9": 176
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Fierce Arrow": {
   "done": true,
   "txt": "主力スキルの終わりに突風（スキル・主力スキルのLvで伸びる）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "突風",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 383,
     "tags": [
      "gust"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Spiral Vortex": {
   "done": true,
   "txt": "主力スキルのあと2秒間、追加で16回（スキル・主力スキルのLvで伸びる）／6秒間、敵の風属性被ダメージ +1.5%（10重）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "旋風",
     "t": "skill",
     "c": 16,
     "edit": true,
     "m": 13.9,
     "tags": [
      "vortex"
     ]
    },
    {
     "k": "taken",
     "raw": 0.015,
     "to": "enemy",
     "stk": 10
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Whisper of Wind": {
   "done": true,
   "txt": "主力スキルの風が止んだあと2秒間、攻撃力＋。2秒だけなので既定は反映しない（入れると全部の攻撃に乗る）",
   "off": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Gale's Might": {
   "done": true,
   "txt": "主力スキルのあと10秒間、攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Storm Overturned": {
   "done": true,
   "txt": "ナツカの攻撃力＋／主力スキルの範囲に敵が2体以上のとき、スキルダメージ＋（ボス1体を想定して、こちらは入れない）",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Precision Control": {
   "done": true,
   "txt": "ナツカの風属性ダメージ＋／必殺技で風属性の印を発動できる",
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Willowy Grace": {
   "done": true,
   "txt": "回避の回数+1／回避のあと6秒間、ナツカの攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "7": 36,
      "8": 41,
      "9": 45
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Gale Fading": {
   "done": true,
   "txt": "通常攻撃が当たると30%の確率で、6秒間、敵の風属性被ダメージ＋（付いている前提）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
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
  },
  "Echo Stack": {
   "done": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "悪魔のスピーカー（従者の攻撃）のダメージ＋（スキルダメージの足し算に入れる。近くにいる条件は満たしている扱い）",
   "note": "2026-11-10 どのダメージの枠に入るかは未確認"
  },
  "Fallen Duet": {
   "done": true,
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "漆黒のデュオ（従者）",
     "t": "skill",
     "c": 13,
     "n": 0,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "必殺技のとき、悪魔のスピーカーが 28〜75%×13 の従者ダメージ",
   "note": "2026-11-10 従者ダメージなので種類はスキル扱い（主力スキルのスピーカーと同じ）。未確認"
  },
  "Baseline Finale": {
   "done": true,
   "txt": "悪魔のスピーカーの近くで、通常攻撃の最終撃が範囲攻撃に（通常攻撃ダメージ・通常攻撃のLvで伸びる）。最終撃は通常攻撃1周に1回として計算（人気が要るので、回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "最終撃（ソロパート終了）",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 44.4,
     "lv": "basic"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成。Lv10の値 44.4% は、確認のLv6の値 32.8% と英語WikiのLv1の値 19.3% に、通常攻撃の伸びを合わせたもの"
  },
  "Cheer Sparkle": {
   "done": true,
   "txt": "通常攻撃ダメージ +10%。通常攻撃が人気を1消費して最終撃を出せるようになる（最終撃のダメージはソロパート終了で入れる）",
   "e": [
    {
     "k": "Bb",
     "raw": 0.1
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  }
 },
 "Ann": {
  "Wind Surge": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "stk": 2,
     "tags": [
      "minion"
     ]
    },
    {
     "k": "atkPct",
     "n": 0,
     "stk": 2,
     "to": "others"
    }
   ],
   "txt": "ポポ（従者の攻撃）と、自分以外の味方の攻撃力%（最大2重）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）。スキルを使った1人にかかる効果だが、支援の2人とも交互に使う前提で両方に入れた"
  },
  "Grand Debut": {
   "done": true,
   "e": [
    {
     "k": "mark",
     "raw": 0.316,
     "to": "others"
    }
   ],
   "txt": "自分以外の味方の印ダメージ＋31.6%（ポポの追加レーザーは未反映）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  }
 },
 "Donna": {
  "Bubble Finale": {
   "done": true,
   "txt": "呼び込みトーナちゃんが消えるとき爆発、さらにプールが4秒間0.5秒ごと（8回）（どちらも従者ダメージ・主力スキルのLvで伸びる）。トーナちゃんが攻撃するたびに従者ダメージ +3.5%（7重）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "消えるときの爆発（呼び込み効果）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 35.1,
     "lv": "main",
     "tags": [
      "minion"
     ]
    },
    {
     "k": "extra",
     "group": "main",
     "name": "プール（呼び込み効果）",
     "t": "skill",
     "c": 8,
     "edit": true,
     "m": 39.3,
     "lv": "main",
     "tags": [
      "minion"
     ]
    },
    {
     "k": "Bs",
     "raw": 0.035,
     "stk": 7,
     "tags": [
      "minion"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Unleashed Arrow": {
   "done": true,
   "txt": "支援スキルを使うたびに、トーナ以外の水属性の味方1人につき1本、スプラッシュアローを追加で撃つ（スキル・支援スキルのLvで伸びる）。射撃1回ごとではなく支援スキル1回につき1本として計算（ゲームのダメージ統計の割合で確かめた・2026-11-13）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "追加のスプラッシュアロー",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 230,
     "perLuxOther": true,
     "tags": [
      "arrow"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Arrowfall Reckoning": {
   "done": true,
   "txt": "スプラッシュアローが当たると矢尾が残る（最大30本）。矢尾が残っている敵に矢が当たると追加ダメージ（2本目から）。支援スキルの終わりに矢尾を引き抜いてダメージ、矢尾1本につき+10%（どちらもスキル・支援スキルのLvで伸びる）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "矢尾への追加ダメージ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 87,
     "perTag": "arrow",
     "tagAdd": -1,
     "tags": [
      "tail"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "矢尾の引き抜き",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 609,
     "tagBonus": {
      "tag": "arrow",
      "r": 0.1,
      "cap": 30
     },
     "tags": [
      "pullOut"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Arrow Pursuit": {
   "done": true,
   "txt": "スプラッシュアローのスキルダメージ＋／矢が3回当たるたびに追加ダメージ1回（0.2秒に1回まで）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "arrow"
     ],
     "over": {
      "7": 91,
      "8": 102,
      "9": 114
     }
    },
    {
     "k": "extra",
     "group": "support",
     "name": "追い打ち",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "perTag": "arrow",
     "tagDiv": 3,
     "tags": [
      "pursuit"
     ],
     "over": {
      "7": 382,
      "8": 432,
      "9": 482
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Frostbitten Arrow": {
   "done": true,
   "txt": "スプラッシュアローが3回当たるたびに、6秒間、敵の水属性被ダメージ＋（9重）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "stk": 9
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Dead Shot": {
   "done": true,
   "txt": "HP30%未満のノーマル敵を即撃破／HP30%未満のエリート以上の敵に、スプラッシュアローのスキルダメージ＋（HPの条件があるので既定は反映しない）",
   "off": true,
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "arrow"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Wave-Chasing String": {
   "done": true,
   "txt": "カスケードルートの範囲+50%・スキルダメージ +16%／全員が水のとき、3回射撃するごとにカスケードルートを1つ（9回の射撃で3つ増える）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.16,
     "tags": [
      "cascade"
     ]
    },
    {
     "k": "count",
     "hit": "sCascade",
     "add": 3,
     "cond": "allLux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Stray Arrow": {
   "done": true,
   "txt": "カスケードルート1つにつき、トラッキングウェーブ3つ（スキル・支援スキルのLvで伸びる）。違う敵に当たるたびの+40%は、ボス1体を想定して入れない",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "トラッキングウェーブ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 235,
     "perTag": "cascade",
     "tagMul": 3,
     "tags": [
      "track"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Chilling Onslaught": {
   "done": true,
   "txt": "支援スキルの最初の射撃でもカスケードルートを出す（1つ増える）／カスケードルートのダメージ＋",
   "e": [
    {
     "k": "count",
     "hit": "sCascade",
     "add": 1
    },
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "cascade"
     ],
     "over": {
      "7": 167,
      "8": 189,
      "9": 211
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Coast Crusher": {
   "done": true,
   "txt": "カスケードルートの会心率 +10%・スキルダメージ＋／カスケードルートの会心で、7秒間、水属性の味方の攻撃力＋（4重）",
   "e": [
    {
     "k": "critRate",
     "raw": 0.1,
     "tags": [
      "cascade"
     ]
    },
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "cascade"
     ]
    },
    {
     "k": "atkPct",
     "n": 1,
     "to": "lux",
     "stk": 4
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Aquatic Assault": {
   "done": true,
   "txt": "カスケードルートが違う敵に当たるたびに、10秒間、自身の水属性ダメージ＋（最大3重。ボス1体なら1重なので、既定は1重）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 3,
     "stk0": 1
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Water Ripple": {
   "done": true,
   "txt": "水属性の味方の攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Messenger Arrow": {
   "done": true,
   "txt": "支援スキルで水属性の主力の近くに手紙。拾うと12秒間、主力の水属性ダメージ＋（主力が水のとき）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Wave Resonance": {
   "done": true,
   "txt": "必殺技で水属性の印：水流を付与／必殺技中に味方が水流を発動するたびに、40秒間、トーナの水属性ダメージ＋（3重）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 3,
     "over": {
      "7": 42,
      "8": 48,
      "9": 53
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Rushing Tide": {
   "done": true,
   "txt": "必殺技の範囲+50%／トーナの必殺技ダメージ＋",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 113,
      "8": 128,
      "9": 143
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Corrosive Torrent": {
   "done": true,
   "txt": "必殺技の範囲内にいる水属性の味方の攻撃力＋（全員が範囲内にいる前提）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Freezing Stasis": {
   "done": true,
   "txt": "必殺技が凍結・寒冷の敵に当たるたびに、持続+1秒・必殺技ダメージ＋（5重）。寒冷は水属性の印で付くので既定で入れる。1発ずつ重なるので、既定は平均に近い4重（5重まで入力できる）。延びた5秒ぶん（+10回）も入る。空壺ノ王の実測（寒冷あり）: 1発ごとに+44%（Lv3）、全部で23発（2026-11-14）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "stk": 5,
     "over": {
      "7": 91,
      "8": 103,
      "9": 115
     },
     "stk0": 4
    },
    {
     "k": "count",
     "hit": "uRain",
     "add": 10
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Condensation Orbs": {
   "done": true,
   "txt": "速達状態で通常攻撃が10回当たるごとに水滴（上限7つ）。速達状態のあと、次の通常攻撃で全部発射（各スキルダメージ・主力スキルのLvで伸びる）。上限の7つとして計算（回数は入力）。呼び込みトーナちゃんが消えると速達状態+3秒",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "水滴（石穿つ雨垂れ）",
     "t": "skill",
     "c": 7,
     "edit": true,
     "m": 142,
     "lv": "main"
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Azure Night": {
   "done": true,
   "txt": "速達状態の通常攻撃ごとにアイススパイク4本（各スキルダメージ・主力スキルのLvで伸びる）",
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "アイススパイク（速達サービス）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 12.8,
     "lv": "main",
     "perTag": "agile",
     "tagMul": 4
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Rime Shatterer": {
   "done": true,
   "txt": "速達状態で、HP35%未満のエリート・狩猟の敵へのスキルダメージ＋（HPの条件があるので既定でオフ）",
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）",
   "off": true
  },
  "Tidal Echo": {
   "done": true,
   "txt": "速達状態の通常攻撃が当たったあと4秒、敵の水属性被ダメージ＋（25重）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "stk": 25
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Piercing Arrow Rain": {
   "done": true,
   "txt": "速達状態で、水流か寒冷の敵に通常攻撃が当たったあと2秒、攻撃力＋（36重。付いている前提）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 36
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Precision Marketing": {
   "done": true,
   "txt": "呼び込みトーナちゃんの近くの敵に通常攻撃が当たるたび、トーナちゃんが波（従者ダメージ・主力スキルのLvで伸びる）。速達状態の通常攻撃1回につき1回として計算",
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "波（狙い撃ちセールス）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 320.2,
     "lv": "main",
     "perTag": "agile",
     "tags": [
      "minion"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Hazy Curtain": {
   "done": true,
   "txt": "呼び込みトーナちゃんにシールド（8秒）。シールドが消えるとき周りに従者ダメージ（1回）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "シールドの爆発（トーナちゃんガード）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "tags": [
      "minion"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Surging Tide": {
   "done": true,
   "txt": "呼び込みトーナちゃんの範囲+50%・従者ダメージ＋",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "minion"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Cloud Piercer": {
   "done": true,
   "txt": "トーナかトーナちゃんの攻撃が当たると、12秒間 トーナちゃんの従者ダメージ＋（4重・2秒に1回）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 4,
     "tags": [
      "minion"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Serene Sea Trance": {
   "done": true,
   "txt": "1秒立ち止まると攻撃力＋（通常攻撃は立ち止まって撃つので、立ち止まっている前提）",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Tidal Mark Resonance": {
   "done": true,
   "txt": "必殺技で水属性の印を発動できる（印のダメージは入れない）。発動後30秒、自分とトーナちゃんの水属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Lingering Noise": {
   "done": true,
   "txt": "主力スキルのあと15秒、水属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  }
 },
 "Mistique": {
  "Spotlight Craving": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "かぼちゃおばけ（従者の攻撃）だけの攻撃力%（周囲にいる条件は満たしている扱い）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  }
 },
 "Chixia": {
  "Crimson Dragon: Convergence": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "raw": 0.43,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "赤龍（従者の攻撃）だけの攻撃力＋43%（追加の召喚は未反映）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  },
  "Crimson Dragon: Chant": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "raw": 0.35,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "従者が2体以上のとき、従者の攻撃だけの攻撃力＋35%",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  },
  "Sigil Unleashed: Tiger of the East": {
   "done": true,
   "e": [
    {
     "k": "atkPctHit",
     "raw": 0.5,
     "tags": [
      "minion"
     ]
    }
   ],
   "txt": "猛虎（従者の攻撃）だけの攻撃力＋50%（猛虎の攻撃そのものは未反映）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  },
  "Ink Sigil: Horn Call": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 3,
     "to": "all"
    }
   ],
   "txt": "従者1体ごとに味方全員の攻撃力%（重ね数＝従者の数。既定は支援スキルの上限の3体）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  },
  "Ink Sigil: Ambush": {
   "done": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "従者がダメージを与えた敵の近くにいる味方全員の攻撃力%",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  }
 },
 "Snowish Laru": {
  "Fiery Rainbow": {
   "done": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 3,
     "tags": [
      "minion"
     ],
     "over": {
      "7": 59,
      "8": 67,
      "9": 74
     }
    }
   ],
   "txt": "おもちゃ1体ごとに、従者の攻撃だけの火属性ダメージ%（最大3重）",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  },
  "Investiture Ceremony": {
   "done": true,
   "txt": "おもちゃが4秒ごとに特殊攻撃。クルミ大佐 56.7%、巻き毛将軍 123%×6（支援スキルLv11の画面。支援スキルのLvで伸びるとして計算）、巻き毛将軍は6秒間 従者会心率 +50%。いる時間が書かれていないので1回ずつ（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "切り札ドール（クルミ大佐）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 54.71,
     "lv": "support",
     "tags": [
      "minion",
      "kurumi"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "切り札ドール（巻き毛将軍）",
     "t": "skill",
     "c": 6,
     "edit": true,
     "m": 118.69,
     "lv": "support",
     "tags": [
      "minion",
      "general"
     ]
    },
    {
     "k": "critRate",
     "raw": 0.5,
     "tags": [
      "general"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Heart's Edict": {
   "done": true,
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "tags": [
      "minion"
     ],
     "over": {
      "7": 148,
      "8": 167,
      "9": 187
     }
    }
   ],
   "txt": "クルミ大佐・巻き毛将軍（従者の攻撃）だけの会心ダメージ%",
   "note": "2026-11-10 従者の点検で直した（下書きは本人にかけていた）"
  },
  "Solemn Look": {
   "done": true,
   "txt": "おもちゃを強化。連携作戦がクルミ大佐 686%・巻き毛将軍 278%×6 に（スキル・主力スキルのLvで伸びる）。ゼンマイ女王の射撃は女王のお出まし（未確認）が要るので入れていない",
   "e": [
    {
     "k": "drop",
     "hit": "mKurumi"
    },
    {
     "k": "drop",
     "hit": "mGeneral"
    },
    {
     "k": "extra",
     "group": "main",
     "name": "クルミ大佐の連携作戦（強化）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 686,
     "tags": [
      "minion",
      "kurumi",
      "coop"
     ]
    },
    {
     "k": "extra",
     "group": "main",
     "name": "巻き毛将軍の連携作戦（強化）",
     "t": "skill",
     "c": 6,
     "edit": true,
     "m": 278,
     "tags": [
      "minion",
      "general",
      "coop"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Starchain Blade": {
   "done": true,
   "txt": "巻き毛将軍が1秒ごとに周りの敵へ従者ダメージ（いる時間が書かれていないので、主力スキル1回につき1回ぶん。回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "将軍の秘策",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "minion",
      "general"
     ],
     "over": {
      "7": 416,
      "8": 470,
      "9": 524
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Burning Whip": {
   "done": true,
   "txt": "おもちゃが火属性の印の付いた敵に当てると、30%で士気+1・8秒間 従者ダメージ＋（当たる回数が多いので付いている前提。従者のスキルダメージとして計算）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "minion"
     ],
     "over": {
      "7": 65,
      "8": 74,
      "9": 82
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Whipping Gale": {
   "done": true,
   "txt": "ウィップコマンドが多段攻撃に（257%×5。スキル・主力スキルのLvで伸びる）",
   "e": [
    {
     "k": "drop",
     "hit": "mWhip"
    },
    {
     "k": "extra",
     "group": "main",
     "name": "ウィップコマンド（多段）",
     "t": "skill",
     "c": 5,
     "edit": true,
     "m": 257,
     "tags": [
      "main",
      "whip"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Crossing Welts": {
   "done": true,
   "txt": "おもちゃが当てると10秒間ギフトマーク。ウィップコマンド・キャンディ乱射がマークの敵に当たると追加ダメージ（スキル・主力スキルのLvで伸びる。それぞれ1回の発動につき1回として計算）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "ギフトマーク（ウィップコマンド）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 551,
     "tags": [
      "giftMark"
     ]
    },
    {
     "k": "extra",
     "group": "ult",
     "name": "ギフトマーク（キャンディ乱射）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 551,
     "tags": [
      "giftMark"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Wild Whip Waltz": {
   "done": true,
   "txt": "ウィップコマンドの範囲+20%／ウィップコマンドとキャンディ乱射の火属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "whip",
      "candy"
     ],
     "over": {
      "7": 150,
      "8": 169,
      "9": 189
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "All-Out Whiplash": {
   "done": true,
   "txt": "ウィップコマンド・キャンディ乱射の会心で、3秒間 攻撃力＋（9重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 9
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Non-Stop Victory": {
   "done": true,
   "txt": "通常攻撃の会心で、8秒間 攻撃力＋（4重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 4,
     "over": {
      "7": 18,
      "8": 20,
      "9": 22
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Cannon Ensemble": {
   "done": true,
   "txt": "8秒ごとにソリ砲台（射撃と爆発・従者）／ソリ砲台の会心で8秒間、自身とおもちゃの火属性ダメージ＋",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "ソリ砲台の射撃",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "minion",
      "sled"
     ],
     "over": {
      "8": 670,
      "9": 747
     }
    },
    {
     "k": "extra",
     "group": "main",
     "name": "ソリ砲台の爆発",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "tags": [
      "minion",
      "sled"
     ],
     "over": {
      "8": 474,
      "9": 529
     }
    },
    {
     "k": "W",
     "n": 2,
     "over": {
      "7": 58,
      "8": 65,
      "9": 73
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Elegant Moves": {
   "done": true,
   "txt": "回避+1・防御力＋／直接のダメージを30秒に1回無効（火力に影響なし）",
   "e": [],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Jazz of Rage": {
   "done": true,
   "txt": "ラール人形の間、射撃とキャンディ乱射で火属性の印を発動／攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Silver Bullet": {
   "done": true,
   "txt": "ラール人形の間、キャンディ乱射のあと10秒間 必殺技ダメージ＋",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 256,
      "8": 268,
      "9": 281
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Untouched King": {
   "done": true,
   "txt": "ラール人形の間、キャンディ乱射が当たってから10秒間 必殺技ダメージ＋（重ねられる数が書かれていないので1重）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 29,
      "8": 31,
      "9": 33
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Toy Army": {
   "done": true,
   "txt": "ラール人形の間、1秒ごとに火属性の味方の攻撃力＋（10重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux",
     "stk": 10,
     "over": {
      "7": 36,
      "8": 38,
      "9": 40
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Fire Downpour": {
   "done": true,
   "txt": "プレゼント砲弾の爆発のあと2秒間、0.3秒ごとにダメージ（6回）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "追い打ちプレゼント",
     "t": "skill",
     "c": 6,
     "edit": true,
     "m": 69,
     "tags": [
      "downpour"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Two-Gun Salute": {
   "done": true,
   "txt": "プレゼントキャノンのダメージ＋（スキルダメージとして計算）／プレゼント砲弾を2回追加",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "support",
     "over": {
      "7": 135,
      "8": 153,
      "9": 170
     }
    },
    {
     "k": "count",
     "hit": "sShell",
     "add": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Uplifting Shot": {
   "done": true,
   "txt": "プレゼント砲弾が当たってから5秒間、攻撃力＋（6重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6,
     "over": {
      "7": 40,
      "8": 43,
      "9": 46
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "First Taste of Sweetness": {
   "done": true,
   "txt": "火属性の印の付いた敵へのプレゼント砲弾の火属性ダメージ＋（付いている前提）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "shell"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Heart's Benediction": {
   "done": true,
   "txt": "クルミ大佐は1秒ごと、巻き毛将軍は0.5秒ごとに周りの敵へ従者ダメージ（いる時間が書かれていないので1秒ぶん。回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "追撃ドール（クルミ大佐）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "minion",
      "kurumi"
     ],
     "over": {
      "7": 9.5,
      "8": 10.7,
      "9": 12
     }
    },
    {
     "k": "extra",
     "group": "support",
     "name": "追撃ドール（巻き毛将軍）",
     "t": "skill",
     "c": 2,
     "edit": true,
     "n": 1,
     "tags": [
      "minion",
      "general"
     ],
     "over": {
      "7": 48.8,
      "8": 55.2,
      "9": 61.6
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Heart's Trumpet": {
   "done": true,
   "txt": "おもちゃの攻撃速度+35%／おもちゃが当てるたびに10秒間 従者ダメージ＋（10重。従者のスキルダメージとして計算）／会心で10秒間 火属性の味方の攻撃力＋（10重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 10,
     "tags": [
      "minion"
     ]
    },
    {
     "k": "atkPct",
     "n": 1,
     "to": "lux",
     "stk": 10,
     "over": {
      "7": 4.3,
      "8": 4.6,
      "9": 4.9
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Fairy Tale Rule": {
   "done": true,
   "txt": "全員が火属性のとき、プレゼント砲弾が当たってから12秒間、敵の火属性被ダメージ＋",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "cond": "allLux",
     "over": {
      "7": 63,
      "8": 66,
      "9": 69
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Celebration Resumed": {
   "done": true,
   "txt": "ラール（聖夜）が出場するたびに、10秒間 火属性の主力の攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main",
     "cond": "mainSame",
     "over": {
      "7": 193,
      "8": 206,
      "9": 220
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Here Comes the Queen": {
   "done": true,
   "txt": "ウィップコマンド・キャンディ乱射で12秒間ゼンマイ女王（18秒に1回）。女王の射撃 85%（主力スキルLv1の画面。主力スキルのLvで伸びるとして計算）。射撃のたびの連携作戦と、ドールマスターの強化（251%）は、射撃の回数が分からないので入れていない（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "ゼンマイ女王の射撃",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 239,
     "lv": "main",
     "tags": [
      "minion",
      "queen"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Special Ammo": {
   "done": true,
   "txt": "プレゼント砲弾の範囲+50%・スキルダメージ +13%／全員が火属性のとき、砲弾が当たってから7秒間 敵のスキル被ダメージ +1.3%（20重）（ゲームの画面で確認）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.13,
     "tags": [
      "shell"
     ]
    },
    {
     "k": "takenSkill",
     "raw": 0.013,
     "stk": 20,
     "to": "enemy",
     "cond": "allLux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ammo Rain": {
   "done": true,
   "txt": "ラール人形の間、攻撃力＋・射撃とキャンディ乱射で聖炎を付与",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "7": 277,
      "8": 287,
      "9": 297
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  }
 },
 "Ridge": {
  "Corrosive Vines": {
   "done": true,
   "txt": "種子の雨が当たってから6秒、敵の防御力 -11〜30（最大5重）。防御の式は空壺ノ王で実測と一致（2026-11-11）",
   "e": [
    {
     "k": "defDown",
     "n": 0,
     "stk": 5,
     "to": "enemy"
    }
   ]
  },
  "Root Grasp": {
   "done": true,
   "txt": "種球が付いている敵の防御力 -57〜151（種球は3秒、肥料注入で4.5秒）",
   "e": [
    {
     "k": "defDown",
     "n": 0,
     "to": "enemy"
    }
   ]
  },
  "Let Nature Thrive": {
   "done": true,
   "txt": "主力スキルで種子をもう1個発射",
   "e": [
    {
     "k": "count",
     "hit": "mSeed",
     "add": 1
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Nature's Guard": {
   "done": true,
   "txt": "主力スキルの種子がビーンシューターに育ち、8秒間 種を発射（スキル・主力スキルのLvで伸びる）。発射の間隔が書かれていないので、1秒に1発として8回（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "ビーンシューター",
     "t": "skill",
     "c": 8,
     "edit": true,
     "m": 25.5,
     "tags": [
      "bean"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Twin Sprouts": {
   "done": true,
   "txt": "主力スキルのダメージ＋／主力スキルとビーンシューターが50%の確率で種子をもう1つ（主力スキルの種子だけ期待値 +0.5個）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "main",
     "over": {
      "7": 50,
      "8": 56,
      "9": 63
     }
    },
    {
     "k": "count",
     "hit": "mSeed",
     "add": 0.5
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Overgrowth": {
   "done": true,
   "txt": "主力スキルのダメージ＋・種子の範囲+35%",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "main",
     "over": {
      "7": 67,
      "8": 76,
      "9": 85
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Vine Snare": {
   "done": true,
   "txt": "種子の減速が3重に。3重のとき、その敵への地属性ダメージ＋（3重になっている前提）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "over": {
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "A Fortunate Yield": {
   "done": true,
   "txt": "エネルギー弾12発ごとに大型エネルギー弾（通常攻撃・主力スキルのLvで伸びる。回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "basic",
     "name": "大型エネルギー弾",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 87,
     "tags": [
      "bigBullet"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Tangled Mess": {
   "done": true,
   "txt": "通常攻撃ダメージ +29%／通常攻撃でエネルギー弾を2発追加（3発に）",
   "e": [
    {
     "k": "Bb",
     "raw": 0.29
    },
    {
     "k": "count",
     "hit": "bBullet",
     "add": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Wild Growth": {
   "done": true,
   "txt": "通常攻撃ダメージ＋／主力スキルの通常攻撃強化 +50%（長さは火力に入れない）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "over": {
      "8": 133,
      "9": 148
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Bursting Pod": {
   "done": true,
   "txt": "通常攻撃ダメージ＋・エネルギー弾の範囲+30%",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "over": {
      "7": 98,
      "8": 111,
      "9": 124
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Hardened Cone": {
   "done": true,
   "txt": "通常攻撃ダメージ＋／通常攻撃のブレイク効率＋（火力に入れない）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "over": {
      "7": 49,
      "8": 56,
      "9": 62
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Verdant Vigor": {
   "done": true,
   "txt": "必殺技で地脈を発動できる／地脈を発動してから15秒間、攻撃力＋（6重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6,
     "over": {
      "7": 44,
      "8": 50,
      "9": 56
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Power Slide": {
   "done": true,
   "txt": "回避+1／回避してから8秒間、通常攻撃ダメージ＋",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "over": {
      "7": 98,
      "8": 111,
      "9": 124
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Full Bloom": {
   "done": true,
   "txt": "中・遠距離の敵への与ダメージ＋（射撃なので当てはまる前提。ダメージの別枠として計算）",
   "e": [
    {
     "k": "mult",
     "n": 0,
     "over": {
      "7": 35,
      "8": 40,
      "9": 45
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Seed to Harvest": {
   "done": true,
   "txt": "必殺技ダメージ＋／最終撃のブレイク効率＋（火力に入れない）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 157,
      "8": 178,
      "9": 198
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Spring's Embrace": {
   "done": true,
   "txt": "必殺技のダメージを与えるたびに必殺技ダメージ＋（5重。必殺技が終わるとリセット）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "stk": 5,
     "over": {
      "7": 26,
      "8": 30,
      "9": 33
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Sow and Reap": {
   "done": true,
   "txt": "必殺技から15秒間、攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Sense the Stir": {
   "done": true,
   "txt": "種子の雨のダメージ +9%・間隔 -30%（ヒットが 1/0.7 倍）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.09,
     "tags": [
      "rain"
     ]
    },
    {
     "k": "countMul",
     "hit": "sRain",
     "mul": 1.4285714285714286
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Bouquet Blast": {
   "done": true,
   "txt": "種子の雨のダメージ＋・範囲+30%",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "rain"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Needle Seed": {
   "done": true,
   "txt": "支援スキル中、0.5秒ごとにスキルダメージ＋（スキルが終わるとリセット。長さが書かれていないので既定6重、20重まで入力できる）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 20,
     "stk0": 6,
     "over": {
      "7": 9,
      "8": 10,
      "9": 11
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Hasty Growth": {
   "done": true,
   "txt": "種球の持続 +50%・ダメージ +50%・地脈を付与",
   "e": [
    {
     "k": "Bs",
     "raw": 0.5,
     "tags": [
      "bulb"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Misplaced Bloom": {
   "done": true,
   "txt": "種球のダメージ +5%・範囲+50%／種球のダメージでもう一度種球が発動（同じ敵に1秒に1回。1回ぶん増やす）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.05,
     "tags": [
      "bulb"
     ]
    },
    {
     "k": "count",
     "hit": "sBulb",
     "add": 1
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Cone Bomb": {
   "done": true,
   "txt": "種球のダメージ＋／種球がダメージを与えるたびに、近くの敵に種子（種球1回につき1回）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "bulb"
     ],
     "over": {
      "7": 65,
      "8": 74,
      "9": 82
     }
    },
    {
     "k": "extra",
     "group": "support",
     "name": "こぼれ種",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "perTag": "bulb",
     "tags": [
      "coneSeed"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Sturdy Foundation": {
   "done": true,
   "txt": "種球の付いた敵への与ダメージ＋（付いている前提。ダメージの別枠として計算）",
   "e": [
    {
     "k": "mult",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Small Changes": {
   "done": true,
   "txt": "地属性の味方1人ごとに、チーム全員の攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "perLux": true
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ensnaring Ground": {
   "done": true,
   "txt": "必殺技ダメージ＋／必殺技で地脈を付与",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 287,
      "8": 324,
      "9": 362
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Turn the Tide": {
   "done": true,
   "txt": "レイセンの攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "7": 50,
      "8": 56,
      "9": 63
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Reblossom": {
   "done": true,
   "txt": "支援スキルがもう一度発動する（種子の雨・種球の回数を2倍。素質で足した支援スキルの追加ダメージは2倍にしていない）",
   "e": [
    {
     "k": "countMul",
     "hit": "sRain",
     "mul": 2
    },
    {
     "k": "countMul",
     "hit": "sBulb",
     "mul": 2
    }
   ],
   "note": "2026-11-14 説明文から（数字なし）"
  }
 },
 "Allie": {
  "Quick Sweep": {
   "done": true,
   "txt": "全員が水のとき、愛のしるしの上限が5に（4・5つ目の水属性ダメージ +3.3%×2）、1つにつき自身の会心率 +3%（5つ）。上限のとき主力スキルで粛清を出せる（回し方なので計算には入れない）",
   "e": [
    {
     "k": "W",
     "raw": 0.033,
     "stk": 2,
     "cond": "allLux"
    },
    {
     "k": "critRate",
     "raw": 0.03,
     "stk": 5,
     "cond": "allLux"
    }
   ]
  },
  "Multi Sweep": {
   "done": true,
   "txt": "通常攻撃・主力スキルのとき氷刃（スキル・主力スキルのLvで伸びる。4秒に1回。主力スキル1回に1発として数える）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "氷刃",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 318,
     "tags": [
      "iceBlade"
     ]
    }
   ]
  },
  "Dusting Vortex": {
   "done": true,
   "txt": "愛のしるしが上限のとき主力スキルで一掃を出せる。一掃でしるしを吸収して最大数の効果（回し方なので計算には入れない。しるしの効果はスキルのバフ・母の愛に入っている）",
   "e": []
  },
  "Sweep Extension": {
   "done": true,
   "txt": "おしおきモード中、印ダメージ +10%／霜が3・6のとき追加の華（霜華）468%（印。回数は入力）",
   "e": [
    {
     "k": "mark",
     "raw": 0.1
    },
    {
     "k": "extra",
     "group": "main",
     "name": "追加の華（霜華）",
     "t": "mark",
     "c": 1,
     "edit": true,
     "m": 468,
     "tags": [
      "frostBloom"
     ]
    }
   ]
  },
  "Cleaver Ready": {
   "done": true,
   "txt": "全員が水のとき、スキル会心率＋（Lv6で20%、(Max!)でそれ以上は上がらない）・スキル会心ダメージ＋。粛清のあとの氷刃の間隔短縮は未反映",
   "e": [
    {
     "k": "critRate",
     "n": 2,
     "ht": "skill",
     "cond": "allLux",
     "over": {
      "7": 20,
      "8": 20,
      "9": 20
     }
    },
    {
     "k": "critDmg",
     "n": 3,
     "ht": "skill",
     "cond": "allLux"
    }
   ]
  },
  "Clothesline Stance": {
   "done": true,
   "txt": "粛清の必殺技ダメージをスキルダメージに変換（粛清の大鉈の残像は必殺技のまま・未確認）／粛清・主力スキルのあと8秒、自身のスキルダメージ＋（6重）",
   "e": [
    {
     "k": "retype",
     "tags": [
      "purge"
     ],
     "t": "skill"
    },
    {
     "k": "Bs",
     "n": 0,
     "stk": 6,
     "over": {
      "7": 8.4,
      "8": 8.8,
      "9": 9.2
     }
    }
   ]
  },
  "Sweeper's Blow": {
   "done": true,
   "txt": "愛のしるしを得たあと8秒、ママのしつけ・氷刃（おしおき追加）のスキルダメージ＋（6重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 6,
     "tags": [
      "shitsuke",
      "iceBlade"
     ],
     "over": {
      "7": 10.5,
      "8": 11,
      "9": 11.5
     }
    }
   ]
  },
  "Overtime Chore": {
   "done": true,
   "txt": "通常攻撃ダメージ＋／全員が水でおしおきモード中、通常攻撃の倍率＋（印の発動・霜華は未反映）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "over": {
      "7": 63,
      "8": 66,
      "9": 69
     }
    },
    {
     "k": "mult",
     "n": 1,
     "tags": [
      "basic"
     ],
     "cond": "allLux",
     "over": {
      "7": 79.3,
      "8": 92.2,
      "9": 108.5
     }
    }
   ]
  },
  "Wide Blade Arc": {
   "done": true,
   "txt": "全員が水のとき、一掃と通常攻撃を印ダメージに変換。通常攻撃ダメージ1.3%ごとに印ダメージ +1%（最大値あり）。エリーの印会心率 -100%",
   "e": [
    {
     "k": "retype",
     "tags": [
      "dust",
      "basic"
     ],
     "t": "mark",
     "cond": "allLux"
    },
    {
     "k": "markFromBb",
     "ratio": 0.7692307692307692,
     "n": 0,
     "cond": "allLux",
     "over": {
      "7": 210,
      "8": 220,
      "9": 230
     }
    },
    {
     "k": "critRate",
     "raw": -1,
     "ht": "mark",
     "cond": "allLux"
    }
   ]
  },
  "Pending Chore": {
   "done": true,
   "txt": "おしおきモード中、華を出すたびママポイント、9秒間 通常攻撃ダメージ＋（3重）。ママポイントの愛のしるしは回し方なので入れない",
   "e": [
    {
     "k": "Bb",
     "n": 1,
     "stk": 3,
     "over": {
      "7": 41,
      "8": 42,
      "9": 44
     }
    }
   ]
  },
  "Sweep Dash": {
   "done": true,
   "txt": "水属性の人数1人につき、エリーの水属性ダメージ＋（ダッシュで愛のしるしは回し方なので入れない）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "perLux": true
    }
   ]
  },
  "Silent Paws": {
   "done": true,
   "txt": "回避・シールドを得たあと8秒、エリーの攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "over": {
      "7": 30,
      "8": 33,
      "9": 37
     }
    }
   ]
  },
  "Repeated Sweep": {
   "done": true,
   "txt": "印ダメージを与えたあと5秒、自身の攻撃力＋（6重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 6
    }
   ]
  },
  "Purge Stance": {
   "done": true,
   "txt": "必殺技のあと15秒、エリーの攻撃力＋（2重。必殺技を使う主力のときだけ）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 2,
     "cond": "isMain",
     "over": {
      "7": 28,
      "8": 31.2,
      "9": 34.8
     }
    }
   ]
  },
  "Swift Wipe": {
   "done": true,
   "txt": "一掃の倍率＋（範囲の拡大は火力に入れない）",
   "e": [
    {
     "k": "mult",
     "n": 1,
     "tags": [
      "dust"
     ]
    }
   ]
  },
  "Mirror Blade": {
   "done": true,
   "txt": "粛清で残像を出し、追加の必殺技ダメージ／粛清の倍率＋（残像に倍率が乗るかは未確認なので、粛清だけに乗せる）",
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "粛清の残像",
     "t": "ult",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "purgeX"
     ],
     "over": {
      "7": 1551,
      "8": 1754,
      "9": 1956
     }
    },
    {
     "k": "mult",
     "n": 1,
     "tags": [
      "purge"
     ],
     "over": {
      "7": 35,
      "8": 39,
      "9": 44
     }
    }
   ]
  },
  "Frost Blade": {
   "done": true,
   "txt": "スイープスラッシュがアイスエッジを連続で放つ（スキル・支援スキルのLvで伸びる。何発出るか分からないので回数は入力。既定1発。スイープスラッシュへの効果は乗せない）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "アイスエッジ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 77.8,
     "tags": [
      "iceEdge"
     ]
    }
   ]
  },
  "Repeat Sweep": {
   "done": true,
   "txt": "スイープスラッシュの回数 +8、スイープスラッシュの水属性ダメージ +20%",
   "e": [
    {
     "k": "count",
     "hit": "sSweep",
     "add": 8
    },
    {
     "k": "W",
     "raw": 0.2,
     "tags": [
      "sweepSlash"
     ]
    }
   ]
  },
  "Sweeper's Finale": {
   "done": true,
   "txt": "アイシクルスラッシュのあと追加 356%×3（スキル・支援スキルのLvで伸びる）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "追加の斬撃",
     "t": "skill",
     "c": 3,
     "edit": true,
     "m": 356,
     "tags": [
      "icicle"
     ]
    }
   ]
  },
  "Accidental Ruin": {
   "done": true,
   "txt": "氷晶が爆発して 356%（スキル・支援スキルのLvで伸びる。氷晶トラップの氷晶も爆発するかは未確認なので1回）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "氷晶の爆発",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 356,
     "tags": [
      "crystal"
     ]
    }
   ]
  },
  "Housework Hazard": {
   "done": true,
   "txt": "場にいる0.5秒ごとにスキルダメージ＋（4重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 4,
     "over": {
      "7": 12,
      "8": 13,
      "9": 15
     }
    }
   ]
  },
  "Timber Splitter": {
   "done": true,
   "txt": "スイープスラッシュのスキルダメージ＋（ブレイク状態の敵へのさらに＋は未反映）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "sweepSlash"
     ],
     "over": {
      "9": 70.8
     }
    }
   ]
  },
  "Frosty Gale": {
   "done": true,
   "txt": "スイープスラッシュが4体以上に当たったとき水属性ダメージ＋（ボス1体を想定して既定は反映しない）",
   "off": true,
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "sweepSlash"
     ]
    }
   ]
  },
  "Crescent Icicle": {
   "done": true,
   "txt": "アイシクルスラッシュで氷晶が2つ増え、それぞれ追加ダメージ（スキル）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "氷晶トラップ",
     "t": "skill",
     "c": 2,
     "edit": true,
     "n": 0,
     "tags": [
      "crystal"
     ]
    }
   ]
  },
  "Deep Freeze": {
   "done": true,
   "txt": "アイシクルスラッシュと氷晶のスキルダメージ＋、エリート以上の敵にさらに＋",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "icicle",
      "crystal"
     ],
     "over": {
      "7": 52,
      "8": 59,
      "9": 66
     }
    },
    {
     "k": "Bs",
     "n": 1,
     "tags": [
      "icicle",
      "crystal"
     ],
     "over": {
      "7": 26,
      "8": 30,
      "9": 33
     }
    }
   ]
  },
  "Solitary Chill": {
   "done": true,
   "txt": "アイシクルスラッシュと氷晶が3体以下に当たったとき、水属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "icicle",
      "crystal"
     ]
    }
   ]
  },
  "Moonglow Haven": {
   "done": true,
   "txt": "水属性が3人のとき、チーム全員の水属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "to": "all",
     "cond": "allLux"
    }
   ]
  },
  "Winter's Vigil": {
   "done": true,
   "txt": "サポーターが場にいるとき、エリーの水属性ダメージ＋（いる前提）",
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ]
  },
  "Icy Aegis": {
   "done": true,
   "txt": "エリーの水属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "over": {
      "9": 70
     }
    }
   ]
  }
 },
 "Chaton": {
  "Area Explosion": {
   "done": true,
   "txt": "ネコ神爆弾が着地するたびに追加ダメージ（スキル・主力スキルのLvで伸びる。爆弾1つにつき1回）／ネコ神爆弾のスキルダメージ +25%",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "着地の追加ダメージ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 20.7,
     "perTag": "bomb",
     "tags": [
      "bombLand"
     ]
    },
    {
     "k": "Bs",
     "raw": 0.25,
     "tags": [
      "bomb"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Overwhelming Throw": {
   "done": true,
   "txt": "長押しでネコ神爆弾を2つ追加（4つに）／ネコ神爆弾のスキルダメージ +25%",
   "e": [
    {
     "k": "count",
     "hit": "mBomb",
     "add": 2
    },
    {
     "k": "Bs",
     "raw": 0.25,
     "tags": [
      "bomb"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Efficient Use": {
   "done": true,
   "txt": "跳ね返りが終わると火種。長押しで火種を使い、5秒間 自身のスキル会心ダメージ＋、ネコ神爆弾改（跳ね返らない）を1つ投げる",
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "ht": "skill"
    },
    {
     "k": "extra",
     "group": "main",
     "name": "ネコ神爆弾改",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "tags": [
      "bombKai"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Chain Bounce": {
   "done": true,
   "txt": "ネコ神爆弾の跳ね返り+1（ボス1体なので回数は増やさない）／ネコ神爆弾のダメージのときだけ攻撃力＋",
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "tags": [
      "bomb"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Deadly Verdict": {
   "done": true,
   "txt": "ネコ神爆弾の会心ダメージ＋／ネコ神爆弾の会心で、10秒間 ネコ神爆弾のスキルダメージ＋（5重）",
   "e": [
    {
     "k": "critDmg",
     "n": 0,
     "tags": [
      "bomb"
     ],
     "over": {
      "7": 35,
      "8": 39,
      "9": 44
     }
    },
    {
     "k": "Bs",
     "n": 1,
     "stk": 5,
     "tags": [
      "bomb"
     ],
     "over": {
      "8": 33.3,
      "9": 37.1
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Meowth's Curse": {
   "done": true,
   "txt": "魔痕のダメージ間隔 -50%（魔痕のヒットが2倍）／魔痕が付いた敵へのスキルダメージ +10%（付いている前提）",
   "e": [
    {
     "k": "countMul",
     "hit": "mScar",
     "mul": 2
    },
    {
     "k": "Bs",
     "raw": 0.1
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Reincarnation of Darkness": {
   "done": true,
   "txt": "空に堕ちる焔のスキルダメージ +10%／魔痕の付いた敵にポジトロンシュートが当たると、魔痕のダメージ倍率 +85%（3重。倍率の掛け算として計算）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.1,
     "tags": [
      "fall"
     ]
    },
    {
     "k": "mult",
     "raw": 0.85,
     "stk": 3,
     "tags": [
      "scar"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Mark of Darkness": {
   "done": true,
   "txt": "空に堕ちる焔のスキルダメージ＋／通常攻撃が魔痕の付いた敵に当たると追加ダメージ（スキル・1秒に1回。回数は入力）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "fall"
     ]
    },
    {
     "k": "extra",
     "group": "basic",
     "name": "漆黒の刻印の追加ダメージ",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "tags": [
      "markDark"
     ],
     "over": {
      "7": 419,
      "8": 474,
      "9": 529
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Lucky Bullet": {
   "done": true,
   "txt": "空に堕ちる焔のスキルダメージ＋／ポジトロンシュートの会心で主力スキルのクールタイムをリセット、12秒間 空に堕ちる焔のスキルダメージ＋（会心が出る前提）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "tags": [
      "fall"
     ],
     "over": {
      "7": 66,
      "8": 75,
      "9": 84
     }
    },
    {
     "k": "Bs",
     "n": 1,
     "tags": [
      "fall"
     ],
     "over": {
      "8": 21,
      "9": 23
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Hunting Mark": {
   "done": true,
   "txt": "魔痕の会心のあと4秒間、魔痕のダメージのときだけ攻撃力＋（10重）",
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "stk": 10,
     "tags": [
      "scar"
     ],
     "over": {
      "8": 7.3,
      "9": 8.1
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Dominant Firepower": {
   "done": true,
   "txt": "オートトリガーが連射に（魔眼解放中は攻撃速度+60%。火力には入れない）／印を発動すると5秒間 攻撃力＋（5重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 5,
     "over": {
      "8": 10.9,
      "9": 12.2
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Mobile Combat": {
   "done": true,
   "txt": "回避+1／主力スキルのあと6秒間、火属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "over": {
      "7": 31,
      "8": 35,
      "9": 38
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Foe Annihilation": {
   "done": true,
   "txt": "HP20%より上の敵への火属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0,
     "over": {
      "7": 65,
      "8": 74,
      "9": 82
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Curse Fall": {
   "done": true,
   "txt": "必殺技と魔眼解放中のインフィニティフレアが、アビスグレアの付いた敵に当たるたびに追加の必殺技ダメージ（当たった回数ぶん）",
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "覗き込む闇（必殺技）",
     "t": "ult",
     "c": 1,
     "edit": true,
     "n": 0,
     "perTag": "ult",
     "tags": [
      "curse"
     ],
     "over": {
      "8": 72.6,
      "9": 81
     }
    },
    {
     "k": "extra",
     "group": "basic",
     "name": "覗き込む闇（インフィニティフレア）",
     "t": "ult",
     "c": 1,
     "edit": true,
     "n": 0,
     "perTag": "flare",
     "tags": [
      "curse"
     ],
     "over": {
      "8": 72.6,
      "9": 81
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Penetrating Bullet": {
   "done": true,
   "txt": "魔眼解放が20秒に（長さは火力に入れない）／必殺技ダメージ＋／インフィニティフレアが貫通",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 196,
      "8": 222,
      "9": 247
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Doom's Echo": {
   "done": true,
   "txt": "アビスグレアが爆発後も残る／アビスグレアの付いた敵への火属性ダメージ＋（付いている前提）",
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ambush Operation": {
   "done": true,
   "txt": "支援スキルの射撃が当たるたびに黒き祝福（Lv1→2→3）と追加ダメージ（スキル・支援スキルのLvで伸びる）。3回の射撃で Lv1・Lv2・Lv3 を1回ずつ",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "黒き祝福 Lv1",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 350.7,
     "tags": [
      "bless"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "黒き祝福 Lv2",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 467.6,
     "tags": [
      "bless"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "黒き祝福 Lv3",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 526.2,
     "tags": [
      "bless"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Strike While the Iron is Hot": {
   "done": true,
   "txt": "支援スキルのスキルダメージ +15.6%／貫通弾の会心で追加の射撃（1回の支援スキルで2回まで。会心が出る前提で+2回）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.156,
     "grp": "support"
    },
    {
     "k": "count",
     "hit": "sRoll",
     "add": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Evil Eye Gaze": {
   "done": true,
   "txt": "支援スキルのスキルダメージ＋／魔眼が8秒間 0.4秒ごとにダメージ（20回）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "support"
    },
    {
     "k": "extra",
     "group": "support",
     "name": "魔眼の射手",
     "t": "skill",
     "c": 20,
     "edit": true,
     "n": 1,
     "tags": [
      "eye"
     ],
     "over": {
      "7": 80.7,
      "8": 91.2,
      "9": 101.7
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Excess Amplification": {
   "done": true,
   "txt": "黒き祝福の付いた敵へのスキルダメージ＋（祝福のLv1つごと。Lv3として3重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 3
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Relentless Suppression": {
   "done": true,
   "txt": "支援スキル中、1秒ごとに火属性のスキルダメージ＋（最大10重。支援スキルは数秒なので既定3重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 10,
     "stk0": 3,
     "grp": "support",
     "over": {
      "7": 12.5,
      "8": 14.1,
      "9": 15.8
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Combat Frenzy": {
   "done": true,
   "txt": "支援スキルのスキルダメージ +25.6%／射撃のたびに貫通弾を2発追加（ローリングと同じ倍率として計算）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.256,
     "grp": "support"
    },
    {
     "k": "extra",
     "group": "support",
     "name": "追加の貫通弾",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 572.5,
     "lv": "support",
     "perTag": "roll",
     "tagMul": 2,
     "tags": [
      "pierce",
      "pierceX"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Core Blast": {
   "done": true,
   "txt": "支援スキルのスキルダメージ +12%／貫通弾が当たると小型貫通弾12発に分裂（スキル・支援スキルのLvで伸びる。ローリング1回に3回まで＝貫通弾1発につき12発として計算）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.12,
     "grp": "support"
    },
    {
     "k": "extra",
     "group": "support",
     "name": "小型貫通弾",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 25.1,
     "perTag": "pierce",
     "tagMul": 12,
     "tags": [
      "split"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "One Stone Two Birds": {
   "done": true,
   "txt": "自身のスキルダメージ＋／射撃のたびに、ぷにぷにボム2発が3回跳ねてダメージ（射撃1回につき6回）",
   "e": [
    {
     "k": "Bs",
     "n": 0
    },
    {
     "k": "extra",
     "group": "support",
     "name": "ぷにぷにボム",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 1,
     "perTag": "roll",
     "tagMul": 6,
     "tags": [
      "puni"
     ],
     "over": {
      "7": 86.4,
      "8": 97.7,
      "9": 109
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Minor Fling": {
   "done": true,
   "txt": "HP30%未満のノーマル敵を即撃破／HP80%未満のエリート以上に、支援スキルの火属性ダメージ＋（ほとんどの時間あてはまるので既定で入れる）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "grp": "support"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Burnt Rifling": {
   "done": true,
   "txt": "支援スキルの会心のたびに、その支援スキルのスキルダメージ＋（5重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 5,
     "grp": "support"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Burning Passion": {
   "done": true,
   "txt": "火属性の味方の攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Energy Overflow": {
   "done": true,
   "txt": "SPが上限になると20秒間、スキルダメージ＋",
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Swift Assault": {
   "done": true,
   "txt": "支援スキル中、スキルダメージ＋",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "support"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  }
 },
 "Freesia": {
  "Realm of Frost": {
   "done": true,
   "txt": "支援スキルのスキルダメージ +10%・氷華の範囲+60%",
   "e": [
    {
     "k": "Bs",
     "raw": 0.1,
     "grp": "support"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Chill Forecast": {
   "done": true,
   "txt": "支援スキルのスキルダメージ +10%・氷華の数が増える（いくつ増えるか書かれていないので、数は増やさない）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.1,
     "grp": "support"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Penetrating Chill": {
   "done": true,
   "txt": "同じ敵に支援スキルのダメージを与えるたびに、スキルダメージ＋（12重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 12,
     "over": {
      "7": 17,
      "8": 19,
      "9": 21
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Winter's Grip": {
   "done": true,
   "txt": "支援スキルが当たってから7秒間、敵の水属性被ダメージ＋（重ねられる数はLvで4〜8。最大の8で計算、入力で変えられる）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy",
     "stk": 8
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Crackling Zero": {
   "done": true,
   "txt": "氷華が消えると氷の種、2秒後にダメージ（氷華1つにつき1回）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "氷の種",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "perTag": "flower",
     "tagDiv": 2,
     "tags": [
      "seed"
     ],
     "over": {
      "7": 167,
      "8": 189,
      "9": 211
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ocean of Law": {
   "done": true,
   "txt": "狂化中、寒冷・凍結の敵に通常攻撃が当たってから3秒間、攻撃力＋（10重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 10
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Blessing of Faith": {
   "done": true,
   "txt": "狂化中に支援スキルを使うと狂化+3秒、15秒間 スキルダメージ＋（3重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 3,
     "over": {
      "7": 42,
      "8": 48,
      "9": 53
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Power of Redemption": {
   "done": true,
   "txt": "場にいるあいだ、1秒ごとに攻撃力＋（25重。場を離れるとリセット）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 25
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Temporal Revival": {
   "done": true,
   "txt": "支援スキルのあと、確率で15秒間 チーム全員の通常攻撃ダメージ＋（2重）。確率の期待値で計算",
   "e": [
    {
     "k": "Bb",
     "n": 1,
     "to": "all",
     "stk": 2,
     "probN": 0,
     "probOver": {
      "7": 60,
      "8": 60,
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Guardian's Heart": {
   "done": true,
   "txt": "自分以外が水属性のとき、チーム全員の会心率＋",
   "e": [
    {
     "k": "critRate",
     "n": 0,
     "to": "all",
     "cond": "allLux",
     "over": {
      "7": 15,
      "8": 17,
      "9": 19
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Silent Prayer": {
   "done": true,
   "txt": "必殺技ダメージ＋・必殺技で水流を付与",
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Wuthering Cold Snap": {
   "done": true,
   "txt": "狂化中にスキルを使ってから15秒間、通常攻撃ダメージ＋（3重）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "stk": 3,
     "over": {
      "7": 119,
      "8": 134,
      "9": 150
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Frost Slash": {
   "done": true,
   "txt": "狂化のとき周りの敵を3秒凍結／必殺技のあと10秒間、寒冷・凍結のエリート以上への通常攻撃が50%の確率でダメージ＋（期待値で計算）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "prob": 0.5,
     "over": {
      "7": 287,
      "8": 324,
      "9": 362
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ice Mist Barrier": {
   "done": true,
   "txt": "主力スキルの終わりに氷霧（10秒）。中の敵に、味方の通常攻撃ダメージ +13%",
   "e": [
    {
     "k": "Bb",
     "raw": 0.13,
     "to": "all"
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Rapid Verdict": {
   "done": true,
   "txt": "主力スキルがチャージできなくなる（旋風斬りの回数は入力で減らす）。終わりに範囲ダメージ（スキル・主力スキルのLvで伸びる）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "スキル終了時の攻撃（即断即決）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 179,
     "lv": "main"
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Elemental Sublimation": {
   "done": true,
   "txt": "主力スキルのたびに、次の必殺技のダメージ＋・狂化中の通常攻撃ダメージ＋（3重）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "stk": 3
    },
    {
     "k": "Bb",
     "n": 1,
     "stk": 3,
     "tags": [
      "berserk"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Doomsday Blessing": {
   "done": true,
   "txt": "主力スキルのあと9秒、攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Soul Extraction": {
   "done": true,
   "txt": "狂化中に主力スキルを使ってから7秒、攻撃力＋（狂化中の前提）",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Whirlwind Frenzy": {
   "done": true,
   "txt": "主力スキルのスキルダメージ +120%。攻撃回数+2、さらに0.5秒チャージごとに+2（最大3.6秒で+14）なので +16回",
   "e": [
    {
     "k": "Bs",
     "raw": 1.2,
     "grp": "main"
    },
    {
     "k": "count",
     "hit": "mSwirl",
     "add": 16
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Unstoppable March": {
   "done": true,
   "txt": "主力スキルの間、ダメージを与えるたびにスキルダメージ +4.6%（24重）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.046,
     "stk": 24
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Limits of Oblivion": {
   "done": true,
   "txt": "主力スキルの間、1.5秒ごとに氷の斧（スキル）。最大チャージ3.6秒で2回",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "氷の斧（雪の忘れ物）",
     "t": "skill",
     "c": 2,
     "edit": true,
     "n": 0
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Frost Gift": {
   "done": true,
   "txt": "寒冷か凍結のエリート以上の敵へのダメージが、50%の確率で＋（期待値。主力スキルのダメージとして計算）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "main",
     "prob": 0.5
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Frost Ward": {
   "done": true,
   "txt": "狂化中、主力スキルで攻撃するあいだ1秒ごとにスキルダメージ＋（3.6秒で3重まで。既定は平均の2重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "grp": "main",
     "stk": 3,
     "stk0": 2
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Victorious Pursuit": {
   "done": true,
   "txt": "狂化時間が延びる（火力に入れない）",
   "e": [],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Desperate Counterattack": {
   "done": true,
   "txt": "回避+1・SP（火力に入れない）",
   "e": [],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Tit-for-Tat": {
   "done": true,
   "txt": "必殺技で水属性の印を発動できる。発動で印ダメージ 175%・寒冷。8秒間 攻撃力＋（5重）",
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "印ダメージ（寒波襲来）",
     "t": "mark",
     "c": 1,
     "edit": true,
     "m": 175
    },
    {
     "k": "atkPct",
     "n": 0,
     "stk": 5
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Ice Vortex": {
   "done": true,
   "txt": "必殺技ダメージ＋。必殺技が当たるたびに、その狂化中の会心ダメージ＋（20重。既定は必殺技の3ヒットぶんの3重）。数字は控えと英語Wikiの値（日本語Wikiの文の数字は違う）",
   "e": [
    {
     "k": "Bu",
     "n": 0
    },
    {
     "k": "critDmg",
     "n": 1,
     "stk": 20,
     "stk0": 3,
     "tags": [
      "berserk",
      "ult"
     ]
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  },
  "Localized Snowfall": {
   "done": true,
   "txt": "狂化中、支援スキルのあと6秒、通常攻撃が30%の確率で氷華を生成（氷華と爆発・支援スキルのLvで伸びる）。狂化中の通常攻撃1周（10回）×30%で3回として計算（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "氷華（極地降雪）",
     "t": "skill",
     "c": 3,
     "edit": true,
     "m": 556.6,
     "lv": "support",
     "tags": [
      "flower"
     ]
    },
    {
     "k": "extra",
     "group": "support",
     "name": "氷華の爆発（極地降雪）",
     "t": "skill",
     "c": 3,
     "edit": true,
     "m": 836.3,
     "lv": "support",
     "tags": [
      "flower"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Frost Warning": {
   "done": true,
   "txt": "寒冷か凍結の敵に攻撃が当たると、追加で範囲ダメージ（スキル・支援スキルのLvで伸びる）。間隔が書かれていないので1回分（回数は入力）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "追加の範囲ダメージ（霜害警告）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 224,
     "lv": "support"
    }
   ],
   "note": "2026-11-14 英語Wikiの数字で作成（素質の確認はまだ。控えの文を参考）"
  }
 },
 "Minova": {
  "Ultimatum": {
   "done": true,
   "txt": "三塁打が使えるようになる（スキル・主力スキルのLvで伸びる）。三塁打中はダメージを受けない",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "三塁打",
     "t": "skill",
     "c": 2,
     "edit": true,
     "m": 320,
     "tags": [
      "triple"
     ]
    },
    {
     "k": "extra",
     "group": "main",
     "name": "三塁打（最後）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 479,
     "tags": [
      "triple"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Clan Clash Artistry": {
   "done": true,
   "txt": "三塁打の倍率 +64.4%／主力スキルで光の印を発動すると、二塁打の倍率 +64.4%・間隔 -30%（印が出る前提）。三塁打の追加ダメージは値が分からないので入れていない",
   "e": [
    {
     "k": "mult",
     "raw": 0.644,
     "tags": [
      "triple",
      "double"
     ]
    },
    {
     "k": "countMul",
     "hit": "mDouble",
     "mul": 1.4285714285714286
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ashwind Rhythm": {
   "done": true,
   "txt": "主力スキルのあと6秒間、攻撃速度+20%・通常攻撃ダメージ＋",
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Unyielding Strength": {
   "done": true,
   "txt": "通常攻撃が当たるたびに、次の主力スキルのスキルダメージ＋（6重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 6,
     "grp": "main",
     "over": {
      "9": 46
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "On a Roll": {
   "done": true,
   "txt": "主力スキル中、当たるたびにスキルダメージ＋（6重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 6,
     "grp": "main"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Board Tricks": {
   "done": true,
   "txt": "主力スキル（三塁打を含む）のダメージ倍率 +430%（倍率の掛け算として計算。ほかの素質の追加ダメージには乗せない）／光の印を発動してから8秒間、敵のスキル被ダメージ +27%",
   "e": [
    {
     "k": "mult",
     "raw": 4.3,
     "tags": [
      "main",
      "triple"
     ]
    },
    {
     "k": "takenSkill",
     "raw": 0.27,
     "to": "enemy"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "No Respite": {
   "done": true,
   "txt": "二塁打が3連撃に・スキルダメージ +47%／主力スキルから2秒以内の二塁打は、当たるたびに追加ダメージ（3連撃ぶん3回）",
   "e": [
    {
     "k": "Bs",
     "raw": 0.47,
     "tags": [
      "double"
     ]
    },
    {
     "k": "extra",
     "group": "main",
     "name": "連続打撃の追加ダメージ",
     "t": "skill",
     "c": 3,
     "edit": true,
     "tags": [
      "noRespite"
     ],
     "m": 184
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Light Burn": {
   "done": true,
   "txt": "主力スキルのクールタイム-4秒／主力スキルから5秒間、スキルダメージ＋",
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Radiant Glow": {
   "done": true,
   "txt": "主力スキルが当たると追加ダメージ（主力スキル1回に1回）",
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "光輝炸裂",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "glowBurst"
     ],
     "over": {
      "7": 900,
      "8": 1017,
      "9": 1135
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Nebulous Reverb": {
   "done": true,
   "txt": "必殺技で光の印（落雷 195%の印ダメージ）／必殺技のあと5秒間、スキルダメージ＋",
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "落雷（星雲の誓い）",
     "t": "mark",
     "c": 1,
     "edit": true,
     "m": 195,
     "tags": [
      "thunder"
     ]
    },
    {
     "k": "Bs",
     "n": 0,
     "over": {
      "8": 473,
      "9": 528
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Starlit Sky": {
   "done": true,
   "txt": "味方が支援スキルを使ってから10秒間、ミネルバの攻撃力＋（2重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 2,
     "over": {
      "9": 70
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "More Than Just Pretty": {
   "done": true,
   "txt": "通常攻撃の5撃目が当たってから6秒間、敵の光属性被ダメージ＋",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Home Court Advantage": {
   "done": true,
   "txt": "主力スキルのあと6秒間、攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Urgent Reinforcement": {
   "done": true,
   "txt": "必殺技ダメージ＋・必殺技のSP消費+25%",
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Flash of Starlight": {
   "done": true,
   "txt": "必殺技のダメージ間隔 -30%（ヒットが 1/0.7 倍）／必殺技ダメージ＋",
   "e": [
    {
     "k": "countMul",
     "hit": "uAsh",
     "mul": 1.4285714285714286
    },
    {
     "k": "Bu",
     "n": 0,
     "over": {
      "7": 96,
      "8": 108,
      "9": 121
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Weakness Strike": {
   "done": true,
   "txt": "必殺技中、フォルモントとネールモントが参戦して追加の必殺技ダメージ（×2と×1）",
   "e": [
    {
     "k": "extra",
     "group": "ult",
     "name": "フォルモント・ネールモント",
     "t": "ult",
     "c": 2,
     "edit": true,
     "n": 0,
     "tags": [
      "moon"
     ],
     "over": {
      "7": 702,
      "8": 793,
      "9": 885
     }
    },
    {
     "k": "extra",
     "group": "ult",
     "name": "フォルモント・ネールモント（大）",
     "t": "ult",
     "c": 1,
     "edit": true,
     "n": 1,
     "tags": [
      "moon"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Four-Star Wanted Level": {
   "done": true,
   "txt": "支援スキルのスキルダメージ +15%／星芒が4つに",
   "e": [
    {
     "k": "Bs",
     "raw": 0.15,
     "grp": "support"
    },
    {
     "k": "count",
     "hit": "sStar",
     "add": 2
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Radiant Burst": {
   "done": true,
   "txt": "星芒のスキルダメージ +44%・範囲+50%",
   "e": [
    {
     "k": "Bs",
     "raw": 0.44,
     "tags": [
      "star"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Shutout Desire": {
   "done": true,
   "txt": "主力が星芒の付いた敵に当てると、ミネルバの追加ダメージ（1秒に1回。回数は入力、既定は支援スキル1回につき1回）",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "完封欲求",
     "t": "skill",
     "c": 1,
     "edit": true,
     "n": 0,
     "tags": [
      "shutout"
     ],
     "over": {
      "7": 166,
      "8": 184,
      "9": 203
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Optimal Hit Zone": {
   "done": true,
   "txt": "星芒の付いた敵へのスキルダメージ＋（星芒1つごと。最大4重・既定2重、総長の名声があれば4にする）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 4,
     "stk0": 2,
     "over": {
      "7": 28,
      "8": 32,
      "9": 36
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Final Score": {
   "done": true,
   "txt": "星芒の付いた敵1体ごとに星芒の爆発のスキルダメージ＋（最大4重。ボス1体なら1重なので既定1重）",
   "e": [
    {
     "k": "Bs",
     "n": 0,
     "stk": 4,
     "stk0": 1,
     "tags": [
      "star"
     ]
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Star Core Crumbled": {
   "done": true,
   "txt": "星芒のダメージで流星。主力が触れると星芒+1、8秒間 主力の攻撃力 +18%（値は控えのとおり）",
   "e": [
    {
     "k": "atkPct",
     "raw": 0.18,
     "to": "main"
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Perfect Arc": {
   "done": true,
   "txt": "支援スキルのとき、追加ダメージ4回と星芒",
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "ジャストミート",
     "t": "skill",
     "c": 4,
     "edit": true,
     "n": 0,
     "tags": [
      "arc"
     ],
     "over": {
      "9": 727
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Fervent Applause": {
   "done": true,
   "txt": "星芒のダメージから8秒間、範囲内の主力の攻撃力＋（8重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main",
     "stk": 8,
     "over": {
      "7": 28,
      "8": 32,
      "9": 36
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Three Base Hit": {
   "done": true,
   "txt": "支援スキルが3体以上に当たると、クールタイム-3秒・8秒間 チーム全員の攻撃力＋（ボス1体を想定して既定は反映しない）",
   "off": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "over": {
      "7": 97,
      "8": 110,
      "9": 123
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Radiant Synergy": {
   "done": true,
   "txt": "光属性の味方1人ごとに、チーム全員の攻撃力＋（3重まで）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "perLux": true
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Ashwind's Wrath": {
   "done": true,
   "txt": "必殺技で光明を付与／支援スキルのあと、次の必殺技のダメージ＋（3重）",
   "e": [
    {
     "k": "Bu",
     "n": 0,
     "stk": 3,
     "over": {
      "7": 42,
      "8": 48,
      "9": 53
     }
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Home Run State": {
   "done": true,
   "txt": "ミネルバの攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "素質の確認（2026-11-13）の値で作成"
  },
  "Oath Satellite": {
   "done": true,
   "txt": "主力にシールド（火力に入れない）",
   "e": [],
   "note": "2026-11-14 火力に関係しない"
  }
 },
 "Suguha": {
  "Total Station": {
   "done": true,
   "txt": "主力スキルの観測点が出なくなる（弾丸を外す）。通常攻撃が当たるたびにセオドライト1個、3個でグランドアンカー（攻撃力の332%の通常攻撃ダメージ。通常攻撃が当たる回数÷3）。その攻撃の倍率 +50%",
   "e": [
    {
     "k": "drop",
     "hit": "mObs"
    },
    {
     "k": "extra",
     "group": "basic",
     "name": "グランドアンカー",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 332,
     "lv": "basic",
     "tags": [
      "basic",
      "anchor"
     ],
     "perTag": "basic",
     "tagDiv": 3
    },
    {
     "k": "mult",
     "raw": 0.5,
     "tags": [
      "anchor"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。「その通常攻撃」はグランドアンカーとみた。主力スキルのセオドライト5個ぶんのアンカーは入れていない。伸びるスキルLvは未確認（通常攻撃とみた）"
  },
  "Piercing Survey": {
   "done": true,
   "txt": "スグハの通常攻撃の倍率 +70%（セオドライトの追加・貫通は火力に入れない）",
   "e": [
    {
     "k": "mult",
     "raw": 0.7,
     "tags": [
      "basic"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。グランドアンカーにも乗るとみた"
  },
  "Surveyor's Intuition": {
   "done": true,
   "txt": "スグハの通常攻撃ダメージ＋。グランドアンカーのとき80%でクリスタルアンカー（通常攻撃ダメージ。アンカー1回につき）。アンカーの消費 -1 は計算に入れない",
   "e": [
    {
     "k": "Bb",
     "n": 0
    },
    {
     "k": "extra",
     "group": "basic",
     "name": "クリスタルアンカー",
     "t": "basic",
     "c": 1,
     "edit": true,
     "tags": [
      "basic",
      "anchor"
     ],
     "perTag": "basic",
     "tagDiv": 3,
     "prob": 0.8,
     "n": 1
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Earth Location": {
   "done": true,
   "txt": "グランドアンカーが当たったあと5秒、敵の地属性被ダメージ＋（10重）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "stk": 10,
     "to": "enemy"
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Earth Resonance": {
   "done": true,
   "txt": "グランドアンカーが地属性の印を発動したあと10秒、スグハの攻撃力＋（10重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 10
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Echo Sounding": {
   "done": true,
   "txt": "通常攻撃でセオドライトが出なくなる。主力スキルのクールタイム -10秒（回数は計算に入れない）。観測点の持続 +20秒（弾丸 3→10発）。観測点の攻撃3回ごとに反響波（攻撃力の287%の通常攻撃ダメージ）",
   "e": [
    {
     "k": "count",
     "hit": "mObs",
     "add": 7
    },
    {
     "k": "extra",
     "group": "main",
     "name": "反響波",
     "t": "basic",
     "c": 3,
     "edit": true,
     "m": 287,
     "lv": "main",
     "tags": [
      "main",
      "obs"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。観測点は主力スキル1回で1つとして計算。伸びるスキルLvは未確認（主力スキルとみた）"
  },
  "Meteor Anchor": {
   "done": true,
   "txt": "観測点の弾丸が1秒ごと・攻撃力の91%に（10秒で10発）。セオドライトを拾うたびに5秒、観測点のダメージ倍率 +5%（10重）",
   "e": [
    {
     "k": "drop",
     "hit": "mObs"
    },
    {
     "k": "extra",
     "group": "main",
     "name": "観測点の弾丸（メテオアンカー）",
     "t": "basic",
     "c": 10,
     "edit": true,
     "m": 91,
     "lv": "main",
     "tags": [
      "main",
      "obs"
     ]
    },
    {
     "k": "mult",
     "raw": 0.05,
     "stk": 10,
     "tags": [
      "obs"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。エコー測深と重ねたときの持続の延長は入れていない。伸びるスキルLvは未確認（主力スキルとみた）"
  },
  "Polygon Survey": {
   "done": true,
   "txt": "観測点の上限数＋。場の観測点1つにつき、観測点の通常攻撃ダメージ＋（1つとして計算）",
   "e": [
    {
     "k": "Bb",
     "n": 1,
     "tags": [
      "obs"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Terrain Update": {
   "done": true,
   "txt": "観測点の範囲内の敵の地属性被ダメージ＋（3重）",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "stk": 3,
     "to": "enemy"
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Observation Boost": {
   "done": true,
   "txt": "観測点がダメージを与えたあと10秒、観測点の攻撃力＋（3重）",
   "e": [
    {
     "k": "atkPctHit",
     "n": 0,
     "stk": 3,
     "tags": [
      "obs"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Survey Team Link": {
   "done": true,
   "txt": "地属性の味方1人につき、スグハの通常攻撃ダメージ＋",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "perLux": true
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Traverse Step": {
   "done": true,
   "txt": "回避回数+1。回避のあと8秒、スグハの攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 1
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定",
   "off": true
  },
  "Atlas's Grace": {
   "done": true,
   "txt": "必殺技が地属性の印を発動できる。必殺技のあと25秒、スグハの攻撃力＋",
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定",
   "off": true
  },
  "Feedback": {
   "done": true,
   "txt": "必殺技が当たったあと20秒、スグハの攻撃力＋（3重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 3
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定",
   "off": true
  },
  "Terrain Mastery": {
   "done": true,
   "txt": "スグハの必殺技ダメージ＋（ダメージの間隔の短縮は回数が分からないので入れない）",
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Guidepost for Friends": {
   "done": true,
   "txt": "必殺技がクールタイム中かSPが満タンでないとき、地属性のアタッカー・バランサーの通常攻撃ダメージ＋。主力がスグハの必殺技の範囲内にいるとき、さらに＋（必殺技のあとなので既定は反映しない部分は入れていない）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "to": "luxAB"
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定。説明文の数字は改行で「1」「3%」に分かれていたので13%と読んだ"
  },
  "Alidade Sight": {
   "done": true,
   "txt": "観測点の持続 +10秒・同時に2つ。ただし観測点は1つしか置けないので（ゲームで確認）、支援スキルのCD14秒ごとに置き直す14秒分＝レーダーマップ 5→7回。全員が地属性のとき、レーダーマップが当たったあと3秒、敵の地属性被ダメージ +6.7%（3重）",
   "e": [
    {
     "k": "count",
     "hit": "sRadar",
     "add": 2
    },
    {
     "k": "taken",
     "raw": 0.067,
     "stk": 3,
     "to": "enemy",
     "cond": "allLux"
    }
   ],
   "note": "レーダーマップが当たるたびに効果時間が延びて上限まで重なる（2026-11-13 ユーザーの実測: 1発ごとに増えて6〜7発目から一定）。ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。レーダーマップの間隔の短縮は、どれだけ短くなるか書かれていないので入れていない。2026-11-13 ユーザーのビルド（スパクル・スグハ・レイセン）で、観測点は1つしか置けないと確認"
  },
  "Calibration": {
   "done": true,
   "txt": "支援スキルのたびに観測点を1段階強化し、レーダーマップの倍率 +14%（時間で消えない・4重）。実測で1重→2重が ×1.219 だったので、段階強化の分も同じだけあるとみて、1重 +28% で計算（仮）",
   "e": [
    {
     "k": "mult",
     "raw": 0.28,
     "stk": 4,
     "tags": [
      "radar"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。観測点の段階強化の中身は書かれていない。2026-11-13 ユーザーの実測（QgeoK8h のビルド）: レーダーマップの止まる値が 支援スキル1回目 467,710 → 2回目 570,021（×1.219）。+14% の足し算だけだと ×1.123 なので、1重あたり +28%（説明文の倍）で仮に合わせた。3回目・4回目の値で確かめる"
  },
  "Boost Scan": {
   "done": true,
   "txt": "観測点が1秒ごとにスキャニング（10秒で10回ふえる）。スキャニングが当たったあと4秒、スキャニングと測量マーカーの倍率 +13.9%（3重）。測量マーカーのダメージは入れていない",
   "e": [
    {
     "k": "count",
     "hit": "sScan",
     "add": 10
    },
    {
     "k": "mult",
     "raw": 0.139,
     "stk": 3,
     "tags": [
      "scan"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成"
  },
  "Blast Survey": {
   "done": true,
   "txt": "レーダーマップが出なくなる。スキャニングが攻撃力の786%に。スキャニングと測量マーカーの会心率 +20%。測量マーカーのダメージは入れていない",
   "e": [
    {
     "k": "drop",
     "hit": "sRadar"
    },
    {
     "k": "drop",
     "hit": "sScan"
    },
    {
     "k": "extra",
     "group": "support",
     "name": "スキャニング（発破調査）",
     "t": "basic",
     "c": 1,
     "edit": true,
     "m": 786,
     "lv": "support",
     "tags": [
      "support",
      "scan"
     ]
    },
    {
     "k": "critRate",
     "raw": 0.2,
     "tags": [
      "scan"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（スキルLv10時点、2026-11-13）で作成。ブーストスキャンと重ねたときの回数は入れていない。伸びるスキルLvは未確認（支援スキルとみた）"
  },
  "Bird's-Eye Study": {
   "done": true,
   "txt": "支援スキルのたびに観測点を2段階強化。レーダーマップが当たったあと3秒、レーダーマップの地属性ダメージ＋（5重）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "stk": 5,
     "tags": [
      "radar"
     ]
    }
   ],
   "note": "レーダーマップが当たるたびに効果時間が延びて上限まで重なる（2026-11-13 ユーザーの実測: 1発ごとに増えて6〜7発目から一定）。ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Terrain Analysis": {
   "done": true,
   "txt": "全員が地属性のとき、観測点を出したあと15秒、レーダーマップの範囲内の敵の印被ダメージ＋",
   "e": [
    {
     "k": "takenMark",
     "n": 0,
     "to": "enemy",
     "cond": "allLux",
     "over": {
      "9": 384
     }
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定。Lv9 = 384%（Max）は X でもらった画面（2026-11-14）。Lv7・8 は直前の差で延長（推定）"
  },
  "Stepwise Mapping": {
   "done": true,
   "txt": "観測点が2段階強化されると、レーダーマップの通常攻撃ダメージ＋（強化されている前提）",
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "tags": [
      "radar"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Extra Marker": {
   "done": true,
   "txt": "スキャニングと測量マーカーの地属性ダメージ＋・通常攻撃の会心ダメージ＋（測量マーカーのダメージ・付与数は入れていない）",
   "e": [
    {
     "k": "W",
     "n": 0,
     "tags": [
      "scan"
     ]
    },
    {
     "k": "critDmg",
     "n": 1,
     "tags": [
      "scan"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "New Route": {
   "done": true,
   "txt": "スキャニングと測量マーカーの会心率＋・通常攻撃ダメージ＋（測量マーカーの追加は入れていない）",
   "e": [
    {
     "k": "critRate",
     "n": 0,
     "tags": [
      "scan"
     ]
    },
    {
     "k": "Bb",
     "n": 1,
     "tags": [
      "scan"
     ]
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Erosion Watch": {
   "done": true,
   "txt": "全員が地属性のとき、測量マーカーが当たったあと3秒、敵の地属性被ダメージ＋（3重）。地属性が1人だけのときの効果（チームの通常攻撃ダメージ＋・被ダメージ6重）は入れていない",
   "e": [
    {
     "k": "taken",
     "n": 0,
     "stk": 3,
     "to": "enemy",
     "cond": "allLux"
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Romance of Adventure": {
   "done": true,
   "txt": "全員が地属性のとき、チーム全体の攻撃力＋。地属性が1人だけのときの効果（攻撃力＋・スグハの通常攻撃ダメージ＋）は入れていない",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "cond": "allLux",
     "over": {
      "9": 87
     }
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定。Lv9（X でもらった画面・2026-11-14）は 全員が地属性 87%・地属性が1人だけ 58% と スグハの通常攻撃 63%（いずれも Max）。87・58 は Lv6 からの延長と一致。63 は Lv6 の 55% から延長した 79.6% と合わず、Lv6 の値（55）が違う可能性あり（未確認・計算には使っていない効果）"
  },
  "Leyline Use": {
   "done": true,
   "txt": "スグハが地属性の印：地脈を付与したあと3秒、スグハの攻撃力＋（3重）",
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "stk": 3
    }
   ],
   "note": "レーダーマップが当たるたびに効果時間が延びて上限まで重なる（2026-11-13 ユーザーの実測: 1発ごとに増えて6〜7発目から一定）。ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定"
  },
  "Child of Surveying": {
   "done": true,
   "txt": "必殺技が地脈を付与できる。必殺技が当たったあと25秒、スグハの地属性ダメージ＋",
   "e": [
    {
     "k": "W",
     "n": 0
    }
   ],
   "note": "ゲームの素質プレビュー（2026-11-13）で作成。Lv1・Lv6 は画面の値、Lv2〜5 は推定",
   "off": true
  }
 }
};
