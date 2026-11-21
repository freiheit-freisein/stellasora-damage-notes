// 録画と比べるための「想定ダメージ」を出す。共有コード（短縮ID・#c= のURL・コードそのもの）から、技ごとの1発の値と、効果を1つずつ外したときの値を出す
// 使い方: node tools/expect.js <短縮ID|共有URL|共有コード> [--who グレイ] [--hit 岩錐] [--out 出力.md]
//   --who  巡遊者を絞る（日本語名・英語名・id の一部）
//   --hit  ヒットの名前で絞る（一部でよい）。絞ったヒットには、係数の分解と「効果を1つ外したら何倍か」の表を出す
//   --out  UTF-8 の Markdown に書き出す（PowerShell の「>」は UTF-16 になるので使わない）
// 計算ノート（sim.html）と同じ計算を Node で動かすだけ。値はその共有コードの時点のもの（レベル・信頼度が変われば使えない。MEASURE.md）
const fs = require("fs"), vm = require("vm"), path = require("path"), https = require("https");
process.chdir(path.join(__dirname, ".."));

const FILES = ["est.js", "data/trekkers.js", "data/trekkers_new.js", "data.js", "data_sup.js", "record_level.js", "calc.js", "data/sim_chars_auto.js", "sim_data.js",
  "data/spec_user.js", "data/spec_draft.js", "data/core_lv.js", "data/heart_wiki.js", "sim_pots.js", "data/lr_auto.js", "data/lr_new.js", "data/skill_ct.js", "sim_lr.js",
  "sim_engine.js", "data/potential_ja.js", "sim_share.js", "data/preset_map.js", "sim_preset.js", "sim_contrib.js"];
const ctx = { console, TextEncoder, TextDecoder, CompressionStream, DecompressionStream, Blob, Response, atob, btoa, setTimeout,
  document: { cookie: "", addEventListener() {}, querySelector() { return null; }, getElementById() { return null; } },
  localStorage: { getItem() { return null; }, setItem() {} }, location: { hash: "", search: "" } };
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
FILES.forEach(f => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }));
const S = ctx.SIM, E = S.engine;

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const input = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
if (!input) { console.error("使い方: node tools/expect.js <短縮ID|共有URL|共有コード> [--who 名前] [--hit ヒット名] [--out 出力.md]"); process.exit(1); }
const WHO = opt("--who"), HIT = opt("--hit"), OUT = opt("--out"), STK = opt("--stk");
// --stk "カリブレーション=1,俯瞰考察=3": 重ねる素質の重複数を決める（日本語名・英語名。録画のその瞬間に合わせる）

const get = url => new Promise((ok, ng) => https.get(url, r => { let b = ""; r.on("data", d => b += d); r.on("end", () => ok(b)); }).on("error", ng));
async function codeOf(v) {
  const m = v.match(/(?:\/s\/|[?&]s=|^)([A-Za-z0-9]{7})$/);
  if (m) { const j = JSON.parse(await get("https://sim.stella-tool.com/api/short?id=" + m[1])); if (!j.code) throw new Error(j.error || "短縮URLが見つかりません"); return j.code; }
  if (v.indexOf("#c=") >= 0) return decodeURIComponent(v.slice(v.indexOf("#c=") + 3));
  return v;
}

const cl = x => JSON.parse(JSON.stringify(x));
const n0 = v => Math.round(v).toLocaleString("en-US");
const pc = v => (Math.round(v * 1000) / 10) + "%";
const ch = id => S.CH.find(c => c.id === id);
const nameOf = id => (ch(id) || {}).jp || id;
const potJa = (id, en) => ((ctx.POTENTIAL_JA || {})[(ch(id) || {}).en] || {})[en] || en;
const GROUP = { basic: "通常攻撃", main: "主力スキル", support: "支援スキル", ult: "必殺技" };

// 1つのヒットの値（非会心）を、G を変えて計算し直す
const rowOf = (G, id, g, name) => { const o = E.calcTeam(cl(G)).team[id]; return o && o.groups[g].rows.find(r => r.name === name); };

// 外せる効果の一覧（素質・心相・スキルの効果・ロスレコ・敵の特性）。それぞれ「外した G」を作る関数つき
function sources(G) {
  const team = [G.team.main, G.team.s1, G.team.s2], list = [];
  const ag = S.collectPots(cl(G), team);
  team.forEach(oid => (ag[oid].applied || []).forEach(nm => {
    const heart = /^心相\d+$/.test(nm);
    const key = heart ? "heart" + nm.slice(2) : S.potKey(nm);
    const stks = heart ? [] : ((S.POT_SPEC[oid] || {})[nm] || { e: [] }).e.filter((e, i, a) => e.stk > 1 && a.findIndex(x => (x.sk || "") === (e.sk || "")) === i).map(e => ({ sk: key + (e.sk ? ":" + e.sk : ""), max: e.stk, def: e.stk0 != null ? e.stk0 : e.stk }));
    list.push({ label: nameOf(oid) + " " + (heart ? nm : potJa(oid, nm)), oid, stks, off: g => { const cs = g.chars[oid]; cs.pon = cs.pon || {}; cs.pon[key] = false; } });
  }));
  team.forEach((id, i) => (S.SKILL_FX[id] || []).forEach(fx => {
    if (fx.k === "hit" || fx.k === "cnt") return;
    const usable = i === 0 ? (fx.skill === "main" || fx.skill === "ult") : fx.skill === "support";
    const key = id + ":" + fx.id, on = (G.skOn || {})[key] == null ? !fx.off : G.skOn[key];
    if (usable && on) list.push({ label: nameOf(id) + " " + S.SKILL_NAME[fx.skill] + "の効果", off: g => { g.skOn = g.skOn || {}; g.skOn[key] = false; } });
  }));
  const lrName = id => ((ctx.LR_AUTO || []).concat(ctx.LR_NEW || []).find(x => x.id === id) || {}).name || id;
  (G.lrMain || []).forEach(id => list.push({ label: "ロスレコ " + lrName(id) + "（主）", off: g => { g.lrMain = g.lrMain.filter(x => x !== id); } }));
  (G.lrSub || []).forEach(id => list.push({ label: "ロスレコ " + lrName(id) + "（サブ）", off: g => { g.lrSub = g.lrSub.filter(x => x !== id); } }));
  (S.DEFAULT_ENEMY_TRAITS[G.enemy] || []).forEach(tr => { if ((G.traits || {})[tr.id]) list.push({ label: "敵の特性 " + tr.name.replace(/（.*$/, "") + "（" + tr.ht.map(t => E.TYPE_NAME[t] || t).join("・") + "）", off: g => { g.traits[tr.id] = false; } }); });
  return list;
}

(async () => {
  const code = await codeOf(input);
  const G = await S.shareDecode(code, S.contrib.defState());
  const stkSet = [];
  (STK || "").split(",").filter(Boolean).forEach(kv => {
    const [nm, v] = kv.split("=");
    let hit = false;
    [G.team.main, G.team.s1, G.team.s2].forEach(oid => Object.keys(S.POT_SPEC[oid] || {}).forEach(en => {
      if (en !== nm.trim() && potJa(oid, en) !== nm.trim()) return;
      const cs = G.chars[oid]; cs.pstk = cs.pstk || {};
      S.POT_SPEC[oid][en].e.forEach(e => { if (e.stk > 1) cs.pstk[S.potKey(en) + (e.sk ? ":" + e.sk : "")] = +v; });
      hit = true; stkSet.push(nameOf(oid) + " " + potJa(oid, en) + " " + v + "重");
    }));
    if (!hit) console.error("--stk: 「" + nm + "」が見つかりません");
  });
  const R = E.calcTeam(cl(G));
  const team = [G.team.main, G.team.s1, G.team.s2];
  const en = R.G.enemyObj;
  const L = [];
  L.push("# 想定ダメージ（" + input.slice(0, 40) + "）", "");
  L.push("- 出した日: " + new Date().toISOString().slice(0, 10) + "（値はこの共有コードの時点のもの）");
  L.push("- 編成: 主力 " + nameOf(team[0]) + "・支援 " + nameOf(team[1]) + "・支援 " + nameOf(team[2]) + "／記録Lv " + R.G.recordLv);
  L.push("- 敵: " + en.name + "／特性: " + ((S.DEFAULT_ENEMY_TRAITS[G.enemy] || []).filter(t => (G.traits || {})[t.id]).map(t => t.name.replace(/（.*$/, "") + "（" + t.ht.map(h => E.TYPE_NAME[h] || h).join("・") + "）").join("・") || "なし"));
  if (stkSet.length) L.push("- 重複数の指定: " + stkSet.join("・"));
  L.push("");
  const match = id => !WHO || [nameOf(id), (ch(id) || {}).en || "", id].some(s => s.toLowerCase().indexOf(WHO.toLowerCase()) >= 0);
  const picked = [];
  team.forEach(id => {
    if (!match(id)) return;
    const o = R.team[id];
    L.push("## " + nameOf(id) + (id === team[0] ? "（主力）" : "（支援）"), "");
    L.push("| 技 | ヒット | 種類 | 倍率 | 回数 | 1発（非会心） | 1発（会心） | 会心率 |", "|---|---|---|---|---|---|---|---|");
    const groups = id === team[0] ? ["basic", "main", "ult"] : ["support", "ult"];   // 主力は通常攻撃・主力スキル・必殺技、支援は支援スキル・必殺技だけ使う
    groups.forEach(g => o.groups[g].rows.forEach(r => {
      if (HIT && r.name.indexOf(HIT) < 0) return;
      L.push(`| ${GROUP[g]} | ${r.name} | ${E.TYPE_NAME[r.type] || r.type} | ${Math.round(r.mult * 10) / 10}% | ${Math.round(r.count * 100) / 100} | ${n0(r.normal)} | ${n0(r.crit)} | ${pc(r.rate)} |`);
      if (HIT) picked.push({ id, g, r });
    }));
    L.push("");
  });
  if (HIT && !picked.length) L.push("（「" + HIT + "」に合うヒットはありません）", "");
  // 絞ったヒット: 係数の分解と、効果を1つ外したときの値
  const srcs = picked.length ? sources(G) : [];
  picked.slice(0, 4).forEach(({ id, g, r }) => {
    const o = R.team[id], st = o.st;
    const ref = r.normal / (r.mult / 100 * r.W * r.B * r.taken * r.D * (r.markX || 1));
    L.push("### " + nameOf(id) + " " + r.name + " の分解", "");
    L.push("1発（非会心） = 攻撃力 " + n0(ref) + " × 倍率 " + (r.mult / 100).toFixed(4) + " × 属性ダメージ " + r.W.toFixed(4) + " × " + (E.TYPE_NAME[r.type] || r.type) + "ダメージ " + r.B.toFixed(4) +
      " × 被ダメージ " + r.taken.toFixed(4) + " × 防御・耐性 " + r.D.toFixed(4) + (r.markX && r.markX !== 1 ? " × 印の別枠 " + r.markX : "") + " = " + n0(r.normal));
    L.push("会心 = 非会心 × 会心ダメージ " + pc(r.crit / r.normal) + " = " + n0(r.crit), "");
    L.push("効果を1つだけ外したとき（時間で切れる効果が乗っていなかった場合の目安。比 = 外したとき ÷ 全部）", "");
    L.push("| 外した効果 | 1発（非会心） | 1発（会心） | 比 |", "|---|---|---|---|");
    const rows = srcs.map(s => { const g2 = cl(G); s.off(g2); const x = rowOf(g2, id, g, r.name); return { s, x }; })
      .filter(v => v.x && Math.abs(v.x.normal / r.normal - 1) > 1e-6)
      .sort((a, b) => a.x.normal - b.x.normal);
    rows.forEach(({ s, x }) => L.push(`| ${s.label} | ${n0(x.normal)} | ${n0(x.crit)} | ×${(x.normal / r.normal).toFixed(4)} |`));
    if (!rows.length) L.push("| （値の変わる効果なし） | | | |");
    L.push("");
    // 重なる素質: 重複数ごとの値（録画で1発ずつ増えていく様子と比べる）
    const st2 = srcs.filter(x => x.stks && x.stks.length);
    const lines = [];
    st2.forEach(x => x.stks.forEach(k => {
      const cur = ((G.chars[x.oid].pstk || {})[k.sk]);
      const vals = [];
      for (let n = 0; n <= k.max; n++) { const g2 = cl(G); g2.chars[x.oid].pstk = Object.assign({}, g2.chars[x.oid].pstk, { [k.sk]: n }); const y = rowOf(g2, id, g, r.name); vals.push(y ? y.normal : 0); }
      if (vals.every(v => Math.abs(v - vals[0]) < 1)) return;
      lines.push(`| ${x.label}${k.sk.indexOf(":") >= 0 ? "（" + k.sk.split(":")[1] + "）" : ""} | ${cur != null && cur !== "" ? cur : k.def}/${k.max} | ${vals.map((v, n) => n + "重 " + n0(v)).join("<br>")} |`);
    }));
    if (lines.length) { L.push("重なる効果の重複数ごとの値（非会心。ほかの効果は今の設定のまま）", "", "| 効果 | 今の重複数 | 重複数ごと |", "|---|---|---|"); lines.forEach(x => L.push(x)); L.push(""); }
  });
  const text = L.join("\n");
  if (OUT) { fs.writeFileSync(OUT, text, "utf8"); console.log("書き出しました: " + OUT); } else console.log(text);
})().catch(e => { console.error("エラー: " + (e && e.message || e)); process.exit(1); });
