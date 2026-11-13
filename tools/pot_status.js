// 素質の反映状況のチェックリストを作る。使い方: node stellasora-calc/tools/pot_status.js（どのフォルダから実行してもよい）
//   計算ノートのフォルダの隣に potential-checklist.md を UTF-8 で書き出す（PowerShell の「>」は UTF-16 になるので使わない）
// 巡遊者ごとに、主力・支援の素質が計算に入っているか（入れた・下書き・未登録）、追加ダメージの抜け、素質の確認の件数、ヒットの定義（手で書いた／自動）を出す
const fs = require("fs"), vm = require("vm"), path = require("path");
process.chdir(path.join(__dirname, ".."));
const c = { window: {} };
["data/trekkers.js", "data/trekker_ja.js", "data/potential_ja.js", "data/potentials_jp.js", "data/spec_user.js", "data/pot_check.js", "data/sim_chars_auto.js"].forEach(f => vm.runInNewContext(fs.readFileSync(f, "utf8"), c));
const W = c.window;
// 組み込みの効果の表（sim_pots.js の SPEC）と、手で書いたヒット（sim_data.js）
const S = {}; const w2 = { window: { SIM: S, TREKKERS: W.TREKKERS, LOSTRECORDS: [] }, console };
w2.window.window = w2.window;
try { vm.runInNewContext(fs.readFileSync("sim_pots.js", "utf8"), Object.assign(w2.window, { document: undefined })); } catch (e) { /* 組み込みの表だけ使う */ }
const BUILT = S.POT_SPEC || {};
const dataSrc = fs.readFileSync("sim_data.js", "utf8");
const manual = new Set([...dataSrc.matchAll(/\{ id: "([a-z_]+)", en: "([^"]+)"/g)].map(m => m[2]));
const TJ = W.TREKKER_JA || {}, PJ = W.POTENTIAL_JA || {}, JP = W.POT_JP || {};
const autoId = en => ((W.SIM_CHARS_AUTO || []).find(x => x.en === en) || {}).id;
const idOf = en => { const m = dataSrc.match(new RegExp(`\\{ id: "([a-z_]+)", en: "${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`)); return m ? m[1] : autoId(en); };

const rows = [], detail = [];
W.TREKKERS.slice().sort((a, b) => (TJ[a.en] || a.en).localeCompare(TJ[b.en] || b.en, "ja")).forEach(t => {
  const su = W.SPEC_USER[t.en] || {}, bi = BUILT[idOf(t.en)] || {}, ck = W.POT_CHECK[t.en] || {};
  const st = { main: { n: 0, done: 0, draft: 0, none: [], noExtra: [] }, support: { n: 0, done: 0, draft: 0, none: [], noExtra: [] } };
  let ckN = 0, ckAll = 0;
  ["main", "support"].forEach(g => (t.potentials[g] || []).forEach(b => b.potentials.forEach(p => {
    const s = st[g]; s.n++; ckAll++; if (ck[p.name]) ckN++;
    const u = su[p.name], b2 = bi[p.name];
    const ja = (PJ[t.en] || {})[p.name] || p.name;
    const sp = (u && !u.draft) ? u : (!u && b2) ? b2 : null;
    const okd = ck[p.name] && ck[p.name].st !== "unk" ? "（確認済み）" : "";
    if (sp) s.done++; else if (u && u.draft) { s.draft++; s.none.push(ja + "（下書き）" + okd); } else s.none.push(ja + okd);
    // 説明文に「攻撃力の○%の…ダメージを与え」があるのに、追加ヒットが無いもの
    const txt = (((JP[t.en] || {})[g] || {})[p.name] || {}).text || "";
    // 効果なし（e が空）で理由を書いたものは、わざと入れていないので数えない（例: ホタルのじぐざぐレーザーは単体の敵では効果なし）
    if (sp && (sp.e || []).length && /攻撃力の[^。]*ダメージを与え/.test(txt) && !(sp.e || []).some(e => e.k === "extra")) s.noExtra.push(ja);
  })));
  const tot = st.main.n + st.support.n, done = st.main.done + st.support.done;
  const mark = done === tot && !st.main.noExtra.length && !st.support.noExtra.length ? "[x]" : "[ ]";
  rows.push({ t, st, done, tot, ckN, ckAll, mark, hits: manual.has(t.en) ? "手で定義" : "自動" });
});

const out = [];
out.push("# 素質の反映チェックリスト", "", `作成: ${new Date().toLocaleString("ja-JP")}（node stellasora-calc/tools/pot_status.js で作り直せます）`, "",
  "- 入れた＝計算に入っている素質（下書きは数えない）", "- 追加ダメージの抜け＝説明文に「攻撃力の○%の…ダメージ」があるのに、追加のヒットが入っていない素質", "- 確認＝素質の確認（edit）で確かめた件数。まだのものの一覧で「（確認済み）」が付いているものから先に入れる", "- ヒット＝スキルの当たり方。自動のままだと、素質の効き先（技の中の特定の攻撃）を分けられないことがある", "");
out.push("| | 巡遊者 | 属性 | 主力 | 支援 | 追加ダメージの抜け | 確認 | ヒット |", "|---|---|---|---|---|---|---|---|");
const EL = { Aqua: "水", Ignis: "火", Ventus: "風", Terra: "地", Lux: "光", Umbra: "闇" };
rows.forEach(r => out.push(`| ${r.mark} | ${TJ[r.t.en] || r.t.en} | ${EL[r.t.element] || r.t.element} | ${r.st.main.done}/${r.st.main.n} | ${r.st.support.done}/${r.st.support.n} | ${r.st.main.noExtra.length + r.st.support.noExtra.length || ""} | ${r.ckN}/${r.ckAll} | ${r.hits} |`));
out.push("", "## まだのもの（巡遊者ごと）", "");
rows.filter(r => r.mark === "[ ]").forEach(r => {
  out.push(`### ${TJ[r.t.en] || r.t.en}（${EL[r.t.element] || ""}）`);
  ["main", "support"].forEach(g => { const s = r.st[g], gj = g === "main" ? "主力" : "支援";
    if (s.none.length) out.push(`- ${gj}の未登録 ${s.none.length}件: ${s.none.join("、")}`);
    if (s.noExtra.length) out.push(`- ${gj}の追加ダメージの抜け ${s.noExtra.length}件: ${s.noExtra.join("、")}`); });
  out.push("");
});
const dest = path.join("..", "potential-checklist.md");
fs.writeFileSync(dest, out.join("\n") + "\n", "utf8");
console.log(`書き出しました: ${path.resolve(dest)}（完了 ${rows.filter(r => r.mark === "[x]").length} 人・まだ ${rows.filter(r => r.mark === "[ ]").length} 人）`);
