// 素質の確認（/edit で「合ってる」などを押して書き出し、チャットに貼ってもらったもの）。ゲームの画面と比べた結果で、Claude が効果に反映済み。
// キー: 巡遊者の英語名 → 素質の英語名 → { st: ok|diff|unk, at: 日付, g: 違った数字, memo }。/edit はこれを確認済みとして数える（ブラウザの確認はこの上に重ねる）
window.POT_CHECK = {
 "Nazuna": {
  "Small Force": {
   "st": "ok",
   "at": "2026-10-29"
  },
  "Wobble Dance": {
   "st": "ok",
   "at": "2026-10-29"
  }
 },
 "Chitose": {
  "Serpent's Glide": {
   "st": "unk",
   "at": "2026-11-05",
   "memo": "生成した騰蛇は水属性の印を発動させることができる。が末尾に追加されている。"
  },
  "Mirror Blade": {
   "st": "unk",
   "at": "2026-11-05",
   "memo": "主力スキル発動後、12秒間、通常攻撃時にチトセの60%のダメージ倍率を持つ鏡影を生成し、鏡影が通常攻撃を行うようになる。この間、中断耐性が上昇する。"
  },
  "Cascade of Ruin": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Against the Flow": {
   "st": "unk",
   "at": "2026-11-05",
   "memo": "50%ダメージ倍率を持つ鏡影を生成するようになる。"
  },
  "Aqueous Phantasm": {
   "st": "diff",
   "at": "2026-11-05",
   "g": {
    "0": {
     "1": "37",
     "6": "148"
    }
   },
   "memo": "それぞれx2"
  },
  "Tremble and Fall": {
   "st": "unk",
   "at": "2026-11-05",
   "memo": "最終撃が最襲撃になってるとこがある"
  },
  "Dance of Elegance": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Flowing Circle": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Serpent in Tide": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Returning Tide": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Azure Embrace": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Waltz of Ripples": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Adamant Scales": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Serpent's Saliva": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Serpent Dance": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Tide of Serpent Bones": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Submerged Fang": {
   "st": "unk",
   "at": "2026-11-05",
   "memo": "チトセの支援スキルは連撃の会心率が15%上昇し、連撃の回数が2回増加するようになる。"
  },
  "Whirl Blade": {
   "st": "diff",
   "at": "2026-11-05",
   "g": {
    "1": {
     "1": "4.3"
    }
   },
   "memo": "x4"
  },
  "Blade of the Deep": {
   "st": "diff",
   "at": "2026-11-05",
   "g": {
    "0": {
     "1": "48"
    }
   }
  },
  "Where Shadows Drown": {
   "st": "diff",
   "at": "2026-11-05",
   "g": {
    "0": {
     "1": "34.9"
    }
   }
  },
  "Luminous Blade Song": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Blink Combo Slash": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Sing with Steel": {
   "st": "ok",
   "at": "2026-11-05"
  },
  "Shattered Breath": {
   "st": "unk",
   "at": "2026-11-05",
   "memo": "鏡影はHPが70%未満の敵に与えるスキルダメージが138%増加する。"
  }
 },
 "Eleanor": {
  "Tactical Protocol: Threshold": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Tactical Protocol: Detonation": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Tactical Protocol: Overload": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Double Rifts": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Battle Fury": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Vortex Boost": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Area Volley": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Zone Detection": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Chain Echo": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Wind Bond": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Annihilation Pulse": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Flicker Sequence": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Reinforcement Command": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Purge Command": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Focus Command": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Chain Detonation": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Seismic Spread": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Field Pull": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Power Boost": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Shattering Blow": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Piercing Trajectory": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Suppression Analysis": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Precision Calibration": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Annihilation Echo": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Wind Resonance": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Power Amp": {
   "st": "ok",
   "at": "2026-11-06"
  },
  "Tactical Protocol: Synergy": {
   "st": "diff",
   "at": "2026-11-06",
   "g": {
    "0": {
     "1": "193"
    }
   }
  },
  "Function Sustain": {
   "st": "diff",
   "at": "2026-11-06",
   "g": {
    "1": {
     "1": "13.8"
    }
   }
  },
  "Cluster Barrage": {
   "st": "diff",
   "at": "2026-11-06",
   "g": {
    "0": {
     "1": "296"
    }
   }
  }
 }
};
