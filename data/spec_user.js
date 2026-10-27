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
     "name": "波の追加（Cascade Strike）",
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
   "verified": "日本語Wiki（ゲーム内の文章）"
  },
  "Cordiality": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "stk": 5
    }
   ],
   "txt": "スキルダメージを与えると、全員の攻撃力 +（6秒・最大5重）"
  },
  "Magic Sword Smack": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "靭性削りの効率（火力に影響なし）"
  },
  "Muddy Engulf": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "taken",
     "n": 1,
     "to": "enemy"
    }
   ],
   "txt": "スキルダメージを与えると、敵の水被ダメージ +（6秒）。靭性が壊れていない敵の値を使う",
   "note": "靭性が壊れている敵は、番号0の値"
  },
  "Stream: Cloud Ring": {
   "done": true,
   "draft": false,
   "e": [
    {
     "k": "extra",
     "group": "main",
     "name": "波（Cloud Ring）",
     "t": "skill",
     "c": 1,
     "edit": true,
     "m": 112
    }
   ],
   "txt": "魔盾を得たとき、波 112%（スキル）。回数は仮に1回",
   "verified": "日本語Wiki（ゲーム内の文章）"
  },
  "Stream: Drip's Overturn": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "エネルギーの付与（火力に影響なし）"
  },
  "Restarting": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "魔盾の付与（火力に影響なし）"
  },
  "Guardsman Blessing": {
   "done": true,
   "draft": true,
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
   "note": "データの数値表が空だったので、文章の値を入れた"
  },
  "Magic Sword Siphoning": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "Bs",
     "n": 0
    }
   ],
   "txt": "スキルダメージ +"
  },
  "Unbreakable Bond": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all",
     "perLux": true
    }
   ],
   "txt": "水属性の巡遊者の人数 × 全員の攻撃力 +"
  },
  "Power Strike": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "スタン（火力に影響なし）"
  },
  "Magic Shield Enhancement": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "Bb",
     "n": 0
    }
   ],
   "txt": "魔盾を得たとき、通常攻撃ダメージ +（8秒）"
  },
  "Wave Breaker": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "taken",
     "n": 0,
     "to": "enemy"
    }
   ],
   "txt": "敵の水属性被ダメージ +（必殺技が当たったとき）"
  },
  "Power Unbound": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "必殺技の発動時、全員の攻撃力 +（20秒）"
  },
  "Demonic Devour": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "Bu",
     "n": 0
    }
   ],
   "txt": "必殺技ダメージ +（印が付いた敵）"
  },
  "Surge: Infinite": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "raw": 0.219,
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "txt": "魔盾の間、水属性の主力の攻撃力 +21.9%"
  },
  "Surge: Ripple": {
   "done": true,
   "draft": false,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "波（Surge: Ripple）",
     "t": "skill",
     "c": 10,
     "edit": true,
     "m": 77
    }
   ],
   "txt": "魔盾の間、主力がダメージを与えると波 77%（スキル・0.5秒に1回）。回数は仮に10回",
   "verified": "日本語Wiki（ゲーム内の文章）"
  },
  "Isn't It Awesome!": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main",
     "cond": "mainSame"
    }
   ],
   "txt": "魔盾の間、水属性の主力の攻撃力 +"
  },
  "Hold On!": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main"
    }
   ],
   "txt": "魔盾の間、主力の攻撃力 +"
  },
  "I'll Protect You!": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "吸収量（火力に影響なし）"
  },
  "Surge: Immortality": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "水の領域の継続時間 +67%（ヒット回数の増加は、技の構造の登録後に反映）",
   "note": "領域のヒット回数が増える効果。技の構造の登録後に入力"
  },
  "Surge: Thunderbolt": {
   "done": true,
   "draft": true,
   "e": [],
   "txt": "水の領域の倍率 +44%（技の構造の登録後に反映）",
   "note": "領域のヒットの倍率が増える効果。技の構造の登録後に入力"
  },
  "Let Me Help!": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "Bb",
     "n": 0,
     "to": "lux",
     "stk": 5
    }
   ],
   "txt": "領域内の水属性の通常攻撃ダメージ +（毎秒・最大5重）"
  },
  "Stay Away!": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "main",
     "stk": 10
    }
   ],
   "txt": "領域がダメージを与えると、主力の攻撃力 +（6秒・最大10重）／領域の間隔 −50%",
   "note": "領域の間隔の短縮（ヒット回数の増加）は、技の構造の登録後に入力"
  },
  "How About This!": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "extra",
     "group": "support",
     "name": "間欠泉（How About This）",
     "t": "skill",
     "c": 5,
     "edit": true,
     "n": 0
    }
   ],
   "txt": "領域内の水属性の主力がダメージを与えると、50%で間欠泉（スキル）。回数は仮に5回"
  },
  "Shortcut Seeker": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "lux"
    }
   ],
   "txt": "水属性の巡遊者の攻撃力 +"
  },
  "Band-aid Collector": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0,
     "to": "all"
    }
   ],
   "txt": "テレサが場にいるとき、全員の攻撃力 +"
  },
  "Magic Sword Wielder": {
   "done": true,
   "draft": true,
   "e": [
    {
     "k": "atkPct",
     "n": 0
    }
   ],
   "txt": "テレサの攻撃力 +"
  }
 }
};
