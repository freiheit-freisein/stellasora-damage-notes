// 編成データ（stellasora-build）の読み込み。ほかのサイトと編成を受け渡すための、人が読める JSON。
// 形の決まりは https://github.com/freiheit-freisein/stellasora-data （README・schema/build.schema.json）。
// 方針: format と schema 以外はすべて省略できる。書いてあるものだけ入れ、知らない項目は無視し、
//       入れられなかったもの（知らないID・名前、計算ページに無い項目）は skipped に入れて画面で知らせる。
//       書いていないものは初期値のまま（読み込む前の入力は使わない）。
(function (S) {
  const SLOTS = ["main", "s1", "s2"], KINDS = ["triangle", "circle", "star"];
  const M = () => window.PRESET_MAP || { trekkers: {}, slots: {} };
  // 名前をそろえる（全角・半角、空白、「・」、かっこの違いを無くす）
  const norm = s => String(s || "").normalize("NFKC").replace(/[\s・･]/g, "").replace(/[（(]/g, "(").replace(/[）)]/g, ")").toLowerCase();
  // 巡遊者: ID（プリセットコードの巡遊者ID）→ 計算ページの巡遊者。無ければ名前（日本語・英語）
  function findChar(m) {
    if (m.trekker != null) {
      const en = M().trekkers[String(m.trekker)];
      const c = en && S.CH.find(x => x.en === en);
      if (c) return c;
    }
    if (m.name) {
      const n = norm(m.name);
      return S.CH.find(x => norm(x.jp) === n) || S.CH.find(x => norm(x.en) === n) || null;
    }
    return null;
  }
  const who = m => m.trekker != null ? "ID " + m.trekker + (m.name ? "（" + m.name + "）" : "") : (m.name || "（名前なし）");
  // 素質: キー「巡遊者ID:役割:種類:枠」、または role・kind・slot、または名前 → 計算ページの素質の英語名
  function potName(c, p, role) {
    const sl = M().slots[c.en] || {};
    let r = p.role || role, k = p.kind, s = p.slot;
    if (p.id) { const a = String(p.id).split(":"); if (a.length === 4) { r = a[1]; k = a[2]; s = +a[3]; } }
    if (k && s != null && sl[r] && sl[r][k]) return { name: sl[r][k][s], core: k === "core" };
    if (p.name) {
      const n = norm(p.name), ja = en => ((window.POTENTIAL_JA || {})[c.en] || {})[en] || en;
      for (const rr of ["main", "support"]) for (const kk of ["core", "sub"]) for (const en of ((sl[rr] || {})[kk] || [])) {
        if (en && (norm(en) === n || norm(ja(en)) === n)) return { name: en, core: kk === "core" };
      }
    }
    return null;
  }
  const optOf = k => (window.EMBLEM_OPTIONS || []).find(o => o.key === k);
  // 徽章の品質: q（green / blue / gold / rainbow / rainbow2 / rainbow3）、または value（その品質の値）
  function qualOf(o, sl) {
    if (o.type === "skillLv" || o.type === "potLv") {
      const v = sl.value != null ? +sl.value : sl.q === "gold" ? 1 : sl.q === "rainbow2" ? 2 : sl.q === "rainbow3" || sl.q === "rainbow" ? 3 : null;
      return v === 1 ? "gold" : v === 2 ? "rainbow2" : v === 3 ? "rainbow3" : null;
    }
    if (sl.q && o.tiers[sl.q] != null) return sl.q;
    if (sl.value != null) { const e = Object.entries(o.tiers).find(([, v]) => v != null && Math.abs(v - sl.value) < 1e-6); if (e) return e[0]; }
    return null;
  }
  // 徽章の合計 → 「その他」の加算の欄（cs.add）のキー
  const TOTAL_TO_ADD = { basicDmg: "basic", skillDmg: "skill", ultDmg: "ult", elemDmg: "elem", resPen: "pen", critDmg: "critDmg", critRate: "critRate",
    atkPct: "atkPct", baseAtk: "atkFlat", hpPct: "hpPct", baseHp: "hpFlat", markDmg: "mark" };
  // ロスレコ: キー（計算ページの名札）、または名前
  function findRec(r) {
    const L = window.LOSTRECORDS || [];
    if (r.id) { const x = L.find(y => y.id === r.id); if (x) return x; }
    if (r.name) { const n = norm(r.name); return L.find(y => norm(y.name) === n) || null; }
    return null;
  }
  function findEnemy(b) {
    const E = S.ENEMIES || [], n = norm(b);
    return E.find(e => e.id === b) || E.find(e => norm(e.name).indexOf(n) === 0) || null;
  }

  // text: JSON の文字列か、読み込んだオブジェクト。fresh: 初期値の入力（defState()）。catOfKey: 徽章の項目 → 区分（画面の選択肢用）
  // 戻り値: { G, done: [読み込めたもの], skipped: [入れられなかったもの], meta: [計算に使わない情報] }
  S.buildApply = function (text, fresh, catOfKey) {
    let b = text;
    if (typeof text === "string") {
      try { b = JSON.parse(text); } catch (e) { throw new Error("JSON として読めませんでした（形が崩れていないか確かめてください）"); }
    }
    if (!b || typeof b !== "object" || b.format !== "stellasora-build") throw new Error("編成データではありません（\"format\": \"stellasora-build\" がありません）");
    if (b.schema !== 1) throw new Error("この計算ページでは読めない版の編成データです（schema " + b.schema + "）");
    const G = fresh, done = [], skipped = [], meta = [];
    const used = [];
    (Array.isArray(b.team) ? b.team : []).slice(0, 3).forEach((m, i) => {
      const pos = i === 0 ? "主力" : "支援" + i;
      if (!m || typeof m !== "object") return;
      const c = findChar(m);
      if (!c) { skipped.push(`${pos}：巡遊者 ${who(m)} がこの計算ページにありません（${pos}は初期値のまま）`); return; }
      if (used.indexOf(c.id) >= 0) { skipped.push(`${pos}：${c.jp} は2回目なので入れませんでした`); return; }
      used.push(c.id);
      G.team[SLOTS[i]] = c.id;
      const cs = G.chars[c.id], got = [];
      if (m.copies != null) {
        const n = Math.round(+m.copies);
        if (n >= 0 && n <= 5) { cs.talent = n * 10; got.push(n + "凸"); } else skipped.push(`${c.jp}：凸数 ${m.copies} は 0〜5 ではありません`);
      }
      if (m.skills && typeof m.skills === "object") {
        const ks = ["basic", "main", "support", "ult"].filter(k => m.skills[k] != null && +m.skills[k] >= 1);
        ks.forEach(k => { cs.skillLv[k] = Math.round(+m.skills[k]); });
        if (ks.length) got.push("スキルLv");
      }
      if (Array.isArray(m.potentials) && m.potentials.length) {
        cs.pots2 = {};
        let n = 0;
        m.potentials.forEach(p => {
          const x = p && potName(c, p, i === 0 ? "main" : "support");
          if (!x || !x.name) { skipped.push(`${c.jp}：素質 ${(p && (p.id || p.name)) || "?"} が見つかりませんでした`); return; }
          cs.pots2[S.potKey(x.name)] = x.core ? (p.lv === 0 ? 0 : 1) : Math.max(0, Math.round(+(p.lv != null ? p.lv : 1)));
          n++;
        });
        if (n) got.push("素質 " + n + "件");
      }
      if (Array.isArray(m.emblems) && m.emblems.length) {
        let n = 0;
        m.emblems.forEach(e => {
          const i2 = e && cs.emb.findIndex(x => x.kind === e.kind);
          if (!e || i2 < 0) { skipped.push(`${c.jp}：徽章の種類 ${(e && e.kind) || "?"} が分かりません（triangle / circle / star）`); return; }
          const em = cs.emb[i2];
          em.slots.forEach(sl => { sl.k = ""; sl.cat = ""; delete sl.t; });
          (e.slots || []).slice(0, em.slots.length).forEach((s, j) => {
            const o = s && optOf(s.key);
            if (!o) { if (s && s.key) skipped.push(`${c.jp}：徽章の項目 ${s.key} がこの計算ページにありません`); return; }
            const q = qualOf(o, s);
            if (!q) { skipped.push(`${c.jp}：徽章 ${o.label} の値が分かりません`); return; }
            const sl = em.slots[j];
            sl.k = o.key; sl.q = q; sl.cat = catOfKey ? catOfKey(o.key) : "";
            if (o.type === "potLv") {
              const t = s.target && potName(c, typeof s.target === "string" && s.target.indexOf(":") < 0 ? { name: s.target } : { id: s.target }, "main");
              if (t && t.name) sl.t = t.name; else skipped.push(`${c.jp}：徽章 ${o.label} の対象の素質が分かりません`);
            }
            n++;
          });
          cs.embOn[i2] = 1;
        });
        if (n) got.push("徽章 " + n + "枠");
      }
      if (m.emblemTotal && typeof m.emblemTotal === "object" && !(Array.isArray(m.emblems) && m.emblems.length)) {
        // 1枠ずつが分からないので、徽章の枠は使わず（オフにする）、合計を「その他」の加算の欄に入れる
        cs.embOn = [0, 0, 0];
        let n = 0;
        Object.keys(m.emblemTotal).forEach(k => {
          const v = +m.emblemTotal[k], to = TOTAL_TO_ADD[k], o = optOf(k);
          if (!isFinite(v)) return;
          if (!to) { skipped.push(`${c.jp}：徽章の合計 ${o ? o.label : k} は、この計算ページの加算の欄に無いので入れませんでした`); return; }
          cs.add[to] = (cs.add[to] || 0) + v;
          n++;
        });
        if (n) got.push("徽章の合計 " + n + "項目（「その他」の加算の欄）");
      }
      if (m.level != null) meta.push(`${c.jp}：Lv${m.level}（この計算ページは Lv90 で計算します）`);
      done.push(`${pos}：${c.jp}${got.length ? "（" + got.join("・") + "）" : ""}`);
    });
    const rec = b.records && typeof b.records === "object" ? b.records : null;
    if (rec) {
      [["main", "lrMain", "メイン"], ["sub", "lrSub", "サブ"]].forEach(([key, path, label]) => {
        if (!Array.isArray(rec[key])) return;
        const ids = [];
        rec[key].slice(0, 3).forEach(r => {
          const x = r && findRec(r);
          if (!x) { skipped.push(`ロスレコ（${label}）：${(r && (r.id || r.name)) || "?"} がこの計算ページにありません`); return; }
          ids.push(x.id);
          // 突破: rank（1〜6。ゲーム内の表記は I〜VI。"IV" のようなローマ数字の文字でもよい）
          if (r.rank != null && S.lrRankOf) {
            const RM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 }, n = typeof r.rank === "string" && RM[r.rank.trim().toUpperCase()] || Math.round(+r.rank);
            const rk = S.lrRankOf(G, x.id);
            if (!(n >= 1 && n <= 6)) skipped.push(`ロスレコ ${x.name}：突破 ${r.rank} は 1〜6（I〜VI）ではありません`);
            else if (rk.can) { G.lrRank = G.lrRank || {}; G.lrRank[x.id] = n; }
            else meta.push(`ロスレコ ${x.name}：突破はこの計算ページでは固定です`);
          } else if (r.copies != null) skipped.push(`ロスレコ ${x.name}：凸数（copies）では突破を入れられません。rank（突破 I〜VI = 1〜6）で書いてください`);
        });
        G[path] = [0, 1, 2].map(i => ids[i] || "");
        if (ids.length) done.push(`ロスレコ（${label}）：` + ids.map(id => (window.LOSTRECORDS.find(y => y.id === id) || {}).name).join("・"));
      });
    }
    const mt = b.meta && typeof b.meta === "object" ? b.meta : null;
    if (mt) {
      if (mt.boss) {
        const e = findEnemy(mt.boss);
        if (e) { G.enemy = e.id; done.push("敵：" + e.name); } else meta.push("ボス：" + mt.boss + "（この計算ページの敵に無いので、敵は初期値のまま）");
      }
      if (mt.score != null) meta.push("スコア：" + Number(mt.score).toLocaleString("ja-JP"));
      if (mt.mvp != null) { const c = findChar({ trekker: mt.mvp, name: typeof mt.mvp === "string" ? mt.mvp : null }); meta.push("MVP：" + (c ? c.jp : mt.mvp)); }
      if (mt.date) meta.push("日付：" + mt.date);
    }
    if (b.from) meta.push("作ったサイト：" + b.from);
    if (!done.length) throw new Error("読み込めるものがありませんでした" + (skipped.length ? "（" + skipped[0] + "）" : ""));
    return { G, done, skipped, meta };
  };
  // URL の #b= 用: JSON を UTF-8 の Base64URL にしたもの → JSON の文字列
  S.buildFromHash = s => {
    const t = atob(String(s).replace(/-/g, "+").replace(/_/g, "/"));
    return new TextDecoder().decode(Uint8Array.from(t, ch => ch.charCodeAt(0)));
  };
})(window.SIM);
