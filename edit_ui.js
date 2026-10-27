// 素質の効果の入力ページ。原文（英語）と Lv の値を見ながら、効果の種類・値・対象を選んで入力する。
// 入力はブラウザに保存され、書き出すと data/spec_user.js の内容になる（sim.html が優先して使う）。
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const KEY = "stellasora-spec-user-v1";
  const TJ = en => (window.TREKKER_JA || {})[en] || en;
  const PJ = (t, en) => ((window.POTENTIAL_JA || {})[t] || {})[en] || en;

  // 効果の種類（k=計算での名前、flat=割合でなく実数、to=既定の対象）
  const KINDS = [
    ["W", "属性ダメージ（加算）"], ["Bs", "スキルダメージ（加算）"], ["Bb", "通常攻撃ダメージ（加算）"], ["Bu", "必殺技ダメージ（加算）"], ["mark", "印ダメージ（加算）"],
    ["atkPct", "攻撃力%"], ["hpPct", "最大HP%"], ["hpFlat", "基礎HP（加算・実数）", { flat: true }], ["atkFlat", "基礎攻撃力（加算・実数）", { flat: true }], ["pen", "属性耐性貫通（実数）", { flat: true }],
    ["critRate", "会心率"], ["critDmg", "会心ダメージ"],
    ["taken", "敵の被ダメージ（属性の別枠の乗算）", { to: "enemy" }], ["takenSkill", "敵のスキル被ダメージ", { to: "enemy" }], ["takenBasic", "敵の通常攻撃被ダメージ", { to: "enemy" }], ["takenMark", "敵の印被ダメージ", { to: "enemy" }],
    ["mult", "ヒットの倍率 ×(1+x)（対象のタグで絞る）"], ["count", "ヒット回数の加算（ヒットの番号を指定）", { flat: true }], ["extra", "追加ヒット（ダメージが増える）"],
  ];
  const KIND = Object.fromEntries(KINDS.map(k => [k[0], k]));
  const TOS = [["", "自身"], ["main", "主力"], ["all", "全員"], ["lux", "同じ属性の全員"], ["luxVers", "同じ属性のバランサー"], ["enemy", "敵（被ダメージ系）"]];
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
    return r;
  }

  // ---- 一覧 ----
  const bar = () => {
    const done = (en, t) => { let n = 0, d = 0, dr = 0; Object.keys(t.potentials || {}).forEach(role => t.potentials[role].forEach(g => g.potentials.forEach(p => { n++; { const u = specOf(en, p.name); if ((u && !u.draft) || (!u && builtIn(en, p.name))) d++; else if ((u && u.draft) || draftOf(en, role, p.name)) dr++; } }))); return [d, n, dr]; };
    const t = TREKKERS.find(x => x.en === S.t), [d, n, dr] = done(S.t, t);
    $("bar").innerHTML = `<b>巡遊者:</b><select id="selT">${trekkers.map(x => { const [dd, nn, rr] = done(x.en, x); return `<option value="${esc(x.en)}"${x.en === S.t ? " selected" : ""}>${"★" + x.rarity} ${esc(TJ(x.en))}（${x.element}）  確認済み ${dd} ／ 下書き ${rr} ／ 全${nn}</option>`; }).join("")}</select>
      <button class="sbtn${S.role === "main" ? " on" : ""}" data-act="role:main">主力の素質</button><button class="sbtn${S.role === "support" ? " on" : ""}" data-act="role:support">支援の素質</button>
      <span class="muted">${esc(TJ(S.t))}：確認済み ${d} 件・自動の下書き ${dr} 件・全 ${n} 件</span>`;
  };
  function renderList() {
    const t = TREKKERS.find(x => x.en === S.t);
    const groups = (t.potentials || {})[S.role] || [];
    const card = p => {
      const u = specOf(S.t, p.name), b = builtIn(S.t, p.name), dr = draftOf(S.t, S.role, p.name);
      const tag = (!u && !b && dr) ? `<span class="tag t-draft">下書き（自動）${dr.review ? "・要確認" : ""}</span>` : u ? (u.draft ? `<span class="tag t-draft">下書き（未確認）</span>` : `<span class="tag t-user">入力済み${u.e && u.e.length ? "" : "（影響なし）"}</span>`) : b ? `<span class="tag t-built">組み込み（検証済み）</span>` : `<span class="tag t-none">未入力</span>`;
      return `<div class="pc${S.sel === p.name ? " sel" : ""}" data-act="pick:${esc(p.name)}"><b>${esc(PJ(S.t, p.name))}</b>${p.type === 1 ? '<span class="tag t-core">コア</span>' : ""}${tag}<span class="en">${esc(p.name)}</span><span class="muted">${esc(((jpOf(S.t, S.role, p.name) || {}).text || p.brief || "").slice(0, 70))}</span></div>`;
    };
    const builds = groups.filter(g => !/Generic/i.test(g.title)), gen = groups.find(g => /Generic/i.test(g.title));
    const bn = g => { const m = /Build (\d)/i.exec(g.title); return m ? m[1] : "?"; };
    const grid = (arr, c) => `<div class="pgrid" style="grid-template-columns:repeat(${c},minmax(0,1fr))">${arr.map(card).join("")}</div>`;
    const coreRow = `<div class="pgrid" style="grid-template-columns:repeat(${Math.max(1, builds.length)},minmax(0,1fr));gap:14px">${builds.map(g => `<div><div class="phead">コア：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type === 1), 2)}</div>`).join("")}</div>`;
    $("list").innerHTML = coreRow + builds.map(g => `<div class="phead">${S.role === "main" ? "主力" : "支援"}：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type !== 1), 3)}`).join("") + (gen ? `<div class="phead">汎用</div>${grid(gen.potentials, 3)}` : "");
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
  function renderEditor() {
    const t = TREKKERS.find(x => x.en === S.t);
    let p = null;
    ["main", "support"].forEach(r => (t.potentials[r] || []).forEach(g => g.potentials.forEach(x => { if (x.name === S.sel && r === S.role) p = x; })));
    if (!p) { $("editor").innerHTML = "<h2>効果の入力</h2><p class=\"muted\">左の素質を選んでください。</p>"; return; }
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
      <div class="txt">${esc((jpOf(S.t, S.role, p.name) || {}).text || p.text || p.brief || "")}</div>
      ${(jpOf(S.t, S.role, p.name) || {}).text ? '<div class="muted">↑ 日本語Wiki（ゲーム内の文章）。' + (meta.fromDraft ? "下の効果は、この文章から自動で作った下書きです。" : "") + '</div>' : ""}
      ${meta.fromDraft ? `<div class="eff" style="border-color:#E3B27A"><b>下書きの内容</b><br>${rows.length ? rows.map(r => "・" + esc(describe(toEngine(r), p))).join("<br>") : "（効果なし／火力に影響しない、と判断）"}${meta.unk ? `<br><span style="color:var(--danger)">自動で分類できなかった文：</span>${meta.unk.map(esc).join(" ／ ")}` : ""}<div style="margin-top:6px"><button class="btn-add" data-act="ok" style="background:var(--indigo);color:#fff">この内容でOK（確認済みにする）</button></div></div>` : ""}
      <div class="muted">Lvごとの数値（文章の中の数値を、左から順に拾ったもの）。ゲーム内の画面で確認できるのは Lv1 と Lv6 だけで、Lv2〜5 はWikiの値（未確認）、Lv7〜9 は、実際にビルドを組まないと分かりません。</div>${numsTable(p)}
      <div class="fld"><label>火力に影響しない</label><div><input type="checkbox" data-f="none"${meta.none ? " checked" : ""}> <span class="muted">（盾・回復・防御・復活など。効果の入力は不要です）</span></div></div>
      <div class="fld"><label>既定で反映しない</label><div><input type="checkbox" data-f="off"${meta.off ? " checked" : ""}> <span class="muted">（条件が重い効果）</span></div></div>
      <div class="fld"><label>Lv7〜9の値</label><div class="muted">既定は、直前の増え方で延長（推定）。説明文で数値に「(Max!)」が付いているものは、効果ごとのチェックで「Lv6から上がらない」にします。確定していません。</div></div>
      <div class="fld"><label>メモ</label><input type="text" data-f="note" value="${esc(meta.note)}" placeholder="確認した内容・未確認の点"></div>
      ${meta.none ? "" : rows.map(row).join("")}
      <div style="display:flex;gap:6px;margin-top:6px">${meta.none ? "" : '<button class="btn-add" data-act="addrow">効果を追加</button>'}<button class="btn-add" data-act="save" style="background:var(--indigo);color:#fff">この素質を保存</button><button class="btn-add" data-act="drop">入力を消す</button></div>
      <p class="muted" id="emsg"></p>`;
  }

  // ---- イベント ----
  document.addEventListener("change", ev => {
    const t = ev.target;
    if (t.id === "selT") { S.t = t.value; S.sel = null; try { localStorage.setItem("stellasora-edit-t", JSON.stringify(S.t)); } catch (e) { /* 無視 */ } bar(); renderList(); renderEditor(); return; }
    const f = t.getAttribute && t.getAttribute("data-f");
    if (!f) return;
    const i = t.getAttribute("data-i");
    const v = t.type === "checkbox" ? t.checked : t.value;
    if (i != null) {
      const r = rows[+i];
      if (f === "k") { const old = r.k; r.k = v; if (v === "extra" && old !== "extra") { r.src = "raw"; } const dt = KIND[v] && KIND[v][2] && KIND[v][2].to; if (dt) r.to = dt; else if (r.to === "enemy") r.to = ""; }
      else r[f] = v;
    } else if (f === "none" || f === "off") { meta[f] = v; if (f === "none" && v) rows = []; }
    else if (f === "note") meta.note = v;
    else if (f === "ext") meta.ext = v;
    renderEditor();
  });
  document.addEventListener("click", ev => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const a = el.getAttribute("data-act");
    if (a.indexOf("role:") === 0) { S.role = a.slice(5); S.sel = null; bar(); renderList(); renderEditor(); return; }
    if (a.indexOf("pick:") === 0) { openPot(a.slice(5)); renderList(); return; }
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
  bar(); renderList();
})();
