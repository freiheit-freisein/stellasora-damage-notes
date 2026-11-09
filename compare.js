// ビルド比較のページ。左（ビフォア）は保存したビルドのまま、右（アフター）は保存したビルドを呼び出して、ここで変えられる。
// 流れ: 呼び出す → 右を変える → 比べる → 右を保存（計算ノートと同じ「このブラウザに保存したビルド」に入る）
// 巡遊者とロスレコ（どれを付けるか）は変えられない。突破・素質・徽章・心相・凸の効果・スキルLvなどは変えられる。
(function () {
  const S = window.SIM, E = S.engine, C = S.contrib;
  const $ = id => document.getElementById(id);
  const clone = o => JSON.parse(JSON.stringify(o));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = n => (n == null || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("ja-JP");
  const pct = n => (n == null || !isFinite(n)) ? "—" : (Math.round(n * 1000) / 10) + "%";
  let dmgUnit = "raw";
  try { dmgUnit = localStorage.getItem("stellasora-sim-unit") || "raw"; } catch (e) { /* 無視 */ }
  const dmgF = n => (n == null || !isFinite(n)) ? "—" : dmgUnit === "k" ? (n / 1e3).toLocaleString("ja-JP", { maximumFractionDigits: 0 }) + "K"
    : dmgUnit === "m" ? (n / 1e6).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "M" : fmt(n);
  const sgn = (v, d) => (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toFixed(d == null ? 1 : d);
  const KEY_B = "stellasora-sim-builds3", KEY_SEL = "stellasora-cmp-sel";
  const SLOTS = C.SLOTS, KIND_NAME = C.KIND_NAME, KIND_ORDER = ["triangle", "circle", "star"];
  const TK = en => TREKKERS.find(x => x.en === en);
  const chOf = id => S.CH.find(c => c.id === id);
  const JA = (en, id) => { const c = id && chOf(id); const m = (window.POTENTIAL_JA || {})[c ? c.en : ""] || {}; return m[en] || en; };
  const EL_COLOR = { 光: "#E8B10F", 水: "#2BA6DE", 火: "#E5533D", 風: "#3FA86A", 地: "#A0703C", 闇: "#6B4FA0" };
  const LRS = () => window.LOSTRECORDS || [];

  // ---- 保存したビルド ----
  const savedBuilds = () => { try { return JSON.parse(localStorage.getItem(KEY_B)) || {}; } catch (e) { return {}; } };
  const loadG = b => C.merge(C.defState(), clone(b));
  let A = null, B = null;   // { name, G }。B は src（呼び出したビルドの名前）と dirty（変えたか）も持つ
  const V = { onlyDiff: false, showAll: false, msg: null, ovSure: false, saveName: "" };
  let sel = { a: "", b: "" };
  try { sel = Object.assign(sel, JSON.parse(localStorage.getItem(KEY_SEL)) || {}); } catch (e) { /* 無視 */ }
  const saveSel = () => { try { localStorage.setItem(KEY_SEL, JSON.stringify(sel)); } catch (e) { /* 無視 */ } };

  // ---- 計算（入力が変わっていなければ前の結果を使う）----
  const cache = new Map();
  function calc(G) {
    const key = JSON.stringify(G);
    if (cache.has(key)) return cache.get(key);
    const R = E.calcTeam(clone(G)), parts = C.dmgParts(G);
    let contrib = [], err = "";
    try { contrib = C.calcContrib(clone(G)); } catch (e) { err = e.message || String(e); }
    const out = { R, parts, total: C.sum3(parts), contrib, err };
    if (cache.size > 40) cache.clear();
    cache.set(key, out);
    return out;
  }

  // 3人とも同じか（主力は同じ人、支援は2人の組み合わせが同じ）
  function sameTeam(a, b) {
    const s = g => [g.team.s1, g.team.s2].sort().join(",");
    return a.team.main === b.team.main && s(a) === s(b);
  }
  const teamTxt = g => SLOTS.map(([k]) => (chOf(g.team[k]) || {}).jp || g.team[k]).join("・");

  // ---- 入力欄（右だけ）。data-p は B.G の中のパス ----
  const getP = (g, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), g);
  function setP(g, path, val) {
    const ks = path.split(".");
    let o = g;
    for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null || typeof o[ks[i]] !== "object") o[ks[i]] = {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = val;
  }
  const num = (path, v, o) => { o = o || {}; return `<input type="number" data-p="${path}" data-t="${o.t || "n"}" step="${o.step || 1}"${o.min != null ? ` min="${o.min}"` : ""}${o.max != null ? ` max="${o.max}"` : ""} value="${v == null ? "" : v}"${o.ph != null ? ` placeholder="${esc(o.ph)}"` : ""}>`; };
  const selIn = (path, opts, cur, t) => `<select data-p="${path}" data-t="${t || "n"}">${opts.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(cur) ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  const chk = (path, on, t, label) => `<label class="ck"><input type="checkbox" data-p="${path}" data-t="${t || "b"}"${on ? " checked" : ""}>${label || ""}</label>`;

  // ---- 行 ----
  // 1行 = { label, a, b, ed }。a・b は表示の文字（違えば色を付ける）、ed は右の入力欄（無ければ b をそのまま出す）
  const row = (label, a, b, ed, o) => Object.assign({ label, a: a == null ? "—" : String(a), b: b == null ? "—" : String(b), ed }, o || {});
  const unionKeys = (fa, fb) => { const out = []; [fa, fb].forEach(list => list.forEach(k => { if (out.indexOf(k) < 0) out.push(k); })); return out; };

  function commonRows(ga, gb) {
    const rows = [], en = g => (S.ENEMIES.find(e => e.id === g.enemy) || {}).name || g.enemy;
    rows.push(row("敵", en(ga), en(gb), selIn("enemy", S.ENEMIES.map(e => [e.id, e.name]), gb.enemy, "s")));
    rows.push(row("記録Lv", ga.recordLv, gb.recordLv, num("recordLv", gb.recordLv, { min: 0 })));
    rows.push({ head: "音符" });
    const ta = S.notesTotal(ga), tb = S.notesTotal(gb);
    S.NOTE_ALL.forEach(n => {
      const a = +((ga.notes || {})[n] || 0), b = +((gb.notes || {})[n] || 0);
      if (!V.showAll && !a && !b && !ta[n] && !tb[n]) return;
      const ex = (t, own) => t !== own ? `（サブの初期込み ${t}）` : "";
      rows.push(row(n.replace("の音符", ""), a + ex(ta[n] || 0, a), b + ex(tb[n] || 0, b), num(`notes.${n}`, b, { min: 0, max: 99 }) + `<span class="muted">${ex(tb[n] || 0, b)}</span>`));
    });
    rows.push({ head: "ロスレコ（付け替えはできません。突破は変えられます）" });
    const lrName = id => { const r = id && LRS().find(x => x.id === id); return r ? r.name : "（なし）"; };
    const rankTxt = (g, arr, id) => {
      const r = id && LRS().find(x => x.id === id);
      if (!r) return { t: "—", can: false };
      const can = (arr === "lrMain" && S.lrRankOf(g, id).can) || S.lrAtkScalable(r);
      return { t: can ? "突破" + S.lrRoman(S.lrRankNow(g, id)) : "突破は固定", can };   // 計算ノートの突破の欄と同じ値
    };
    [["lrMain", "メイン"], ["lrSub", "サブ"]].forEach(([arr, lab]) => [0, 1, 2].forEach(i => {
      const ia = (ga[arr] || [])[i] || "", ib = (gb[arr] || [])[i] || "";
      const ra = rankTxt(ga, arr, ia), rb = rankTxt(gb, arr, ib);
      const now = ib ? S.lrRankNow(gb, ib) : 1;
      const ed = rb.can ? `${esc(lrName(ib))} ${selIn(`lrRank.${ib}`, [1, 2, 3, 4, 5, 6].map(n => [n, "突破" + S.lrRoman(n)]), now)}` : null;
      rows.push(row(`${lab}${i + 1}`, `${lrName(ia)}${ia ? "　" + ra.t : ""}`, `${lrName(ib)}${ib ? "　" + rb.t : ""}`, ed));
    }));
    // アシスト効果（音符で決まる。ここでは変えられない）
    const asg = g => { const m = {}; (g.lrMain || []).filter(Boolean).forEach(rid => { const fx = S.LR_FX[rid], r = LRS().find(x => x.id === rid); if (!fx || !r) return; fx.assists.forEach(a => { m[rid + ":" + a.id] = { label: `${r.name}：${a.name}`, lv: S.lrAssistLv(S.notesTotal(g), a) }; }); }); return m; };
    const aa = asg(ga), ab = asg(gb);
    unionKeys(Object.keys(aa), Object.keys(ab)).forEach(k => {
      const x = aa[k] || ab[k], lv = m => m[k] ? (m[k].lv ? "Lv" + m[k].lv : "未発動") : "—";
      rows.push(row(x.label, lv(aa), lv(ab), null, { note: "音符で決まります" }));
    });
    return rows;
  }

  // 1人分の行
  function charRows(id, slotA, slotB, ga, gb, ca, cb) {
    const c = chOf(id), csA = ga.chars[id], csB = gb.chars[id], p = `chars.${id}`, rows = [];
    const exA = S.emblemExtra(csA.emb, csA.embOn), exB = S.emblemExtra(csB.emb, csB.embOn);
    // スキルLv
    rows.push({ head: "スキルLv" });
    [["basic", "通常攻撃"], ["main", "主力スキル"], ["support", "支援スキル"], ["ult", "必殺技"]].forEach(([k, l]) => {
      const t = (cs, ex) => { const v = (cs.skillLv || {})[k] || 10, b = ex.lv[k] || 0; return b ? `${v}（徽章+${b} → ${v + b}）` : String(v); };
      const vb = (csB.skillLv || {})[k] || 10, bb = exB.lv[k] || 0;
      rows.push(row(l, t(csA, exA), t(csB, exB), num(`${p}.skillLv.${k}`, vb, { min: 1, max: 13 }) + (bb ? `<span class="muted">徽章+${bb} → ${vb + bb}</span>` : "")));
    });
    rows.push(row("信頼ボーナス", csA.trustLv || 0, csB.trustLv || 0, num(`${p}.trustLv`, csB.trustLv || 0, { min: 0, max: 99 })));
    // 心相（段階）と凸の効果
    rows.push({ head: "心相・凸の効果" });
    const rar = (TK(c.en) || {}).rarity || 5, step = rar >= 5 ? 10 : 5;
    const tal = v => `${(+v || 0) / 10}凸`;
    rows.push(row("心相", tal(csA.talent), tal(csB.talent), selIn(`${p}.talent`, Array.from({ length: 50 / step + 1 }, (_, i) => [i * step, tal(i * step)]), +csB.talent || 0)));
    ((S.HEART_SPEC || {})[id] || []).forEach(h => {
      const key = "heart" + h.n;
      const st = cs => { const un = (cs.talent || 0) >= h.n * 10, v = (cs.pon || {})[key], on = v == null ? !h.off : v; return { un, on, t: un ? (on ? "反映" : "反映しない") : "未解放" }; };
      const a = st(csA), b = st(csB);
      rows.push(row(`${h.n}凸 ${h.name}`, a.t, b.t, b.un ? chk(`${p}.pon.${key}`, b.on, "b", "反映") : null, { title: h.txt }));
    });
    // 徽章（初級・中級・上級、4枠ずつ）
    rows.push({ head: "徽章" });
    const order = cs => cs.emb.map((e, i) => i).sort((x, y) => KIND_ORDER.indexOf(cs.emb[x].kind) - KIND_ORDER.indexOf(cs.emb[y].kind));
    order(csB).forEach(i => {
      const eB = csB.emb[i], iA = csA.emb.findIndex(e => e.kind === eB.kind), eA = csA.emb[iA] || { slots: [] };
      const kn = KIND_NAME[eB.kind] || eB.name || "";
      const onT = (cs, j) => cs.embOn[j] ? "反映" : "外す";
      rows.push(row(`${kn}徽章`, iA >= 0 ? onT(csA, iA) : "—", onT(csB, i), chk(`${p}.embOn.${i}`, !!csB.embOn[i], "b01", "反映")));
      eB.slots.forEach((sl, j) => {
        const slA = eA.slots[j] || {}, txt = (cid, s, on) => s && s.k ? C.embShort(cid, s) + (on ? "" : "（外している）") : "（なし）";
        const a = txt(id, slA, iA >= 0 && csA.embOn[iA]), b = txt(id, sl, csB.embOn[i]);
        if (!V.showAll && !slA.k && !sl.k) return;
        rows.push(row(`${kn} 枠${j + 1}`, a, b, embEditor(id, gb, i, j, eB.kind, sl)));
      });
    });
    // 素質
    rows.push({ head: "素質" });
    const tk = TK(c.en), roleOf = slot => slot === "main" ? "main" : "support";
    const plist = role => { const out = []; ((tk && tk.potentials[role]) || []).forEach(g => g.potentials.forEach(x => out.push({ en: x.name, key: S.potKey(x.name), core: x.type === 1, grp: /Generic/i.test(g.title) ? "汎用" : "特化" + ((/Build (\d)/i.exec(g.title) || [])[1] || "") }))); return out; };
    const la = plist(roleOf(slotA)), lb = plist(roleOf(slotB));
    const all = la.concat(lb.filter(x => !la.some(y => y.key === x.key)));
    let coreB = 0;
    all.forEach(x => {
      const lvA = +((csA.pots2 || {})[x.key] || 0), lvB = +((csB.pots2 || {})[x.key] || 0);
      if (x.core && lvB > 0) coreB++;
      if (!V.showAll && !lvA && !lvB) return;
      const t = (lv, ex) => x.core ? (lv > 0 ? "取得" : "—") : (lv > 0 ? `Lv${lv}` + (ex.pot[x.en] ? `（徽章+${ex.pot[x.en]} → ${lv + ex.pot[x.en]}）` : "") : "—");
      const opts = x.core ? [[0, "—"], [1, "取得"]] : Array.from({ length: Math.max(6, lvB) + 1 }, (_, n) => [n, n ? "Lv" + n : "—"]);
      const bb = exB.pot[x.en] || 0;
      rows.push(row(`${x.core ? "◆" : ""}${JA(x.en, id)}`, t(lvA, exA), t(lvB, exB), selIn(`${p}.pots2.${x.key}`, opts, lvB) + (!x.core && bb && lvB ? `<span class="muted">徽章+${bb} → ${lvB + bb}</span>` : ""),
        { title: `${x.grp}${x.core ? "・コア" : ""}` }));
    });
    if (coreB > 2) rows.push(row("コア素質の数", "", `${coreB}（ゲームでは2つまで）`, null, { warn: true }));
    // 前の形の入力（pots・sup）。ここでは変えられない
    const old = (cs, f) => Object.keys(cs[f] || {}).filter(k => f === "sup" ? cs.sup[k] && +cs.sup[k].lv > 0 : +cs.pots[k] > 0);
    unionKeys(old(csA, "pots"), old(csB, "pots")).forEach(k => rows.push(row(((window.POTENTIALS || []).find(q => q.id === k) || {}).jp || k, (csA.pots || {})[k] || "—", (csB.pots || {})[k] || "—", null, { note: "前の形の入力" })));
    unionKeys(old(csA, "sup"), old(csB, "sup")).forEach(k => rows.push(row((((window.SUP_POTS || {})[id] || []).find(x => x.id === k) || {}).jp || k, ((csA.sup || {})[k] || {}).lv || "—", ((csB.sup || {})[k] || {}).lv || "—", null, { note: "前の形の入力" })));
    // その他（加算）
    const ADD = [["atkFlat", "基礎攻撃力 加算", 0], ["hpFlat", "基礎HP 加算", 0], ["atkPct", "攻撃力% 加算", 1], ["hpPct", "最大HP% 加算", 1], ["elem", c.el + "属性ダメージ 加算", 1], ["basic", "通常攻撃ダメージ 加算", 1],
      ["skill", "スキルダメージ 加算", 1], ["ult", "必殺技ダメージ 加算", 1], ["mark", "印ダメージ 加算", 1], ["critRate", "会心率 加算", 1], ["critDmg", "会心ダメージ 加算", 1], ["pen", "貫通 加算", 0]];
    const addRows = [];
    ADD.forEach(([k, l, isPct]) => {
      const a = +((csA.add || {})[k] || 0), b = +((csB.add || {})[k] || 0);
      if (!V.showAll && !a && !b) return;
      const t = v => isPct ? pct(v) : fmt(v);
      addRows.push(row(l, t(a), t(b), isPct ? num(`${p}.add.${k}`, Math.round(b * 1e6) / 1e4, { t: "pct", step: "any" }) + '<span class="muted">%</span>' : num(`${p}.add.${k}`, b, { step: "any" })));
    });
    if (addRows.length) { rows.push({ head: "その他（加算）" }); rows.push(...addRows); }
    // 3分間の回数（寄与率と3分間のダメージに使う）
    rows.push({ head: "3分間の回数（目安）" });
    const rd = C.rotDefault(id), ks = slotB === "main" ? [["basic", "通常1ローテ"], ["main", "主力スキル"], ["ult", "必殺技"]] : [["support", "支援スキル"], ["ult", "必殺技"]];
    ks.forEach(([k, l]) => {
      const v = ((gb.rot || {})[id] || {})[k];
      rows.push(row(l, C.rotCount(ga, id, k), C.rotCount(gb, id, k), num(`rot.${id}.${k}`, v == null || v === "" ? "" : v, { min: 0, max: 999, ph: rd[k] || 0 }) + '<span class="muted">回（空欄は目安）</span>'));
    });
    // 戦闘中のステータス（計算の結果。直接は変えられない）
    rows.push({ head: "戦闘中のステータス（計算の結果）" });
    const va = E.battleView(ca.R.team[id], ca.R.G), vb = E.battleView(cb.R.team[id], cb.R.G);
    [["HP", v => fmt(v.hp)], ["攻撃力", v => fmt(v.atk)], ["会心率", v => pct(v.critRate.common)], ["会心ダメージ", v => pct(v.critDmg.common)], [c.el + "属性ダメージ", v => pct(v.elem)],
      ["通常攻撃ダメージ", v => pct(v.basic)], ["スキルダメージ", v => pct(v.skill)], ["必殺技ダメージ", v => pct(v.ult)], ["印ダメージ", v => pct(v.mark)], ["属性耐性貫通", v => fmt(v.pen)]]
      .forEach(([l, f]) => rows.push(row(l, f(va), f(vb), null, { calc: true })));
    // ダメージ（1回あたり・3分間）
    rows.push({ head: "ダメージ（会心の期待値）" });
    const GN = { basic: "通常1ローテ", main: "主力スキル", support: "支援スキル", ult: "必殺技" };
    (slotB === "main" ? ["basic", "main", "ult"] : ["support", "ult"]).forEach(g => {
      const a = ca.R.team[id].groups[g].totExp, b = cb.R.team[id].groups[g].totExp;
      rows.push(row(GN[g] + "（1回）", dmgF(a), dmgF(b), null, { calc: true, dv: [a, b] }));
    });
    const pa = ca.parts[slotA], pb = cb.parts[slotB];
    rows.push(row("3分間の合計", dmgF(pa), dmgF(pb), null, { calc: true, dv: [pa, pb], strong: true }));
    return rows;
  }

  // 徽章の1枠の入力（項目 → 値 → 対象の素質）
  function embEditor(id, gb, i, j, kind, sl) {
    const sp = `chars.${id}.emb.${i}.slots.${j}`;
    const groups = C.EMB_CATS.map(([cat, keys]) => `<optgroup label="${esc(cat)}">${keys.map(C.optOf).filter(o => o && (!o.only || o.only === kind)).map(o => `<option value="${o.key}"${o.key === sl.k ? " selected" : ""}>${esc(o.label)}</option>`).join("")}</optgroup>`).join("");
    let h = `<select data-p="${sp}.k" data-t="embk"><option value="">（なし）</option>${groups}</select>`;
    const o = sl.k ? C.optOf(sl.k) : null;
    if (o) {
      const q = (C.isLv(o) && sl.q === "rainbow") ? "rainbow3" : sl.q;
      h += selIn(`${sp}.q`, C.qualOf(o).map(([qq, ql]) => [qq, `${ql} ${C.valTxt(o, C.qVal(o, qq))}`]), q, "s");
      if (o.type === "potLv") h += `<select data-p="${sp}.t" data-t="s"><option value="">（対象の素質）</option>${C.potTargets(gb, id, sl.k).map(x => `<option value="${esc(x.en)}"${x.en === sl.t ? " selected" : ""}>${esc(JA(x.en, id))}</option>`).join("")}</select>`;
    }
    return h;
  }

  // ---- 寄与率の差 ----
  function contribDiff(ca, cb) {
    const ma = new Map(ca.contrib.map(x => [x.uid, x])), mb = new Map(cb.contrib.map(x => [x.uid, x]));
    const ids = unionKeys([...ma.keys()], [...mb.keys()]);
    return ids.map(u => {
      const a = ma.get(u), b = mb.get(u), x = b || a;
      const va = a ? a.team : 0, vb = b ? b.team : 0, one = y => y.label.replace("\n", " ");
      // 同じ徽章の枠で中身が違うときは「左 → 右」
      const label = a && b && one(a) !== one(b) ? `${one(a)} → ${one(b).replace(/^.*?：/, "")}` : one(x);
      return { uid: u, kind: x.kind, label, la: a ? a.label.replace("\n", " ") : "", lb: b ? b.label.replace("\n", " ") : "", a, b, d: vb - va };
    }).sort((p, q) => Math.abs(q.d) - Math.abs(p.d));
  }
  const cmpTxt = x => { if (!x || !x.cmp) return "外す"; const d = x.cmp, sh = v => d.unit === "突破" ? "突破" + S.lrRoman(v) : d.unit + v; return `${sh(d.cur)}→${sh(d.t)}`; };
  const rateTxt = x => x ? (x.team > 0.0005 ? "−" : x.team < -0.0005 ? "+" : "") + (Math.abs(Math.round(x.team * 1000) / 10)).toFixed(1) + "%" : "—";

  // ---- 描画 ----
  function renderCtl() {
    const names = Object.keys(savedBuilds());
    const opts = (cur, first) => `<option value="">${first}</option>` + names.map(n => `<option${n === cur ? " selected" : ""}>${esc(n)}</option>`).join("");
    $("ctl").innerHTML = names.length ? `
      <div class="pick"><span class="side side-a">ビフォア（左）</span><select id="selA">${opts(sel.a, "（保存したビルドを選ぶ）")}</select><button class="btn-add" data-act="loadA">呼び出す</button></div>
      <div class="pick"><span class="side side-b">アフター（右）</span><select id="selB">${opts(sel.b, "（左と同じビルドから始める）")}</select><button class="btn-add" data-act="loadB">呼び出す</button></div>
      <div class="pick"><span class="side">右を保存</span><input type="text" id="saveName" value="${esc(V.saveName)}" placeholder="名前"><button class="btn-add pri" data-act="save"${B ? "" : " disabled"}>${V.ovSure ? "もう一度押して上書き" : "保存"}</button></div>
      <div class="pick opts"><label class="ck"><input type="checkbox" data-act="onlyDiff"${V.onlyDiff ? " checked" : ""}>違う行だけ表示</label><label class="ck"><input type="checkbox" data-act="showAll"${V.showAll ? " checked" : ""}>入っていない項目も表示</label>
        <span class="unitbar" role="group" aria-label="ダメージの表記">${[["raw", "そのまま"], ["k", "K表記"], ["m", "M表記"]].map(([v, l]) => `<button type="button" class="${dmgUnit === v ? "on" : ""}" aria-pressed="${dmgUnit === v}" data-act="unit:${v}">${l}</button>`).join("")}</span></div>
      ${V.msg ? `<div class="msg${V.msg.ng ? " ng" : " ok"}">${esc(V.msg.t)}</div>` : ""}`
      : `<p class="muted">このブラウザに保存したビルドがありません。<a href="sim.html">計算ノート</a>の「⑥ 共有・保存」で保存してから、ここで比べてください。</p>`;
  }

  function render() {
    renderDo();
    // 表の見出しを、固定の帯のすぐ下に止める
    document.documentElement.style.setProperty("--band-h", $("band").offsetHeight + "px");
  }
  function renderDo() {
    renderCtl();
    if (!A || !B) {
      $("band").innerHTML = `<div class="band-in"><span class="muted">左右のビルドを呼び出すと、ここに与ダメの差が出ます。</span></div>`;
      $("rows").innerHTML = `<div class="panel"><p class="muted">「ビフォア（左）」で保存したビルドを選んで「呼び出す」を押してください。右は、左と同じビルドから始めるか、別の保存したビルドを選べます。右だけ、ここで変えられます。</p></div>`;
      return;
    }
    if (!sameTeam(A.G, B.G)) {
      $("band").innerHTML = `<div class="band-in"><b class="ng">巡遊者が違うので比べられません</b></div>`;
      $("rows").innerHTML = `<div class="panel"><p>左: ${esc(teamTxt(A.G))}<br>右: ${esc(teamTxt(B.G))}</p><p class="muted">3人とも同じ巡遊者のビルドどうしで比べられます（支援1と支援2は入れ替わっていても構いません）。</p></div>`;
      return;
    }
    const ca = calc(A.G), cb = calc(B.G);
    // 固定の帯: 3分間の与ダメ・差・巡遊者ごと・寄与率の差の大きいもの
    const d = ca.total > 0 ? cb.total / ca.total - 1 : 0;
    const per = SLOTS.map(([k, l]) => {
      const id = A.G.team[k], kb = SLOTS.find(([kk]) => B.G.team[kk] === id)[0], a = ca.parts[k], b = cb.parts[kb], r = a > 0 ? b / a - 1 : 0;
      return `<div class="pm"><span>${l} ${esc(chOf(id).jp)}</span><b>${dmgF(a)} → ${dmgF(b)}</b><em class="${r > 1e-6 ? "up" : r < -1e-6 ? "down" : ""}">${sgn(r * 100)}%</em></div>`;
    }).join("");
    const cd = contribDiff(ca, cb).filter(x => Math.abs(x.d) > 0.0005).slice(0, 5);
    $("band").innerHTML = `<div class="band-in">
      <div class="tot"><span class="nm side-a" title="${esc(A.name)}">${esc(A.name)}</span><b>${dmgF(ca.total)}</b></div>
      <div class="arrow">→</div>
      <div class="tot"><span class="nm side-b" title="${esc(B.src)}">${esc(B.src)}${B.dirty ? "（変更あり）" : ""}</span><b>${dmgF(cb.total)}</b></div>
      <div class="dd ${d > 1e-6 ? "up" : d < -1e-6 ? "down" : ""}"><span>3分間の与ダメの差</span><b>${sgn(d * 100, 2)}%</b><small>${(cb.total - ca.total >= 0 ? "+" : "−") + dmgF(Math.abs(cb.total - ca.total))}</small></div>
      <div class="pms">${per}</div>
      <div class="cds"><span class="cds-h">寄与率の差（大きい順）</span>${cd.length ? cd.map(x => `<div class="cd"><span title="${esc(x.label)}">${esc(x.label)}</span><b>${rateTxt(x.a)} → ${rateTxt(x.b)}</b><em>${sgn(x.d * 100)}pt</em></div>`).join("") : '<span class="muted">差はありません</span>'}</div>
    </div>`;
    // 行
    const secs = [{ title: "共通（記録・音符・ロスレコ・敵）", rows: commonRows(A.G, B.G) }];
    SLOTS.forEach(([k, l]) => {
      const id = A.G.team[k], kb = SLOTS.find(([kk]) => B.G.team[kk] === id)[0], c = chOf(id);
      secs.push({ title: `${l}：${c.jp}${kb !== k ? `（右では${SLOTS.find(s => s[0] === kb)[1]}）` : ""}`, color: EL_COLOR[c.el], rows: charRows(id, k, kb, A.G, B.G, ca, cb) });
    });
    const trs = rows => {
      let out = "", head = null;
      rows.forEach(r => {
        if (r.head) { head = r.head; return; }
        const df = r.a !== r.b;
        if (V.onlyDiff && !df) return;
        if (head) { out += `<tr class="sub"><th colspan="3">${esc(head)}</th></tr>`; head = null; }
        let cls = (df ? "df" : "") + (r.calc ? " calc" : "") + (r.strong ? " strong" : "") + (r.warn ? " warn" : "");
        let bHtml = r.ed || esc(r.b);
        if (r.dv && r.dv[0] > 0) { const x = r.dv[1] / r.dv[0] - 1; if (Math.abs(x) > 1e-6) bHtml += ` <em class="${x > 0 ? "up" : "down"}">${sgn(x * 100)}%</em>`; }
        out += `<tr class="${cls.trim()}"><td class="lb"${r.title ? ` title="${esc(r.title)}"` : ""}>${esc(r.label)}${r.note ? `<span class="muted">（${esc(r.note)}）</span>` : ""}</td><td class="va">${esc(r.a)}</td><td class="vb">${bHtml}</td></tr>`;
      });
      return out;
    };
    const body = secs.map(s => `<tr class="sec"${s.color ? ` style="--elc:${s.color}"` : ""}><th colspan="3">${esc(s.title)}</th></tr>${trs(s.rows)}`).join("");
    // 寄与率の表（全部）
    const all = contribDiff(ca, cb);
    const ctab = all.filter(x => !V.onlyDiff || Math.abs(x.d) > 0.0005).map(x => `<tr class="${Math.abs(x.d) > 0.0005 ? "df" : ""}"><td class="lb">${esc(x.kind)}：${esc(x.label)}</td><td class="va">${x.a ? `${rateTxt(x.a)}<span class="muted">（${esc(cmpTxt(x.a))}）</span>` : "—"}</td><td class="vb">${x.b ? `${rateTxt(x.b)}<span class="muted">（${esc(cmpTxt(x.b))}）</span>` : "—"}</td><td class="vd">${sgn(x.d * 100)}pt</td></tr>`).join("");
    $("rows").innerHTML = `<div class="panel"><table class="cmp"><colgroup><col class="c1"><col><col></colgroup>
        <thead><tr><th>項目</th><th class="side-a">ビフォア：${esc(A.name)}</th><th class="side-b">アフター：${esc(B.src)}${B.dirty ? "（変更あり）" : ""}</th></tr></thead><tbody>${body}</tbody></table></div>
      <div class="panel"><h2>与ダメへの寄与率（1つ下げると、3分間のダメージが何%変わるか）</h2>
        <p class="muted">計算ノートの「⑤ ビルド確認」と同じ値です。素質は1つ下のLv、ロスレコのコア効果は1つ下の突破、アシスト効果は1つ下のLv、徽章は1枠を外したときです。差は「右 − 左」（ポイント）です。${ca.err || cb.err ? `<br><b class="ng">計算できなかった項目があります（${esc(ca.err || cb.err)}）</b>` : ""}</p>
        <table class="cmp ctab"><colgroup><col class="c1"><col><col><col class="c4"></colgroup><thead><tr><th>項目</th><th class="side-a">ビフォア</th><th class="side-b">アフター</th><th>差</th></tr></thead><tbody>${ctab || '<tr><td colspan="4" class="muted">項目がありません</td></tr>'}</tbody></table></div>`;
  }

  // ---- 操作 ----
  const say = (t, ng) => { V.msg = { t, ng }; };
  function loadA() {
    const n = $("selA").value, bs = savedBuilds();
    if (!n || !bs[n]) { say("左に呼び出すビルドを選んでください", true); return render(); }
    A = { name: n, G: loadG(bs[n]) }; sel.a = n;
    if (!B) { B = { src: n, G: loadG(bs[n]), dirty: false }; V.saveName = n; }
    saveSel(); say(`左に「${n}」を呼び出しました`); render();
  }
  function loadB() {
    const n = $("selB").value || (A && A.name), bs = savedBuilds();
    if (!n || !bs[n]) { say("先に左のビルドを呼び出してください", true); return render(); }
    if (B && B.dirty && V.bSure !== n) { V.bSure = n; say("右の変更は、保存していないと消えます。もう一度「呼び出す」を押すと呼び出します", true); return render(); }
    V.bSure = null; B = { src: n, G: loadG(bs[n]), dirty: false }; V.saveName = n; V.ovSure = false; sel.b = $("selB").value;
    saveSel(); say(`右に「${n}」を呼び出しました`); render();
  }
  function save() {
    const n = ($("saveName").value || "").trim();
    V.saveName = n;
    if (!B) return;
    if (!n) { say("名前を入れてください", true); return render(); }
    const bs = savedBuilds();
    if (bs[n] && !V.ovSure) { V.ovSure = true; say(`「${n}」はもうあります。もう一度押すと上書きします`, true); return render(); }
    bs[n] = clone(B.G);
    try { localStorage.setItem(KEY_B, JSON.stringify(bs)); } catch (e) { say("保存できませんでした", true); return render(); }
    V.ovSure = false; B.src = n; B.dirty = false; sel.b = n; saveSel();
    if (A && A.name === n) A = { name: n, G: loadG(bs[n]) };
    say(`「${n}」を保存しました（計算ノートの「① 読込」からも読み込めます）`); render();
  }

  document.addEventListener("click", ev => {
    const t = ev.target.closest("[data-act]"); if (!t) return;
    const a = t.getAttribute("data-act");
    if (a === "loadA") loadA();
    else if (a === "loadB") loadB();
    else if (a === "save") save();
    else if (a.indexOf("unit:") === 0) { dmgUnit = a.slice(5); try { localStorage.setItem("stellasora-sim-unit", dmgUnit); } catch (e) { /* 無視 */ } render(); }
  });
  document.addEventListener("change", ev => {
    const t = ev.target;
    const a = t.getAttribute("data-act");
    if (a === "onlyDiff") { V.onlyDiff = t.checked; return render(); }
    if (a === "showAll") { V.showAll = t.checked; return render(); }
    if (t.id === "saveName") { V.saveName = t.value; V.ovSure = false; return; }
    const path = t.getAttribute("data-p"), ty = t.getAttribute("data-t");
    if (!path || !B) return;
    let v;
    if (ty === "b") v = t.checked;
    else if (ty === "b01") v = t.checked ? 1 : 0;
    else if (ty === "s" || ty === "embk") v = t.value;
    else if (ty === "pct") v = t.value === "" ? 0 : +t.value / 100;
    else v = t.value === "" ? (path.indexOf("rot.") === 0 ? "" : 0) : +t.value;
    if (ty === "n" && t.value !== "" && !isFinite(v)) return;
    if (ty === "n" && t.min !== "" && v !== "" && v < +t.min) v = +t.min;
    if (ty === "n" && t.max !== "" && v !== "" && v > +t.max) v = +t.max;
    setP(B.G, path, v);
    if (ty === "embk") {   // 項目を変えたら、区分と値をそろえる（値は、その項目にある品質に）
      const sp = path.slice(0, -2), sl = getP(B.G, sp), o = v ? C.optOf(v) : null;
      sl.cat = v ? C.catOfKey(v) : "";
      if (o) { const qs = C.qualOf(o).map(x => x[0]); if (qs.indexOf(sl.q) < 0 && !(C.isLv(o) && sl.q === "rainbow")) sl.q = qs[qs.length - 1]; }
      if (!o || o.type !== "potLv") delete sl.t;
    }
    B.dirty = true; V.msg = null; V.ovSure = false;
    const y = window.scrollY; render(); window.scrollTo(0, y);
  });
  document.addEventListener("keydown", ev => { if (ev.target.id === "saveName" && ev.key === "Enter") { V.saveName = ev.target.value; save(); } });

  // 前に選んだビルドを呼び出しておく（右は呼び出し直す。保存していない変更は残らない）
  (function init() {
    const bs = savedBuilds();
    if (sel.a && bs[sel.a]) {
      A = { name: sel.a, G: loadG(bs[sel.a]) };
      const nb = sel.b && bs[sel.b] ? sel.b : sel.a;
      B = { src: nb, G: loadG(bs[nb]), dirty: false }; V.saveName = nb;
    }
    render();
  })();
})();
