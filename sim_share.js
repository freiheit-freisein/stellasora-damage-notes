// 共有コード: 入力（初期値との差分）を、辞書で番号に置き換えた小さなバイト列にして、（小さくなるなら）圧縮し、英数字にする。
// 先頭1バイト = 版(2bit)・圧縮の有無(1bit)・辞書の識別(5bit)、末尾1バイト = 誤字検出のチェック。
// 辞書は、データ（巡遊者・素質・ロスレコ・徽章・敵）から作る。データが変わると辞書が変わり、古いコードは「古い版」として弾く。
(function (S) {
  const VER = 2;   // 版1 = 巡遊者6人のころのコード（読み込みだけ対応）、版2 = 全員
  const crc8 = u8 => { let c = 0; for (let i = 0; i < u8.length; i++) { c ^= u8[i]; for (let k = 0; k < 8; k++) c = (c & 0x80) ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff; } return c; };
  const b64 = u8 => { let s = ""; u8.forEach(b => { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64 = t => { const s = atob(t.replace(/-/g, "+").replace(/_/g, "/")); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };

  // ---- 辞書 ----
  // legacy=true: 版1のコード用（自動で増やした巡遊者を含めない。巡遊者を増やす前と同じ辞書になる）
  function buildDict(def0, legacy) {
    const CH = (S.CH || []).filter(c => !legacy || !c.auto);
    const def = legacy ? Object.assign({}, def0, { chars: {} }) : def0;
    if (legacy) CH.forEach(c => { if (def0.chars[c.id]) def.chars[c.id] = def0.chars[c.id]; });
    const set = new Set();
    const walk = o => {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o && typeof o === "object") { Object.keys(o).forEach(k => { set.add(k); walk(o[k]); }); return; }
      if (typeof o === "string" && o) set.add(o);
    };
    walk(def);
    CH.forEach(c => { set.add(c.id); const t = TREKKERS.find(x => x.en === c.en); if (t && t.potentials) ["main", "support"].forEach(r => (t.potentials[r] || []).forEach(g => g.potentials.forEach(x => { set.add(x.name); set.add(S.potKey(x.name)); }))); });
    (S.ENEMIES || []).forEach(e => set.add(e.id));
    Object.keys(S.DEFAULT_ENEMY_TRAITS || {}).forEach(k => S.DEFAULT_ENEMY_TRAITS[k].forEach(t => set.add(t.id)));
    (window.LOSTRECORDS || []).forEach(r => set.add(r.id));
    (window.EMBLEM_OPTIONS || []).forEach(o => set.add(o.key));
    (window.EMBLEM_QUALITY || []).forEach(q => set.add(q[0]));
    ["rainbow2", "rainbow3", "triangle", "circle", "star", "heart1", "heart2", "heart3", "heart4", "heart5"].forEach(x => set.add(x));
    (S.NOTE_KEYS || []).forEach(n => set.add(n));
    Object.keys(S.LR_FX || {}).forEach(id => { const fx = S.LR_FX[id]; fx.core.forEach(it => set.add(id + ":c:" + it.id)); fx.assists.forEach(a => a.items.forEach(it => set.add(id + ":" + a.id + ":" + it.id))); });
    (S.LR_COUNTS || []).forEach(c => set.add(c.key));
    Object.keys(S.SKILL_FX || {}).forEach(id => S.SKILL_FX[id].forEach(fx => set.add(id + ":" + fx.id)));
    ["光", "水", "風", "火", "地", "闇"].forEach(x => set.add(x));
    // 並び順: 1バイトで済む位置に、よく出るものを置く（値は先頭16個、キーはその後）
    const VALS = ["noya", "firefly", "tilia", "willow", "nazuka", "eleanor", "stomp", "defense", "deep", "mirai", "negai", "yuuzu", "anaaki", "kakegae", "nitamono", "光"];
    const KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "team", "main", "s1", "s2", "recordLv", "enemy", "notes", "lrMain", "lrSub", "lrManual", "lrOn", "lrN", "skOn", "chars",
      "glimmer", "markDebuff", "heartCrit", "traits", "other", "directPriority", "enemyOv", "willowFrog", "willowUlt", "skillLv", "trustLv", "talent", "emb", "embOn", "add", "manual", "pots", "sup", "pots2", "pon", "pstk", "pcnt",
      "basic", "support", "ult", "hp", "atk", "critRate", "critDmg", "elem", "skill", "mark", "pen", "atkFlat", "hpFlat", "atkPct", "hpPct", "slots", "k", "q", "cat", "t", "kind", "name",
      "baseAtk", "baseHp", "elemEl", "basicDmg", "skillDmg", "mult", "taken", "res", "extra", "def", "weakMult", "markX", "lv", "on"].concat(S.NOTE_KEYS || []);
    const rest = Array.from(set).filter(x => VALS.indexOf(x) < 0 && KEYS.indexOf(x) < 0).sort();
    const seen = new Set();
    const list = VALS.concat(KEYS).concat(rest).filter(x => { if (seen.has(x)) return false; seen.add(x); return true; });
    const map = new Map(); list.forEach((s, i) => map.set(s, i));
    let h = 0; const joined = list.join("\n"); for (let i = 0; i < joined.length; i++) h = (h * 31 + joined.charCodeAt(i)) >>> 0;
    return { list, map, id: h & 31 };
  }

  // ---- 差分（初期値と違う所だけ）。配列は、長さが同じなら要素ごと（オブジェクトと同じ扱い）----
  const isObj = o => o && typeof o === "object";
  function diff(a, d) {
    if (isObj(a) && isObj(d) && Array.isArray(a) === Array.isArray(d) && (!Array.isArray(a) || a.length === d.length)) {
      const out = {};
      let any = false;
      Object.keys(a).forEach(k => { const r = diff(a[k], d[k]); if (r !== undefined) { out[k] = r; any = true; } });
      return any ? out : undefined;
    }
    return JSON.stringify(a) === JSON.stringify(d) ? undefined : a;
  }
  function apply(base, df) {
    if (df === undefined) return base;
    if (isObj(df) && !Array.isArray(df) && isObj(base)) {
      Object.keys(df).forEach(k => { base[k] = apply(base[k], df[k]); });
      return base;
    }
    if (isObj(df) && !Array.isArray(df)) { const o = {}; Object.keys(df).forEach(k => { o[k] = apply(undefined, df[k]); }); return o; }
    return df;
  }

  // ---- バイト列への書き出し・読み込み（varint）----
  // トークン: 下位3bit = 種類、上位 = 値。0:整数(zigzag) 1:小数(×10000のzigzag) 2:真偽 3:辞書の文字列 4:生の文字列(長さ+UTF-8) 5:オブジェクト(個数) 6:配列(個数) 7:null
  function enc(v, dict, out) {
    const w = (n) => { n = Math.floor(n); while (n >= 128) { out.push((n % 128) | 0x80); n = Math.floor(n / 128); } out.push(n); };
    const zz = n => (n < 0 ? -2 * n - 1 : 2 * n);
    const tok = (t, p) => w(p * 8 + t);
    if (v === null || v === undefined) tok(7, 0);
    else if (typeof v === "boolean") tok(2, v ? 1 : 0);
    else if (typeof v === "number") {
      if (Number.isInteger(v)) tok(0, zz(v));
      else { const r = Math.round(v * 10000); if (Math.abs(r / 10000 - v) < 1e-12) tok(1, zz(r)); else { const b = new TextEncoder().encode(String(v)); tok(4, b.length); b.forEach(x => out.push(x)); } }
    } else if (typeof v === "string") {
      if (dict.map.has(v)) tok(3, dict.map.get(v)); else { const b = new TextEncoder().encode(v); tok(4, b.length); b.forEach(x => out.push(x)); }
    } else if (Array.isArray(v)) { tok(6, v.length); v.forEach(x => enc(x, dict, out)); }
    else { const ks = Object.keys(v); tok(5, ks.length); ks.forEach(k => { if (dict.map.has(k)) w(dict.map.get(k)); else { const b = new TextEncoder().encode(k); w(dict.list.length + b.length); b.forEach(x => out.push(x)); } enc(v[k], dict, out); }); }
  }
  function dec(u8, pos, dict) {
    const r = () => { let n = 0, m = 1, b; do { b = u8[pos.i++]; if (b === undefined) throw new Error("end"); n += (b & 0x7f) * m; m *= 128; } while (b & 0x80); return n; };
    const un = z => (z % 2 ? -(z + 1) / 2 : z / 2);
    const t = r(), type = t % 8, p = Math.floor(t / 8);
    if (type === 0) return un(p);
    if (type === 1) return un(p) / 10000;
    if (type === 2) return !!p;
    if (type === 3) { if (p >= dict.list.length) throw new Error("dict"); return dict.list[p]; }
    if (type === 4) { const b = u8.slice(pos.i, pos.i + p); pos.i += p; const s = new TextDecoder().decode(b); return s; }
    if (type === 5) { const o = {}; for (let i = 0; i < p; i++) { const n = r(); let k; if (n < dict.list.length) k = dict.list[n]; else { const b = u8.slice(pos.i, pos.i + (n - dict.list.length)); pos.i += n - dict.list.length; k = new TextDecoder().decode(b); } o[k] = dec(u8, pos, dict); } return o; }
    if (type === 6) { const a = []; for (let i = 0; i < p; i++) a.push(dec(u8, pos, dict)); return a; }
    return null;
  }

  async function deflate(u8) {
    if (typeof CompressionStream === "undefined") return null;
    const cs = new CompressionStream("deflate-raw"); const wr = cs.writable.getWriter(); wr.write(u8); wr.close();
    return new Uint8Array(await new Response(cs.readable).arrayBuffer());
  }
  async function inflate(u8) {
    const ds = new DecompressionStream("deflate-raw"); const wr = ds.writable.getWriter(); wr.write(u8); wr.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }

  // G=今の入力、def=初期の入力、team=出力する巡遊者（編成の3人だけを出す）
  S.applyDiff = apply;   // 差分を、初期の入力に重ねる（プリセット用）
  S._shareDbg = { diff, enc, buildDict };
  S.shareEncode = async function (G, def, team) {
    const dict = buildDict(def);
    const g = JSON.parse(JSON.stringify(G)); delete g.enemyObj;
    const d = JSON.parse(JSON.stringify(def));
    Object.keys(g.chars).forEach(id => { if (team.indexOf(id) < 0) delete g.chars[id]; });
    Object.keys(d.chars).forEach(id => { if (team.indexOf(id) < 0) delete d.chars[id]; });
    const df = diff(g, d) || {};
    const raw = []; enc(df, dict, raw);
    let body = Uint8Array.from(raw), z = 0;
    const c = await deflate(body);
    if (c && c.length < body.length) { body = c; z = 1; }
    const out = new Uint8Array(body.length + 2);
    out[0] = (VER << 6) | (z << 5) | dict.id;
    out.set(body, 1);
    out[out.length - 1] = crc8(out.subarray(0, out.length - 1));
    return b64(out);
  };
  // 失敗したら、日本語のメッセージの Error を投げる
  S.shareDecode = async function (code, def) {
    let u8;
    try { u8 = unb64(code.trim()); } catch (e) { throw new Error("コードの形式が正しくありません"); }
    if (u8.length < 3) throw new Error("コードが短すぎます");
    if (crc8(u8.subarray(0, u8.length - 1)) !== u8[u8.length - 1]) throw new Error("コードが壊れています（コピーの漏れや誤字がないか確認してください）");
    const ver = u8[0] >> 6;
    if (ver !== VER && ver !== 1) throw new Error("このコードは、別の版のものです");
    const dict = buildDict(def, ver === 1);
    if ((u8[0] & 31) !== dict.id) throw new Error("このコードは、古い版のデータで作られています（データが更新されたため読み込めません）");
    let body = u8.subarray(1, u8.length - 1);
    if (u8[0] & 32) { try { body = await inflate(body); } catch (e) { throw new Error("コードが壊れています（圧縮の展開に失敗）"); } }
    let df;
    try { df = dec(body, { i: 0 }, dict); } catch (e) { throw new Error("コードが壊れています（内容を読めません）"); }
    return apply(JSON.parse(JSON.stringify(def)), df);
  };
})(window.SIM);
