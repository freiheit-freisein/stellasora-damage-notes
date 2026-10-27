// ゲームの素質プリセットコード（プリセット共有サイトの「ゲームで使えるコード」と同じ形）の読み込みと作成。
// 形: Base64 → 27バイト。主力・支援1・支援2の巡遊者ID（各32bit）→ 1人ごとに コア1bit×4 ＋ サブ3bit×12（Lv0〜6）
// 枠の順の素質は data/preset_map.js（プリセット共有サイトのデータから作った対応表）。
// ゲームの決まり（ゲーム内で確認済み）: コアは1人ちょうど2つ・サブはLv0〜6・同じ巡遊者は2枠に入らない（同じ巡遊者のコードは、ゲームでエラーになる）
(function (S) {
  const BYTES = 27;
  const M = () => window.PRESET_MAP || { trekkers: {}, slots: {} };
  const read = (bytes, pos, n) => { let v = 0; for (let i = 0; i < n; i++, pos.i++) v = v * 2 + ((bytes[pos.i >> 3] >> (7 - (pos.i & 7))) & 1); return v; };
  const SLOTS = ["main", "s1", "s2"];

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

  // コード → 編成と素質Lv（G を書き換える）。戻り値は読み込んだ巡遊者の名前
  S.presetApply = function (G, input) {
    const members = decode(input);
    const names = [];
    members.forEach((m, i) => {
      const en = M().trekkers[String(m.id)];
      const c = en && S.CH.find(x => x.en === en);
      if (!c) throw new Error("この計算ページにない巡遊者のコードです（ID " + m.id + "）");
      const map = (M().slots[en] || {})[i === 0 ? "main" : "support"];
      if (!map) throw new Error("素質の対応表がない巡遊者です（" + c.jp + "）");
      G.team[SLOTS[i]] = c.id;
      const cs = G.chars[c.id];
      cs.pots2 = cs.pots2 || {};
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
    const idOf = en => Object.keys(M().trekkers).find(k => M().trekkers[k] === en);
    const members = ids.map((id, i) => {
      const c = S.CH.find(x => x.id === id), map = (M().slots[c.en] || {})[i === 0 ? "main" : "support"], sid = idOf(c.en);
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
