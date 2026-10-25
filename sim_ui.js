// 汎用計算ページの画面。状態は localStorage に保存（無くても動く）。入力の確定（change）のたびに全体を描き直す。
(function () {
  const S = window.SIM, E = S.engine;
  const $ = id => document.getElementById(id);
  const fmt = n => (n == null || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("ja-JP");
  const f3 = n => (n == null || !isFinite(n)) ? "—" : (Math.round(n * 1000) / 1000).toString();
  const pct = n => (Math.round(n * 1000) / 10) + "%";
  const clone = o => JSON.parse(JSON.stringify(o));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const KEY = "stellasora-sim-v2", KEY_B = "stellasora-sim-builds", KEY_M = "stellasora-sim-memo";
  const SLOTS = [["main", "主力"], ["s1", "支援1"], ["s2", "支援2"]];
  const TK = en => TREKKERS.find(x => x.en === en);
  const chOf = id => S.CH.find(c => c.id === id);

  function defChar(id) {
    const c = chOf(id);
    const lv = { nazuka: { basic: 1, main: 1, support: 8, ult: 7 }, eleanor: { basic: 1, main: 1, support: 9, ult: 8 } }[id] || { basic: 10, main: 10, support: 10, ult: 10 };
    return { mode: "auto", trustLv: c.trust0, talent: c.talent0, skillLv: clone(lv), emb: S.EMB_DEFAULT[id](), embOn: [1, 1, 1], add: {},
      manual: { atk: 0, hp: 0, elem: 0, basic: 0, skill: 0, ult: 0, mark: 0, critRate: 5, critDmg: 150, pen: 0 }, pots: {}, sup: {}, pots2: {}, pon: {}, pstk: {}, pcnt: {} };
  }
  function defState() {
    const G = { team: { main: "willow", s1: "nazuka", s2: "eleanor" }, recordLv: 4, enemy: "stomp", traits: {}, enemyOv: { res: {}, extra: {} },
      notes: clone(TEST2_CTX.notes), lrMain: clone(TEST2_CTX.lr), lrSub: clone(TEST2_CTX.lrSub),
      lrManual: { baseAtk: 0, baseHp: 0, elem: 0, elemEl: "", basicDmg: 0, skillDmg: 0, atkPct: 0 },
      other: { mult: 1, taken: 1 }, heartCrit: false, glimmer: true, markDebuff: true, chars: {} };
    S.CH.forEach(c => { G.chars[c.id] = defChar(c.id); });
    return G;
  }

  // ---- プリセット: セイナHC（記録Lv34・更新版）。素質の対応は、画面の名前とWikiの効果を照らして付けたもの ----
  function presetHC() {
    const g = defState();
    g.team = { main: "noya", s1: "tilia", s2: "firefly" };
    g.recordLv = 34; g.enemy = "stomp"; g.glimmer = true;
    g.notes = { "強撃の音符": 0, "幸運の音符": 51, "爆発の音符": 15, "体力の音符": 35, "集中の音符": 15, "器用の音符": 30, "必殺の音符": 15, "水の音符": 0, "風の音符": 0, "光の音符": 38 };
    g.lrMain = []; g.lrSub = [];
    g.lrManual = { baseAtk: 8565, baseHp: 6990, elem: 0.66, elemEl: "光", basicDmg: 0, skillDmg: 0, atkPct: 0 };
    const K = S.potKey;
    const n = g.chars.noya, f = g.chars.firefly, t = g.chars.tilia;
    n.add = { basic: 0.12, skill: 0.12, hpPct: 0.15 };   // ロスレコのコア: 通常・スキルダメージ+12%（セイナのみ）、チームのHP+15%（未来導く明星）
    [["Lucent Blitz", 1], ["Dawnflare", 1], ["Prism Warp", 6], ["Resolve: Blitz", 5], ["Astral Brilliance", 6], ["Argent Mirage: Legion's End", 9], ["Veteran's Grit", 6], ["Lucent Tide", 6], ["Guiding Star", 6]].forEach(([k, v]) => { n.pots2[K(k)] = v; });
    [["Domain of Purity", 6], ["Stellar Crash", 6]].forEach(([k, v]) => { f.pots2[K(k)] = v; });
    f.pstk[K("Stellar Crash")] = 0;
    [["Holy Inscription", 1], ["Renewed Spectrum", 1], ["Enemy Counter", 6], ["Blinding Beam", 7], ["Revealed Flaw", 6], ["Knight's Seal", 1]].forEach(([k, v]) => { t.pots2[K(k)] = v; });
    t.pon[K("Revealed Flaw")] = true;
    return g;
  }
  let G = defState();
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.team) G = merge(defState(), s); } catch (e) { /* 保存なしでも動く */ }
  function merge(a, b) {
    Object.keys(b).forEach(k => { if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k])) merge(a[k], b[k]); else a[k] = b[k]; });
    return a;
  }
  const V = { panel: "overview", tilesFor: "main", drill: null };
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
    return `<input type="number" data-p="${path}" data-t="n" step="${step}"${o.min != null ? ` min="${o.min}"` : ""}${o.max != null ? ` max="${o.max}"` : ""} value="${v == null ? "" : v}"${o.w ? ` style="width:${o.w}px"` : ""}>`;
  };
  const fld = (label, html, note) => `<div class="fld"><label>${label}</label><div>${html}${note ? `<span class="muted"> ${note}</span>` : ""}</div></div>`;

  // ---- 計算 ----
  let R = null;
  function recalc() {
    S.CH.forEach(c => { if (!G.chars[c.id]) G.chars[c.id] = defChar(c.id); });
    R = E.calcTeam(G);
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
      <span style="width:14px"></span><b>比較:</b>
      <button class="btn-add" data-act="memo">現在値を記憶</button><button class="btn-add" data-act="memodel">記憶を消す</button>
      <button class="btn-add" data-act="preset-hc">セイナHC(Lv34)を読み込む</button><button class="btn-add" data-act="reset">全部を初期値に戻す</button>
      <span class="muted">${memo ? "記憶あり（結果のピンクに増減を表示）" : "記憶なし"}</span>`;
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
    const ch = k => esc(chOf(G.team[k]).jp);
    $("selectors").innerHTML =
      `<div class="sel-row">${b("overview", "全体（3人の入力とカード）")}${SLOTS.map(([k, l]) => b("status:" + k, `${l} ステータス入力`)).join("")}${b("record", "記録")}${b("gimmick", "ギミック(敵)")}${b("adjust", "補正")}</div>` +
      `<div class="sel-row">${SLOTS.map(([k, l]) => b("card:" + k, `${l} キャラカードを見る`)).join("")}${b("lr", "ロスレコ")}${b("notes", "音符")}</div>`;
  }

  // ---- 表示エリア ----
  function cardHtml(id) {
    const o = R.team[id], c = o.c, st = o.st;
    const row = (k, v, sub) => `<tr><td>${k}</td><td style="text-align:right"><b>${v}</b></td><td class="muted">${sub || ""}</td></tr>`;
    const nonAuto = st.mode === "manual";
    return `<table class="card-t">
      ${row("最大HP", fmt(st.hp), nonAuto ? "手入力" : `基礎 ${fmt(st.baseHp)} × (1+${pct(st.hpPct)})`)}
      ${row("攻撃力", fmt(st.atk), nonAuto ? "手入力" : `基礎 ${fmt(st.baseAtk)} × (1+${pct(st.atkPct)})`)}
      ${row("会心率", pct(st.critRate))}${row("会心ダメージ", pct(st.critDmg))}
      ${row(c.el + "属性ダメージ", pct(st.elemAdd))}
      ${row("通常攻撃ダメージ", pct(st.basicAdd))}${row("スキルダメージ", pct(st.skillAdd))}${row("必殺技ダメージ", pct(st.ultAdd))}${row("印ダメージ", pct(st.markAdd))}
      ${row("属性耐性貫通", fmt(st.pen))}
      ${nonAuto ? "" : row("内訳", "", `キャラ基礎 ${fmt(c.ref === "hp" ? st.baseHp0 : st.baseAtk0)}／信頼 ${fmt(c.ref === "hp" ? st.trustHp : st.trustAtk)}／心相 ${fmt(c.ref === "hp" ? st.talHp : st.talAtk)}／記録Lv ${fmt(c.ref === "hp" ? st.rec.hp : st.rec.atk)}`)}
    </table>`;
  }
  function renderOverview() {
    const col = ([k, l]) => {
      const id = G.team[k], c = chOf(id), p = `chars.${id}`;
      return `<div class="chcol"><h3>${l}</h3>
        ${fld("巡遊者", inp(`team.${k}`, { sel: S.CH.map(x => [x.id, x.jp]), str: true }))}
        ${fld("キャラレベル", `<span class="muted">90（固定）</span>`)}
        ${fld("通常攻撃Lv", inp(`${p}.skillLv.basic`, { min: 1, max: 13, step: 1, w: 70 }))}
        ${fld("主力スキルLv", inp(`${p}.skillLv.main`, { min: 1, max: 13, step: 1, w: 70 }))}
        ${fld("支援スキルLv", inp(`${p}.skillLv.support`, { min: 1, max: 13, step: 1, w: 70 }))}
        ${fld("必殺技Lv", inp(`${p}.skillLv.ult`, { min: 1, max: 13, step: 1, w: 70 }), "11〜は推定")}
        ${fld("信頼ボーナスLv", inp(`${p}.trustLv`, { min: 0, max: 99, step: 1, w: 70 }))}
        ${fld("心相（段階）", inp(`${p}.talent`, { min: 0, max: 50, step: TK(c.en).rarity >= 5 ? 10 : 5, w: 70 }), `0〜50／${Math.floor((G.chars[id].talent || 0) / 10)}凸`)}
        ${fld("ステータス", inp(`${p}.mode`, { sel: [["auto", "選択から計算"], ["manual", "画面の値を手入力"]], str: true }))}
        <div class="sel-row"><button class="obtn" data-act="panel:emb:${k}" style="width:auto">徽章</button><button class="obtn" data-act="panel:pot:${k}" style="width:auto">素質</button><button class="obtn" data-act="panel:add:${k}" style="width:auto">加算(その他)</button></div>
        ${cardHtml(id)}
      </div>`;
    };
    return `<div class="cols3">${SLOTS.map(col).join("")}</div>
      <p class="muted">上のボタン（徽章・素質・ロスレコ・音符・記録…）を押すと、この領域が切り替わります。「全体」で戻れます。ステータスが画面と合わないときは「ステータス」を手入力に切り替えて、画面の値を入れてください。</p>`;
  }
  function renderStatus(k) {
    const id = G.team[k], c = chOf(id), p = `chars.${id}.manual`;
    return `<div class="wide"><h3>${SLOTS.find(x => x[0] === k)[1]}：${esc(c.jp)} ステータス入力（ゲーム画面の「ステータス詳細」の値）</h3>
      ${fld("計算方法", inp(`chars.${id}.mode`, { sel: [["auto", "選択から計算"], ["manual", "この画面の値を使う"]], str: true }))}
      <div class="grid-in">
        ${fld("最大HP", inp(`${p}.hp`, { w: 110 }))}${fld("攻撃力", inp(`${p}.atk`, { w: 110 }))}
        ${fld("会心率(%)", inp(`${p}.critRate`, { w: 110 }))}${fld("会心ダメージ(%)", inp(`${p}.critDmg`, { w: 110 }))}
        ${fld(c.el + "属性ダメージ(%)", inp(`${p}.elem`, { w: 110 }))}${fld("通常攻撃ダメージ(%)", inp(`${p}.basic`, { w: 110 }))}
        ${fld("スキルダメージ(%)", inp(`${p}.skill`, { w: 110 }))}${fld("必殺技ダメージ(%)", inp(`${p}.ult`, { w: 110 }))}
        ${fld("印ダメージ(%)", inp(`${p}.mark`, { w: 110 }))}${fld("属性耐性貫通", inp(`${p}.pen`, { w: 110 }))}
      </div>
      <p class="muted">「属性ダメージ」は 100% を除いた加算分（画面が112%なら12）を入れてください。戦闘中だけ付く心相の効果などは画面に出ないので、その分は「加算(その他)」や素質で補います。</p></div>`;
  }
  function renderCard(k) {
    const id = G.team[k];
    return `<div class="wide"><h3>${SLOTS.find(x => x[0] === k)[1]}：${esc(chOf(id).jp)} キャラカード</h3><div style="max-width:560px">${cardHtml(id)}</div></div>`;
  }
  function renderAdd(k) {
    const id = G.team[k], c = chOf(id), p = `chars.${id}.add`;
    return `<div class="wide"><h3>${esc(c.jp)}：加算（その他）— 素質や心相などの効果で、この画面にまだ無いものを入れる場所</h3>
      <div class="grid-in">
        ${fld("基礎攻撃力 加算", inp(`${p}.atkFlat`, { w: 100 }), "掛け算の前")}${fld("基礎HP 加算", inp(`${p}.hpFlat`, { w: 100 }), "掛け算の前")}
        ${fld("攻撃力% 加算", inp(`${p}.atkPct`, { w: 100 }), "例 0.1=10%")}${fld("最大HP% 加算", inp(`${p}.hpPct`, { w: 100 }), "例 0.1=10%")}
        ${fld(c.el + "属性ダメ 加算", inp(`${p}.elem`, { w: 100 }))}${fld("通常ダメ 加算", inp(`${p}.basic`, { w: 100 }))}
        ${fld("スキルダメ 加算", inp(`${p}.skill`, { w: 100 }))}${fld("必殺ダメ 加算", inp(`${p}.ult`, { w: 100 }))}
        ${fld("印ダメ 加算", inp(`${p}.mark`, { w: 100 }))}${fld("会心率 加算", inp(`${p}.critRate`, { w: 100 }))}
        ${fld("会心ダメ 加算", inp(`${p}.critDmg`, { w: 100 }))}${fld("貫通 加算", inp(`${p}.pen`, { w: 100 }))}
      </div><p class="muted">割合は 0.1 = 10% の形で入力します。</p></div>`;
  }
  function renderEmblem(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id];
    const opts = EMBLEM_OPTIONS;
    const q = EMBLEM_QUALITY;
    const card = (e, i) => `<div class="emb-card"><h4><label style="display:inline-flex;gap:6px;align-items:center;margin:0"><input type="checkbox" data-p="chars.${id}.embOn.${i}" data-t="b01"${cs.embOn[i] ? " checked" : ""}>${esc(e.name)}</label></h4>
      ${e.slots.map((sl, j) => `<div class="emb-row">
        <select data-p="chars.${id}.emb.${i}.slots.${j}.k" data-t="s"><option value="">（なし）</option>${opts.map(o => `<option value="${o.key}"${o.key === sl.k ? " selected" : ""}>${esc(o.label)}</option>`).join("")}</select>
        <select data-p="chars.${id}.emb.${i}.slots.${j}.q" data-t="s">${q.map(x => `<option value="${x[0]}"${x[0] === sl.q ? " selected" : ""}>${x[1]}</option>`).join("")}</select></div>`).join("")}</div>`;
    const sum = E.emblemSum(cs.emb, cs.embOn);
    const sumTxt = Object.keys(sum).map(key => { const o = EMBLEM_OPTIONS.find(x => x.key === key); return `${o.label} ${o.fmt === "pct" ? pct(sum[key]) : fmt(sum[key])}`; }).join(" ／ ");
    return `<div class="wide"><h3>${esc(c.jp)}：徽章（3枚×4枠）</h3><div class="cols3">${cs.emb.map(card).join("")}</div>
      <div class="note">合計: ${sumTxt || "なし"}</div>
      <p class="muted">スキルレベル上昇・素質レベル上昇の項目は、計算に自動では入りません（スキルLv・素質Lvの欄で足してください）。セイナ・ホタル・ティリアの初期の徽章は、分かっている合計に合わせた仮の配置です。</p></div>`;
  }
  function potBlock(label, body) { return `<h3 style="margin-top:12px;font-size:14px">${label}</h3><div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${body}</div>`; }
  function renderPot(k) {
    const id = G.team[k], c = chOf(id), cs = G.chars[id], p = `chars.${id}`;
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
      const t = TK(c.en), slotGrp = k === "main" ? "main" : "support";
      const spec = S.POT_SPEC[id];
      const stkIn = (key, e) => {
        const sk = key + (e.sk ? ":" + e.sk : "");
        return `<span class="muted">${e.sk ? (e.sk === "glow" ? "グロウ" : "ハロー") : "重なり"}</span> ${inp(`${p}.pstk.${sk}`, { min: 0, max: e.stk, step: 1, w: 60 })}<span class="muted">/${e.stk}</span> `;
      };
      body = (t.potentials[slotGrp] || []).map(b => `<div style="grid-column:1/-1"><b style="color:var(--indigo);font-size:13px">${esc(b.title.replace(/^.*?: ?/, ""))}</b></div>` + b.potentials.map(x => {
        const sp = spec[x.name], key = S.potKey(x.name), core = x.type === 1;
        if (!sp) return `<div class="pot" title="${esc(x.text || "")}"><b>${esc(x.name)}</b><span class="tag-ng">計算に未反映</span></div>`;
        const eff = sp.e.length > 0;
        const lv = (cs.pots2 || {})[key] || 0;
        const onv = (cs.pon || {})[key];
        const on = onv == null ? !sp.off : onv;
        const ctl = [];
        ctl.push(`<div class="lv">${core ? "取得" : "Lv"} ${inp(`${p}.pots2.${key}`, { min: 0, max: core ? 1 : 9, step: 1 })}${eff ? ` 反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}>` : ""}</div>`);
        const seen = {};
        sp.e.forEach(e => { if (e.stk > 1 && !seen[e.sk || ""]) { seen[e.sk || ""] = 1; ctl.push(`<div class="lv">${stkIn(key, e)}</div>`); } });
        sp.e.forEach((e, ei) => { if (e.edit) ctl.push(`<div class="lv"><span class="muted">回数</span> ${inp(`${p}.pcnt.${key}#${ei}`, { min: 0, step: 1, w: 70 })}<span class="muted">既定 ${e.c}</span></div>`); });
        return `<div class="pot${core ? " core" : ""}" title="${esc(x.text || "")}"><b>${esc(x.name)}</b>${core ? '<span class="tag-ok">コア</span>' : ""}${eff ? '<span class="tag-ok">反映</span>' : '<span class="tag-ng">火力に影響なし/未反映</span>'}${sp.off ? '<span class="tag-ng">既定は反映しない</span>' : ""}
          <div class="muted">${esc(sp.txt)}</div>${ctl.join("")}</div>`;
      }).join("")).join("");
      note = "名前は Wiki の英語名（マウスを重ねると英語の原文）。効果は原文を読んで分類した内容を表の下に書いています。回数や重なりが原文に書かれていないものは「仮」の値なので、実測に合わせて直してください。「全員が光」の条件は、編成から自動で判定します。残光の有無は「ギミック(敵)」で切り替えます。";
    } else {
      const t = TK(c.en), groups = (t.potentials.support || []).concat(t.potentials.main || []);
      body = groups.map(g => g.potentials.map(x => `<div class="pot${x.type === 1 ? " core" : ""}" title="${esc(x.text || x.brief || "")}"><b>${esc(x.name)}</b>${x.type === 1 ? '<span class="tag-ok">コア</span>' : ""}<span class="tag-ng">計算に未反映</span>
        <div class="lv">Lv ${inp(`${p}.pots2.${x.name.replace(/[^A-Za-z0-9]/g, "_")}`, { min: 0, max: 9, step: 1 })}</div></div>`).join("")).join("");
      note = "このキャラの素質の効果は、まだ式に入れていません。反映したい効果は「加算(その他)」に手で入れられます。";
    }
    const hs = (S.HEART_SPEC || {})[id];
    const heart = hs ? `<h3 style="margin:4px 0 6px;font-size:14px">心相（凸）の戦闘中の効果 <span class="muted">段階 ${cs.talent || 0}（${Math.floor((cs.talent || 0) / 10)}凸）</span></h3>
      <div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));margin-bottom:10px">${hs.map(h => {
        const un = (cs.talent || 0) >= h.n * 10, key = "heart" + h.n, onv = (cs.pon || {})[key], on = onv == null ? !h.off : onv;
        return `<div class="pot${un ? " core" : ""}"><b>${h.n} ${esc(h.name)}</b>${un ? '<span class="tag-ok">解放済み</span>' : '<span class="tag-ng">未解放</span>'}
          <div class="muted">${esc(h.txt)}</div>${un ? `<div class="lv">反映 <input type="checkbox" data-p="${p}.pon.${key}" data-t="b"${on ? " checked" : ""}></div>` : ""}</div>`;
      }).join("")}</div>` : "";
    return `<div class="wide"><h3>${esc(c.jp)}：素質の一覧選択</h3>${heart}<div class="grid-in" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${body}</div><p class="muted">${note}</p></div>`;
  }
  function renderRecord() {
    const r = E.recordBonus(G.recordLv);
    const opts = (RECORD_LEVELS || []).map(x => [x[0], `Lv${x[0]}（攻撃+${x[2]} / HP+${x[3]}）`]);
    return `<div class="wide"><h3>記録レベルボーナス（戦闘中に全員の基礎攻撃力・基礎HPへ加算）</h3>
      ${fld("記録レベル", inp("recordLv", { sel: opts }))}
      <p class="note">現在: 攻撃力 +${fmt(r.atk)} ／ 最大HP +${fmt(r.hp)}（全員の基礎値に足してから%を掛けます）</p></div>`;
  }
  function renderNotes() {
    return `<div class="wide"><h3>音符（星ノ塔バッグ「音符効果」のレベル）</h3><div class="grid-in">
      ${S.NOTE_KEYS.map(n => fld(n, inp(`notes.${esc(n)}`, { min: 0, max: 99, step: 1, w: 80 }), NOTES[n] ? "1Lvあたり " + pct(NOTES[n].perLv) : "")).join("")}</div></div>`;
  }
  function renderLr() {
    const L = LOSTRECORDS.map(x => [x.id, x.name + "（" + x.element + "）"]);
    const sel = (path) => inp(path, { sel: [["", "（なし）"]].concat(L), str: true });
    const cell = (arr, i, lab) => fld(lab, sel(`${arr}.${i}`));
    const m = "lrManual";
    return `<div class="wide"><h3>ロスレコ（メイン3枚・サブ3枚。基礎攻撃力・基礎HP・属性ダメージ%が全員に入ります）</h3>
      <div class="grid-in">${[0, 1, 2].map(i => cell("lrMain", i, "メイン" + (i + 1))).join("")}${[0, 1, 2].map(i => cell("lrSub", i, "サブ" + (i + 1))).join("")}</div>
      <h3 style="margin-top:12px;font-size:14px">一覧にないロスレコの合計（手入力）</h3>
      <div class="grid-in">
        ${fld("基礎攻撃力 合計", inp(m + ".baseAtk", { w: 100 }))}${fld("基礎HP 合計", inp(m + ".baseHp", { w: 100 }))}
        ${fld("属性ダメージ 合計", inp(m + ".elem", { w: 100 }), "0.66=66%")}${fld("その属性", inp(m + ".elemEl", { sel: [["", "全員"], ["光", "光"], ["水", "水"], ["風", "風"], ["火", "火"], ["地", "地"], ["闇", "闇"]], str: true }))}
        ${fld("通常ダメ 合計", inp(m + ".basicDmg", { w: 100 }))}${fld("スキルダメ 合計", inp(m + ".skillDmg", { w: 100 }))}${fld("攻撃力% 合計", inp(m + ".atkPct", { w: 100 }))}
      </div><p class="muted">手元のロスレコの一覧は、旧ページで確認した3つ（水）・風の組のみです。光チームの値（例: 基礎HP 6,990、基礎攻撃力 8,565、光属性ダメージ 66%）は、ここに合計で入れてください。凸状況やコア効果は、まだ反映していません。</p></div>`;
  }
  function renderGimmick() {
    const en = G.enemyObj;
    const tr = S.DEFAULT_ENEMY_TRAITS[G.enemy] || [];
    return `<div class="wide"><h3>ギミック（敵・指名手配）</h3>
      ${fld("敵", inp("enemy", { sel: S.ENEMIES.map(e => [e.id, e.name]), str: true }))}
      <p class="note">弱点: ${en.weak.join("・")}（弱点補正 ×${en.weakMult}）／防御倍率 ${en.def}／印の別枠 ×${en.markX}／主力の最大HP +${pct(en.hpBonus)}</p>
      <p class="muted">${esc(en.note)}</p>
      ${tr.map(t => `<label class="check" style="font-weight:400"><input type="checkbox" data-p="traits.${t.id}" data-t="b"${G.traits[t.id] ? " checked" : ""}>${esc(t.name)}</label>`).join("")}
      <label class="check" style="font-weight:400"><input type="checkbox" data-p="glimmer" data-t="b"${G.glimmer !== false ? " checked" : ""}>敵に「残光」が付いている（光チームの素質の条件）</label>
      <label class="check" style="font-weight:400"><input type="checkbox" data-p="markDebuff" data-t="b"${G.markDebuff !== false ? " checked" : ""}>ティリアの印被ダメージ増加（眩い正義など）が敵に付いている</label>
      <label class="check" style="font-weight:400"><input type="checkbox" data-p="heartCrit" data-t="b"${G.heartCrit ? " checked" : ""}>セイナ(原点)の心相1「閃星」中（印の会心ダメージ +12%）</label></div>`;
  }
  function renderAdjust() {
    const en = G.enemyObj, ov = G.enemyOv;
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
    else if (a === "status") h = renderStatus(b);
    else if (a === "card") h = renderCard(b);
    else if (a === "emb") h = renderEmblem(b);
    else if (a === "pot") h = renderPot(b);
    else if (a === "add") h = renderAdd(b);
    else if (V.panel === "record") h = renderRecord();
    else if (V.panel === "notes") h = renderNotes();
    else if (V.panel === "lr") h = renderLr();
    else if (V.panel === "gimmick") h = renderGimmick();
    else if (V.panel === "adjust") h = renderAdjust();
    else h = renderOverview();
    $("display").innerHTML = (V.panel === "overview" ? "" : `<div style="margin-bottom:8px"><button class="btn-add" data-act="panel:overview">← 全体に戻る</button></div>`) + h;
  }

  // ---- 結果 ----
  function groupSummary(id, group, markOnly) {
    const o = R.team[id];
    if (!o) return null;
    const g = o.groups[group];
    const rows = g.rows.filter(r => markOnly ? r.type === "mark" : r.type !== "mark");
    if (!rows.length) return null;
    let mult = 0, exp = 0, non = 0, crit = 0, Bsum = 0, n = 0;
    rows.forEach(r => { mult += r.mult * r.count; exp += r.total; non += r.normal * r.count; crit += r.crit * r.count; Bsum += r.B; n++; });
    return { rows, mult, exp, non, crit, B: Bsum / n, id, group, markOnly };
  }
  function renderResult() {
    const main = G.team.main, s1 = G.team.s1, s2 = G.team.s2;
    const items = [
      ["mark", "印", groupSummary(main, "main", true) || groupSummary(main, "ult", true), main],
      ["basic", "通常攻撃（1ローテ）", groupSummary(main, "basic"), main],
      ["main", "主力スキル", groupSummary(main, "main"), main],
      ["sup1", "支援スキル（支援1）", groupSummary(s1, "support"), s1],
      ["sup2", "支援スキル（支援2）", groupSummary(s2, "support"), s2],
      ["ult", "必殺技", groupSummary(main, "ult"), main],
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
        cmp = `<div class="cmp ${d >= 0 ? "up" : "down"}">記憶 ${fmt(memo.v[key])} → ${d >= 0 ? "+" : ""}${(Math.round(d * 1000) / 10)}%</div>`;
      }
      return `<div class="res-row"><div class="tile"><span>${label}倍率（${nm}）</span><b>${fmt(sm.mult)}%</b><small>種別ダメージ ×${f3(sm.B)}</small></div>
        <div class="tile pink${V.drill === key ? " sel" : ""}" data-act="drill:${key}"><span>${label}ダメージ合計</span><b>${fmt(sm.exp)}</b><small>非会心 ${fmt(sm.non)} ／ 会心 ${fmt(sm.crit)}</small>${cmp}</div></div>`;
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
    $("drill").innerHTML = `<div class="tbl-wrap"><table><tr><th>ヒット</th><th>種別</th><th>倍率%</th><th>回数</th><th>非会心</th><th>会心</th><th>期待値</th><th>合計</th></tr>
      ${sm.rows.map(r => `<tr><td>${esc(r.name)}</td><td>${E.TYPE_NAME[r.type]}</td><td>${f3(r.mult)}</td><td>${r.count}</td><td>${fmt(r.normal)}</td><td>${fmt(r.crit)}</td><td>${fmt(r.avg)}</td><td>${fmt(r.total)}</td></tr>
      <tr><td colspan="8" class="muted" style="text-align:left">属性W ×${f3(r.W)}／種別B ×${f3(r.B)}／被ダメ ×${f3(r.taken)}／敵D ×${f3(r.D)}${r.markX !== 1 ? `／印の別枠 ×${r.markX}` : ""}／会心率 ${pct(r.rate)}</td></tr>`).join("")}
      <tr class="sum"><td>合計</td><td></td><td>${f3(sm.mult)}</td><td></td><td>${fmt(sm.non)}</td><td>${fmt(sm.crit)}</td><td></td><td>${fmt(sm.exp)}</td></tr></table></div>`;
  }

  function resolveEnemy() {
    // 上書きを反映するのはエンジン側（calcTeam）。
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
    // 手入力に切り替えたとき、画面の値が空なら現在の計算値で埋める
    if (/\.mode$/.test(p) && v === "manual") {
      const id = p.split(".")[1], st = R.team[id] && R.team[id].st, m = G.chars[id].manual;
      if (st && !m.atk) Object.assign(m, { atk: Math.round(st.atk), hp: Math.round(st.hp), critRate: Math.round(st.critRate * 1000) / 10, critDmg: Math.round(st.critDmg * 1000) / 10,
        elem: Math.round(st.elemAdd * 1000) / 10, basic: Math.round(st.basicAdd * 1000) / 10, skill: Math.round(st.skillAdd * 1000) / 10, ult: Math.round(st.ultAdd * 1000) / 10, mark: Math.round(st.markAdd * 1000) / 10, pen: st.pen });
    }
    renderAll();
  });
  document.addEventListener("click", ev => {
    const t = ev.target.closest("[data-act]");
    if (!t) return;
    const a = t.getAttribute("data-act");
    if (a.indexOf("panel:") === 0) { V.panel = a.slice(6); renderAll(); return; }
    if (a.indexOf("tf:") === 0) { V.tilesFor = a.slice(3); renderAll(); return; }
    if (a.indexOf("drill:") === 0) { const k = a.slice(6); V.drill = V.drill === k ? null : k; renderAll(); return; }
    let builds = {};
    try { builds = JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { builds = {}; }
    if (a === "bsave") { const n = $("bname").value.trim(); if (!n) return; builds[n] = clone(G); try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } renderTop(); }
    else if (a === "bload") { const n = $("bsel").value; if (n && builds[n]) { G = merge(defState(), clone(builds[n])); renderAll(); } }
    else if (a === "bdel") { const n = $("bsel").value; if (n && builds[n]) { delete builds[n]; try { localStorage.setItem(KEY_B, JSON.stringify(builds)); } catch (e) { /* 無視 */ } renderTop(); } }
    else if (a === "memo") { memo = { v: clone(window.__cur || {}) }; try { localStorage.setItem(KEY_M, JSON.stringify(memo)); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "memodel") { memo = null; try { localStorage.removeItem(KEY_M); } catch (e) { /* 無視 */ } renderAll(); }
    else if (a === "preset-hc") { G = presetHC(); renderAll(); }
    else if (a === "reset") { if (confirm("入力をすべて初期値に戻します。よいですか？")) { G = defState(); renderAll(); } }
  });
  renderAll();
})();

