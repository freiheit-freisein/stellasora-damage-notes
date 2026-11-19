// ゲームの素質プリセットコード（プリセット共有サイトの「ゲームで使えるコード」と同じ形）の読み込みと作成。
// 形: Base64 → 27バイト。主力・支援1・支援2の巡遊者ID（各32bit）→ 1人ごとに コア1bit×4 ＋ サブ3bit×12（Lv0〜6）
// 枠の順の素質は data/preset_map.js（プリセット共有サイトのデータから作った対応表）。結び付けは日本語名（巡遊者は c.jp、素質は data/potential_ja.js）。
// 英語名は両サイトで違うことがある（スグハなど）ので使わない。全角・半角の違い（「セイナ（原点）」と「セイナ(原点)」など）はそろえて比べる
// ゲームの決まり（ゲーム内で確認済み）: コアは1人ちょうど2つ・サブはLv0〜6・同じ巡遊者は2枠に入らない（同じ巡遊者のコードは、ゲームでエラーになる）
(function (S) {
  const BYTES = 27;
  const M = () => window.PRESET_MAP || { trekkers: {}, slots: {} };
  const read = (bytes, pos, n) => { let v = 0; for (let i = 0; i < n; i++, pos.i++) v = v * 2 + ((bytes[pos.i >> 3] >> (7 - (pos.i & 7))) & 1); return v; };
  const SLOTS = ["main", "s1", "s2"];
  const nz = t => String(t || "").normalize("NFKC").replace(/\s+/g, "");
  const chOfJa = ja => S.CH.find(c => nz(c.jp) === nz(ja));
  // 対応表の枠（素質の日本語名）→ 計算ノートの素質の英語名。日本語名が分からない素質は null（その枠は読み書きしない）
  const slotMap = (c, role) => {
    const ja = Object.keys(M().slots).find(k => nz(k) === nz(c.jp)), r = ja && M().slots[ja][role];
    if (!r) return null;
    const rev = {}; Object.entries((window.POTENTIAL_JA || {})[c.en] || {}).forEach(([en, j]) => { rev[nz(j)] = en; });
    const f = n => (n && rev[nz(n)]) || null;
    return { core: r.core.map(f), sub: r.sub.map(f) };
  };

  function decode(input) {
    const code = String(input || "").replace(/\s+/g, "");
    if (!code) throw new Error("プリセットコードが空です");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(code)) throw new Error("プリセットコードの形式が正しくありません");
    let bin;
    try { bin = atob(code); } catch (e) { throw new Error("プリセットコードの形式が正しくありません"); }
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    if (bytes.length !== BYTES) throw new Error("プリセットコードの長さが正しくありません");
    const pos = { i: 0 };
    const ids = [read(bytes, pos, 32), read(bytes, pos, 32), read(bytes, pos, 32)];
    const members = ids.map(id => ({ id, core: [0, 1, 2, 3].map(() => read(bytes, pos, 1)), sub: Array.from({ length: 12 }, () => read(bytes, pos, 3)) }));
    if (new Set(ids).size !== 3) throw new Error("同じ巡遊者が2回入っているコードです");
    members.forEach(m => {
      if (m.sub.some(lv => lv > 6)) throw new Error("素質のLvが正しくないコードです");
      if (m.core.reduce((a, b) => a + b, 0) > 2) throw new Error("コア素質が3つ以上あるコードです");
    });
    return members;
  }
  function encode(members) {
    const bytes = new Uint8Array(BYTES), pos = { i: 0 };
    const w = (n, v) => { for (let i = n - 1; i >= 0; i--, pos.i++) if (Math.floor(v / 2 ** i) % 2) bytes[pos.i >> 3] |= 1 << (7 - (pos.i & 7)); };
    members.forEach(m => w(32, m.id));
    members.forEach(m => { m.core.forEach(b => w(1, b)); m.sub.forEach(lv => w(3, lv)); });
    return btoa(String.fromCharCode(...bytes));
  }

  // ---- 徽章の受け渡し（素質ノート ⇄ 計算ノート。2026-11-20）----
  // URL の # のうしろの e=。[主力, 支援1, 支援2] の JSON を UTF-8 の base64url（+→-、/→_、末尾の = なし）にしたもの。
  // 1人分は12枠（初級4・中級4・上級4）、空きは null。1枠 = { k, q?, e?, t? }。t は素質レベル上昇の対象の素質の日本語名
  // （素質ノートの stellasora-site/docs/emblem-share.md と public/js/emblems.js の encodeEmblemsParam / decodeEmblemsParam と同じ形）
  // e（属性）: 計算ノートの徽章は巡遊者の属性で数えるので、書き出しは巡遊者の属性を入れ、読み込みでは使わない
  const KINDS = ["triangle", "circle", "star"];
  const LVQ = ["gold", "rainbow2", "rainbow3"];
  const isLvOpt = o => o.type === "skillLv" || o.type === "potLv";
  const optOf = k => (window.EMBLEM_OPTIONS || []).find(o => o.key === k);
  const b64u = s => { let bin = ""; new TextEncoder().encode(s).forEach(b => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = s => new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/-/g, "+").replace(/_/g, "/")), ch => ch.charCodeAt(0)));
  const potJa = (c, en) => ((window.POTENTIAL_JA || {})[c.en] || {})[en] || en;
  const potEn = (c, ja) => { const o = (window.POTENTIAL_JA || {})[c.en] || {}; return Object.keys(o).find(en => nz(o[en]) === nz(ja)) || null; };
  // 今の3人の徽章 → e= の値（徽章が1つも無ければ ""）。オフにしている徽章は書き出さない
  S.embEncode = function (G) {
    const out = SLOTS.map(k => {
      const id = G.team[k], c = S.CH.find(x => x.id === id), cs = G.chars[id];
      if (!c || !cs) return null;
      const slots = [];
      KINDS.forEach(kind => {
        const i = (cs.emb || []).findIndex(e => e.kind === kind), e = cs.emb[i];
        [0, 1, 2, 3].forEach(j => {
          const sl = e && cs.embOn[i] && e.slots[j], o = sl && sl.k && optOf(sl.k);
          if (!o) { slots.push(null); return; }
          const r = { k: o.key };
          const q = isLvOpt(o) && sl.q === "rainbow" ? "rainbow3" : sl.q;   // 前の入力の「虹」は +3
          if (q) r.q = q;
          if (o.key === "elemDmg" || o.key === "resPen") r.e = c.el;
          if (o.type === "potLv" && sl.t) r.t = potJa(c, sl.t);
          slots.push(r);
        });
      });
      return slots.some(Boolean) ? slots : null;
    });
    return out.some(Boolean) ? b64u(JSON.stringify(out)) : "";
  };
  // e= の値 → 3人の徽章の枠に入れる（G を書き換える）。戻り値は入れた巡遊者の名前。読めなければ Error
  S.embApply = function (G, param) {
    let raw;
    try { raw = JSON.parse(unb64u(param)); } catch (e) { throw new Error("徽章のデータを読めませんでした"); }
    if (!Array.isArray(raw)) throw new Error("徽章のデータを読めませんでした");
    const names = [];
    SLOTS.forEach((k, mi) => {
      const m = raw[mi], id = G.team[k], c = S.CH.find(x => x.id === id), cs = G.chars[id];
      if (!Array.isArray(m) || !c || !cs) return;
      KINDS.forEach((kind, b) => {
        const i = cs.emb.findIndex(e => e.kind === kind);
        if (i < 0) return;
        cs.emb[i].slots.forEach((sl, j) => {
          const r = m[b * 4 + j], o = r && typeof r === "object" && optOf(r.k);
          const ok = o && (!o.only || o.only === kind);
          sl.k = ok ? o.key : "";
          sl.cat = ok && S.contrib ? S.contrib.catOfKey(o.key) : "";
          sl.q = !ok ? "gold" : isLvOpt(o) ? (LVQ.indexOf(r.q) >= 0 ? r.q : "gold") : (o.tiers[r.q] != null ? r.q : "gold");
          const en = ok && o.type === "potLv" && typeof r.t === "string" ? potEn(c, r.t) : null;
          if (en) sl.t = en; else delete sl.t;
        });
        cs.embOn[i] = 1;
      });
      names.push(c.jp);
    });
    if (!names.length) throw new Error("徽章のデータに巡遊者の分がありませんでした");
    return names;
  };
  // URL の # のうしろ（p=…&e=… など）を分ける。プリセットコードは base64（+ / =）なので & で分けてよい
  S.hashParams = function (h) {
    const o = {};
    String(h || "").replace(/^#/, "").split("&").forEach(kv => { const i = kv.indexOf("="); if (i > 0) o[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); });
    return o;
  };

  // コード → 編成と素質Lv（G を書き換える）。戻り値は読み込んだ巡遊者の名前
  S.presetApply = function (G, input) {
    const members = decode(input);
    const names = [];
    members.forEach((m, i) => {
      const ja = M().trekkers[String(m.id)];
      const c = ja && chOfJa(ja);
      if (!c) throw new Error("この計算ページにない巡遊者のコードです（" + (ja || "ID " + m.id) + "）");
      const map = slotMap(c, i === 0 ? "main" : "support");
      if (!map) throw new Error("素質の対応表がない巡遊者です（" + c.jp + "）");
      G.team[SLOTS[i]] = c.id;
      const cs = G.chars[c.id];
      cs.pots2 = cs.pots2 || {};
      if (c.id === "willow") cs.pots = {};   // ウィローの前の入力（pots）が残っていると、読み替えで上書きされるため消す
      cs.sup = {};   // ナツカ・エレノアの前の入力（sup）も同じ
      map.core.forEach((name, k) => { if (name) cs.pots2[S.potKey(name)] = m.core[k] ? 1 : 0; });
      map.sub.forEach((name, k) => { if (name) cs.pots2[S.potKey(name)] = m.sub[k]; });
      names.push(c.jp);
    });
    return names;
  };
  // 今の編成と素質Lv → コード。ゲームで読めないものは作らない（日本語のメッセージの Error）
  S.presetMake = function (G) {
    const ids = SLOTS.map(k => G.team[k]);
    if (new Set(ids).size !== 3) throw new Error("同じ巡遊者が2回入っています（ゲームではエラーになるため作れません）");
    const idOf = c => Object.keys(M().trekkers).find(k => nz(M().trekkers[k]) === nz(c.jp));
    const members = ids.map((id, i) => {
      const c = S.CH.find(x => x.id === id), map = slotMap(c, i === 0 ? "main" : "support"), sid = idOf(c);
      if (!map || !sid) throw new Error("素質の対応表がない巡遊者です（" + c.jp + "）");
      const p2 = G.chars[id].pots2 || {};
      const core = map.core.map(name => (name && +(p2[S.potKey(name)] || 0) > 0) ? 1 : 0);
      const sub = map.sub.map(name => Math.round(+(name && p2[S.potKey(name)]) || 0));
      const role = i === 0 ? "主力" : "支援";
      if (core.reduce((a, b) => a + b, 0) !== 2) throw new Error(`${c.jp}（${role}）のコア素質を、ちょうど2つ取得にしてください（今は ${core.reduce((a, b) => a + b, 0)} つ）`);
      if (sub.some(lv => lv < 0 || lv > 6)) throw new Error(`${c.jp}（${role}）の素質のLvは 0〜6 にしてください（Lv7以上は徽章で上がる分なので、コードには入りません）`);
      return { id: +sid, core, sub };
    });
    const code = encode(members);
    const back = decode(code);   // 念のため読み戻して、同じになることを確かめる
    members.forEach((m, i) => { const b = back[i]; if (b.id !== m.id || b.core.join() !== m.core.join() || b.sub.join() !== m.sub.join()) throw new Error("コードを作れませんでした（読み戻しが一致しません）"); });
    return code;
  };
})(window.SIM);
