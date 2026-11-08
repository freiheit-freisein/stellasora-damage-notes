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

  // 表を作る（2026-11-09 ユーザー: 結局どの値を採用するか。「現在」と「控え」を並べ、クリックで採用、無ければ手入力）
  // 段: 現在（計算機が今使っている値）／控え（手元の照合用データ。無ければ出さない）／採用（入力。ここに入った値を保存する）
  // o: { lvs, head(lv), rows:[{ i, label, reg(=現在), ref(=控え), regName }], get(kind,i,lv) → 前に入れた報告(r)・ゲーム(g), attr(kind,i,lv) → 入力欄の属性, fix(i) → 採用済みの {lv:{v,by}} }
  let uid = 0;
  function table(o) {
    const key = lv => o.groups && o.groups.some(g => g.ends.indexOf(lv) >= 0) ? " ck-key" : "";
    const body = o.rows.map(row => {
      const lvsOf = row.lvs || o.lvs;
      const fx = (o.fix && o.fix(row.i)) || {};
      const rid = "cxr" + (++uid);
      const td = (lv, h) => lvsOf.indexOf(lv) >= 0 ? h : `<td class="muted" style="text-align:center">—</td>`;
      const cur = lv => row.reg[lv] != null ? String(row.reg[lv]) : "";
      const ref = lv => row.ref && !row.selfRef && row.ref[lv] != null ? String(row.ref[lv]) : "";
      const hasRef = !!(row.ref && !row.selfRef);
      const pick = (lv, v, kind) => v === "" ? "" : `<button type="button" class="cx-pick cx-pick-${kind}" data-pick="${rid}:${lv}" data-v="${esc(v)}" title="クリックで採用">${esc(v)}</button>`;
      // 前に入れた報告・ゲームの数字（参考に小さく出す）
      const hint = lv => { const g = o.get ? o.get("g", row.i, lv) : null, r = o.get ? o.get("r", row.i, lv) : null; const a = []; if (g) a.push("ゲーム " + g); if (r && r !== g) a.push("報告 " + r); return a.length ? `<br><small class="cx-wiki">${esc(a.join("・"))}</small>` : ""; };
      // 採用の欄: 採用済みの値。無ければ、前に入れたゲームの数字（無ければ報告の数字）を最初から入れておく（2026-11-09 ユーザー）
      const inp = lv => { let v = fx[lv] ? fx[lv].v : "", pre = ""; if (!v && o.get) { const g = o.get("g", row.i, lv), r = o.get("r", row.i, lv); if (g) { v = String(g); pre = "game"; } else if (r) { v = String(r); pre = "rep"; } } return `<td class="ck-in${key(lv)}"><input type="text" ${o.attr("f", row.i, lv)} data-row="${rid}" data-lv="${lv}" data-cur="${esc(cur(lv))}" data-ref="${esc(ref(lv))}"${pre ? ` data-pre="${esc(v)}" data-src="${pre}"` : ""} class="${adoptCls(v, cur(lv), ref(lv))}" value="${esc(v)}">${pre ? "" : hint(lv)}</td>`; };
      const allBtn = kind => `<button type="button" class="cx-all" data-pickall="${rid}:${kind}" title="この行を全部採用">全部</button>`;
      const n = hasRef ? 3 : 2;
      return `<tr class="cx-top"><td rowspan="${n}"><b>${esc(row.label)}</b></td><td class="cx-k">${esc(row.regName || "現在")} ${allBtn("cur")}</td>${o.lvs.map(lv => td(lv, `<td style="text-align:center">${pick(lv, cur(lv), "cur")}</td>`)).join("")}</tr>` +
        (hasRef ? `<tr><td class="cx-k">控え ${allBtn("ref")}</td>${o.lvs.map(lv => td(lv, `<td style="text-align:center">${pick(lv, ref(lv), "ref")}</td>`)).join("")}</tr>` : "") +
        `<tr><td class="cx-k">採用</td>${o.lvs.map(lv => td(lv, inp(lv))).join("")}</tr>`;
    }).join("");
    return `<table class="lv ck-t cx-t"><tr><th colspan="2">文の中の数字</th>${o.lvs.map(lv => `<th class="${key(lv).trim()}">${esc(o.head(lv))}</th>`).join("")}</tr>${body}</table>`;
  }
  // 採用の欄の色: 控えと同じ＝緑、現在と同じ＝青、どちらとも違う（手入力）＝橙
  function adoptCls(v, cur, ref) {
    if (!String(v || "").trim()) return "";
    if (ref && near(v, ref, 0)) return "cx-ok";
    if (cur && near(v, cur, 0)) return "cx-new";
    return "cx-man";
  }
  // 採用した値の出どころ（保存のとき）: ref＝控え、cur＝現在、manual＝手入力。単位（%）は現在・控えにそろえる
  function adopt(x) {
    const v = String(x.value || "").trim(); if (!v) return null;
    const cur = x.getAttribute("data-cur") || "", ref = x.getAttribute("data-ref") || "";
    // 最初から入れておいた（前のゲーム・報告の）数字のままなら、出どころは game／rep
    const pre = x.getAttribute("data-pre"), src = pre != null && pre === v ? x.getAttribute("data-src") : null;
    const m = ref && near(v, ref, 0) ? "ref" : cur && near(v, cur, 0) ? "cur" : "manual", by = src || m;
    const t = m === "ref" ? ref : m === "cur" ? cur : (ref || cur);
    const out = m === "manual" ? v + (/%/.test(t) && !/%/.test(v) ? "%" : "") : t;
    return { v: out, by, same: !!(cur && near(v, cur, 0)) };
  }
  document.addEventListener("click", ev => {
    const b = ev.target.closest && ev.target.closest("[data-pick],[data-pickall]");
    if (!b) return;
    ev.preventDefault();
    const set = (x, v) => { x.value = v; x.dispatchEvent(new Event("input", { bubbles: true })); };
    if (b.hasAttribute("data-pick")) {
      const [rid, lv] = b.getAttribute("data-pick").split(":");
      const x = document.querySelector(`input[data-row="${rid}"][data-lv="${lv}"]`);
      if (x) set(x, b.getAttribute("data-v"));
    } else {
      const [rid, kind] = b.getAttribute("data-pickall").split(":");
      document.querySelectorAll(`input[data-row="${rid}"]`).forEach(x => { const v = x.getAttribute(kind === "ref" ? "data-ref" : "data-cur"); if (v) set(x, v); });
    }
  });
  document.addEventListener("input", ev => {
    const x = ev.target;
    if (!x.hasAttribute || !x.hasAttribute("data-row")) return;
    x.classList.remove("cx-ok", "cx-new", "cx-man");
    const c = adoptCls(x.value, x.getAttribute("data-cur"), x.getAttribute("data-ref")); if (c) x.classList.add(c);
  });

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
    // 同じものが無くても、いちばん近いものを控えとして出す（2026-11-09 ユーザー: ずれとは関係なく出す。報告の入力ミスも見るため）
    let best = -1, bs = Infinity;
    const rel = (a, b) => { const x = Math.abs(num(a)), y = Math.abs(num(b)); return x == null || y == null ? 9 : Math.abs(x - y) / Math.max(1, Math.abs(y)); };
    for (let k = 0; k < (params || []).length; k++) {
      if (used.has(k)) continue;
      const p = params[k];
      // Lvで変わらない数字には変わらない控え、Lvで変わる数字には変わる控えだけを当てる（例: 「3本」に 21〜72% を当てない）
      const pConst = p.length === 1 || new Set(p.map(x => String(x))).size === 1;
      if ((lvs.length === 1) !== pConst) continue;
      if (/%/.test(String(reg[first])) !== /%/.test(String(p[0]))) continue;   // 「%」の付き方も同じものだけ（113.3% に 3.5 を当てない）
      const sc = rel(p[0], reg[first]) + (lvs.length > 1 && reg[last] != null && p.length > 1 ? rel(p[Math.min(last, p.length) - 1], reg[last]) : 0) + ((lvs.length > 1) === (p.length > 1) ? 0 : 0.5);
      if (sc < bs) { bs = sc; best = k; }
    }
    if (best >= 0) used.add(best);
    return best;
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

  window.CMP = { modeBar, num, eq, judge, table, fixAll, matchParam, toLv, hasRef, adopt };
})();
