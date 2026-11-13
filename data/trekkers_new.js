// 実装されたばかりで、まだ数値がそろっていない巡遊者の枠（2026-11-13 スグハ）。
// - 形は data/trekkers.js（英語Wikiから作るデータ）と同じ。分かった値から埋める。分からないものは null のまま。
// - 出どころ: 日本語Wiki（stellasora.wikiru.jp）の「スグハ」のページ（2026-11-13 時点は名前・属性・役割・CV・技の名前だけ）。値はゲームの画面・Wiki で確かめたものだけ入れる。
// - en は英語Wikiにまだページがないので仮の名前（"Suguha"）。英語Wikiに載ったら、その名前に合わせる。
// - stats（Lv1〜90の HP・攻撃・防御）、skills の nums（Lvごとの数値）、potentials（主力・支援の素質）がそろったら（ready）、
//   TREKKERS に入れて、計算ページ・素質の確認ページで選べるようにする。それまでは、計算ページの一覧に「データ待ち」と出すだけ。
// - 共有コードの辞書には入れない（sim_share.js の V2_CHARS にない巡遊者は、文字のまま書き出す）。辞書が変わると、それまでの共有コードが読めなくなるため。
window.TREKKERS_NEW = [
  {
    id: null, en: "Suguha", jp: "スグハ", role: "Versatile", element: "Terra", rarity: 5, range: null, release: "2026-11-13",
    faction: "地理協会", cv: "三浦千幸",
    // 能力値: ゲームの巡遊者プレビュー（Lv90・2026-11-13）で HP 51179・攻撃 7484・防御 190・会心率 5%・会心ダメージ 150%。
    //   この Lv90 の値は ホタル・ナツカ・レイス と同じで、その3人は Lv1〜90 の表・信頼の表がまったく同じなので、同じ表を使う（from）。
    //   信頼: ゲームの画面で Lv1 の次が 基礎HP +334・基礎攻撃 +36、Lv5 で攻撃力 +4%（同じ表と一致）
    //   心相の小さい節: ゲームの画面で 1凸（10段階）= 基礎攻撃 +100・攻撃力 +3%・基礎防御 +20・基礎HP +1150・通常攻撃ダメージ +4.2%。
    //   表は5段階ごとなので、攻撃力% は 1.5% ずつ（HP・攻撃・防御は同じ表と一致）。通常攻撃ダメージは sim_data.js の talentBonus（1段階 2.1%）
    stats: { from: "Nazuka", talent: { atkPct: [0, 0.015, 0.03, 0.045, 0.06, 0.075, 0.09, 0.105, 0.12, 0.135, 0.15] } },
    // スキル: ゲームのスキル画面の Lv1・Lv2（説明の「↑」）と、スキルプレビューの Lv10（2026-11-13）。Lv3〜9 は推定（est.js）。
    //   どれも Lv2 が Lv1 の約1.15倍・Lv10 が約2.79倍で、伸び方は A の型。主力スキルの印ダメージは Lv1 18%・Lv10 61%（計算には入れていない）
    //   CD: 主力 18秒・支援 14秒・必殺技 30秒（消費SP 264）
    skills: [
      { ja: "ファセットグロース", name: "Facet Growth", text: "アジマスマーカーを連続で生成する。1〜3段目: 攻撃力の185%の地属性の通常攻撃ダメージ。通常攻撃がダメージを与えた時、10%の確率でセオドライトを1個生成（1秒に1個まで）", hits: [{ v1: 66, v2: 76, v10: 185 }, { v1: 66, v2: 76, v10: 185 }, { v1: 66, v2: 76, v10: 185 }] },
      { ja: "アーススキャニング", name: "Earth Scanning", text: "アースウェーブで攻撃力の180%の地属性のスキルダメージ、セオドライトを5個生成。セオドライトが10個を超えると10個消費して観測点を生成（10秒・同時に1つ）。観測点は3秒ごとに主力のターゲットへ弾丸（攻撃力の54%の地属性の通常攻撃ダメージ）。どちらも地属性の印を発動でき、印ダメージは攻撃力の61%", hits: [{ v1: 65, v2: 74, v10: 180 }, { v1: 19.4, v2: 22.3, v10: 54 }] },
      { ja: "ゼロポイントピラー", name: "Zero Point Pillar", text: "観測点を1つ生成（10秒・同時に1つ）。生成時にスキャニングで攻撃力の327%の地属性の通常攻撃ダメージ。そのあとレーダーマップを生成し、2秒ごとに攻撃力の397%の地属性の通常攻撃ダメージ（観測点が消えるまで）。どちらも地属性の印：地脈を付与できる", hits: [{ v1: 117, v2: 135, v10: 327 }, { v1: 142, v2: 164, v10: 397 }] },
      { ja: "ジオ・マテリアライズ", name: "Geo Materialize", text: "20秒間、3秒ごとに範囲内に攻撃力の270%の地属性の必殺技ダメージ", hits: [{ v1: 97, v2: 111, v10: 270 }] },
    ],
    // 素質: ゲームの素質プレビュー（2026-11-13）。英語名は仮（英語Wikiに載っていないため。共有コードのキーになるので、あとで変えない）。
    //   サブ素質・汎用は Lv1 の値だけ（Lv2〜6 は未確認）
    potentials: {"main": [{"build": 1, "title": "Suguha: Main Build 1", "potentials": [{"name": "Total Station", "type": 1, "brief": "", "text": ""}, {"name": "Piercing Survey", "type": 1, "brief": "", "text": ""}, {"name": "Surveyor's Intuition", "type": 2, "brief": "", "text": "", "nums": [[20], [10.9]]}, {"name": "Earth Location", "type": 3, "brief": "", "text": "", "nums": [[0.8]]}, {"name": "Earth Resonance", "type": 3, "brief": "", "text": "", "nums": [[1.5]]}]}, {"build": 2, "title": "Suguha: Main Build 2", "potentials": [{"name": "Echo Sounding", "type": 1, "brief": "", "text": ""}, {"name": "Meteor Anchor", "type": 1, "brief": "", "text": ""}, {"name": "Polygon Survey", "type": 2, "brief": "", "text": "", "nums": [[1], [7]]}, {"name": "Terrain Update", "type": 3, "brief": "", "text": "", "nums": [[2.7]]}, {"name": "Observation Boost", "type": 3, "brief": "", "text": "", "nums": [[5]]}]}, {"build": 3, "title": "Generic", "potentials": [{"name": "Survey Team Link", "type": 2, "brief": "", "text": "", "nums": [[5]]}, {"name": "Traverse Step", "type": 3, "brief": "", "text": "", "nums": [[1], [9]]}, {"name": "Atlas's Grace", "type": 3, "brief": "", "text": "", "nums": [[12]]}, {"name": "Feedback", "type": 3, "brief": "", "text": "", "nums": [[4]]}, {"name": "Terrain Mastery", "type": 3, "brief": "", "text": "", "nums": [[10]]}, {"name": "Guidepost for Friends", "type": 3, "brief": "", "text": "", "nums": [[13], [2.5]]}]}], "support": [{"build": 1, "title": "Suguha: Support Build 1", "potentials": [{"name": "Alidade Sight", "type": 1, "brief": "", "text": ""}, {"name": "Calibration", "type": 1, "brief": "", "text": ""}, {"name": "Bird's-Eye Study", "type": 2, "brief": "", "text": "", "nums": [[3]]}, {"name": "Terrain Analysis", "type": 3, "brief": "", "text": "", "nums": [[66]]}, {"name": "Stepwise Mapping", "type": 3, "brief": "", "text": "", "nums": [[15]]}]}, {"build": 2, "title": "Suguha: Support Build 2", "potentials": [{"name": "Boost Scan", "type": 1, "brief": "", "text": ""}, {"name": "Blast Survey", "type": 1, "brief": "", "text": ""}, {"name": "Extra Marker", "type": 2, "brief": "", "text": "", "nums": [[15], [7.5]]}, {"name": "New Route", "type": 3, "brief": "", "text": "", "nums": [[6], [13]]}, {"name": "Erosion Watch", "type": 3, "brief": "", "text": "", "nums": [[4.3], [2.2]]}]}, {"build": 3, "title": "Generic", "potentials": [{"name": "Romance of Adventure", "type": 2, "brief": "", "text": "", "nums": [[15], [10], [14]]}, {"name": "Leyline Use", "type": 3, "brief": "", "text": "", "nums": [[4]]}, {"name": "Child of Surveying", "type": 3, "brief": "", "text": "", "nums": [[12]]}, {"name": "Feedback", "type": 3, "brief": "", "text": "", "nums": [[4]]}, {"name": "Terrain Mastery", "type": 3, "brief": "", "text": "", "nums": [[10]]}, {"name": "Guidepost for Friends", "type": 3, "brief": "", "text": "", "nums": [[13], [2.5]]}]}]},
    talent: null,   // 心相
  },
];
(function () {
  // 推定で埋める（est.js）。推定した値は est に印を残す
  const fill = t => {
    if (!window.EST) return;
    (t.skills || []).forEach(sk => { if (!sk.nums && sk.hits && sk.hits.length) { sk.nums = EST.skillNums(sk.hits); sk.est = true; } });
    let st = t.stats;
    if (st && st.from) {   // 同じ表の巡遊者からコピー
      const src = (window.TREKKERS || []).find(x => x.en === st.from), ss = src && src.stats;
      if (ss) { st = t.stats = { hp: ss.hp.slice(), atk: ss.atk.slice(), def: ss.def.slice(), trust: JSON.parse(JSON.stringify(ss.trust)), talent: Object.assign({ hp: ss.talent.hp.slice(), atk: ss.talent.atk.slice(), def: ss.talent.def.slice() }, st.talent || {}), from: st.from }; }
    }
    if (st) ["hp", "atk"].forEach(k => { const a = st[k]; if (Array.isArray(a) && a.length === 2) { st[k] = EST.stat(k, a[0], a[1]); st.est = true; } });
    if (st && typeof st.def === "number") { st.def = Array(99).fill(st.def); }   // 防御はLvで変わらない
  };
  const ready = t => !!(t.stats && t.stats.hp && t.stats.hp.length > 2 && t.stats.trust && t.stats.talent && t.skills && t.skills.length === 4 && t.skills.every(s => s.name && s.nums) );   // 素質は無くても選べる
  const T = window.TREKKERS || [];
  window.TREKKERS_PENDING = [];
  window.TREKKERS_NEW.forEach(t => {
    if (window.TREKKER_JA && !window.TREKKER_JA[t.en]) window.TREKKER_JA[t.en] = t.jp;
    if (T.some(x => x.en === t.en)) return;   // 英語Wikiのデータに入ったら、そちらを使う
    fill(t);
    if (ready(t)) T.push(t); else window.TREKKERS_PENDING.push(t);
  });
})();
