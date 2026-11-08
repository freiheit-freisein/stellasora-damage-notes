// 確認ページ（Edit）の「スキルの確認」と「信頼ボーナスの確認」。
// スキル: 登録（英語Wikiの Lv1〜10）／控え（手元だけ・Lv1〜13）／報告／ゲーム を並べ、そろったら確定する（edit_cmp.js）。
//   確定のきまり（2026-11-08 ユーザー）: Lv1とLv10＋Lv2〜9のどれか1つ、Lv11〜13は2つ
// 信頼ボーナス: 控えに無いので、登録（英語Wiki）と報告・ゲームだけ。ゲーム（無ければ報告）の数字を確定する。
// 結果はブラウザに保存し（stellasora-sk-check-v1 / stellasora-tr-check-v1）、「確認の結果を書き出す」で一緒に書き出す。
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TJ = en => (window.TREKKER_JA || {})[en] || en;
  const EL = { Aqua: "水", Ignis: "火", Ventus: "風", Terra: "地", Lux: "光", Umbra: "闇" };
  const SKS = [["basic", "通常攻撃", 0], ["main", "主力スキル", 1], ["support", "支援スキル", 2], ["ult", "必殺技", 3]];
  const SK_GROUPS = [{ lvs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ends: [1, 10], mid: 1 }, { lvs: [11, 12, 13], ends: [], mid: 2 }];
  const LV13 = Array.from({ length: 13 }, (_, i) => i + 1);
  const KEYS = { sk: "stellasora-sk-check-v1", tr: "stellasora-tr-check-v1" };
  const store = {};
  Object.keys(KEYS).forEach(m => { try { store[m] = JSON.parse(localStorage.getItem(KEYS[m])) || {}; } catch (e) { store[m] = {}; } });
  const save = m => { try { localStorage.setItem(KEYS[m], JSON.stringify(store[m])); } catch (e) { /* 無視 */ } };
  const V = { mode: "sk", t: null, el: "" };
  try { Object.assign(V, JSON.parse(localStorage.getItem("stellasora-edit-sk")) || {}); } catch (e) { /* 無視 */ }
  const saveSel = () => { try { localStorage.setItem("stellasora-edit-sk", JSON.stringify({ t: V.t, el: V.el })); } catch (e) { /* 無視 */ } };
  const buf = {};
  let ROWS = [];
  const list = () => (window.TREKKERS || []).filter(t => t.stats && (!V.el || EL[t.element] === V.el)).slice().sort((a, b) => (b.rarity - a.rarity) || a.en.localeCompare(b.en));
  const ent = () => (store[V.mode][V.t] = store[V.mode][V.t] || {});
  const val = (kd, k) => { const kk = (kd === "r" ? "r:" : "") + k; if (buf[kk] != null) return buf[kk]; const c = store[V.mode][V.t] || {}; return ((kd === "r" ? c.r : c.g) || {})[k]; };

  function bar() {
    const st = store[V.mode], n = list().length, d = Object.keys(st).filter(k => st[k].fix).length;
    return `${CMP.modeBar(V.mode)}<b style="margin-left:8px">属性:</b>${["", "水", "火", "風", "地", "光", "闇"].map(e => `<button class="sbtn${V.el === e ? " on" : ""}" data-act="skel:${e}">${e || "全部"}</button>`).join("")}
      <span class="muted">確定した巡遊者 ${d} ／ ${n} 人</span>`;
  }
  function left() {
    const st = store[V.mode];
    const card = t => { const c = st[t.en]; const tag = c && c.fix ? '<span class="tag ck-ok">確定あり</span>' : c && (c.g || c.r) ? '<span class="tag ck-unk">入力あり</span>' : '<span class="tag t-none">未確認</span>'; return `<div class="pc${V.t === t.en ? " sel" : ""}" data-act="skpick:${esc(t.en)}"><b>${esc(TJ(t.en))}</b>${tag}<span class="en">★${t.rarity} ${esc(EL[t.element] || "")}　${esc(t.en)}</span></div>`; };
    return `<div class="pgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${list().map(card).join("")}</div>`;
  }

  // ---- スキル ----
  function skillHtml(t) {
    const rf = (window.REF_LOCAL_SK || {})[t.en] || null;
    const fx = (store.sk[t.en] || {}).fix || {};
    return SKS.map(([k, nm, idx]) => {
      const s = (t.skills || [])[idx] || {}, nums = s.nums || [], rs = rf && rf[k], used = new Set();
      const cols = nums[0] ? nums[0].length : 0;
      const rows = [];
      for (let j = 0; j < cols; j++) {
        const reg = {}; nums.forEach((lv, li) => { const x = lv[j] && lv[j][0]; if (x != null) reg[li + 1] = x; });
        const p = rs ? CMP.matchParam(rs.params, reg, [1, 10], used) : -1;
        rows.push({ i: `${k}:${j}`, label: `${j + 1}つ目`, reg, ref: p >= 0 ? CMP.toLv(rs.params[p], LV13) : null });
      }
      // 控えにだけある数字（登録の表に無いもの）も並べる。Lvで変わらない数字は Lv1 だけ
      if (rs) rs.params.forEach((pr, pi) => {
        if (used.has(pi)) return;
        const lvs = pr.length === 1 ? [1] : LV13.slice(0, pr.length);
        rows.push({ i: `${k}:p${pi}`, label: `控えだけ${pi + 1}`, reg: {}, ref: CMP.toLv(pr, lvs), lvs, groups: pr.length === 1 ? [{ lvs: [1], ends: [1], mid: 0 }] : pr.length >= 10 ? SK_GROUPS.map(g => ({ lvs: g.lvs.filter(lv => lv <= pr.length), ends: g.ends.filter(lv => lv <= pr.length), mid: g.mid })).filter(g => g.lvs.length) : [{ lvs, ends: [1, lvs.length], mid: 1 }] });
      });
      rows.forEach(r => ROWS.push({ row: r, groups: r.groups || SK_GROUPS }));
      const tb = rows.length ? CMP.table({ lvs: LV13, head: lv => "Lv" + lv, rows, groups: SK_GROUPS, get: (kd, i, lv) => val(kd, `${i}:${lv}`), attr: (kd, i, lv) => `data-sk="${kd === "r" ? "r:" : kd === "f" ? "f:" : ""}${i}:${lv}"`, fix: i => fx[i] }) : '<div class="muted">Lvごとの数字はありません。</div>';
      return `<div class="phead" style="font-size:13px">${nm}：${esc(rs ? rs.jp : s.name || "")} <span class="muted">${esc(s.name || "")}</span></div>
        <div class="txt">${esc(s.text || "")}</div>${rs ? `<details><summary class="muted">控えの文</summary><div class="txt" style="margin:4px 0">${esc(rs.desc)}</div></details>` : ""}${tb}`;
    }).join("");
  }

  // ---- 信頼ボーナス ----
  const TR = [["hp", "基礎HP"], ["atk", "基礎攻撃力"], ["atkPct", "攻撃力%"]];
  const trv = (k, v) => v == null ? "" : k === "atkPct" ? Math.round(v * 1000) / 10 + "%" : String(v);
  function trustHtml(t) {
    const tr = (t.stats && t.stats.trust) || {}, c = store.tr[t.en] || {}, fx = c.fix || {};
    const max = Math.min(50, ((tr.hp || []).length || 1) - 1);
    const lvs = Array.from({ length: max }, (_, i) => i + 1);
    const cls = (x, reg) => !String(x || "").trim() ? "" : !reg ? "cx-new" : CMP.eq(x, reg) ? "cx-ok" : "cx-ng";
    const inp = (kd, k, lv) => { const reg = trv(k, (tr[k] || [])[lv]), x = val(kd, `${k}:${lv}`); return `<td class="ck-in"><input type="text" inputmode="decimal" data-tr="${kd === "r" ? "r:" : ""}${k}:${lv}" data-t="${esc(reg)}" class="${cls(x, reg)}" value="${esc(x || "")}"></td>`; };
    const body = lvs.map(lv => `<tr><td><b>Lv${lv}</b></td>${TR.map(([k]) => { const f = (fx[k] || {})[lv]; return `<td style="text-align:center">${esc(trv(k, (tr[k] || [])[lv]))}</td>${inp("r", k, lv)}${inp("g", k, lv)}<td class="cx-fix" style="text-align:center">${f ? esc(f.v) : ""}</td>`; }).join("")}</tr>`).join("");
    return `<div class="muted">信頼ボーナスは控えに無いので、登録（英語Wiki）と比べます。確定するのは、ゲーム（無ければ報告）で数字が入っているLvだけです。</div>
      <table class="lv ck-t cx-t"><tr><th rowspan="2">信頼Lv</th>${TR.map(([, nm]) => `<th colspan="4">${nm}</th>`).join("")}</tr><tr>${TR.map(() => "<th>登録</th><th>報告</th><th>ゲーム</th><th>確定</th>").join("")}</tr>${body}</table>`;
  }

  function editor() {
    const t = (window.TREKKERS || []).find(x => x.en === V.t);
    const title = V.mode === "sk" ? "スキルの確認" : "信頼ボーナスの確認";
    if (!t) return `<h2>${title}</h2><p class="muted">左の巡遊者を選んでください。</p>`;
    ROWS = [];
    const c = store[V.mode][t.en] || {};
    const note = V.mode === "sk" ? `数字をクリックすると「採用」に入ります（「全部」で1行まとめて）。違うときは採用の欄に打ってください（徽章なし）。` : "";
    return `<h2>${esc(TJ(t.en))} <span class="muted">${esc(t.en)}　★${t.rarity} ${esc(EL[t.element] || "")}</span></h2>
      <div class="ck"><div class="ck-h">ゲームの${V.mode === "sk" ? "スキル" : "信頼"}の画面と比べてください</div>${note ? `<div class="muted">${note}</div>` : ""}
      ${V.mode === "sk" ? skillHtml(t) : trustHtml(t)}
      <div class="fld"><label>メモ</label><input type="text" data-sk="memo" value="${esc(buf.memo != null ? buf.memo : (c.memo || ""))}" placeholder="気づいたこと（報告した人・画面の条件 など）"></div>
      <div class="ck-b">${V.mode === "sk" ? '<button class="btn-add pri" data-act="skck:adopt">採用を保存</button>' : '<button class="btn-add" data-act="skck:save">入れた数字を保存</button><button class="btn-add" data-act="skck:fix" style="background:#2E9E7A;color:#fff">確定する</button>'}${c.fix ? '<button class="btn-add" data-act="skck:unfix">確定を消す</button>' : ""}${c.at ? '<button class="btn-add" data-act="skck:del">全部消す</button>' : ""}</div>
      <div class="muted" id="skmsg">${c.at ? `保存: ${esc(c.at)}` : "まだ保存していません"}${c.fix ? `・確定済み（${esc(c.fixAt || "")}）` : ""}</div></div>`;
  }

  function render(mode) {
    if (mode) V.mode = mode;
    $("bar").innerHTML = bar(); $("list").innerHTML = left(); $("editor").innerHTML = editor();
    const h = document.querySelector("#left .panel > h2"); if (h) h.textContent = "巡遊者の一覧（クリックすると右に出ます）";
  }

  const attrOf = x => x.getAttribute && (x.getAttribute("data-sk") || x.getAttribute("data-tr"));
  document.addEventListener("input", ev => { const k = attrOf(ev.target); if (k) buf[k] = ev.target.value; });
  document.addEventListener("click", ev => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const a = el.getAttribute("data-act");
    if (a.indexOf("skel:") === 0) { V.el = a.slice(5); saveSel(); render(); return; }
    if (a.indexOf("skpick:") === 0) { Object.keys(buf).forEach(k => delete buf[k]); V.t = a.slice(7); saveSel(); render(); return; }
    if (a.indexOf("skck:") !== 0 || !V.t) return;
    const st = a.slice(5), m = V.mode;
    if (st === "del") { if (!confirm(TJ(V.t) + " の入力と確定を消します。よいですか？")) return; delete store[m][V.t]; }
    else {
      const vals = {};
      document.querySelectorAll("[data-sk],[data-tr]").forEach(x => { const k = attrOf(x); vals[k] = buf[k] != null ? buf[k] : x.value; });
      const g = {}, rp = {};
      const fa = {}; let nf = 0;
      document.querySelectorAll('[data-sk^="f:"]').forEach(x => { const k = x.getAttribute("data-sk").slice(2), j = k.lastIndexOf(":"), r = CMP.adopt(x); if (!r) return; nf++; delete r.same; (fa[k.slice(0, j)] = fa[k.slice(0, j)] || {})[k.slice(j + 1)] = r; });
      Object.keys(vals).filter(k => k !== "memo" && k.indexOf("f:") !== 0).forEach(k => { const v = String(vals[k]).replace(/[%％\s]/g, ""); if (!v) return; if (k.indexOf("r:") === 0) rp[k.slice(2)] = v; else g[k] = v; });
      const prev = store[m][V.t] || {};
      const o = { at: new Date().toLocaleDateString("sv") };
      if (st === "adopt") { if (prev.g) o.g = prev.g; if (prev.r) o.r = prev.r; } else { if (Object.keys(g).length) o.g = g; if (Object.keys(rp).length) o.r = rp; }
      if (vals.memo && String(vals.memo).trim()) o.memo = String(vals.memo).trim();
      if (st === "adopt") { if (nf) { o.fix = fa; o.fixAt = o.at; } }
      else if (st === "fix") {
        const f = {};
        if (m === "sk") ROWS.forEach(x => Object.assign(f, CMP.fixAll([x.row], x.groups, (kd, i, lv) => (kd === "r" ? rp : g)[i + ":" + lv])));
        else Object.keys(Object.assign({}, rp, g)).forEach(k => { const [s, lv] = k.split(":"), v = g[k] != null ? g[k] : rp[k]; f[s] = f[s] || {}; f[s][lv] = { v: s === "atkPct" ? v + "%" : v, by: g[k] != null ? "game" : "rep" }; });
        if (!Object.keys(f).length) { const x = $("skmsg"); if (x) x.textContent = m === "sk" ? "確定できる範囲がまだありません（判定の行を見てください）" : "数字を入れてから押してください"; return; }
        o.fix = f; o.fixAt = o.at;
      } else if (st !== "unfix" && prev.fix) { o.fix = prev.fix; o.fixAt = prev.fixAt; }
      store[m][V.t] = o;
    }
    Object.keys(buf).forEach(k => delete buf[k]);
    save(m); render();
  });

  window.EDIT_SK = {
    render,
    // キー: スキル＝技:数字の番号:Lv（技は basic/main/support/ult、番号の「p」は控えだけにある数字）、信頼＝hp/atk/atkPct:Lv。g=ゲーム、r=報告、fix=確定
    exportText: () => (Object.keys(store.sk).length ? "\n// スキルの確認（キー: 技:数字の番号:Lv。g=ゲーム、r=報告、fix=確定）\nwindow.SK_CHECK = " + JSON.stringify(store.sk) + ";\n" : "") +
      (Object.keys(store.tr).length ? "\n// 信頼ボーナスの確認（キー: hp/atk/atkPct:信頼Lv。g=ゲーム、r=報告、fix=確定）\nwindow.TR_CHECK = " + JSON.stringify(store.tr) + ";\n" : ""),
  };
  void ent;
})();
