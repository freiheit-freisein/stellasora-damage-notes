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
    return `<button class="sbtn" data-act="mode:pot">素質の確認</button><button class="sbtn on" data-act="mode:lr">ロスレコの確認</button>
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

  // 1つの効果の表: 行=文の中の数字、列=突破（I〜VI）またはLv（1〜5）。上の段が登録の値、下の段がゲームの数字の入力
  function table(key, it, lvs, head) {
    const texts = lvs.map(lv => txtAt(it, lv));
    const last = texts[texts.length - 1] || "";
    const rows = Math.max(0, ...texts.map(t => numsOf(t).length));
    const g = ((chk[V.sel] || {}).g) || {};
    const inp = k => `<input type="text" inputmode="decimal" data-lk="${k}" value="${esc(buf[k] != null ? buf[k] : (g[k] || ""))}">`;
    const tb = rows ? `<table class="lv ck-t"><tr><th>文の中の数字</th>${lvs.map(lv => `<th>${head(lv)}</th>`).join("")}</tr>${Array.from({ length: rows }, (_, i) =>
      `<tr><td>${i + 1}つ目（登録）</td>${texts.map(t => `<td style="text-align:center">${esc(numsOf(t)[i] || "")}</td>`).join("")}</tr>
       <tr><td class="muted">ゲーム</td>${lvs.map(lv => `<td class="ck-in">${inp(`${key}:${i}:${lv}`)}</td>`).join("")}</tr>`).join("")}</table>` : '<div class="muted">文の中に数字はありません。</div>';
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
    const coreLvs = it => typeof it.txt === "function" ? [1, 2, 3, 4, 5, 6] : [1];
    const core = fx ? fx.core.map(it => `<div class="eff">${table("c:" + it.id, it, coreLvs(it), lv => coreLvs(it).length > 1 ? "突破" + ROMAN[lv - 1] : "値")}</div>`).join("") : '<div class="muted">コア効果は登録していません。</div>';
    const assists = fx && fx.assists.length ? fx.assists.map(a => {
      const lvs = [1, 2, 3, 4, 5];
      return `<div class="phead" style="font-size:13px">${esc(a.name || a.id)} <span class="muted">（${esc((a.notes || []).join("・"))} ${a.base != null ? a.base + "以上で解放・15ごとにLv+1" : ""}）</span></div>` +
        a.items.map(it => `<div class="eff">${table("a:" + a.id + ":" + it.id, it, typeof it.txt === "function" ? lvs : [1], lv => typeof it.txt === "function" ? "Lv" + lv : "値")}</div>`).join("");
    }).join("") : '<div class="muted">アシスト効果は登録していません。</div>';
    return `<h2>${esc(r.name)}${isAuto(r) ? "*" : ""} <span class="muted">★${r.rarity} ${esc(r.element || "")}${r.core && r.core.rank && r.core.rank !== "?" ? `・登録の突破 ${esc(r.core.rank)}` : ""}</span></h2>
      <div class="ck">
        <div class="ck-h">ゲームのロスレコの画面と比べてください</div>
        <div class="muted">上の段が登録してある値です。ゲームの数字は、違うときだけ入れてください（登録に無い突破・Lvは、分かった数字を入れてください）。基礎攻撃力などは、何段目の突破の画面か、メモに書いてください。</div>
        <div class="phead" style="font-size:13px">ステータス</div>
        ${stRows ? `<table class="lv ck-t"><tr><th>項目</th><th>登録</th><th>ゲーム</th></tr>${stRows}</table>` : '<div class="muted">登録していません。</div>'}
        <div class="phead" style="font-size:13px">サブにしたときの初期の音符</div>
        ${ntRows ? `<table class="lv ck-t"><tr><th>音符</th><th>登録</th><th>ゲーム（Lv）</th></tr>${ntRows}</table>` : '<div class="muted">登録していません。</div>'}
        <div class="phead" style="font-size:13px">コア効果</div>${core}
        <div class="phead" style="font-size:13px">アシスト効果</div>${assists}
        <div class="fld"><label>メモ</label><input type="text" data-lk="memo" value="${esc(buf.memo != null ? buf.memo : (c.memo || ""))}" placeholder="気づいたこと（文が違う・突破の段・何に効くかわからない など）"></div>
        <div class="ck-b"><button class="btn-add pri" data-act="lrck:ok">合ってる</button><button class="btn-add" data-act="lrck:diff">数字が違う（入れた数字で保存）</button><button class="btn-add" data-act="lrck:unk">わからない（メモで保存）</button>${c.st ? '<button class="btn-add" data-act="lrck:del">確認を消す</button>' : ""}</div>
        <div class="muted" id="lrmsg">${c.st ? `今の確認: <b>${NAME[c.st]}</b>（${esc(c.at || "")}）` : "まだ確認していません"}</div>
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
        const g = {};
        Object.keys(vals).filter(k => k !== "memo").forEach(k => { const v = String(vals[k]).replace(/[%％\s]/g, ""); if (v) g[k] = v; });
        if (st === "diff" && !Object.keys(g).length) { const m = $("lrmsg"); if (m) m.textContent = "ゲームの数字を、違うところだけ入れてから押してください"; return; }
        const o = { name: (L.find(x => x.id === id) || {}).name, st, at: new Date().toLocaleDateString("sv") };
        if (Object.keys(g).length) o.g = g;
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
    exportText: () => "\n// ロスレコの確認（キー: c:コア効果:数字の番号:突破、a:アシスト:効果:数字の番号:Lv、st:ステータス、nt:初期の音符の番号）\nwindow.LR_CHECK = " + JSON.stringify(chk, null, 1) + ";\n",
  };
})();
