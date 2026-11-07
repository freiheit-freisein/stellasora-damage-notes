// コア素質のうち、スキルLvで数字が伸びるものを見分けて data/core_lv.js を作る。
// 見分け方: 英語Wikiの数字（スキルLv1のときの値）÷ 日本語Wikiの数字（スキルLv10のときの値）が、
//   そのスキルの倍率の「Lv1 ÷ Lv10」と同じ（±0.03）なら、そのスキルのLvで伸びる数字とみなす（Edit の「約」の表示と同じ見分け方）。
// 出力: window.CORE_LV = { 巡遊者の英語名: { 素質の英語名: { k: "main"|"support"…, vals: [Lv10の値, …] } } }
//   計算機（sim_pots.js）は、追加ヒットの m が vals にあれば、k のスキルLvで伸ばす。
// 使い方: node tools/make_core_lv.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = global;
require(path.join(root, "data", "trekkers.js"));
require(path.join(root, "data", "potentials_jp.js"));
const SK = { basic: 0, main: 1, support: 2, ult: 3 };
const ratio1 = (t, k) => { const n = t.skills && t.skills[SK[k]] && t.skills[SK[k]].nums; return n && n[0] && n[9] ? n[0][0][0] / n[9][0][0] : null; };
const jpNums = a => (a || []).map(x => { const m = String(x).split(/[～~〜]/); const f = String(x).match(/\d+(?:\.\d+)?/); return m.length > 1 || !f ? null : parseFloat(f[0]); });
const out = {};
let n = 0, nv = 0;
for (const t of window.TREKKERS) {
  for (const role of ["main", "support"]) {
    for (const g of ((t.potentials || {})[role] || [])) for (const p of g.potentials) {
      if (p.type !== 1) continue;
      const jp = (((window.POT_JP || {})[t.en] || {})[role] || {})[p.name];
      if (!jp || !jp.nums) continue;
      const jv = jpNums(jp.nums), ev = (p.nums || []).map(a => a && a[0]);
      // 役割のスキル（主力→主力スキル、支援→支援スキル）を先に見て、合わなければほかのスキルも見る
      const order = [role, ...Object.keys(SK).filter(k => k !== role)];
      let hit = null;
      for (const k of order) {
        const r1 = ratio1(t, k); if (!r1) continue;
        const vals = jv.map((v, i) => (v > 0 && ev[i] > 0 && Math.abs(ev[i] / v - r1) <= 0.03 && Math.abs(r1 - 1) > 0.05) ? v : null).filter(v => v != null);
        if (vals.length) { hit = { k, vals }; break; }
      }
      if (!hit) continue;
      (out[t.en] = out[t.en] || {})[p.name] = hit; n++; nv += hit.vals.length;
    }
  }
}
const head = "// コア素質のうち、スキルLvで伸びる数字（tools/make_core_lv.js で作成。英語Wiki÷日本語Wikiの比がスキルの伸び方と同じもの）。\n// k = どのスキルのLvで伸びるか、vals = スキルLv10のときの値。計算機は、追加ヒットの値が vals にあれば k のスキルLvで伸ばす。\n";
fs.writeFileSync(path.join(root, "data", "core_lv.js"), head + "window.CORE_LV = " + JSON.stringify(out) + ";\n");
console.log(`${Object.keys(out).length}人・${n}素質・${nv}個の数字 → data/core_lv.js`);
