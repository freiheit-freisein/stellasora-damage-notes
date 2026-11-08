// 素質の確認ページの「ロスレコの確認」。登録してある値（日本語Wiki・画面で入れた値）とゲームの画面を比べる。
// 確認の結果はブラウザに保存し（stellasora-lr-check-v1）、「確認の結果を書き出す」で素質の確認と一緒に書き出す（window.LR_CHECK）。
// 効果を計算の形にするのは Claude がする（素質の確認と同じ）。
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const S = window.SIM, L = window.LOSTRECORDS || [];
  const ELS = ["水", "火", "風", "地", "光", "闇"];
  const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
  const ST = { baseAtk: "基礎攻撃力", baseHp: "基礎HP", baseDef: "基礎防御力", elemDmg: "属性ダメージ", skillDmg: "スキルダメージ", basicDmg: "通常攻撃ダメージ", ultDmg: "必殺技ダメージ", markDmg: "印ダメージ", critRate: "会心率", critDmg: "会心ダメージ", atkPct: "攻撃力", hpPct: "最大HP" };
  const KEY = "stellasora-lr-check-v1", SELKEY = "stellasora-edit-lr";
  let chk = {};
  try { chk = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { chk = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(chk)); } catch (e) { /* 無視 */ } };
  const V = { el: "", sel: null };
  try { Object.assign(V, JSON.parse(localStorage.getItem(SELKEY)) || {}); } catch (e) { /* 無視 */ }
  const saveSel = () => { try { localStorage.setItem(SELKEY, JSON.stringify(V)); } catch (e) { /* 無視 */ } };
  const buf = {};   // 入力中の値（保存ボタンで確定）
  const NAME = { ok: "合ってる", diff: "数字が違う", unk: "わからない" };

  const recs = () => L.filter(r => !V.el || r.element === V.el).slice().sort((a, b) => (b.rarity - a.rarity) || String(a.name).localeCompare(String(b.name), "ja"));
  const isAuto = r => !!(r.auto || r.autoFx);
  // 文の中の数字（「10%」「8秒」など）を、左から順に拾う
  const numsOf = s => (String(s || "").match(/\d+(?:\.\d+)?%?/g) || []);
  const txtAt = (it, lv) => typeof it.txt === "function" ? it.txt(lv) : it.txt;

  function bar() {
    const n = L.length, d = L.filter(r => chk[r.id]).length;
    return `${window.CMP ? CMP.modeBar("lr") : ""}
      <b style="margin-left:8px">属性:</b>${["", ...ELS, "なし"].map(e => `<button class="sbtn${V.el === e ? " on" : ""}" data-act="lrel:${e}">${e || "全部"}</button>`).join("")}
      <span class="muted">このブラウザで確認したもの ${d} ／ 全 ${n} 件</span>`;
  }
  function list() {
    const card = r => {
      const c = chk[r.id];
      const tag = c ? `<span class="tag ck-${c.st}">${NAME[c.st]}</span>` : '<span class="tag t-none">未確認</span>';
      return `<div class="pc${V.sel === r.id ? " sel" : ""}" data-act="lrpick:${esc(r.id)}"><b>${esc(r.name)}${isAuto(r) ? "*" : ""}</b>${tag}<span class="en">★${r.rarity} ${esc(r.element || "")}</span></div>`;
    };
    const groups = (V.el ? [V.el] : [...ELS, "なし"]).map(e => [e, recs().filter(r => (ELS.indexOf(r.element) >= 0 ? r.element : "なし") === e)]).filter(g => g[1].length);
    return `<div class="muted">名前の「*」は日本語Wikiから自動で入れたもの（ゲームの画面で未確認）。</div>` +
      groups.map(([e, rs]) => `<div class="phead">${esc(e)}（${rs.length}）</div><div class="pgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${rs.map(card).join("")}</div>`).join("");
  }

  // 1つの効果の表: 行=文の中の数字、列=突破（I〜VI）またはLv（1〜5）。登録・控え・報告・ゲームを並べる（edit_cmp.js）
  // 確定のきまり（2026-11-08 ユーザー）: 両端（突破IとVI、Lv1とLv5）＋その間を1つ
  let ROWS = [];   // 今開いているロスレコの全部の行（確定ボタンで使う）
  const val = (kd, k) => { const kk = (kd === "r" ? "r:" : "") + k; if (buf[kk] != null) return buf[kk]; const c = chk[V.sel] || {}; return ((kd === "r" ? c.r : c.g) || {})[k]; };
  function table(key, it, lvs, head, refParams, used) {
    const texts = lvs.map(lv => txtAt(it, lv));
    const last = texts[texts.length - 1] || "";
    const n = Math.max(0, ...texts.map(t => numsOf(t).length));
    const one = lvs.length === 1, groups = one ? [{ lvs, ends: lvs, mid: 0 }] : [{ lvs, ends: [lvs[0], lvs[lvs.length - 1]], mid: 1 }];
    const rows = Array.from({ length: n }, (_, i) => {
      const reg = {}; lvs.forEach((lv, j) => { const x = numsOf(texts[j])[i]; if (x != null) reg[lv] = x; });
      const k = refParams ? CMP.matchParam(refParams, reg, one ? [lvs[0]] : [lvs[0], lvs[lvs.length - 1]], used) : -1;
      return { i: `${key}:${i}`, label: `${i + 1}つ目`, reg, ref: k >= 0 ? CMP.toLv(refParams[k], lvs) : null };
    });
    rows.forEach(r => ROWS.push({ row: r, groups }));
    const fx = (chk[V.sel] || {}).fix || {};
    const tb = n ? CMP.table({ lvs, head, rows, groups, get: (kd, i, lv) => val(kd, `${i}:${lv}`), attr: (kd, i, lv) => `data-lk="${kd === "r" ? "r:" : ""}${i}:${lv}"`, fix: i => fx[i] }) : '<div class="muted">文の中に数字はありません。</div>';
    return `<div class="txt">${esc(last)}${it.skip ? '　<span class="tag t-draft">計算に未反映</span>' : ""}${it.off ? '　<span class="tag t-none">既定で反映しない</span>' : ""}</div>${tb}`;
  }

  function editor() {
    const r = L.find(x => x.id === V.sel);
    if (!r) return '<h2>ロスレコの確認</h2><p class="muted">左のロスレコを選んでください。</p>';
    const c = chk[r.id] || {}, g = c.g || {};
    const fx = (S.LR_FX || {})[r.id];
    const inp = k => `<input type="text" inputmode="decimal" data-lk="${k}" value="${esc(buf[k] != null ? buf[k] : (g[k] || ""))}">`;
    const st = r.stats || {};
    const stRows = Object.keys(st).map(k => { const v = st[k], pct = v > 0 && v < 1; return `<tr><td>${esc(ST[k] || k)}</td><td style="text-align:center">${pct ? Math.round(v * 1000) / 10 + "%" : v}</td><td class="ck-in">${inp("st:" + k)}</td></tr>`; }).join("");
    const notes = ((r.sub && r.sub.startNotes) || []);
    const ntRows = notes.map((n, i) => `<tr><td>${esc(n.note)}</td><td style="text-align:center">Lv${n.lv}</td><td class="ck-in">${inp("nt:" + i)}</td></tr>`).join("");
    ROWS = [];
    const rf = (window.REF_LOCAL_LR || {})[r.name] || null, cUsed = new Set();
    const refNote = window.REF_LOCAL ? (rf ? "" : '<div class="muted">このロスレコは控えにありません（名前が合わない）。</div>') : "";
    const refTxt = (x, nm) => x ? `<details><summary class="muted">控えの文（${esc(nm)}）</summary><div class="txt" style="margin:4px 0">${esc(x.desc)}</div></details>` : "";
    const coreLvs = it => typeof it.txt === "function" ? [1, 2, 3, 4, 5, 6] : [1];
    const core = fx ? fx.core.map(it => `<div class="eff">${table("c:" + it.id, it, coreLvs(it), lv => coreLvs(it).length > 1 ? "突破" + ROMAN[lv - 1] : "値", rf && rf.core.params, cUsed)}</div>`).join("") + (rf ? refTxt(rf.core, "コア効果") : "") : '<div class="muted">コア効果は登録していません。</div>';
    const assists = fx && fx.assists.length ? fx.assists.map(a => {
      const lvs = [1, 2, 3, 4, 5];
      const ra = rf && (rf.as.find(x => x.jp === a.name) || null), aUsed = new Set();
      return `<div class="phead" style="font-size:13px">${esc(a.name || a.id)} <span class="muted">（${esc((a.notes || []).join("・"))} ${a.base != null ? a.base + "以上で解放・15ごとにLv+1" : ""}）</span></div>` +
        a.items.map(it => `<div class="eff">${table("a:" + a.id + ":" + it.id, it, typeof it.txt === "function" ? lvs : [1], lv => typeof it.txt === "function" ? "Lv" + lv : "値", ra && ra.params, aUsed)}</div>`).join("") + refTxt(ra, a.name || "");
    }).join("") : '<div class="muted">アシスト効果は登録していません。</div>';
    const refSt = rf && rf.statMax ? `<div class="muted">控え：最大Lv（${rf.statLv}）のステータス ${esc(Object.entries(rf.statMax).map(([k, v]) => k + " " + v).join("・"))}${rf.dupe.length ? `／凸ごとの攻撃力 ${esc(rf.dupe.map(d => d.ATK).join("・"))}` : ""}</div>` : "";
    return `<h2>${esc(r.name)}${isAuto(r) ? "*" : ""} <span class="muted">★${r.rarity} ${esc(r.element || "")}${r.core && r.core.rank && r.core.rank !== "?" ? `・登録の突破 ${esc(r.core.rank)}` : ""}</span></h2>
      <div class="ck">
        <div class="ck-h">ゲームのロスレコの画面と比べてください</div>
        <div class="muted">登録＝サイトの今の値、控え＝手元の照合用データ、報告＝Discord などでもらった値、ゲーム＝自分で画面を見た値です。分かったところだけ入れてください。緑＝控え（無ければ登録）と同じ、赤＝違う、青＝比べる相手が無い。確定のきまり：両端（突破IとVI、Lv1とLv5）＋その間のどれか1つ。基礎攻撃力などは、何段目の突破の画面か、メモに書いてください。</div>
        <div class="phead" style="font-size:13px">ステータス</div>
        ${refNote}${stRows ? `<table class="lv ck-t"><tr><th>項目</th><th>登録</th><th>ゲーム</th></tr>${stRows}</table>` : '<div class="muted">登録していません。</div>'}${refSt}
        <div class="phead" style="font-size:13px">サブにしたときの初期の音符</div>
        ${ntRows ? `<table class="lv ck-t"><tr><th>音符</th><th>登録</th><th>ゲーム（Lv）</th></tr>${ntRows}</table>` : '<div class="muted">登録していません。</div>'}
        <div class="phead" style="font-size:13px">コア効果</div>${core}
        <div class="phead" style="font-size:13px">アシスト効果</div>${assists}
        <div class="fld"><label>メモ</label><input type="text" data-lk="memo" value="${esc(buf.memo != null ? buf.memo : (c.memo || ""))}" placeholder="気づいたこと（文が違う・突破の段・何に効くかわからない など）"></div>
        <div class="ck-b"><button class="btn-add pri" data-act="lrck:ok">合ってる</button><button class="btn-add" data-act="lrck:diff">数字が違う（入れた数字で保存）</button><button class="btn-add" data-act="lrck:unk">わからない（メモで保存）</button><button class="btn-add" data-act="lrck:fix" style="background:#2E9E7A;color:#fff">確定する（そろった範囲）</button>${c.fix ? '<button class="btn-add" data-act="lrck:unfix">確定を消す</button>' : ""}${c.st ? '<button class="btn-add" data-act="lrck:del">確認を消す</button>' : ""}</div>
        <div class="muted" id="lrmsg">${c.st ? `今の確認: <b>${NAME[c.st]}</b>（${esc(c.at || "")}）` : "まだ確認していません"}${c.fix ? `・確定済み（${esc(c.fixAt || "")}）` : ""}</div>
      </div>`;
  }

  function render() { $("bar").innerHTML = bar(); $("list").innerHTML = list(); $("editor").innerHTML = editor(); }

  document.addEventListener("input", ev => { const k = ev.target.getAttribute && ev.target.getAttribute("data-lk"); if (k) buf[k] = ev.target.value; });
  document.addEventListener("click", ev => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const a = el.getAttribute("data-act");
    if (a.indexOf("lrel:") === 0) { V.el = a.slice(5); saveSel(); render(); return; }
    if (a.indexOf("lrpick:") === 0) { Object.keys(buf).forEach(k => delete buf[k]); V.sel = a.slice(7); saveSel(); render(); return; }
    if (a.indexOf("lrck:") === 0) {
      const st = a.slice(5), id = V.sel;
      if (!id) return;
      if (st === "del") delete chk[id];
      else {
        const vals = {};
        document.querySelectorAll("[data-lk]").forEach(x => { const k = x.getAttribute("data-lk"); vals[k] = buf[k] != null ? buf[k] : x.value; });
        const g = {}, rp = {};
        Object.keys(vals).filter(k => k !== "memo").forEach(k => { const v = String(vals[k]).replace(/[%％\s]/g, ""); if (!v) return; if (k.indexOf("r:") === 0) rp[k.slice(2)] = v; else g[k] = v; });
        if (st === "diff" && !Object.keys(g).length) { const m = $("lrmsg"); if (m) m.textContent = "ゲームの数字を、違うところだけ入れてから押してください"; return; }
        const prev = chk[id] || {};
        const o = { name: (L.find(x => x.id === id) || {}).name, st: st === "fix" || st === "unfix" ? (prev.st || "ok") : st, at: new Date().toLocaleDateString("sv") };
        if (Object.keys(g).length) o.g = g;
        if (Object.keys(rp).length) o.r = rp;
        if (st === "fix") {
          const f = {};
          ROWS.forEach(x => Object.assign(f, CMP.fixAll([x.row], x.groups, (kd, i, lv) => (kd === "r" ? rp : g)[i + ":" + lv])));
          if (!Object.keys(f).length) { const m = $("lrmsg"); if (m) m.textContent = "確定できる範囲がまだありません（判定の行を見てください）"; return; }
          o.fix = f; o.fixAt = o.at;
        } else if (st !== "unfix" && prev.fix) { o.fix = prev.fix; o.fixAt = prev.fixAt; }
        if (vals.memo && String(vals.memo).trim()) o.memo = String(vals.memo).trim();
        chk[id] = o;
      }
      Object.keys(buf).forEach(k => delete buf[k]);
      save(); render();
    }
  });

  window.EDIT_LR = {
    render,
    // 書き出しの中身（キー: c:コア効果:数字の番号:突破、a:アシスト:効果:数字の番号:Lv、st:ステータス、nt:初期音符の番号）
    exportText: () => !Object.keys(chk).length ? "" : "\n// ロスレコの確認（キー: c:コア効果:数字の番号:突破、a:アシスト:効果:数字の番号:Lv、st:ステータス、nt:初期の音符の番号。g=ゲーム、r=報告、fix=確定）\nwindow.LR_CHECK = " + JSON.stringify(chk) + ";\n",
  };
})();
