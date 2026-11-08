// 素質の確認ページ。人がするのは「ゲームの画面と合っているか」の確認だけ（合ってる／数字が違う＝Lv1とLv6の数字／わからない）。
// 確認の結果はブラウザに保存し、書き出したものを貼ってもらって、効果の形にするのは Claude がする（2026-10-30 ユーザー）。
// 前の「効果の入力」欄（data/spec_user.js になる）は、「詳しい入力」を開いたときだけ出す。
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const KEY = "stellasora-spec-user-v1";
  const TJ = en => (window.TREKKER_JA || {})[en] || en;
  const PJ = (t, en) => ((window.POTENTIAL_JA || {})[t] || {})[en] || en;

  // 効果の種類（k=計算での名前、flat=割合でなく実数、to=既定の対象）
  const KINDS = [
    ["W", "属性ダメージ（加算）"], ["Bs", "スキルダメージ（加算）"], ["Bb", "通常攻撃ダメージ（加算）"], ["Bu", "必殺技ダメージ（加算）"], ["mark", "印ダメージ（加算）"], ["markMult", "印ダメージ（別枠の乗算）"],
    ["atkPct", "攻撃力%"], ["hpPct", "最大HP%"], ["hpFlat", "基礎HP（加算・実数）", { flat: true }], ["atkFlat", "基礎攻撃力（加算・実数）", { flat: true }], ["pen", "属性耐性貫通（実数）", { flat: true }],
    ["critRate", "会心率"], ["critDmg", "会心ダメージ"],
    ["taken", "敵の被ダメージ（属性の別枠の乗算）", { to: "enemy" }], ["takenSkill", "敵のスキル被ダメージ", { to: "enemy" }], ["takenBasic", "敵の通常攻撃被ダメージ", { to: "enemy" }], ["takenMark", "敵の印被ダメージ（別枠の乗算）", { to: "enemy" }],
    ["mult", "ヒットの倍率 ×(1+x)（対象のタグで絞る）"], ["count", "ヒット回数の加算（ヒットの番号を指定）", { flat: true }], ["extra", "追加ヒット（ダメージが増える）"],
  ];
  const KIND = Object.fromEntries(KINDS.map(k => [k[0], k]));
  const TOS = [["", "自身"], ["main", "主力"], ["all", "全員"], ["lux", "同じ属性の全員"], ["luxVers", "同じ属性のバランサー"], ["sup", "支援の2人"], ["enemy", "敵（被ダメージ系）"]];
  const CONDS = [["", "なし"], ["glimmer", "敵に残光が付いている"], ["allLux", "全員が同じ属性（効果を持つ巡遊者と）"], ["mainSame", "主力が同じ属性（効果を持つ巡遊者と）"]];
  const HTS = [["", "全て"], ["basic", "通常攻撃"], ["skill", "スキル"], ["ult", "必殺技"], ["mark", "印"]];
  const GROUPS = [["main", "主力スキル"], ["support", "支援スキル"], ["basic", "通常攻撃"], ["ult", "必殺技"], ["*", "全て"]];
  const HITT = [["skill", "スキル"], ["basic", "通常攻撃"], ["ult", "必殺技"], ["mark", "印"]];

  // ---- 保存 ----
  let user = {};
  const load = () => {
    user = clone(window.SPEC_USER || {});
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) Object.keys(s).forEach(t => { user[t] = Object.assign(user[t] || {}, s[t]); }); } catch (e) { /* 保存なしでも動く */ }
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(user)); } catch (e) { /* 無視 */ } };
  load();
  // 確認の結果: chk[巡遊者][素質] = { st: "ok"|"diff"|"unk", g: { 番号: { 1: "Lv1の値", 6: "Lv6の値" } }, memo }
  const CKEY = "stellasora-pot-check-v1";
  let chk = {};
  // data/pot_check.js = 貼ってもらって反映済みの確認（どのブラウザでも確認済みに数える）。ブラウザで押した確認を、その上に重ねる
  const CK_FILE = window.POT_CHECK || {};
  chk = clone(CK_FILE);
  // ブラウザに残っている確認のうち、ファイルで「報告」に移したもの（前の Edit で報告をゲームの欄に入れていた分）は、ファイルの方を使う
  const sameG = (a, b) => JSON.stringify(a || null) === JSON.stringify(b || null);
  // ファイルの版（POT_CHECK_REV）が変わったら、ブラウザに残っている確認のうちファイルにある素質の分は消して、ファイルを使う
  //（貼ってもらった書き出しは、ブラウザの確認を全部含んでいるので、取り込んだあとはファイルが新しい）
  try {
    const rev = window.POT_CHECK_REV || "", RKEY = "stellasora-pot-check-rev";
    if (rev && localStorage.getItem(RKEY) !== rev) {
      const sv = JSON.parse(localStorage.getItem(CKEY)) || {};
      Object.keys(sv).forEach(t => { Object.keys(sv[t] || {}).forEach(p => { if ((CK_FILE[t] || {})[p]) delete sv[t][p]; }); if (!Object.keys(sv[t] || {}).length) delete sv[t]; });
      localStorage.setItem(CKEY, JSON.stringify(sv)); localStorage.setItem(RKEY, rev);
    }
  } catch (e) { /* 保存なしでも動く */ }
  try { const sv = JSON.parse(localStorage.getItem(CKEY)) || {}; Object.keys(sv).forEach(t => { Object.keys(sv[t] || {}).forEach(p => { const f = (CK_FILE[t] || {})[p]; if (f && f.r && !f.g && sameG(sv[t][p].g, f.r) && !sv[t][p].r && !sv[t][p].fix) delete sv[t][p]; }); chk[t] = Object.assign(chk[t] || {}, sv[t]); }); } catch (e) { /* 保存なしでも動く */ }
  const ckDone = (en, pot) => !!(CK_FILE[en] && CK_FILE[en][pot]);
  const saveChk = () => { try { localStorage.setItem(CKEY, JSON.stringify(chk)); } catch (e) { /* 無視 */ } };
  const chkOf = (en, pot) => (chk[en] || {})[pot] || null;
  const CK_NAME = { ok: "合ってる", diff: "数字が違う", unk: "わからない" };

  // スキルLv（巡遊者ごと・このブラウザに保存）。コア素質の追加ダメージは、つながるスキルのLvで伸びるので、ゲームの画面と同じLvの値で出す
  const SLKEY = "stellasora-edit-skilllv";
  let SL = {};
  try { SL = JSON.parse(localStorage.getItem(SLKEY)) || {}; } catch (e) { SL = {}; }
  const SKILLS = [["basic", "通常攻撃"], ["main", "主力スキル"], ["support", "支援スキル"], ["ult", "必殺技"]];
  const slOf = (en, k) => +(((SL[en] || {})[k]) || 10);
  // そのスキルのLvの倍率 ÷ Lv10の倍率（スキルの1つ目の数値で見る）
  const lvRatio = (en, k, lv) => { const t = TREKKERS.find(x => x.en === en), i = { basic: 0, main: 1, support: 2, ult: 3 }[k], n = t && t.skills && t.skills[i] && t.skills[i].nums; if (!n || !n[9]) return 1; if (n[lv - 1]) return n[lv - 1][0][0] / n[9][0][0];
    // Lv11〜13 は計算機（sim_engine.js の skillVal）と同じく、Lv1→10 の平均の伸びで延ばす（仮。ゲームの値で確かめる）
    const v10 = n[9][0][0], v1 = n[0][0][0]; return (v10 + (v10 - v1) / 9 * (lv - 10)) / v10; };
  // コア素質がどのスキルのLvで伸びるか: 入力済みの効果に lv があればそれ、なければ素質の役割（主力→主力スキル、支援→支援スキル）
  const potSkill = (en, role, pot) => { const cl = ((window.CORE_LV || {})[en] || {})[pot]; if (cl) return cl.k; const sp = (user[en] && user[en][pot]) || builtIn(en, pot) || {}; const e = (sp.e || []).find(x => x.lv); return e ? e.lv : role; };
  // スキルLvで伸びるコア素質（data/core_lv.js）
  const coreLv = (en, pot) => ((window.CORE_LV || {})[en] || {})[pot] || null;
  const trekkers = TREKKERS.slice().sort((a, b) => (b.rarity - a.rarity) || a.en.localeCompare(b.en));
  const S = { t: (JSON.parse(localStorage.getItem("stellasora-edit-t") || "null") || "Tilia"), role: "main", sel: null };
  if (!trekkers.some(x => x.en === S.t)) S.t = trekkers[0].en;

  // ---- 組み込みの効果表（検証済みの6人）----
  const builtIn = (en, pot) => { const c = (window.SIM.CH || []).find(x => x.en === en); const sp = c && window.SIM.POT_SPEC_BUILTIN[c.id]; return sp && sp[pot] || null; };
  const specOf = (en, pot) => (user[en] && user[en][pot]) || null;
  const draftOf = (en, role, pot) => (((window.SPEC_DRAFT || {})[en] || {})[role] || {})[pot] || null;
  const jpOf = (en, role, pot) => (((window.POT_JP || {})[en] || {})[role] || {})[pot] || null;
  // 効果を、人が読める1行にする
  function describe(e, p) {
    const kd = KIND[e.k] || [e.k, e.k];
    const nums = (p && p.nums) || [];
    let v = "";
    if (e.n != null && nums[e.n]) { const a = nums[e.n]; v = a.length > 1 ? `${a[0]}〜${a[a.length - 1]}` : `${a[0]}`; v += (kd[2] && kd[2].flat) ? "" : "%"; }
    else if (e.arr) v = `${e.arr[0]}〜${e.arr[e.arr.length - 1]}%`;
    else if (e.raw != null) v = (kd[2] && kd[2].flat) ? String(e.raw) : `${Math.round(e.raw * 10000) / 100}%`;
    else if (e.m != null) v = `${e.m}%`;
    const to = e.to ? (TOS.find(t => t[0] === e.to) || [0, e.to])[1] : "";
    let s = e.k === "extra" ? `追加ヒット：${e.name || ""} 攻撃力の${v}（${(HITT.find(t => t[0] === e.t) || [0, ""])[1]}）×${e.c || 1}回` : `${kd[1].replace(/（.*$/, "")} ${v}`;
    if (to) s += `［対象:${to}］`;
    if (e.stk > 1) s += `［最大${e.stk}重複］`;
    if (e.cond) s += `［条件:${(CONDS.find(c => c[0] === e.cond) || [0, e.cond])[1]}］`;
    return s;
  }

  // ---- 行（画面用）⇄ 効果（計算用）----
  const newRow = () => ({ k: "W", src: "n", n: 0, raw: 0, arr: "", to: "", cond: "", stk: 1, ht: "", tags: "", group: "main", t: "skill", c: 1, name: "", hit: "", add: 1 });
  function toEngine(r) {
    const kd = KIND[r.k] || KINDS[0], flat = !!(kd[2] && kd[2].flat);
    const e = { k: r.k };
    if (r.k === "extra") {
      e.group = r.group; e.name = r.name || "追加ヒット"; e.t = r.t; e.c = +r.c || 1; e.edit = true;   // 回数は、計算ページで直せるようにする
      if (r.src === "n") e.n = +r.n; else if (r.src === "arr") e.arr = String(r.arr).split(/[\s,、]+/).filter(Boolean).map(Number); else e.m = +r.raw;
      if (r.tags) e.tags = r.tags.split(/[\s,、]+/).filter(Boolean);
      return e;
    }
    if (r.k === "count") { e.hit = r.hit; e.add = +r.add || 0; return e; }
    if (r.extcap) e.ext = "cap";
    if (r.over) { const ov = String(r.over).split(/[\s,、]+/).filter(Boolean).map(Number); if (ov.length) { e.over = {}; ov.forEach((x, k) => { e.over[7 + k] = x; }); } }
    if (r.src === "n") { e.n = +r.n; if (flat) e.flat = true; }
    else if (r.src === "arr") e.arr = String(r.arr).split(/[\s,、]+/).filter(Boolean).map(Number);
    else e.raw = flat ? +r.raw : (+r.raw) / 100;
    if (r.to) e.to = r.to; else if (kd[2] && kd[2].to) e.to = kd[2].to;
    if (r.cond) e.cond = r.cond;
    if (+r.stk > 1) e.stk = +r.stk;
    if (r.ht) e.ht = r.ht;
    if (r.tags) e.tags = r.tags.split(/[\s,、]+/).filter(Boolean);
    if (r.perLux) e.perLux = true;   // 画面に欄はないが、保存し直しても消さない
    if (r.el) e.el = r.el;
    return e;
  }
  function fromEngine(e) {
    const r = newRow(); r.k = e.k;
    if (e.k === "extra") { r.group = e.group || "main"; r.name = e.name || ""; r.t = e.t || "skill"; r.c = e.c || 1; if (e.n != null) { r.src = "n"; r.n = e.n; } else if (e.arr) { r.src = "arr"; r.arr = e.arr.join(" "); } else { r.src = "raw"; r.raw = e.m || 0; } r.tags = (e.tags || []).join(" "); return r; }
    if (e.k === "count") { r.hit = e.hit || ""; r.add = e.add || 0; return r; }
    const flat = !!(KIND[e.k] && KIND[e.k][2] && KIND[e.k][2].flat);
    if (e.n != null) { r.src = "n"; r.n = e.n; } else if (e.arr) { r.src = "arr"; r.arr = e.arr.join(" "); } else { r.src = "raw"; r.raw = flat ? e.raw : Math.round((e.raw || 0) * 10000) / 100; }
    r.to = e.to || ((KIND[e.k] && KIND[e.k][2] && KIND[e.k][2].to) || "");
    r.extcap = e.ext === "cap";
    if (e.over) r.over = [7, 8, 9].map(k => e.over[k]).filter(x => x != null).join(" ");
    r.cond = e.cond || ""; r.stk = e.stk || 1; r.ht = e.ht || ""; r.tags = (e.tags || []).join(" ");
    r.perLux = !!e.perLux; r.el = e.el || "";
    return r;
  }

  // ---- 一覧 ----
  // 「素質の確認」と「ロスレコの確認」（edit_lr.js）の切り替え
  let MODE = "pot";
  const modeOk = m => m === "lr" ? !!window.EDIT_LR : (m === "sk" || m === "tr") ? !!window.EDIT_SK : m === "pot";
  try { const m = localStorage.getItem("stellasora-edit-mode"); MODE = modeOk(m) ? m : "pot"; } catch (e) { /* 無視 */ }
  const STEPS = {
    pot: "<b>手順</b>　① 巡遊者を選ぶ　② 素質をクリック　③ ゲームの素質の画面と比べて「合ってる／数字が違う／わからない」を押す　④ 終わったら右下の「確認の結果を書き出す」→「コピー」→ Claude に貼り付ける",
    sk: "<b>手順</b>　① 巡遊者をクリック　② ゲームのスキルの画面（Lvごと）と比べて、分かった数字を「ゲーム」に入れる。Discord などでもらった数字は「報告」に入れる　③「確定する」を押す　④ 終わったら右下の「確認の結果を書き出す」→「コピー」→ Claude に貼り付ける",
    tr: "<b>手順</b>　① 巡遊者をクリック　② ゲームの信頼の画面（Lvごと）と比べて、分かった数字を「ゲーム」に入れる。もらった数字は「報告」に入れる　③「確定する」を押す　④ 終わったら右下の「確認の結果を書き出す」→「コピー」→ Claude に貼り付ける",
    lr: "<b>手順</b>　① 属性を選ぶ　② ロスレコをクリック　③ ゲームのロスレコの画面（突破・アシスト効果のLvは ◀▶ で切り替え）と比べて「合ってる／数字が違う／わからない」を押す　④ 終わったら右下の「確認の結果を書き出す」→「コピー」→ Claude に貼り付ける",
  };
  const bar = () => {
    if (MODE !== "pot") return;
    const done = (en, t) => { let n = 0, d = 0, dr = 0; Object.keys(t.potentials || {}).forEach(role => t.potentials[role].forEach(g => g.potentials.forEach(p => { n++; { const u = specOf(en, p.name); if ((u && !u.draft) || (!u && builtIn(en, p.name)) || ckDone(en, p.name)) d++; else if ((u && u.draft) || draftOf(en, role, p.name)) dr++; } }))); return [d, n, dr]; };
    const t = TREKKERS.find(x => x.en === S.t), [d, n, dr] = done(S.t, t);
    $("bar").innerHTML = `${CMP.modeBar("pot")}<b style="margin-left:8px">巡遊者:</b><select id="selT">${trekkers.map(x => { const [dd, nn, rr] = done(x.en, x); return `<option value="${esc(x.en)}"${x.en === S.t ? " selected" : ""}>${"★" + x.rarity} ${esc(TJ(x.en))}（${x.element}）  確認済み ${dd} ／ 下書き ${rr} ／ 全${nn}</option>`; }).join("")}</select>
      <button class="sbtn${S.role === "main" ? " on" : ""}" data-act="role:main">主力の素質</button><button class="sbtn${S.role === "support" ? " on" : ""}" data-act="role:support">支援の素質</button>
      <span class="muted">${esc(TJ(S.t))}：確認済み ${d} ／ 全 ${n} 件（このブラウザで「合ってる」などを押したもの ${Object.keys(chk[S.t] || {}).length} 件）</span>
      <label class="muted" style="margin-left:auto"><input type="checkbox" data-act="adv"${S.adv ? " checked" : ""}> 詳しい入力を出す（通常は使いません）</label>`;
  };
  function renderList() {
    if (MODE !== "pot") return;
    const t = TREKKERS.find(x => x.en === S.t);
    const groups = (t.potentials || {})[S.role] || [];
    const card = p => {
      const u = specOf(S.t, p.name), b = builtIn(S.t, p.name), dr = draftOf(S.t, S.role, p.name);
      const tag = (!u && !b && dr) ? `<span class="tag t-draft">下書き（自動）${dr.review ? "・要確認" : ""}</span>` : u ? (u.draft ? `<span class="tag t-draft">下書き（未確認）</span>` : `<span class="tag t-user">入力済み${u.e && u.e.length ? "" : "（影響なし）"}</span>`) : b ? `<span class="tag t-built">組み込み（検証済み）</span>` : `<span class="tag t-none">未入力</span>`;
      const ck = chkOf(S.t, p.name);
      const ckTag = ck ? `<span class="tag ck-${ck.st}">${CK_NAME[ck.st]}</span>` : ((u && !u.draft) || (!u && b)) ? '<span class="tag ck-ok">確認済み</span>' : '<span class="tag t-none">未確認</span>';
      return `<div class="pc${S.sel === p.name ? " sel" : ""}" data-act="pick:${esc(p.name)}"><b>${esc(PJ(S.t, p.name))}</b>${p.type === 1 ? '<span class="tag t-core">コア</span>' : ""}${p.type === 1 && coreLv(S.t, p.name) ? `<span class="tag t-built">${esc((SKILLS.find(x => x[0] === coreLv(S.t, p.name).k) || [0, ""])[1])}Lvで伸びる</span>` : ""}${ckTag}${S.adv ? tag : ""}<span class="en">${esc(p.name)}</span><span class="muted">${esc(((jpOf(S.t, S.role, p.name) || {}).text || p.brief || ""))}</span></div>`;
    };
    const builds = groups.filter(g => !/Generic/i.test(g.title)), gen = groups.find(g => /Generic/i.test(g.title));
    const bn = g => { const m = /Build (\d)/i.exec(g.title); return m ? m[1] : "?"; };
    const grid = (arr, c) => `<div class="pgrid" style="grid-template-columns:repeat(${c},minmax(0,1fr))">${arr.map(card).join("")}</div>`;
    const slRow = `<div class="sl"><b>スキルLv</b>${SKILLS.map(([k, nm]) => `<label>${nm} <select data-sl="${k}">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(v => `<option${v === slOf(S.t, k) ? " selected" : ""}>${v}</option>`).join("")}</select></label>`).join("")}
      <div class="muted">ゲームの画面と同じLv（徽章なし）を入れてください。コア素質の追加ダメージの数字を、そのLvの値で出します。</div></div>`;
    // 並び（3列）: 特化構築ごとに「コア2つ」→「素質」、最後に汎用（2026-11-07 ユーザー指定）
    $("list").innerHTML = slRow + builds.map(g => `<div class="phead">コア：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type === 1), 3)}<div class="phead">${S.role === "main" ? "主力" : "支援"}：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type !== 1), 3)}`).join("") + (gen ? `<div class="phead">汎用</div>${grid(gen.potentials, 3)}` : "");
  }

  // ---- 入力欄 ----
  let rows = [], meta = { ext: "", off: false, none: false, note: "", fromDraft: false, unk: null };
  function openPot(name) {
    S.sel = name;
    const u = specOf(S.t, name), b = builtIn(S.t, name), dr = draftOf(S.t, S.role, name);
    const src = u || b || dr;
    meta.fromDraft = !!(u && u.draft) || (!u && !b && !!dr); meta.unk = (dr && dr.review && !u && !b) ? dr.unk : null;
    rows = src && src.e ? src.e.map(fromEngine) : [];
    meta = { ext: (src && src.ext) || "", off: !!(src && src.off), none: !!(src && src.e && src.e.length === 0 && !(src.review)), note: (src && src.note) || "", txt: (src && src.txt) || "", fromDraft: meta.fromDraft, unk: meta.unk };
    renderEditor();
  }
  const sel = (id, opts, cur) => `<select data-f="${id}">${opts.map(o => `<option value="${esc(o[0])}"${String(o[0]) === String(cur) ? " selected" : ""}>${esc(o[1])}</option>`).join("")}</select>`;
  function numsTable(p) {
    const n = p.nums || [];
    if (!n.length) return '<span class="muted">Lvごとの数値はありません</span>';
    const capIdx = new Set(rows.filter(r => r.extcap && r.src === "n").map(r => +r.n));
    const est = (a, lv, idx) => { if (a.length < 2) return null; const v = (meta.ext === "cap" || capIdx.has(idx)) ? a[a.length - 1] : a[a.length - 1] + (a[a.length - 1] - a[a.length - 2]) * (lv - a.length); return Math.round(v * 100) / 100; };
    const head = [1, 2, 3, 4, 5, 6].map(i => `<th style="${i === 1 || i === 6 ? "" : "color:var(--muted);font-weight:400"}">Lv${i}${i === 1 || i === 6 ? "" : "（未確認）"}</th>`).join("") + [7, 8, 9].map(i => `<th style="color:var(--muted);font-weight:400;background:#f3efe4">Lv${i}（推定）</th>`).join("");
    return `<table class="lv"><tr><th>番号</th>${head}</tr>${n.map((a, i) => `<tr><td>${i}</td>${[0, 1, 2, 3, 4, 5].map(j => `<td>${a[j] != null ? a[j] : (a.length === 1 && j === 0 ? a[0] : "")}</td>`).join("")}${[7, 8, 9].map(lv => `<td style="background:#f3efe4;color:var(--muted)">${est(n[i], lv, i) == null ? "" : est(n[i], lv, i)}</td>`).join("")}</tr>`).join("")}</table>`;
  }
  // 確認の欄（Lv1とLv6だけ）。数字が違うときは、ゲームの数字を入れて保存する
  function checkHtml(p) {
    const ck = chkOf(S.t, p.name) || {}, g = ck.g || {};
    // 日本語Wikiの文に出てくる数字（「27～107%」なら Lv1=27%・Lv6=107%）。無ければ、英語データの表
    const jn = (jpOf(S.t, S.role, p.name) || {}).nums;
    const nums = jn && jn.length ? jn.map(x => { const m = String(x).split(/[～~〜]/); const u = /%|％/.test(x) ? "%" : ""; return m.length > 1 ? [m[0].replace(/[%％]/g, "") + u, m[1].replace(/[%％]/g, "") + u] : [String(x)]; }) : (p.nums || []);
    // コア素質で、英語Wikiの数値（Lv1のスキルの値）÷日本語Wikiの数値（Lv10の値）がスキルLvの比と同じものは、入れたスキルLvの値にする
    let slNote = "";
    if (p.type === 1 && jn && jn.length) {
      const sk = potSkill(S.t, S.role, p.name), lv = slOf(S.t, sk), r1 = lvRatio(S.t, sk, 1), r = lvRatio(S.t, sk, lv);
      nums.forEach((a, i) => {
        const jv = parseFloat(a[0]), ev = ((p.nums || [])[i] || [])[0];
        if (a.length !== 1 || !(jv > 0) || !(ev > 0) || Math.abs(ev / jv - r1) > 0.03) return;
        const v = Math.round(jv * r * 10) / 10;
        if (lv !== 10) { nums[i] = ["約" + String(a[0]).replace(/^[\d.]+/, String(v))]; slNote = `「約」の数字は、${(SKILLS.find(x => x[0] === sk) || [0, ""])[1]}Lv${lv}のときの目安です（Lv10は ${jv}）。ゲームの画面とは小数点のあたりで少しずれることがあります。`; }
      });
    }
    const lv6 = a => a.length > 1 ? a[a.length - 1] : null;
    // 単位（%）は行の名前の横に出す。入れるのは数字だけ
    const unit = a => /%|％/.test(String(a[0])) ? '<span class="ck-u">（%）</span>' : "";
    const LVS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const key = lv => lv === 1 || lv === 6 ? ' class="ck-in ck-key"' : ' class="ck-in"';
    const inp = (i, lv) => `<input type="text" inputmode="decimal" data-ck="${i}:${lv}" value="${esc((g[i] || {})[lv] || "")}">`;
    // Lvで変わらない数字（コア素質など）は Lv1 の欄だけ
    const rowsH = nums.map((a, i) => `<tr><td>${i + 1}つ目${unit(a)}</td><td>${a[0]}</td><td>${lv6(a) == null ? "—" : lv6(a)}</td>
      ${LVS.map(lv => `<td${key(lv)}>${lv6(a) == null && lv !== 1 ? "—" : inp(i, lv)}</td>`).join("")}</tr>`).join("");
    // 比べる表（登録・控え・報告・ゲーム）。控えは手元のときだけ
    const rf = ((window.REF_LOCAL || {})[S.t] || {})[p.name], used = new Set();
    const cxRows = nums.map((a, i) => {
      const cst = lv6(a) == null, lvs = cst ? [1] : LVS;
      const reg = cst ? { 1: a[0] } : { 1: a[0], 6: lv6(a) };
      const k = rf ? CMP.matchParam(rf.params.map(x => Array.isArray(x) ? x : String(x).split("/")), reg, cst ? [1] : [1, 6], used) : -1;
      const pr = k >= 0 ? (Array.isArray(rf.params[k]) ? rf.params[k] : String(rf.params[k]).split("/")) : null;
      // 「約」の数字（スキルLvで伸びる数字を、選んだスキルLvの値に直したもの）は目安なので、1%までのずれは合っているとみなす
      return { i, label: `${i + 1}つ目`, reg, ref: pr ? CMP.toLv(pr.length === 1 ? [pr[0]] : pr, lvs) : null, lvs, groups: cst ? [{ lvs: [1], ends: [1], mid: 0 }] : POT_GROUPS, tol: /^約/.test(String(a[0])) ? 0.01 : 0 };
    });
    const cxGet = (kd, i, lv) => kd === "g" ? (ckBuf[i + ":" + lv] != null ? ckBuf[i + ":" + lv] : (g[i] || {})[lv]) : (ckBuf["r:" + i + ":" + lv] != null ? ckBuf["r:" + i + ":" + lv] : ((ck.r || {})[i] || {})[lv]);
    if (window.CMP && nums.length) {
      // コア素質はスキルLvで数字が変わるので、確定するときに、そのときのスキルLvも残す
      // スキルLvで伸びる数字は、スキルLv1〜10の目安と、ゲーム・報告の数字を比べる（2つそろえば伸び方が合っている）
      const cl = p.type === 1 ? coreLv(S.t, p.name) : null;
      const SLV = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];   // Lv11〜13 は徽章などで上がったとき
      const slRows = cl ? (jn || []).map((x, i) => { const f = String(x).match(/\d+(?:\.\d+)?/), jv = f ? parseFloat(f[0]) : null; if (jv == null || !cl.vals.some(v => Math.abs(v - jv) < 0.05)) return null; const reg = {}; SLV.forEach(lv => { reg[lv] = String(Math.round(jv * lvRatio(S.t, cl.k, lv) * 10) / 10); }); return { i: "s" + i, label: `${i + 1}つ目`, reg, ref: reg, selfRef: true, regName: "目安", okText: "伸び方が合っている", tol: 0.01 }; }).filter(Boolean) : [];
      const slTable = slRows.length ? `<div class="phead" style="font-size:13px">スキルLvで伸びる数字（${esc((SKILLS.find(x => x[0] === cl.k) || [0, cl.k])[1])}のLv）</div>
        <div class="muted">計算機は、この数字を${esc((SKILLS.find(x => x[0] === cl.k) || [0, cl.k])[1])}のLvで伸ばしています（Lv10の値 × そのスキルの倍率の伸び方）。目安＝計算機が使う値。ゲームの画面で見た数字を、そのときのスキルLvの欄に入れてください。2つそろえば、伸び方が合っているか分かります（目安は計算で出した値なので、1%までのずれは合っているとみなします）。Lv11〜13 の目安は、計算機が Lv1→10 の平均の伸びで延ばした仮の値です。Lv11〜13 は1つ分かれば判定を出します。</div>
        ${(() => {   // 徽章を付け替えながら入れやすいように、「今のスキルLv（徽章込み）」を選んで、その時の数字だけを入れる欄（下の表の同じ欄と同じもの）
          const cur = slOf(S.t, cl.k), nm = esc((SKILLS.find(x => x[0] === cl.k) || [0, cl.k])[1]);
          return `<div class="sl" style="background:#EEF6FF"><b>今の${nm}Lv（徽章込み）</b><select data-sl="${cl.k}">${SLV.map(v => `<option${v === cur ? " selected" : ""}>${v}</option>`).join("")}</select>
            ${slRows.map(r => `<label>${esc(r.label)}（ゲーム）<input type="text" inputmode="decimal" style="width:70px;min-height:30px;border-radius:8px;border:2px solid var(--border)" data-ck="${r.i}:${cur}" value="${esc(cxGet("g", r.i, cur) || "")}"> <span class="muted">目安 ${esc(r.reg[cur])}</span></label>`).join("")}
            <div class="muted">徽章を付け替えたら、まずここのLvを画面のスキルLv（徽章込み）に合わせてから、その時の数字を入れてください。入れた数字は下の表の同じLvの欄に入ります（「合ってる」などで保存）。</div></div>`;
        })()}
        ${CMP.table({ lvs: SLV, head: lv => (lv === slOf(S.t, cl.k) ? "▶" : "") + "スキルLv" + lv, rows: slRows, groups: [{ lvs: SLV.slice(0, 10), ends: [], mid: 2 }, { lvs: [11, 12, 13], ends: [], mid: 1 }], get: cxGet, attr: (kd, i, lv) => `data-ck="${kd === "r" ? "r:" : ""}${i}:${lv}"` })}` : "";
      CK_ROWS = { rows: cxRows, get: cxGet, sl: p.type === 1 ? (k => ({ k, lv: slOf(S.t, k) }))(potSkill(S.t, S.role, p.name)) : null };
      const fx = ck.fix || {};
      return `<div class="ck">
      <div class="ck-h">ゲームの素質の画面と比べてください</div>
      <div class="muted">上の文は日本語Wikiの文です。登録＝サイトの今の値（Wiki）、控え＝手元の照合用データ、報告＝Discord などでもらった値、ゲーム＝自分で画面を見た値です。</div>
      ${CMP.table({ lvs: LVS, head: lv => "素質Lv" + lv, rows: cxRows, groups: POT_GROUPS, get: cxGet, attr: (kd, i, lv) => `data-ck="${kd === "r" ? "r:" : ""}${i}:${lv}"`, fix: i => fx[i] })}${slTable}
      <div class="muted">報告・ゲームの数字は、分かったところだけ入れてください。緑＝控え（無ければ登録）と同じ、赤＝違う、青＝比べる相手が無い。確定のきまり：Lv1とLv6＋Lv2〜5のどれか1つ／Lv7〜9は2つ。</div>${slNote ? `<div class="muted">${slNote}</div>` : ""}
      <div class="fld"><label>メモ</label><input type="text" data-ck="memo" value="${esc(ck.memo || "")}" placeholder="気づいたこと（文が違う・何に効くかわからない・報告した人 など）"></div>
      <div class="ck-b"><button class="btn-add pri" data-act="ck:ok">合ってる</button><button class="btn-add" data-act="ck:diff">数字が違う（入れた数字で保存）</button><button class="btn-add" data-act="ck:unk">わからない（メモで保存）</button><button class="btn-add" data-act="ck:fix" style="background:#2E9E7A;color:#fff">確定する（そろった範囲）</button>${ck.fix ? `<button class="btn-add" data-act="ck:unfix">確定を消す</button>` : ""}${ck.st ? `<button class="btn-add" data-act="ck:del">確認を消す</button>` : ""}</div>
      <div class="muted" id="ckmsg">${ck.st ? `今の確認: <b>${CK_NAME[ck.st]}</b>` : "まだ確認していません"}${ck.fix ? `・確定済み（${esc(ck.fixAt || "")}${ck.sl ? `、${esc((SKILLS.find(x => x[0] === ck.sl.k) || [0, ck.sl.k])[1])}Lv${ck.sl.lv}のときの数字` : ""}）` : ""}</div>
    </div>`;
    }
    return `<div class="ck">
      <div class="ck-h">ゲームの素質の画面と比べてください</div>
      <div class="muted">上の文は日本語Wikiの文です。ゲームの画面（素質の説明、初期Lv＝Lv1、最大＝Lv6）と、文と数字が合っているかを見てください。</div>
      ${nums.length ? `<table class="lv ck-t"><tr><th rowspan="2">文の中の数字</th><th rowspan="2">Wiki Lv1</th><th rowspan="2">Wiki Lv6</th><th colspan="9">ゲーム</th></tr><tr>${LVS.map(lv => `<th${key(lv)}>Lv${lv}</th>`).join("")}</tr>${rowsH}</table>
      <div class="muted">ゲームの数字は、違うときだけ入れてください（Wikiに無いLvは、分かった数字を入れてください）。</div>${slNote ? `<div class="muted">${slNote}</div>` : ""}` : '<div class="muted">文の中に数字はありません。</div>'}
      <div class="fld"><label>メモ</label><input type="text" data-ck="memo" value="${esc(ck.memo || "")}" placeholder="気づいたこと（文が違う・何に効くかわからない など）"></div>
      <div class="ck-b"><button class="btn-add pri" data-act="ck:ok">合ってる</button><button class="btn-add" data-act="ck:diff">数字が違う（入れた数字で保存）</button><button class="btn-add" data-act="ck:unk">わからない（メモで保存）</button>${ck.st ? `<button class="btn-add" data-act="ck:del">確認を消す</button>` : ""}</div>
      <div class="muted" id="ckmsg">${ck.st ? `今の確認: <b>${CK_NAME[ck.st]}</b>` : "まだ確認していません"}</div>
    </div>`;
  }
  // 素質の確定のきまり（2026-11-08 ユーザー）: Lv1とLv6＋Lv2〜5のどれか1つ、Lv7〜9は2つ
  const POT_GROUPS = [{ lvs: [1, 2, 3, 4, 5, 6], ends: [1, 6], mid: 1 }, { lvs: [7, 8, 9], ends: [], mid: 2 }];
  let CK_ROWS = null;   // 今開いている素質の比べる表（確定ボタンで使う）
  // 手元だけの照合用データ（data/ref.local.js があれば、localhost のときだけ読む）。公開サイトには出ない
  function refHtml(p) {
    const r = ((window.REF_LOCAL || {})[S.t] || {})[p.name];
    if (!window.REF_LOCAL) return "";
    if (!r) return `<div class="eff" style="border-style:dashed"><b>照合用の控え</b> <span class="muted">（この素質は控えにありません）</span></div>`;
    const pv = v => Array.isArray(v) ? v.join(" ／ ") : String(v);
    const desc = esc(String(r.desc || "").replace(/<\/?color[^>]*>/g, "").replace(/##([^#]+)#\d+#/g, "$1").replace(/\u000b/g, "\n"))
      .replace(/&amp;Param(\d+)&amp;/g, (m, i) => `<b style="color:var(--indigo)">［${esc(pv(r.params[i - 1] != null ? r.params[i - 1] : "?"))}］</b>`).replace(/\n/g, "<br>");
    const prm = r.params.map((v, i) => `Param${i + 1}: ${esc(pv(v))}`).join("<br>");
    const tip = (r.tips || []).map((t, i) => {
      const a = [t.damageType, t.effectType, t.buffDuration != null ? t.buffDuration + "秒" : "", t.buffStacks != null ? "最大" + t.buffStacks + "重" : "", (t.damageTag || []).join(",")].filter(Boolean);
      return a.length ? `Param${i + 1}: ${esc(a.join(" ・ "))}` : "";
    }).filter(Boolean).join("<br>");
    const line = (k, v) => v && v.length ? `<div><span class="muted">${k}：</span>${esc(v.join(" ／ "))}</div>` : "";
    return `<div class="eff" style="border-style:dashed;overflow-wrap:anywhere"><b>照合用の控え</b> <span class="muted">（手元だけ・答え合わせ用。ここの値を計算に写さない）</span>
      <div class="txt" style="margin:4px 0">${esc(r.jp || "")}<br>${desc}</div>
      ${line("ダメージの扱い", r.dmg)}${line("効果の種類", r.eff)}${line("加算の種類", r.attr)}
      <details><summary class="muted">数値の詳細</summary><div class="muted" style="font-size:12px">${prm}${tip ? "<br>" + tip : ""}</div></details></div>`;
  }

  function renderEditor() {
    if (MODE !== "pot") return;
    const t = TREKKERS.find(x => x.en === S.t);
    let p = null;
    ["main", "support"].forEach(r => (t.potentials[r] || []).forEach(g => g.potentials.forEach(x => { if (x.name === S.sel && r === S.role) p = x; })));
    if (!p) { $("editor").innerHTML = "<h2>素質の確認</h2><p class=\"muted\">左の素質を選んでください。</p>"; return; }
    if (!S.adv) {
      $("editor").innerHTML = `<h2>${esc(PJ(S.t, p.name))} <span class="muted">${esc(p.name)}</span></h2>
        <div class="txt">${esc((jpOf(S.t, S.role, p.name) || {}).text || p.text || p.brief || "")}</div>${checkHtml(p)}${refHtml(p)}`;
      return;
    }
    const nOpts = (p.nums || []).map((a, i) => [i, `番号${i}（Lv1=${a[0]}${a.length > 1 ? " … Lv6=" + a[a.length - 1] : ""}）`]);
    const row = (r, i) => {
      const kd = KIND[r.k], flat = !!(kd[2] && kd[2].flat);
      const valHtml = r.k === "count" ? `<div class="fld"><label>ヒットの番号</label><input type="text" data-f="hit" data-i="${i}" value="${esc(r.hit)}" placeholder="例 mLong（sim_data の hit id）"></div><div class="fld"><label>加算する回数</label><input type="number" data-f="add" data-i="${i}" value="${esc(r.add)}"></div>`
        : `<div class="fld"><label>値の出どころ</label><div>${sel("src", [["n", "Lvごとの数値（上の表の番号）"], ["raw", r.k === "extra" ? "倍率%（固定）" : (flat ? "固定の実数" : "固定の%")], ["arr", "Lvごとに自分で入力（6個）"]], r.src).replace("data-f=", `data-i="${i}" data-f=`)}</div></div>
          ${r.src === "n" ? `<div class="fld"><label>番号</label><div>${sel("n", nOpts.length ? nOpts : [[0, "（数値なし）"]], r.n).replace("data-f=", `data-i="${i}" data-f=`)}</div></div>` : r.src === "raw" ? `<div class="fld"><label>値</label><input type="number" step="any" data-f="raw" data-i="${i}" value="${esc(r.raw)}"></div>` : `<div class="fld"><label>Lv1〜6の値</label><input type="text" data-f="arr" data-i="${i}" value="${esc(r.arr)}" placeholder="例 5 8 11 14 17 20（%）"></div>`}`;
      const extraHtml = r.k === "extra" ? `<div class="fld"><label>どの技に足すか</label><div>${sel("group", GROUPS, r.group).replace("data-f=", `data-i="${i}" data-f=`)}</div></div><div class="fld"><label>ダメージの種類</label><div>${sel("t", HITT, r.t).replace("data-f=", `data-i="${i}" data-f=`)}</div></div><div class="fld"><label>回数</label><input type="number" data-f="c" data-i="${i}" value="${esc(r.c)}"></div><div class="fld"><label>名前（結果の内訳）</label><input type="text" data-f="name" data-i="${i}" value="${esc(r.name)}"></div>` : "";
      const common = r.k === "extra" || r.k === "count" ? "" : `<div class="fld"><label>対象</label><div>${sel("to", TOS, r.to).replace("data-f=", `data-i="${i}" data-f=`)}</div></div>
          <div class="fld"><label>条件</label><div>${sel("cond", CONDS, r.cond).replace("data-f=", `data-i="${i}" data-f=`)}</div></div>
          <div class="fld"><label>重複数（最大）</label><input type="number" min="1" data-f="stk" data-i="${i}" value="${esc(r.stk)}"></div>
          <div class="fld"><label>ダメージの種類で絞る</label><div>${sel("ht", HTS, r.ht).replace("data-f=", `data-i="${i}" data-f=`)}<span class="muted"> 会心の効果だけ</span></div></div>`;
      const overHtml = (r.k === "count" || r.src === "raw" || r.k === "extra" && r.src === "raw") ? "" : `<div class="fld"><label>Lv7〜9を直接入力</label><input type="text" data-f="over" data-i="${i}" value="${esc(r.over || "")}" placeholder="例 80 90 100（Lv7 Lv8 Lv9。空=上の扱い）"></div>`;
      const capHtml = (r.k === "count" || r.src === "raw") ? "" : `<div class="fld"><label>Lv6から上がらない</label><div><input type="checkbox" data-f="extcap" data-i="${i}"${r.extcap ? " checked" : ""}> <span class="muted">説明文の数値に「(Max!)」が付いているとき</span></div></div>`;
      const tags = r.k === "count" ? "" : `<div class="fld"><label>対象のタグ</label><input type="text" data-f="tags" data-i="${i}" value="${esc(r.tags)}" placeholder="例 long glow（空=全て）"></div>`;
      return `<div class="eff"><div class="fld"><label>効果${i + 1}</label><div>${sel("k", KINDS.map(k => [k[0], k[1]]), r.k).replace("data-f=", `data-i="${i}" data-f=`)} <button class="btn-add" data-act="del:${i}" style="min-height:28px">削除</button></div></div>${valHtml}${capHtml}${overHtml}${extraHtml}${common}${tags}</div>`;
    };
    $("editor").innerHTML = `<h2>${esc(PJ(S.t, p.name))} <span class="muted">${esc(p.name)}</span></h2>
      <div class="txt">${esc((jpOf(S.t, S.role, p.name) || {}).text || p.text || p.brief || "")}</div>${checkHtml(p)}${refHtml(p)}
      ${((jpOf(S.t, S.role, p.name) || {}).terms || []).map(x => `<div class="muted" style="margin:2px 0">用語「${esc(x.term)}」：${esc(x.text)}</div>`).join("")}
      ${(jpOf(S.t, S.role, p.name) || {}).text ? '<div class="muted">↑ 日本語Wikiの文章。ゲーム内の文章と数値が違うことがあります（例：テレサ「絶流・波紋」はWiki 77%・ゲーム 60%）。' + (meta.fromDraft ? "下の効果は、この文章から自動で作った下書きです。" : "") + '</div>' : ""}
      ${meta.fromDraft ? `<div class="eff" style="border-color:#E3B27A"><b>下書きの内容</b><br>${rows.length ? rows.map(r => "・" + esc(describe(toEngine(r), p))).join("<br>") : "（効果なし／火力に影響しない、と判断）"}${meta.unk ? `<br><span style="color:var(--danger)">自動で分類できなかった文：</span>${meta.unk.map(esc).join(" ／ ")}` : ""}<div style="margin-top:6px"><button class="btn-add" data-act="ok" style="background:var(--indigo);color:#fff">この内容でOK（確認済みにする）</button></div></div>` : ""}
      <div class="muted">Lvごとの数値（文章の中の数値を、左から順に拾ったもの）。素質の一覧の画面で見えるのは Lv1 と Lv6 です。Lv2〜5・Lv7〜9 は星ノ塔の周回中の画面で見えます（まだ集めきれていないので、Lv2〜5 はWikiの値、Lv7〜9 は推定値）。</div>${numsTable(p)}
      <div class="fld"><label>火力に影響しない</label><div><input type="checkbox" data-f="none"${meta.none ? " checked" : ""}> <span class="muted">（盾・回復・防御・復活など。効果の入力は不要です）</span></div></div>
      <div class="fld"><label>既定で反映しない</label><div><input type="checkbox" data-f="off"${meta.off ? " checked" : ""}> <span class="muted">（条件が重い効果）</span></div></div>
      <div class="fld"><label>Lv7〜9の値</label><div class="muted">既定は、直前の増え方で延長（推定）。説明文で数値に「(Max!)」が付いているものは、効果ごとのチェックで「Lv6から上がらない」にします。確定していません。</div></div>
      <div class="fld"><label>説明（計算ページ）</label><input type="text" data-f="txt" value="${esc(meta.txt || "")}" placeholder="計算ページの素質カードに出る文。空=メモの内容"></div>
      <div class="fld"><label>メモ</label><input type="text" data-f="note" value="${esc(meta.note)}" placeholder="確認した内容・未確認の点"></div>
      ${meta.none ? "" : rows.map(row).join("")}
      <div style="display:flex;gap:6px;margin-top:6px">${meta.none ? "" : '<button class="btn-add" data-act="addrow">効果を追加</button>'}<button class="btn-add" data-act="save" style="background:var(--indigo);color:#fff">この素質を保存</button><button class="btn-add" data-act="drop">入力を消す</button></div>
      <p class="muted" id="emsg"></p>`;
  }

  // ---- イベント ----
  const ckBuf = {};   // 確認の欄の入力中の値（保存ボタンで確定）
  document.addEventListener("input", ev => { const c = ev.target.getAttribute && ev.target.getAttribute("data-ck"); if (c) ckBuf[c] = ev.target.value; });
  document.addEventListener("change", ev => {
    const t = ev.target;
    if (t.getAttribute && t.getAttribute("data-ck")) { ckBuf[t.getAttribute("data-ck")] = t.value; return; }
    if (t.getAttribute && t.getAttribute("data-sl")) { SL[S.t] = SL[S.t] || {}; SL[S.t][t.getAttribute("data-sl")] = +t.value; try { localStorage.setItem(SLKEY, JSON.stringify(SL)); } catch (e) { /* 無視 */ } renderList(); renderEditor(); return; }
    if (t.id === "selT") { S.t = t.value; S.sel = null; try { localStorage.setItem("stellasora-edit-t", JSON.stringify(S.t)); } catch (e) { /* 無視 */ } bar(); renderList(); renderEditor(); return; }
    const f = t.getAttribute && t.getAttribute("data-f");
    if (!f) return;
    const i = t.getAttribute("data-i");
    const v = t.type === "checkbox" ? t.checked : t.value;
    if (i != null) {
      const r = rows[+i];
      if (f === "k") { const old = r.k; r.k = v; if (v === "extra" && old !== "extra") { r.src = "raw"; if (!r.name) r.name = PJ(S.t, S.sel); } const dt = KIND[v] && KIND[v][2] && KIND[v][2].to; if (dt) r.to = dt; else if (r.to === "enemy") r.to = ""; }
      else r[f] = v;
    } else if (f === "none" || f === "off") { meta[f] = v; if (f === "none" && v) rows = []; }
    else if (f === "note") meta.note = v;
    else if (f === "txt") meta.txt = v;
    else if (f === "ext") meta.ext = v;
    renderEditor();
  });
  document.addEventListener("click", ev => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const a = el.getAttribute("data-act");
    if (a.indexOf("mode:") === 0) { setMode(a.slice(5)); return; }
    if (MODE !== "pot") { if (a !== "ckexport" && a !== "copy") return; }
    if (a === "adv") { S.adv = el.checked; bar(); renderList(); renderEditor(); return; }
    if (/^ck:/.test(a)) {
      const st = a.slice(3), name = S.sel;
      chk[S.t] = chk[S.t] || {};
      if (st === "del") { delete chk[S.t][name]; }
      else {
        // 今の欄の値を集める（打ったものは ckBuf、触っていない欄は画面の値）
        const vals = {};
        document.querySelectorAll("[data-ck]").forEach(x => { const k = x.getAttribute("data-ck"); vals[k] = ckBuf[k] != null ? ckBuf[k] : x.value; });
        const g = {};
        const rp = {};
        Object.keys(vals).filter(k => k !== "memo").forEach(k => { const ks = k.split(":"), isR = ks[0] === "r", i = isR ? ks[1] : ks[0], lv = isR ? ks[2] : ks[1], v = String(vals[k]).replace(/[%％\s]/g, ""); const m = isR ? rp : g; if (v) { m[i] = m[i] || {}; m[i][lv] = v; } });
        if (st === "diff" && !Object.keys(g).length) { const m = $("ckmsg"); if (m) m.textContent = "ゲームの数字を、違うところだけ入れてから押してください"; return; }
        const prev = (chk[S.t] || {})[name] || {};
        if ((st === "fix" || st === "unfix") && !prev.st && st === "unfix") return;
        const o = { st: st === "fix" || st === "unfix" ? (prev.st || "ok") : st, at: new Date().toLocaleDateString("sv") };
        if (Object.keys(g).length) o.g = g;   // Lv2〜5・7〜9 を集めるので、「合ってる」「わからない」でも入れた数字は残す
        if (Object.keys(rp).length) o.r = rp;
        if (st === "fix") {
          const f = CK_ROWS ? CMP.fixAll(CK_ROWS.rows, POT_GROUPS, (kd, i, lv) => ((kd === "g" ? g : rp)[i] || {})[lv]) : {};
          if (!Object.keys(f).length) { const m = $("ckmsg"); if (m) m.textContent = "確定できる範囲がまだありません（判定の行を見てください）"; return; }
          o.fix = f; o.fixAt = o.at;
          if (CK_ROWS && CK_ROWS.sl) o.sl = CK_ROWS.sl;
        } else if (st !== "unfix" && prev.fix) { o.fix = prev.fix; o.fixAt = prev.fixAt; }
        if (vals.memo && String(vals.memo).trim()) o.memo = String(vals.memo).trim();
        chk[S.t][name] = o;
      }
      Object.keys(ckBuf).forEach(k => delete ckBuf[k]);
      saveChk(); bar(); renderList(); renderEditor();
      return;
    }
    if (a === "ckexport") {
      // 取り込み済み（data/pot_check.js）と同じものは出さない。このブラウザで新しく入れた・変えた素質だけ（貼る量を減らす）
      const out = {}; let n = 0;
      Object.keys(chk).forEach(t => Object.keys(chk[t] || {}).forEach(p => { if (JSON.stringify(chk[t][p]) !== JSON.stringify((CK_FILE[t] || {})[p])) { (out[t] = out[t] || {})[p] = chk[t][p]; n++; } }));
      const del = []; Object.keys(CK_FILE).forEach(t => Object.keys(CK_FILE[t]).forEach(p => { if (!(chk[t] || {})[p]) del.push(t + " / " + p); }));
      const rest = (window.EDIT_LR ? window.EDIT_LR.exportText() : "") + (window.EDIT_SK ? window.EDIT_SK.exportText() : "");
      const NL = String.fromCharCode(10);
      $("io").value = (n || del.length ? "// 素質の確認（edit.html で作成）。取り込み済みから変わった素質だけ（" + n + "件）" + NL + "window.POT_CHECK_DIFF = " + JSON.stringify(out) + ";" + NL + (del.length ? "// 消した確認: " + del.join("、") + NL : "") : "") + rest;
      $("iomsg").textContent = $("io").value.trim() ? `書き出しました（素質 ${n}件${del.length ? `・消した ${del.length}件` : ""}）。「コピー」を押して、Claude に貼り付けてください。` : "取り込み済みから変わったものはありません。";
      return;
    }
    if (a.indexOf("role:") === 0) { S.role = a.slice(5); S.sel = null; bar(); renderList(); renderEditor(); return; }
    if (a.indexOf("pick:") === 0) { Object.keys(ckBuf).forEach(k => delete ckBuf[k]); openPot(a.slice(5)); renderList(); return; }
    if (a === "ok") { const e = meta.none ? [] : rows.map(toEngine); user[S.t] = user[S.t] || {}; const o = { done: true, e, txt: meta.txt || "", verified: "確認済み" }; if (meta.off) o.off = true; if (meta.ext) o.ext = meta.ext; if (meta.note) o.note = meta.note; user[S.t][S.sel] = o; save(); meta.fromDraft = false; meta.unk = null; bar(); renderList(); renderEditor(); return; }
    if (a === "addrow") { rows.push(newRow()); renderEditor(); return; }
    if (a.indexOf("del:") === 0) { rows.splice(+a.slice(4), 1); renderEditor(); return; }
    if (a === "save") {
      const e = meta.none ? [] : rows.map(toEngine);
      user[S.t] = user[S.t] || {};
      const o = { done: true, e };   // 保存すると「下書き」の印は外れる（確認した内容として扱う）
      if (meta.off) o.off = true;
      if (meta.ext) o.ext = meta.ext;
      if (meta.note) o.note = meta.note;
      o.txt = meta.txt || meta.note || (meta.none ? "火力に影響なし" : "");
      user[S.t][S.sel] = o; save(); bar(); renderList();
      const m = $("emsg"); if (m) m.textContent = "保存しました（ブラウザに保存。全員分を書き出すと、data/spec_user.js の内容になります）";
      return;
    }
    if (a === "drop") { if (user[S.t]) delete user[S.t][S.sel]; save(); openPot(S.sel); bar(); renderList(); return; }
    if (a === "export") { $("io").value = "// 素質の効果の入力（edit.html で作成）。\nwindow.SPEC_USER = " + JSON.stringify(user, null, 1) + ";\n"; $("iomsg").textContent = "書き出しました。data/spec_user.js に貼り付けると、sim.html が使います。"; return; }
    if (a === "copy") { try { $("io").select(); navigator.clipboard.writeText($("io").value); $("iomsg").textContent = "コピーしました"; } catch (e) { $("iomsg").textContent = "コピーできませんでした。枠の中を選んでコピーしてください"; } return; }
    if (a === "import") {
      try {
        const txt = $("io").value.replace(/^\s*\/\/[^\n]*\n/gm, "").replace(/^[\s\S]*?window\.SPEC_USER\s*=\s*/, "").replace(/;\s*$/, "");
        const o = JSON.parse(txt);
        Object.keys(o).forEach(t => { user[t] = Object.assign(user[t] || {}, o[t]); });
        save(); bar(); renderList(); $("iomsg").textContent = "読み込みました";
      } catch (e) { $("iomsg").textContent = "読み込めませんでした（形式を確認してください）"; }
      return;
    }
    if (a === "clear") { if (confirm(TJ(S.t) + " の入力を消します。よいですか？")) { delete user[S.t]; save(); S.sel = null; bar(); renderList(); renderEditor(); } }
  });
  function setMode(m) {
    MODE = modeOk(m) ? m : "pot";
    try { localStorage.setItem("stellasora-edit-mode", MODE); } catch (e) { /* 無視 */ }
    $("steps").innerHTML = STEPS[MODE];
    if (MODE === "lr") window.EDIT_LR.render(); else if (MODE === "sk" || MODE === "tr") window.EDIT_SK.render(MODE); else { bar(); renderList(); renderEditor(); }
  }
  setMode(MODE);
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {   // 手元で開いたときだけ、照合用の控えを読む（無ければ何もしない）
    const s = document.createElement("script");
    s.src = "data/ref.local.js?t=" + Date.now();
    s.onload = () => setMode(MODE);
    document.head.appendChild(s);
  }
})();
