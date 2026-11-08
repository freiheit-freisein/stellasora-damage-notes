// 確認ページ（Edit）の「比べる表」。素質・ロスレコ・スキルで同じものを使う。
// 1つの数字ごとに、登録（サイトの今の値）／控え（手元だけの照合用データ）／報告（Discord などでもらった値）／ゲーム（自分で画面を見た値）を並べ、
// 決めた数だけそろったら「確定できる」と出す。確定は人がボタンで押す（2026-11-08 ユーザー: 自動では同期しない。確かめながら確定していく）。
// きまり（2026-11-08 ユーザー）:
//  ・両端（素質ならLv1とLv6）＋その間のLvを1つ以上、ゲームか報告で確かめたら、控えの値でその範囲を確定できる
//  ・素質Lv7〜9・スキルLv11〜13は、2つ以上そろったら確定できる（残りは控えの値を推測値として使う）
//  ・ゲームで見えない範囲は入れない
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = v => { if (v == null || v === "") return null; const n = parseFloat(String(v).replace(/[%％,\s約]/g, "")); return isFinite(n) ? n : null; };
  const eq = (a, b) => { const x = num(a), y = num(b); return x != null && y != null && Math.abs(x - y) < 1e-6 * Math.max(1, Math.abs(y)); };
  // 目安（計算で出した値）と比べる行は、ゲームの丸めの分だけずれてよい（row.tol = 割合。例 0.01 = 1%、最低 0.1）
  // 目安は丸めた表から計算した値なので tol（割合）までずれてよい。ゲームの数字が整数なら、表示の四捨五入の分（0.5）も足す
  const near = (a, b, tol) => { if (!tol) return eq(a, b); const x = num(a), y = num(b); if (x == null || y == null) return false; const r = Number.isInteger(x) ? 0.5 : 0.05; return Math.abs(x - y) <= Math.max(0.1, tol * Math.abs(y)) + r; };
  const hasRef = () => !!window.REF_LOCAL;
  const rng = a => a.length > 1 ? `Lv${a[0]}〜${a[a.length - 1]}` : `Lv${a[0]}`;

  // 1つの数字の行を、範囲ごとに判定する。
  // row: { reg:{lv:v}, ref:{lv:v}|null }, get(kind, lv) で報告(r)・ゲーム(g)の値を返す、groups: [{ lvs, ends, mid }]
  function judge(row, get, groups) {
    return groups.map(gr => {
      const lvs = gr.lvs, cell = {};
      let g = 0, r = 0, ng = [];
      lvs.forEach(lv => {
        const gv = get("g", lv), rv = get("r", lv), f = row.ref ? row.ref[lv] : null, e = row.reg[lv];
        const t = f != null ? f : e;   // 控えがあれば控えと比べる。無ければ登録と比べる
        let s = "none";
        if (gv != null && gv !== "") s = t == null ? "g-new" : near(gv, t, row.tol) ? "g-ok" : "g-ng";
        else if (rv != null && rv !== "") s = t == null ? "r-new" : near(rv, t, row.tol) ? "r-ok" : "r-ng";
        else if (f != null && e != null && eq(e, f)) s = "reg-ok";
        if (gv != null && gv !== "" && rv != null && rv !== "" && !eq(gv, rv)) s = "g-ng";   // ゲームと報告が食い違う
        cell[lv] = s;
        if (s === "g-ng" || s === "r-ng") ng.push(lv);
      });
      const by = s => /^g-/.test(s) ? "game" : /^r-/.test(s) ? "rep" : s === "reg-ok" ? "reg" : null;
      const isEv = s => s === "g-ok" || s === "r-ok" || s === "g-new" || s === "r-new";
      const mids = lvs.filter(lv => gr.ends.indexOf(lv) < 0);
      const endsOk = gr.ends.every(lv => isEv(cell[lv]) || cell[lv] === "reg-ok");
      const midN = mids.filter(lv => isEv(cell[lv])).length;
      lvs.forEach(lv => { if (isEv(cell[lv])) /^g-/.test(cell[lv]) ? g++ : r++; });
      const needMid = Math.min(gr.mid, mids.length);
      // 確定する値: ゲーム → 報告 → 控え の順。控えが無いときは、全部のLvがゲームか報告でそろったときだけ
      const vals = {};
      let ok = !ng.length && endsOk && midN >= needMid;
      if (ok && !row.ref) ok = lvs.every(lv => isEv(cell[lv]) || cell[lv] === "reg-ok" || (row.reg[lv] != null && gr.ends.indexOf(lv) >= 0));
      // 単位は控え・登録の書き方にそろえる（「14」と打っても、相手が「14%」なら「14%」）
      const fmt = (x, lv) => { const t = row.ref && row.ref[lv] != null ? row.ref[lv] : row.reg[lv]; if (t != null && eq(x, t)) return String(t); return String(x).trim() + (t != null && /%/.test(String(t)) && !/%/.test(String(x)) ? "%" : ""); };
      if (ok) lvs.forEach(lv => {
        const gv = get("g", lv), rv = get("r", lv);
        if (gv != null && gv !== "") vals[lv] = { v: fmt(gv, lv), by: "game" };
        else if (rv != null && rv !== "") vals[lv] = { v: fmt(rv, lv), by: "rep" };
        else if (row.ref && row.ref[lv] != null) vals[lv] = { v: String(row.ref[lv]), by: isEv(cell[lv]) || cell[lv] === "reg-ok" ? "ref" : "est" };
        else if (row.reg[lv] != null) vals[lv] = { v: String(row.reg[lv]), by: "reg" };
      });
      let text;
      if (ng.length) text = `<span class="cx-bad">${rng(lvs)}：控え・登録と違う数字があります（Lv${ng.join("・")}）</span>`;
      else if (ok) text = `<span class="cx-good">${rng(lvs)}：${row.okText || "確定できる"}</span>（${g + r ? `ゲーム${g}・報告${r}` : "登録と控えが同じ"}）`;
      else {
        const lack = [];
        gr.ends.filter(lv => !(isEv(cell[lv]) || cell[lv] === "reg-ok")).forEach(lv => lack.push(`Lv${lv}`));
        if (midN < needMid) lack.push(`${rng(mids)}のどれか${needMid - midN}つ`);
        if (!row.ref && !lack.length) lack.push("全部のLv（控えが無いので）");
        text = `${rng(lvs)}：あと ${lack.join("、")}`;
      }
      return { lvs, ok, ng, cell, vals, text, by };
    });
  }

  // 表を作る。o: { lvs, head(lv), rows:[{ i, label, reg, ref }], groups, get(kind,i,lv), attr(kind,i,lv) → 入力欄の属性, fix(i) → 確定済みの {lv:{v,by}} }
  function table(o) {
    const ref = hasRef();
    const key = lv => o.groups.some(g => g.ends.indexOf(lv) >= 0) ? " ck-key" : "";
    const span = gr => o.lvs.filter(lv => gr.lvs.indexOf(lv) >= 0).length;
    const cls = s => ({ "g-ok": "cx-ok", "r-ok": "cx-ok", "g-new": "cx-new", "r-new": "cx-new", "g-ng": "cx-ng", "r-ng": "cx-ng", "reg-ok": "" }[s] || "");
    const body = o.rows.map(row => {
      const lvsOf = row.lvs || o.lvs;
      const groups = row.groups || o.groups;
      const jd = judge(row, (k, lv) => o.get(k, row.i, lv), groups);
      const st = {}; jd.forEach(j => Object.assign(st, j.cell));
      const fx = (o.fix && o.fix(row.i)) || null;
      const td = (lv, h) => lvsOf.indexOf(lv) >= 0 ? h : `<td class="muted" style="text-align:center">—</td>`;
      const v = (m, lv) => m && m[lv] != null ? esc(m[lv]) : "";
      const tgt = lv => row.ref && row.ref[lv] != null ? row.ref[lv] : (row.reg[lv] != null ? row.reg[lv] : "");
      const inp = (k, lv) => `<td class="ck-in${key(lv)}"><input type="text" inputmode="decimal" ${o.attr(k, row.i, lv)} data-t="${esc(tgt(lv))}"${row.tol ? ` data-tol="${row.tol}"` : ""} class="${String(o.get(k, row.i, lv) || "").trim() && new RegExp("^" + k + "-").test(st[lv] || "") ? cls(st[lv]) : ""}" value="${esc(o.get(k, row.i, lv) || "")}"></td>`;
      // 段は「比べる数字／報告／ゲーム／判定」の4つ。比べる数字＝控え（無ければ登録）。登録が控えと違えば小さく添える。確定した値は緑
      const cmpCell = lv => { const f = row.ref && row.ref[lv] != null ? row.ref[lv] : null, e = row.reg[lv]; const main = f != null ? f : e; if (main == null) return "";
        const note = f != null && e != null && !eq(f, e) ? `<br><small class="cx-wiki">Wiki ${esc(e)}</small>` : ""; return esc(main) + note; };
      const fixed = lv => fx && fx[lv];
      const nm = row.regName || (row.ref ? "控え" : "登録");
      return `<tr class="cx-top"><td rowspan="4"><b>${esc(row.label)}</b></td><td class="cx-k">${esc(nm)}</td>${o.lvs.map(lv => td(lv, `<td style="text-align:center" class="${fixed(lv) ? "cx-fix" : ""}" title="${fixed(lv) ? "確定済み" : ""}">${cmpCell(lv)}</td>`)).join("")}</tr>` +
        `<tr><td class="cx-k">報告</td>${o.lvs.map(lv => td(lv, inp("r", lv))).join("")}</tr>` +
        `<tr><td class="cx-k">ゲーム</td>${o.lvs.map(lv => td(lv, inp("g", lv))).join("")}</tr>` +
        `<tr><td class="cx-k">判定</td><td colspan="${o.lvs.length}" class="cx-j">${jd.map(j => j.text).join("　／　")}${fx ? "　<span class=\"cx-good\">（確定済み）</span>" : ""}</td></tr>`;
    }).join("");
    return `<table class="lv ck-t cx-t"><tr><th colspan="2">文の中の数字</th>${o.lvs.map(lv => `<th class="${key(lv).trim()}">${esc(o.head(lv))}</th>`).join("")}</tr>${body}</table>`;
  }

  // 確定できる範囲の値を集める（行ごと {lv:{v,by}}）
  function fixAll(rows, groups, get) {
    const out = {};
    rows.forEach(row => {
      const jd = judge(row, (k, lv) => get(k, row.i, lv), row.groups || groups);
      const m = {}; jd.filter(j => j.ok).forEach(j => Object.assign(m, j.vals));
      if (Object.keys(m).length) out[row.i] = m;
    });
    return out;
  }

  // 控えの Param の中から、登録の値（Lv1と最後のLv）が同じものを探す。used は使った番号
  function matchParam(params, reg, lvs, used) {
    const first = lvs[0], last = lvs[lvs.length - 1];
    for (let k = 0; k < (params || []).length; k++) {
      if (used.has(k)) continue;
      const p = params[k];
      if (!eq(p[0], reg[first])) continue;
      if (lvs.length > 1 && reg[last] != null && p.length > 1 && !eq(p[Math.min(last, p.length) - 1], reg[last])) continue;
      used.add(k); return k;
    }
    return -1;
  }
  const toLv = (arr, lvs) => { const m = {}; lvs.forEach(lv => { if (arr[lv - 1] != null) m[lv] = arr[lv - 1]; }); return m; };

  // 入力した欄の色を、打ったその場で変える（data-t = 比べる相手。控え→登録の順）
  document.addEventListener("input", ev => {
    const x = ev.target;
    if (!x.closest || !x.closest(".cx-t") || !x.hasAttribute("data-t")) return;
    const t = x.getAttribute("data-t");
    x.classList.remove("cx-ok", "cx-ng", "cx-new");
    if (x.value.trim()) x.classList.add(!t ? "cx-new" : near(x.value, t, +x.getAttribute("data-tol") || 0) ? "cx-ok" : "cx-ng");
  });

  // 上の帯の切り替えボタン（素質・ロスレコ・スキル・信頼ボーナス）
  const MODES = [["pot", "素質の確認"], ["lr", "ロスレコの確認"], ["sk", "スキルの確認"], ["tr", "信頼ボーナスの確認"]];
  const modeBar = cur => MODES.filter(m => m[0] === "pot" || (m[0] === "lr" ? window.EDIT_LR : window.EDIT_SK)).map(m => `<button class="sbtn${m[0] === cur ? " on" : ""}" data-act="mode:${m[0]}">${m[1]}</button>`).join("");

  window.CMP = { modeBar, num, eq, judge, table, fixAll, matchParam, toLv, hasRef };
})();
