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

  // ---- プリセット ----
  // テスト3（光チーム・徽章なし・記録Lv4）。ストンプクラブの通常1撃目 77,631、防衛戦の初段 323,158 と一致を確認した構成
  function presetTest3() {
    const g = defState();
    g.team = { main: "noya", s1: "firefly", s2: "tilia" };
    g.recordLv = 4; g.enemy = "stomp"; g.glimmer = false;
    g.notes = { "強撃の音符": 3, "幸運の音符": 15, "爆発の音符": 0, "体力の音符": 11, "集中の音符": 7, "器用の音符": 0, "必殺の音符": 7, "水の音符": 0, "風の音符": 0, "光の音符": 11 };
    g.lrMain = ["mirai", "negai", "yuuzu"]; g.lrSub = [];
    g.lrManual = { baseAtk: 4518, baseHp: 0, elem: 0.39, elemEl: "光", basicDmg: 0, skillDmg: 0, atkPct: 0 };   // サブの3枚の合計（内訳は未確認。全体の 66% から メイン3枚の分を引いた値）
    ["noya", "firefly", "tilia"].forEach(id => { g.chars[id].embOn = [0, 0, 0]; });
    g.chars.noya.trustLv = 20; g.chars.noya.skillLv = { basic: 9, main: 10, support: 10, ult: 10 };
    g.chars.firefly.skillLv = { basic: 1, main: 1, support: 8, ult: 9 };
    g.chars.firefly.pon = { heart1: false };
    g.chars.tilia.pots2[S.potKey("Renewed Spectrum")] = 1;
    return g;
  }
  // セイナHC（記録Lv34）。共有コードから取り出した入力（初期値との差分）を、初期の入力に重ねる。徽章・ロスレコ・音符・素質を含む
  const HC_PATCH = {"team":{"main":"noya","s1":"tilia","s2":"firefly"},"recordLv":34,"notes":{"強撃の音符":0,"幸運の音符":51,"爆発の音符":15,"体力の音符":35,"集中の音符":15,"器用の音符":30,"必殺の音符":15,"水の音符":0,"風の音符":0,"光の音符":38},"lrMain":{"0":"mirai","1":"negai","2":"yuuzu"},"lrSub":{"0":"anaaki","1":"kakegae","2":"nitamono"},"lrOn":{"mirai:c:taken":false},"lrManual":{"baseAtk":null,"baseHp":null,"elem":null,"elemEl":"光"},"chars":{"noya":{"skillLv":{"basic":9},"trustLv":20,"emb":{"0":{"slots":{"0":{"k":"elemDmg","cat":"ダメージ・貫通"},"1":{"k":"derivedCritRate","q":"gold","cat":"従者・派生"},"2":{"k":"critRate","q":"rainbow","cat":"会心"},"3":{"k":"resPen","q":"rainbow","cat":"ダメージ・貫通"}}},"1":{"slots":{"0":{"k":"hpPct","cat":"ステータス"},"1":{"k":"lvMain","q":"rainbow3","cat":"スキル・素質"},"2":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"},"3":{"k":"spMain","q":"rainbow","cat":"その他"}}},"2":{"slots":{"0":{"k":"potCommon","q":"rainbow3","cat":"スキル・素質","t":"Argent Mirage: Legion's End"},"1":{"k":"baseAtk","cat":"ステータス"},"2":{"k":"ultDmg","q":"rainbow","cat":"ダメージ・貫通"},"3":{"k":"hpPct","q":"rainbow","cat":"ステータス"}}}},"add":{"basic":0.12,"skill":0.12,"hpPct":0.15},"pots2":{"Lucent_Blitz":1,"Dawnflare":1,"Prism_Warp":6,"Resolve__Blitz":6,"Astral_Brilliance":6,"Argent_Mirage__Legion_s_End":9,"Veteran_s_Grit":6,"Lucent_Tide":6,"Guiding_Star":6,"Empyrean_Starfall__Devil_s_End":0}},"firefly":{"skillLv":{"basic":1,"main":3,"support":8,"ult":9},"trustLv":10,"emb":{"0":{"slots":{"0":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"},"1":{"k":"spSupport","cat":"その他"},"2":{"k":"atkPct","cat":"ステータス"},"3":{"k":"resPen","q":"rainbow","cat":"ダメージ・貫通"}}},"1":{"slots":{"0":{"k":"lvMain","q":"rainbow3","cat":"スキル・素質"},"1":{"k":"hpPct","q":"rainbow","cat":"ステータス"},"2":{"k":"spSupport","cat":"その他"},"3":{"k":"ultDmg","q":"rainbow","cat":"ダメージ・貫通"}}},"2":{"slots":{"0":{"k":"potSupport","q":"rainbow2","cat":"スキル・素質","t":"Stellar Crash"},"1":{"k":"potCommon","q":"rainbow3","cat":"スキル・素質","t":"Persistent Warmth"},"2":{"k":"servantDmg","q":"rainbow","cat":"従者・派生"},"3":{"k":"elemDmg","q":"rainbow","cat":"ダメージ・貫通"}}}},"pots2":{"Domain_of_Purity":6,"Stellar_Crash":6,"Radiance_Blade__Twin_Shadow":1,"Radiance_Blade__Firefly":1,"Lightforged_Blade":2,"Persistent_Warmth":4,"Sanctuary_of_Light":1},"pstk":{"Stellar_Crash":0}},"tilia":{"skillLv":{"basic":2,"main":4,"support":9,"ult":3},"emb":{"0":{"slots":{"0":{"k":"spSupport","q":"gold","cat":"その他"}}},"1":{"slots":{"0":{"k":"spSupport","q":"rainbow","cat":"その他"}}},"2":{"slots":{"0":{"k":"potSupport","q":"gold","cat":"スキル・素質","t":"Blinding Beam"}}}},"pots2":{"Holy_Inscription":1,"Renewed_Spectrum":1,"Enemy_Counter":6,"Blinding_Beam":7,"Revealed_Flaw":6,"Knight_s_Seal":1,"Banner_of_Glory":2,"Trick_Boost":0},"pon":{"Revealed_Flaw":false,"Holy_Inscription":false}}},"skOn":{"noya:ult":true}};
  function presetHC() {
    return S.applyDiff(defState(), clone(HC_PATCH));
  }
  let G = defState();
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.team) G = merge(defState(), s); } catch (e) { /* 保存なしでも動く */ }
  function merge(a, b) {
    Object.keys(b).forEach(k => { if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k])) merge(a[k], b[k]); else a[k] = b[k]; });
    return a;
  }
  let shareCode = "", shareMsg = "";
  const V = { panel: "overview", tilesFor: "main", drill: null, pick: null, lrPick: null };
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
    $("topbar").innerHTML = `<b>ビルド:</b>
      <input type="text" id="bname" placeholder="名前" style="min-height:34px;border:2px solid var(--border);border-radius:10px;padding:0 10px;width:140px">
      <button class="btn-add" data-act="bsave">保存</button>
      <select id="bsel" style="width:200px;min-height:34px;padding:0 8px"><option value="">（保存したビルド）</option>${names.map(n => `<option>${esc(n)}</option>`).join("")}</select>
      <button class="btn-add" data-act="bload">読み込み</button><button class="btn-add" data-act="bdel">削除</button>
      <span style="width:14px"></span><b>共有コード:</b>
      <input type="text" id="scode" value="${esc(shareCode)}" placeholder="ここに貼り付け" style="min-height:34px;border:2px solid var(--border);border-radius:10px;padding:0 10px;width:260px">
      <button class="btn-add" data-act="share-out">コードを作る</button><button class="btn-add" data-act="share-in">コードを読み込む</button>
      <span class="muted" id="smsg">${esc(shareMsg)}</span>
      <span style="width:14px"></span>
      <button class="btn-add" data-act="preset-t3">テスト3（徽章なし）を読み込む</button><button class="btn-add" data-act="preset-hc">セイナHC(Lv34)を読み込む</button><button class="btn-add" data-act="reset">全部を初期値に戻す</button>
`;
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
      t("耐性倍率", "×" + f3(dd.res * dd.weak), `耐性×${f3(dd.res)}` + (dd.weak !== 1 ? ` 弱点×${dd.weak}` : "") + `（貫通${fmt(st.pen)}）`) +
      t("防御倍率", f3(dd.def), "敵の防御") +
      t("その他倍率", "×" + f3(taken), "被ダメージ・実測合わせ等");
  }

  // ---- 選択ボタン ----
  function renderSelectors() {
    const b = (key, label) => `<button class="sbtn${V.panel === key ? " on" : ""}" data-act="panel:${key}">${label}</button>`;
    $("selectors").innerHTML =
      `<div class="sel-row">${b("overview", "巡遊者")}${b("direct", "巡遊者（直接入力）")}${b("record", "記録レベル")}${b("lr", "ロスレコ・音符")}${b("gimmick", "ギミック(敵)")}${b("adjust", "補正")}</div>`;
  }

  // ---- キャラカード（ステータス画面用 / 防衛戦突入後用）----
  function cardsHtml(id) {
    const c = chOf(id), cs = G.chars[id];
    const row = (k, v, sub) => `<tr><td>${k}</td><td style="text-align:right"><b>${v}</b></td><td class="muted">${sub || ""}</td></tr>`;
    const o = E.outsideStats(c, cs);
    const d = RD.team[id].st;
    const screen = `<table class="card-t"><tr><th colspan="3">ステータス画面</th></tr>
      ${row("最大HP", fmt(o.hp))}${row("攻撃力", fmt(o.atk))}${row("会心率", pct(o.critRate))}${row("会心ダメージ", pct(o.critDmg))}
      ${row(c.el + "属性ダメージ", pct(1 + o.elemAdd))}${row("属性耐性貫通", fmt(o.pen))}</table>`;
    const def = `<table class="card-t"><tr><th colspan="3">防衛戦に入った直後</th></tr>
      ${row("最大HP", fmt(d.hp), `+${pct(d.hpPct)}`)}${row("攻撃力", fmt(d.atk), `+${pct(d.atkPct)}`)}
      ${row("会心率", pct(d.critRate))}${row("会心ダメージ", pct(d.critDmg))}${row(c.el + "属性ダメージ", pct(1 + d.elemAdd))}
      ${row("通常攻撃ダメージ", pct(d.basicAdd))}${row("スキルダメージ", pct(d.skillAdd))}${row("必殺技ダメージ", pct(d.ultAdd))}${row("印ダメージ", pct(d.markAdd))}
      ${row("属性耐性貫通", fmt(d.pen))}</table>`;
    return `<div class="box">${screen}</div><div class="box">${def}</div>`;
  }

  // ---- 表示エリア: 巡遊者 ----
  function lvFld(id, key, label, note) {
    const bonus = emx(id).lv[key];
    return fld(label, inp(`chars.${id}.skillLv.${key}`, { min: 1, max: 13, step: 1, w: 70 }), (bonus ? `徽章 +${bonus} → Lv${(G.chars[id].skillLv[key] || 10) + bonus}` : "") + (note || ""));
  }
  function renderOverview() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}`;
      return `<div class="chcol"><h3>${l}</h3>
        ${fld("巡遊者", inp(`team.${k}`, { sel: S.CH.map(x => [x.id, x.jp]), str: true }))}
        ${fld("キャラレベル", `<span class="muted">90（固定）</span>`)}
        ${lvFld(id, "basic", "通常攻撃Lv")}${lvFld(id, "main", "主力スキルLv")}${lvFld(id, "support", "支援スキルLv")}${lvFld(id, "ult", "必殺技Lv", "11〜は推定")}
        ${fld("信頼ボーナスLv", inp(`${p}.trustLv`, { min: 0, max: 99, step: 1, w: 70 }))}
        <div class="box"><div class="sel-row" style="margin:0"><button class="obtn" data-act="panel:heart:${k}" style="width:auto">心相</button><button class="obtn" data-act="panel:emb:${k}" style="width:auto">徽章</button><button class="obtn" data-act="panel:pot:${k}" style="width:auto">素質</button><button class="obtn" data-act="panel:add:${k}" style="width:auto">その他</button></div></div>
        ${cardsHtml(id)}
      </div>`;
    };
    return `<div class="cols3">${SLOTS.map(col).join("")}</div>
      <p class="muted">上のボタン（徽章・素質・ロスレコ・記録レベル…）を押すと、この領域が切り替わります。ステータスが画面と合わないときは、「巡遊者（直接入力）」に画面の値を入れてください（入力した欄だけ上書きして計算します）。</p>`;
  }
  // ---- 巡遊者（直接入力）----
  function renderDirect() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}.manual`, st = R.team[id].st;
      const f = (label, key, ph) => fld(label, inp(`${p}.${key}`, { w: 110, ph: ph }));
      return `<div class="chcol"><h3>${l}：${esc(c.jp)}</h3>
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
      <div class="cols3">${SLOTS.map(col).join("")}</div></div>`;
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
      body += `<div class="pot core"><b>主力スキル</b><div>バブルフロッグがダメージを与えると、チームの攻撃力 +${fv}%（6秒・最大5重）</div><div class="lv">重なり ${inp("willowFrog", { min: 0, max: 5, step: 1, w: 60 })}<span class="muted">/5（ウィロー以外の味方に反映）</span></div></div>
        <div class="pot core"><b>必殺技</b><div>チームの攻撃力 +${uv}%（20秒・最大5重）</div><div class="lv">重なり ${inp("willowUlt", { min: 0, max: 5, step: 1, w: 60 })}<span class="muted">/5（ウィロー以外の味方に反映）</span></div></div>`;
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
    const role = key === "potSupport" ? "support" : "main";
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
      body = POTENTIALS.map(x => `<div class="pot${x.core ? " core" : ""}"><b>${esc(x.jp)}</b>${x.core ? '<span class="tag-ok">コア</span>' : ""}<span class="tag-ok">反映</span>
        <div class="muted">${esc(x.text)}</div><div class="lv">${x.core ? "取得(1=あり)" : "Lv"} ${inp(`${p}.pots.${x.id}`, { min: 0, max: 9, step: 1 })}</div></div>`).join("");
      note = "ウィローの素質（主力のとき検証済み）。値は「最大スタック時」の合計で、重なり数の指定は旧ページ（ウィロー側）にあります。ウィローが編成にいると、ナツカ・エレノアにはチーム効果（最大スタック）も乗ります。";
    } else if (id === "nazuka" || id === "eleanor") {
      body = SUP_POTS[id].map(x => `<div class="pot${x.core ? " core" : ""}"><b>${esc(x.jp)}</b>${x.core ? '<span class="tag-ok">コア</span>' : ""}${x.verified ? '<span class="tag-ok">実測一致</span>' : '<span class="tag-ng">未検証</span>'}
        <div class="muted">${esc(x.note || x.verified || "")}</div>
        <div class="lv">Lv ${inp(`${p}.sup.${x.id}.lv`, { min: 0, max: 9, step: 1 })}${x.on === false ? ` 条件を満たす ${inp(`${p}.sup.${x.id}.on`, { chk: 1 })}` : ""}</div></div>`).join("");
      note = "支援として出場したときの素質（検証済みの分だけ効果を反映）。";
    } else if (S.POT_SPEC[id]) {
      const t = TK(c.en);
      const spec = S.POT_SPEC[id];
      const stkIn = (key, e) => {
        const sk = key + (e.sk ? ":" + e.sk : "");
        return `<span class="muted">${e.sk ? (e.sk === "glow" ? "グロウ" : "ハロー") : "重なり"}</span> ${inp(`${p}.pstk.${sk}`, { min: 0, max: e.stk, step: 1, w: 60 })}<span class="muted">/${e.stk}</span> `;
      };
      // 今の枠（主力 or 支援）の素質だけを出す。上にコア4つ、そのあと 特化構築1・2のサブ素質、汎用
      const role = k === "main" ? "main" : "support", roleJa = k === "main" ? "主力" : "支援";
      const card = x => {
        const sp = spec[x.name], key = S.potKey(x.name), core = x.type === 1;
        const nm = esc(JA(x.name, id));
        if (!sp) return `<div class="pot" title="${esc(x.name)}"><b>${nm}</b><span class="tag-ng">計算に未反映</span></div>`;
        const eff = sp.e.length > 0;
        const onv = (cs.pon || {})[key];
        const on = onv == null ? !sp.off : onv;
        const ctl = [];
        const base = (cs.pots2 || {})[key] || 0;
        ctl.push(`<div class="lv">${core ? "取得" : "Lv"} ${inp(`${p}.pots2.${key}`, { min: 0, max: core ? 1 : 9, step: 1 })}${base > 0 && ex.pot[x.name] ? ` → Lv${base + ex.pot[x.name]}` : ""}${eff ? ` 反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}>` : ""}</div>`);
        const seen = {};
        sp.e.forEach(e => { if (e.stk > 1 && !seen[e.sk || ""]) { seen[e.sk || ""] = 1; ctl.push(`<div class="lv">${stkIn(key, e)}</div>`); } });
        sp.e.forEach((e, ei) => { if (e.edit) ctl.push(`<div class="lv"><span class="muted">回数</span> ${inp(`${p}.pcnt.${key}#${ei}`, { min: 0, step: 1, w: 70 })}<span class="muted">既定 ${e.c}</span></div>`); });
        return `<div class="pot${core ? " core" : ""}" title="${esc(x.name)}"><b>${nm}</b>${core ? '<span class="tag-ok">コア</span>' : ""}${tagBonus(x.name)}${eff ? '<span class="tag-ok">反映</span>' : '<span class="tag-ng">火力に影響なし/未反映</span>'}${sp.off ? '<span class="tag-ng">既定は反映しない</span>' : ""}
          <div class="muted">${esc(sp.txt)}</div>${ctl.join("")}</div>`;
      };
      const groups = t.potentials[role] || [];
      const builds = groups.filter(g => !/Generic/i.test(g.title)), generic = groups.find(g => /Generic/i.test(g.title));
      const bn = g => { const m = /Build (\d)/i.exec(g.title); return m ? m[1] : "?"; };
      const grid = (arr, cols) => `<div class="pgrid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${arr.map(card).join("")}</div>`;
      const coreRow = `<div class="pgrid" style="grid-template-columns:repeat(${Math.max(1, builds.length)},minmax(0,1fr));gap:14px">${builds.map(g => `<div><div class="phead">コア：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type === 1), 2)}</div>`).join("")}</div>`;
      const subRows = builds.map(g => `<div class="phead">${roleJa}：特化構築${bn(g)}</div>${grid(g.potentials.filter(x => x.type !== 1), 3)}`).join("");
      const genRow = generic ? `<div class="phead">汎用</div>${grid(generic.potentials, 3)}` : "";
      body = `<div style="grid-column:1/-1">${coreRow}${subRows}${genRow}</div>`;
      note = "名前は日本語（マウスを重ねると英語名）。効果は原文を読んで分類した内容を表の下に書いています。回数や重なりが原文に書かれていないものは「仮」の値なので、実測に合わせて直してください。「全員が光」の条件は、編成から自動で判定します。残光の有無は「ギミック(敵)」で切り替えます。";
    } else {
      const t = TK(c.en), groups = (t.potentials[k === "main" ? "main" : "support"] || []);
      body = groups.map(g => g.potentials.map(x => `<div class="pot${x.type === 1 ? " core" : ""}" title="${esc(x.name)}"><b>${esc(JA(x.name, id))}</b>${x.type === 1 ? '<span class="tag-ok">コア</span>' : ""}<span class="tag-ng">計算に未反映</span>
        <div class="lv">Lv ${inp(`${p}.pots2.${x.name.replace(/[^A-Za-z0-9]/g, "_")}`, { min: 0, max: 9, step: 1 })}</div></div>`).join("")).join("");
      note = "このキャラの素質の効果は、まだ式に入れていません。反映したい効果は「その他」に手で入れられます。";
    }
    return `<div class="wide"><h3>${esc(c.jp)}：素質の一覧選択</h3><div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${body}</div><p class="muted">${note}</p></div>`;
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
  function renderLr() {
    const L = LOSTRECORDS;
    const nm = id => { const r = L.find(x => x.id === id); return r ? r.name + "（" + r.element + "）" : "（なし）"; };
    const slot = (arr, i, lab) => {
      const path = `${arr}.${i}`, open = V.lrPick === path, cur = (G[arr] || [])[i] || "";
      const list = `<div class="picker"><div class="sel-row"><button class="sbtn${cur === "" ? " on" : ""}" data-act="lrset:${path}:">（なし）</button>${L.map(x => `<button class="sbtn${cur === x.id ? " on" : ""}" data-act="lrset:${path}:${x.id}">${esc(x.name)}<small>（${x.element}）</small></button>`).join("")}</div></div>`;
      return `<div class="emb-slot"><span class="muted">${lab}</span> <button class="slotbtn${open ? " on" : ""}" data-act="lrpick:${path}">${esc(nm(cur))}</button>${open ? list : ""}</div>`;
    };
    const m = "lrManual";
    const noteIn = S.NOTE_KEYS.map(n => fld(n, inp(`notes.${esc(n)}`, { min: 0, max: 99, step: 1, w: 80 }), NOTES[n] ? "1Lvあたり " + pct(NOTES[n].perLv) : "")).join("");
    const counts = S.LR_COUNTS.map(c => fld(c.label, inp(`lrN.${c.key}`, { min: 0, max: c.max, step: 1, w: 70 }), `最大 ${c.max}`)).join("");
    // メインのロスレコの効果
    const fxHtml = (G.lrMain || []).filter(Boolean).map(id => {
      const fx = S.LR_FX[id], r = L.find(x => x.id === id);
      if (!r) return "";
      if (!fx) return `<div class="pot"><b>${esc(r.name)}</b><span class="tag-ng">効果は未反映（基礎攻撃・基礎HP・属性ダメージだけ反映）</span></div>`;
      const item = (key, it, lv) => {
        const txt = typeof it.txt === "function" ? it.txt(lv) : it.txt;
        const tog = it.off ? ` 反映 <input type="checkbox" data-p="lrOn.${key}" data-t="b"${(G.lrOn || {})[key] ? " checked" : ""}>` : (it.need ? ` <span class="muted">条件: ${(S.LR_COUNTS.find(c => c.key === it.need[0]) || {}).label} が ${it.need[1]} 以上</span>` : (it.n ? ` <span class="muted">数: ${(S.LR_COUNTS.find(c => c.key === it.n) || {}).label}</span>` : ` <span class="tag-ok">常時</span>`));
        return `<div style="margin:3px 0">${esc(txt)}${tog}</div>`;
      };
      const core = fx.core.map(it => item(id + ":c:" + it.id, it, 1)).join("");
      const as = fx.assists.map(a => {
        const lv = S.lrAssistLv(G.notes, a);
        const need = a.notes.map(n => n.replace("の音符", "")).join("・");
        return `<div style="margin-top:6px"><b>${esc(a.name)}</b> ${lv ? `<span class="tag-ok">Lv${lv} 発動</span>` : '<span class="tag-ng">未発動</span>'}<span class="muted"> 解放: ${need} ${a.base}以上（Lvごとに+15）</span>
          ${lv ? a.items.map(it => item(id + ":" + a.id + ":" + it.id, it, lv)).join("") : ""}</div>`;
      }).join("");
      return `<div class="pot core" style="grid-column:1/-1"><b>${esc(r.name)}</b> <span class="muted">コア効果</span>${core}${as ? `<div class="muted" style="margin-top:6px">アシスト効果（音符のレベルで自動で解放）</div>${as}` : ""}</div>`;
    }).join("");
    return `<div class="wide"><h3>ロスレコ・音符</h3>
      <div>${[0, 1, 2].map(i => slot("lrMain", i, "メイン" + (i + 1))).join("")}${[0, 1, 2].map(i => slot("lrSub", i, "サブ" + (i + 1))).join("")}</div>
      <p class="muted">ロスレコの基礎攻撃力・基礎HP・属性ダメージ%は、全員に入ります（属性が違うロスレコの属性ダメージは、その属性の巡遊者だけ）。コア効果・アシスト効果は、メインのものだけです。</p>
      <h3 style="margin-top:12px;font-size:14px">音符（探索で獲得した分を入力。サブのロスレコの初期音符は自動で足します）</h3>
      <div class="grid-in">${noteIn}</div><p class="note">合計: ${S.NOTE_KEYS.map(n => { const t = (S.notesTotal(G)[n] || 0); return t ? n.replace("の音符", "") + " " + t : ""; }).filter(Boolean).join(" ／ ") || "なし"}</p>
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
      ${els.map(e => `<tr><td>${e}${en.weak.indexOf(e) >= 0 ? "（弱点）" : ""}</td><td>${inp(`enemyOv.res.${e}`, { w: 90 })}<span class="muted"> 既定 ${en.res[e] != null ? en.res[e] : 250}</span></td><td>${inp(`enemyOv.extra.${e}`, { w: 90 })}<span class="muted"> 既定 ${(en.extra && en.extra[e]) || 1}</span></td></tr>`).join("")}</table>
      <p class="muted">耐性の式は、有効耐性 = 耐性 − 貫通 のとき 倍率 = 1 − 0.25×(E/250)²（実測と一致）。「その他」は、原因が分かっていない差を合わせるための倍率です。</p></div>`;
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
    else h = renderOverview();
    $("display").innerHTML = (V.panel === "overview" ? "" : `<div style="margin-bottom:8px"><button class="btn-add" data-act="panel:overview">← 巡遊者に戻る</button></div>`) + h;
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
      ["basic", "通常攻撃（1ローテ）", groupSummary(main, "basic"), main],
      ["main", "主力スキル", groupSummary(main, "main"), main],
      ["ult", "必殺技", groupSummary(main, "ult"), main],
      ["mark", "印", groupSummary(main, "main", true) || groupSummary(main, "ult", true), main],
      ["sup1", "支援スキル（支援1）", groupSummary(s1, "support"), s1],
      ["sup2", "支援スキル（支援2）", groupSummary(s2, "support"), s2],
    ];
    window.__items = items;
    const curVals = {};
    $("result").innerHTML = items.map(([key, label, sm, id]) => {
      const nm = esc(chOf(id).jp);
      if (!sm) return `<div class="res-row"><div class="tile"><span>${label}倍率</span><b>—</b><small>${nm}にはこの項目がありません</small></div><div class="tile"><span>${label}ダメージ</span><b>—</b></div></div>`;
      curVals[key] = sm.exp;
      let cmp = "";
      if (memo && memo.v && memo.v[key] != null) {
        const d = sm.exp / memo.v[key] - 1;
        cmp = `<div class="cmp ${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${(Math.round(d * 1000) / 10)}%</div>`;
      }
      return `<div class="res-row"><div class="tile"><span>${label}倍率（${nm}）</span><b>${fmt(sm.mult)}%</b>
        <small>種別ダメージ ×${f3(sm.B)}</small><small>会心率 ${pct(sm.rate)} ／ 会心ダメージ ${pct(sm.critDmg)}</small><small>会心期待値倍率 ×${f3(sm.expMult)}</small></div>
        <div class="tile pink${V.drill === key ? " sel" : ""}" data-act="drill:${key}"><span>${label}ダメージ</span><b>${fmt(sm.exp)}</b><small>非会心 ${fmt(sm.non)} ／ 会心 ${fmt(sm.crit)}</small>${cmp}</div></div>`;
    }).join("");
    window.__cur = curVals;
    renderDrill(items);
  }
  function renderDrill(items) {
    const it = items.find(x => x[0] === V.drill);
    const panel = $("drillPanel");
    if (!it || !it[2]) { panel.style.display = "none"; return; }
    panel.style.display = "";
    const sm = it[2];
    $("drillTitle").textContent = `${it[1]}の内訳（${chOf(it[3]).jp}）`;
    $("drill").innerHTML = `<div class="tbl-wrap"><table><tr><th>ヒット</th><th>種別</th><th>倍率%</th><th>回数</th><th>非会心</th><th>会心</th><th>期待値</th><th>小計</th></tr>
      ${sm.rows.map(r => `<tr><td>${esc(r.name)}</td><td>${E.TYPE_NAME[r.type]}</td><td>${f3(r.mult)}</td><td>${r.count}</td><td>${fmt(r.normal)}</td><td>${fmt(r.crit)}</td><td>${fmt(r.avg)}</td><td>${fmt(r.total)}</td></tr>
      <tr><td colspan="8" class="muted" style="text-align:left">属性W ×${f3(r.W)}／種別B ×${f3(r.B)}／被ダメ ×${f3(r.taken)}／敵D ×${f3(r.D)}${r.markX !== 1 ? `／印の別枠 ×${r.markX}` : ""}／会心率 ${pct(r.rate)}</td></tr>`).join("")}
      <tr class="sum"><td>合計</td><td></td><td>${f3(sm.mult)}</td><td></td><td>${fmt(sm.non)}</td><td>${fmt(sm.crit)}</td><td></td><td>${fmt(sm.exp)}</td></tr></table></div>`;
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
    if (a.indexOf("drill:") === 0) { const k = a.slice(6); V.drill = V.drill === k ? null : k; renderAll(); return; }
    if (a.indexOf("embclear:") === 0) { embClear(a); renderAll(); return; }
    if (a.indexOf("lrpick:") === 0) { const p = a.slice(7); V.lrPick = V.lrPick === p ? null : p; renderAll(); return; }
    if (a.indexOf("lrset:") === 0) { const [, p, id] = a.split(":"); const [arr, i] = p.split("."); G[arr] = G[arr] || []; G[arr][+i] = id; V.lrPick = null; renderAll(); return; }
    let builds = {};
    try { builds = JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { builds = {}; }
    if (a === "bsave") { const n = $("bname").value.trim(); if (!n) return; builds[n] = clone(G); try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } renderTop(); }
    else if (a === "bload") { const n = $("bsel").value; if (n && builds[n]) { G = merge(defState(), clone(builds[n])); renderAll(); } }
    else if (a === "bdel") { const n = $("bsel").value; if (n && builds[n]) { delete builds[n]; try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } renderTop(); } }
    else if (a === "memo") { memo = { v: clone(window.__cur || {}) }; try { localStorage.setItem(KEY_M, JSON.stringify(memo)); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "memodel") { memo = null; try { localStorage.removeItem(KEY_M); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "share-out") {
      S.shareEncode(G, defState(), [G.team.main, G.team.s1, G.team.s2]).then(code => {
        shareCode = code; shareMsg = `コードを作りました（${code.length}文字）`;
        try { navigator.clipboard.writeText(code).then(() => { shareMsg += "。コピーしました"; renderTop(); }, () => { /* コピーできない環境では、枠から選んでコピー */ }); } catch (e) { /* 無視 */ }
        renderTop();
      });
    }
    else if (a === "share-in") {
      const code = $("scode").value; shareCode = code;
      S.shareDecode(code, defState()).then(g => { G = g; shareMsg = "コードを読み込みました"; renderAll(); }).catch(e => { shareMsg = e.message || "読み込めませんでした"; renderTop(); });
    }
    else if (a === "preset-t3") { G = presetTest3(); renderAll(); }
    else if (a === "preset-hc") { G = presetHC(); renderAll(); }
    else if (a === "reset") { if (confirm("入力をすべて初期値に戻します。よいですか？")) { G = defState(); renderAll(); } }
  });
  renderAll();
})();
