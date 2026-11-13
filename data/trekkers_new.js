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
    stats: null,
    // 技の名前は日本語Wikiより。name（英語名）・text（説明）・nums（Lvごとの数値）はまだない
    skills: [
      { ja: "ファセットグロース", name: null, brief: null, text: null, nums: null },   // 通常攻撃
      { ja: "アーススキャニング", name: null, brief: null, text: null, nums: null },   // 主力スキル
      { ja: "ゼロポイントピラー", name: null, brief: null, text: null, nums: null },   // 支援スキル
      { ja: "ジオ・マテリアライズ", name: null, brief: null, text: null, nums: null }, // 必殺技
    ],
    // 素質: { main: [{ build: 1, title: "Suguha: Main Build 1", potentials: [{ name, type, ... }] }, ...], support: [...] }（trekkers.js と同じ形）
    potentials: { main: [], support: [] },
    talent: null,   // 心相
  },
];
(function () {
  const ready = t => !!(t.stats && t.skills && t.skills.length === 4 && t.skills.every(s => s.name && s.nums) && t.potentials && t.potentials.main.length && t.potentials.support.length);
  const T = window.TREKKERS || [];
  window.TREKKERS_PENDING = [];
  window.TREKKERS_NEW.forEach(t => {
    if (window.TREKKER_JA && !window.TREKKER_JA[t.en]) window.TREKKER_JA[t.en] = t.jp;
    if (T.some(x => x.en === t.en)) return;   // 英語Wikiのデータに入ったら、そちらを使う
    if (ready(t)) T.push(t); else window.TREKKERS_PENDING.push(t);
  });
})();
