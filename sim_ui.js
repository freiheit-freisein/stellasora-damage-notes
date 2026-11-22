// 汎用計算ページの画面。状態は localStorage に保存（無くても動く）。入力の確定（change）のたびに全体を描き直す。
(function () {
  const S = window.SIM, E = S.engine;
  const $ = id => document.getElementById(id);
  const fmt = n => (n == null || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("ja-JP");
  // 結果のダメージの表記: そのまま（19,875,037）／K（19,875K）／M（19.9M）。このブラウザに覚える
  let dmgUnit = "raw";
  try { dmgUnit = localStorage.getItem("stellasora-sim-unit") || "raw"; } catch (e) { /* 無視 */ }
  // 素質の説明を出すか（コア素質・通常素質で別々。見る人ごとの好み。既定は出す）
  const potDesc = { core: true, norm: true };
  try { ["core", "norm"].forEach(k => { potDesc[k] = localStorage.getItem("stellasora-sim-potdesc-" + k) !== "0"; }); } catch (e) { /* 無視 */ }
  const dmgF = n => (n == null || !isFinite(n)) ? "—" : dmgUnit === "k" ? (n / 1e3).toLocaleString("ja-JP", { maximumFractionDigits: 0 }) + "K"
    : dmgUnit === "m" ? (n / 1e6).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "M" : fmt(n);
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

  const { defChar, defState, merge } = S.contrib;   // 初期状態は sim_contrib.js（比較ページと共通）

  // テスト3・セイナHCの構成は、画面のボタンをなくし、共有コードで読み込む。
  // セイナHC（記録Lv34）の入力（初期値との差分）。検証用に残す
  const HC_PATCH ={"team":{"main":"noya","s1":"tilia","s2":"firefly"},"recordLv":34,"notes":{"強撃の音符":0,"幸運の音符":51,"爆発の音符":15,"体力の音符":35,"集中の音符":15,"器用の音符":30,"必殺の音符":15,"水の音符":0,"風の音符":0,"光の音符":38},"lrMain":{"0":"mirai","1":"negai","2":"yuuzu"},"lrSub":{"0":"anaaki","1":"kakegae","2":"nitamono"},"lrOn":{"mirai:c:taken":false},"lrManual":{"baseAtk":null,"baseHp":null,"elem":null,"elemEl":"光"},"chars":{"noya":{"skillLv":{"basic":9},"trustLv":20,"emb":{"0":{"slots":{"0":{"k":"elemDmg","cat":"ダメージ・貫通"},"1":{"k":"derivedCritRate","q":"gold","cat":"従者・派生"},"2":{"k":"critRate","q":"rainbow","cat":"会心"},"3":{"k":"resPen","q":"rainbow","cat":"ダメージ・貫通"}}},"1":{"slots":{"0":{"k":"hpPct","cat":"ステータス"},"1":{"k":"lvMain","q":"rainbow3","cat":"スキル・素質"},"2":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"},"3":{"k":"spMain","q":"rainbow","cat":"その他"}}},"2":{"slots":{"0":{"k":"potCommon","q":"rainbow3","cat":"スキル・素質","t":"Argent Mirage: Legion's End"},"1":{"k":"baseAtk","cat":"ステータス"},"2":{"k":"ultDmg","q":"rainbow","cat":"ダメージ・貫通"},"3":{"k":"hpPct","q":"rainbow","cat":"ステータス"}}}},"add":{"basic":0.12,"skill":0.12,"hpPct":0.15},"pots2":{"Lucent_Blitz":1,"Dawnflare":1,"Prism_Warp":6,"Resolve__Blitz":6,"Astral_Brilliance":6,"Argent_Mirage__Legion_s_End":6,"Veteran_s_Grit":6,"Lucent_Tide":6,"Guiding_Star":6,"Empyrean_Starfall__Devil_s_End":0}},"firefly":{"skillLv":{"basic":1,"main":3,"support":8,"ult":9},"trustLv":10,"emb":{"0":{"slots":{"0":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"},"1":{"k":"spSupport","cat":"その他"},"2":{"k":"atkPct","cat":"ステータス"},"3":{"k":"resPen","q":"rainbow","cat":"ダメージ・貫通"}}},"1":{"slots":{"0":{"k":"lvMain","q":"rainbow3","cat":"スキル・素質"},"1":{"k":"hpPct","q":"rainbow","cat":"ステータス"},"2":{"k":"spSupport","cat":"その他"},"3":{"k":"ultDmg","q":"rainbow","cat":"ダメージ・貫通"}}},"2":{"slots":{"0":{"k":"potSupport","q":"rainbow2","cat":"スキル・素質","t":"Stellar Crash"},"1":{"k":"potCommon","q":"rainbow3","cat":"スキル・素質","t":"Persistent Warmth"},"2":{"k":"servantDmg","q":"rainbow","cat":"従者・派生"},"3":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"}}}},"pots2":{"Domain_of_Purity":6,"Stellar_Crash":6,"Radiance_Blade__Twin_Shadow":1,"Radiance_Blade__Firefly":1,"Lightforged_Blade":2,"Persistent_Warmth":4,"Sanctuary_of_Light":1},"pstk":{"Stellar_Crash":0}},"tilia":{"skillLv":{"basic":2,"main":4,"support":9,"ult":3},"emb":{"0":{"slots":{"0":{"k":"spSupport","q":"gold","cat":"その他"}}},"1":{"slots":{"0":{"k":"spSupport","q":"rainbow","cat":"その他"}}},"2":{"slots":{"0":{"k":"potSupport","q":"gold","cat":"スキル・素質","t":"Blinding Beam"}}}},"pots2":{"Holy_Inscription":1,"Renewed_Spectrum":1,"Enemy_Counter":6,"Blinding_Beam":6,"Revealed_Flaw":6,"Knight_s_Seal":1,"Banner_of_Glory":2,"Trick_Boost":0},"pon":{"Revealed_Flaw":false,"Holy_Inscription":false}}},"skOn":{"noya:ult":true}};
  S.presetHC = () => S.applyDiff(defState(), clone(HC_PATCH));
  let G = defState();
  let firstVisit = true;
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.team) { G = merge(defState(), s); firstVisit = false; } } catch (e) { /* 保存なしでも動く */ }
  let shareMsg = "";
  const DV = { preset: "", code: "", url: "" }, DM = {};   // ポップアップの各欄の値とメッセージ（{t, ng}）
  const V = { panel: firstVisit ? "load" : "overview", tilesFor: "main", drill: null, pick: null, lrPick: null, lrEl: {}, mChar: "main", m: "in" };
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
  const helpTxt = (id, short, long, style) => { const open = !!(V.help || {})[id];
    return `<div class="muted help"${style ? ` style="${style}"` : ""}>${short}${long ? ` <button type="button" class="help-btn" data-act="help:${id}" aria-expanded="${open}">？ 詳しく</button>${open ? `<div class="help-body">${long}</div>` : ""}` : ""}</div>`; };
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
  // 読み込みなどのお知らせは、見出しのすぐ下にふわっと出して、数秒で消す（見出しの中に出すと、スマホでは切れるため）
  let toastTimer = null;
  function showToast() {
    if (!shareMsg) return;
    const t = $("toast"); if (!t) return;
    t.textContent = shareMsg; t.hidden = false; t.classList.add("on");
    shareMsg = "";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.remove("on"); setTimeout(() => { t.hidden = true; }, 300); }, 4000);
  }
  function renderTop() {
    let builds = {};
    try { builds = JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { builds = {}; }
    const names = Object.keys(builds);
    showToast();
    $("topbar").innerHTML = `
      <button class="btn-add" data-act="log-open">更新履歴</button><button class="btn-add" data-act="rp-open">報告</button>`;
    $("unitbar").innerHTML = [["raw", "そのまま"], ["k", "K表記"], ["m", "M表記"]].map(([v, l]) => `<button type="button" class="${dmgUnit === v ? "on" : ""}" aria-pressed="${dmgUnit === v}" data-act="unit:${v}">${l}</button>`).join("");
    // 今の値を覚えて、そこからの増減をタイルに出す
    // 比較: 「今の値を記憶」の1つだけ。記憶した値からの増減は、結果の「比較」の列に出る（一度記憶したら、列は出したまま）
    $("cmpbar").innerHTML = `<button class="btn-add" data-act="memo" title="${memo ? "今の値で記憶し直します。結果の「比較」の列は、記憶した値からの増減です" : "今の値を記憶します。このあと入力を変えると、結果の「比較」の列に増減が出ます"}">今の値を記憶</button>`;
  }

  // ---- 共通の倍率（種類を問わない倍率）。手順のタブの下に1行で出し、スクロールしても上に残す ----
  function renderTiles() {
    const id = G.team[V.tilesFor] || G.team.main;
    const o = R.team[id];
    const c = o.c, st = o.st, en = G.enemyObj;
    const ag = o.ef.ag || {}, defX = (ag.defDown || 0) + (ag.defPen || 0);   // 防御力低下・全部の攻撃の防御貫通（特定の攻撃だけの貫通は、内訳の各ヒットに入る）
    const dd = E.enemyD(en, c.el, st.pen, G, defX);
    const ref = c.ref === "hp" ? st.hp : st.atk;
    const W = 1 + st.elemAdd + o.ef.W;
    const taken = o.ef.taken * (G.other.taken || 1) * (G.other.mult || 1) * dd.extra;
    const who = SLOTS.map(([k, l]) => `<button type="button" class="${V.tilesFor === k ? "on" : ""}" aria-pressed="${V.tilesFor === k}" data-act="tf:${k}" title="${esc(chOf(G.team[k]).jp)}">${l}</button>`).join("");
    // 1行だけの細い帯。補足（攻撃力・貫通など）は、マウスを重ねると出す
    const d3 = n => (n == null || !isFinite(n)) ? "—" : n.toFixed(3);   // 倍率は小数3桁にそろえる（1.000 など）
    const t = (label, val, sub) => `<div class="mi" title="${esc(label + "：" + sub)}"><span>${label.replace(/^ダメージ/, "").replace(/倍率$/, "")}</span><b>${val}</b></div>`;
    $("mline").innerHTML = `<div class="ml-h"><span class="unitbar ml-who" role="group" aria-label="共通の倍率を出す巡遊者">${who}</span></div>
      <div class="ml-items" role="group" aria-label="共通の倍率">${t("ダメージ基礎値", fmt(ref), c.ref === "hp" ? "最大HP" : "攻撃力")}${t("属性倍率", d3(W), c.el + "属性ダメージ " + pct(st.elemAdd + o.ef.W))}${t("耐性倍率", d3(dd.res * dd.weak), `耐性×${f3(dd.res)}` + (dd.weak !== 1 ? ` 弱点×${dd.weak}` : "") + `（貫通${fmt(st.pen)}${st.pen > 250 ? "・適用は250まで" : ""}）`)}${t("防御倍率", d3(dd.def), "敵の防御" + (defX ? `（防御力低下・防御貫通 ${fmt(defX)}）` : ""))}${t("その他倍率", d3(taken), "被ダメージ・実測合わせ等")}${recTile()}</div>`;
  }
  // 記録レベル: 「その他」の右に出す。マウスを重ねるか、押すと詳しい中身（スコア・次のLvまで・ボーナス）を出す
  function recTile() {
    const auto = G.recordAuto !== false, sc = S.recordScore ? S.recordScore(G) : null;
    const next = sc != null ? (RECORD_LEVELS || []).find(x => x[1] > sc) : null, rb = E.recordBonus(G.recordLv);
    const pop = `<div class="recpop" role="dialog" aria-label="記録レベル">
      <b>記録レベル Lv${G.recordLv}</b><span class="muted">（${auto ? "ビルドから自動" : "手で選んだ値"}）</span>
      ${sc != null ? `<div>記録のスコア <b>${fmt(sc)}</b>${next ? `　次の Lv${next[0]} まで あと ${fmt(next[1] - sc)}` : ""}</div>` : ""}
      <div>戦闘中に全員の基礎攻撃力 +${fmt(rb.atk)}・基礎HP +${fmt(rb.hp)}</div>
      <div class="muted">スコア: コア素質1つ 180・通常素質のLv1つ 60・音符1個 15（ロスレコの初期の音符も数える）・アシスト効果のLv1つ 120（徽章の＋は数えない）。手で選ぶときは「補正」の画面の「記録レベル」で。</div></div>`;
    return `<button type="button" class="mi mi-rec${V.recPop ? " open" : ""}" data-act="recpop" aria-expanded="${!!V.recPop}"><span>記録レベル</span><b>${G.recordLv}</b>${pop}</button>`;
  }

  // ---- 選択ボタン ----
  function renderSelectors() {
    // 徽章・素質などの巡遊者ごとの画面は「巡遊者」のタブの中
    const top = /^(base|emb|heart|pot|add):/.test(V.panel) ? "overview" : V.panel;
    const b = (key, label, en, n) => `<button class="tab" role="tab" aria-selected="${top === key}" data-act="panel:${key}"><span class="te">${en}</span><span>${n ? `<span class="tn">${n}</span>` : ""}${label}</span></button>`;
    // 入力する順に番号を付けて並べる。ゲームの画面と数値を合わせるための画面（直接入力・補正）は、右端に「実測合わせ」としてまとめる
    $("selectors").innerHTML = b("load", "読込", "LOAD", 1) + b("overview", "巡遊者", "TREKKERS", 2) + b("lr", "ロスレコ", "RECORD", 3) + b("gimmick", "エネミー", "ENEMY", 4) + b("score", "ビルド確認", "CHECK", 5) + b("share", "共有・保存", "SHARE", 6)
      + `<span class="tab-sep" aria-hidden="true"></span>` + b("direct", "直接入力", "DIRECT") + b("adjust", "補正", "ADJUST");
    // スマホ: タブの列は横にスクロールするので、選んだタブを真ん中より少し左に寄せる（右に続きのタブが見えるように）
    const row = $("selectors"), on = row.querySelector('[aria-selected="true"]');
    if (on && row.scrollWidth > row.clientWidth) {
      const x = Math.max(0, row.scrollLeft + on.getBoundingClientRect().left - row.getBoundingClientRect().left - row.clientWidth * 0.3);
      if (V.lastTop !== top) { row.scrollTo({ left: x, behavior: V.lastTop == null ? "auto" : "smooth" }); V.lastTop = top; } else row.scrollLeft = x;
    }
  }
  // スマホ: 巡遊者を1人ずつ出すための切り替え（PCでは出さない）
  const mChar = () => `<div class="m-only mchar">${SLOTS.map(([k, l]) => `<button class="tab" aria-selected="${V.mChar === k}" data-act="mchar:${k}">${l}</button>`).join("")}</div>`;
  const mHide = k => V.mChar === k ? "" : " m-hide";
  // スマホ: 下のタブ（入力・結果・内訳）と、上の結果の帯
  const big = n => n >= 1e8 ? (Math.round(n / 1e6) / 100) + "億" : n >= 1e4 ? Math.round(n / 1e4).toLocaleString("ja-JP") + "万" : fmt(n);
  function renderMobile(items) {
    const mb = (k, l, en) => `<button class="tab" aria-selected="${V.m === k}" data-act="m:${k}"><span class="te">${en}</span><span>${l}</span></button>`;
    if (V.m === "drill") V.m = "res";   // 内訳は結果の中で開くので、タブは入力と結果の2つ
    $("mbar").innerHTML = mb("in", "入力", "INPUT") + mb("res", "結果", "RESULT");
    document.body.className = "m-" + V.m;
  }

  // ---- ステータスの表（ステータス画面／戦闘中／防衛戦に入った直後）----
  // 戦闘中 = 今の敵で、素質・スキル・ロスレコなどの効果（重複数は入力の値）をすべて足した値
  function cardsHtml(id) {
    const c = chOf(id), cs = G.chars[id];
    const o = E.outsideStats(c, cs);
    const d = RD.team[id].st;
    const v = E.battleView(R.team[id], G);
    const row = (k, a, m) => `<tr><td>${k}</td><td style="text-align:right">${a}</td><td class="bt" style="text-align:right">${m}</td></tr>`;
    // 会心は共通の値だけを出し、種類ごと・特定の攻撃だけの上乗せは「その他の会心率 ▶」を開くと見える
    const exName = x => (x.grp ? (S.SKILL_NAME[x.grp] || x.grp) + "の中の" : "") + (x.tags ? x.tags.map(t => S.TAGJ[t] || t).join("・") + (x.ht ? "（" + S.HTJ[x.ht] + "）" : "") : (S.HTJ[x.ht] || x.ht));
    // その他の会心: 押すと、種類ごと・特定の攻撃ごとの行が開く（項目名の列に上乗せ、戦闘中の列にその合計）
    const exRow = (lab, x) => {
      if (!x.extra.length) return "";
      const key = id + ":" + lab, open = !!(V.cc || {})[key];
      const head = `<tr class="ccx-h" data-act="cc:${esc(key)}"><td colspan="3">${open ? "▼" : "▶"} その他の${lab}</td></tr>`;
      if (!open) return head;
      return head + x.extra.map(e => {
        const ty = (e.tags || e.grp) && e.ht ? x.extra.filter(y => !y.tags && !y.grp && y.ht === e.ht).reduce((t, y) => t + y.v, 0) : 0, tot = x.common + ty + e.v;
        return `<tr class="ccx-r"><td>${esc(exName(e))} +${pct(e.v)}</td><td></td><td class="bt">${pct(lab === "会心率" ? Math.min(tot, 1) : tot)}</td></tr>`;
      }).join("");
    };
    return `<div class="box"><table class="stt"><tr><th></th><th title="ゲームのステータス画面の値">ステ画面</th><th class="bt" title="今の敵で、素質・スキル・ロスレコの効果を足した値（直接入力した欄は、その値）">戦闘中</th></tr>
      ${row("最大HP", fmt(o.hp), fmt(v.hp), fmt(d.hp))}${row("攻撃力", fmt(o.atk), fmt(v.atk), fmt(d.atk))}
      ${row("会心率（共通）", pct(o.critRate), pct(v.critRate.common), pct(d.critRate))}${exRow("会心率", v.critRate)}${row("会心ダメージ（共通）", pct(o.critDmg), pct(v.critDmg.common), pct(d.critDmg))}${exRow("会心ダメージ", v.critDmg)}
      ${row(c.el + "属性ダメージ", pct(o.elemAdd), pct(v.elem), pct(d.elemAdd))}
      ${row("通常攻撃ダメージ", "—", pct(v.basic), pct(d.basicAdd))}${row("スキルダメージ", "—", pct(v.skill), pct(d.skillAdd))}
      ${row("必殺技ダメージ", "—", pct(v.ult), pct(d.ultAdd))}${row("印ダメージ", "—", pct(v.mark), pct(d.markAdd))}
      ${row("属性耐性貫通", fmt(o.pen), fmt(v.pen), fmt(d.pen))}${row("敵の被ダメージ", "—", "×" + f3(v.taken), "—")}</table></div>`;
  }


  // ---- 表示エリア: 巡遊者 ----
  // 数値を −／＋ で変える入力（クリックやタッチで押しやすく）。真ん中の欄は、直接打ち込むこともできる
  function stepper(path, min, max, def, size) {
    const v = getPath(path), cur = v == null || v === "" ? def : +v;
    const b = (d, ch, dis) => `<button type="button" class="stp-b" data-act="stp|${d}|${min}|${max}|${def}|${path}"${dis ? " disabled" : ""} aria-label="${d > 0 ? "1つ上げる" : "1つ下げる"}">${ch}</button>`;
    return `<span class="stp${size ? " " + size : ""}">${b(-1, "−", cur <= min)}<input type="number" data-p="${path}" data-t="n" min="${min}" max="${max}" step="1" value="${cur}">${b(1, "＋", cur >= max)}</span>`;
  }
  // 心相: 凸で出し、★5は10段階（1凸）、★4は5段階（0.5凸）ずつ動かす（2026-11-22 ユーザー）。中では段階（0〜50）で持つ（2026-11-22 ユーザー。前は心相のタブで凸だけ選べた）
  function talentRow(id) {
    const c = chOf(id), cs = G.chars[id], path = `chars.${id}.talent`, st = TK(c.en).rarity >= 5 ? 10 : 5, cur = +cs.talent || 0;
    const b = (d, ch, dis) => `<button type="button" class="stp-b" data-act="stp|${d}|0|50|0|${path}"${dis ? " disabled" : ""} aria-label="${d > 0 ? "上げる" : "下げる"}">${ch}</button>`;
    return `<div class="stp-row"><span class="stp-lab">心相</span><span class="stp">${b(-st, "−", cur <= 0)}<input type="number" data-p="${path}" data-t="x10" min="0" max="5" step="${st / 10}" value="${cur / 10}">${b(st, "＋", cur >= 50)}</span><span class="muted stp-note">凸</span></div>`;
  }
  // スキルLv（徽章の「＋」があるときは、横に → 最終的なLv）
  function lvRow(id, key, label, note) {
    const bonus = emx(id).lv[key];
    // 徽章でLvが上がる分は、素質の画面と同じ「徽章+1」の札で出す（2026-11-22 ユーザー）
    return `<div class="stp-row"><span class="stp-lab">${label}</span>${stepper(`chars.${id}.skillLv.${key}`, 1, 10, 10)}${bonus ? `<span class="pz-lvt" title="徽章でLv${(G.chars[id].skillLv[key] || 10) + bonus}">徽章+${bonus}</span>` : ""}${note ? `<span class="muted stp-note">${note}</span>` : ""}</div>`;
  }
  // 心相・徽章・素質・その他のボタンに出す、今の状態
  function charSummary(k) {
    const id = G.team[k], cs = G.chars[id];
    const emb = (cs.emb || []).filter((e, i) => cs.embOn[i] && e.slots.some(sl => sl.k)).length;
    const pc = potCount(potItems(k));
    const add = Object.keys(cs.add || {}).filter(x => +cs.add[x]).length;
    const hn = Math.floor((cs.talent || 0) / 10), hReg = !!(S.HEART_SPEC || {})[id];   // 心相の戦闘中の効果が未登録なら、凸があっても効果が入っていないことを出す
    return { heart: hn && !hReg ? `${hn}凸（効果は未登録）` : `${hn}凸`, emb: emb ? `${emb}枚` : "なし", pot: pc.core || pc.normal ? `コア${pc.core}・通常${pc.normal}` : "なし", add: add ? `加算 ${add}件` : "なし" };
  }
  function renderOverview() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}`, sm = charSummary(k);
      const nb = (pn, label, v) => `<button class="obtn ch-btn" data-act="panel:${pn}:${k}"><b>${label}</b><span>${v}</span></button>`;
      return `<div class="chcol${mHide(k)}" style="--elc:${EL_COLOR[c.el] || "#4B5082"}"><h3 class="ch-h">${l}：${esc(c.jp)}${c.auto ? "*" : ""}</h3>
        ${fld("属性", `<select data-chel="${k}">${EL_ORDER.filter(el => chOfEl(el).length).map(el => `<option${el === c.el ? " selected" : ""}>${el}</option>`).join("")}</select>`)}
        ${fld("巡遊者", inp(`team.${k}`, { sel: chOfEl(c.el).map(x => [x.id, x.jp + (x.auto ? "*" : "")]), str: true }))}
        <div class="stp-list">${lvRow(id, "basic", "通常攻撃")}${lvRow(id, "main", "主力スキル")}${lvRow(id, "support", "支援スキル")}${lvRow(id, "ult", "必殺技", "11〜は推定")}
          <div class="stp-row"><span class="stp-lab">信頼ボーナス</span>${stepper(`${p}.trustLv`, 0, 99, 0)}</div></div>
        <div class="ch-btns">${nb("heart", "心相", sm.heart)}${nb("emb", "徽章", sm.emb)}${nb("pot", "素質", sm.pot)}${nb("add", "その他", sm.add)}</div>
        <div class="ch-clr">${V.clrSure === id ? `<span class="muted">${esc(c.jp)}の入力を初期値に戻します</span><button class="btn-add" data-act="chclr-no">やめる</button><button class="btn-add pri" data-act="chclr-ok:${id}">クリアする</button>` : `<button class="btn-add" data-act="chclr:${id}" title="スキルLv・信頼・心相・徽章・素質・その他・直接入力を、初期値に戻します">この巡遊者の入力をクリア</button>`}</div>
        ${cardsHtml(id)}
      </div>`;
    };
    return `${mChar()}<div class="cols3">${SLOTS.map(col).join("")}</div>
      ${helpTxt("overview", "キャラレベルは90で計算。「*」は未確認のデータです。", "名前の後ろの「*」は未確認（技のヒットや素質を、Wikiの説明文から自動で作ったもの）です。ステータスがゲームの画面と合わないときは、「実測合わせ：直接入力」に画面の値を入れると、その欄だけ上書きして計算します。")}`;
  }
  // 「基本」: 巡遊者1人の 属性・巡遊者・スキルLv・信頼と、ステータスの表（巡遊者の画面の1列分を、左右に並べたもの）
  function renderBase() {
    // 3人を横に並べて、まとめて入れる（2026-11-22 ユーザー）。心相・徽章などは上の巡遊者タブで1人ずつ
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}`;
      return `<div class="b3-col${(V.lastSlot || "main") === k ? "" : " m-hide"}">
        ${fld("属性", `<select data-chel="${k}">${EL_ORDER.filter(el => chOfEl(el).length).map(el => `<option${el === c.el ? " selected" : ""}>${el}</option>`).join("")}</select>`)}
        ${fld("巡遊者", inp(`team.${k}`, { sel: chOfEl(c.el).map(x => [x.id, x.jp + (x.auto ? "*" : "")]), str: true }))}
        <div class="stp-list">${lvRow(id, "basic", "通常攻撃")}${lvRow(id, "main", "主力スキル")}${lvRow(id, "support", "支援スキル")}${lvRow(id, "ult", "必殺技")}
          <div class="stp-row"><span class="stp-lab">信頼ボーナス</span>${stepper(`${p}.trustLv`, 0, 99, 0)}</div>${talentRow(id)}</div>
        <div class="ch-clr b3-clr">${V.clrSure === id ? `<span class="muted">${esc(c.jp)}の入力を初期値に戻します</span><button class="btn-add" data-act="chclr-no">やめる</button><button class="btn-add pri" data-act="chclr-ok:${id}">クリアする</button>` : `<button class="btn-add clr-link" data-act="chclr:${id}" title="スキルLv・信頼・心相・徽章・素質・その他・直接入力を、初期値に戻します">${esc(c.jp)}の入力をクリア</button>`}</div>
        ${cardsHtml(id)}
      </div>`;
    };
    return `<div class="base3">${SLOTS.map(col).join("")}</div>
      <div class="base-foot"><div>${helpTxt("overview", "キャラレベルは90で計算。必殺技のLv11〜は推定です。「*」は未確認のデータです。", "名前の後ろの「*」は未確認（技のヒットや素質を、Wikiの説明文から自動で作ったもの）です。ステータスがゲームの画面と合わないときは、「実測合わせ：直接入力」に画面の値を入れると、その欄だけ上書きして計算します。")}</div></div>`;
  }
  // ---- 巡遊者（直接入力）----
  function renderDirect() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}.manual`, v = E.battleView(R.team[id], G);
      const f = (label, key, ph) => fld(label, inp(`${p}.${key}`, { w: 110, ph: ph }));
      const p1 = x => Math.round(x * 1000) / 10;
      return `<div class="chcol dir-col${mHide(k)}"><h3>${l}：${esc(c.jp)}</h3>
        ${f("最大HP", "hp", fmt(v.hp))}${f("攻撃力", "atk", fmt(v.atk))}
        ${f("会心率（共通）(%)", "critRate", p1(v.critRate.common))}${f("会心ダメージ（共通）(%)", "critDmg", p1(v.critDmg.common))}
        ${f(c.el + "属性ダメージ(%)", "elem", p1(v.elem))}${f("通常攻撃ダメージ(%)", "basic", p1(v.basic))}
        ${f("スキルダメージ(%)", "skill", p1(v.skill))}${f("必殺技ダメージ(%)", "ult", p1(v.ult))}
        ${f("印ダメージ(%)", "mark", p1(v.mark))}${f("属性耐性貫通", "pen", fmt(v.pen))}
        ${cardsHtml(id)}
      </div>`;
    };
    return `<div class="wide"><label class="check" style="font-weight:700"><input type="checkbox" data-p="directPriority" data-t="b"${G.directPriority !== false ? " checked" : ""}>入力されている欄は直接入力を優先する</label>
      ${helpTxt("direct", "入れた欄は、戦闘中の最終の値として計算します。空欄は計算のまま。", "薄い数字は今の戦闘中の計算値です。入れた欄には、素質・ロスレコ・心相などの戦闘中の効果を足しません（長剣・光刃など、攻撃を限った効果だけは足します）。属性ダメージなどは 100% を除いた加算分（+282% なら 282）で入れます。会心率・会心ダメージは、全部の攻撃に乗る共通の値を入れてください（種類ごと・特定の攻撃だけの上乗せは、その上に足します）。")}
      ${mChar()}<div class="cols3">${SLOTS.map(col).join("")}</div></div>`;
  }
  function renderAdd(k) {
    const id = G.team[k], c = chOf(id), p = `chars.${id}.add`;
    // 割合の欄は「12」で12%と入れる（保存は 0.12 のまま。表示と入力のときだけ100倍）
    const pin = key => { const v = getPath(`${p}.${key}`); return `<input type="number" data-p="${p}.${key}" data-t="pct" step="any" value="${v == null || v === "" ? "" : Math.round(+v * 1e6) / 1e4}">`; };
    return `<div class="wide">
      <div class="box">${skillSection(k)}</div>
      ${heartFxBox(k)}
      <div class="box"><h3 style="margin:0 0 4px;font-size:14px">加算<span class="muted" style="font-weight:400;font-size:12px;margin-left:8px">素質や心相などの効果で、この画面にまだ無いものを入れる場所</span></h3>
      ${addGrid([
        ["基礎ステータス（掛け算の前に足す）", [["基礎攻撃力", inp(`${p}.atkFlat`, { w: 90 }), ""], ["基礎HP", inp(`${p}.hpFlat`, { w: 90 }), ""], ["攻撃力", pin("atkPct"), "%"], ["最大HP", pin("hpPct"), "%"]]],
        ["ダメージ", [[c.el + "属性ダメージ", pin("elem"), "%"], ["通常攻撃ダメージ", pin("basic"), "%"], ["スキルダメージ", pin("skill"), "%"], ["必殺技ダメージ", pin("ult"), "%"], ["印ダメージ", pin("mark"), "%"]]],
        ["会心・貫通", [["会心率", pin("critRate"), "%"], ["会心ダメージ", pin("critDmg"), "%"], ["属性耐性貫通", inp(`${p}.pen`, { w: 90 }), ""]]],
      ])}
      <p class="muted" style="margin:6px 0 0">「%」の欄は「12」で 12% です。基礎攻撃力・基礎HP・貫通は、そのままの数値です。</p></div></div>`;
  }
  // 加算の欄: 種類ごとの列に、「名前・入力・単位」を1行ずつそろえて並べる（2026-11-22 ユーザー。前は欄が横に流れて見にくかった）
  function addGrid(groups) {
    return `<div class="add-g">${groups.map(([title, rows]) => `<div class="add-col"><div class="add-t">${title}</div>${rows.map(([label, input, unit]) =>
      `<label class="add-r"><span>${label}</span>${input.replace(/style="width:\d+px"/, "").replace(/ style="width:\d+px"/, "")}<i>${unit}</i></label>`).join("")}</div>`).join("")}</div>`;
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
      if (fx.k === "cnt") return `<div class="pot${usable ? " core" : ""}"><b>${S.SKILL_NAME[fx.skill]}</b>${usable ? "" : '<span class="tag-ng">この枠では使えません</span>'}
        <div>${esc(fx.txt())}</div><div class="lv">当たる数 ${stepper(`skN.${key}`, fx.min, fx.max, fx.def)}<span class="muted">/${fx.max}（既定 ${fx.def}）</span></div></div>`;
      return `<div class="pot${usable ? " core" : ""}"><b>${S.SKILL_NAME[fx.skill]}</b>${usable ? "" : '<span class="tag-ng">この枠では使えません</span>'}
        <div>${esc(fx.txt(v))}</div><div class="lv">反映 <input type="checkbox" data-p="skOn.${key}" data-t="b"${on ? " checked" : ""}${usable ? "" : " disabled"}></div></div>`;
    }).join("");
    if (id === "willow") {
      const fv = Math.round(E.skillVal(c, 1, 1, (cs.skillLv.main || 10) + (lvB.main || 0)) * 10) / 10, uv = Math.round(E.skillVal(c, 3, 2, (cs.skillLv.ult || 10) + (lvB.ult || 0)) * 10) / 10;
      body += `<div class="pot core"><b>主力スキル</b><div>バブルフロッグがダメージを与えると、チームの攻撃力 +${fv}%（6秒・最大5重）</div><div class="lv">重複数 ${inp("willowFrog", { min: 0, max: 5, step: 1, w: 60 })}<span class="muted">/5（ウィロー以外の味方に反映）</span></div></div>
        <div class="pot core"><b>必殺技</b><div>チームの攻撃力 +${uv}%（20秒・最大5重）</div><div class="lv">重複数 ${inp("willowUlt", { min: 0, max: 5, step: 1, w: 60 })}<span class="muted">/5（ウィロー以外の味方に反映）</span></div></div>`;
    }
    if (!body) body = '<span class="muted">この巡遊者の、火力に関わるスキルのバフ効果は、ありません（または未登録です）。</span>';
    return `<h3 style="margin:0 0 6px;font-size:14px">スキルのバフ効果</h3><p class="muted">スキルLv: ${lvs}（スキルLvは「巡遊者」の欄で変えます）</p>
      <div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">${body}</div>
      ${helpTxt("skillfx", "主力は主力スキル・必殺技、支援は支援スキルのバフだけ使えます。", "値はスキルLvで変わります。ここに無いバフは、下の加算に入れてください。")}`;
  }

  // ---- 徽章 ----
  // 項目の区分（左から 区分 → 項目 → 値 の順にドロップダウンで選ぶ）
  const { EMB_CATS, catOfKey } = S.contrib;   // 徽章の項目の区分（比較ページと共通）
  // 品質の候補（値がある品質だけ）・値の表記は sim_contrib.js（比較ページと共通）
  const { optOf, isLv, qualOf, qVal, valTxt } = S.contrib;
  // 素質の対象の候補（英語名の一覧）
  const potTargets = (id, key) => S.contrib.potTargets(G, id, key);

  function slotLabel(id, sl) {
    if (!sl.k) return "（未設定）";
    const o = optOf(sl.k);
    const q = (EMBLEM_QUALITY.find(x => x[0] === sl.q) || [])[1] || "";
    const v = qVal(o, sl.q);
    return `${o.label} ${q}${v != null ? " " + valTxt(o, v) : ""}${sl.t ? `（${JA(sl.t, id)}）` : ""}`;
  }
  // ---- 徽章一覧のスクリーンショットから読み込む（sim_ocr.js）----
  const OCR_KINDS = ["triangle", "circle", "star"], OCR_KJ = { triangle: "初級", circle: "中級", star: "上級" };
  function ocrPots(id) {
    const out = [];
    ["potMain", "potSupport", "potCommon"].forEach(key => potTargets(id, key).forEach(x => { if (!out.some(y => y[1] === x.en)) out.push([JA(x.en, id), x.en, key]); }));
    return out;
  }
  function ocrBox(id) {
    const st = V.ocr && V.ocr.id === id ? V.ocr : {};
    let res = "";
    if (st.rows) {
      const n = st.rows.length;
      const line = (r, i) => {
        const o = r.k ? optOf(r.k) : null, v = o && r.q ? qVal(o, r.q) : null;
        return `<div>${OCR_KJ[OCR_KINDS[Math.floor(i / 4)]] || "？"} ${i % 4 + 1}：${r.nopot ? `<s>${esc(r.label)}</s>（該当無し）` : esc(r.label) + (v != null ? " " + valTxt(o, v) : "（値が読めませんでした）") + (r.part ? "（部分一致）" : "")}${r.warn && !r.nopot ? ' <span class="tag-ng">要確認</span>' : ""}</div>`;
      };
      // 初級・中級・上級を1列ずつ（4行ずつ）
      const rs = st.rows.slice(0, 12);
      res = `<div class="ocr-res">${[0, 1, 2].map(b => `<div>${rs.slice(b * 4, b * 4 + 4).map((r, j) => line(r, b * 4 + j)).join("")}</div>`).join("")}</div>
        ${n < 12 ? `<p class="msg ng">最後の ${12 - n} 行が読めていません（一番下が切れた画面かもしれません）。入れたあとで、空いた枠を手で選んでください。</p>` : ""}
        ${n > 12 ? `<p class="msg ng">13行以上読めたので、上から12行だけ使います。</p>` : ""}
        ${st.rows.some(r => r.nopot) ? `<p class="msg ng">素質のレベル上昇が、この巡遊者の素質に見つかりませんでした。巡遊者が異なるか、読み取りがうまく行かなかった可能性があります。読めなかった枠は空白になりますので、手動で選択してください。</p>` : ""}
        <div class="foot" style="justify-content:flex-start"><button class="btn-add pri" data-act="ocr-apply:${id}">この内容で入れる</button><button class="btn-add" data-act="ocr-cancel">やめる</button></div>`;
    }
    return `<div class="box ocr-box"><b>スクリーンショットから読み込む</b> <button type="button" class="hint-tip" data-act="hint" aria-haspopup="dialog">使い方<span class="hint-pop" hidden>「徽章一覧」は、一番下までスクロールしてから撮ってください。<br>この画面で Ctrl+V しても読み込めます。<br>PCの場合は「Alt＋PrintScreen」で、いま選んでいるウィンドウのスクリーンショットを撮れます。または「Windows＋Shift＋S」で、画面の一部だけを撮れます。<br>画像はお使いのブラウザの中で処理され、どこにも送信されません。</span></button>
      <p class="muted" style="margin:4px 0">「徽章一覧」の画像を、クリップボードから読み込むか、ファイルで選んでください。</p>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn-add pri" data-act="ocr-clip:${id}"${st.busy ? " disabled" : ""}>クリップボードから読み込む</button><label class="btn-add ocr-pick${st.busy ? " dis" : ""}">画像ファイルを選ぶ<input type="file" accept="image/*" id="ocr-file" data-id="${id}"${st.busy ? " disabled" : ""}></label></div>
      ${st.msg ? `<p class="msg${st.ng ? " ng" : ""}">${esc(st.msg)}</p>` : ""}${res}</div>`;
  }
  function runOcr(id, file) {
    if (!file || !S.ocrEmblem) return;
    V.ocr = { id, busy: true, msg: "読み取りの準備をしています…" }; renderAll();
    S.ocrEmblem(file, ocrPots(id), m => { if (V.ocr && V.ocr.id === id) { V.ocr.msg = m; renderAll(); } })
      .then(rows => { V.ocr = { id, rows, msg: rows.length ? "読み取りました。内容を確かめて「この内容で入れる」を押してください。" : "徽章の行が見つかりませんでした。徽章一覧の画面か確かめてください。", ng: !rows.length }; renderAll(); })
      .catch(e => { V.ocr = { id, msg: e.message || "読み取れませんでした", ng: true }; renderAll(); });
  }
  // ---- ロスレコスキル画面のスクリーンショットから、メインのロスレコと音符を読み込む（sim_ocr.js の S.ocrRecord）----
  // 画面の音符は合計（サブのロスレコの初期の音符も入った数。探索中に減ることもあり、初期より少ないこともある）。そのまま合計として入れる
  function recOcrBox() {
    const st = V.rocr || {};
    let res = "";
    if (st.res) {
      const { notes, lrs, warn } = st.res;
      const lrTxt = lrs.map((x, i) => { const r = x.id && LOSTRECORDS.find(y => y.id === x.id);
        return `<div>メイン${i + 1}：${r ? esc(r.name) : `<span class="tag-ng">読めませんでした</span>（${esc(x.read || "文字なし")}。この枠は入れません。下の枠で選んでください）`}${x.other ? ' <span class="tag-ng">要確認</span>' : ""}</div>`; }).join("");
      const ntTxt = notes.map(x => { const nm = x.note ? x.note.replace("の音符", "") : "？";
        return `<span style="margin-right:10px">${esc(nm)} ${x.n}${x.elem ? ' <span class="tag-ng">色で判定</span>' : ""}</span>`; }).join("");
      res = `<div class="ocr-res" style="grid-template-columns:1fr"><div>${lrTxt}</div><div>音符：${ntTxt}</div></div>
        ${warn.map(t => `<p class="msg ng">${esc(t)}</p>`).join("")}

        <div class="foot" style="justify-content:flex-start"><button class="btn-add pri" data-act="rocr-apply">この内容で入れる</button><button class="btn-add" data-act="rocr-cancel">やめる</button></div>`;
    }
    return `<div class="box ocr-box"><b>ロスレコスキル画面のスクリーンショットから読み込む</b> <button type="button" class="hint-tip" data-act="hint" aria-haspopup="dialog">使い方<span class="hint-pop" hidden>メインのロスレコ（アシスト効果の名前から）と、音符の数を読みます。<br>音符効果とアシスト効果が全部映るように撮ってください。画面の大きさや切り取り方は問いません。<br>画面の音符は合計（サブのロスレコの初期の音符を含む）なので、いま選んでいるサブのロスレコの初期の分を引いて「獲得」に入れます。サブのロスレコは画面に出ないので、先に選んでおいてください。<br>属性の音符は、アイコンの色で見分けています。<br>この画面で Ctrl+V しても読み込めます。<br>PCの場合は「Alt＋PrintScreen」で、いま選んでいるウィンドウのスクリーンショットを撮れます。または「Windows＋Shift＋S」で、画面の一部だけを撮れます。<br>画像はお使いのブラウザの中で処理され、どこにも送信されません。</span></button>
      <p class="muted" style="margin:4px 0">記録詳細から「ロスレコスキル」タブ画面の画像を、クリップボードから読み込むか、ファイルで選んでください。</p>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn-add pri" data-act="rocr-clip"${st.busy ? " disabled" : ""}>クリップボードから読み込む</button><label class="btn-add ocr-pick${st.busy ? " dis" : ""}">画像ファイルを選ぶ<input type="file" accept="image/*" id="rocr-file"${st.busy ? " disabled" : ""}></label></div>
      ${st.msg ? `<p class="msg${st.ng ? " ng" : ""}">${esc(st.msg)}</p>` : ""}${res}</div>`;
  }
  function runRecOcr(file) {
    if (!file || !S.ocrRecord) return;
    V.rocr = { busy: true, msg: "読み取りの準備をしています…" }; renderAll();
    S.ocrRecord(file, m => { if (V.rocr) { V.rocr.msg = m; renderAll(); } })
      .then(res => { const ok = res.lrs.some(x => x.id) || res.notes.length; V.rocr = { res: ok ? res : null, msg: ok ? "読み取りました。内容を確かめて「この内容で入れる」を押してください。" : "ロスレコスキル画面の文字が見つかりませんでした。画面を確かめてください。", ng: !ok }; renderAll(); })
      .catch(e => { V.rocr = { msg: e.message || "読み取れませんでした", ng: true }; renderAll(); });
  }
  function applyRecOcr() {
    const res = V.rocr && V.rocr.res;
    if (!res) return;
    G.lrMain = G.lrMain || [];
    res.lrs.slice(0, 3).forEach((x, i) => { if (x.id) { G.lrMain[i] = x.id; delete V.lrEl["lrMain." + i]; } });
    S.notesToTotal(G);
    G.notes = G.notes || {};
    res.notes.forEach(x => { if (x.note) G.notes[x.note] = Math.max(0, x.n); });
    V.rocr = { msg: "入れました。違うところがあれば、下の枠で直してください。" };
    save(); renderAll();
  }
  // ---- 素質収集画面のスクリーンショットから、その巡遊者の素質とLvを読み込む（sim_ocr.js の S.ocrPotentials）----
  // 素質の画面（1人ずつ）に置き、その巡遊者の段だけを読む（ほかの段は見出しで飛ばすので速い）。V.pocr.slot がいま読んでいる巡遊者
  // 何枚かに分けて撮ったものを、貼るたびに足していく。カードの数字は徽章の分も入った値なので、入れるときに徽章の分を引く
  // 見出しの数字（例: 32+4）は 徽章なしの合計+徽章の分。読めたカードの合計と比べて、読み落としがないかを出す
  function potCands() {
    return ["main", "s1", "s2"].map(k => {
      const id = G.team[k], c = chOf(id), tk = TK(c.en), role = k === "main" ? "main" : "support", pots = [];
      ((tk && tk.potentials && tk.potentials[role]) || []).forEach(gr => gr.potentials.forEach(p => { const key = S.potKey(p.name); if (!pots.some(x => x.key === key)) pots.push({ key, en: p.name, ja: JA(p.name, id), core: p.type === 1 }); }));
      return { slot: k, id, jp: c.jp, pots };
    });
  }
  // 読めたカードを、入れる素質Lv（徽章の分を引いた値）にする
  function potPlan(st) {
    return potCands().filter(c => c.slot === st.slot && st.got[c.slot]).map(c => {
      const cs = G.chars[c.id], bonus = S.emblemExtra(cs.emb, cs.embOn).pot, got = st.got[c.slot];
      const items = c.pots.filter(p => got[p.key]).map(p => {
        const g = got[p.key], b = p.core ? 0 : (bonus[p.en] || 0);
        const lv = p.core ? 1 : g.lv != null ? Math.max(1, g.lv - b) : (+((cs.pots2 || {})[p.key]) || 1);
        return { p, card: g.lv, b, lv, warn: g.warn };
      });
      const sum = st.sums[c.slot], cardSum = items.reduce((a, x) => a + (x.p.core ? 1 : x.card || 0), 0);
      return { c, items, sum, cardSum, ok: sum ? cardSum === sum.base + sum.emb : null };
    });
  }
  function potOcrBox(k) {
    const st = V.pocr && V.pocr.slot === k ? V.pocr : {}, jp = chOf(G.team[k]).jp;
    let res = "";
    if (st.got && !st.busy && Object.keys(st.got).length) {
      const plan = potPlan(st);
      res = plan.map(x => `<div style="margin:6px 0"><b>${esc(x.c.jp)}</b>（${x.items.length}件）
          ${x.ok === true ? '<span class="tag-ok">見出しの合計と一致</span>' : x.ok === false ? `<span class="tag-ng">見出しの合計 ${x.sum.base}${x.sum.emb ? "+" + x.sum.emb : ""} と、読めたカードの合計 ${x.cardSum} が違います（読み落としか、スクロールが足りないかもしれません）</span>` : '<span class="muted">見出しの合計は読めませんでした</span>'}
          <div class="muted" style="margin-top:2px">${x.items.map(i => `${esc(i.p.ja)} ${i.p.core ? "コア" : `Lv${i.lv}${i.b ? `（画面 ${i.card}・徽章+${i.b}）` : ""}`}${i.warn ? ' <span class="tag-ng">Lvが読めませんでした</span>' : ""}`).join("／")}</div></div>`).join("")
        + (st.miss.length ? `<p class="msg ng">素質が見つからなかったカード: ${st.miss.map(esc).join("、")}（読み取りがうまく行きませんでした）</p>` : "")
        + `<p class="muted" style="margin:4px 0">${st.n}枚読み込み済み（続けて貼ると足していきます）</p>
        <div class="foot" style="justify-content:flex-start"><button class="btn-add pri" data-act="pocr-apply">この内容で入れる</button><button class="btn-add" data-act="pocr-cancel">やめる</button></div>`;
    }
    return `<div class="box ocr-box"><b>素質収集画面のスクリーンショットから読み込む</b> <button type="button" class="hint-tip" data-act="hint" aria-haspopup="dialog">使い方<span class="hint-pop" hidden>${esc(jp)}の段だけを読みます。<br>巡遊者名とカードが全部映るように撮ってください。1枚に入らないときは、スクロールして何枚かに分けて撮り、続けて貼れば足していきます。画面の大きさや切り取り方は問いません。<br>カードのLvは徽章の分を含むので、徽章の分を引いて入れます。先に徽章を合わせておいてください。<br>入れると、この巡遊者の素質は、読めたものだけになります（読めなかった素質は取得なし）。見出しの合計（例: 32+4）と読めたカードの合計が合うかも確かめます。<br>この画面で Ctrl+V しても読み込めます。<br>PCの場合は「Alt＋PrintScreen」で、いま選んでいるウィンドウのスクリーンショットを撮れます。または「Windows＋Shift＋S」で、画面の一部だけを撮れます。<br>画像はお使いのブラウザの中で処理され、どこにも送信されません。</span></button>
      <p class="muted" style="margin:4px 0">記録詳細から「素質収集」タブ画面の画像を、クリップボードから読み込むか、ファイルで選んでください。</p>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn-add pri" data-act="pocr-clip:${k}"${st.busy ? " disabled" : ""}>クリップボードから読み込む</button><label class="btn-add ocr-pick${st.busy ? " dis" : ""}">画像ファイルを選ぶ<input type="file" accept="image/*" multiple id="pocr-file" data-slot="${k}"${st.busy ? " disabled" : ""}></label></div>
      ${st.msg ? `<p class="msg${st.ng ? " ng" : ""}">${esc(st.msg)}</p>` : ""}${res}</div>`;
  }
  function runPotOcr(files, k) {
    files = [...(files || [])].filter(Boolean);
    if (!files.length || !S.ocrPotentials || !k) return;
    const prev = V.pocr && V.pocr.got && V.pocr.slot === k ? V.pocr : { slot: k, got: {}, sums: {}, miss: [], n: 0 };
    V.pocr = Object.assign({}, prev, { busy: true, msg: "読み取りの準備をしています…" }); renderAll();
    const t0 = Date.now();
    S.ocrPotentials(files, potCands(), m => { if (V.pocr) { V.pocr.msg = m; renderAll(); } }, k)
      .then(r => {
        const got = JSON.parse(JSON.stringify(prev.got)), sums = Object.assign({}, prev.sums);
        Object.keys(r.got).forEach(sl => { const o = (got[sl] = got[sl] || {}); Object.keys(r.got[sl]).forEach(key => { const x = r.got[sl][key]; if (!o[key] || o[key].lv == null) o[key] = x; }); });
        Object.keys(r.sums).forEach(sl => { if (!sums[sl]) sums[sl] = r.sums[sl]; });
        const ok = !!got[k], sec = Math.round((Date.now() - t0) / 1000);
        V.pocr = { slot: k, got, sums, miss: prev.miss.concat(r.miss), n: prev.n + files.length, msg: ok ? `読み取りました（${sec}秒）。内容を確かめて「この内容で入れる」を押してください。` : `${chOf(G.team[k]).jp}の素質のカードが見つかりませんでした。素質収集画面で、${chOf(G.team[k]).jp}の巡遊者名とカードが映っているか確かめてください。`, ng: !ok };
        renderAll();
      })
      .catch(e => { V.pocr = Object.assign({}, prev, { busy: false, msg: e.message || "読み取れませんでした", ng: true }); renderAll(); });
  }
  function applyPotOcr() {
    const st = V.pocr;
    if (!st || !st.got) return;
    potPlan(st).forEach(x => {
      const cs = G.chars[x.c.id];
      cs.pots2 = {};
      x.items.forEach(i => { cs.pots2[i.p.key] = i.lv; });
    });
    V.pocr = { slot: st.slot, msg: "入れました。違うところがあれば、下の素質で直してください。" };
    save(); renderAll();
  }
  function applyOcr(id) {
    const cs = G.chars[id], rows = (V.ocr && V.ocr.rows) || [];
    OCR_KINDS.forEach((kind, b) => {
      const i = cs.emb.findIndex(e => e.kind === kind);
      if (i < 0) return;
      cs.emb[i].slots.forEach((sl, j) => {
        const r = rows[b * 4 + j];
        sl.k = r && r.k || ""; sl.q = r && r.q || (r && r.k ? sl.q : "gold"); sl.cat = r && r.k ? catOfKey(r.k) : "";
        if (r && r.t) sl.t = r.t; else delete sl.t;
      });
      cs.embOn[i] = 1;
    });
    V.ocr = { id, msg: "入れました。違うところがあれば、下の枠で直してください。" };
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
        return `<div class="emb-line">${sel(`${sp}.cat`, EMB_CATS.map(x => [x[0], x[0]]), cat, "（区分）")}${sel(`${sp}.k`, items, sl.k || "", "（項目）")}${o ? sel(`${sp}.q`, vals, (isLv(o) && sl.q === "rainbow") ? "rainbow3" : sl.q, "（値）") : ""}${tg}</div>`;
      }).join("");
      return `<div class="emb-card"><h4><label style="display:inline-flex;gap:6px;align-items:center;margin:0"><input type="checkbox" data-p="chars.${id}.embOn.${i}" data-t="b01"${cs.embOn[i] ? " checked" : ""}>${KIND_NAME[e.kind] || esc(e.name)}徽章（${e.kind === "triangle" ? "Lv70" : e.kind === "circle" ? "Lv80" : "Lv90"}）</label></h4>${slots}</div>`;
    };
    const sum = E.emblemSum(cs.emb, cs.embOn);
    const sumTxt = Object.keys(sum).map(key => { const o = optOf(key); return `${o.label} ${valTxt(o, sum[key])}`; }).join(" ／ ");
    const ex = emx(id);
    const lvTxt = Object.keys(ex.lv).filter(x => ex.lv[x]).map(x => ({ basic: "通常攻撃", main: "主力スキル", support: "支援スキル", ult: "必殺技" }[x] + "Lv+" + ex.lv[x])).join("・");
    const potTxt = Object.keys(ex.pot).map(x => `${JA(x, id)} Lv+${ex.pot[x]}`).join("・");
    return `<div class="wide">${ocrBox(id)}<div>${order.map(card).join("")}</div>
      <div class="note">合計: ${sumTxt || "なし"}${lvTxt ? `<br>スキルレベル上昇: ${lvTxt}（スキルLvの欄に反映）` : ""}${potTxt ? `<br>素質レベル上昇: ${potTxt}（取得している素質に反映）` : ""}</div>
      ${helpTxt("emb", "各枠は、左から 区分 → 項目 → 値 の順に選びます。", "金までしかない項目には虹を出しません。素質レベル上昇は、取得している素質（Lv1以上）にだけ足します。")}</div>`;
  }

  // ---- 心相（段階・戦闘中の効果）----
  // 心相の凸の戦闘中の効果（反映するか）。その他の画面に置く（心相の進み具合は基本の画面）
  function heartFxBox(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], p = `chars.${id}`, st = R.team[id].st, hs = (S.HEART_SPEC || {})[id];
    const tb = c.talentBonus || {}, tu = Math.min(10, Math.max(0, (cs.talent || 0) / 5));
    const stat = [`基礎HP +${fmt(st.talHp)}`, `基礎攻撃 +${fmt(st.talAtk)}`].concat(tb.elem ? [`${c.el}属性ダメージ +${pct(tu * tb.elem)}`] : [], tb.basic ? [`通常攻撃ダメージ +${pct(tu * tb.basic)}`] : [], tb.skill ? [`スキルダメージ +${pct(tu * tb.skill)}`] : [], tb.ult ? [`必殺技ダメージ +${pct(tu * tb.ult)}`] : [], tb.crit ? [`会心ダメージ +${pct(tu * tb.crit)}`] : []).join(" ／ ");
    const list = hs ? `<div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${hs.map(h => {
      const un = (cs.talent || 0) >= h.n * 10, key = "heart" + h.n, onv = (cs.pon || {})[key], on = onv == null ? !h.off : onv;
      return `<div class="pot${un ? " core" : ""}"><b>${h.n} ${esc(h.name)}</b>${un ? '<span class="tag-ok">解放済み</span>' : '<span class="tag-ng">未解放</span>'}
        <div class="muted">${esc(h.txt)}</div>${un ? `<div class="lv">反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}></div>` : ""}
        ${un && id === "noya" && h.n === 1 ? `<label class="check" style="font-weight:400;margin-top:4px"><input type="checkbox" data-p="heartCrit" data-t="b"${G.heartCrit ? " checked" : ""}>「閃星」中（会心ダメージ +12%）</label>` : ""}</div>`;
    }).join("")}</div>` : '<p class="muted" style="margin:0">この巡遊者の、心相の戦闘中の効果は、まだ登録していません。反映したい効果は下の「加算」に入れてください。</p>';
    return `<div class="box"><h3 style="margin:0 0 4px;font-size:14px">心相の効果<span class="muted" style="font-weight:400;font-size:12px;margin-left:8px">心相 ${(+cs.talent || 0) / 10}凸（進み具合は「基本」で変えます）。10段階 = 1凸</span></h3>
      <p class="muted" style="margin:0 0 6px;font-size:12px">段階ごとのステータス: ${stat}</p>${list}</div>`;
  }
  function renderHeart(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], p = `chars.${id}`, st = R.team[id].st;
    const hs = (S.HEART_SPEC || {})[id];
    const rar = TK(c.en).rarity;
    const tb = c.talentBonus || {}, tu = Math.min(10, Math.max(0, (cs.talent || 0) / 5));
    const stat = [`基礎HP +${fmt(st.talHp)}`, `基礎攻撃 +${fmt(st.talAtk)}`].concat(tb.elem ? [`${c.el}属性ダメージ +${pct(tu * tb.elem)}`] : [], tb.basic ? [`通常攻撃ダメージ +${pct(tu * tb.basic)}`] : [], tb.skill ? [`スキルダメージ +${pct(tu * tb.skill)}`] : [], tb.ult ? [`必殺技ダメージ +${pct(tu * tb.ult)}`] : [], tb.crit ? [`会心ダメージ +${pct(tu * tb.crit)}`] : []).join(" ／ ");
    const list = hs ? `<div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${hs.map(h => {
      const un = (cs.talent || 0) >= h.n * 10, key = "heart" + h.n, onv = (cs.pon || {})[key], on = onv == null ? !h.off : onv;
      return `<div class="pot${un ? " core" : ""}"><b>${h.n} ${esc(h.name)}</b>${un ? '<span class="tag-ok">解放済み</span>' : '<span class="tag-ng">未解放</span>'}
        <div class="muted">${esc(h.txt)}</div>${un ? `<div class="lv">反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}></div>` : ""}
        ${un && id === "noya" && h.n === 1 ? `<label class="check" style="font-weight:400;margin-top:4px"><input type="checkbox" data-p="heartCrit" data-t="b"${G.heartCrit ? " checked" : ""}>「閃星」中（会心ダメージ +12%）</label>` : ""}</div>`;
    }).join("")}</div>` : '<p class="muted">この巡遊者の、心相の戦闘中の効果は、まだ登録していません。反映したい効果は「その他」に入れてください。</p>';
    return `<div class="wide">
      ${fld("心相", `<div class="pz-lvs seg" role="group" aria-label="心相">${Array.from({ length: 50 / (rar >= 5 ? 10 : 5) + 1 }, (_, i) => i * (rar >= 5 ? 10 : 5)).map(v => `<button type="button" class="pz-lv${(+cs.talent || 0) === v ? " on" : ""}" aria-pressed="${(+cs.talent || 0) === v}" data-act="plv|${v}|${p}.talent">${rar >= 5 ? v / 10 + "凸" : v / 10}</button>`).join("")}</div>`, rar >= 5 ? "" : "星4は5段階ずつ（0.5凸きざみ）")}
      <p class="note">段階ごとのステータス: ${stat}</p>
      <h3 style="margin:10px 0 6px;font-size:14px">凸の戦闘中の効果（10段階 = 1凸）</h3>${list}</div>`;
  }

  // ---- 素質 ----
  function potGroupName(title, role) {
    const m = /Build (\d)/i.exec(title);
    return (role === "main" ? "主力" : "支援") + "・" + (m ? "特化構築" + m[1] : "汎用");
  }
  // ---- 素質（コア素質と通常素質をカードで選ぶ）----
  // 計算は今までと同じ入力（pots2 / pots / sup）をそのまま使う。画面で選べるLvは0〜6（前の入力で7以上が入っているものは、そのまま残す）
  const POT_LV_MAX = 6, POT_LV_EMB_MAX = 9, CORE_MAX = 2;   // 取得はLv6まで。徽章の素質レベル上昇でLv9まで
  // 1人分の素質の一覧: { name, en, core, lv, path, desc, tags, ctl, grp, bonus }
  function potItems(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], p = `chars.${id}`, ex = emx(id), out = [];
    const tg = (t, ok) => `<span class="${ok ? "tag-ok" : "tag-ng"}">${t}</span>`;
    const t = TK(c.en), spec = S.POT_SPEC[id], role = k === "main" ? "main" : "support";
    const groups = (t && t.potentials[role]) || [];
    const bn = g => { const m = /Build (\d)/i.exec(g.title); return /Generic/i.test(g.title) ? "汎用" : "特化構築" + (m ? m[1] : "?"); };
    groups.forEach(g => g.potentials.forEach(x => {
      const sp = spec && spec[x.name], key = spec ? S.potKey(x.name) : x.name.replace(/[^A-Za-z0-9]/g, "_"), core = x.type === 1;
      const it = { name: JA(x.name, id) + (sp && (sp.st === "auto" || sp.st === "draft") ? "*" : ""), en: x.name, core, lv: +((cs.pots2 || {})[key] || 0), path: `${p}.pots2.${key}`,
        desc: sp ? sp.txt : "効果がまだ入っていません", tags: [], ctl: "", grp: bn(g), bonus: ex.pot[x.name] || 0 };
      if (sp && it.lv > 0 && S.potCalcText) {   // 計算に使っている中身（そのLvの値）。「反映」を外しているときは、そう書く
        it.calc = S.potCalcText(id, x.name, it.lv + it.bonus);
        it.calcLv = core ? "" : `Lv${it.lv + it.bonus}${it.bonus ? `・徽章+${it.bonus}込み` : ""}${it.lv + it.bonus > POT_LV_MAX ? "・推定" : ""}`;
        const onv = (cs.pon || {})[key];
        if (it.calc && !(onv == null ? !S.potDefOff(sp, cs) : onv)) it.calc += "　※反映を外しているので、今は計算に入っていません";
      }
      if (!sp) it.tags.push(tg("計算に未対応"));
      else {
        const ctl = [];
        if (!sp.e.length) it.noeff = tg("火力に影響なし");   // 「反映」と同じ場所に出す
        else { const onv = (cs.pon || {})[key], on = onv == null ? !S.potDefOff(sp, cs) : onv; it.onc = `<label class="pz-c">反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}></label>`; }
        if (sp.off) it.tags.push(tg("条件付き（既定はオフ）"));
        else if (sp.offUnless) it.tags.push(tg(`条件付き（${(window.POTENTIAL_JA || {})[sp.offUnless] || sp.offUnless}がないときは既定でオフ）`));
        const seen = {};
        sp.e.forEach(e => { if (e.stk > 1 && !seen[e.sk || ""]) { seen[e.sk || ""] = 1; const sk = key + (e.sk ? ":" + e.sk : ""); ctl.push(`<span class="pz-c"><span class="muted">${e.sk ? (e.sk === "glow" ? "グロウ" : "ハロー") : "重複数"}</span> ${stepper(`${p}.pstk.${sk}`, 0, e.stk, e.stk0 != null ? e.stk0 : e.stk, "sm")}<span class="muted">/${e.stk}</span></span>`); } });
        sp.e.forEach((e, ei) => { if (e.edit) ctl.push(`<span class="pz-c"><span class="muted">回数</span> ${stepper(`${p}.pcnt.${key}#${ei}`, 0, 99, e.c, "sm")}</span>`); });
        it.ctl = ctl.join("");
      }
      out.push(it);
    }));
    return out;
  }
  const potCount = list => ({ core: list.filter(x => x.core && x.lv > 0).length, normal: list.filter(x => !x.core && x.lv > 0).length });
  function renderPot(k) {
    if (!SLOTS.some(s => s[0] === k)) k = "main";
    const id = G.team[k], c = chOf(id), list = potItems(k), cnt = potCount(list);
    const STAR = fill => `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="${fill}"><path d="M12 1.5C12.8 8 16 11.2 22.5 12 16 12.8 12.8 16 12 22.5 11.2 16 8 12.8 1.5 12 8 11.2 11.2 8 12 1.5z"></path></svg>`;
    const tags = x => x.tags.length ? `<div class="pz-tags">${x.tags.join("")}</div>` : "";
    // コア素質: カード全体がボタン。1人2つまで（前の入力で3つ以上あるときは、外すことだけできる）
    const full = cnt.core >= CORE_MAX;
    const coreCard = x => {
      const on = x.lv > 0, dis = !on && full;
      // カードの上（名前・スイッチ・説明）が押せるボタン。「反映」などはボタンの外（カードの中の下）に置く
      return `<div class="pz-core${on ? " on" : ""}${dis ? " dis" : ""}" title="${esc(x.en)}"><button type="button" class="pz-ctog" aria-pressed="${on}" data-act="pcore|${x.path}"${dis ? " disabled" : ""}>
        <span class="pz-row">${STAR("#F4C84A")}<span class="pz-name">${esc(x.name)}</span>${x.grp ? `<span class="pz-grp">${x.grp}</span>` : ""}<span class="pz-sw${on ? " on" : ""}"><span></span></span></span>
        <span class="pz-desc">${esc(x.desc)}${x.calc ? `<span class="pz-calc">計算${x.calcLv ? `（${x.calcLv}）` : ""}: ${esc(x.calc)}</span>` : ""}</span></button>${tags(x)}${(on && (x.onc || x.ctl)) || x.noeff ? `<div class="pz-ctl">${on ? (x.onc || "") + x.ctl : ""}${x.noeff || ""}</div>` : ""}</div>`;
    };
    // 通常素質: 名前と反映の行、Lv0〜6のボタン、その下に右寄せで「徽章+3」（Lvは押したボタンで分かるので出さない。2026-11-14 ユーザー）
    const normCard = x => {
      const btns = Array.from({ length: POT_LV_MAX + 1 }, (_, n) => `<button type="button" class="pz-lv${x.lv === n ? " on" : ""}" aria-pressed="${x.lv === n}" data-act="plv|${n}|${x.path}">${n}</button>`).join("");
      return `<div class="pz-norm${x.lv > 0 ? " on" : ""}" title="${esc(x.en)}">
        <div class="pz-row">${STAR("#9AA0C8")}<span class="pz-name">${esc(x.name)}</span><span style="flex:1"></span>${x.lv > 0 && x.onc ? x.onc : (x.noeff || "")}</div>
        <div class="pz-row"><div class="pz-lvs" role="group" aria-label="${esc(x.name)}のLv">${btns}</div></div>
        ${x.bonus ? `<div class="pz-row"><span style="flex:1"></span><span class="pz-lvt${x.lv ? "" : " off"}">徽章+${x.bonus}</span></div>` : ""}
        ${x.lv > POT_LV_MAX ? `<div class="muted" style="font-size:11px">前の入力で Lv${x.lv} が入っています（ボタンを押すと Lv0〜6 に変わります）</div>` : ""}
        ${tags(x)}${x.lv > 0 && x.ctl ? `<div class="pz-ctl">${x.ctl}</div>` : ""}
        <div class="pz-desc">${esc(x.desc)}${x.calc ? `<span class="pz-calc">計算${x.calcLv ? `（${x.calcLv}）` : ""}: ${esc(x.calc)}</span>` : ""}</div></div>`;
    };
    // コア素質は2列。特化構築1を上の段、特化構築2を下の段に（2026-11-22 ユーザー）
    const gOrd = x => /2/.test(x.grp || "") ? 2 : /1/.test(x.grp || "") ? 1 : 3;
    const cores = list.filter(x => x.core).map((x, i) => [x, i]).sort((a, b) => gOrd(a[0]) - gOrd(b[0]) || a[1] - b[1]).map(a => a[0]), norms = list.filter(x => !x.core);
    // 通常素質は、特化構築ごと・汎用ごとに見出しを付ける（見出しは同じグリッドの1行）
    let lastGrp = null;
    const normHtml = norms.map(x => { const h = x.grp && x.grp !== lastGrp ? `<div class="pz-sub">${x.grp}</div>` : ""; lastGrp = x.grp; return h + normCard(x); }).join("");
    // 説明の表示スイッチは、コア素質・通常素質の見出しの右端に1つずつ（2026-11-22 ユーザー）。切ると説明を隠し、反映・回数・徽章+だけ残してカードの高さをそろえる
    const dsw = k => `<button type="button" class="pz-dsw" aria-pressed="${potDesc[k]}" data-act="potdesc:${k}">素質の説明<span class="pz-sw${potDesc[k] ? " on" : ""}"><span></span></span></button>`;
    const coreSec = `<section><h3 class="pz-h">コア素質 <span class="pz-cnt${full ? " full" : ""}">${cnt.core} / ${CORE_MAX}</span>${dsw("core")}</h3>
      ${cores.length ? `<div class="pz-cgrid">${cores.map(coreCard).join("")}</div>` : '<p class="muted">ありません</p>'}</section>`;
    const normSec = `<section><h3 class="pz-h">通常素質 <span class="muted" style="font-size:13px">取得 ${cnt.normal}個</span>${dsw("norm")}</h3>
      ${norms.length ? `<div class="pz-ngrid">${normHtml}</div>` : '<p class="muted">ありません</p>'}</section>`;
    const note = S.POT_SPEC[id] ? "名前の後ろの「*」は未確認（日本語Wikiの説明文から自動で作った下書き）です。名前は日本語（マウスを重ねると英語名）。回数や重複数が原文に書かれていないものは「仮」の値なので、実測に合わせて直してください。「全員が光」の条件は、編成から自動で判定します。残光の有無は「エネミー」で切り替えます。"
      : "この巡遊者の素質の効果は、まだ計算に入れていません。反映したい効果は「その他」に手で入れられます。";
    return `<div class="pz${potDesc.core ? "" : " nodesc-core"}${potDesc.norm ? "" : " nodesc-norm"}">
      <div class="pz-main">
        ${potOcrBox(k)}
        ${id === "tilia" ? `<label class="check" style="font-weight:400;margin:0"><input type="checkbox" data-p="markDebuff" data-t="b"${G.markDebuff !== false ? " checked" : ""}>印被ダメージ増加（眩い正義など）が敵に付いている</label>` : ""}
        <div class="pz-bar">
          <p class="muted" style="margin:0;font-size:12px">ここで選べるのは Lv6 まで。徽章の「＋」は徽章画面の入力から自動で足されます（Lv7〜9 は推定値）。</p></div>
        ${coreSec}${normSec}
        ${helpTxt("pot", "Lv2〜5はWikiの値、Lv7〜9は推定値です。", `素質の数値は、素質の一覧の画面では Lv1 と Lv6、星ノ塔の周回中の画面では Lv2〜5・Lv7〜9 も見えます。まだ集めきれていないので、Lv2〜5 はWikiの値（未確認）、Lv7〜9 は、直前の増え方で延長した推定値です（画面で確認できたものだけ、実値に置き換えています）。<br>${note}`)}
      </div>
      </div>`;
  }


  // ---- ロスレコ・音符 ----
  // ロスレコの名前。Wikiから自動で入れたもの（ゲーム内では未確認）は「*」を付ける。★の数も添える
  const lrName = r => `${r.name}${r.auto || r.autoFx ? "*" : ""}${r.rarity ? `（★${r.rarity}）` : ""}`;
  // 選ぶときの名前: どんなロスレコか分かるように、★・基礎ステータス・属性ダメージなどを添える
  const LR_ST = [["baseAtk", "基礎攻撃力"], ["baseHp", "基礎HP"], ["elemDmg", ""], ["skillDmg", "スキルダメージ"], ["ultDmg", "必殺技ダメージ"]];
  const lrOptName = r => {
    const st = r.stats || {}, parts = r.rarity ? [`★${r.rarity}`] : [];
    LR_ST.forEach(([k, lab]) => { const v = st[k]; if (!v) return;
      if (k === "baseAtk" && S.lrAtkScalable(r)) { const mx = S.lrAtkMax(r); return parts.push(`${lab} ${mx - 650}-${mx}`); }   // 突破I〜VI
      parts.push(k === "elemDmg" ? `${r.element}属性ダメージ${Math.round(v * 1000) / 10}%` : /Dmg$/.test(k) ? `${lab}${Math.round(v * 1000) / 10}%` : `${lab} ${Math.round(v)}`); });
    if (parts.length <= 1 && !Object.keys(st).length) parts.push("ステータス未登録");   // ステータスが1つも入っていないもの（★だけになるので）
    return `${r.name}${r.auto || r.autoFx ? "*" : ""}${parts.length ? `（${parts.join(" / ")}）` : ""}`;
  };
  function renderLr() {
    const L = LOSTRECORDS;
    // 枠: クリア → 属性 → 名前（徽章と同じ形）。属性だけ選んだ状態は画面の中だけで持つ
    const ELS = ["水", "火", "風", "地", "光", "闇"].filter(e => L.some(x => x.element === e)).concat([...new Set(L.map(x => x.element))].filter(e => ["水", "火", "風", "地", "光", "闇"].indexOf(e) < 0));
    // 突破: メインはコア効果と基礎攻撃力、サブは基礎攻撃力が変わる（★5）
    const rankSel = (arr, id) => {
      const r = id && L.find(x => x.id === id);
      const fxCan = arr === "lrMain" && id && S.lrRankOf(G, id).can, atkCan = S.lrAtkScalable(r);
      // 空の枠でも位置がそろうように、選べない灰色の「突破」の欄を置いておく（2026-11-22 ユーザー）
      if (!id) return `<select disabled title="ロスレコを選ぶと選べます"><option>突破</option></select>`;
      if (!fxCan && !atkCan) return `<span class="muted" style="font-size:11px">${S.lrFixedTxt(G, id, arr)}</span>`;
      const now = S.lrRankNow(G, id);
      return `<select data-p="lrRank.${id}" data-t="n" title="突破">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}"${n === now ? " selected" : ""}>突破${S.lrRoman(n)}</option>`).join("")}</select>`;
    };
    const slot = (arr, i, lab) => {
      const path = `${arr}.${i}`, cur = (G[arr] || [])[i] || "", r = L.find(x => x.id === cur);
      // 名前のドロップダウンのかわりに、カードの一覧から選ぶ画面を開くボタン（2026-11-22 ユーザー。名前だけでは中身が分からないため）
      return `<div class="lr-line"><span class="lab">${lab}</span>
        <button type="button" class="lr-pick${r ? "" : " empty"}" data-act="lrpick:${path}">${r ? `<i class="lr-el" style="--elc:${EL_COLOR[r.element] || "#8a8fb8"}"></i><b>${esc(r.name)}${r.auto || r.autoFx ? "*" : ""}</b><small>★${r.rarity || "?"}</small>` : '<b>（ロスレコを選ぶ）</b>'}<span class="lr-pick-arr" aria-hidden="true">▼</span></button>${rankSel(arr, cur)}</div>`;
    };
    const m = "lrManual";
    // 手入力の欄は、ふだんは閉じておく（値が入っているときは、開いた状態から始める）
    const manHas = ["baseAtk", "baseHp", "elem", "basicDmg", "skillDmg", "atkPct"].some(k => +((G.lrManual || {})[k]) || 0);
    const manOpen = V.manOpen != null ? V.manOpen : manHas;
    // 音符: ゲームと同じく、色と名前 → 数 → 効果 を縦に並べ、1行にする
    const NC = { 強撃: "#E5533D", 幸運: "#F08A24", 爆発: "#8B5CF6", 体力: "#3FB65F", 集中: "#1FB5A8", 器用: "#3B6FE0", 必殺: "#E84D8A", 水: "#2BA6DE", 風: "#55C27A", 光: "#E8B10F", 火: "#E5533D", 地: "#A0703C", 闇: "#6B4FA0" };
    const STN = { atkPct: "攻撃力", critRate: "会心率", critDmg: "会心ダメージ", hpPct: "最大HP", basicDmg: "通常攻撃ダメージ", skillDmg: "スキルダメージ", ultDmg: "必殺技ダメージ" };
    S.notesToTotal(G);   // 前の形（獲得した分）のビルドは、ここで合計の形にする
    const tot = S.notesTotal(G);
    const r1 = x => (Math.round(x * 1000) / 10).toFixed(1);
    // サブのロスレコごとの初期の音符（マウスを重ねたときに、どのロスレコの分か出す）
    const subFrom = n => (G.lrSub || []).filter(Boolean).map(id => { const r = LOSTRECORDS.find(x => x.id === id), x = ((r && r.sub && r.sub.startNotes) || []).find(q => q.note === n); return x ? `${r.name} ${x.lv}` : ""; }).filter(Boolean);
    // 1枚: 名前 → 合計（ゲームのロスレコスキル画面の数をそのまま入れる）→ 効果。サブのロスレコの初期の音符は、マウスを重ねると出る
    const noteCell = n => {
      const s = n.replace("の音符", ""), d = NOTES[n], t = tot[n] || 0, from = subFrom(n);
      const stat = d ? (STN[d.stat] || d.stat.replace("elemDmg:", "") + "属性ダメージ") : "";
      const tip = from.length ? "サブのロスレコの初期: " + from.join("・") + "（合計に入っている数）" : "サブのロスレコの初期: なし";
      return `<div class="note-cell" style="--nc:${NC[s] || "#8a8fb8"}"><div class="note-ic">♪</div><div class="note-nm">${esc(s)}</div>
        <div class="note-tot"><input type="number" data-p="notes.${n}" data-t="n" min="0" max="99" step="1" value="${t}" title="${esc(tip)}" aria-label="${esc(s)}の音符の数"></div>
        <div class="note-fx">${stat}<br><b>+${d ? r1(t * d.perLv) : "0.0"}%</b></div></div>`;
    };
    // 1段目: ステータスの音符、2段目: 属性の音符（6属性）
    const noteIn = `<div class="notes-row">${S.NOTE_BASE.map(noteCell).join("")}</div>
      <div class="notes-row" style="margin-top:8px">${S.NOTE_ELEM.map(noteCell).join("")}</div>`;
    // 効果の数は、選んでいるメインのロスレコの効果が使うものだけ出す
    const usedN = new Set();
    (G.lrMain || []).filter(Boolean).forEach(id => { const fx = S.LR_FX[id]; if (!fx) return; fx.core.concat(...fx.assists.map(a => a.items)).forEach(it => { if (it.n) usedN.add(it.n); if (it.need) usedN.add(it.need[0]); }); });
    const counts = S.LR_COUNTS.filter(c => usedN.has(c.key)).map(c => fld(c.label, stepper(`lrN.${c.key}`, 0, c.max, 0) + `<span class="muted cnt-max">${c.noMax ? "" : `最大 ${c.max}`}</span>`)).join("");   // 「最大」の欄は幅を固定し、−／＋の位置を縦にそろえる
    // メインのロスレコの効果
    const fxHtml = (G.lrMain || []).filter(Boolean).map(id => {
      const fx = S.LR_FX[id], r = L.find(x => x.id === id);
      if (!r) return "";
      if (!fx) return `<div class="pot"><b>${esc(lrName(r))}</b><span class="tag-ng">効果は計算に未対応（基礎攻撃力・基礎HP・属性ダメージだけ計算に入れます）</span></div>`;
      // 文の中の効果量（「12%」「+0.3%」）を、ゲームの画面と同じように色を付けて目立たせる
      const hl = t => esc(t).replace(/[+＋]?\d+(?:\.\d+)?%/g, m0 => `<em class="lrfx-num">${m0}</em>`);
      const item = (key, it, lv, mul) => {
        let txt = typeof it.txt === "function" ? it.txt(lv) : it.txt;
        if (mul && mul !== 1) txt = txt.replace(/\+([0-9.]+)%/g, (m0, n) => "+" + Math.round(+n * mul * 100) / 100 + "%");   // 手で入れたロスレコの突破
        if (it.skip) return `<div class="lrfx-it skip">${esc(txt)} ${it.why === "info" ? '<span class="muted">（火力に関係しない）</span>' : `<span class="tag-ng"${it.why ? ` title="${esc(it.why)}"` : ""}>計算に未対応</span>`}</div>`;
        const stk = (it.e || []).find(e => e.stk > 1);
        const isOn = (G.lrOn || {})[key] == null ? !it.off : (G.lrOn || {})[key];
        const tog = it.off ? ` 反映 <input type="checkbox" data-p="lrOn.${key}" data-t="b"${isOn ? " checked" : ""}>` : (it.need ? ` <span class="muted">条件: ${(S.LR_COUNTS.find(c => c.key === it.need[0]) || {}).label} が ${it.need[1]} 以上</span>` : (it.n ? ` <span class="muted">数: ${(S.LR_COUNTS.find(c => c.key === it.n) || {}).label}</span>` : ` <span class="tag-ok">常時</span>`));
        return `<div class="lrfx-it">${hl(txt)}${stk ? `（最大${stk.stk}重で計算）` : ""}${tog}${it.note ? ` <span class="muted">（${esc(it.note)}）</span>` : ""}</div>`;
      };
      const rk = S.lrRankOf(G, id);
      const rankSel = rk.can ? ` <span class="muted">突破${S.lrRoman(rk.rank)}${rk.r0 ? `（画面で確かめた値は突破${S.lrRoman(rk.r0)}。ほかの突破はWikiの伸び方で計算）` : ""}</span>` : "";
      const core = fx.core.map(it => item(id + ":c:" + it.id, it, rk.rank, rk.scale)).join("");
      const as = fx.assists.map(a => {
        const lv = S.lrAssistLv(S.notesTotal(G), a);
        const need = a.notes.map(n => n.replace("の音符", "")).join("・");
        return `<div class="lrfx-card${lv ? "" : " off"}"><div class="lrfx-ah"><b>${esc(a.name)}</b>${lv ? `<span class="lrfx-lv">Lv.${lv}</span>` : '<span class="lrfx-lv off">未発動</span>'}</div>
          ${lv ? a.items.map(it => item(id + ":" + a.id + ":" + it.id, it, lv)).join("") : ""}<div class="lrfx-need">解放条件：${need} ${a.base}以上（Lvごとに+15）</div></div>`;
      }).join("");
      // ゲームのロスレコの画面と同じ並び: 名前 → 「コア効果」の帯と白いカード → 「アシスト効果」の帯と効果ごとのカード（色は薄めにする）
      return `<div class="lrfx" style="grid-column:1/-1"><div class="lrfx-h"><b>${esc(lrName(r))}</b>${rankSel}</div>
        <div class="lrfx-band">コア効果</div><div class="lrfx-card">${core || '<div class="lrfx-it skip">登録されていません</div>'}</div>
        ${as ? `<div class="lrfx-band">アシスト効果<span>音符のレベルで自動で解放</span></div>${as}` : ""}</div>`;
    }).join("");
    // 上の段: 左にロスレコ6枚、右に効果の数（記録レベルは結果の欄の上に出すので、ここには置かない。手で選ぶのは「補正」の画面）。下の段: 音符・メインのロスレコの効果・手入力（横いっぱい）
    return `<div class="wide">${recOcrBox()}<div class="secg lr-g">
      <section class="sec"><h3>ロスレコ</h3>
        <div class="lr-cols"><div>${[0, 1, 2].map(i => slot("lrMain", i, "メイン" + (i + 1))).join("")}</div><div class="lr-sub">${[0, 1, 2].map(i => slot("lrSub", i, "サブ" + (i + 1))).join("")}</div></div>
        ${helpTxt("lr", "基礎ステータスは全員に、コア効果・アシスト効果はメインの3枚だけ入ります。", "属性が違うロスレコの属性ダメージは、その属性の巡遊者だけに入ります。名前に「*」があるものは、日本語Wikiの値です（ゲーム内の画面では未確認。Lv90・ランク8の値）。「突破」で、コア効果の値と基礎攻撃力が変わります（★5の基礎攻撃力は、突破1つごとに +130。サブも基礎攻撃力が変わります）。条件付きの効果は、既定では反映しません（チェックで反映）。")}</section>
      <div class="sec-col">
        <section class="sec"><h3>効果の数</h3><div class="muted help" style="margin:0 0 6px">暁光・星願など。戦闘中のある時点を想定して入力します。</div>
          ${counts ? `<div class="cnt-list">${counts}</div>` : '<p class="muted" style="margin:0">選んでいるメインのロスレコには、数を入れる効果はありません。</p>'}</section>
      </div>
      <section class="sec full"><h3>音符<span class="h-sub">ゲームの記録の「ロスレコスキル」画面の数を、そのまま入れます（サブのロスレコの初期の音符も入った数）</span></h3>${noteIn}</section>
      <section class="sec full"><h3>メインのロスレコの効果</h3>
        <div class="grid-in" style="grid-template-columns:1fr">${fxHtml || '<span class="muted">メインのロスレコを選ぶと、効果が出ます</span>'}</div></section>
      <section class="sec full"><h3>一覧にないロスレコ・サブの合計（手入力）<button type="button" class="help-btn" data-act="manopen" aria-expanded="${manOpen}">${manOpen ? "閉じる" : "開く"}</button>${manHas ? '<span class="tag-ok">入力あり</span>' : ""}</h3>
        ${manOpen ? `<div class="grid-in man-g">
          ${fld("基礎攻撃力 合計", inp(m + ".baseAtk", { w: 100 }))}${fld("基礎HP 合計", inp(m + ".baseHp", { w: 100 }))}
          ${fld("属性ダメージ 合計", inp(m + ".elem", { w: 100 }), "0.66=66%")}${fld("その属性", inp(m + ".elemEl", { sel: [["", "全員"], ["光", "光"], ["水", "水"], ["風", "風"], ["火", "火"], ["地", "地"], ["闇", "闇"]], str: true }))}
          ${fld("通常攻撃ダメージ 合計", inp(m + ".basicDmg", { w: 100 }))}${fld("スキルダメージ 合計", inp(m + ".skillDmg", { w: 100 }))}${fld("攻撃力% 合計", inp(m + ".atkPct", { w: 100 }))}
        </div>` : '<div class="muted help" style="margin:0">一覧にないロスレコを使うときに、基礎攻撃力・属性ダメージなどの合計を手で入れます。「開く」で入力欄が出ます。</div>'}</section>
      </div></div>`;
  }

  // ---- ロスレコを選ぶ画面（カードの一覧としぼり込み） ----
  // カード: 名前・★・属性・タグ・コア効果の要点・基礎攻撃力と属性ダメージ（サブの枠のときは初期の音符も）
  // しぼり込み: ゲームのフィルタと同じ（レアリティ・属性・役割・音符）＋入手先・文字（名前・効果の文・アシスト効果の名前で探す）。並びは、編成の巡遊者と同じ属性 → ★の多い順
  // 入手先（モチーフ・イベント・大討伐・事業支援・防衛戦）: 分かっているもの（S.LR_SRC）だけ、しぼり込みとカードの札に出す
  // タグ: データには「元素/スキル」のように区切ったものと、「元素スキルシールド」のように続けて書いたものがある。
  //   区切ったものから言葉の一覧を作り、続けて書いたものはその言葉で切り分ける（長い言葉を先に当てる）
  //   ロスレコの一覧（LOSTRECORDS）に取り込むときにタグが落ちているので、Wikiから作ったデータ（LR_AUTO）から名前で引く
  const lrTagStr = r => r.tags || ((window.LR_AUTO || []).find(x => x.name === r.name) || {}).tags || "";
  let LR_VOCAB = null;
  // ゲームのフィルタの「役割」（2026-11-22 ユーザーのスクショの順）。切り分けの言葉にも使う
  const LR_ROLES = ["攻撃", "弱点", "シールド", "従者", "印", "会心", "HP", "防御力", "与ダメージ↑", "チャージ", "元素", "汎用", "被ダメージ↓", "通常攻撃", "必殺技", "スキル", "会心ダメージ"];
  const lrVocab = () => LR_VOCAB || (LR_VOCAB = [...new Set(LR_ROLES.concat(LOSTRECORDS.flatMap(r => { const t = String(lrTagStr(r)); return t.indexOf("/") >= 0 ? t.split("/").map(x => x.trim()) : []; })).filter(Boolean))].sort((a, b) => b.length - a.length));
  const lrTags = r => {
    let t = String(lrTagStr(r)); if (!t) return [];
    if (t.indexOf("/") >= 0) return t.split("/").map(x => x.trim()).filter(Boolean);
    const out = [];
    lrVocab().forEach(v => { const i = t.indexOf(v); if (i >= 0) { out.push([i, v]); t = t.slice(0, i) + " ".repeat(v.length) + t.slice(i + v.length); } });
    return out.sort((a, b) => a[0] - b[0]).map(x => x[1]);
  };
  const lrCoreTxt = r => { const fx = S.LR_FX[r.id]; if (!fx) return []; return fx.core.map(it => typeof it.txt === "function" ? it.txt(6) : it.txt).filter(Boolean); };
  const lrSearchTxt = r => { const fx = S.LR_FX[r.id] || {}; return [r.name, r.element, lrTagStr(r)].concat(lrCoreTxt(r), (fx.assists || []).map(a => a.name)).join(" "); };
  function renderLrDlg() {
    const dlg = $("lrDlg"); if (!dlg || !dlg.open || !V.lrp) return;
    const st = V.lrp, [arr, idx] = st.path.split("."), isSub = arr === "lrSub", L = LOSTRECORDS;
    const cur = (G[arr] || [])[+idx] || "", used = new Set([].concat(G.lrMain || [], G.lrSub || []).filter(Boolean));
    const teamEl = SLOTS.map(([k]) => chOf(G.team[k]).el);
    // しぼり込みはゲームのフィルタと同じ項目・同じ順（レアリティ・属性・役割・音符）に、入手先と文字の検索を足したもの。
    //   どれも複数選べる（同じ項目の中は「どれか」、項目どうしは「全部」）。何も選ばない＝すべて
    const ELS = ["水", "火", "地", "風", "光", "闇", "なし"];
    const NOTES13 = S.NOTE_ALL.map(n => n.replace("の音符", ""));
    const q = (st.q || "").trim();
    const SRCS = [...new Set(L.map(S.lrSrc).filter(Boolean))];
    const has = (key, v) => !st[key].length || st[key].indexOf(v) >= 0;
    const elOf = r => !r.element || r.element === "なし" ? "なし" : r.element;
    const notesOf = r => ((r.sub && r.sub.startNotes) || []).map(n => n.note.replace("の音符", ""));
    const list = L.filter(r => has("star", String(r.rarity)) && has("el", elOf(r)) && (!st.role.length || lrTags(r).some(t => st.role.indexOf(t) >= 0))
      && (!st.note.length || notesOf(r).some(n => st.note.indexOf(n) >= 0)) && has("src", S.lrSrc(r)) && (!q || lrSearchTxt(r).indexOf(q) >= 0))
      .map((r, i) => [r, i]).sort((a, b) => {
        const ea = teamEl.indexOf(a[0].element), eb = teamEl.indexOf(b[0].element);
        return ((ea < 0 ? 9 : ea) - (eb < 0 ? 9 : eb)) || ((b[0].rarity || 0) - (a[0].rarity || 0)) || (a[1] - b[1]);
      }).map(x => x[0]);
    const chip = (key, v, label) => { const on = v === "" ? !st[key].length : st[key].indexOf(v) >= 0;
      return `<button type="button" class="lrp-chip${on ? " on" : ""}" aria-pressed="${on}" data-act="lrpf:${key}:${esc(v)}">${label}</button>`; };
    const stat = r => { const s2 = r.stats || {}, out = [];
      if (s2.baseAtk) out.push(S.lrAtkScalable(r) ? `基礎攻撃力 ${S.lrAtkMax(r) - 650}〜${S.lrAtkMax(r)}` : `基礎攻撃力 ${Math.round(s2.baseAtk)}`);
      if (s2.baseHp) out.push(`基礎HP ${Math.round(s2.baseHp)}`);
      if (s2.elemDmg) out.push(`${r.element}属性ダメージ ${Math.round(s2.elemDmg * 1000) / 10}%`);
      if (s2.skillDmg) out.push(`スキルダメージ ${Math.round(s2.skillDmg * 1000) / 10}%`);
      if (s2.ultDmg) out.push(`必殺技ダメージ ${Math.round(s2.ultDmg * 1000) / 10}%`);
      return out.join(" ／ "); };
    const card = r => {
      const core = lrCoreTxt(r).slice(0, 2), notes = ((r.sub && r.sub.startNotes) || []).map(n => `${n.note.replace("の音符", "")} ${n.lv}`).join("・");
      return `<button type="button" class="lrp-card${r.id === cur ? " cur" : ""}" style="--elc:${EL_COLOR[r.element] || "#8a8fb8"}" data-act="lrpset:${esc(r.id)}">
        <span class="lrp-h"><i class="lr-el"></i><b>${esc(r.name)}${r.auto || r.autoFx ? "*" : ""}</b><small>★${r.rarity || "?"}・${esc(r.element)}</small>${S.lrSrc(r) ? `<span class="lrp-src">${esc(S.lrSrc(r))}</span>` : ""}${r.id === cur ? '<span class="tag-ok">この枠</span>' : used.has(r.id) ? '<span class="tag-ng">ほかの枠で選択中</span>' : ""}</span>
        ${lrTags(r).length ? `<span class="lrp-tags">${lrTags(r).map(t => `<span>${esc(t)}</span>`).join("")}</span>` : ""}
        ${core.length ? `<span class="lrp-core">${core.map(t => esc(t)).join("<br>")}</span>` : '<span class="lrp-core muted">コア効果は未登録</span>'}
        <span class="lrp-st">${stat(r)}${isSub && notes ? `<br>初期の音符: ${esc(notes)}` : ""}</span></button>`;
    };
    // フィルタの折りたたみ: 見出しの右端のボタン。たたむと、しぼり込みのボタンの行を隠す（探す欄は残す）。選んでいる数を出す（2026-11-22 ユーザー）
    const nOn = ["star", "el", "src", "role", "note"].reduce((a, k) => a + st[k].length, 0), fold = !!V.lrpFold;
    const FUNNEL = `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 5h18l-7 8.5V19l-4 2v-7.5L3 5z"/></svg>`;
    $("lrBody").innerHTML = `<h2 id="lrDlgT"><span class="en">LOST RECORD</span>${isSub ? "サブ" : "メイン"}${+idx + 1}のロスレコを選ぶ<button type="button" class="lrp-fold${fold ? "" : " on"}" aria-expanded="${!fold}" data-act="lrp-fold" title="${fold ? "フィルタを開く" : "フィルタをたたむ"}">${FUNNEL}フィルタ${nOn ? `<b>${nOn}</b>` : ""}<span aria-hidden="true">${fold ? "▼" : "▲"}</span></button></h2>
      <div class="lrp-fs"${fold ? " hidden" : ""}>
      <div class="lrp-f"><span class="lrp-l">★</span>${chip("star", "", "すべて")}${["5", "4", "3"].map(v => chip("star", v, "★" + v)).join("")}</div>
      <div class="lrp-f"><span class="lrp-l">属性</span>${chip("el", "", "すべて")}${ELS.map(e => chip("el", e, e)).join("")}</div>
      ${SRCS.length ? `<div class="lrp-f"><span class="lrp-l">入手</span>${chip("src", "", "すべて")}${SRCS.map(v => chip("src", v, esc(v))).join("")}<span class="muted" style="font-size:11px;margin-left:6px">（分かっているものだけ）</span></div>` : ""}
      <div class="lrp-f"><span class="lrp-l">役割</span>${chip("role", "", "すべて")}${LR_ROLES.map(t => chip("role", t, esc(t))).join("")}</div>
      <div class="lrp-f"><span class="lrp-l">音符</span>${chip("note", "", "すべて")}${NOTES13.map(n => chip("note", n, esc(n))).join("")}<span class="muted" style="font-size:11px;margin-left:6px">（サブの初期の音符）</span></div>
      </div>
      <div class="lrp-f"><span class="lrp-l">探す</span><input type="search" id="lrp-q" value="${esc(st.q || "")}" placeholder="名前・効果の文・アシスト効果の名前"></div>
      <p class="muted" style="margin:6px 0">${list.length}件。編成の巡遊者と同じ属性のものから並べています。名前の「*」は日本語Wikiの値（ゲームの画面では未確認）です。</p>
      <div class="lrp-grid">${list.map(card).join("") || '<p class="muted">当てはまるロスレコがありません</p>'}</div>
      <div class="foot"><button class="btn-add" data-act="lrpset:">この枠を空にする</button><span style="flex:1"></span><button class="btn-add pri" data-act="lrp-close">閉じる</button></div>`;
  }
  try { V.lrpFold = localStorage.getItem("stellasora-sim-lrpfold") === "1"; } catch (e) { /* 無視 */ }   // フィルタをたたんだかは、見る人ごとに覚えておく
  function openLrDlg(path) {
    const [arr, idx] = path.split("."), cur = (G[arr] || [])[+idx], r = cur && LOSTRECORDS.find(x => x.id === cur);
    V.lrp = { path, el: [r ? (r.element || "なし") : chOf(G.team.main).el], star: [], role: [], note: [], src: [], q: "" };
    $("lrDlg").showModal(); renderLrDlg(); $("lrDlg").scrollTop = 0;
  }

  // ---- ギミック・補正 ----
  // 敵は、先に種類（指名手配・首領討伐・防衛戦）を選んでから選ぶ。種類は名前から決める
  const ENEMY_CATS = [["指名手配", /指名手配/], ["首領討伐", /首領討伐/], ["防衛戦", /防衛戦/]];
  const enemyCat = e => (ENEMY_CATS.find(([, re]) => re.test(e.name)) || ENEMY_CATS[0])[0];
  // 指名手配はシーズンの新しい順（同じシーズンの中はデータの順）
  const enemiesOf = cat => S.ENEMIES.map((e, i) => [e, i]).filter(([e]) => enemyCat(e) === cat).sort((a, b) => ((b[0].season || 0) - (a[0].season || 0)) || (a[1] - b[1])).map(([e]) => e);
  function renderGimmick() {
    const en = G.enemyObj;
    const tr = S.DEFAULT_ENEMY_TRAITS[G.enemy] || [];
    return `<div class="wide"><div class="secg">
      <section class="sec"><h3>敵</h3>
        ${fld("種類", `<select id="enemy-cat">${ENEMY_CATS.map(([k]) => `<option${k === enemyCat(G.enemyObj) ? " selected" : ""}>${k}</option>`).join("")}</select>`)}
        ${fld("敵", inp("enemy", { sel: enemiesOf(enemyCat(G.enemyObj)).map(e => [e.id, (e.season ? `シーズン${e.season}：` : "") + e.name.replace(/（(指名手配|首領討伐)・/, "（")]), str: true }))}
        <p class="note">弱点: ${en.weak.join("・") || "なし"}（弱点補正 ×${en.weakMult}）／防御倍率 ${en.def}／印の別枠 ×${en.markX}／主力の最大HP +${pct(en.hpBonus)}${en.teamHp ? `／全員のHP +${pct(en.teamHp)}・攻撃 +${pct(en.teamAtk)}・会心率 +${pct(en.teamCrit)}` : ""}</p>
        ${en.note ? `<p class="muted" style="margin:6px 0 0">${esc(en.note)}</p>` : ""}</section>
      <section class="sec"><h3>敵の状態</h3>
        ${tr.map(t => `<label class="check" style="font-weight:400"><input type="checkbox" data-p="traits.${t.id}" data-t="b"${G.traits[t.id] ? " checked" : ""}>${esc(t.name)}</label>`).join("")}
        <label class="check" style="font-weight:400"><input type="checkbox" data-p="glimmer" data-t="b"${G.glimmer !== false ? " checked" : ""}>敵に「残光」が付いている（光チームの素質の条件）</label></section>
      </div></div>`;
  }
  function renderAdjust() {
    const en = G.enemyObj;
    const els = ["光", "水", "風", "火", "地", "闇"];
    // 記録レベル: 既定はビルドのスコアから自動で決める。ゲームと合わないときだけ、ここで手で選ぶ（2026-11-22 ユーザー。前は「ロスレコ」の画面にあった）
    const recAuto = G.recordAuto !== false, recSc = S.recordScore ? S.recordScore(G) : null;
    const recNext = recSc != null ? (RECORD_LEVELS || []).find(x => x[1] > recSc) : null, rb = E.recordBonus(G.recordLv);
    const recOpts = (RECORD_LEVELS || []).map(x => [x[0], `Lv${x[0]}（攻撃+${x[2]} / HP+${x[3]}）`]);
    const recSec = `<section class="sec"><h3>記録レベル<span class="h-sub">ふだんはビルドから自動で決めます。ゲームと合わないときだけ手で選びます</span></h3>
        <label class="check" style="margin:0 0 6px"><input type="checkbox" data-p="recordAuto" data-t="b"${recAuto ? " checked" : ""}> ビルドから自動で決める</label>
        ${recAuto ? inp("recordLv", { sel: recOpts }).replace("<select ", "<select disabled ") : inp("recordLv", { sel: recOpts })}
        <div class="muted help">${recSc != null ? `記録のスコア ${fmt(recSc)}${recNext ? `（次の Lv${recNext[0]} まで あと ${fmt(recNext[1] - recSc)}）` : ""}。` : ""}戦闘中に全員の基礎攻撃力 +${fmt(rb.atk)}・基礎HP +${fmt(rb.hp)}（%を掛ける前に足します）。スコアは、コア素質1つ 180・通常素質のLv1つ 60・音符1個 15（ロスレコの初期の音符も数える）・アシスト効果のLv1つ 120 で数えます（徽章の＋は数えません）。</div></section>`;
    return `<div class="wide"><div class="secg"><div class="sec-col">
      <section class="sec"><h3>補正（敵の数値の上書きと、「その他倍率」）</h3>
        <div class="adj-list">
          ${fld("その他倍率（全体に掛ける）", inp("other.mult", { w: 100 }), "不明な倍率を入れる")}${fld("被ダメージ（別枠の乗算）", inp("other.taken", { w: 100 }), "1.15 = +15%")}
          ${fld("敵の防御倍率 上書き", inp("enemyOv.def", { w: 100 }), "空=" + en.def)}${fld("弱点補正 上書き", inp("enemyOv.weakMult", { w: 100 }), "空=" + en.weakMult)}
          ${fld("印の別枠 上書き", inp("enemyOv.markX", { w: 100 }), "空=" + en.markX)}
        </div></section>
      ${recSec}</div>
      <section class="sec"><h3>敵の属性ごとの耐性と、実測合わせの倍率</h3>
        <table class="adj-t"><tr><th>属性</th><th>耐性（空=既定）</th><th>その他（実測合わせ）</th></tr>
        ${els.map(e => `<tr><td>${e}${en.weak.indexOf(e) >= 0 ? "（弱点）" : ""}</td><td>${inp(`enemyOv.res.${e}`, { w: 90 })}<span class="muted"> 既定 ${en.res[e] != null ? en.res[e] : (en.resDefault != null ? en.resDefault : 250)}</span></td><td>${inp(`enemyOv.extra.${e}`, { w: 90 })}<span class="muted"> 既定 ${(en.extra && en.extra[e]) || 1}</span></td></tr>`).join("")}</table>
        <p class="muted">耐性の式は、有効耐性 = 耐性 − 貫通 のとき 倍率 = 1 − 0.25×(E/250)²（実測と一致）。「その他」は、原因が分かっていない差を合わせるための倍率です。</p></section>
      </div></div>`;
  }
  // ---- 3分間の回数・与ダメへの寄与率は sim_contrib.js（比較ページと共通）----
  const { rotDefault, rotCount, dmgParts, sum3, embShort } = S.contrib;
  function calcContrib() {
    return S.contrib.calcContrib(G, { cmp: V.cmp, more: ({ k, pot, potLvSet }) => {
      // 未取得の素質（Lv0）は、チェックしたときだけ出す（特化構築の違うものまで出ると、見分けにくいため）。計算に入らないものは出さない
      if (V.potAll) potItems(k).filter(x => !x.lv && !x.noeff && !x.tags.some(t => t.indexOf("計算に未対応") >= 0)).forEach(x =>
        pot(`pa:${x.path}`, x.name + (x.grp ? ` (${x.grp.replace("特化構築", "特化")})` : ""), 0, x.core ? 1 : x.path.indexOf(".pots2.") >= 0 ? POT_LV_EMB_MAX : POT_LV_MAX, (!x.core && x.path.indexOf(".pots2.") >= 0) ? potLvSet(x.en) : (g, v) => { const ks = x.path.split("."); let o = g; ks.slice(0, -1).forEach(q => { o[q] = o[q] || {}; o = o[q]; }); o[ks[ks.length - 1]] = v; }));
    } });
  }
  let contribCache = { key: "", items: null }, orderCache = { key: "", ids: [] };
  function getContrib() {
    const gk = JSON.stringify(G) + (V.potAll ? "|all" : ""), key = gk + JSON.stringify(V.cmp || {});   // 入力が変わっていなければ、前の結果を使う
    if (contribCache.key !== key) {
      const items = calcContrib(), id = x => x.uid;
      // 並び順は、ビルドの入力が変わったときだけ決め直す（◀▶で比べる値を変えても、行が動かないように）
      if (orderCache.key !== gk) orderCache = { key: gk, ids: items.map(id) };
      const pos = x => { const i = orderCache.ids.indexOf(id(x)); return i < 0 ? 1e9 : i; };
      items.sort((a, b) => pos(a) - pos(b));
      contribCache = { key, items };
    }
    return contribCache.items;
  }
  // ---- ビルドカード（画像）。1人1列で3人分、下にロスレコと音符。絵は使わず、名前・属性の色・数字で描く ----
  const EL_COLOR = { 光: "#E8B10F", 水: "#2BA6DE", 火: "#E5533D", 風: "#3FA86A", 地: "#A0703C", 闇: "#6B4FA0" };
  const Q_COLOR = { green: "#4FB58A", blue: "#4E8FD6", gold: "#E3A93A", rainbow: "#C25FD0", rainbow2: "#C25FD0", rainbow3: "#C25FD0" };
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
      // ステータス: ステ画面（ゲームのステータス画面）と戦闘中（素質・スキル・ロスレコの効果も足した値）を並べる
      const o = E.outsideStats(c, cs), v = E.battleView(R.team[id], G);
      const stats = [["HP", fmt(o.hp), fmt(v.hp)], ["攻撃力", fmt(o.atk), fmt(v.atk)], ["会心率", pct(o.critRate), pct(v.critRate.common)], ["会心ダメージ", pct(o.critDmg), pct(v.critDmg.common)],
        [c.el + "属性ダメージ", pct(o.elemAdd), pct(v.elem)], ["属性耐性貫通", fmt(o.pen), fmt(Math.min(v.pen, 250))]];
      const xs = X0 + colW - 190, xb = X0 + colW - 22;
      txt("ステ画面", xs, top + 122, 14, "#9AA0C8", { align: "right" }); txt("戦闘中", xb, top + 122, 14, "#08808A", { align: "right" });
      stats.forEach(([n, a, v], i) => { const yy = top + 148 + i * 30; txt(n, X0 + 22, yy, 19, "#5F6492"); txt(a, xs, yy, 19, "#5F6492", { align: "right", w: 500 }); txt(v, xb, yy, 22, "#1E2250", { align: "right", w: 900 }); });
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
          txt(embShort(id, sl), sx + 10, sy, 17, "#1E2250", { max: 244, w: 500 });   // 素質のレベル上昇は「素質名 +3」
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
    txt("ロスレコ", 56, by + 42, 18, "#D9DCED");   // 右の音符（見出し＋2行）と行をそろえる
    [["メイン", G.lrMain], ["サブ", G.lrSub]].forEach(([n, arr], i) => {
      const yy = by + 80 + i * 34;
      txt(n, 56, yy, 19, "#D9DCED", { w: 500 });
      [0, 1, 2].forEach(j => txt(lrn((arr || [])[j]), 140 + j * 250, yy, 20, "#FFFFFF", { max: 236 }));
    });
    const ntc = S.notesTotal(G), total = S.NOTE_ALL.reduce((a, n) => a + (+ntc[n] || 0), 0);
    txt(`音符（合計 ${total}）`, 930, by + 42, 18, "#D9DCED");
    const nv = n => +ntc[n] || 0;
    const elShow = S.NOTE_ELEM.filter(n => nv(n) > 0).sort((a, b) => nv(b) - nv(a)).slice(0, 3);
    S.NOTE_BASE.concat(elShow).forEach((n, i) => {
      const nx = 930 + (i % 5) * 162, ny = by + 80 + Math.floor(i / 5) * 34, v = ntc[n] || 0;
      txt(n.replace("の音符", ""), nx, ny, 19, "#D9DCED", { w: 500 });
      txt(String(v), nx + 128, ny, 22, v ? "#FFFFFF" : "#8A90BE", { align: "right", w: 900 });
    });
    txt((hasAuto ? "＊は未確認のデータ。" : "") + "sim.stella-tool.com・β版", 56, by + 156, 15, "#D9DCED", { w: 500, max: W - 112 });
    return cv;
  }
  let cardUrl = "";
  async function makeCard() {
    try { await document.fonts.ready; } catch (e) { /* 無視 */ }
    cardUrl = drawCard().toDataURL("image/png");
    renderAll();
  }

  // ---- ① 読込: 新しく作る（巡遊者を一覧から3人）・プリセットコード・共有コード・保存したビルド ----
  // 巡遊者の一覧は、素質ノートと同じ並び（属性ごと、その中は ★5 → ★4、それぞれ実装の新しい順）
  const EL_ORDER = ["水", "火", "風", "地", "光", "闇"];
  // 巡遊者のドロップダウン用: その属性の巡遊者を、あいうえお順で
  const chOfEl = el => S.CH.filter(c => c.el === el).sort((a, b) => a.jp.localeCompare(b.jp, "ja"));
  // 巡遊者の一覧の並び: 属性ごとに、実装順（新しい順）か、あいうえお順。選んだ並びはこのブラウザに覚える
  let pkSort = "rel";
  try { if (localStorage.getItem("stellasora-sim-pksort") === "kana") pkSort = "kana"; } catch (e) { /* 無視 */ }
  function pickList() {
    const info = c => { const t = TK(c.en) || {}; return { c, rar: t.rarity || 0, rel: t.release || "", id: t.id || 0 }; };
    const cmp = pkSort === "kana" ? (a, b) => a.c.jp.localeCompare(b.c.jp, "ja")
      : (a, b) => String(b.rel).localeCompare(String(a.rel)) || (b.id - a.id);   // 実装日が同じなら、ゲームの番号の大きいほうを先に
    // 実装されたばかりで数値がまだない巡遊者（data/trekkers_new.js）は、選べないカード「データ待ち」で、その属性の先頭に出す
    const ELJ = { Aqua: "水", Ignis: "火", Ventus: "風", Terra: "地", Lux: "光", Umbra: "闇" };
    const pend = el => (window.TREKKERS_PENDING || []).filter(t => ELJ[t.element] === el);
    return EL_ORDER.map(el => ({ el, pend: pend(el), list: S.CH.filter(c => c.el === el).map(info).sort(cmp).map(x => x.c) })).filter(g => g.list.length || g.pend.length);
  }
  // 押すと、空いている枠の一番前（主力 → 支援1 → 支援2）に入る。選んである人を押すと、その枠が空く
  function pickToggle(id) {
    const p = V.pick3 = V.pick3 || { main: null, s1: null, s2: null };
    const has = SLOTS.find(([k]) => p[k] === id);
    if (has) { p[has[0]] = null; return; }
    const free = SLOTS.find(([k]) => !p[k]);
    if (free) p[free[0]] = id;
  }
  function savedBuilds() { try { return JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { return {}; } }
  const msgOf = key => DM[key] ? `<div class="msg${DM[key].ng ? " ng" : " ok"}">${esc(DM[key].t)}</div>` : "";
  // 巡遊者の一覧（ポップアップ）。開いている間は、描き直しのたびに中身も描き直す
  // ---- 条件を指定してビルドを作る（試作）: ロスレコ → 記録Lv → できたビルド ----
  function renderWiz() {
    const p = V.pick3, w = V.wiz, team = { main: p.main, s1: p.s1, s2: p.s2 };
    const who = SLOTS.map(([k, l]) => `${l}：${esc(chOf(team[k]).jp)}`).join("　");
    const head = (n, t) => `<h2 id="pickDlgT"><span class="en">BUILD ${n}/3</span>${t}</h2><p class="muted" style="margin:0 0 8px">${who}</p>`;
    if (w.step === "lr") {
      if (!w.rec) { const g = defState(); g.team = team; w.rec = S.contrib.recommendLR(g); }
      const sel = w.lr || [];
      const rows = w.rec.slice(0, w.more ? 999 : 15).map((r, i) => `<label class="wz-lr${sel.indexOf(r.id) >= 0 ? " on" : ""}"><input type="checkbox" data-act="wiz-lr:${esc(r.id)}"${sel.indexOf(r.id) >= 0 ? " checked" : ""}><span class="wz-n">${i + 1}</span><span class="wz-nm">${esc(r.name)}<small>★${r.rarity}・${esc(r.el)}</small></span><b>+${(r.gain * 100).toFixed(1)}%</b></label>`).join("");
      return `${head(1, "ロスレコを選ぶ")}
        ${helpTxt("wz-lr", "巡遊者の属性に合うロスレコを、メインに1枚入れたときにダメージが大きく伸びる順に並べています。持っているものに、いくつでもチェックを付けてください（メイン3枚・サブ3枚は自動で選びます）。", "伸びは、突破I・素質なし・音符なしで、そのロスレコ1枚だけを入れたときの値です。チェックしたものから、メインに3枚、残りからサブに3枚を、1枚ずつダメージがいちばん伸びるものを選んで入れます（サブは基礎ステータスと初期の音符だけが効きます）。アシスト効果は、次の段で音符をそろえたときに入ります。")}
        <div class="wz-list">${rows}</div>${w.rec.length > 15 && !w.more ? `<button type="button" class="help-btn" data-act="wiz-more" style="margin-top:6px">ほかのロスレコも出す（${w.rec.length - 15}枚）</button>` : ""}
        <div class="foot"><button class="btn-add" data-act="wiz:pick">戻る</button><button type="button" class="btn-add pri" data-act="wiz:lv"${sel.length ? "" : " disabled"}>次へ（${sel.length}枚）</button></div>`;
    }
    if (w.step === "lv") {
      const opts = (RECORD_LEVELS || []).map(x => `<option value="${x[0]}"${+w.lv === x[0] ? " selected" : ""}>記録Lv${x[0]}（スコア ${fmt(x[1])}）</option>`).join("");
      return `${head(2, "記録レベルを選ぶ")}
        ${helpTxt("wz-lv", "目指す記録レベルを選んでください。そのレベルの必要スコアの中で、ダメージがいちばん伸びるように素質と音符を割り振ります。", "スコアは、コア素質1つ180・サブ素質Lv1つ60・音符1個15・アシスト効果Lv1つ120で数えます（ゲームの記録で検算済み）。1点あたりのダメージの伸びが大きいものから順に取っていきます。")}
        <div class="ld-line" style="grid-template-columns:minmax(0,320px)"><select data-act="wiz-lvsel">${opts}</select></div>
        <div class="foot"><button class="btn-add" data-act="wiz:lr">戻る</button><button type="button" class="btn-add pri" data-act="wiz:done">ビルドを作る</button></div>`;
    }
    // できたビルド
    if (!w.plan) { const g = defState(); g.team = team; w.plan = S.contrib.planBuild(g, { owned: w.lr, recordLv: +w.lv }); }
    const pl = w.plan, g = pl.g, LR = LOSTRECORDS;
    const potsOf = id => { const cs = g.chars[id]; return Object.keys(cs.pots2).filter(k => cs.pots2[k] > 0).map(k => ({ k, lv: cs.pots2[k], nm: (Object.keys(S.POT_SPEC[id] || {}).find(n => S.potKey(n) === k)) || k })); };
    const isCore = (id, k) => { const tk = TK(chOf(id).en), role = g.team.main === id ? "main" : "support"; return ((tk && tk.potentials[role]) || []).some(gr => gr.potentials.some(x => x.type === 1 && S.potKey(x.name) === k)); };
    const charHtml = SLOTS.map(([k, l]) => { const id = g.team[k], ps = potsOf(id);
      return `<div class="sec"><h3>${l}：${esc(chOf(id).jp)}</h3>${ps.length ? `<ul class="wz-pots">${ps.sort((a, b) => isCore(id, b.k) - isCore(id, a.k) || b.lv - a.lv).map(x => `<li>${esc(JA(x.nm, id))}<b>${isCore(id, x.k) ? "コア" : "Lv" + x.lv}</b></li>`).join("")}</ul>` : '<p class="muted" style="margin:0">素質なし</p>'}</div>`; }).join("");
    const notes = S.NOTE_ALL.filter(n => +(g.notes || {})[n] > 0).map(n => `<li>${n.replace("の音符", "")}<b>${g.notes[n]}</b></li>`).join("");
    const nt = S.notesTotal(g);
    const asl = g.lrMain.filter(Boolean).map(rid => { const fx = S.LR_FX[rid], r = LR.find(x => x.id === rid); return `<li>メイン：${esc(r ? r.name : rid)}<b>突破I</b>${fx ? fx.assists.map(a => { const lv = S.lrAssistLv(nt, a); return `<small>${esc(a.name)} ${lv ? "Lv" + lv : "未発動"}</small>`; }).join("") : ""}</li>`; }).join("") + g.lrSub.filter(Boolean).map(rid => { const r = LR.find(x => x.id === rid); return `<li>サブ：${esc(r ? r.name : rid)}<b>突破I</b>${r && r.sub && r.sub.length ? `<small>初期の音符 ${r.sub.map(x => `${esc(String(x.note).replace("の音符", ""))}+${x.lv}`).join("・")}</small>` : ""}</li>`; }).join("");
    return `${head(3, "できたビルド")}
      ${helpTxt("wz-done", `記録Lv${w.lv}（スコア ${fmt(pl.budget)}）で、ダメージがいちばん伸びるように割り振った目安です。最初はこれを目指してビルドしてみてください（試作）。`, "素質は、取れるかどうかは考えずに、ダメージの伸びだけで選んでいます。音符は、ロスレコのアシスト効果が発動するところも見ています。ロスレコの突破はIで計算しています。")}
      <p style="margin:6px 0 10px;font-weight:700">スコア ${fmt(pl.score)} / ${fmt(pl.budget)}</p>
      <div class="secg" style="grid-template-columns:repeat(3,minmax(0,1fr))">${charHtml}</div>
      <div class="secg" style="margin-top:12px"><div class="sec"><h3>音符</h3><ul class="wz-pots">${notes || "<li>なし</li>"}</ul></div><div class="sec"><h3>ロスレコ</h3><ul class="wz-pots">${asl}</ul></div></div>
      <div class="foot"><button class="btn-add" data-act="wiz:lv">戻る</button><button type="button" class="btn-add pri" data-act="wiz-apply">このビルドで始める</button></div>`;
  }
  // 「条件を指定してビルドを作る」は試作なので隠しておく。手元で開いたとき、または URL に ?wizard=1 を付けて開いたとき（このブラウザに覚える）だけ出す。?wizard=0 で消す
  const WIZ_ON = (() => {
    const q = new URLSearchParams(location.search).get("wizard");
    try { if (q === "1") localStorage.setItem("stellasora-sim-wizard", "1"); if (q === "0") localStorage.removeItem("stellasora-sim-wizard"); } catch (e) { /* 無視 */ }
    let on = false; try { on = localStorage.getItem("stellasora-sim-wizard") === "1"; } catch (e) { /* 無視 */ }
    return on || q === "1" || location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  })();
  function renderPick() {
    const dlg = $("pickDlg"); if (!dlg || !dlg.open) return;
    const p = V.pick3 = V.pick3 || { main: null, s1: null, s2: null };
    const slotOf = id => SLOTS.find(([k]) => p[k] === id);
    const card = c => {
      const s = slotOf(c.id), rar = (TK(c.en) || {}).rarity || 0;
      return `<button type="button" class="pk${s ? " on" : ""}" aria-pressed="${!!s}" data-act="pick:${c.id}" style="--elc:${EL_COLOR[c.el] || "#4B5082"}">
        <span class="pk-ic" aria-hidden="true">${esc([...c.jp][0])}</span><span class="pk-nm">${esc(c.jp)}${c.auto ? "*" : ""}</span><span class="pk-rar">★${rar}</span>${s ? `<span class="pk-slot">${s[1]}</span>` : ""}</button>`;
    };
    const pendCard = t => `<button type="button" class="pk pk-pend" disabled title="実装されたばかりで、スキル・素質の数値がまだそろっていません" style="--elc:${EL_COLOR[{ Aqua: "水", Ignis: "火", Ventus: "風", Terra: "地", Lux: "光", Umbra: "闇" }[t.element]] || "#4B5082"}">
        <span class="pk-ic" aria-hidden="true">${esc([...t.jp][0])}</span><span class="pk-nm">${esc(t.jp)}</span><span class="pk-rar">データ待ち</span></button>`;
    const chosen = SLOTS.map(([k, l]) => `<span class="pk-ch${p[k] ? " on" : ""}">${l}：${p[k] ? esc(chOf(p[k]).jp) : "（空き）"}</span>`).join("");
    const full = SLOTS.every(([k]) => p[k]);
    const ls = dlg.querySelector(".pk-list"), keep = ls ? ls.scrollTop : 0, keepD = dlg.scrollTop;   // 描き直しても、一覧のスクロールの位置を保つ
    if (V.wiz && V.wiz.step !== "pick") { $("pickBody").innerHTML = renderWiz(); return; }
    $("pickBody").innerHTML = `<h2 id="pickDlgT"><span class="en">NEW</span>巡遊者を選んで作る</h2>
      ${helpTxt("pick", "巡遊者を押すと、主力 → 支援1 → 支援2 の順に入ります。もう一度押すと外れます。", "選んである人を押すとその枠が空き、次に押した人がその空いた枠に入ります。3人そろったら「計算に選んだ巡遊者を反映する」を押してください（入力中のデータは、すべて初期値に戻ります）。「条件を指定してビルドを作る」では、ロスレコと記録レベルを選ぶと、素質と音符を割り振ったビルドを作ります（試作）。")}
      <div class="pk-bar">${chosen}<span style="flex:1"></span><span class="unitbar" role="group" aria-label="並び順"><button type="button" class="${pkSort === "rel" ? "on" : ""}" aria-pressed="${pkSort === "rel"}" data-act="pksort:rel">実装順</button><button type="button" class="${pkSort === "kana" ? "on" : ""}" aria-pressed="${pkSort === "kana"}" data-act="pksort:kana">あいうえお順</button></span></div>
      <div class="pk-list">${pickList().map(g => `<div class="pk-grp"><div class="pk-el" style="--elc:${EL_COLOR[g.el] || "#4B5082"}">${g.el}</div><div class="pk-grid">${g.pend.map(pendCard).join("")}${g.list.map(card).join("")}</div></div>`).join("")}</div>
      ${msgOf("pick")}<div class="foot"><button class="btn-add" data-act="pick-close">閉じる</button><button type="button" class="btn-add" data-act="pick-make"${full ? "" : " disabled"}>${V.pickSure ? "もう一度押して反映する" : "計算に選んだ巡遊者を反映する"}</button>${WIZ_ON ? `<button type="button" class="btn-add pri" data-act="wiz:lr"${full ? "" : " disabled"}>条件を指定してビルドを作る<span class="beta-s" style="margin-left:6px">試作</span></button>` : ""}</div>`;
    const ls2 = dlg.querySelector(".pk-list"); if (ls2) ls2.scrollTop = keep; dlg.scrollTop = keepD;
  }
  function renderLoad() {
    const names = Object.keys(savedBuilds());
    // 「作る」の2つと「読み込む」の3つを、カードに分けて2列に並べる。ほかのサイトの編成データは、使う人が少ないので既定は閉じておく（入力中・読み込んだあとは開く）
    const bjOpen = !!(V.bjOpen || DV.bjson || V.bimp);
    return `<div class="wide"><div class="secg">
      <section class="sec"><h3>新しく作る</h3>
        <div class="sh-line"><button type="button" class="btn-add pri" data-act="pick-open">巡遊者を選んで作る</button></div>
        <div class="muted help">一覧から3人を選びます。入力中のデータは、すべて初期値に戻ります。</div></section>
      <section class="sec"><h3>プリセットコードから作る</h3>
        <div class="ld-line"><input type="text" id="dv-preset" value="${esc(DV.preset)}" placeholder="ゲームの素質プリセットのコード" spellcheck="false"><button class="btn-add" data-act="dv:preset:in">読み込む</button></div>
        ${msgOf("preset")}<div class="muted help">編成と素質Lvが自動的に反映されます（ゲーム内で使われているコードです）。</div></section>
      <section class="sec"><h3>共有コード・共有URLを読み込む</h3>
        <div class="ld-line"><input type="text" id="dv-load" value="${esc(DV.load || "")}" placeholder="例: emtXtc9 ／ https://sim.stella-tool.com/s/emtXtc9" spellcheck="false"><button class="btn-add" data-act="ld-any">読み込む</button></div>
        ${msgOf("load")}<div class="muted help">共有URL・共有コード、どちらでも読み込めます。</div></section>
      <section class="sec"><h3>このブラウザに保存したビルドを読み込む</h3>
        ${names.length ? `<div class="ld-line"><select id="bsel"><option value="">（選んでください）</option>${names.map(n => `<option${n === V.bselPick ? " selected" : ""}>${esc(n)}</option>`).join("")}</select><button class="btn-add" data-act="bload">読み込む</button></div><div class="muted help">名前の変更・コピー・削除は「⑥ 共有・保存」で行えます。</div>` : '<p class="muted">まだありません（「⑥ 共有・保存」で保存できます）。</p>'}
        ${msgOf("build")}</section>
      <section class="sec full"><h3>ほかのサイトの編成データを読み込む<button type="button" class="help-btn" data-act="bjopen" aria-expanded="${bjOpen}">${bjOpen ? "閉じる" : "開く"}</button></h3>
        ${bjOpen ? `<textarea id="dv-bjson" class="codebox" rows="4" spellcheck="false" placeholder='{ "format": "stellasora-build", "schema": 1, "team": [ … ] }'>${esc(DV.bjson || "")}</textarea>
        <div class="sh-line"><button class="btn-add" data-act="bj-in">読み込む</button><label class="btn-add ocr-pick">ファイルを選ぶ<input type="file" accept=".json,application/json" id="bj-file"></label></div>
        ${msgOf("bjson")}${bimpBox()}<div class="muted help">ほかのファンサイトで作った編成データ（JSON）を貼り付けるか、ファイルを選んでください。書いてある項目だけが入り、それ以外は初期値になります。形の決まりは <a href="https://github.com/freiheit-freisein/stellasora-data" target="_blank" rel="noopener">stellasora-data</a> にあります。</div>` : '<div class="muted help" style="margin:0">ほかのファンサイトで作った編成データ（JSON）を読み込みます。「開く」で入力欄が出ます。</div>'}</section>
      </div></div>`;
  }
  // 編成データを読み込んだ結果（読み込めたもの・入れられなかったもの・計算に使わない情報）
  function bimpBox() {
    const r = V.bimp;
    if (!r) return "";
    const ul = (list, cls) => list.length ? `<ul class="${cls}" style="margin:4px 0 4px 18px;padding:0">${list.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : "";
    return `<div class="box" style="font-size:13px"><b>読み込めたもの</b>${ul(r.done, "")}
      ${r.skipped.length ? `<b class="tag-ng" style="display:inline-block;margin-top:4px">入れられなかったもの</b>${ul(r.skipped, "")}` : ""}
      ${r.meta.length ? `<b style="display:inline-block;margin-top:4px">そのほかの情報（計算には使いません）</b>${ul(r.meta, "muted")}` : ""}
      <div class="foot" style="justify-content:flex-start"><button class="btn-add pri" data-act="panel:overview">巡遊者を見る</button></div></div>`;
  }
  function loadBuild(text, key) {
    try {
      const r = S.buildApply(text, defState(), catOfKey);
      G = r.G; V.bimp = r;
      DM[key] = { t: "読み込みました。" + (r.skipped.length ? "入れられなかったものがあります。下の一覧を確かめてください" : "") };
      shareMsg = "編成データを読み込みました";
      renderAll();
    } catch (e) { V.bimp = null; say(key, e.message || "読み込めませんでした", true); }
  }
  // 短い共有コード（短縮URLのID）・共有URL・長い共有コードの、どれでも読み込む
  function loadAny(v) {
    v = (v || "").trim();
    if (!v) return say("load", "共有コードか共有URLを入れてください", true);
    const m = /\/s\/([A-Za-z0-9]{4,16})/.exec(v) || /^([A-Za-z0-9]{4,16})$/.exec(v);
    if (m) {
      say("load", "読み込んでいます…");
      return fetch("/api/short?id=" + m[1]).then(r => r.json()).then(j => j.code ? loadCode(j.code, "load", "共有コードのビルド") : say("load", j.error || "見つかりませんでした", true))
        .catch(() => say("load", "読み込めませんでした（公開しているページで使えます）", true));
    }
    if (v.indexOf("#c=") >= 0) return loadCode(decodeURIComponent(v.slice(v.indexOf("#c=") + 3)), "load", "共有URLのビルド");
    if (v.indexOf("#p=") >= 0) { const hp = S.hashParams(v.slice(v.indexOf("#p="))); return loadPreset(hp.p, "load", hp.e); }
    return loadCode(v, "load", "共有コードのビルド");
  }

  // ---- ⑥ 共有・保存: ビルドカード・共有URL/共有コード（短縮）・プリセットコード・ブラウザに保存 ----
  function cardBlock() {
    return `<div class="box" style="margin:0 0 10px"><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        <button class="btn-add pri" data-act="card-make" style="background:var(--accent);border-color:var(--accent);font-weight:900">${cardUrl ? "カードを作り直す" : "カードを作る"}</button>
        ${cardUrl ? `<a class="btn-add" href="${cardUrl}" download="build-card.png" style="display:inline-flex;align-items:center;text-decoration:none">画像を保存</a>` : ""}
        <span class="muted">${cardUrl ? "入力を変えたら作り直してください。Xに載せるときは、画像を保存してから添付してください。" : "（試作版）3人分の徽章・素質・ロスレコ・音符を1枚の画像にします。"}</span></div>
        ${cardUrl ? `<img src="${cardUrl}" alt="ビルドカード" style="width:100%;margin-top:8px;border-radius:12px;border:2px solid var(--border)">` : ""}</div>`;
  }
  // 手元（localhost・ファイル）で動かしているか。短縮URLのサーバーがないので、長い共有コードの欄も出す
  const IS_LOCAL = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  // Xで共有の本文の最後に足すハッシュタグ（1つずつ選べる。このブラウザに覚える）
  const X_TAGS = ["#ステラソラ", "#ビルド"];
  let xTags = [false, false];
  try { const v = JSON.parse(localStorage.getItem("stellasora-sim-xtags2")); if (Array.isArray(v)) xTags = X_TAGS.map((t, i) => !!v[i]); } catch (e) { /* 無視 */ }
  // 保存したビルドの一覧（名前の変更・コピー・削除）
  function buildsHtml() {
    const names = Object.keys(savedBuilds());
    if (!names.length) return '<p class="muted">まだありません。</p>';
    return `<table class="stt bl-t">${names.map((n, i) => V.renaming === n
      ? `<tr><td colspan="2"><div class="ld-line" style="margin:0"><input type="text" id="bren" value="${esc(n)}"><button class="btn-add pri" data-act="brn-ok">決定</button><button class="btn-add" data-act="brn-no">やめる</button></div></td></tr>`
      : `<tr><td title="${esc(n)}">${esc(n)}</td><td class="bl-b"><button class="btn-add" data-act="bov:${i}">${V.ovSure === n ? "もう一度押して上書き" : "上書き"}</button><button class="btn-add" data-act="brn:${i}">名前を変更</button><button class="btn-add" data-act="bcp:${i}">コピー</button><button class="btn-add" data-act="bdl:${i}">${V.delSure === n ? "もう一度押して削除" : "削除"}</button></td></tr>`).join("")}</table>`;
  }
  function renderShareTab() {
    const url = DV.url || "", sid = (/\/s\/([A-Za-z0-9]+)/.exec(url) || [])[1] || "";
    const copyRow = (label, v, key) => `<div class="ld-row"><span class="ld-lab">${label}</span><input type="text" readonly value="${esc(v)}" placeholder="（「URLを作る」を押すと出ます）"><button class="btn-add" data-act="cp:${key}"${v ? "" : " disabled"}>コピー</button></div>`;
    // 共有するもの（URL・プリセットコード）と、手元に残すもの（保存・カード）をカードに分けて2列に並べる
    return `<div class="wide"><div class="secg">
      <section class="sec"><h3>共有URL・共有コード</h3>
        <div class="sh-line"><button class="btn-add pri" data-act="dv:url:out">URLを作る</button><button class="btn-add xbtn" data-act="share-x">Xで共有</button>
          <span class="xtag"><span class="muted">タグを追加</span>${X_TAGS.map((t, i) => `<label class="check" style="font-weight:400;margin:0"><input type="checkbox" data-act="xtag:${i}"${xTags[i] ? " checked" : ""}>${t}</label>`).join("")}</span></div>
        ${copyRow("共有URL", url, "url")}${copyRow("共有コード", sid, "sid")}
        ${msgOf("url")}<div class="muted help">作成したビルドを他の人に共有できます。コードの場合は「①読込」から入力してください。</div></section>
      <section class="sec"><h3>プリセットコード（ゲーム内で入力できます）</h3>
        <div class="ld-line"><input type="text" id="dv-preset" value="${esc(DV.preset)}" readonly placeholder="（「作る」を押すと出ます）" spellcheck="false"><button class="btn-add" data-act="dv:preset:out">作る</button><button class="btn-add" data-act="dv:preset:copy">コピー</button></div>
        ${msgOf("preset")}<div class="muted help">編成と素質Lvを記録したコードです。ゲーム内のプリセット登録で読み込むことができます。</div>
        <div class="ld-line" style="margin-top:8px"><button class="btn-add" data-act="post-note">素質ノートに投稿する（徽章も）</button></div>
        ${msgOf("post")}<div class="muted help">素質ノートの投稿ページを別のタブで開き、今の編成・素質Lv・徽章を入れた状態にします。同じビルドがすでにあれば、そのビルドの徽章として登録できます。</div>
        ${IS_LOCAL ? `<h3 style="margin-top:16px">長い共有コード</h3>
        <div class="ld-line"><input type="text" id="dv-code" value="${esc(DV.code)}" readonly placeholder="（「作る」を押すと出ます）" spellcheck="false"><button class="btn-add" data-act="dv:code:out">作る</button><button class="btn-add" data-act="dv:code:copy">コピー</button></div>
        ${msgOf("code")}<div class="muted help">サーバーを使わずに作れる、長い形の共有コードです（手元で動かしているときだけ出します）。</div>` : ""}</section>
      <section class="sec"><h3>このブラウザに保存</h3>
        <div class="ld-line"><input type="text" id="bname" placeholder="名前を付けて保存"><button class="btn-add" data-act="bsave">保存</button></div>
        ${msgOf("build")}<div class="muted help">ビルドをブラウザ（ローカルストレージ）に保存します。「① 読込」から読み込むことができます。ご利用中のブラウザだけに残ります。他のPCへ共有するときはURLかコードでお願いします。</div>
        <h4 class="bl-h">保存したビルド</h4>${buildsHtml()}
        <div class="sh-line" style="margin-top:10px"><a class="btn-add" href="compare.html" style="display:inline-flex;align-items:center;text-decoration:none">ビルド比較を開く</a><span class="muted">保存したビルドどうし、または保存したビルドと、それを変えたものを並べて比べます。</span></div></section>
      <section class="sec"><h3>ビルドカード</h3>${cardBlock()}</section>
      </div></div>`;
  }

  // 指名手配の想定スコアは、3分間の回数の注意書きを読んでチェックした人だけに出す（このブラウザに覚える）
  let scoreShow = false;
  try { scoreShow = localStorage.getItem("stellasora-sim-scoreshow") === "1"; } catch (e) { /* 無視 */ }
  function renderScore() {
    // 3分間の回数（目安）の入力
    const rotIn = (id, k, label, d) => fld(label, stepper(`rot.${id}.${k}`, 0, 999, d[k] || 0),
      k === "basic" ? `目安 ${d.basic}（1ローテ${d.basicSec}秒${d.basicMeasured ? "" : "・未測定"}）` : (d.ct[k] ? `目安 ${d[k]}（CD ${d.ct[k]}秒）` : "CDが分かりません。回数を入れてください"));
    const rotHtml = SLOTS.map(([k, l]) => {
      const id = G.team[k], d = rotDefault(id);
      const f = k === "main" ? rotIn(id, "basic", "通常1ローテ", d) + rotIn(id, "main", "主力スキル", d) + rotIn(id, "ult", "必殺技", d) : rotIn(id, "support", "支援スキル", d) + rotIn(id, "ult", "必殺技", d);
      return `<div class="box rot-box"><b>${l}：${esc(chOf(id).jp)}</b>${f}</div>`;
    }).join("");
    let items;
    try { items = getContrib(); } catch (e) { return `<div class="wide"><h3>ビルド確認</h3><p class="muted">寄与率を計算できませんでした（${esc(e.message)}）</p></div>`; }
    const pc = v => v == null ? "" : v > 0.0005 ? "−" + (Math.round(v * 1000) / 10).toFixed(1) + "%" : v < -0.0005 ? "+" + (Math.round(-v * 1000) / 10).toFixed(1) + "%" : "影響なし";
    // 今の値 → 比べる値。◀▶で比べる値を変える（今と同じ値は飛ばす。0まで下げると、まるごと外したときと同じ）。徽章は外したときだけ
    const decIn = d => {
      if (!d) return '<span class="muted">外す</span>';
      const nx = dir => { let v = d.t + dir; if (v === d.cur) v += dir; return v >= d.lo && v <= d.hi ? v : null; };
      const btn = (dir, ch) => { const v = nx(dir); return `<button class="obtn" data-act="cmp|${v == null ? "" : v}|${esc(d.key)}"${v == null ? " disabled" : ""}>${ch}</button>`; };
      const sh = v => d.unit === "突破" ? "突破" + S.lrRoman(v) : d.unit + v;   // ロスレコの突破はゲームと同じ I〜VI
      return `<span class="decin"><span class="muted">${sh(d.cur)} →</span>${btn(-1, "◀")}<b class="${d.t > d.cur ? "up" : ""}">${sh(d.t)}</b>${btn(1, "▶")}</span>`;
    };
    const rows = kind => { const it = items.filter(x => x.kind === kind); return it.length ? `<table class="stt decT"><tr><th style="text-align:left">項目</th><th>今 → 比べる値</th><th>与ダメ寄与率</th></tr>${it.map(x => `<tr><td title="${esc(x.label.replace("\n", " "))}">${x.label.split("\n").map(esc).join('<br><span class="ind">') + (x.label.indexOf("\n") >= 0 ? "</span>" : "")}</td><td class="c">${decIn(x.cmp)}</td><td class="v">${pc(x.team)}</td></tr>`).join("")}</table>` : '<p class="muted">入っていません</p>'; };
    // オススメ強化ポイント（β版）。ふだんは閉じておき、開いたときだけ計算する（入力が変わっていなければ、前の結果を使う）
    const ukey = JSON.stringify(G);
    if (V.upOpen && V.upKey !== ukey) { V.upKey = ukey; try { V.upAll = S.contrib.calcUpgrades(G); } catch (e) { V.upAll = []; } }
    // 種類のフィルタ（何も選んでいなければ全部）。全部のときは、付け替え（素質・音符）を種類ごとにいちばん伸びる1つにまとめる（似た手ばかり並ばないように）
    const UPK = ["心相", "ロスレコ", "しずく", "素質", "音符"], upF = V.upF || [];
    if (V.upOpen) {
      const seen = new Set();
      V.ups = (V.upAll || []).filter(u => upF.length ? upF.indexOf(u.kind) >= 0 : (!u.src || (!seen.has(u.src) && seen.add(u.src)))).slice(0, 10);
    }
    const upFilter = !V.upOpen ? "" : `<div class="up-f" role="group" aria-label="種類で絞り込む"><button type="button" class="${upF.length ? "" : "on"}" aria-pressed="${!upF.length}" data-act="upf:">すべて</button>${UPK.map(k => `<button type="button" class="${upF.indexOf(k) >= 0 ? "on" : ""}" aria-pressed="${upF.indexOf(k) >= 0}" data-act="upf:${k}">${k}</button>`).join("")}</div>`;
    const KCLS = { 心相: "k-heart", しずく: "k-emb", 素質: "k-pot", ロスレコ: "k-lr", 音符: "k-note" };
    const upHtml = !V.upOpen ? '<p class="muted" style="margin:0">1つだけ変えたときに、3分間のダメージが大きく伸びる強化を10個まで出します。</p>' : (V.ups || []).length ? `<ol class="up-list">${V.ups.map((u, i) => `<li><span class="up-k ${KCLS[u.kind] || ""}">${u.kind}</span><span class="up-l">${esc(u.label)}</span><b class="up-g">+${(u.gain * 100).toFixed(1)}%</b><button type="button" class="btn-add" data-act="upapply:${i}">反映する</button></li>`).join("")}</ol>` : '<p class="muted" style="margin:0">強化ポイントが見つかりませんでした。</p>';
    return `<div class="wide"><div class="secg">
      <section class="sec full"><h3>3分間の回数<span class="h-sub">寄与率は、この回数で合計した3分間のダメージで出します</span></h3>
      <div class="box" style="border-color:#E5533D;background:#FFF4F2;margin:0 0 8px"><b style="color:#C0392B">⚠ 3分間の回数は、かなり雑な目安です</b>
        ${helpTxt("rot", "自分の戦い方に合わせて、下の回数を書き換えてください。", `指名手配の3分間で、スキルと必殺技をCDが明けたらすぐ使い、残りは通常攻撃をし続けた、という想定です。実際の戦闘の回数とは違います。<br>
        ・CDは日本語Wikiの値です（セイナ(原点)はゲーム内の表示）。SPが足りずに必殺技が撃てない場合や、CDが戻る効果（ホタルの必殺技など）は入っていません。<br>
        ・通常攻撃は「3分 ÷ 1ローテの秒数」で、スキル中やダッシュで中断される分を引いていません。1ローテの秒数を測ったのはセイナ(原点)（約5秒、目で見た値）だけで、ほかは仮に5秒です。<br>
        ・寄与率は、この回数で合計したダメージで出します。`, "margin-top:4px;color:#33386A")}
        <label class="check" style="font-weight:700;margin:6px 0 0"><input type="checkbox" data-act="scoreshow"${scoreShow ? " checked" : ""}>指名手配の想定スコアを出す</label></div>
      <div class="grid-in" style="grid-template-columns:repeat(3,minmax(0,1fr))">${rotHtml}</div></section>
      <section class="sec full"><h3>オススメ強化ポイント<span class="beta-s">β版</span><button type="button" class="help-btn" data-act="upopen" aria-expanded="${!!V.upOpen}">${V.upOpen ? "閉じる" : "計算する"}</button><span class="h-sub">まだテスト版なので目安程度にお願いします。</span></h3>${upFilter}${upHtml}
        ${!V.upOpen ? "" : helpTxt("ups", "※ロスレコの入れ替えには対応していません。比較項目は右の詳しくをクリックして確認できます。", "心相の凸・ロスレコの突破・しずく・素質の付け替え・音符の付け替えを、全部ためして、上の3分間の回数で合計したダメージが伸びる順に10個まで並べます（伸びが0.1%未満の組み合わせは除外します）<br>・心相: 凸を1つすすめます。<br>・ロスレコ: 突破を1つすすめます（サブは基礎攻撃力だけ変わります）<br>・しずく: 徽章の値を1段階上げます。1枚の徽章に2回までですが、既に使った回数は分からないので、考慮外になっています。<br>・素質の付け替え: 取った素質を1つ下げて、別の素質を1つ上げて伸びる組み合わせを1つ出します。<br>・音符の付け替え: 取った音符を減らして、別の音符に足してアシスト効果の伸びなどを見て、いちばん伸びる組み合わせを1つだけ出します。<br>上のボタンで種類を選ぶと、その種類だけを伸びる順に10個まで出します（複数選べます）。種類を選んだときは、付け替えもいくつも出します。<br>付け替えは1回ずつ出すので、「反映する」のあと、次の付け替えが出ます（使った数は数えていないので、合計の上限は自分で確かめてください）<br>「反映する」を押すと、その変更をビルドに反映します。「今の値を記憶」をしていなければ、押す前の値を記憶するので、結果の比較で伸びを確かめられます。", "margin-top:8px")}</section>
      <section class="sec full"><h3>与ダメへの寄与率</h3>
      ${helpTxt("verify", "1つの項目だけ変えたときに、3分間のダメージが何%変わるかです。", "「今 → 比べる値」は、今のLv（コア効果は突破）と、比べる値です。既定は1つ下で、◀▶で変えられます。Lv0まで下げると、まるごと外したときの値です。今より上にすると、上げたときにどれだけ伸びるか（+）が出ます。素質（コア以外）は、徽章の素質レベル上昇も込みのLvで、Lv9まで選べます（Lv7〜9の値は、ゲームの画面で確かめていないものは推定です）。徽章は、1枠を外したときです。<br><b>与ダメ寄与率</b>は編成の合計（主力の通常・主力スキル・必殺技（印を含む）＋支援2人の支援スキル、それぞれ上の回数ぶん）に対する値です。<br>SP獲得効率は、回数を上で決める形なので反映されません（「影響なし」になります）。直接入力を優先しているときは、ステータスに効く項目も動きません。ロスレコは、メインの3枚だけです（サブは初期音符だけで、効果はありません）。", "margin:0 0 8px")}
      <div class="grid-in decG">
        <div class="box"><div class="bx-h"><b>素質</b><label class="check" style="font-weight:400;margin:0"><input type="checkbox" data-act="potall"${V.potAll ? " checked" : ""}>未取得の素質も表示</label></div>${rows("素質")}</div>
        <div class="box"><b>徽章</b>${rows("徽章")}</div>
        <div class="box"><b>ロスレコ</b>${rows("ロスレコ")}</div>
      </div></section></div></div>`;
  }

  function renderDisplay() {
    // 巡遊者のタブは、最後に開いた巡遊者の「基本」から（上に巡遊者のタブ、左に 基本・心相・徽章・素質・その他 のタブ。2026-11-22 ユーザー）
    if (V.panel === "overview") V.panel = "base:" + (V.lastSlot || "main");
    if (/^heart:/.test(V.panel)) V.panel = V.panel.replace(/^heart/, "add");   // 心相のタブはなくした（進み具合は基本、効果はその他・2026-11-22）
    const [a, b] = V.panel.split(":");
    if (/^(base|emb|heart|pot|add)$/.test(a) && SLOTS.some(x => x[0] === b)) V.lastSlot = b;
    let h;
    if (a === "base") h = renderBase();
    else if (V.panel === "direct") h = renderDirect();
    else if (a === "emb") h = renderEmblem(b);
    else if (a === "pot") h = renderPot(b);
    else if (a === "add") h = renderAdd(b);
    else if (V.panel === "record") h = renderLr();   // 前の「記録」のタブの名前（記録レベルは「補正」の画面に移した）
    else if (V.panel === "lr") h = renderLr();
    else if (V.panel === "gimmick") h = renderGimmick();
    else if (V.panel === "adjust") h = renderAdjust();
    else if (V.panel === "score") h = renderScore();
    else if (V.panel === "load") h = renderLoad();
    else if (V.panel === "share") h = renderShareTab();
    else h = renderOverview();
    // 巡遊者ごとの画面（心相・徽章・素質・その他）では、戻るボタンと、同じ巡遊者のほかの画面へのボタンを出す
    let nav = "";
    if (/^(base|emb|heart|pot|add)$/.test(a)) {
      // 上に巡遊者のタブ（主力・支援1・支援2）、左に画面のタブ（心相・徽章・素質・その他）を置き、縦と横でクロスさせて切り替える（2026-11-22 ユーザー・デザインの相談から）
      const side = [["base", "基本"], ["emb", "徽章"], ["pot", "素質"], ["add", "その他"]].map(([pn, label]) =>
        `<button type="button" class="xs${pn === a ? " on" : ""}" aria-current="${pn === a ? "page" : "false"}" data-act="panel:${pn}:${b}"><b>${label}</b></button>`).join("");
      // 中身の枠の一番上に、3人の見出しの行（「主力：名前」と属性の色の線）。基本では3人の列の見出し、ほかの画面では巡遊者の切り替え（選んでいない人は薄く）。
      //   基本と心相などを行き来しても、見出しの位置が変わらない（2026-11-22 ユーザー）
      const head = ([k, l]) => { const c = chOf(G.team[k]), st = `style="--elc:${EL_COLOR[c.el] || "#4B5082"}"`;
        const t = `<span class="xh-tag">${l}</span><i class="xh-dot" aria-hidden="true"></i><b>${esc(c.jp)}${c.auto ? "*" : ""}</b>`;
        return a === "base" ? `<button type="button" class="xh xh-b${(V.lastSlot || "main") === k ? " m-on" : ""}" ${st} data-act="bsel:${k}">${t}</button>` : `<button type="button" class="xh${k === b ? " on" : ""}" ${st} aria-current="${k === b ? "page" : "false"}" data-act="panel:${a}:${k}">${t}</button>`; };
      h = `<div class="xnav${a === "base" ? " is-base" : ""}">
        <div class="xn-body"><div class="xn-side" role="group" aria-label="画面">${side}</div><div class="xn-main"><div class="xn-head" role="group" aria-label="巡遊者">${SLOTS.map(head).join("")}</div>${h}</div></div></div>`;
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
    // 順番: 通常、主力、必殺、印、支援1（支援スキル・必殺技）、支援2（支援スキル・必殺技）
    // 支援の必殺技は、テスト3（ホタル・ティリア）の実測で式の形を確認（2026-10-29。どのヒットも同じ割合で、差は2%以内）
    const items = [
      ["basic", "通常1ローテ", groupSummary(main, "basic"), main],
      ["main", "主力スキル", groupSummary(main, "main"), main],
      ["ult", "必殺技", groupSummary(main, "ult"), main],
      ["mark", "印", groupSummary(main, "main", true) || groupSummary(main, "ult", true), main],
      ["sup1", chOf(s1).jp + " 支援スキル", groupSummary(s1, "support"), s1],
      ["supu1", chOf(s1).jp + " 必殺技", groupSummary(s1, "ult"), s1],
      ["supm1", chOf(s1).jp + " 印", groupSummary(s1, "support", true), s1],
      ["sup2", chOf(s2).jp + " 支援スキル", groupSummary(s2, "support"), s2],
      ["supu2", chOf(s2).jp + " 必殺技", groupSummary(s2, "ult"), s2],
      ["supm2", chOf(s2).jp + " 印", groupSummary(s2, "support", true), s2],
    ].filter(x => !/^supm/.test(x[0]) || x[2]);   // 支援の印は、印を発動できる支援（グレイなど）だけ出す
    window.__items = items;
    const curVals = {};
    // 巡遊者ごとに1枚のカード。攻撃ごとに1行（名前・倍率・ダメージ・比較）。細かい値は行の下に小さく出し、押すと内訳
    // 細かい値は「通常攻撃ダメージ: +38.4%」の形。コロンの後ろは半角スペース1つ、項目の間は全角スペース1つ分（CSS の gap）。率は小数1桁
    const v = (cls, lab, val) => `<span class="rs-v ${cls}">${lab}: ${val}</span>`;
    const p1 = x => (x * 100).toFixed(1) + "%";
    // その行の攻撃の種類（通常1ローテなら通常攻撃）。違う種類のヒット（スキル扱いの通常攻撃など）は、内訳で分かるようにする
    const mainType = key => /^(mark|supm)/.test(key) ? "mark" : key === "basic" ? "basic" : /^(ult|supu)/.test(key) ? "ult" : "skill";
    // 行の下に出す「○○ダメージ: +x%」。その行に実際にある種類だけを出す（行の種類を先に、ほかはダメージの多い順）。
    // 例: セイナ(原点)の必殺技は、ヒットがすべて通常攻撃扱い・スキル扱いなので「必殺技ダメージ」は出さない
    const typeList = (sm, t) => {
      const by = {};
      sm.rows.forEach(r => { const o = by[r.type] = by[r.type] || { t: r.type, B: r.B, dmg: 0 }; o.dmg += r.total; });
      return Object.values(by).sort((a, b) => (b.t === t) - (a.t === t) || b.dmg - a.dmg);
    };
    // 内訳: 押した行のすぐ下に出す。1ヒット1行（ヒット・倍率×回数・小計）。種類が違うヒットと、会心が違うヒットだけ補足を出す
    // 内訳: 結果の行と同じ列にそろえる（総倍率の列に「倍率×回数」、ダメージの列に「小計」。小計を足すと、上の行のダメージ（期待値）になる）
    // ヒットの下に小さく: 「スキル扱い: +x%」（どの種類のダメージとして計算したか。全部のヒットに出す・2026-11-14 ユーザー）、「率ダメ: 会心率 / 会心ダメ」、1ヒットの非会心・会心・期待値
    const drillHtml = (sm, t) => `<div class="rs-drill"><div class="rs-grid rs-dh"><span>ヒット</span><span class="rs-mult">倍率×回数</span><span class="rs-dmg">小計</span><span></span></div>
      ${sm.rows.map(r => {
        const cd = r.critDmg != null ? r.critDmg : r.crit / r.normal;
        const tip = esc(`属性 ${f3(r.W)}／種別 ${f3(r.B)}／被ダメージ ${f3(r.taken)}／敵 ${f3(r.D)}${r.markX !== 1 ? `／印の別枠 ${r.markX}` : ""}`);
        return `<div class="rs-grid rs-dr" title="${tip}"><span class="rs-dn">${esc(r.name)}</span><span class="rs-mult">${(Math.round(r.mult * 10) / 10).toFixed(1)}% ×${r.count}</span><span class="rs-dmg">${dmgF(r.total)}</span><span></span>
          <span class="rs-dsub">${v("ty", E.TYPE_NAME[r.type] + "扱い", "+" + p1(r.B - 1))}${v("rd", "率ダメ", p1(r.rate) + " / " + p1(cd))}${v("nc", "非会心", dmgF(r.normal))}${v("cc", "会心", dmgF(r.crit))}${v("one", "期待値", dmgF(r.avg))}</span></div>`;
      }).join("")}</div>`;
    const row = ([key, label, sm, id]) => {
      if (!sm) return "";   // その巡遊者にない攻撃（印など）は出さない
      curVals[key] = sm.exp;
      let cmp = "";
      if (memo && memo.v && memo.v[key] != null) {
        const d = sm.exp / memo.v[key] - 1;
        cmp = `<small class="rs-cmp ${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${(Math.round(d * 1000) / 10).toFixed(1)}%</small>`;
      }
      const nm = label.replace(chOf(id).jp + " ", "");
      const t = mainType(key), open = V.drill === key;
      return `<button type="button" class="rs-row${open ? " sel" : ""}" data-act="drill:${key}" aria-expanded="${open}" title="${open ? "押すと内訳を閉じます" : "押すと内訳を出します"}">
        <span class="rs-nm">${esc(nm)}</span>
        <span class="rs-mult">${fmt(sm.mult)}%</span>
        <span class="rs-dmg">${dmgF(sm.exp)}</span>
        <span class="rs-go" aria-hidden="true">›</span>
        <span class="rs-sub">${v("rs-mm", "総倍率", fmt(sm.mult) + "%")}${typeList(sm, t).map(x => v("k", E.TYPE_NAME[x.t] + "ダメージ", "+" + p1(x.B - 1))).join("")}</span>${cmp}</button>${open ? drillHtml(sm, t) : ""}`;
    };
    // 列の名前（倍率・ダメージ・比較）は、巡遊者ごとの見出しの行に、それぞれの列の上に出す
    // 指名手配の想定スコア: 3分間の回数で合計したダメージ ÷ シーズンのレート（テクニックスコアは含めない）。レートを入れてある敵のときだけ
    const en = G.enemyObj || {};
    let scoreHtml = "";
    if (scoreShow && en.scoreRate && /指名手配/.test(en.name || "")) {
      const tot = S.contrib.sum3(S.contrib.dmgParts(G));
      scoreHtml = `<div class="rs-score" title="3分間の回数（⑤ビルド確認）で合計したダメージ ${fmt(tot)} ÷ ${fmt(en.scoreRate)}（シーズン${en.season}の1ptあたりのダメージ）。テクニックスコアは含めません"><span>指名手配想定スコア（テスト版）</span><b>${fmt(tot / en.scoreRate)} pt</b><small>テクニックスコアは対象外です。シーズン${en.season}のレート: ${fmt(en.scoreRate)}dmg = 1pt</small></div>`;
    }
    $("result").innerHTML = scoreHtml + SLOTS.map(([k, l]) => {
      const id = G.team[k], c = chOf(id);
      const rows = items.filter(x => x[3] === id && (k === "main" ? !/^sup/.test(x[0]) : x[0].slice(-1) === (k === "s1" ? "1" : "2")));
      return `<section class="rs-card" style="--elc:${EL_COLOR[c.el] || "#4B5082"}"><h3 class="rs-row rs-h"><span class="rs-hn"><span class="rs-slot">${l}</span>${esc(c.jp)}</span><span class="rs-mult rs-ch">総倍率</span><span class="rs-dmg rs-ch">ダメージ（期待値）</span><span></span></h3>${rows.map(row).join("")}</section>`;
    }).join("");
    window.__cur = curVals;
    renderMobile(items);
  }
  // 上に残す帯（手順のタブと共通の倍率）は、見出しのすぐ下に付ける
  // 見出しのすぐ下に付ける（すき間があると、スクロールした中身が見える）
  function setHdrH() { const h = document.querySelector(".site-header"); if (h) document.documentElement.style.setProperty("--hdr-h", (h.offsetHeight - 1) + "px"); }
  window.addEventListener("resize", setHdrH);
  function renderAll() {
    G.enemyOv = G.enemyOv || { res: {}, extra: {} };
    // 描き直すと入力欄が作り直されるので、フォーカスしていた欄（data-p が同じ欄）に、フォーカスとカーソルの位置を戻す（上下キーで続けて増減できるように）
    const ae = document.activeElement, fp = ae && ae.getAttribute && ae.getAttribute("data-p");
    let sel = null; try { sel = fp && ae.selectionStart != null ? [ae.selectionStart, ae.selectionEnd] : null; } catch (e) { sel = null; }
    recalc();
    renderTop(); renderTiles(); renderSelectors(); renderDisplay(); renderResult(); renderPick();
    setHdrH();
    save();
    if (fp && !document.body.contains(ae)) {
      const el = [...document.querySelectorAll("[data-p]")].find(x => x.getAttribute("data-p") === fp);
      if (el) { el.focus({ preventScroll: true }); try { if (sel) el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* number の欄は選択範囲を持てない */ } }
    }
  }

  // ---- イベント ----
  // ロスレコを選ぶ画面の「探す」欄: 打つたびに一覧をしぼる（描き直したあと、欄に戻る）
  document.addEventListener("input", ev => {
    const t = ev.target;
    if (t.id !== "lrp-q" || !V.lrp) return;
    V.lrp.q = t.value; renderLrDlg();
    const n = $("lrp-q"); if (n) { n.focus(); try { n.setSelectionRange(n.value.length, n.value.length); } catch (e) { /* 無視 */ } }
  });
  // 徽章の画面で画像を貼り付けたら、読み取る
  document.addEventListener("paste", ev => {
    const isRec = V.panel === "lr" || V.panel === "record", isPot = /^pot:/.test(V.panel || "");
    if (!/^emb:/.test(V.panel || "") && !isRec && !isPot) return;
    const f = [...((ev.clipboardData && ev.clipboardData.files) || [])].find(x => /^image\//.test(x.type));
    if (!f) return;
    ev.preventDefault();
    if (isRec) { runRecOcr(f); return; }   // 記録・ロスレコのタブ: ロスレコスキル画面
    if (isPot) { const k = V.panel.split(":")[1]; runPotOcr([f], SLOTS.some(x => x[0] === k) ? k : "main"); return; }   // 素質の画面: 素質収集画面（その巡遊者の段だけ）
    runOcr(G.team[V.panel.split(":")[1]], f);
  });
  document.addEventListener("change", ev => {
    const t = ev.target;
    if (t.id === "bsel" || t.id === "bname") return;
    if (t.id === "bj-file") {
      const f = t.files && t.files[0];
      if (f) f.text().then(tx => { DV.bjson = tx; loadBuild(tx, "bjson"); }, () => say("bjson", "ファイルを読めませんでした", true));
      return;
    }
    if (t.id === "ocr-file") { runOcr(t.getAttribute("data-id"), t.files && t.files[0]); return; }
    if (t.id === "rocr-file") { runRecOcr(t.files && t.files[0]); return; }
    if (t.id === "pocr-file") { runPotOcr(t.files, t.getAttribute("data-slot")); t.value = ""; return; }
    if (t.getAttribute("data-act") === "wiz-lvsel") { V.wiz.lv = +t.value; return; }
    // 敵の種類を変えたら、その種類の最初の敵にする
    if (t.id === "enemy-cat") {
      const e = enemiesOf(t.value)[0];
      if (e) { setPath("enemy", e.id); renderAll(); }
      return;
    }
    // 巡遊者の属性を変えたら、その属性の最初の巡遊者にする
    const chel = t.getAttribute && t.getAttribute("data-chel");
    if (chel) {
      const x = chOfEl(t.value)[0];
      if (x) { setPath(`team.${chel}`, x.id); renderAll(); }
      return;
    }
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
    else if (ty === "pct") v = t.value === "" ? null : +t.value / 100;   // 「12」→ 0.12
    else if (ty === "x10") v = t.value === "" ? null : Math.round(+t.value * 10);   // 心相: 「4.5」凸 → 45段階
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
  // −／＋ のボタン: 押したら1つ動かし、押しっぱなしなら少し待ってから速く続けて動かす
  function stepOnce(a) {
    const m = /^stp\|(-?\d+)\|(-?\d+)\|(-?\d+)\|(-?\d+)\|(.+)$/.exec(a);
    if (!m) return false;
    const v = getPath(m[5]), cur = v == null || v === "" ? +m[4] : +v, nv = Math.min(+m[3], Math.max(+m[2], cur + +m[1]));
    if (nv === cur) return false;
    setPath(m[5], nv); renderAll(); return true;
  }
  let holdT = null;
  const holdStop = () => { if (holdT) { clearTimeout(holdT); holdT = null; } };
  document.addEventListener("pointerdown", ev => {
    const b = ev.target.closest && ev.target.closest(".stp-b");
    if (!b || b.disabled || ev.button !== 0) return;
    const a = b.getAttribute("data-act");
    ev.preventDefault();
    holdStop();
    if (!stepOnce(a)) return;
    let n = 0;
    const tick = () => { n++; if (!stepOnce(a)) { holdStop(); return; } holdT = setTimeout(tick, n < 10 ? 90 : 40); };
    holdT = setTimeout(tick, 400);
  });
  ["pointerup", "pointercancel", "blur"].forEach(e => (e === "blur" ? window : document).addEventListener(e, holdStop));
  document.addEventListener("click", ev => {
    const t = ev.target.closest("[data-act]");
    if (!t) return;
    const a = t.getAttribute("data-act");
    if (a.indexOf("panel:") === 0) {
      V.panel = a.slice(6); V.pick = null; V.lrPick = null; renderAll();
      // 下までスクロールしたままタブを替えると、新しい画面の途中から見えてしまうので、手順のタブが見えるところまで戻す（帯はページと一緒にスクロールする）
      const nav = $("navp"), hd = document.querySelector(".site-header");
      if (nav) {
        const below = hd && getComputedStyle(hd).position === "sticky" ? hd.getBoundingClientRect().bottom : 0;
        const top = nav.getBoundingClientRect().top;
        if (top < below) window.scrollTo(0, window.scrollY + top - below - 8);
      }
      return;
    }
    // 巡遊者の入力をクリア（2回押し）。保存されていた値がおかしいとき用
    if (a.indexOf("chclr:") === 0) { V.clrSure = a.slice(6); renderAll(); return; }
    if (a === "chclr-no") { V.clrSure = null; renderAll(); return; }
    if (a.indexOf("chclr-ok:") === 0) {
      const id = a.slice(9);
      G.chars[id] = defChar(id);
      if (G.skOn) Object.keys(G.skOn).forEach(k => { if (k.indexOf(id + ":") === 0) delete G.skOn[k]; });
      V.clrSure = null; renderAll(); return;
    }
    if (a.indexOf("tf:") === 0) { V.tilesFor = a.slice(3); renderAll(); return; }
    if (a === "recpop") { V.recPop = !V.recPop; renderTiles(); return; }   // 記録レベルの詳しい中身（タップで開く・閉じる）
    if (a.indexOf("drill:") === 0) {
      const k = a.slice(6);
      V.drill = V.drill === k ? null : k;   // 押した行のすぐ下に内訳を開く（もう一度押すと閉じる）
      renderAll();
      return;
    }
    if (a.indexOf("m:") === 0) {
      V.m = a.slice(2);
      renderAll(); window.scrollTo(0, 0); return;
    }
    if (a.indexOf("mchar:") === 0) { V.mChar = a.slice(6); renderAll(); return; }
    if (a.indexOf("bsel:") === 0) { V.lastSlot = V.mChar = a.slice(5); V.panel = "base:" + V.lastSlot; renderAll(); return; }   // スマホの基本: 見出しで1人を選ぶ（開いている画面の巡遊者も切り替える。そうしないと描き直しで主力に戻る）
    if (a.indexOf("embclear:") === 0) { embClear(a); renderAll(); return; }
    if (a.indexOf("lrclear:") === 0) { const p = a.slice(8), [arr, i] = p.split("."); G[arr] = G[arr] || []; G[arr][+i] = ""; delete V.lrEl[p]; renderAll(); return; }
    let builds = {};
    try { builds = JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { builds = {}; }
    if (a === "bsave") { const n = $("bname").value.trim(); if (!n) return say("build", "名前を入れてください", true); builds[n] = clone(G); try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } say("build", `「${n}」を保存しました`); }
    else if (a === "bload") { const n = $("bsel").value; if (n && builds[n]) { G = merge(defState(), clone(builds[n])); DM.build = null; shareMsg = `「${n}」を読み込みました`; V.panel = "overview"; renderAll(); } else say("build", "読み込むビルドを選んでください", true); }
    else if (a === "bdel") { const n = $("bsel").value; if (n && builds[n] && V.delSure !== n) { V.delSure = n; V.bselPick = n; return say("build", `「${n}」を削除します。よければ、もう一度「削除」を押してください`); }
      if (n && builds[n]) { V.delSure = null; delete builds[n]; try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } say("build", `「${n}」を削除しました`); } }
    else if (a === "memo") { memo = { v: clone(window.__cur || {}) }; try { localStorage.setItem(KEY_M, JSON.stringify(memo)); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "memodel") { memo = null; try { localStorage.removeItem(KEY_M); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "share-x") shareX();
    else if (a === "card-make") makeCard();
    else if (a === "potall") { V.potAll = !V.potAll; renderAll(); }
    else if (/^xtag:\d$/.test(a)) { const i = +a.slice(5); xTags[i] = !xTags[i]; try { localStorage.setItem("stellasora-sim-xtags2", JSON.stringify(xTags)); } catch (e) { /* 無視 */ } renderAll(); }
    else if (/^(brn|bcp|bdl|bov):\d+$/.test(a) || a === "brn-ok" || a === "brn-no") {
      const builds = savedBuilds(), names = Object.keys(builds), [op, i] = a.split(":"), n = names[+i];
      const put = () => { try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } };
      if (op !== "bov") V.ovSure = null;
      if (op !== "bdl") V.delSure = null;
      if (op === "bov" && n) {   // 今の入力で、保存したビルドを上書きする（2回押しで確定）
        if (V.ovSure !== n) { V.ovSure = n; return say("build", `「${n}」を今の入力で上書きします。よければ、もう一度押してください`); }
        V.ovSure = null; builds[n] = clone(G); put(); say("build", `「${n}」を上書きしました`);
      }
      else if (op === "brn") { V.renaming = n; V.delSure = null; DM.build = null; renderAll(); const el = $("bren"); if (el) { el.focus(); el.select(); } }
      else if (a === "brn-no") { V.renaming = null; renderAll(); }
      else if (a === "brn-ok") {
        const old = V.renaming, el = $("bren"), nn = el ? el.value.trim() : "";
        if (!nn) return say("build", "名前を入れてください", true);
        if (nn !== old && builds[nn]) return say("build", `「${nn}」はもうあります。ほかの名前にしてください`, true);
        const out = {}; names.forEach(k => { out[k === old ? nn : k] = builds[k]; });   // 並び順はそのまま
        try { localStorage.setItem(KEY_B, JSON.stringify(out)); } catch (e) { /* 無視 */ }
        V.renaming = null; say("build", `「${old}」を「${nn}」に変えました`);
      }
      else if (op === "bcp" && n) { let c = `${n}（コピー）`, k = 2; while (builds[c]) c = `${n}（コピー${k++}）`; builds[c] = clone(builds[n]); put(); say("build", `「${c}」を作りました`); }
      else if (op === "bdl" && n) {
        if (V.delSure !== n) { V.delSure = n; return say("build", `「${n}」を削除します。よければ、もう一度押してください`); }
        V.delSure = null; delete builds[n]; put(); say("build", `「${n}」を削除しました`);
      }
    }
    else if (a.indexOf("pick:") === 0) { pickToggle(a.slice(5)); V.pickSure = false; DM.pick = null; renderAll(); }
    else if (a.indexOf("wiz:") === 0) {   // ビルドを作る流れの段を移る
      const st = a.slice(4); V.wiz = V.wiz || {};
      if (st === "lr" && !V.wiz.team) V.wiz.team = 1;
      if (st === "done") V.wiz.plan = null;
      if (st === "lr" && V.wiz.teamKey !== JSON.stringify(V.pick3)) { V.wiz.rec = null; V.wiz.lr = []; V.wiz.teamKey = JSON.stringify(V.pick3); }
      V.wiz.lv = V.wiz.lv || 33;   // 記録レベルの最初の値は33（ユーザーの指定）
      V.wiz.step = st; renderPick(); $("pickDlg").scrollTop = 0;
    }
    else if (a.indexOf("wiz-lr:") === 0) { const id = a.slice(7), l = V.wiz.lr = V.wiz.lr || []; const i = l.indexOf(id); if (i >= 0) l.splice(i, 1); else l.push(id); renderPick(); }
    else if (a === "wiz-more") { V.wiz.more = true; renderPick(); }
    else if (a === "wiz-apply") {
      const pl = V.wiz.plan; if (!pl) return;
      G = merge(defState(), clone(pl.g));
      G.notes = clone(pl.g.notes);   // 初期値の音符と混ざらないように、音符は作ったビルドのものだけにする
      V.pick3 = null; V.wiz = null; $("pickDlg").close();
      shareMsg = "条件を指定してビルドを作りました"; V.panel = "overview"; renderAll();
    }
    else if (a === "pick-open") { V.wiz = null; V.pickSure = false; DM.pick = null; $("pickDlg").showModal(); renderPick(); }
    else if (a === "pick-close") { V.pickSure = false; DM.pick = null; $("pickDlg").close(); }
    else if (a === "pick-make") {
      const p = V.pick3 || {};
      if (!SLOTS.every(([k]) => p[k])) return;
      if (!V.pickSure) { V.pickSure = true; return say("pick", "入力中のデータは、すべて初期値に戻ります。よければ、もう一度「計算に選んだ巡遊者を反映する」を押してください"); }
      V.pickSure = false; DM.pick = null; $("pickDlg").close();
      G = defState(); G.team = { main: p.main, s1: p.s1, s2: p.s2 }; V.pick3 = null; shareMsg = "新しく作りました"; V.panel = "overview"; renderAll();
    }
    else if (a === "bj-in") { const el = $("dv-bjson"); DV.bjson = el ? el.value : ""; if (!DV.bjson.trim()) say("bjson", "編成データ（JSON）を貼り付けてください", true); else loadBuild(DV.bjson, "bjson"); }
    else if (a === "ld-any") { const el = $("dv-load"); DV.load = el ? el.value : ""; loadAny(DV.load); }
    else if (a === "cp:url" || a === "cp:sid") {
      const v = a === "cp:url" ? DV.url : ((/\/s\/([A-Za-z0-9]+)/.exec(DV.url || "") || [])[1] || "");
      if (!v) return;
      try { navigator.clipboard.writeText(v).then(() => say("url", "コピーしました"), () => say("url", "コピーできませんでした。枠の中を選んでコピーしてください", true)); } catch (e) { say("url", "コピーできませんでした", true); }
    }
    else if (a.indexOf("help:") === 0) { V.help = V.help || {}; V.help[a.slice(5)] = !V.help[a.slice(5)]; renderAll(); }
    else if (a.indexOf("stp|") === 0) { if (ev.detail === 0) stepOnce(a); }   // −／＋ のボタン（マウス・指は pointerdown で動かす。ここはキーボードで押したときだけ）
    else if (a.indexOf("unit:") === 0) { dmgUnit = a.slice(5); try { localStorage.setItem("stellasora-sim-unit", dmgUnit); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a.indexOf("plv|") === 0) { const m = /^plv\|(\d+)\|(.+)$/.exec(a); if (m) { setPath(m[2], +m[1]); renderAll(); } }   // 素質のLv
    else if (a.indexOf("pcore|") === 0) {   // コア素質: 取得／外す（1人2つまで。外すのはいつでもできる）
      const path = a.slice(6), on = +getPath(path) > 0, k = (V.panel.split(":")[1]) || "main";
      if (on) setPath(path, 0); else if (potCount(potItems(k)).core < CORE_MAX) setPath(path, 1);
      renderAll();
    }
    else if (a.indexOf("cmp|") === 0) { const m = /^cmp\|(-?\d+)\|(.+)$/.exec(a); if (m) { V.cmp = V.cmp || {}; V.cmp[m[2]] = +m[1]; renderAll(); } }
    else if (a === "rp-open") { RP.msg = null; RP.done = false; renderReport(); $("reportDlg").showModal(); }
    else if (a === "rp-close") $("reportDlg").close();
    else if (a.indexOf("ocr-apply:") === 0) { applyOcr(a.slice(10)); save(); renderAll(); }
    else if (a === "ocr-cancel") { V.ocr = null; renderAll(); }
    else if (a.indexOf("ocr-clip:") === 0) {
      // クリップボードの画像を読む（ブラウザが許可を聞くことがある。使えないブラウザでは Ctrl+V の案内を出す）
      const id = a.slice(9), ng = m => { V.ocr = { id, msg: m, ng: true }; renderAll(); };
      if (!navigator.clipboard || !navigator.clipboard.read) { ng("このブラウザでは、ボタンからクリップボードを読めません。この画面で Ctrl+V（スマホは長押しで貼り付け）をしてください。"); return; }
      navigator.clipboard.read().then(async items => {
        for (const it of items) { const ty = it.types.find(x => /^image\//.test(x)); if (ty) { const b = await it.getType(ty); runOcr(id, new File([b], "clipboard", { type: ty })); return; } }
        ng("クリップボードに画像がありません。ゲームの画面をコピー（スクリーンショット）してから押してください。");
      }).catch(() => ng("クリップボードを読めませんでした（許可されていないかもしれません）。この画面で Ctrl+V をしてください。"));
    }
    else if (a === "pocr-apply") applyPotOcr();
    else if (a === "pocr-cancel") { V.pocr = null; renderAll(); }
    else if (a.indexOf("pocr-clip:") === 0) {
      const k = a.slice(10), ng = m => { V.pocr = Object.assign({}, V.pocr && V.pocr.slot === k ? V.pocr : { slot: k }, { msg: m, ng: true }); renderAll(); };
      if (!navigator.clipboard || !navigator.clipboard.read) { ng("このブラウザでは、ボタンからクリップボードを読めません。この画面で Ctrl+V をしてください。"); return; }
      navigator.clipboard.read().then(async items => {
        for (const it of items) { const ty = it.types.find(x => /^image\//.test(x)); if (ty) { const b = await it.getType(ty); runPotOcr([new File([b], "clipboard", { type: ty })], k); return; } }
        ng("クリップボードに画像がありません。ゲームの画面をコピー（スクリーンショット）してから押してください。");
      }).catch(() => ng("クリップボードを読めませんでした（許可されていないかもしれません）。この画面で Ctrl+V をしてください。"));
    }
    else if (a === "rocr-apply") applyRecOcr();
    else if (a === "rocr-cancel") { V.rocr = null; renderAll(); }
    else if (a === "rocr-clip") {
      const ng = m => { V.rocr = { msg: m, ng: true }; renderAll(); };
      if (!navigator.clipboard || !navigator.clipboard.read) { ng("このブラウザでは、ボタンからクリップボードを読めません。この画面で Ctrl+V をしてください。"); return; }
      navigator.clipboard.read().then(async items => {
        for (const it of items) { const ty = it.types.find(x => /^image\//.test(x)); if (ty) { const b = await it.getType(ty); runRecOcr(new File([b], "clipboard", { type: ty })); return; } }
        ng("クリップボードに画像がありません。ゲームの画面をコピー（スクリーンショット）してから押してください。");
      }).catch(() => ng("クリップボードを読めませんでした（許可されていないかもしれません）。この画面で Ctrl+V をしてください。"));
    }
    else if (a.indexOf("cc:") === 0) { V.cc = V.cc || {}; const k = a.slice(3); V.cc[k] = !V.cc[k]; renderAll(); }
    else if (a === "log-open") { renderLog(); $("logDlg").showModal(); }
    else if (a === "log-close") $("logDlg").close();
    else if (a === "hint") {   // 「使い方」: 欄の説明をポップアップで出す（マウスを重ねる吹き出しは、カーソルと重なって読みにくかった・2026-11-22 ユーザー）
      const box = t.closest(".box"), ttl = box && box.querySelector("b") ? box.querySelector("b").textContent : "使い方";
      const items = t.querySelector(".hint-pop").innerHTML.split("<br>").filter(x => x.trim());
      $("hintBody").innerHTML = `<h2 id="hintDlgT">${esc(ttl)}</h2><ul class="hint-ul">${items.map(x => `<li>${x}</li>`).join("")}</ul><div class="foot"><button class="btn-add pri" data-act="hint-close">閉じる</button></div>`;
      $("hintDlg").showModal();
    }
    else if (a === "hint-close") $("hintDlg").close();
    else if (a.indexOf("lrpick:") === 0) openLrDlg(a.slice(7));
    else if (a === "lrp-close") { $("lrDlg").close(); V.lrp = null; }
    else if (a === "lrp-fold") { V.lrpFold = !V.lrpFold; try { localStorage.setItem("stellasora-sim-lrpfold", V.lrpFold ? "1" : "0"); } catch (e) { /* 無視 */ } renderLrDlg(); }
    else if (a.indexOf("lrpf:") === 0) {   // しぼり込みのボタン: 押すたびに付け外し。「すべて」は外す
      const i1 = a.indexOf(":", 5), key = a.slice(5, i1), v = a.slice(i1 + 1), arr = V.lrp[key];
      if (!v) V.lrp[key] = []; else { const j = arr.indexOf(v); if (j >= 0) arr.splice(j, 1); else arr.push(v); }
      renderLrDlg();
    }
    else if (a.indexOf("lrpset:") === 0) {
      const [arr, idx] = V.lrp.path.split("."); G[arr] = G[arr] || []; G[arr][+idx] = a.slice(7); delete V.lrEl[V.lrp.path];
      $("lrDlg").close(); V.lrp = null; save(); renderAll();
    }
    else if (a.indexOf("potdesc:") === 0) { const k = a.slice(8); potDesc[k] = !potDesc[k]; try { localStorage.setItem("stellasora-sim-potdesc-" + k, potDesc[k] ? "1" : "0"); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a.indexOf("upf:") === 0) {   // 種類のフィルタ（複数選べる。「すべて」で解除）
      const k = a.slice(4); let f = (V.upF || []).slice();
      if (!k) f = []; else f = f.indexOf(k) >= 0 ? f.filter(x => x !== k) : f.concat(k);
      V.upF = f; renderAll();
    }
    else if (a.indexOf("upapply:") === 0) {
      const u = (V.ups || [])[+a.slice(8)]; if (!u) return;
      if (!memo) { memo = { v: clone(window.__cur || {}) }; try { localStorage.setItem(KEY_M, JSON.stringify(memo)); } catch (e) { /* 無視 */ } }   // 比べられるよう、押す前の値を記憶
      u.apply(G); shareMsg = "反映しました: " + u.label; renderAll();
    }
    else if (a.indexOf("pksort:") === 0) { pkSort = a.slice(7); try { localStorage.setItem("stellasora-sim-pksort", pkSort); } catch (e) { /* 無視 */ } renderPick(); }
    else if (a === "scoreshow") { scoreShow = !scoreShow; try { localStorage.setItem("stellasora-sim-scoreshow", scoreShow ? "1" : "0"); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "upopen") { V.upOpen = !V.upOpen; renderAll(); }
    else if (a === "manopen") { const has = ["baseAtk", "baseHp", "elem", "basicDmg", "skillDmg", "atkPct"].some(k => +((G.lrManual || {})[k]) || 0); V.manOpen = !(V.manOpen != null ? V.manOpen : has); renderAll(); }
    else if (a === "bjopen") { V.bjOpen = !(V.bjOpen || DV.bjson || V.bimp); if (!V.bjOpen) { DV.bjson = ""; V.bimp = null; } renderAll(); }
    else if (a === "rp-send") sendReport();
    else if (a.indexOf("dv:") === 0) shareAct(a.split(":")[1], a.split(":")[2]);
    else if (a === "post-note") {   // 素質ノートの投稿ページを、プリセットコードと徽章（#e=）を付けて開く
      try { const code = S.presetMake(G), e = S.embEncode(G); window.open("https://preset.stella-tool.com/post?code=" + encodeURIComponent(code) + (e ? "#e=" + e : ""), "_blank", "noopener"); DM.post = { t: "素質ノートを開きました" + (e ? "" : "（徽章が無いので、編成と素質Lvだけ）") }; } catch (er) { DM.post = { t: er.message, ng: true }; }
      renderAll();
    }
    else if (a === "reset") { if (confirm("入力をすべて初期値に戻します。よいですか？")) { G = defState(); renderAll(); } }
  });
  // ---- 共有・読み込み（ポップアップの各欄）: key = preset / code / url、op = in（読込）/ out（作成）/ copy ----
  const say = (key, t, ng) => { DM[key] = { t, ng: !!ng }; renderAll(); };
  const loadCode = (code, key, what) => S.shareDecode(code, defState()).then(g => { G = g; DM[key] = { t: what + "を読み込みました" }; shareMsg = what + "を読み込みました"; V.panel = "overview"; renderAll(); }).catch(e => say(key, e.message || "読み込めませんでした", true));
  // e = 徽章（素質ノートから #p=…&e=… で来たとき。sim_preset.js の S.embApply）。徽章が読めなくても、編成と素質Lvは読み込む
  const loadPreset = (code, key, e) => {
    try {
      const g = clone(G); const names = S.presetApply(g, code);
      let emb = "";
      if (e) { try { S.embApply(g, e); emb = "・徽章"; } catch (er) { emb = "（徽章は読めませんでした）"; } }
      G = merge(defState(), g);
      DM[key] = { t: "読み込みました（" + names.join("・") + "）。編成と素質Lv" + (emb === "・徽章" ? "と徽章" : "") + "だけが変わります" + (emb && emb !== "・徽章" ? emb : "") };
      shareMsg = "プリセットコード（" + names.join("・") + "）" + (emb === "・徽章" ? "と徽章" : "") + "を読み込みました" + (emb && emb !== "・徽章" ? emb : ""); V.panel = "overview"; renderAll();
    }
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
      if (v.indexOf("#p=") >= 0) { const hp = S.hashParams(v.slice(v.indexOf("#p="))); return loadPreset(hp.p, key, hp.e); }
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
      const tags = X_TAGS.filter((t, i) => xTags[i]).join(" ");
      const text = teamTitle() + (tags ? "\n" + tags : "");   // 本文は短く。ハッシュタグは、チェックしたものだけ最後に足す
      const intent = "https://x.com/intent/post?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
      if (w) w.location.href = intent; else location.href = intent;
      DV.url = url; say("url", "Xの投稿画面を開きました");
    }).catch(e => { if (w) w.close(); shareMsg = e.message; say("url", e.message, true); });   // ポップアップの外（カードから押したとき）でも分かるよう、上部にも出す
  }

  // ---- 報告（β版の間、データや計算の誤りなどを送ってもらう）。送った内容はサーバーのデータベースに入り、あとで確認する。今の入力（共有コード）を添えると同じ状態を再現できる ----
  const RP = { kind: "", body: "", contact: "", attach: true, msg: null, done: false, busy: false };
  const RP_KINDS = ["計算式・数値", "素質の効果", "ロスレコ・音符", "徽章・ステータス", "表示・使い方", "その他"];
  function renderReport() {
    const team = [G.team.main, G.team.s1, G.team.s2].map(id => chOf(id).jp).join("・");
    $("reportBody").innerHTML = `<h2 id="reportDlgT"><span class="en">REPORT</span>報告</h2>
      <p class="muted" style="margin:0">β版なので、データや計算が間違っている所がまだあると思います。計算の数値がゲームと合わない、素質やロスレコの効果がちがう、ここが使いにくい…など、なんでも気軽に教えてください！（返信はできないこともあります）</p>
      <p class="muted" style="margin:6px 0 0">Discord もあるので、ぜひご参加ください → <a href="https://discord.gg/YJdYv3uRz6" target="_blank" rel="noopener">Discord に参加する</a></p>
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

  // ---- 更新履歴（data/changelog.js）----
  const LOG_C = { chara: "巡遊者ステ", calc: "計算式", ui: "UI", pot: "素質内容", lr: "ロスレコ内容" };
  function renderLog() {
    const list = window.CHANGELOG || [];
    const day = d => { const [y, m, dd] = d.split("-").map(Number); return `${y}年${m}月${dd}日`; };
    $("logBody").innerHTML = `<h2 id="logDlgT"><span class="en">UPDATES</span>更新履歴</h2>
      <p class="muted" style="margin:0">UI 以外の更新は、前に保存したビルドや共有コードでも、ダメージの数字が変わることがあります。</p>
      <div class="log-list">${list.map(g => `<h3>${day(g.d)}</h3><ul>${g.items.map(it => `<li><span class="log-c log-${it.c}">${LOG_C[it.c] || ""}${it.add ? "追加" : "変更"}</span>${esc(it.t)}</li>`).join("")}</ul>`).join("")}</div>
      <div class="foot"><button class="btn-add" data-act="log-close">閉じる</button></div>`;
  }

  renderAll();
  // URLから読み込む（読み込んだらURLからは消す）: #c=共有コード（短縮URLから移動してきたとき）、#p=プリセットコード（プリセット共有サイトなどから）、#b=編成データ
  const hc = location.hash;
  if (hc.indexOf("#b=") === 0) {   // #b=編成データ（JSON を UTF-8 の Base64URL にしたもの。ほかのサイトから）
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* 無視 */ }
    V.panel = "load";
    try { loadBuild(S.buildFromHash(decodeURIComponent(hc.slice(3))), "bjson"); } catch (e) { say("bjson", "URLの編成データを読めませんでした", true); }
  }
  if (hc.indexOf("#c=") === 0 || hc.indexOf("#p=") === 0) {
    const hp = hc[1] === "p" ? S.hashParams(hc) : null, code = hp ? hp.p : decodeURIComponent(hc.slice(3));   // #p=プリセットコード&e=徽章（素質ノートの「ダメージ計算をする」から）
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* 無視 */ }
    if (hp) {
      try {
        const g = clone(G); const names = S.presetApply(g, code);
        let emb = "";
        if (hp.e) { try { S.embApply(g, hp.e); emb = "と徽章"; } catch (er) { emb = "（徽章は読めませんでした）"; } }
        G = merge(defState(), g); shareMsg = "URLのプリセット（" + names.join("・") + "）" + (emb === "と徽章" ? emb + "を読み込みました" : "を読み込みました" + emb); V.panel = "overview";
      } catch (e) { shareMsg = e.message; }
      renderAll();
    } else S.shareDecode(code, defState()).then(g => { G = g; shareMsg = "URLのビルドを読み込みました"; V.panel = "overview"; renderAll(); }).catch(e => { shareMsg = e.message || "URLのビルドを読み込めませんでした"; renderAll(); });
  }
})();
