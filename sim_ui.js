// 汎用計算ページの画面。状態は localStorage に保存（無くても動く）。入力の確定（change）のたびに全体を描き直す。
(function () {
  const S = window.SIM, E = S.engine;
  const $ = id => document.getElementById(id);
  const fmt = n => (n == null || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("ja-JP");
  const f3 = n => (n == null || !isFinite(n)) ? "—" : (Math.round(n * 1000) / 1000).toString();
  const pct = n => (Math.round(n * 1000) / 10) + "%";
  const clone = o => JSON.parse(JSON.stringify(o));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const KEY = "stellasora-sim-v3", KEY_B = "stellasora-sim-builds3", KEY_M = "stellasora-sim-memo";
  const SLOTS = [["main", "主力"], ["s1", "支援1"], ["s2", "支援2"]];
  const TK = en => TREKKERS.find(x => x.en === en);
  const chOf = id => S.CH.find(c => c.id === id);
  const JA = (en, id) => { const c = id && chOf(id); const m = (window.POTENTIAL_JA || {})[c ? c.en : ""] || {}; return m[en] || en; };   // 巡遊者ごとの日本語名（同じ英語名でも巡遊者で違う）
  const KIND_NAME = { triangle: "初級", circle: "中級", star: "上級" };       // 徽章は 初級・中級・上級 で呼ぶ（巡遊者ごとに三角・円・六星の並びが違うため）
  const KIND_ORDER = ["triangle", "circle", "star"];

  function defChar(id) {
    const c = chOf(id);
    const lv = { nazuka: { basic: 1, main: 1, support: 8, ult: 7 }, eleanor: { basic: 1, main: 1, support: 9, ult: 8 } }[id] || { basic: 10, main: 10, support: 10, ult: 10 };
    return { skillLv: clone(lv), trustLv: c.trust0, talent: c.talent0, emb: S.EMB_DEFAULT[id](), embOn: [1, 1, 1], add: {},
      manual: {}, pots: {}, sup: {}, pots2: {}, pon: {}, pstk: {}, pcnt: {} };
  }
  function defState() {
    const G = { team: { main: "willow", s1: "nazuka", s2: "eleanor" }, recordLv: 4, enemy: "stomp", traits: {}, enemyOv: { res: {}, extra: {} }, directPriority: true,
      notes: clone(TEST2_CTX.notes), lrMain: clone(TEST2_CTX.lr), lrSub: clone(TEST2_CTX.lrSub), lrOn: {}, lrN: {},
      lrManual: { baseAtk: 0, baseHp: 0, elem: 0, elemEl: "", basicDmg: 0, skillDmg: 0, atkPct: 0 },
      other: { mult: 1, taken: 1 }, heartCrit: false, glimmer: true, markDebuff: true, chars: {} };
    S.CH.forEach(c => { G.chars[c.id] = defChar(c.id); });
    return G;
  }

  // テスト3・セイナHCの構成は、画面のボタンをなくし、共有コードで読み込む。
  // セイナHC（記録Lv34）の入力（初期値との差分）。検証用に残す
  const HC_PATCH ={"team":{"main":"noya","s1":"tilia","s2":"firefly"},"recordLv":34,"notes":{"強撃の音符":0,"幸運の音符":51,"爆発の音符":15,"体力の音符":35,"集中の音符":15,"器用の音符":30,"必殺の音符":15,"水の音符":0,"風の音符":0,"光の音符":38},"lrMain":{"0":"mirai","1":"negai","2":"yuuzu"},"lrSub":{"0":"anaaki","1":"kakegae","2":"nitamono"},"lrOn":{"mirai:c:taken":false},"lrManual":{"baseAtk":null,"baseHp":null,"elem":null,"elemEl":"光"},"chars":{"noya":{"skillLv":{"basic":9},"trustLv":20,"emb":{"0":{"slots":{"0":{"k":"elemDmg","cat":"ダメージ・貫通"},"1":{"k":"derivedCritRate","q":"gold","cat":"従者・派生"},"2":{"k":"critRate","q":"rainbow","cat":"会心"},"3":{"k":"resPen","q":"rainbow","cat":"ダメージ・貫通"}}},"1":{"slots":{"0":{"k":"hpPct","cat":"ステータス"},"1":{"k":"lvMain","q":"rainbow3","cat":"スキル・素質"},"2":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"},"3":{"k":"spMain","q":"rainbow","cat":"その他"}}},"2":{"slots":{"0":{"k":"potCommon","q":"rainbow3","cat":"スキル・素質","t":"Argent Mirage: Legion's End"},"1":{"k":"baseAtk","cat":"ステータス"},"2":{"k":"ultDmg","q":"rainbow","cat":"ダメージ・貫通"},"3":{"k":"hpPct","q":"rainbow","cat":"ステータス"}}}},"add":{"basic":0.12,"skill":0.12,"hpPct":0.15},"pots2":{"Lucent_Blitz":1,"Dawnflare":1,"Prism_Warp":6,"Resolve__Blitz":6,"Astral_Brilliance":6,"Argent_Mirage__Legion_s_End":9,"Veteran_s_Grit":6,"Lucent_Tide":6,"Guiding_Star":6,"Empyrean_Starfall__Devil_s_End":0}},"firefly":{"skillLv":{"basic":1,"main":3,"support":8,"ult":9},"trustLv":10,"emb":{"0":{"slots":{"0":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"},"1":{"k":"spSupport","cat":"その他"},"2":{"k":"atkPct","cat":"ステータス"},"3":{"k":"resPen","q":"rainbow","cat":"ダメージ・貫通"}}},"1":{"slots":{"0":{"k":"lvMain","q":"rainbow3","cat":"スキル・素質"},"1":{"k":"hpPct","q":"rainbow","cat":"ステータス"},"2":{"k":"spSupport","cat":"その他"},"3":{"k":"ultDmg","q":"rainbow","cat":"ダメージ・貫通"}}},"2":{"slots":{"0":{"k":"potSupport","q":"rainbow2","cat":"スキル・素質","t":"Stellar Crash"},"1":{"k":"potCommon","q":"rainbow3","cat":"スキル・素質","t":"Persistent Warmth"},"2":{"k":"servantDmg","q":"rainbow","cat":"従者・派生"},"3":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"}}}},"pots2":{"Domain_of_Purity":6,"Stellar_Crash":6,"Radiance_Blade__Twin_Shadow":1,"Radiance_Blade__Firefly":1,"Lightforged_Blade":2,"Persistent_Warmth":4,"Sanctuary_of_Light":1},"pstk":{"Stellar_Crash":0}},"tilia":{"skillLv":{"basic":2,"main":4,"support":9,"ult":3},"emb":{"0":{"slots":{"0":{"k":"spSupport","q":"gold","cat":"その他"}}},"1":{"slots":{"0":{"k":"spSupport","q":"rainbow","cat":"その他"}}},"2":{"slots":{"0":{"k":"potSupport","q":"gold","cat":"スキル・素質","t":"Blinding Beam"}}}},"pots2":{"Holy_Inscription":1,"Renewed_Spectrum":1,"Enemy_Counter":6,"Blinding_Beam":7,"Revealed_Flaw":6,"Knight_s_Seal":1,"Banner_of_Glory":2,"Trick_Boost":0},"pon":{"Revealed_Flaw":false,"Holy_Inscription":false}}},"skOn":{"noya:ult":true}};
  S.presetHC = () => S.applyDiff(defState(), clone(HC_PATCH));
  let G = defState();
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.team) G = merge(defState(), s); } catch (e) { /* 保存なしでも動く */ }
  function merge(a, b) {
    Object.keys(b).forEach(k => { if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k])) merge(a[k], b[k]); else a[k] = b[k]; });
    return a;
  }
  let shareMsg = "";
  const DV = { preset: "", code: "", url: "" }, DM = {};   // ポップアップの各欄の値とメッセージ（{t, ng}）
  const V = { panel: "overview", tilesFor: "main", drill: null, pick: null, lrPick: null, lrEl: {}, mChar: "main", m: "in" };
  let memo = null;
  try { memo = JSON.parse(localStorage.getItem(KEY_M)); } catch (e) { memo = null; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) { /* 無視 */ } };

  // ---- パス指定の入力 ----
  function setPath(path, val) {
    const ks = path.split(".");
    let o = G;
    for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null || typeof o[ks[i]] !== "object") o[ks[i]] = {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = val;
  }
  function getPath(path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), G); }
  const inp = (path, o) => {
    o = o || {};
    const v = getPath(path);
    if (o.sel) return `<select data-p="${path}" data-t="${o.str ? "s" : "n"}">${o.sel.map(x => `<option value="${esc(x[0])}"${String(x[0]) === String(v) ? " selected" : ""}>${esc(x[1])}</option>`).join("")}</select>`;
    if (o.chk) return `<input type="checkbox" data-p="${path}" data-t="b"${v ? " checked" : ""}>`;
    const step = o.step != null ? o.step : "any";
    return `<input type="number" data-p="${path}" data-t="n" step="${step}"${o.min != null ? ` min="${o.min}"` : ""}${o.max != null ? ` max="${o.max}"` : ""} value="${v == null ? "" : v}"${o.ph != null ? ` placeholder="${esc(o.ph)}"` : ""}${o.w ? ` style="width:${o.w}px"` : ""}>`;
  };
  const fld = (label, html, note) => `<div class="fld"><label>${label}</label><div>${html}${note ? `<span class="muted"> ${note}</span>` : ""}</div></div>`;
  const emx = id => S.emblemExtra(G.chars[id].emb, G.chars[id].embOn);

  // ---- 計算 ----
  let R = null, RD = null;
  function recalc() {
    S.CH.forEach(c => { if (!G.chars[c.id]) G.chars[c.id] = defChar(c.id); });
    R = E.calcTeam(G);
    // 防衛戦に入った直後の値（直接入力は使わない）
    RD = E.calcTeam(Object.assign({}, G, { enemy: "defense", directPriority: false, enemyOv: { res: {}, extra: {} } }));
  }

  // ---- 上部（ビルド保存・比較） ----
  function renderTop() {
    let builds = {};
    try { builds = JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { builds = {}; }
    const names = Object.keys(builds);
    $("topbar").innerHTML = `<span class="muted" id="smsg">${esc(shareMsg)}</span>
      <button class="btn-add pri" data-act="dlg-open">共有・読み込み</button><button class="btn-add" data-act="rp-open">報告</button><button class="btn-add" data-act="reset">全初期化</button>`;
    // 共有・読み込みのポップアップ（プリセットコード・共有コード・共有URL それぞれ 読込・作成・コピー、ブラウザへの保存）
    const row = (key, label, note, ph) => `<div class="row"><label for="dv-${key}">${label} <span class="muted" style="font-weight:400">${note}</span></label>
      <div class="line"><input type="text" id="dv-${key}" value="${esc(DV[key])}" placeholder="${ph}" spellcheck="false">
      <button class="btn-add" data-act="dv:${key}:in">読込</button><button class="btn-add" data-act="dv:${key}:out">作成</button><button class="btn-add" data-act="dv:${key}:copy">コピー</button></div>
      <div class="msg${DM[key] && DM[key].ng ? " ng" : DM[key] ? " ok" : ""}">${esc((DM[key] || {}).t || "")}</div></div>`;
    $("shareBody").innerHTML = `<h2 id="shareDlgT"><span class="en">SHARE</span>共有・読み込み</h2>
      ${row("preset", "プリセットコード", "（ゲーム・プリセット共有サイトと同じ。編成と素質Lvだけ）", "ゲームの素質プリセットのコード")}
      ${row("code", "共有コード", "（この計算ページの入力すべて）", "共有コードを貼り付け")}
      ${row("url", "共有URL", "（共有コードの短縮URL。開くだけで読み込まれます）", "https://sim.stella-tool.com/s/…")}
      <div class="row"><button class="btn-add xbtn" data-act="share-x">Xで共有</button> <span class="muted">短縮URLを作って、Xの投稿画面を開きます（本文は編成の3人の名前とURLだけ）</span></div>
      <div class="row sub"><label for="bname">このブラウザに保存 <span class="muted" style="font-weight:400">（名前を付けて保存・読み込み）</span></label>
      <div class="line" style="grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto auto">
        <input type="text" id="bname" placeholder="名前"><button class="btn-add" data-act="bsave">保存</button>
        <select id="bsel"><option value="">（保存したビルド）</option>${names.map(n => `<option>${esc(n)}</option>`).join("")}</select>
        <button class="btn-add" data-act="bload">読み込み</button><button class="btn-add" data-act="bdel">削除</button></div></div>
      <div class="foot"><button class="btn-add" data-act="dlg-close">閉じる</button></div>`;
    $("cmpbar").innerHTML = `<button class="btn-add" data-act="memo" style="min-height:30px;padding:0 10px;font-size:12px">現在値を記憶</button><button class="btn-add" data-act="memodel" style="min-height:30px;padding:0 10px;font-size:12px">記憶を消す</button>`;
  }

  // ---- 倍率タイル（種類を問わない共通の倍率） ----
  function renderTiles() {
    const id = G.team[V.tilesFor] || G.team.main;
    const o = R.team[id];
    const c = o.c, st = o.st, en = G.enemyObj;
    const dd = E.enemyD(en, c.el, st.pen, G);
    const ref = c.ref === "hp" ? st.hp : st.atk;
    const W = 1 + st.elemAdd + o.ef.W;
    const taken = o.ef.taken * (G.other.taken || 1) * (G.other.mult || 1) * dd.extra;
    $("tilesFor").innerHTML = SLOTS.map(([k, l]) => `<button class="sbtn${V.tilesFor === k ? " on" : ""}" data-act="tf:${k}" style="min-height:26px;padding:0 10px;font-size:12px">${l}</button>`).join(" ") + ` ${esc(c.jp)}`;
    const t = (label, val, sub) => `<div class="tile"><span>${label}</span><b>${val}</b><small>${sub || ""}</small></div>`;
    $("tiles").innerHTML =
      t("ダメージ基礎値", fmt(ref), c.ref === "hp" ? "最大HP" : "攻撃力") +
      t("属性倍率", "×" + f3(W), c.el + "属性ダメージ " + pct(st.elemAdd + o.ef.W)) +
      t("耐性倍率", "×" + f3(dd.res * dd.weak), `耐性×${f3(dd.res)}` + (dd.weak !== 1 ? ` 弱点×${dd.weak}` : "") + `（貫通${fmt(st.pen)}${st.pen > 250 ? "・適用は250まで" : ""}）`) +
      t("防御倍率", f3(dd.def), "敵の防御") +
      t("その他倍率", "×" + f3(taken), "被ダメージ・実測合わせ等");
  }

  // ---- 選択ボタン ----
  function renderSelectors() {
    // 徽章・素質などの巡遊者ごとの画面は「巡遊者」のタブの中
    const top = /^(emb|heart|pot|add):/.test(V.panel) ? "overview" : V.panel;
    const b = (key, label, en) => `<button class="tab" role="tab" aria-selected="${top === key}" data-act="panel:${key}"><span class="te">${en}</span><span>${label}</span></button>`;
    $("selectors").innerHTML = b("overview", "巡遊者", "TREKKERS") + b("direct", "直接入力", "DIRECT") + b("record", "記録レベル", "RECORD") + b("lr", "ロスレコ・音符", "LOST RECORDS") + b("gimmick", "ギミック(敵)", "ENEMY") + b("adjust", "補正", "ADJUST") + b("score", "ビルドカード", "BUILD CARD");
  }
  // スマホ: 巡遊者を1人ずつ出すための切り替え（PCでは出さない）
  const mChar = () => `<div class="m-only mchar">${SLOTS.map(([k, l]) => `<button class="tab" aria-selected="${V.mChar === k}" data-act="mchar:${k}">${l}</button>`).join("")}</div>`;
  const mHide = k => V.mChar === k ? "" : " m-hide";
  // スマホ: 下のタブ（入力・結果・内訳）と、上の結果の帯
  const big = n => n >= 1e8 ? (Math.round(n / 1e6) / 100) + "億" : n >= 1e4 ? Math.round(n / 1e4).toLocaleString("ja-JP") + "万" : fmt(n);
  function renderMobile(items) {
    const mb = (k, l, en) => `<button class="tab" aria-selected="${V.m === k}" data-act="m:${k}"><span class="te">${en}</span><span>${l}</span></button>`;
    $("mbar").innerHTML = mb("in", "入力", "INPUT") + mb("res", "結果", "RESULT") + mb("drill", "内訳", "DETAIL");
    $("mstrip").innerHTML = items.filter(x => x[2]).map(([key, label, sm]) => {
      let d = "";
      if (memo && memo.v && memo.v[key] != null) { const r = sm.exp / memo.v[key] - 1; d = ` <span class="${r >= 0 ? "up" : "down"}">${r >= 0 ? "+" : ""}${Math.round(r * 1000) / 10}%</span>`; }
      return `<button class="mchip" data-act="drill:${key}">${esc(label.replace(/（.*/, ""))}<b>${big(sm.exp)}${d}</b></button>`;
    }).join("");
    document.body.className = "m-" + V.m;
  }

  // ---- ステータスの表（ステータス画面／戦闘中／防衛戦に入った直後）----
  // 戦闘中 = 今の敵で、素質・スキル・ロスレコなどの効果（重複数は入力の値）をすべて足した値
  function cardsHtml(id) {
    const c = chOf(id), cs = G.chars[id];
    const o = E.outsideStats(c, cs);
    const d = RD.team[id].st;
    const b = R.team[id], st = b.st, ef = b.ef, ag = ef.ag || {};
    const batk = st.mode === "auto" ? st.baseAtk * (1 + st.atkPct + ef.atkPct) : st.atk * (1 + ef.atkPct);
    const row = (k, a, m, z) => `<tr><td>${k}</td><td style="text-align:right">${a}</td><td class="bt" style="text-align:right">${m}</td><td style="text-align:right">${z}</td></tr>`;
    return `<div class="box"><table class="stt"><tr><th></th><th title="ステータス画面の値">画面</th><th class="bt" title="今の敵で、効果をすべて足した値">戦闘中</th><th title="防衛戦に入った直後の値">防衛戦直後</th></tr>
      ${row("最大HP", fmt(o.hp), fmt(st.hp), fmt(d.hp))}${row("攻撃力", fmt(o.atk), fmt(batk), fmt(d.atk))}
      ${row("会心率", pct(o.critRate), pct(st.critRate), pct(d.critRate))}${row("会心ダメージ", pct(o.critDmg), pct(st.critDmg), pct(d.critDmg))}
      ${row(c.el + "属性ダメージ", pct(1 + o.elemAdd), pct(1 + st.elemAdd + ef.W), pct(1 + d.elemAdd))}
      ${row("通常攻撃ダメージ", "—", pct(st.basicAdd + ef.Bb), pct(d.basicAdd))}${row("スキルダメージ", "—", pct(st.skillAdd + ef.Bs), pct(d.skillAdd))}
      ${row("必殺技ダメージ", "—", pct(st.ultAdd + ef.Bu), pct(d.ultAdd))}${row("印ダメージ", "—", pct(st.markAdd + (ag.markAdd || 0)), pct(d.markAdd))}
      ${row("属性耐性貫通", fmt(o.pen), fmt(st.pen), fmt(d.pen))}${row("敵の被ダメージ", "—", "×" + f3(ef.taken), "—")}</table>
      <div class="muted" style="font-size:11px;line-height:1.4;margin-top:4px">画面＝ステータス画面／戦闘中＝今の敵（ギミック）で、素質・スキル・ロスレコの効果を足した値／防衛戦直後＝防衛戦に入った直後</div></div>`;
  }

  // ---- 表示エリア: 巡遊者 ----
  function lvFld(id, key, label, note) {
    const bonus = emx(id).lv[key];
    return fld(label, inp(`chars.${id}.skillLv.${key}`, { min: 1, max: 13, step: 1, w: 70 }), (bonus ? `徽章 +${bonus} → Lv${(G.chars[id].skillLv[key] || 10) + bonus}` : "") + (note || ""));
  }
  function renderOverview() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}`;
      return `<div class="chcol${mHide(k)}"><h3>${l}</h3>
        ${fld("巡遊者", inp(`team.${k}`, { sel: S.CH.map(x => [x.id, x.jp + (x.auto ? "*" : "")]), str: true }))}
        ${fld("キャラレベル", `<span class="muted">90（固定）</span>`)}
        ${lvFld(id, "basic", "通常攻撃Lv")}${lvFld(id, "main", "主力スキルLv")}${lvFld(id, "support", "支援スキルLv")}${lvFld(id, "ult", "必殺技Lv", "11〜は推定")}
        ${fld("信頼ボーナスLv", inp(`${p}.trustLv`, { min: 0, max: 99, step: 1, w: 70 }))}
        <div class="box"><div class="sel-row" style="margin:0"><button class="obtn" data-act="panel:heart:${k}" style="width:auto">心相</button><button class="obtn" data-act="panel:emb:${k}" style="width:auto">徽章</button><button class="obtn" data-act="panel:pot:${k}" style="width:auto">素質</button><button class="obtn" data-act="panel:add:${k}" style="width:auto">その他</button></div></div>
        ${cardsHtml(id)}
      </div>`;
    };
    return `${mChar()}<div class="cols3">${SLOTS.map(col).join("")}</div>
      <p class="muted">名前の後ろの「*」は未確認（技のヒットや素質を、Wikiの説明文から自動で作ったもの）です。各巡遊者の「心相・徽章・素質・その他」で、この中が切り替わります。ステータスが画面と合わないときは、「巡遊者（直接入力）」のタブに画面の値を入れてください（入力した欄だけ上書きして計算します）。</p>`;
  }
  // ---- 巡遊者（直接入力）----
  function renderDirect() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}.manual`, st = R.team[id].st;
      const f = (label, key, ph) => fld(label, inp(`${p}.${key}`, { w: 110, ph: ph }));
      return `<div class="chcol${mHide(k)}"><h3>${l}：${esc(c.jp)}</h3>
        ${f("最大HP", "hp", fmt(st.hp))}${f("攻撃力", "atk", fmt(st.atk))}
        ${f("会心率(%)", "critRate", Math.round(st.critRate * 1000) / 10)}${f("会心ダメージ(%)", "critDmg", Math.round(st.critDmg * 1000) / 10)}
        ${f(c.el + "属性ダメージ(%)", "elem", Math.round(st.elemAdd * 1000) / 10)}${f("通常攻撃ダメージ(%)", "basic", Math.round(st.basicAdd * 1000) / 10)}
        ${f("スキルダメージ(%)", "skill", Math.round(st.skillAdd * 1000) / 10)}${f("必殺技ダメージ(%)", "ult", Math.round(st.ultAdd * 1000) / 10)}
        ${f("印ダメージ(%)", "mark", Math.round(st.markAdd * 1000) / 10)}${f("属性耐性貫通", "pen", fmt(st.pen))}
        ${cardsHtml(id)}
      </div>`;
    };
    return `<div class="wide"><label class="check" style="font-weight:700"><input type="checkbox" data-p="directPriority" data-t="b"${G.directPriority !== false ? " checked" : ""}>入力されている欄は直接入力を優先する</label>
      <p class="muted">空欄は反映せず、計算のままです（薄い数字は今の計算値）。入力がある欄は、その値で上書きして計算します。「属性ダメージ」は 100% を除いた加算分（画面が112%なら12）です。戦闘中だけ付く効果は画面に出ないので、その分は素質・ロスレコ・「その他」で補います。</p>
      ${mChar()}<div class="cols3">${SLOTS.map(col).join("")}</div></div>`;
  }
  function renderAdd(k) {
    const id = G.team[k], c = chOf(id), p = `chars.${id}.add`;
    return `<div class="wide"><h3>${esc(c.jp)}：その他</h3>
      <div class="box">${skillSection(k)}</div>
      <div class="box"><h3 style="margin:0 0 6px;font-size:14px">加算（素質や心相などの効果で、この画面にまだ無いものを入れる場所）</h3>
      <div class="grid-in">
        ${fld("基礎攻撃力 加算", inp(`${p}.atkFlat`, { w: 100 }), "掛け算の前")}${fld("基礎HP 加算", inp(`${p}.hpFlat`, { w: 100 }), "掛け算の前")}
        ${fld("攻撃力% 加算", inp(`${p}.atkPct`, { w: 100 }), "例 0.1=10%")}${fld("最大HP% 加算", inp(`${p}.hpPct`, { w: 100 }), "例 0.1=10%")}
        ${fld(c.el + "属性ダメ 加算", inp(`${p}.elem`, { w: 100 }))}${fld("通常ダメ 加算", inp(`${p}.basic`, { w: 100 }))}
        ${fld("スキルダメ 加算", inp(`${p}.skill`, { w: 100 }))}${fld("必殺ダメ 加算", inp(`${p}.ult`, { w: 100 }))}
        ${fld("印ダメ 加算", inp(`${p}.mark`, { w: 100 }))}${fld("会心率 加算", inp(`${p}.critRate`, { w: 100 }))}
        ${fld("会心ダメ 加算", inp(`${p}.critDmg`, { w: 100 }))}${fld("貫通 加算", inp(`${p}.pen`, { w: 100 }))}
      </div><p class="muted">割合は 0.1 = 10% の形で入力します。</p></div></div>`;
  }
  // ---- スキル（バフ効果の反映）----
  function skillSection(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], isMain = k === "main";
    const lvB = emx(id).lv;
    const lvs = ["basic", "main", "support", "ult"].map(key => `${S.SKILL_NAME[key]} Lv${(cs.skillLv[key] || 10) + (lvB[key] || 0)}${lvB[key] ? `（徽章 +${lvB[key]}）` : ""}`).join(" ／ ");
    const list = S.SKILL_FX[id] || [];
    let body = list.map(fx => {
      const key = id + ":" + fx.id;
      const usable = isMain ? (fx.skill === "main" || fx.skill === "ult") : fx.skill === "support";
      const lv = (cs.skillLv[fx.skill] || 10) + (lvB[fx.skill] || 0);
      const v = Math.round(E.skillVal(c, fx.idx, fx.n, lv) * 10) / 10;
      const on = (G.skOn || {})[key] == null ? !fx.off : G.skOn[key];
      return `<div class="pot${usable ? " core" : ""}"><b>${S.SKILL_NAME[fx.skill]}</b>${usable ? "" : '<span class="tag-ng">この枠では使えません</span>'}
        <div>${esc(fx.txt(v))}</div><div class="lv">反映 <input type="checkbox" data-p="skOn.${key}" data-t="b"${on ? " checked" : ""}${usable ? "" : " disabled"}></div></div>`;
    }).join("");
    if (id === "willow") {
      const fv = Math.round(E.skillVal(c, 1, 1, (cs.skillLv.main || 10) + (lvB.main || 0)) * 10) / 10, uv = Math.round(E.skillVal(c, 3, 2, (cs.skillLv.ult || 10) + (lvB.ult || 0)) * 10) / 10;
      body += `<div class="pot core"><b>主力スキル</b><div>バブルフロッグがダメージを与えると、チームの攻撃力 +${fv}%（6秒・最大5重）</div><div class="lv">重複数 ${inp("willowFrog", { min: 0, max: 5, step: 1, w: 60 })}<span class="muted">/5（ウィロー以外の味方に反映）</span></div></div>
        <div class="pot core"><b>必殺技</b><div>チームの攻撃力 +${uv}%（20秒・最大5重）</div><div class="lv">重複数 ${inp("willowUlt", { min: 0, max: 5, step: 1, w: 60 })}<span class="muted">/5（ウィロー以外の味方に反映）</span></div></div>`;
    }
    if (!body) body = '<span class="muted">このキャラの、火力に関わるスキルのバフ効果は、ありません（または未登録です）。</span>';
    return `<h3 style="margin:0 0 6px;font-size:14px">スキルのバフ効果</h3><p class="muted">スキルLv: ${lvs}（スキルLvは「巡遊者」の欄で変えます）</p>
      <div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">${body}</div>
      <p class="muted">値はスキルLvで変わります。主力のときは 主力スキル・必殺技、支援のときは 支援スキルのバフだけ使えます。ここに無いバフは、下の加算に入れてください。</p>`;
  }

  // ---- 徽章 ----
  // 項目の区分（左から 区分 → 項目 → 値 の順にドロップダウンで選ぶ）
  const EMB_CATS = [
    ["ステータス", ["hpPct", "baseHp", "atkPct", "baseAtk", "defPct", "baseDef"]],
    ["会心", ["critRate", "basicCritRate", "skillCritRate", "ultCritRate", "markCritRate", "critDmg"]],
    ["ダメージ・貫通", ["resPen", "elemDmg", "basicDmg", "skillDmg", "ultDmg", "markDmg"]],
    ["従者・派生", ["servantDmg", "servantCritRate", "derivedDmg", "derivedCritRate"]],
    ["スキル・素質", ["lvBasic", "lvMain", "lvSupport", "lvUlt", "potMain", "potSupport", "potCommon"]],
    ["その他", ["spMain", "spSupport"]],
  ];
  const catOfKey = key => { const c = EMB_CATS.find(x => x[1].indexOf(key) >= 0); return c ? c[0] : ""; };
  const optOf = key => EMBLEM_OPTIONS.find(o => o.key === key);
  // 品質の候補。値がある品質だけ（金までのものに虹は出さない）。スキル・素質レベル上昇は 金 +1／虹 +2・+3
  const LV_Q = [["gold", "金"], ["rainbow2", "虹"], ["rainbow3", "虹"]];
  const isLv = o => o.type === "skillLv" || o.type === "potLv";
  const lvAmt = q => q === "gold" ? 1 : q === "rainbow2" ? 2 : 3;
  const qualOf = (o) => isLv(o) ? LV_Q : EMBLEM_QUALITY.filter(([q]) => o.tiers[q] != null);
  const qVal = (o, q) => isLv(o) ? lvAmt(q) : o.tiers[q];
  const valTxt = (o, v) => o.fmt === "pct" ? pct(v) : o.fmt === "lv" ? "+" + v : fmt(v);
  // 素質の対象の候補（英語名の一覧）
  function potTargets(id, key) {
    const t = TK(chOf(id).en);
    if (!t || !t.potentials) return [];
    // 汎用素質は、主力と支援で一覧が違う（シアの「月の海の兎たち」は支援だけ）ので、編成の位置で決める
    const role = key === "potSupport" ? "support" : key === "potCommon" ? (G.team.main === id ? "main" : "support") : "main";
    const groups = (t.potentials[role] || []).filter(g => key === "potCommon" ? /Generic/i.test(g.title) : !/Generic/i.test(g.title));
    return groups.reduce((a, g) => a.concat(g.potentials.map(x => ({ en: x.name, core: x.type === 1 }))), []).filter(x => !x.core);
  }
  function slotLabel(id, sl) {
    if (!sl.k) return "（未設定）";
    const o = optOf(sl.k);
    const q = (EMBLEM_QUALITY.find(x => x[0] === sl.q) || [])[1] || "";
    const v = qVal(o, sl.q);
    return `${o.label} ${q}${v != null ? " " + valTxt(o, v) : ""}${sl.t ? `（${JA(sl.t, id)}）` : ""}`;
  }
  function renderEmblem(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id];
    const order = cs.emb.map((e, i) => i).sort((a, b) => KIND_ORDER.indexOf(cs.emb[a].kind) - KIND_ORDER.indexOf(cs.emb[b].kind));
    const card = i => {
      const e = cs.emb[i];
      const sel = (path, opts, cur, ph) => `<select data-p="${path}" data-t="s"><option value="">${ph}</option>${opts.map(o => `<option value="${esc(o[0])}"${o[0] === cur ? " selected" : ""}>${esc(o[1])}</option>`).join("")}</select>`;
      const slots = e.slots.map((sl, j) => {
        const sp = `chars.${id}.emb.${i}.slots.${j}`;
        const cat = sl.cat != null && sl.cat !== "" ? sl.cat : catOfKey(sl.k);
        const catDef = EMB_CATS.find(x => x[0] === cat);
        const items = catDef ? catDef[1].map(optOf).filter(o => o && (!o.only || o.only === e.kind)).map(o => [o.key, o.label]) : [];
        const o = sl.k ? optOf(sl.k) : null;
        const vals = o ? qualOf(o).map(([q, ql]) => [q, `${ql} ${valTxt(o, qVal(o, q))}`]) : [];
        let tg = "";
        if (o && o.type === "potLv") {
          const list = potTargets(id, sl.k);
          tg = sel(`${sp}.t`, list.map(x => [x.en, JA(x.en, id)]), sl.t || "", "（対象の素質）");
        }
        return `<div class="emb-line"><button class="obtn" data-act="embclear:${id}:${i}:${j}" style="width:auto;min-height:30px">クリア</button>${sel(`${sp}.cat`, EMB_CATS.map(x => [x[0], x[0]]), cat, "（区分）")}${sel(`${sp}.k`, items, sl.k || "", "（項目）")}${o ? sel(`${sp}.q`, vals, (isLv(o) && sl.q === "rainbow") ? "rainbow3" : sl.q, "（値）") : ""}${tg}</div>`;
      }).join("");
      return `<div class="emb-card"><h4><label style="display:inline-flex;gap:6px;align-items:center;margin:0"><input type="checkbox" data-p="chars.${id}.embOn.${i}" data-t="b01"${cs.embOn[i] ? " checked" : ""}>${KIND_NAME[e.kind] || esc(e.name)}徽章（${e.kind === "triangle" ? "Lv70" : e.kind === "circle" ? "Lv80" : "Lv90"}）</label></h4>${slots}</div>`;
    };
    const sum = E.emblemSum(cs.emb, cs.embOn);
    const sumTxt = Object.keys(sum).map(key => { const o = optOf(key); return `${o.label} ${valTxt(o, sum[key])}`; }).join(" ／ ");
    const ex = emx(id);
    const lvTxt = Object.keys(ex.lv).filter(x => ex.lv[x]).map(x => ({ basic: "通常攻撃", main: "主力スキル", support: "支援スキル", ult: "必殺技" }[x] + "Lv+" + ex.lv[x])).join("・");
    const potTxt = Object.keys(ex.pot).map(x => `${JA(x, id)} Lv+${ex.pot[x]}`).join("・");
    return `<div class="wide"><h3>${esc(c.jp)}：徽章</h3><div>${order.map(card).join("")}</div>
      <div class="note">合計: ${sumTxt || "なし"}${lvTxt ? `<br>スキルレベル上昇: ${lvTxt}（スキルLvの欄に反映）` : ""}${potTxt ? `<br>素質レベル上昇: ${potTxt}（取得している素質に反映）` : ""}</div>
      <p class="muted">各枠は、左から 区分 → 項目 → 値 の順に選びます。金までしかない項目には虹を出しません。素質レベル上昇は、取得している素質（Lv1以上）にだけ足します。</p></div>`;
  }

  // ---- 心相（段階・戦闘中の効果）----
  function renderHeart(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], p = `chars.${id}`, st = R.team[id].st;
    const hs = (S.HEART_SPEC || {})[id];
    const rar = TK(c.en).rarity;
    const tb = c.talentBonus || {}, tu = Math.min(10, Math.max(0, (cs.talent || 0) / 5));
    const stat = [`基礎HP +${fmt(st.talHp)}`, `基礎攻撃 +${fmt(st.talAtk)}`].concat(tb.elem ? [`${c.el}属性ダメージ +${pct(tu * tb.elem)}`] : [], tb.basic ? [`通常攻撃ダメージ +${pct(tu * tb.basic)}`] : [], tb.skill ? [`スキルダメージ +${pct(tu * tb.skill)}`] : [], tb.ult ? [`必殺技ダメージ +${pct(tu * tb.ult)}`] : [], tb.crit ? [`会心ダメージ +${pct(tu * tb.crit)}`] : []).join(" ／ ");
    const list = hs ? `<div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${hs.map(h => {
      const un = (cs.talent || 0) >= h.n * 10, key = "heart" + h.n, onv = (cs.pon || {})[key], on = onv == null ? !h.off : onv;
      return `<div class="pot${un ? " core" : ""}"><b>${h.n} ${esc(h.name)}</b>${un ? '<span class="tag-ok">解放済み</span>' : '<span class="tag-ng">未解放</span>'}
        <div class="muted">${esc(h.txt)}</div>${un ? `<div class="lv">反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}></div>` : ""}</div>`;
    }).join("")}</div>` : '<p class="muted">このキャラの、心相の戦闘中の効果は、まだ登録していません。反映したい効果は「その他」に入れてください。</p>';
    return `<div class="wide"><h3>${esc(c.jp)}：心相</h3>
      ${fld("心相（段階）", inp(`${p}.talent`, { min: 0, max: 50, step: rar >= 5 ? 10 : 5, w: 70 }), `0〜50／${Math.floor((cs.talent || 0) / 10)}凸（星${rar}は${rar >= 5 ? 10 : 5}段階ずつ）`)}
      <p class="note">段階ごとのステータス: ${stat}</p>
      <h3 style="margin:10px 0 6px;font-size:14px">凸の戦闘中の効果（10段階 = 1凸）</h3>${list}</div>`;
  }

  // ---- 素質 ----
  function potGroupName(title, role) {
    const m = /Build (\d)/i.exec(title);
    return (role === "main" ? "主力" : "支援") + "・" + (m ? "特化構築" + m[1] : "汎用");
  }
  function renderPot(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], p = `chars.${id}`;
    const ex = emx(id);
    const tagBonus = en => ex.pot[en] ? `<span class="tag-ok">徽章 +${ex.pot[en]}</span>` : "";
    let body = "", note = "";
    if (id === "willow") {
      body = POTENTIALS.map(x => `<div class="pot${x.core ? " core" : ""}"><div class="ph"><b>${esc(x.jp)}</b>${x.core ? '<span class="tag-ok">コア</span>' : ""}</div>
        <div class="pd" title="${esc(x.text)}">${esc(x.text)}</div><div class="pc"><div class="lv">${x.core ? "取得(1=あり)" : "Lv"} ${inp(`${p}.pots.${x.id}`, { min: 0, max: 9, step: 1, w: 56 })}</div></div></div>`).join("");
      note = "ウィローの素質（主力のとき検証済み）。値は「最大スタック時」の合計です。ウィローが編成にいると、ナツカ・エレノアにはチーム効果（最大スタック）も乗ります。";
    } else if (id === "nazuka" || id === "eleanor") {
      body = SUP_POTS[id].map(x => `<div class="pot${x.core ? " core" : ""}"><div class="ph"><b>${esc(x.jp)}</b>${x.core ? '<span class="tag-ok">コア</span>' : ""}${x.verified ? '<span class="tag-ok">実測一致</span>' : '<span class="tag-ng">未検証</span>'}</div>
        <div class="pd">${esc(x.note || x.verified || "")}</div>
        <div class="pc"><div class="lv">Lv ${inp(`${p}.sup.${x.id}.lv`, { min: 0, max: 9, step: 1, w: 56 })}${x.on === false ? ` 条件を満たす ${inp(`${p}.sup.${x.id}.on`, { chk: 1 })}` : ""}</div></div></div>`).join("");
      note = "支援として出場したときの素質（検証済みの分だけ効果を反映）。";
    } else if (S.POT_SPEC[id]) {
      const t = TK(c.en);
      const spec = S.POT_SPEC[id];
      const stkIn = (key, e) => {
        const sk = key + (e.sk ? ":" + e.sk : "");
        return `<span class="muted">${e.sk ? (e.sk === "glow" ? "グロウ" : "ハロー") : "重複数"}</span> ${inp(`${p}.pstk.${sk}`, { min: 0, max: e.stk, step: 1, w: 60 })}<span class="muted">/${e.stk}</span> `;
      };
      // 今の枠（主力 or 支援）の素質だけを出す。上にコア4つ、そのあと 特化構築1・2のサブ素質、汎用
      const role = k === "main" ? "main" : "support", roleJa = k === "main" ? "主力" : "支援";
      const card = x => {
        const sp = spec[x.name], key = S.potKey(x.name), core = x.type === 1;
        const nm = esc(JA(x.name, id)) + (spec[x.name] && (spec[x.name].st === "auto" || spec[x.name].st === "draft") ? "*" : "");   // *＝未確認（説明文から自動で作った下書き）
        const lvIn = `<div class="lv">${core ? "取得" : "Lv"} ${inp(`${p}.pots2.${key}`, { min: 0, max: core ? 1 : 9, step: 1, w: 56 })}`;
        if (!sp) return `<div class="pot" title="${esc(x.name)}"><div class="ph"><b>${nm}</b><span class="tag-ng">未反映</span></div><div class="pd">効果がまだ入っていません</div><div class="pc">${lvIn}</div></div></div>`;
        const eff = sp.e.length > 0;
        const onv = (cs.pon || {})[key];
        const on = onv == null ? !sp.off : onv;
        const ctl = [];
        const base = (cs.pots2 || {})[key] || 0;
        ctl.push(`${lvIn}${base > 0 && ex.pot[x.name] ? ` → Lv${base + ex.pot[x.name]}` : ""}</div>`);
        if (eff) ctl.push(`<div class="lv">反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}></div>`);
        const seen = {};
        sp.e.forEach(e => { if (e.stk > 1 && !seen[e.sk || ""]) { seen[e.sk || ""] = 1; ctl.push(`<div class="lv">${stkIn(key, e)}</div>`); } });
        sp.e.forEach((e, ei) => { if (e.edit) ctl.push(`<div class="lv"><span class="muted">回数</span> ${inp(`${p}.pcnt.${key}#${ei}`, { min: 0, step: 1, w: 56, ph: e.c })}</div>`); });
        const tags = (core ? '<span class="tag-ok">コア</span>' : "") + tagBonus(x.name) + (eff ? "" : '<span class="tag-ng">火力に影響なし</span>') +(sp.off ? '<span class="tag-ng">既定は反映しない</span>' : "");
        return `<div class="pot${core ? " core" : ""}" title="${esc(x.name)}"><div class="ph"><b>${nm}</b>${tags}</div>
          <div class="pd" title="${esc(sp.txt)}">${esc(sp.txt)}</div><div class="pc">${ctl.join("")}</div></div>`;
      };
      const groups = t.potentials[role] || [];
      const builds = groups.filter(g => !/Generic/i.test(g.title)), generic = groups.find(g => /Generic/i.test(g.title));
      const bn = g => { const m = /Build (\d)/i.exec(g.title); return m ? m[1] : "?"; };
      // 特化構築ごとに1行（コア2つ＋サブ3つ）、汎用はその下。どの行も同じ5列で、カードの幅と高さをそろえる
      const grid = arr => `<div class="pgrid">${arr.map(card).join("")}</div>`;
      const buildRows = builds.map(g => `<div class="phead">${roleJa}：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type === 1).concat(g.potentials.filter(x => x.type !== 1)))}`).join("");
      const genRow = generic ? `<div class="phead">汎用</div>${grid(generic.potentials)}` : "";
      body = `<div style="grid-column:1/-1">${buildRows}${genRow}</div>`;
      note = "名前の後ろの「*」は未確認（日本語Wikiの説明文から自動で作った下書き）です。名前は日本語（マウスを重ねると英語名）。効果は原文を読んで分類した内容を表の下に書いています。回数や重複数が原文に書かれていないものは「仮」の値なので、実測に合わせて直してください。「全員が光」の条件は、編成から自動で判定します。残光の有無は「ギミック(敵)」で切り替えます。";
    } else {
      const t = TK(c.en), groups = (t.potentials[k === "main" ? "main" : "support"] || []);
      body = groups.map(g => g.potentials.map(x => `<div class="pot${x.type === 1 ? " core" : ""}" title="${esc(x.name)}"><div class="ph"><b>${esc(JA(x.name, id))}</b>${x.type === 1 ? '<span class="tag-ok">コア</span>' : ""}<span class="tag-ng">未反映</span></div>
        <div class="pc"><div class="lv">Lv ${inp(`${p}.pots2.${x.name.replace(/[^A-Za-z0-9]/g, "_")}`, { min: 0, max: 9, step: 1, w: 56 })}</div></div></div>`).join("")).join("");
      note = "このキャラの素質の効果は、まだ式に入れていません。反映したい効果は「その他」に手で入れられます。";
    }
    return `<div class="wide"><h3>${esc(c.jp)}：素質の一覧選択</h3><p class="muted">ゲーム内の画面で確認できる素質の数値は、Lv1 と Lv6 だけです。Lv2〜5 はWikiの値（未確認）、Lv7〜9 は、直前の増え方で延長した推定値（実際にビルドを組んだ画面で確認できたものだけ、実値に置き換えています）。</p><div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${body}</div><p class="muted">${note}</p></div>`;
  }

  // ---- 記録レベル ----
  function renderRecord() {
    const r = E.recordBonus(G.recordLv);
    const opts = (RECORD_LEVELS || []).map(x => [x[0], `Lv${x[0]}（攻撃+${x[2]} / HP+${x[3]}）`]);
    return `<div class="wide"><h3>記録レベルボーナス（戦闘中に全員の基礎攻撃力・基礎HPへ加算）</h3>
      ${fld("記録レベル", inp("recordLv", { sel: opts }))}
      <p class="note">現在: 攻撃力 +${fmt(r.atk)} ／ 最大HP +${fmt(r.hp)}（全員の基礎値に足してから%を掛けます）</p></div>`;
  }

  // ---- ロスレコ・音符 ----
  // ロスレコの名前。Wikiから自動で入れたもの（ゲーム内では未確認）は「*」を付ける。★の数も添える
  const lrName = r => `${r.name}${r.auto || r.autoFx ? "*" : ""}${r.rarity ? `（★${r.rarity}）` : ""}`;
  function renderLr() {
    const L = LOSTRECORDS;
    // 枠: クリア → 属性 → 名前（徽章と同じ形）。属性だけ選んだ状態は画面の中だけで持つ
    const ELS = ["水", "火", "風", "地", "光", "闇"].filter(e => L.some(x => x.element === e)).concat([...new Set(L.map(x => x.element))].filter(e => ["水", "火", "風", "地", "光", "闇"].indexOf(e) < 0));
    const slot = (arr, i, lab) => {
      const path = `${arr}.${i}`, cur = (G[arr] || [])[i] || "", r = L.find(x => x.id === cur);
      const el = V.lrEl[path] != null ? V.lrEl[path] : (r ? r.element : "");
      const names = L.filter(x => !el || x.element === el);
      return `<div class="lr-line"><span class="lab">${lab}</span><button class="obtn" data-act="lrclear:${path}" style="min-height:30px">クリア</button>
        <select data-lrel="${path}"><option value="">（属性）</option>${ELS.map(e => `<option${e === el ? " selected" : ""}>${e}</option>`).join("")}</select>
        <select data-lrid="${path}"><option value="">（ロスレコ）</option>${names.map(x => `<option value="${esc(x.id)}"${x.id === cur ? " selected" : ""}>${esc(lrName(x))}</option>`).join("")}</select></div>`;
    };
    const m = "lrManual";
    // 音符: ゲームと同じく、色と名前 → 数 → 効果 を縦に並べ、1行にする
    const NC = { 強撃: "#E5533D", 幸運: "#F08A24", 爆発: "#8B5CF6", 体力: "#3FB65F", 集中: "#1FB5A8", 器用: "#3B6FE0", 必殺: "#E84D8A", 水: "#2BA6DE", 風: "#55C27A", 光: "#E8B10F", 火: "#E5533D", 地: "#A0703C", 闇: "#6B4FA0" };
    const STN = { atkPct: "攻撃力", critRate: "会心率", critDmg: "会心ダメージ", hpPct: "最大HP", basicDmg: "通常攻撃ダメージ", skillDmg: "スキルダメージ", ultDmg: "必殺技ダメージ" };
    const tot = S.notesTotal(G);
    const r1 = x => (Math.round(x * 1000) / 10).toFixed(1);
    const noteIn = S.NOTE_KEYS.map(n => {
      const s = n.replace("の音符", ""), d = NOTES[n], t = tot[n] || 0, own = (G.notes || {})[n] || 0;
      const stat = d ? (STN[d.stat] || d.stat.replace("elemDmg:", "") + "属性ダメージ") : "";
      return `<div class="note-cell" style="--nc:${NC[s] || "#8a8fb8"}"><div class="note-ic">♪</div><div class="note-nm">${esc(s)}</div>${inp(`notes.${esc(n)}`, { min: 0, max: 99, step: 1 })}
        <div class="note-fx">${stat}<br><b>+${d ? r1(t * d.perLv) : "0.0"}%</b></div><div class="note-per">1Lvで +${d ? Math.round(d.perLv * 10000) / 100 : 0}%${t !== own ? `<br>サブの初期 +${t - own}` : ""}</div></div>`;
    }).join("");
    const counts = S.LR_COUNTS.map(c => fld(c.label, inp(`lrN.${c.key}`, { min: 0, max: c.max, step: 1, w: 70 }), `最大 ${c.max}`)).join("");
    // メインのロスレコの効果
    const fxHtml = (G.lrMain || []).filter(Boolean).map(id => {
      const fx = S.LR_FX[id], r = L.find(x => x.id === id);
      if (!r) return "";
      if (!fx) return `<div class="pot"><b>${esc(lrName(r))}</b><span class="tag-ng">効果は未反映（基礎攻撃・基礎HP・属性ダメージだけ反映）</span></div>`;
      const item = (key, it, lv, mul) => {
        let txt = typeof it.txt === "function" ? it.txt(lv) : it.txt;
        if (mul && mul !== 1) txt = txt.replace(/\+([0-9.]+)%/g, (m0, n) => "+" + Math.round(+n * mul * 100) / 100 + "%");   // 手で入れたロスレコの突破
        if (it.skip) return `<div style="margin:3px 0;color:var(--muted)">${esc(txt)} <span class="tag-ng">計算に未反映</span></div>`;
        const stk = (it.e || []).find(e => e.stk > 1);
        const isOn = (G.lrOn || {})[key] == null ? !it.off : (G.lrOn || {})[key];
        const tog = it.off ? ` 反映 <input type="checkbox" data-p="lrOn.${key}" data-t="b"${isOn ? " checked" : ""}>` : (it.need ? ` <span class="muted">条件: ${(S.LR_COUNTS.find(c => c.key === it.need[0]) || {}).label} が ${it.need[1]} 以上</span>` : (it.n ? ` <span class="muted">数: ${(S.LR_COUNTS.find(c => c.key === it.n) || {}).label}</span>` : ` <span class="tag-ok">常時</span>`));
        return `<div style="margin:3px 0">${esc(txt)}${stk ? `（最大${stk.stk}重で計算）` : ""}${tog}</div>`;
      };
      const rk = S.lrRankOf(G, id);
      const rankSel = rk.can ? ` <span class="muted">突破</span> <select data-p="lrRank.${id}" data-t="n">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}"${n === rk.rank ? " selected" : ""}>${n}</option>`).join("")}</select>${rk.r0 ? `<span class="muted">（画面で確かめた値は突破${rk.r0}。ほかの突破はWikiの伸び方で計算。基礎ステータスは変わりません）</span>` : ""}` : "";
      const core = fx.core.map(it => item(id + ":c:" + it.id, it, rk.rank, rk.scale)).join("");
      const as = fx.assists.map(a => {
        const lv = S.lrAssistLv(S.notesTotal(G), a);
        const need = a.notes.map(n => n.replace("の音符", "")).join("・");
        return `<div style="margin-top:6px"><b>${esc(a.name)}</b> ${lv ? `<span class="tag-ok">Lv${lv} 発動</span>` : '<span class="tag-ng">未発動</span>'}<span class="muted"> 解放: ${need} ${a.base}以上（Lvごとに+15）</span>
          ${lv ? a.items.map(it => item(id + ":" + a.id + ":" + it.id, it, lv)).join("") : ""}</div>`;
      }).join("");
      return `<div class="pot core" style="grid-column:1/-1"><div class="ph"><b>${esc(lrName(r))}</b> <span class="muted">コア効果</span>${rankSel}</div>${core}${as ? `<div class="muted" style="margin-top:6px">アシスト効果（音符のレベルで自動で解放）</div>${as}` : ""}</div>`;
    }).join("");
    return `<div class="wide"><h3>ロスレコ・音符</h3>
      <div class="lr-cols"><div>${[0, 1, 2].map(i => slot("lrMain", i, "メイン" + (i + 1))).join("")}</div><div>${[0, 1, 2].map(i => slot("lrSub", i, "サブ" + (i + 1))).join("")}</div></div>
      <p class="muted">ロスレコの基礎攻撃力・基礎HP・属性ダメージ%は、全員に入ります（属性が違うロスレコの属性ダメージは、その属性の巡遊者だけ）。コア効果・アシスト効果は、メインのものだけです。<br>
      名前に「*」があるものは、日本語Wikiの値です（ゲーム内の画面では未確認。Lv90・ランク8の値）。コア効果は「突破」で値を選べます。条件付きの効果は、既定では反映しません（チェックで反映）。</p>
      <h3 style="margin-top:12px;font-size:14px">音符効果（探索で獲得した数を入力。サブのロスレコの初期音符は自動で足します）</h3>
      <div class="notes-row">${noteIn}</div>
      <h3 style="margin-top:12px;font-size:14px">効果の数（暁光・星願など。戦闘中のある時点を想定して入力）</h3>
      <div class="grid-in">${counts}</div>
      <h3 style="margin-top:12px;font-size:14px">メインのロスレコの効果</h3>
      <div class="grid-in" style="grid-template-columns:1fr">${fxHtml || '<span class="muted">メインのロスレコを選ぶと、効果が出ます</span>'}</div>
      <h3 style="margin-top:12px;font-size:14px">一覧にないロスレコ・サブの合計（手入力）</h3>
      <div class="grid-in">
        ${fld("基礎攻撃力 合計", inp(m + ".baseAtk", { w: 100 }))}${fld("基礎HP 合計", inp(m + ".baseHp", { w: 100 }))}
        ${fld("属性ダメージ 合計", inp(m + ".elem", { w: 100 }), "0.66=66%")}${fld("その属性", inp(m + ".elemEl", { sel: [["", "全員"], ["光", "光"], ["水", "水"], ["風", "風"], ["火", "火"], ["地", "地"], ["闇", "闇"]], str: true }))}
        ${fld("通常ダメ 合計", inp(m + ".basicDmg", { w: 100 }))}${fld("スキルダメ 合計", inp(m + ".skillDmg", { w: 100 }))}${fld("攻撃力% 合計", inp(m + ".atkPct", { w: 100 }))}
      </div></div>`;
  }

  // ---- ギミック・補正 ----
  function renderGimmick() {
    const en = G.enemyObj;
    const tr = S.DEFAULT_ENEMY_TRAITS[G.enemy] || [];
    return `<div class="wide"><h3>ギミック（敵・指名手配）</h3>
      ${fld("敵", inp("enemy", { sel: S.ENEMIES.map(e => [e.id, e.name]), str: true }))}
      <p class="note">弱点: ${en.weak.join("・") || "なし"}（弱点補正 ×${en.weakMult}）／防御倍率 ${en.def}／印の別枠 ×${en.markX}／主力の最大HP +${pct(en.hpBonus)}${en.teamHp ? `／全員のHP +${pct(en.teamHp)}・攻撃 +${pct(en.teamAtk)}・会心率 +${pct(en.teamCrit)}` : ""}</p>
      <p class="muted">${esc(en.note)}</p>
      ${tr.map(t => `<label class="check" style="font-weight:400"><input type="checkbox" data-p="traits.${t.id}" data-t="b"${G.traits[t.id] ? " checked" : ""}>${esc(t.name)}</label>`).join("")}
      <label class="check" style="font-weight:400"><input type="checkbox" data-p="glimmer" data-t="b"${G.glimmer !== false ? " checked" : ""}>敵に「残光」が付いている（光チームの素質の条件）</label>
      <label class="check" style="font-weight:400"><input type="checkbox" data-p="markDebuff" data-t="b"${G.markDebuff !== false ? " checked" : ""}>ティリアの印被ダメージ増加（眩い正義など）が敵に付いている</label>
      <label class="check" style="font-weight:400"><input type="checkbox" data-p="heartCrit" data-t="b"${G.heartCrit ? " checked" : ""}>セイナ(原点)の心相1「閃星」中（印の会心ダメージ +12%）</label></div>`;
  }
  function renderAdjust() {
    const en = G.enemyObj;
    const els = ["光", "水", "風", "火", "地", "闇"];
    return `<div class="wide"><h3>補正（敵の数値の上書きと、「その他倍率」）</h3>
      <div class="grid-in">
        ${fld("その他倍率（全体に掛ける）", inp("other.mult", { w: 100 }), "不明な倍率を入れる")}${fld("被ダメージ（別枠の乗算）", inp("other.taken", { w: 100 }), "1.15 = +15%")}
        ${fld("敵の防御倍率 上書き", inp("enemyOv.def", { w: 100 }), "空=" + en.def)}${fld("弱点補正 上書き", inp("enemyOv.weakMult", { w: 100 }), "空=" + en.weakMult)}
        ${fld("印の別枠 上書き", inp("enemyOv.markX", { w: 100 }), "空=" + en.markX)}
      </div>
      <h3 style="margin-top:12px;font-size:14px">敵の属性ごとの耐性と、実測合わせの倍率</h3>
      <table style="max-width:560px"><tr><th>属性</th><th>耐性（空=${"既定"}）</th><th>その他（実測合わせ）</th></tr>
      ${els.map(e => `<tr><td>${e}${en.weak.indexOf(e) >= 0 ? "（弱点）" : ""}</td><td>${inp(`enemyOv.res.${e}`, { w: 90 })}<span class="muted"> 既定 ${en.res[e] != null ? en.res[e] : (en.resDefault != null ? en.resDefault : 250)}</span></td><td>${inp(`enemyOv.extra.${e}`, { w: 90 })}<span class="muted"> 既定 ${(en.extra && en.extra[e]) || 1}</span></td></tr>`).join("")}</table>
      <p class="muted">耐性の式は、有効耐性 = 耐性 − 貫通 のとき 倍率 = 1 − 0.25×(E/250)²（実測と一致）。「その他」は、原因が分かっていない差を合わせるための倍率です。</p></div>`;
  }
  // ---- 指名手配の3分間の回数（かなり雑な目安）----
  // スキル・必殺技は、CDが明けたらすぐ使う想定で ceil(180 ÷ CD) 回（SPは考えない）。CDは日本語Wiki（data/skill_ct.js）、
  // ゲーム内で確かめた値があればそちらを使う。通常攻撃は 180 ÷ 1ローテの秒数（スキル中・ダッシュの中断は入れない）。
  // 回数は G.rot[巡遊者][basic|main|ult|support] で上書きできる
  const FIGHT_SEC = 180;
  const CT_GAME = { "Firstlight Noya": { main: 10, support: 12, ult: 30 } };   // ゲーム内の表示（2026-10-28 ユーザー）
  const BASIC_SEC = { "Firstlight Noya": 5 };   // 通常1ローテの秒数（最終段から最終段までを目で見た値）。ほかは未測定
  const BASIC_SEC_DEFAULT = 5;
  function rotDefault(id) {
    const c = chOf(id), ct = Object.assign({}, (window.SKILL_CT || {})[c.en] || {}, CT_GAME[c.en] || {});
    const n = k => ct[k] ? Math.ceil(FIGHT_SEC / ct[k]) : null;
    const bs = BASIC_SEC[c.en];
    return { ct, basicSec: bs || BASIC_SEC_DEFAULT, basicMeasured: !!bs, basic: Math.floor(FIGHT_SEC / (bs || BASIC_SEC_DEFAULT)), main: n("main"), ult: n("ult"), support: n("support") };
  }
  function rotCount(g, id, k) {
    const v = ((g.rot || {})[id] || {})[k];
    if (v != null && v !== "") return Math.max(0, +v);
    return rotDefault(id)[k] || 0;
  }
  // ---- 与ダメへの寄与率（今の入力のまま、1つ外すと何%下がるか）----
  // 巡遊者ごとの対象のダメージ（3分間）: 主力は 通常×回数＋主力スキル×回数＋必殺技×回数（印を含む）、支援は 支援スキル×回数
  function dmgParts(g) {
    const r = E.calcTeam(clone(g)), mid = g.team.main, m = r.team[mid], n = (id, k) => rotCount(g, id, k);
    return { main: m.groups.basic.totExp * n(mid, "basic") + m.groups.main.totExp * n(mid, "main") + m.groups.ult.totExp * n(mid, "ult"),
      s1: r.team[g.team.s1].groups.support.totExp * n(g.team.s1, "support"), s2: r.team[g.team.s2].groups.support.totExp * n(g.team.s2, "support") };
  }
  const sum3 = d => d.main + d.s1 + d.s2;
  function calcContrib() {
    const d0 = dmgParts(G), t0 = sum3(d0), items = [];
    const drop = (kind, label, slot, fn) => {
      const g = clone(G); fn(g); const d = dmgParts(g);
      items.push({ kind, label, team: t0 > 0 ? 1 - sum3(d) / t0 : 0, own: slot && d0[slot] > 0 ? 1 - d[slot] / d0[slot] : null });
    };
    SLOTS.forEach(([k]) => {
      const id = G.team[k], cs = G.chars[id], c = chOf(id);
      Object.keys(cs.pots2 || {}).filter(p => +cs.pots2[p] > 0).forEach(p => {
        const en = (Object.keys(S.POT_SPEC[id] || {}).find(n => S.potKey(n) === p)) || p;
        drop("素質", `${c.jp}：${JA(en, id)} Lv${cs.pots2[p]}`, k, g => { g.chars[id].pots2[p] = 0; });
      });
      Object.keys(cs.pots || {}).filter(p => +cs.pots[p] > 0).forEach(p => drop("素質", `${c.jp}：${((window.POTENTIALS || []).find(x => x.id === p) || {}).jp || p} Lv${cs.pots[p]}`, k, g => { g.chars[id].pots[p] = 0; }));
      Object.keys(cs.sup || {}).filter(p => cs.sup[p] && +cs.sup[p].lv > 0).forEach(p => drop("素質", `${c.jp}：${(((window.SUP_POTS || {})[id] || []).find(x => x.id === p) || {}).jp || p} Lv${cs.sup[p].lv}`, k, g => { g.chars[id].sup[p].lv = 0; }));
      (cs.emb || []).forEach((e, i) => {
        if (!cs.embOn[i] || !e.slots.some(sl => sl.k)) return;
        drop("徽章", `${c.jp}：${KIND_NAME[e.kind] || ""}徽章（1枚まるごと）`, k, g => { g.chars[id].embOn[i] = 0; });
        e.slots.forEach((sl, j) => { if (sl.k) drop("徽章", `${c.jp}：${KIND_NAME[e.kind] || ""}徽章 ${slotLabel(id, sl)}`, k, g => { g.chars[id].emb[i].slots[j].k = ""; }); });
      });
    });
    S.NOTE_KEYS.forEach(n => { const v = (G.notes || {})[n]; if (v > 0) drop("音符", `${n.replace("の音符", "")} ${v}`, null, g => { g.notes[n] = 0; }); });
    items.sort((a, b) => b.team - a.team);
    return items;
  }
  let contribCache = { key: "", items: null };
  function getContrib() {
    const key = JSON.stringify(G);   // 入力が変わっていなければ、前の結果を使う
    if (contribCache.key !== key) contribCache = { key, items: calcContrib() };
    return contribCache.items;
  }
  // ---- ビルドカード（画像）。1人1列で3人分、下にロスレコと音符。絵は使わず、名前・属性の色・数字で描く ----
  const EL_COLOR = { 光: "#E8B10F", 水: "#2BA6DE", 火: "#E5533D", 風: "#3FA86A", 地: "#A0703C", 闇: "#6B4FA0" };
  const Q_COLOR = { green: "#4FB58A", blue: "#4E8FD6", gold: "#E3A93A", rainbow: "#C25FD0", rainbow2: "#C25FD0", rainbow3: "#C25FD0" };
  function shortSlot(id, sl) {
    const o = optOf(sl.k); if (!o) return "";
    const v = qVal(o, sl.q);
    return o.label.replace(/（.*?）/g, "").replace("レベル上昇", "Lv") + (v != null ? " " + valTxt(o, v) : "") + (sl.t ? "（" + JA(sl.t, id) + "）" : "");
  }
  function drawCard() {
    const W = 1800, H = 1000, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const x = cv.getContext("2d"), F = "'Noto Sans JP', sans-serif";
    const rr = (px, py, w, h, r, fill, stroke) => { x.beginPath(); x.roundRect(px, py, w, h, r); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = 2; x.stroke(); } };
    const txt = (s, px, py, size, color, opt) => { opt = opt || {}; x.font = `${opt.w || 700} ${size}px ${F}`; x.fillStyle = color; x.textAlign = opt.align || "left"; x.textBaseline = "alphabetic";
      let t = String(s); if (opt.max) while (x.measureText(t).width > opt.max && t.length > 1) t = t.slice(0, -2) + "…"; x.fillText(t, px, py); return x.measureText(t).width; };
    // 背景（素質ノートと同じ方眼）
    x.fillStyle = "#F3F4FA"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "#E4E7F3"; x.lineWidth = 1.5; for (let i = 0; i <= W; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } for (let j = 0; j <= H; j += 32) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
    const team = [G.team.main, G.team.s1, G.team.s2], hasAuto = team.some(id => chOf(id).auto);
    const colW = 576, gap = 18, top = 24;
    SLOTS.forEach(([k, l], ci) => {
      const id = G.team[k], c = chOf(id), cs = G.chars[id], col = EL_COLOR[c.el] || "#4B5082", X0 = 24 + ci * (colW + gap);
      rr(X0, top, colW, 760, 18, "#FFFFFF", "#D9DCED");
      // 見出し（属性の色の帯）: 左に「主力・水属性」と名前、右にスキルLv（2行）と信頼・心相
      x.save(); x.beginPath(); x.roundRect(X0, top, colW, 100, [18, 18, 0, 0]); x.fillStyle = col; x.fill(); x.restore();
      txt(`${l}・${c.el}属性`, X0 + 20, top + 32, 19, "rgba(255,255,255,.92)");
      txt(c.jp + (c.auto ? "*" : ""), X0 + 20, top + 80, 32, "#FFFFFF", { w: 900, max: 330 });
      const lv = cs.skillLv || {}, eb = emx(id).lv, L2 = key => (lv[key] || 10) + (eb[key] || 0);
      txt(`通常${L2("basic")}・主力${L2("main")}`, X0 + colW - 20, top + 32, 18, "#FFFFFF", { align: "right" });
      txt(`支援${L2("support")}・必殺${L2("ult")}`, X0 + colW - 20, top + 58, 18, "#FFFFFF", { align: "right" });
      txt(`信頼Lv${cs.trustLv || 0}・心相${cs.talent || 0}`, X0 + colW - 20, top + 84, 18, "rgba(255,255,255,.92)", { align: "right" });
      // ステータス（戦闘中＝今の入力のまま）
      const b = R.team[id], st = b.st, ef = b.ef;
      const batk = st.mode === "auto" ? st.baseAtk * (1 + st.atkPct + ef.atkPct) : st.atk * (1 + ef.atkPct);
      const stats = [["HP", fmt(st.hp)], ["攻撃力", fmt(batk)], ["会心率", pct(st.critRate)], ["会心ダメージ", pct(st.critDmg)], [c.el + "属性ダメージ", pct(1 + st.elemAdd + ef.W)], ["属性耐性貫通", fmt(Math.min(st.pen, 250))]];
      stats.forEach(([n, v], i) => { const yy = top + 136 + i * 32; txt(n, X0 + 22, yy, 20, "#5F6492"); txt(v, X0 + colW - 22, yy, 22, "#1E2250", { align: "right", w: 900 }); });
      // 徽章3枚（4枠を2列×2行）
      (cs.emb || []).map((e, i) => ({ e, i })).sort((a, b2) => KIND_ORDER.indexOf(a.e.kind) - KIND_ORDER.indexOf(b2.e.kind)).forEach(({ e, i }, n) => {
        const yy = top + 330 + n * 112;
        rr(X0 + 14, yy, colW - 28, 102, 12, "#F6F7FC", "#E4E7F3");
        txt(`${KIND_NAME[e.kind] || ""}徽章`, X0 + 28, yy + 30, 17, "#4B5082");
        const ss = cs.embOn[i] ? e.slots.filter(sl => sl.k) : [];
        if (!ss.length) txt("（徽章なし）", X0 + 28, yy + 72, 17, "#9AA0C8", { w: 500 });
        ss.slice(0, 4).forEach((sl, j) => {
          const sx = X0 + 34 + (j % 2) * 264, sy = yy + 62 + Math.floor(j / 2) * 30;
          x.fillStyle = Q_COLOR[sl.q] || "#9AA0C8"; x.beginPath(); x.arc(sx, sy - 6, 5, 0, Math.PI * 2); x.fill();
          txt(shortSlot(id, sl), sx + 10, sy, 17, "#1E2250", { max: 244, w: 500 });
        });
      });
      // 素質（取得しているもの。コアを先に）
      const t = TK(c.en), role = k === "main" ? "main" : "support", got = [];
      ((t && t.potentials[role]) || []).forEach(g => g.potentials.forEach(p => { const lv2 = +((cs.pots2 || {})[S.potKey(p.name)] || 0); if (lv2 > 0) got.push({ n: JA(p.name, id), lv: lv2, core: p.type === 1 }); }));
      Object.keys(cs.pots || {}).filter(p => +cs.pots[p] > 0).forEach(p => got.push({ n: ((window.POTENTIALS || []).find(q => q.id === p) || {}).jp || p, lv: cs.pots[p], core: false }));
      got.sort((a, b2) => (b2.core - a.core) || (b2.lv - a.lv));
      txt("素質", X0 + 22, top + 676, 18, "#08808A", { w: 900 });
      const pl = got.map(p => (p.core ? "◆" : "") + p.n + (p.core ? "" : " " + p.lv)).join("・") || "（なし）";
      // 2行に折り返す
      x.font = `500 17px ${F}`; let line = "", ly = top + 704, lines = 0;
      for (const ch of pl) { if (x.measureText(line + ch).width > colW - 44) { txt(line, X0 + 22, ly, 17, "#1E2250", { w: 500 }); line = ""; ly += 26; if (++lines >= 2) break; } line += ch; }
      if (lines < 2 && line) txt(line, X0 + 22, ly, 17, "#1E2250", { w: 500, max: colW - 44 });
    });
    // 下の帯: ロスレコ（メイン・サブ）と音符（0も出し、位置は固定）
    const by = 800, LR = window.LOSTRECORDS || [];
    rr(24, by, W - 48, 176, 18, "#4B5082");
    const lrn = id => { const r = id && LR.find(q => q.id === id); return r ? r.name + (r.auto || r.autoFx ? "*" : "") : "—"; };
    [["メイン", G.lrMain], ["サブ", G.lrSub]].forEach(([n, arr], i) => {
      const yy = by + 42 + i * 44;
      txt(n, 56, yy, 18, "#D9DCED");
      [0, 1, 2].forEach(j => txt(lrn((arr || [])[j]), 140 + j * 250, yy, 20, "#FFFFFF", { max: 236 }));
    });
    const total = S.NOTE_KEYS.reduce((a, n) => a + (+(G.notes || {})[n] || 0), 0);
    txt(`音符（合計 ${total}）`, 930, by + 42, 18, "#D9DCED");
    S.NOTE_KEYS.forEach((n, i) => {
      const nx = 930 + (i % 5) * 162, ny = by + 80 + Math.floor(i / 5) * 34, v = (G.notes || {})[n] || 0;
      txt(n.replace("の音符", ""), nx, ny, 19, "#D9DCED", { w: 500 });
      txt(String(v), nx + 128, ny, 22, v ? "#FFFFFF" : "#8A90BE", { align: "right", w: 900 });
    });
    txt((hasAuto ? "＊は未確認のデータ。" : "") + "sim.stella-tool.com・α版", 56, by + 156, 15, "#D9DCED", { w: 500, max: W - 112 });
    return cv;
  }
  let cardUrl = "";
  async function makeCard() {
    try { await document.fonts.ready; } catch (e) { /* 無視 */ }
    cardUrl = drawCard().toDataURL("image/png");
    renderAll();
  }

  function renderScore() {
    const cardHtml = `<div class="box" style="margin:0 0 10px"><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        <b>ビルドカード</b><button class="btn-add pri" data-act="card-make" style="background:var(--accent);border-color:var(--accent);font-weight:900">${cardUrl ? "カードを作り直す" : "カードを作る"}</button>
        ${cardUrl ? `<a class="btn-add" href="${cardUrl}" download="build-card.png" style="display:inline-flex;align-items:center;text-decoration:none">画像を保存</a><button class="btn-add xbtn" data-act="share-x">Xで共有</button>` : ""}
        <span class="muted">${cardUrl ? "Xで共有は、短縮URL付きの投稿画面を開きます。画像は保存してから添付してください。入力を変えたら作り直してください。" : "3人分の徽章・素質・ロスレコ・音符を1枚の画像にします。"}</span></div>
        ${cardUrl ? `<img src="${cardUrl}" alt="ビルドカード" style="width:100%;margin-top:8px;border-radius:12px;border:2px solid var(--border)">` : ""}</div>`;
    // 3分間の回数（目安）の入力
    const rotIn = (id, k, label, d) => fld(label, inp(`rot.${id}.${k}`, { min: 0, step: 1, w: 70, ph: d[k] == null ? "未設定" : String(d[k]) }),
      k === "basic" ? `空欄=${d.basic}（1ローテ${d.basicSec}秒${d.basicMeasured ? "" : "・未測定"}）` : (d.ct[k] ? `空欄=${d[k]}（CD ${d.ct[k]}秒）` : "CDが分かりません。回数を入れてください"));
    const rotHtml = SLOTS.map(([k, l]) => {
      const id = G.team[k], d = rotDefault(id);
      const f = k === "main" ? rotIn(id, "basic", "通常1ローテ", d) + rotIn(id, "main", "主力スキル", d) + rotIn(id, "ult", "必殺技", d) : rotIn(id, "support", "支援スキル", d);
      return `<div class="box"><b>${l}：${esc(chOf(id).jp)}</b>${f}</div>`;
    }).join("");
    let items;
    try { items = getContrib(); } catch (e) { return `<div class="wide"><h3>ビルドカード</h3>${cardHtml}<p class="muted">寄与率を計算できませんでした（${esc(e.message)}）</p></div>`; }
    const pc = v => v == null ? "" : v > 0.0005 ? "−" + (Math.round(v * 1000) / 10).toFixed(1) + "%" : v < -0.0005 ? "+" + (Math.round(-v * 1000) / 10).toFixed(1) + "%" : "影響なし";
    const rows = (kind, own) => { const it = items.filter(x => x.kind === kind); return it.length ? `<table class="stt"><tr><th style="text-align:left">項目</th><th>編成の合計</th>${own ? "<th>本人の分</th>" : ""}</tr>${it.map(x => `<tr><td title="${esc(x.label)}" style="width:auto;white-space:normal">${esc(x.label)}</td><td style="text-align:right;width:80px">${pc(x.team)}</td>${own ? `<td style="text-align:right;width:80px">${pc(x.own)}</td>` : ""}</tr>`).join("")}</table>` : '<p class="muted">入っていません</p>'; };
    return `<div class="wide"><h3>ビルドカード</h3>${cardHtml}
      <h3 style="margin:14px 0 6px;font-size:15px">与ダメへの寄与率</h3>
      <div class="box" style="border-color:#E5533D;background:#FFF4F2;margin:0 0 8px"><b style="color:#C0392B">⚠ 3分間の回数は、かなり雑な目安です</b>
        <p style="margin:4px 0 0;font-size:12px;line-height:1.6">指名手配の3分間で、スキルと必殺技をCDが明けたらすぐ使い、残りは通常攻撃をし続けた、という想定です。実際の戦闘の回数とは違います。<br>
        ・CDは日本語Wikiの値です（セイナ(原点)はゲーム内の表示）。SPが足りずに必殺技が撃てない場合や、CDが戻る効果（ホタルの必殺技など）は入っていません。<br>
        ・通常攻撃は「3分 ÷ 1ローテの秒数」で、スキル中やダッシュで中断される分を引いていません。1ローテの秒数を測ったのはセイナ(原点)（約5秒、目で見た値）だけで、ほかは仮に5秒です。<br>
        ・自分の戦い方に合わせて、下の回数を書き換えてください。寄与率は、この回数で合計したダメージで出します。</p></div>
      <div class="grid-in" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:8px">${rotHtml}</div>
      <p class="muted" style="margin:0 0 6px">今の入力のまま、1つだけ外したときに3分間のダメージが何%下がるかです。<b>編成の合計</b>＝主力の通常・主力スキル・必殺技（印を含む）＋支援2人の支援スキル（それぞれ上の回数ぶん）。<b>本人の分</b>＝主力は通常・主力スキル・必殺技、支援は支援スキルだけ。<br>
      SP獲得効率は、回数を上で決める形なので反映されません（「影響なし」になります）。直接入力を優先しているときは、ステータスに効く項目も動きません。音符は、アシスト効果の解放も含めた値です。</p>
      <div class="grid-in" style="grid-template-columns:repeat(3,minmax(0,1fr))">
        <div class="box"><b>素質</b>（1つ外すと）${rows("素質", true)}</div>
        <div class="box"><b>徽章</b>（1枚・1枠外すと）${rows("徽章", true)}</div>
        <div class="box"><b>音符</b>（1種類外すと）${rows("音符", false)}</div>
      </div></div>`;
  }

  function renderDisplay() {
    const [a, b] = V.panel.split(":");
    let h;
    if (V.panel === "overview") h = renderOverview();
    else if (V.panel === "direct") h = renderDirect();
    else if (a === "emb") h = renderEmblem(b);
    else if (a === "heart") h = renderHeart(b);
    else if (a === "pot") h = renderPot(b);
    else if (a === "add") h = renderAdd(b);
    else if (V.panel === "record") h = renderRecord();
    else if (V.panel === "lr") h = renderLr();
    else if (V.panel === "gimmick") h = renderGimmick();
    else if (V.panel === "adjust") h = renderAdjust();
    else if (V.panel === "score") h = renderScore();
    else h = renderOverview();
    // 巡遊者ごとの画面（心相・徽章・素質・その他）では、戻るボタンと、同じ巡遊者のほかの画面へのボタンを出す
    let nav = "";
    if (/^(emb|heart|pot|add)$/.test(a)) {
      const nb = (p, l) => `<button class="tab" aria-selected="${a === p}" data-act="panel:${p}:${b}">${l}</button>`;
      nav = `<div class="subnav"><button class="btn-add" data-act="panel:overview">← 巡遊者に戻る</button><div class="tabs" style="margin:0">${nb("heart", "心相")}${nb("emb", "徽章")}${nb("pot", "素質")}${nb("add", "その他")}</div></div>`;
    }
    $("display").innerHTML = nav + h;
  }

  // ---- 結果 ----
  function groupSummary(id, group, markOnly) {
    const o = R.team[id];
    if (!o) return null;
    const g = o.groups[group];
    const rows = g.rows.filter(r => markOnly ? r.type === "mark" : r.type !== "mark");
    if (!rows.length) return null;
    let mult = 0, exp = 0, non = 0, crit = 0, Bsum = 0, n = 0, rateSum = 0, cnt = 0;
    rows.forEach(r => { mult += r.mult * r.count; exp += r.total; non += r.normal * r.count; crit += r.crit * r.count; Bsum += r.B; n++; rateSum += r.rate * r.count; cnt += r.count; });
    const rate = cnt ? rateSum / cnt : 0;
    return { rows, mult, exp, non, crit, B: Bsum / n, id, group, markOnly, rate, critDmg: non ? crit / non : 1, expMult: non ? exp / non : 1 };
  }
  function renderResult() {
    const main = G.team.main, s1 = G.team.s1, s2 = G.team.s2;
    // 順番: 通常、主力、必殺、印、支援1、支援2
    const items = [
      ["basic", "通常1ローテ", groupSummary(main, "basic"), main],
      ["main", "主力スキル", groupSummary(main, "main"), main],
      ["ult", "必殺技", groupSummary(main, "ult"), main],
      ["mark", "印", groupSummary(main, "main", true) || groupSummary(main, "ult", true), main],
      ["sup1", chOf(s1).jp + " 支援スキル", groupSummary(s1, "support"), s1],
      ["sup2", chOf(s2).jp + " 支援スキル", groupSummary(s2, "support"), s2],
    ];
    window.__items = items;
    const curVals = {};
    $("result").innerHTML = items.map(([key, label, sm, id]) => {
      const nm = esc(chOf(id).jp);
      if (!sm) return `<div class="res-row"><div class="tile"><span>${esc(label)}倍率</span><b>—</b><small>${nm}にはこの項目がありません</small></div><div class="tile"><span>${esc(label)} Dmg</span><b>—</b></div></div>`;
      curVals[key] = sm.exp;
      let cmp = "";
      if (memo && memo.v && memo.v[key] != null) {
        const d = sm.exp / memo.v[key] - 1;
        cmp = `<div class="cmp ${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${(Math.round(d * 1000) / 10)}%</div>`;
      }
      return `<div class="res-row"><div class="tile"><span>${esc(label)}倍率</span><b>${fmt(sm.mult)}%</b>
        <small>種別ダメージ ×${f3(sm.B)}</small><small>会心率 ${pct(sm.rate)} ／ 会心ダメージ ${pct(sm.critDmg)}</small><small>会心期待値倍率 ×${f3(sm.expMult)}</small></div>
        <div class="tile pink${V.drill === key ? " sel" : ""}" data-act="drill:${key}"><span>${esc(label)} Dmg</span><b>${fmt(sm.exp)}</b><small>非会心 ${fmt(sm.non)} ／ 会心 ${fmt(sm.crit)}</small>${cmp}</div></div>`;
    }).join("");
    window.__cur = curVals;
    renderDrill(items);
    renderMobile(items);
  }
  function renderDrill(items) {
    const it = items.find(x => x[0] === V.drill);
    const panel = $("drillPanel");
    if (!it || !it[2]) { panel.style.display = "none"; return; }
    panel.style.display = "";
    const sm = it[2];
    $("drillTitle").textContent = `${it[1]}の内訳` + (/^sup/.test(it[0]) ? "" : `（${chOf(it[3]).jp}）`);
    // 1ヒットを2段で: 種別／名前・倍率／回数・非会心／会心・期待値（1ヒット）／会心率と会心ダメージ。倍率の内訳と小計は、行にマウスを重ねると出る
    const r1 = n => (Math.round(n * 10) / 10).toFixed(1);
    $("drill").innerHTML = `<table><colgroup><col style="width:34%"><col style="width:18%"><col style="width:22%"><col style="width:26%"></colgroup>
      <tr><th>種別<br>ヒット</th><th>倍率<br>回数</th><th>非会心<br>会心</th><th>期待値<br><span class="nb">会心率</span><span class="nb">／会心ダメ</span></th></tr>
      ${sm.rows.map(r => {
        const tip = esc(`小計 ${fmt(r.total)}／属性W ×${f3(r.W)}／種別B ×${f3(r.B)}／被ダメ ×${f3(r.taken)}／敵D ×${f3(r.D)}${r.markX !== 1 ? `／印の別枠 ×${r.markX}` : ""}`);
        return `<tr class="d1" title="${tip}"><td>${E.TYPE_NAME[r.type]}</td><td>${r1(r.mult)}%</td><td>${fmt(r.normal)}</td><td class="ex">${fmt(r.avg)}</td></tr>
        <tr class="d2" title="${tip}"><td>${esc(r.name)}</td><td>×${r.count} hit</td><td>${fmt(r.crit)}</td><td><span class="nb">${pct(r.rate)}</span><span class="nb">／${pct(r.critDmg != null ? r.critDmg : r.crit / r.normal)}</span></td></tr>`;
      }).join("")}
      <tr class="sum"><td>合計</td><td>${fmt(sm.mult)}%</td><td>${big(sm.non)}<br>${big(sm.crit)}</td><td>${fmt(sm.exp)}</td></tr></table>`;
  }

  function renderAll() {
    G.enemyOv = G.enemyOv || { res: {}, extra: {} };
    recalc();
    renderTop(); renderTiles(); renderSelectors(); renderDisplay(); renderResult();
    save();
  }

  // ---- イベント ----
  document.addEventListener("change", ev => {
    const t = ev.target;
    if (t.id === "bsel" || t.id === "bname") return;
    // ロスレコの枠: 属性を変えたら、違う属性のロスレコは外す
    const lrel = t.getAttribute && t.getAttribute("data-lrel"), lrid = t.getAttribute && t.getAttribute("data-lrid");
    if (lrel || lrid) {
      const path = lrel || lrid, [arr, i] = path.split(".");
      G[arr] = G[arr] || [];
      if (lrel) {
        V.lrEl[path] = t.value;
        const r = LOSTRECORDS.find(x => x.id === G[arr][+i]);
        if (r && t.value && r.element !== t.value) G[arr][+i] = "";
      } else { G[arr][+i] = t.value; delete V.lrEl[path]; }
      renderAll(); return;
    }
    const p = t.getAttribute && t.getAttribute("data-p");
    if (!p) return;
    const ty = t.getAttribute("data-t");
    let v;
    if (ty === "b") v = t.checked;
    else if (ty === "b01") v = t.checked ? 1 : 0;
    else if (ty === "s") v = t.value;
    else v = t.value === "" ? null : +t.value;
    setPath(p, v);
    // 徽章の枠: 区分を変えたら項目を空に、項目を選んだら値を有効なものに直す
    const mm = /^chars\.(\w+)\.emb\.(\d+)\.slots\.(\d+)\.(cat|k)$/.exec(p);
    if (mm) {
      const sl = G.chars[mm[1]].emb[+mm[2]].slots[+mm[3]];
      if (mm[4] === "cat") { sl.k = ""; delete sl.t; }
      else if (sl.k) {
        const o = optOf(sl.k), qs = qualOf(o).map(q => q[0]);
        if (qs.indexOf(sl.q) < 0) sl.q = qs.indexOf("gold") >= 0 ? "gold" : qs[0];
        if (o.type !== "potLv") delete sl.t;
      } else delete sl.t;
    }
    renderAll();
  });
  function embClear(a) {
    const [, id, i, j] = a.split(":");
    const e = G.chars[id].emb[+i], sl = e && e.slots[+j];
    if (!sl) return;
    sl.k = ""; sl.cat = ""; delete sl.t;
  }
  document.addEventListener("click", ev => {
    const t = ev.target.closest("[data-act]");
    if (!t) return;
    const a = t.getAttribute("data-act");
    if (a.indexOf("panel:") === 0) { V.panel = a.slice(6); V.pick = null; V.lrPick = null; renderAll(); return; }
    if (a.indexOf("tf:") === 0) { V.tilesFor = a.slice(3); renderAll(); return; }
    if (a.indexOf("drill:") === 0) {
      const k = a.slice(6), phone = window.matchMedia("(max-width: 860px)").matches;
      if (phone) { V.drill = k; V.m = "drill"; } else V.drill = V.drill === k ? null : k;   // スマホは内訳のタブに切り替える
      renderAll(); return;
    }
    if (a.indexOf("m:") === 0) {
      V.m = a.slice(2);
      if (V.m === "drill" && !V.drill) { const f = (window.__items || []).find(x => x[2]); V.drill = f ? f[0] : null; }   // 内訳は、まだ選んでいなければ先頭の項目
      renderAll(); window.scrollTo(0, 0); return;
    }
    if (a.indexOf("mchar:") === 0) { V.mChar = a.slice(6); renderAll(); return; }
    if (a.indexOf("embclear:") === 0) { embClear(a); renderAll(); return; }
    if (a.indexOf("lrclear:") === 0) { const p = a.slice(8), [arr, i] = p.split("."); G[arr] = G[arr] || []; G[arr][+i] = ""; delete V.lrEl[p]; renderAll(); return; }
    let builds = {};
    try { builds = JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { builds = {}; }
    if (a === "bsave") { const n = $("bname").value.trim(); if (!n) return; builds[n] = clone(G); try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } renderTop(); }
    else if (a === "bload") { const n = $("bsel").value; if (n && builds[n]) { G = merge(defState(), clone(builds[n])); renderAll(); } }
    else if (a === "bdel") { const n = $("bsel").value; if (n && builds[n]) { delete builds[n]; try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } renderTop(); } }
    else if (a === "memo") { memo = { v: clone(window.__cur || {}) }; try { localStorage.setItem(KEY_M, JSON.stringify(memo)); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "memodel") { memo = null; try { localStorage.removeItem(KEY_M); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "dlg-open") { DM.preset = DM.code = DM.url = null; renderTop(); $("shareDlg").showModal(); }
    else if (a === "dlg-close") $("shareDlg").close();
    else if (a === "share-x") shareX();
    else if (a === "card-make") makeCard();
    else if (a === "rp-open") { RP.msg = null; RP.done = false; renderReport(); $("reportDlg").showModal(); }
    else if (a === "rp-close") $("reportDlg").close();
    else if (a === "beta-close") { $("betabar").hidden = true; try { localStorage.setItem("stellasora-sim-beta-closed", "1"); } catch (e) { /* 無視 */ } }
    else if (a === "rp-send") sendReport();
    else if (a.indexOf("dv:") === 0) shareAct(a.split(":")[1], a.split(":")[2]);
    else if (a === "reset") { if (confirm("入力をすべて初期値に戻します。よいですか？")) { G = defState(); renderAll(); } }
  });
  // ---- 共有・読み込み（ポップアップの各欄）: key = preset / code / url、op = in（読込）/ out（作成）/ copy ----
  const say = (key, t, ng) => { DM[key] = { t, ng: !!ng }; renderTop(); };
  const loadCode = (code, key, what) => S.shareDecode(code, defState()).then(g => { G = g; DM[key] = { t: what + "を読み込みました" }; renderAll(); }).catch(e => say(key, e.message || "読み込めませんでした", true));
  const loadPreset = (code, key) => {
    try { const g = clone(G); const names = S.presetApply(g, code); G = merge(defState(), g); DM[key] = { t: "読み込みました（" + names.join("・") + "）。編成と素質Lvだけが変わります" }; renderAll(); }
    catch (e) { say(key, e.message || "読み込めませんでした", true); }
  };
  function shareAct(key, op) {
    ["preset", "code", "url"].forEach(k => { const el = $("dv-" + k); if (el) DV[k] = el.value.trim(); if (k !== key) DM[k] = null; });   // ほかの欄のメッセージは消す
    const v = DV[key];
    if (op === "copy") {
      if (!v) return say(key, "コピーするものがありません（先に「作成」を押してください）", true);
      try { navigator.clipboard.writeText(v).then(() => say(key, "コピーしました"), () => say(key, "コピーできませんでした。枠の中を選んでコピーしてください", true)); } catch (e) { say(key, "コピーできませんでした。枠の中を選んでコピーしてください", true); }
      return;
    }
    if (key === "preset") {
      if (op === "in") return loadPreset(v, key);
      try { DV.preset = S.presetMake(G); say(key, "作りました。ゲームやプリセット共有サイトで読み込めます（編成と素質Lvだけ）"); } catch (e) { say(key, e.message, true); }
      return;
    }
    if (key === "code") {
      if (op === "in") return v ? loadCode(v, key, "共有コード") : say(key, "共有コードを貼り付けてください", true);
      S.shareEncode(G, defState(), [G.team.main, G.team.s1, G.team.s2]).then(c => { DV.code = c; say(key, `作りました（${c.length}文字）`); });
      return;
    }
    // 共有URL: 読込は、短縮URL（/s/ID）・長いURL（#c= / #p=）のどれでもよい。作成は、短縮URL（公開しているページだけ）
    if (op === "in") {
      const m = /\/s\/([A-Za-z0-9]{4,16})/.exec(v);
      if (m) {
        say(key, "読み込んでいます…");
        return fetch("/api/short?id=" + m[1]).then(r => r.json()).then(j => j.code ? loadCode(j.code, key, "共有URLのビルド") : say(key, j.error || "見つかりませんでした", true))
          .catch(() => say(key, "読み込めませんでした（公開しているページで使えます）", true));
      }
      if (v.indexOf("#c=") >= 0) return loadCode(decodeURIComponent(v.slice(v.indexOf("#c=") + 3)), key, "共有URLのビルド");
      if (v.indexOf("#p=") >= 0) return loadPreset(decodeURIComponent(v.slice(v.indexOf("#p=") + 3)), key);
      return say(key, "共有URLを貼り付けてください", true);
    }
    say(key, "短縮URLを作っています…");
    makeShort().then(url => { DV.url = url; say(key, "作りました"); }).catch(e => say(key, e.message, true));
  }
  // 短縮URLを作る（公開しているページだけ）。カードのタイトルは、編成の3人の名前
  const teamTitle = () => [G.team.main, G.team.s1, G.team.s2].map(id => chOf(id).jp).join("・") + "のビルド";
  function makeShort() {
    return S.shareEncode(G, defState(), [G.team.main, G.team.s1, G.team.s2])
      .then(code => fetch("/api/short", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, title: teamTitle() }) }))
      .catch(() => { throw new Error("短縮URLを作れませんでした（通信の失敗）"); })
      .then(r => r.json().catch(() => ({ error: "この環境では短縮URLを作れません（公開しているページで使えます）" })))
      .then(j => { if (!j.url) throw new Error(j.error || "短縮URLを作れませんでした"); return j.url; });
  }
  // Xで共有: 短縮URLを作って、Xの投稿画面を開く。ポップアップを止められないよう、押した時点で窓を開いておき、URLができたら移動する
  function shareX() {
    const w = window.open("about:blank", "_blank");
    say("url", "Xで共有する準備をしています…");   // メッセージは、ポップアップの共有URLの欄に出す
    makeShort().then(url => {
      const text = teamTitle();   // 本文は短く（ハッシュタグなし。共有する人が本文を長く書けるように）
      const intent = "https://x.com/intent/post?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
      if (w) w.location.href = intent; else location.href = intent;
      DV.url = url; say("url", "Xの投稿画面を開きました");
    }).catch(e => { if (w) w.close(); shareMsg = e.message; say("url", e.message, true); });   // ポップアップの外（カードから押したとき）でも分かるよう、上部にも出す
  }

  // ---- 報告（α版の間、データや計算の誤りなどを送ってもらう）。送った内容はサーバーのデータベースに入り、あとで確認する。今の入力（共有コード）を添えると同じ状態を再現できる ----
  const RP = { kind: "", body: "", contact: "", attach: true, msg: null, done: false, busy: false };
  const RP_KINDS = ["計算式・数値", "素質の効果", "ロスレコ・音符", "徽章・ステータス", "表示・使い方", "その他"];
  function renderReport() {
    const team = [G.team.main, G.team.s1, G.team.s2].map(id => chOf(id).jp).join("・");
    $("reportBody").innerHTML = `<h2 id="reportDlgT"><span class="en">REPORT</span>報告</h2>
      <p class="muted" style="margin:0">α版なので、データや計算が間違っている所がまだあると思います。計算の数値がゲームと合わない、素質やロスレコの効果がちがう、ここが使いにくい…など、なんでも気軽に教えてください！（返信はできないこともあります）</p>
      ${RP.done ? `<p class="msg ok" style="font-size:14px;margin-top:14px">送りました。教えてくれてありがとうございます！</p><div class="foot"><button class="btn-add" data-act="rp-close">閉じる</button></div>` : `
      <div class="row"><label for="rp-kind">種類</label><select id="rp-kind"><option value="">（選んでください）</option>${RP_KINDS.map(k => `<option${RP.kind === k ? " selected" : ""}>${k}</option>`).join("")}</select></div>
      <div class="row"><label for="rp-body">内容 <span class="muted" style="font-weight:400">（どこが・どう違うか。ゲーム内の値が分かれば、その値も）</span></label>
        <textarea id="rp-body" maxlength="2000" placeholder="例：セイナ(原点)の主力スキルの長剣のダメージが、ゲーム内では 123,456 だった（計算では 120,000）">${esc(RP.body)}</textarea></div>
      <div class="row"><label for="rp-contact">連絡先 <span class="muted" style="font-weight:400">（任意。XのIDなど。詳しく聞きたいときに使います）</span></label><input type="text" class="wide" id="rp-contact" maxlength="100" value="${esc(RP.contact)}"></div>
      <div class="row"><label class="check" style="font-weight:400;margin:0"><input type="checkbox" id="rp-attach"${RP.attach ? " checked" : ""}>今の入力を添付する（編成：${esc(team)}。同じ状態を再現して確かめるのに使います）</label></div>
      <div class="msg${RP.msg && RP.msg.ng ? " ng" : ""}">${esc((RP.msg || {}).t || "")}</div>
      <div class="foot"><button class="btn-add" data-act="rp-close">閉じる</button><button class="btn-add pri" data-act="rp-send"${RP.busy ? " disabled" : ""} style="background:var(--accent);border-color:var(--accent);font-weight:900">送る</button></div>`}`;
  }
  function sendReport() {
    RP.kind = $("rp-kind").value; RP.body = $("rp-body").value.trim(); RP.contact = $("rp-contact").value.trim(); RP.attach = $("rp-attach").checked;
    if (!RP.kind) { RP.msg = { t: "種類を選んでください", ng: true }; return renderReport(); }
    if (RP.body.length < 5) { RP.msg = { t: "内容を5文字以上で書いてください", ng: true }; return renderReport(); }
    RP.busy = true; RP.msg = { t: "送っています…" }; renderReport();
    const ver = ((document.querySelector('script[src*="sim_ui.js"]') || {}).src || "").split("v=")[1] || "";
    const team = [G.team.main, G.team.s1, G.team.s2].map(id => chOf(id).jp).join("・");
    (RP.attach ? S.shareEncode(G, defState(), [G.team.main, G.team.s1, G.team.s2]) : Promise.resolve(null))
      .then(code => fetch("/api/report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: RP.kind, body: RP.body, contact: RP.contact, code, team, ver }) }))
      .then(r => r.json().catch(() => ({ error: "この環境では送れません（公開しているページで使えます）" })))
      .then(j => { RP.busy = false; if (j.ok) { RP.done = true; RP.body = ""; RP.msg = null; } else RP.msg = { t: j.error || "送れませんでした", ng: true }; renderReport(); })
      .catch(() => { RP.busy = false; RP.msg = { t: "送れませんでした（通信の失敗）", ng: true }; renderReport(); });
  }

  renderAll();
  // α版のお知らせ（閉じたら、このブラウザでは次から出さない）
  try { if (!localStorage.getItem("stellasora-sim-beta-closed")) $("betabar").hidden = false; } catch (e) { $("betabar").hidden = false; }
  // URLから読み込む（読み込んだらURLからは消す）: #c=共有コード（短縮URLから移動してきたとき）、#p=プリセットコード（プリセット共有サイトなどから）
  const hc = location.hash;
  if (hc.indexOf("#c=") === 0 || hc.indexOf("#p=") === 0) {
    const code = decodeURIComponent(hc.slice(3));
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* 無視 */ }
    if (hc[1] === "p") {
      try { const g = clone(G); const names = S.presetApply(g, code); G = merge(defState(), g); shareMsg = "URLのプリセット（" + names.join("・") + "）を読み込みました"; } catch (e) { shareMsg = e.message; }
      renderAll();
    } else S.shareDecode(code, defState()).then(g => { G = g; shareMsg = "URLのビルドを読み込みました"; renderAll(); }).catch(e => { shareMsg = e.message || "URLのビルドを読み込めませんでした"; renderAll(); });
  }
})();
