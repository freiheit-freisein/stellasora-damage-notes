// 汎用計算ページ（sim.html）のデータ。心相は「段階」（0〜50。星5は10ずつ、星4は5ずつ。10段階=1凸）で持ち、ステータスの表は 5段階=1つ分（0〜10）で引く。talentBonus は1つ分(5段階)あたりのダメージ種別の加算。
// 検証済みの式を使うキャラ6人と敵2体。
// ヒットの定義: s=スキル番号(0通常 1主力 2支援 3必殺) / n=Wikiの倍率配列の番号 / c=ヒット数 / t=種別(basic通常・skill スキル・ult必殺・mark印) / name
// 倍率はスキルレベルごとにWiki(data/trekkers.js)の nums から取る。Lv11以上は平均の傾きで延長（セイナ主力 Lv13=123 と一致を確認、推定）。
window.SIM = window.SIM || {};
(function (S) {
  S.EL_JP = { Ventus: "風", Aqua: "水", Lux: "光", Ignis: "火", Terra: "地", Umbra: "闇" };
  const H = (s, n, c, t, name, id, tags) => ({ s, n, c, t, name, id, tags: tags || [] });

  S.CH = [
    { id: "willow", en: "Suntide Willow", jp: "ウィロー（水着）", el: "水", ref: "atk", role: "サポーター", trust0: 26, talent0: 50, talentBonus: { skill: 0.021, ult: 0.043 },
      hits: {
        basic: [H(0, 0, 3, "basic", "バブルガン 1〜3撃目", "b13", ["basic", "bubbleShot"]), H(0, 1, 1, "basic", "バブルガン 4撃目", "b4", ["basic", "bubbleShot"])],
        main: [H(1, 0, 1, "skill", "バブルフロッグ（着地ごと）", "frog", ["frog", "frogJump"])],
        support: [H(2, 0, 1, "skill", "海上の戯れ 初撃", "sDive", ["support"]), H(2, 1, 1, "skill", "バブルエリア（3秒ごと・1回分）", "sArea", ["support", "bubbleArea"]), H(2, 2, 1, "skill", "追従バブル（1発）", "sBubble", ["support", "followBubble"])],
        ult: [H(3, 0, 7, "ult", "必殺 連続攻撃", "u1", ["ult"]), H(3, 1, 1, "ult", "必殺 フィニッシュ", "u2", ["ult"])],
      } },
    { id: "nazuka", en: "Nazuka", jp: "ナツカ", el: "風", ref: "atk", role: "バランサー", trust0: 17, talent0: 0, talentBonus: {},
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 1, "basic", "2撃目"), H(0, 2, 3, "basic", "3撃目")],
        main: [H(1, 0, 7, "skill", "風車の風", "mWind", ["main"])],
        support: [H(2, 0, 1, "skill", "花のオーブ（追撃の1発）", "orb", ["orb"]), H(2, 1, 6, "skill", "花の海（毎秒・6秒間）", "sea", ["sea"]), H(2, 2, 6, "skill", "花びら（6枚）", "petal", ["petal"])],
        ult: [H(3, 0, 3, "ult", "竜巻（3つ・3秒ごと1回分）")],
      } },
    { id: "eleanor", en: "Eleanor", jp: "エレノア", el: "風", ref: "atk", role: "バランサー", trust0: 20, talent0: 0, talentBonus: {},
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 5, "basic", "2撃目"), H(0, 2, 5, "basic", "3撃目"), H(0, 3, 6, "basic", "4撃目"), H(0, 4, 7, "basic", "5撃目")],
        main: [H(1, 0, 2, "skill", "回転"), H(1, 1, 1, "skill", "歩哨（1回分）", "vigil", ["vigil"])],   // 歩哨＝警戒（ワイドブルーム・令嬢戦術：嵐花の対象）
        support: [H(2, 0, 9, "skill", "跳びはね爆発", "jump", ["jump"]), H(2, 1, 1, "basic", "ドローンの弾（通常攻撃扱い・1発）", "drone", ["drone"])],
        ult: [H(3, 0, 14, "ult", "ロケット弾")],
      } },
    { id: "noya", en: "Firstlight Noya", jp: "セイナ(原点)", el: "光", ref: "hp", role: "ヴァンガード", trust0: 18, talent0: 20, talentBonus: { basic: 0.021, skill: 0.021, elem: 0.015, crit: 0.03 },
      // Wikiにステータスが無いので、基礎値は手元の画面の値。信頼・心相の表は他のキャラの表を流用（要確認）。
      manual: { baseHp: 94662, baseAtk: 6966, tables: "Nazuka", talent: { hp: 690, atk: 0 } },
      // 突進は「最大HPの85%×3の光属性のスキルダメージ」（ゲームのスキル画面で確認・2026-11-04）。以前は光チームのページに合わせて「通常攻撃×1」にしていた。
      hits: {
        basic: [H(0, 0, 2, "basic", "1撃目", "b1", ["great"]), H(0, 1, 3, "basic", "2撃目", "b2", ["great"]), H(0, 2, 2, "basic", "3撃目", "b3", ["great"]),
          H(0, 3, 2, "skill", "4撃目 光刃", "glow4", ["glow", "long"]), H(0, 4, 3, "skill", "突進（長剣）", "sprint", ["long"])],
        main: [H(1, 0, 5, "skill", "主力スキル 長剣", "mLong", ["long"]), H(1, 1, 1, "basic", "主力スキル 大剣", "mGreat", ["great"]), H(1, 2, 1, "basic", "主力スキル 星雷", "mStar", ["starfall"]),
          { s: -1, fixed: 70, c: 1, t: "mark", name: "印ダメージ（ルーセント）", tags: [] }],
        support: [H(2, 0, 8, "skill", "支援 長剣", "sLong", ["long"]), H(2, 1, 6, "basic", "衝撃波 連続", "sField", ["great"]), H(2, 2, 1, "basic", "衝撃波 最後", "sLast", ["great"])],
        ult: [H(3, 0, 5, "basic", "必殺 大剣形態 連撃", "uG1", ["great"]), H(3, 1, 1, "basic", "必殺 大剣形態 最後", "uG2", ["great"]), H(3, 2, 7, "skill", "必殺 長剣形態 連撃", "uL1", ["long"]),
          H(3, 3, 7, "skill", "必殺 長剣形態 天剣陣", "uL2", ["long"]), { s: -1, fixed: 70, c: 1, t: "mark", name: "印ダメージ（ルーセント）", tags: [] }],
      } },
    { id: "firefly", en: "Firefly", jp: "ホタル", el: "光", ref: "atk", role: "バランサー", trust0: 4, talent0: 20, talentBonus: { skill: 0.021 },
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目", "f1"), H(0, 1, 1, "basic", "2撃目", "f2"), H(0, 2, 4, "basic", "3撃目", "f3")],
        main: [H(1, 0, 1, "skill", "浮遊砲（1発）", "cannon", ["cannon"])],
        support: [H(2, 0, 1, "basic", "ソードフォーム 1撃目", "sw1", ["giant"]), H(2, 1, 1, "basic", "2撃目", "sw2", ["giant"]), H(2, 2, 1, "basic", "3撃目", "sw3", ["giant"]),
          H(2, 3, 5, "basic", "4撃目", "sw4", ["giant"]), H(2, 4, 1, "skill", "飛ぶ刃（1発）", "blade", ["blade"])],
        // 砲撃は2回撃ち、1回あたり2ヒット＝4ヒット（実測: ゲームの表示1つが2ヒットの合計。2026-10-29）
        ult: [H(3, 0, 4, "ult", "砲撃（1発）", "u1"), H(3, 1, 1, "ult", "斬撃 1", "u2"), H(3, 2, 1, "ult", "斬撃 2", "u3")],
      } },
    { id: "tilia", en: "Tilia", jp: "ティリア", el: "光", ref: "atk", role: "サポーター", trust0: 15, talent0: 50, talentBonus: { skill: 0.021, ult: 0.043 },
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目"), H(0, 1, 1, "basic", "2撃目"), H(0, 2, 1, "basic", "3撃目"), H(0, 3, 1, "basic", "4撃目")],
        main: [H(1, 0, 1, "skill", "反撃", "counter")],
        support: [H(2, 0, 6, "skill", "盾（1回跳ねるごと）", "shield")],
        ult: [H(3, 0, 1, "ult", "叩きつけ"), H(3, 1, 1, "skill", "光球")],
      } },
    // エリー（2026-11-12）。自動のヒットでは一掃・粛清の区別がなかったので、素質の効き先（一掃・粛清・スイープスラッシュなど）が分かるように手で書く
    { id: "allie", en: "Allie", jp: "エリー", el: "水", ref: "atk", role: "ヴァンガード", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "1段目 1撃目", "b1", ["basic"]), H(0, 1, 1, "basic", "1段目 2撃目", "b2", ["basic"]), H(0, 2, 1, "basic", "2段目", "b3", ["basic"]), H(0, 3, 2, "basic", "3段目×2", "b4", ["basic"]),
          H(0, 4, 1, "basic", "4段目 1撃目", "b5", ["basic"]), H(0, 5, 1, "basic", "4段目 2撃目", "b6", ["basic"]), H(0, 6, 1, "basic", "4段目 3撃目", "b7", ["basic"]), H(0, 7, 1, "basic", "5段目", "b8", ["basic"])],
        main: [H(1, 0, 3, "skill", "ママのしつけ 前半×3", "m1", ["main", "shitsuke"]), H(1, 1, 3, "skill", "ママのしつけ 後半×3", "m2", ["main", "shitsuke"])],
        support: [H(2, 0, 4, "skill", "スイープスラッシュ×4", "sSweep", ["support", "sweepSlash"]), H(2, 1, 1, "skill", "アイシクルスラッシュ", "sIcicle", ["support", "icicle"]), H(2, 2, 1, "skill", "氷晶", "sCrystal", ["support", "crystal"])],
        ult: [H(3, 0, 1, "ult", "一掃（1段目）", "uDust", ["ult", "dust"]), H(3, 2, 1, "ult", "粛清（2段目）", "uPurge", ["ult", "purge"])],
      } },
    // トーナ（2026-11-13）。自動のヒットでは支援スキルの矢とカスケードルートの区別がなかったので、素質の効き先が分かるように手で書く。主力スキルは4秒ごと・12秒間で3回、必殺技は13回（ゲームで13発を確認・2026-11-14）
    { id: "donna", en: "Donna", jp: "トーナ", el: "水", ref: "atk", role: "バランサー", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "通常攻撃", "b1", ["basic"]), H(0, 1, 1, "basic", "通常攻撃（速達状態）", "b2", ["basic", "agile"])],
        main: [H(1, 0, 3, "skill", "呼び込みトーナちゃん（4秒ごと・12秒間）", "mDoll", ["main", "minion"])],
        support: [H(2, 0, 1, "skill", "スプラッシュアロー 1本目", "sA1", ["support", "arrow"]), H(2, 1, 2, "skill", "スプラッシュアロー 2〜3本目", "sA2", ["support", "arrow"]), H(2, 2, 3, "skill", "スプラッシュアロー 4〜6本目", "sA3", ["support", "arrow"]),
          H(2, 3, 2, "skill", "スプラッシュアロー 7〜8本目", "sA4", ["support", "arrow"]), H(2, 4, 1, "skill", "スプラッシュアロー 9本目", "sA5", ["support", "arrow"]), H(2, 5, 1, "skill", "カスケードルート", "sCascade", ["support", "cascade"])],
        ult: [H(3, 0, 13, "ult", "アローレイン（0.5秒ごと・6秒間。最初の1発を入れて13回）", "uRain", ["ult"])],
      } },
    // シャトン・フリージア・ミネルバ（2026-11-13）。素質の効き先（ネコ神爆弾・魔痕・貫通弾・星芒など）が分かるように手で書く。繰り返しの回数は説明文の秒数から（例: 0.3秒ごと・3秒間 = 10回）
    { id: "chaton", en: "Chaton", jp: "シャトン", el: "火", ref: "atk", role: "ヴァンガード", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "オートトリガー", "bAuto", ["basic"]), H(0, 1, 1, "ult", "インフィニティフレア（魔眼解放中）", "bFlare", ["basic", "flare"])],
        main: [H(1, 0, 1, "skill", "ポジトロンシュート（空に堕ちる焔・タップ）", "mShot", ["main", "fall"]), H(1, 1, 1, "skill", "魔痕（2秒ごと・1回分）", "mScar", ["main", "scar"]),
          H(1, 2, 2, "skill", "ネコ神爆弾×2（ネコ神への祈り・長押し）", "mBomb", ["main", "bomb"])],
        support: [H(2, 0, 3, "skill", "貫通弾（ローリング×3）", "sRoll", ["support", "pierce", "roll"])],
        ult: [H(3, 0, 8, "ult", "掃射×8", "uSweep", ["ult", "sweep"]), H(3, 1, 1, "ult", "アビスグレアの爆発", "uGlare", ["ult", "glare"])],
      } },
    { id: "freesia", en: "Freesia", jp: "フリージア", el: "水", ref: "atk", role: "バランサー", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目", "b1", ["basic", "normal"]), H(0, 1, 1, "basic", "2撃目", "b2", ["basic", "normal"]), H(0, 2, 2, "basic", "3撃目×2", "b3", ["basic", "normal"]),
          H(0, 3, 3, "basic", "4撃目×3", "b4", ["basic", "normal"]), H(0, 4, 1, "basic", "5撃目", "b5", ["basic", "normal"]),
          H(0, 5, 2, "basic", "狂化 1撃目×2", "k1", ["basic", "berserk"]), H(0, 6, 2, "basic", "狂化 2撃目×2", "k2", ["basic", "berserk"]), H(0, 7, 1, "basic", "狂化 3撃目", "k3", ["basic", "berserk"]),
          H(0, 8, 4, "basic", "狂化 3撃目×4", "k4", ["basic", "berserk"]), H(0, 9, 1, "basic", "狂化 3撃目（最後）", "k5", ["basic", "berserk"])],
        main: [H(1, 0, 12, "skill", "旋風斬り（0.3秒ごと・最大チャージ3.6秒）", "mSwirl", ["main"])],
        support: [H(2, 0, 1, "skill", "氷華", "sFlower", ["support", "flower"]), H(2, 1, 1, "skill", "氷華の爆発", "sBurst", ["support", "flower"])],
        ult: [H(3, 0, 1, "ult", "咆哮 1", "u1", ["ult"]), H(3, 1, 1, "ult", "咆哮 2", "u2", ["ult"]), H(3, 2, 1, "ult", "咆哮 3", "u3", ["ult"])],
      } },
    // レイセン・ラール（聖夜）（2026-11-13）。素質の効き先（種子・種子の雨・種球、ウィップコマンド・おもちゃ・プレゼント砲弾など）が分かるように手で書く
    { id: "ridge", en: "Ridge", jp: "レイセン", el: "地", ref: "atk", role: "バランサー", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "エネルギー弾", "bBullet", ["basic", "bullet"]), H(0, 1, 1, "basic", "シャベル砲（近くの敵）", "bShovel", ["basic"])],
        main: [H(1, 0, 1, "skill", "シャベル砲", "mShovel", ["main"]), H(1, 1, 1, "skill", "種子", "mSeed", ["main", "seed"])],
        support: [H(2, 0, 6, "skill", "種子の雨×6", "sRain", ["support", "rain"]), H(2, 1, 1, "skill", "種球", "sBulb", ["support", "bulb"])],
        ult: [H(3, 0, 5, "ult", "連続攻撃×5", "u1", ["ult"]), H(3, 1, 1, "ult", "最終撃", "u2", ["ult", "final"])],
      } },
    { id: "snowish_laru", en: "Snowish Laru", jp: "ラール（聖夜）", el: "火", ref: "atk", role: "バランサー", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目", "b1", ["basic"]), H(0, 1, 1, "basic", "2撃目", "b2", ["basic"]), H(0, 2, 1, "basic", "3撃目", "b3", ["basic"]),
          H(0, 3, 5, "basic", "4撃目×5", "b4", ["basic"]), H(0, 4, 3, "basic", "5撃目×3", "b5", ["basic"]),
          H(0, 5, 1, "skill", "クルミ大佐の攻撃（従者）", "bKurumi", ["basic", "minion", "kurumi"]), H(0, 6, 2, "skill", "巻き毛将軍の攻撃×2（従者）", "bGeneral", ["basic", "minion", "general"])],
        main: [H(1, 0, 1, "skill", "ウィップコマンド", "mWhip", ["main", "whip"]), H(1, 1, 1, "skill", "クルミ大佐の連携作戦（従者）", "mKurumi", ["main", "minion", "kurumi", "coop"]),
          H(1, 2, 2, "skill", "巻き毛将軍の連携作戦×2（従者）", "mGeneral", ["main", "minion", "general", "coop"])],
        support: [H(2, 0, 4, "skill", "プレゼント砲弾×4", "sShell", ["support", "shell"]), H(2, 1, 1, "skill", "プレゼント砲弾の爆発", "sBlast", ["support", "shell", "blast"]),
          H(2, 2, 1, "skill", "クルミ大佐（召喚・従者）", "sKurumi", ["support", "minion", "kurumi"])],
        ult: [H(3, 0, 1, "ult", "ラール人形の銃撃", "uShot", ["ult", "doll"]), H(3, 1, 5, "ult", "キャンディ乱射×5", "uCandy", ["ult", "candy"])],
      } },
    { id: "minova", en: "Minova", jp: "ミネルバ", el: "光", ref: "atk", role: "バランサー", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 1, "basic", "1撃目", "b1", ["basic"]), H(0, 1, 1, "basic", "2撃目", "b2", ["basic"]), H(0, 2, 1, "basic", "3撃目", "b3", ["basic"]),
          H(0, 3, 1, "basic", "4撃目", "b4", ["basic"]), H(0, 4, 6, "basic", "4撃目×6", "b4x", ["basic"]), H(0, 5, 1, "basic", "5撃目", "b5", ["basic", "b5"])],
        main: [H(1, 0, 1, "skill", "バットの一撃", "mBat", ["main"]), H(1, 1, 10, "skill", "二塁打 乱れ打ち（0.3秒ごと・3秒間）", "mDouble", ["main", "double"]), H(1, 2, 1, "skill", "二塁打 強打", "mSmash", ["main", "double"])],
        support: [H(2, 0, 1, "skill", "星光", "sLight", ["support"]), H(2, 1, 2, "skill", "星芒（2つ・1回分ずつ）", "sStar", ["support", "star"])],
        ult: [H(3, 0, 16, "ult", "ウィンドアッシュの攻撃（0.3秒ごと・5秒間）", "uAsh", ["ult"])],
      } },
    // オトハ（2026-11-14）。素質の効き先（催涙雨・轟撃・狐火、花の傘、天誅など）が分かるように手で書く
    //   催涙雨は説明文では「4秒間・0.5秒ごと」だが、8回だと支援スキルだけで主力スキルの十数倍になり不自然なので、確かめるまで1回分
    //   狐火は「6秒間・0.5秒ごと」で12回（説明文の秒数から）。花の傘の回転中の命中は回数が書かれていないので1回分
    { id: "otoha", en: "Otoha", jp: "オトハ", el: "闇", ref: "atk", role: "バランサー", trust0: 0, talent0: 0, talentBonus: {}, v2: true,
      hits: {
        basic: [H(0, 0, 3, "basic", "1撃目×3", "b1", ["basic"]), H(0, 1, 3, "basic", "2撃目×3", "b2", ["basic"]), H(0, 2, 9, "basic", "3撃目×9", "b3", ["basic"])],
        main: [H(1, 0, 1, "skill", "射撃", "mShot", ["main", "nightShot"])],
        support: [H(2, 0, 1, "skill", "催涙雨（1回分）", "sRain", ["support", "tearRain"]), H(2, 1, 12, "skill", "狐火（0.5秒ごと・6秒間）", "sFox", ["support", "foxfire"])],
        ult: [H(3, 0, 1, "ult", "花の傘の回転（命中1回分）", "uSpin", ["ult", "parasol"]), H(3, 1, 1, "ult", "爆発1", "uBlast1", ["ult", "parasol", "parasolBlast"]),
          H(3, 2, 1, "ult", "爆発2", "uBlast2", ["ult", "parasol", "parasolBlast"]), H(3, 3, 1, "ult", "爆発3", "uBlast3", ["ult", "parasol", "parasolBlast"])],
      } },
  ];
  // 残りの巡遊者（自動）: data/sim_chars_auto.js（tools/build_chars.py が英語Wikiのスキルの説明文から作ったヒット）。上の手で書いた定義が優先
  (window.SIM_CHARS_AUTO || []).forEach(c => { if (!S.CH.some(x => x.en === c.en)) S.CH.push(c); });
  // 心相の小さい節のうち、ダメージ系（属性・通常攻撃・スキル・必殺技・会心ダメージ）の値。計算は心相の値（0〜50）を5ごとの段階で持つので、★5は1凸＝2段階（★4は0.5凸＝1段階）。
  // 基礎HP・基礎攻撃・攻撃力%は英語Wikiの表で入っている。ゲームの画面で確かめたものだけ入れる（2026-11-14 チトセ: 1凸ごとに +3%、5凸のステータス画面で水属性ダメージ 115%）
  const TALENT_BONUS_GAME = { Chitose: { elem: 0.015 } };
  S.CH.forEach(c => { const b = TALENT_BONUS_GAME[c.en]; if (b && !Object.keys(c.talentBonus || {}).length) c.talentBonus = Object.assign({}, b); });
  // 自動データの巡遊者に、画面・実測で確かめた値を足す（2026-10-29）
  const patchCh = (id, f) => { const c = S.CH.find(x => x.id === id); if (c) f(c); };
  patchCh("gerie", c => {
    c.talentBonus = { skill: 0.021 };   // 心相ステータスボーナス: スキルダメージ +21%（心相50）
    // 支援スキルで地の印を発動: 攻撃力の125%（スキルLvで変わらない）。スキル1撃目 → 印 → スキル2撃目の順（実測）
    c.hits.support.push({ s: -1, fixed: 125, c: 1, t: "mark", name: "印ダメージ（岩錐）", tags: [] });
    // 支援スキルの2ヒットは「震動波」（鳴動する重罪の +32% の対象）
    c.hits.support.forEach(h => { if (h.t === "skill") h.tags = (h.tags || []).concat("wave"); });
    // 主力スキルの3つ目（毎秒のヒット）は「鉄の牢獄」（肉を喰む鎖・緋色の私刑の対象）
    if (c.hits.main[2]) c.hits.main[2].tags = (c.hits.main[2].tags || []).concat("cage");
  });
  // ナズナ: 素質の対象を分けるタグ（2026-11-06、素質の確認を入れるため）。主力スキル＝ぬいぐるみペンギン、支援スキル＝ペンギン像・ハートアロー・掃射（スキルの説明文）
  patchCh("nazuna", c => {
    c.hits.main.forEach(h => { if (h.n === 0) { h.name = "ぬいぐるみペンギン"; h.tags = (h.tags || []).concat("penguin"); } });
    const nm = { 0: ["ペンギン像（×7）", "statue", "sStatue"], 2: ["ハートアロー", "heart", "sHeart"], 3: ["掃射（×6）", "sweep", "sSweep"] };
    c.hits.support.forEach(h => { const x = nm[h.n]; if (x) { h.name = x[0]; h.tags = (h.tags || []).concat(x[1]); h.id = x[2]; } });
  });
  // チトセ: 素質の対象を分けるタグ（2026-11-06、素質の確認を入れるため）
  patchCh("chitose", c => {
    // 通常攻撃: 1〜5撃目（影隠れの型の瞬刃）と、6撃目＝最終撃（蛟龍の剣舞）
    c.hits.basic.forEach(h => { h.tags = (h.tags || []).concat(h.n >= 7 ? "final" : "s15"); });
    // 主力スキル: 2つ目は流閃・鱗（滝斬の型で強化される）
    const sc = c.hits.main.find(h => h.n === 1); if (sc) { sc.id = "mScale"; sc.tags = (sc.tags || []).concat("scale"); }
    // 支援スキル: 連撃は「3回の連撃（1回 4ヒット）」なので 12ヒット（スキルの説明文。自動の読み取りは1回分の4になっていた）。2つ目は鏡影
    const ru = c.hits.support.find(h => h.n === 0); if (ru) { ru.id = "sRush"; ru.c = 12; ru.name = "連撃（3回×4）"; ru.tags = (ru.tags || []).concat("rush"); }
    const mi = c.hits.support.find(h => h.n === 1); if (mi) { mi.name = "鏡影"; mi.tags = (mi.tags || []).concat("mirror"); }
  });

  // 敵。def=防御倍率、res=属性ごとの耐性（書いていない属性は resDefault、無ければ250）、weak=弱点（表示用）、weakMult=弱点補正。
  // extra は、実測に合わせるために入れた原因不明の倍率（「その他倍率」）。
  // ボス（指名手配・首領討伐）は 2026-10-28 の実測で: 防御の倍率0.5（gistの防御の式で DEF500）、弱点（有効）の属性は耐性250、等倍は耐性750、
  //   耐性の属性は耐性2000。記事の「弱点補正×1.875」は、耐性250と750の倍率の比（0.75÷0.40）のことで、別の枠ではない（weakMult=1）。
  //   根拠: テスト5（信頼Lv21・徽章なし）で 未恋ノ禍実（光が弱点）60,655 と 激流ノ角鯨（光は等倍）32,349 が、どちらも防御0.5000で計算と一致。
  //   光耐性貫通35の効き方: 弱点 ×1.0868（深層ノ主・未恋ノ禍実）＝耐性250の式、等倍 ×1.0846（ストンプクラブ・激流ノ角鯨）＝耐性750の式、どちらも4〜5桁一致。
  const BOSS = { def: 0.5, resDefault: 750, weakMult: 1, extra: {} };
  const RES_WEAK = 250, RES_RESIST = 2000;   // 耐性の属性: 翠煌ノ刃(光)で 徽章なし808・両方（光ダメ122%・貫通145）2,763 が耐性2000の式と一致（gistの第3段の上限）
  S.ENEMIES = [
    Object.assign({ id: "stomp", season: 12, name: "暴走のストンプクラブ（指名手配・水火弱点）", res: { 水: RES_WEAK, 火: RES_WEAK, 地: RES_RESIST }, weak: ["水", "火"], markX: 1.68, hpBonus: 0,
      note: "ボス（防御0.5・弱点の水と火は耐性250・ほかは等倍の750）。テスト3（信頼Lv21）のセイナ(原点)の通常1撃目 77,865（光は等倍）、光貫通35で 86,380（×1.0846＝耐性750の式）。地属性は耐性あり（2026-10-29: ナズナの初段19・グレイの印297。値は耐性2000として計算）。印の倍率は セイナ(光)の実測 ≒1.65〜1.68。" }, BOSS),
    { id: "defense", name: "骸魔防衛戦の雑魚（初段のみ）", def: 1, res: { 光: 250, 水: 250, 風: 250 }, weak: [], weakMult: 1,
      extra: {}, markX: 1, hpBonus: 0, teamHp: 0.15, teamAtk: 0.15, teamCrit: 0.10,
      note: "耐性250・防御1.00（徽章なしのセイナ初段 323,158 が式と完全一致）。全員に 最大HP+15%・攻撃+15%・会心率+10%。雑魚は1撃で倒れるので初段だけ測れる。印の倍率は未確認（1とした）。" },
    Object.assign({ id: "deep", season: 12, name: "深層ノ主（指名手配・風光弱点・闇耐性）", res: { 風: RES_WEAK, 光: RES_WEAK, 闇: RES_RESIST }, weak: ["風", "光"], markX: 1.41, hpBonus: 0.20,
      note: "ボス（防御0.5・弱点の風と光は耐性250・耐性の闇は2000・ほかは750）。テスト3（信頼Lv21）のセイナ(原点)の通常1撃目 167,421、光貫通35で 186,105（×1.0868＝耐性250の式）。主力の最大HP+20%。" }, BOSS),
    Object.assign({ id: "mikoi", name: "未恋ノ禍実（首領討伐・難易度3・光弱点・闇耐性）", res: { 光: RES_WEAK, 闇: RES_RESIST }, weak: ["光"], markX: 1, hpBonus: 0,
      note: "首領討伐。光が有効（耐性250）、闇が耐性。テスト5（信頼Lv21）のセイナ(原点)の通常1撃目 60,655、光貫通35で 68,408（×1.0868）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "suikou", name: "翠煌ノ刃（首領討伐・難易度3・闇弱点・光耐性）", res: { 闇: RES_WEAK, 光: RES_RESIST }, weak: ["闇"], markX: 1, hpBonus: 0,
      note: "首領討伐。闇が有効（耐性250）、光が耐性（2000）。テスト5のセイナ(原点)の通常1撃目 808（徽章なし）、両方の徽章（光ダメ122%・貫通145）で 2,763、70徽章だけ（光ダメ118%・貫通110）で 2,264。最初に測った 1,256・2,186 は取り違え（1,256 は80徽章＝貫通35の予想1,257と一致）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "gekiryu", name: "激流ノ角鯨（首領討伐・難易度3・地弱点・水耐性）", res: { 地: RES_WEAK, 水: RES_RESIST }, weak: ["地"], markX: 1, hpBonus: 0,
      note: "首領討伐。地が有効（耐性250）、水が耐性。光は等倍（750）: テスト5のセイナ(原点)の通常1撃目 32,349、光貫通35で 36,410（×1.0846）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "hasai", name: "破砕ノ牙（首領討伐・難易度3・風弱点・地耐性）", res: { 風: RES_WEAK, 地: RES_RESIST }, weak: ["風"], markX: 1, hpBonus: 0,
      note: "首領討伐。風が有効（耐性250）、地が耐性（2000）、ほかは等倍（750）。防御0.5。実測は未確認（ほかのボスと同じ形として入れた）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "kyoshin", name: "太古ノ巨神兵（首領討伐・難易度3・水弱点・火耐性）", res: { 水: RES_WEAK, 火: RES_RESIST }, weak: ["水"], markX: 1, hpBonus: 0,
      note: "首領討伐。水が有効（耐性250）、火が耐性（2000）、ほかは等倍（750）。防御0.5。実測は未確認（ほかのボスと同じ形として入れた）。印の倍率は未確認（1とした）。" }, BOSS),
    Object.assign({ id: "genwaku", name: "幻惑ノ花（首領討伐・難易度3・火弱点・風耐性）", res: { 火: RES_WEAK, 風: RES_RESIST }, weak: ["火"], markX: 1, hpBonus: 0,
      note: "首領討伐。火が有効（耐性250）、風が耐性（2000）、ほかは等倍（750）。防御0.5。実測は未確認（ほかのボスと同じ形として入れた）。印の倍率は未確認（1とした）。" }, BOSS),
    // 2026-11 からの指名手配（画面: 弱点・耐性のアイコンと特性）。耐性・防御・印の倍率は未実測（ほかのボスと同じ形として入れた）
    // scoreRate = 指名手配のスコア1ptあたりのダメージ（シーズンごとに違う。シーズン13は27,000ダメージ＝1pt。ユーザー 2026-11-11）。テクニックスコアは含めない
    Object.assign({ id: "kubo", season: 13, scoreRate: 27000, name: "空壺ノ王（指名手配・光水弱点・風耐性）", res: { 光: RES_WEAK, 水: RES_WEAK, 風: RES_RESIST }, weak: ["光", "水"], markX: 1.14, hpBonus: 0.20,
      note: "指名手配（2026-11〜）。弱点は光・水、耐性は風（画面のアイコン）。特性「亀裂の響き」: 主力の最大HP+20%・主力の被ダメージ+10%。テスト3（通常Lv10・信頼21・徽章なし）の実測: 突進 131,771・1撃目 187,099 は、光耐性250・防御0.5 の予測の ×1.019 。テスト5（徽章なし）では 突進 62,580 で、未恋ノ禍実との比が計算どおり（防御0.5・主力HP+20%）→ ×1.019 はボスではなく、テスト3のロスレコ側の何か（未特定）。印 98,026 は、星願1以上の予測 84,369×1.019（テスト3の上乗せ込み）の ×1.14 → 印の倍率 1.14。2026-11-04" }, BOSS),
    Object.assign({ id: "genwakuW", season: 13, scoreRate: 27000, name: "幻惑ノ花（指名手配・光地弱点・火耐性）", res: { 光: RES_WEAK, 地: RES_WEAK, 火: RES_RESIST }, weak: ["光", "地"], markX: 1, hpBonus: 0,
      note: "指名手配（2026-11〜）。首領討伐の幻惑ノ花とは弱点が違う（指名手配は光・地が弱点、火が耐性。画面のアイコン）。テスト3（通常Lv10・信頼21・徽章なし）の実測: 突進・1撃目・2撃目・3撃目 すべて光耐性250・防御0.5 の予測の ×1.022 （空壺ノ王と同じく、テスト3のロスレコ側の何かとみる。未特定）。印の倍率は未実測（1）。2026-11-04" }, BOSS),
  ];
  // 敵の特性（チェックで入れる）。ht = かかるダメージの種類、x = 別枠の掛け算
  S.DEFAULT_ENEMY_TRAITS = {
    stomp: [{ id: "crack", name: "ひび割れた好機（必殺後15秒・スキル被ダメ+15%）", on: false, ht: ["skill"], x: 1.15 }],
    deep: [{ id: "chase", name: "命がけの追撃（印3回後15秒・スキル/通常の被ダメ+24%）", on: false, ht: ["skill", "basic"], x: 1.24 }],
    // 新しい指名手配の特性は、重ねられる最大の数で入れる。別枠の掛け算かどうかは未実測
    kubo: [{ id: "kuboEcho", name: "亀裂の響き（主力が印を発動して3秒・スキル被ダメ強度+8%×5重＝+40%）", on: false, ht: ["skill"], x: 1.40, nodict: true }],
    genwakuW: [{ id: "hanaMark", name: "散り残る花蕊（必殺技を受けて15秒・印被ダメ強度+4%×4重＝+16%）", on: false, ht: ["mark"], x: 1.16, nodict: true },
      { id: "hanaSkill", name: "散り残る花蕊（スキルを受けて15秒・スキル被ダメ強度+12%×4重＝+48%。1ヒットごとに+12%の足し算を実測）", on: false, ht: ["skill"], x: 1.48, nodict: true }],
  };

  S.NOTE_KEYS = ["強撃の音符", "幸運の音符", "爆発の音符", "体力の音符", "集中の音符", "器用の音符", "必殺の音符", "水の音符", "風の音符", "光の音符"];
  if (window.NOTES) window.NOTES["光の音符"] = { stat: "elemDmg:光", perLv: 0.003, text: "1レベルごとに光属性ダメージが0.3%増加する" };
  // 火・地・闇の音符（1Lvあたり0.3%。水・風・光と同じ値であることをゲーム画面で確認、2026-10-29 ユーザー）
  ["火", "地", "闇"].forEach(e => { if (window.NOTES) window.NOTES[e + "の音符"] = { stat: "elemDmg:" + e, perLv: 0.003, text: `1レベルごとに${e}属性ダメージが0.3%増加する` }; });
  // 画面に出す音符。NOTE_KEYS は共有コードの辞書に使っているので変えない（変えると、それまでの共有コードが読めなくなる）。
  // 足した火・地・闇は辞書に入らず、文字のまま書き出される
  S.NOTE_BASE = S.NOTE_KEYS.slice(0, 7);
  S.NOTE_ELEM = ["水", "火", "風", "地", "光", "闇"].map(e => e + "の音符");
  S.NOTE_ALL = S.NOTE_BASE.concat(S.NOTE_ELEM);

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
  // 自動の巡遊者は、徽章を空にしておく（画面で選ぶ）
  const EMB_EMPTY = () => ["三角章（Lv70）:triangle", "円形章（Lv80）:circle", "六星輝章（Lv90）:star"].map(s => ({ name: s.split(":")[0], kind: s.split(":")[1], slots: [0, 1, 2, 3].map(() => ({ k: "", q: "gold" })) }));
  S.CH.forEach(c => { if (!S.EMB_DEFAULT[c.id]) S.EMB_DEFAULT[c.id] = EMB_EMPTY; });
})(window.SIM);
