(function () {
  const $ = id => document.getElementById(id);
  const fmt = n => Math.round(n).toLocaleString("ja-JP");
  const pct = (n, d) => (n * 100).toFixed(d == null ? 1 : d).replace(/\.0+$/, "") + "%";
  const STORE = "stellasora-calc-state-v1";

  const clone = o => JSON.parse(JSON.stringify(o));
  const DEFAULT = {
    enemy: "stomp",
    emblems: [1, 1, 1],
    embCfg: clone(EMBLEM_DEFAULT_CFG),
    pots: {},
    teamBuffs: [],
    rankQ: "rainbow", potLv: 6,
    lr: ["tomo-no-natsuyasumi", "yurameku-hikari", "asagasumi"],
    lrSub: [],
    notes: { "集中の音符": 3, "器用の音符": 3 },
    ripple: 0,
    flatAtk: 0, flatHp: 0, sup: { nazuka: {}, eleanor: {} }, willowStk: 0, willowFrog: 0, willowUlt: 0, willowN: {}, bossLv: 1,
    stack: 0,
    r1: false, r2: false, r3: false, r5: false,
    frog: 0, ult: 0, tide: false, skill15: false, deep24: false,
    mark: false,
  };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && Array.isArray(s.emblems) && Array.isArray(s.lr)) return Object.assign(clone(DEFAULT), s);
    } catch (e) { /* 保存なしでも動く */ }
    return clone(DEFAULT);
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* 無視 */ }
  }
  const state = load();

  const STAT_LABEL = {
    atkPct: ["攻撃力", "pct"], spMainEff: ["主力SP獲得効率", "pct"], baseDef: ["基礎防御力", "flat"], defPct: ["防御力", "pct"],
    supportSkillLv: ["支援スキルLv上昇", "lv"], resPen: ["水属性耐性貫通", "flat"], skillCritRate: ["スキル会心率", "pct"],
    servantDmg: ["従者ダメージ", "pct"], basicDmg: ["通常攻撃ダメージ", "pct"], skillDmg: ["スキルダメージ", "pct"],
  };
  function slotText(sl) {
    if (sl.kind === "主力素質") return `素質「${sl.target}」Lv+${sl.potentialLevel}`;
    const l = STAT_LABEL[sl.stat] || [sl.stat, "pct"];
    const v = l[1] === "pct" ? pct(sl.value) : l[1] === "lv" ? "+" + sl.value : String(sl.value);
    return `${l[0]} ${v}`;
  }


  const BUFF_KINDS = [
    ["atkPct", "攻撃力%"], ["basicB", "通常攻撃ダメージ"], ["skillB", "スキルダメージ"], ["ultB", "必殺技ダメージ"],
    ["waterAdd", "水属性ダメージ"], ["taken", "敵の被ダメージ（別枠）"], ["critRate", "会心率"], ["critDmg", "会心ダメージ"],
  ];
  function buildTeamBuffs() {
    const box = $("teamBuffs");
    box.innerHTML = "";
    state.teamBuffs.forEach((tb, i) => {
      const row = document.createElement("div");
      row.style.cssText = "display:grid;grid-template-columns:24px 1fr 76px 32px;gap:6px;align-items:center;margin-bottom:6px";
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = !!tb.on;
      cb.addEventListener("change", () => { tb.on = cb.checked; update(); });
      const ks = document.createElement("select");
      BUFF_KINDS.forEach(([k, l]) => ks.add(new Option(l, k)));
      ks.value = tb.kind;
      ks.addEventListener("change", () => { tb.kind = ks.value; update(); });
      const v = document.createElement("input");
      v.type = "number"; v.step = "any"; v.value = tb.value; v.placeholder = "%";
      v.addEventListener("input", () => { tb.value = parseFloat(v.value) || 0; update(); });
      const del = document.createElement("button");
      del.type = "button"; del.textContent = "×"; del.setAttribute("aria-label", "削除");
      del.style.cssText = "min-height:36px;border-radius:8px;border:2px solid var(--border);background:var(--surface);cursor:pointer";
      del.addEventListener("click", () => { state.teamBuffs.splice(i, 1); buildTeamBuffs(); update(); });
      row.append(cb, ks, v, del);
      box.append(row);
    });
  }

  function buildInputs() {
    const sel = $("enemy");
    ENEMIES.forEach(e => sel.add(new Option(e.name, e.id)));
    sel.value = state.enemy;

    const emb = $("emblems");
    const bestQ = o => ["rainbow", "gold", "blue", "green"].find(q => o.tiers[q] != null);
    const fmtVal = (o, v) => v == null ? "—" : o.fmt === "pct" ? pct(v) : o.fmt === "lv" ? "+" + v : String(v);
    state.embCfg.forEach((e, i) => {
      const box = document.createElement("div");
      box.className = "emb";
      box.style.cssText = "display:block;cursor:default";
      const head = document.createElement("label");
      head.style.cssText = "display:flex;gap:10px;align-items:center;margin:0 0 6px;cursor:pointer";
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = state.emblems[i] !== 0;
      cb.addEventListener("change", () => { state.emblems[i] = cb.checked ? 1 : 0; update(); });
      const nm = document.createElement("b");
      nm.textContent = e.name;
      head.append(cb, nm);
      box.append(head);
      e.slots.forEach(sl => {
        const row = document.createElement("div");
        row.style.cssText = "display:grid;grid-template-columns:1fr 112px;gap:6px;margin-bottom:6px";
        const ks = document.createElement("select");
        EMBLEM_OPTIONS.filter(o => !o.only || o.only === e.kind).forEach(o => ks.add(new Option(o.label, o.key)));
        ks.value = sl.k;
        const qs = document.createElement("select");
        const fillQ = () => {
          const o = EMBLEM_OPTIONS.find(x => x.key === sl.k);
          qs.innerHTML = "";
          EMBLEM_QUALITY.forEach(([q, l]) => { if (o.tiers[q] != null) qs.add(new Option(l + " " + fmtVal(o, o.tiers[q]), q)); });
          if (o.tiers[sl.q] == null) sl.q = bestQ(o);
          qs.value = sl.q;
        };
        ks.addEventListener("change", () => { sl.k = ks.value; fillQ(); update(); });
        qs.addEventListener("change", () => { sl.q = qs.value; update(); });
        fillQ();
        row.append(ks, qs);
        box.append(row);
      });
      emb.append(box);
    });

    const pb = $("pots");
    const grp = { build1: "特化構築1（バブルガン）", build2: "特化構築2（メガホン）", common: "汎用素質" };
    ["build1", "build2", "common"].forEach(g => {
      const h = document.createElement("div");
      h.style.cssText = "font-weight:900;color:var(--indigo);margin:12px 0 4px";
      h.textContent = grp[g];
      pb.append(h);
      POTENTIALS.filter(p => p.grp === g).forEach(p => {
        const row = document.createElement("div");
        row.style.cssText = "display:grid;grid-template-columns:1fr 92px;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)";
        const info = document.createElement("div");
        info.innerHTML = `<b></b>${p.core ? ' <span class="badge ok">コア</span>' : ""}<br><small style="color:var(--muted)"></small>`;
        info.querySelector("b").textContent = p.jp;
        info.querySelector("small").textContent = p.text + (p.cond ? `（条件: ${p.cond}）` : "");
        const sel = document.createElement("select");
        if (p.core) { sel.add(new Option("未取得", 0)); sel.add(new Option("取得", 1)); }
        else { for (let l = 0; l <= 9; l++) sel.add(new Option(l === 0 ? "未取得" : "Lv" + l + (l > 6 ? "（徽章）" : ""), l)); }
        sel.value = String((state.pots || {})[p.id] || 0);
        sel.addEventListener("change", () => { state.pots = state.pots || {}; state.pots[p.id] = parseInt(sel.value, 10) || 0; update(); });
        row.append(info, sel);
        pb.append(row);
      });
    });
    buildSupPots();
    buildTeamBuffs();
    $("addBuff").addEventListener("click", () => { state.teamBuffs.push({ kind: "atkPct", value: 10, on: true }); buildTeamBuffs(); update(); });
    const rq = $("rankQ");
    EMBLEM_QUALITY.forEach(([q, l]) => rq.add(new Option(l, q)));
    rq.value = state.rankQ || "rainbow";
    rq.addEventListener("change", () => { state.rankQ = rq.value; update(); });
    const pl = $("potLv");
    for (let l = 1; l <= 9; l++) pl.add(new Option("Lv" + l + (l > 6 ? "（徽章込み・推定）" : ""), l));
    pl.value = String(state.potLv || 6);
    pl.addEventListener("change", () => { state.potLv = parseInt(pl.value, 10) || 6; update(); });

    const lrBox = $("lrs");
    for (let i = 0; i < 3; i++) {
      const l = document.createElement("label");
      l.textContent = `メイン #${i + 1}`;
      const s = document.createElement("select");
      s.add(new Option("なし", ""));
      LOSTRECORDS.forEach(r => s.add(new Option(`${r.name}（基礎攻撃 ${r.stats.baseAtk || 0}）`, r.id)));
      s.value = state.lr[i] || "";
      s.addEventListener("change", () => { state.lr[i] = s.value; update(); });
      l.append(s);
      lrBox.append(l);
    }
    state.lrSub = state.lrSub || [];
    for (let i = 0; i < 3; i++) {
      const l = document.createElement("label");
      l.textContent = `サブ #${i + 1}（基礎ステータス＋初期音符）`;
      const s = document.createElement("select");
      s.add(new Option("なし", ""));
      LOSTRECORDS.forEach(r => s.add(new Option(`${r.name}（基礎攻撃 ${r.stats.baseAtk || 0}）`, r.id)));
      s.value = state.lrSub[i] || "";
      s.addEventListener("change", () => { state.lrSub[i] = s.value; update(); });
      l.append(s);
      lrBox.append(l);
    }

    const nb = $("notes");
    Object.entries(NOTES).forEach(([name, n]) => {
      const w = document.createElement("div");
      const l = document.createElement("label");
      l.textContent = name;
      const inp = document.createElement("input");
      inp.type = "number"; inp.min = 0; inp.max = NOTE_MAX_LV; inp.step = 1;
      inp.value = state.notes[name] || 0;
      inp.addEventListener("input", () => {
        state.notes[name] = Math.min(Math.max(parseInt(inp.value, 10) || 0, 0), NOTE_MAX_LV);
        update();
      });
      const tip = document.createElement("div");
      tip.className = "tip"; tip.textContent = n.text.replace(/^1レベルごとに/, "1Lv: ");
      l.append(inp);
      w.append(l, tip);
      nb.append(w);
    });

    $("mark").checked = !!state.mark;
    $("mark").addEventListener("change", e => { state.mark = e.target.checked; update(); });
    ["r1", "r2", "r3", "r5"].forEach(k => {
      $(k).checked = !!state[k];
      $(k).addEventListener("change", e => { state[k] = e.target.checked; update(); });
    });
    $("deep24").checked = !!state.deep24;
    $("deep24").addEventListener("change", e => { state.deep24 = e.target.checked; update(); });
    $("skill15").checked = !!state.skill15;
    $("skill15").addEventListener("change", e => { state.skill15 = e.target.checked; update(); });
    $("tide").checked = !!state.tide;
    $("tide").addEventListener("change", e => { state.tide = e.target.checked; update(); });
    $("ult").value = String(state.ult || 0);
    $("ult").addEventListener("change", e => { state.ult = parseInt(e.target.value, 10) || 0; update(); });
    $("frog").value = String(state.frog || 0);
    $("frog").addEventListener("change", e => { state.frog = parseInt(e.target.value, 10) || 0; update(); });
    $("stack").value = String(state.stack || 0);
    $("stack").addEventListener("change", e => { state.stack = parseInt(e.target.value, 10) || 0; update(); });
    $("ripple").value = String(state.ripple || 0);
    $("ripple").addEventListener("change", e => { state.ripple = parseInt(e.target.value, 10) || 0; update(); });
    sel.addEventListener("change", () => { state.enemy = sel.value; update(); });
  }

  const cur = () => ({
    emblems: state.emblems, embCfg: state.embCfg, pots: state.pots, teamBuffs: state.teamBuffs, lr: state.lr.filter(Boolean), lrSub: (state.lrSub || []).filter(Boolean), notes: state.notes,
    flatAtk: state.flatAtk || 0, flatHp: state.flatHp || 0, sup: state.sup, willowStk: state.willowStk || 0, willowFrog: state.willowFrog || 0, willowUlt: state.willowUlt || 0, willowN: state.willowN, bossLv: state.bossLv || 1,
    enemy: state.enemy, ripple: state.ripple, stack: state.stack, mark: state.mark,
    r1: state.r1, r2: state.r2, r3: state.r3, r5: state.r5,
    frog: state.frog, ult: state.ult, tide: state.tide, skill15: state.skill15, deep24: state.deep24,
  });

  // ---- 比較用の記憶とビルド保存 ----
  const SNAP_KEY = "stellasora-calc-snap-v1";
  const BUILDS_KEY = "stellasora-calc-builds-v1";
  let snap = null;
  try { snap = JSON.parse(localStorage.getItem(SNAP_KEY)); } catch (e) { snap = null; }
  const readBuilds = () => { try { return JSON.parse(localStorage.getItem(BUILDS_KEY)) || {}; } catch (e) { return {}; } };
  const writeBuilds = b => { try { localStorage.setItem(BUILDS_KEY, JSON.stringify(b)); } catch (e) { /* 無視 */ } };
  const saveSnap = () => { try { localStorage.setItem(SNAP_KEY, JSON.stringify(snap)); } catch (e) { /* 無視 */ } };

  // 差分の表示（現在 − 記憶）
  function diffCell(now, base) {
    const d = now - base;
    if (Math.abs(d) < 0.5) return `<span class="note">±0</span>`;
    const p = base ? d / base * 100 : 0;
    const sign = d > 0 ? "+" : "−";
    return `<span class="${d > 0 ? "ok" : "ng"}">${sign}${fmt(Math.abs(d))}（${sign}${Math.abs(p).toFixed(1)}%）</span>`;
  }
  function snapRes() {
    return snap && snap.state ? compute(snap.state) : null;
  }

  function renderStats(res) {
    const sr = snapRes();
    const staticWater = res.lr.elemDmg + res.lr.coreElem + res.nt.water;
    const liveWater = res.waterAdd - staticWater;
    const dtxt = (now, base) => {
      const d = now - base;
      return Math.abs(d) < 0.5 ? "" : `<small class="${d > 0 ? "ok" : "ng"}" style="display:block;font-size:12px">${d > 0 ? "+" : "−"}${fmt(Math.abs(d))}</small>`;
    };
    const items = [
      ["HP", fmt(res.hp) + (sr ? dtxt(res.hp, sr.hp) : "")],
      ["攻撃力", fmt(Math.floor(res.atk)) + (sr ? dtxt(Math.floor(res.atk), Math.floor(sr.atk)) : "")],
      ["防御", fmt(Math.floor(res.def)) + (sr ? dtxt(Math.floor(res.def), Math.floor(sr.def)) : "")],
      ["水属性ダメージ", pct(1 + staticWater, 0) + (liveWater > 0 ? `（戦闘中 +${pct(liveWater, 0)}）` : "")],
      ["通常攻撃ダメージ加算", "+" + pct(res.bAdd.basic)],
      ["スキルダメージ加算", "+" + pct(res.bAdd.skill)],
      ["必殺技ダメージ加算", "+" + pct(res.bAdd.ult)],
      ["会心率 / 会心ダメージ", pct(res.critRate.basic) + " / " + pct(res.critDmg, 0)],
      ["敵側補正 D", res.D.toFixed(4) + (res.dApprox ? "（近似）" : "")],
    ];
    $("stats").innerHTML = items.map(([k, v]) => `<div class="stat"><span>${k}</span><b>${v}</b></div>`).join("");
  }

  function th(cols) { return "<tr>" + cols.map(c => `<th>${c}</th>`).join("") + "</tr>"; }
  function tr(cols, cls) { return `<tr${cls ? ` class="${cls}"` : ""}>` + cols.map(c => `<td>${c}</td>`).join("") + "</tr>"; }

  function renderDamage(res) {
    const mk = (st, mark) => compute(Object.assign({}, st, { mark }));
    const cs = cur();
    const set = { res, noMark: mk(cs, false), mark: mk(cs, true) };
    const base = snap && snap.state ? { res: compute(snap.state), noMark: mk(snap.state, false), mark: mk(snap.state, true) } : null;
    const head = ["スキル", "倍率", "1ヒット", "会心", "期待値", "回数", "合計(期待値)"];
    if (base) head.push("記憶時の合計", "差");
    const rows = [th(head)];
    mainSkills().forEach(s => {
      const d = hitDamage(res, s);
      const cols = [s.name, pct(s.mult, 0), fmt(d.normal), fmt(d.crit), fmt(d.avg), "×" + d.hits, fmt(d.avg * d.hits)];
      if (base) { const b0 = hitDamage(base.res, s); cols.push(fmt(b0.avg * b0.hits), diffCell(d.avg * d.hits, b0.avg * b0.hits)); }
      rows.push(tr(cols));
    });
    // 通常攻撃4連（バブルガン: 1撃目はマークなし、2撃目以降はマークあり）
    const sk = id => CHARACTERS[0].skills.find(x => x.id === id);
    const combo = (S, ids, markFrom2) => {
      let normal = 0, avg = 0;
      ids.forEach((id, i) => {
        const r = markFrom2 ? (i === 0 ? S.noMark : S.mark) : S.res;
        const d = hitDamage(r, sk(id));
        normal += d.normal; avg += d.avg;
      });
      return { normal, avg };
    };
    const bubIds = ["basic-bubble-1", "basic-bubble-2", "basic-bubble-3", "basic-bubble-4"];
    const megIds = ["basic-mega-1", "basic-mega-2", "basic-mega-3", "basic-mega-4"];
    [["バブルガン 4連（1撃目マークなし／2撃目以降マークあり）", bubIds, true], ["メガホン 4連", megIds, false]].forEach(([label, ids, m]) => {
      const c = combo(set, ids, m);
      const cols = [label, "", fmt(c.normal), "", fmt(c.avg), "", fmt(c.avg)];
      if (base) { const c0 = combo(base, ids, m); cols.push(fmt(c0.avg), diffCell(c.avg, c0.avg)); }
      rows.push(tr(cols, "sum"));
    });
    $("dmg").innerHTML = rows.join("");
    $("dmgWarn").innerHTML = res.dApprox
      ? `<div class="warn">この敵は耐性貫通なしの実測がないため、D をストンプクラブの係数で近似しています。</div>` : "";
    $("snapInfo").textContent = snap ? `比較の基準: ${snap.label}（ダメージ表と攻撃力などに差分を表示中）` : "比較の基準は未設定です。「現在の状態を記憶」を押すと、あとで変えたときの差分が出ます。";
  }

  function refreshBuilds() {
    const sel = $("buildSel");
    const names = Object.keys(readBuilds());
    sel.innerHTML = "";
    if (!names.length) sel.add(new Option("（保存したビルドはありません）", ""));
    names.forEach(n => sel.add(new Option(n, n)));
  }
  function initBuildTools() {
    refreshBuilds();
    $("buildSave").addEventListener("click", () => {
      const b = readBuilds();
      const name = $("buildName").value.trim() || "ビルド " + (Object.keys(b).length + 1);
      b[name] = clone(state);
      writeBuilds(b);
      refreshBuilds();
      $("buildSel").value = name;
      $("buildMsg").textContent = `「${name}」を保存しました。`;
    });
    $("buildLoad").addEventListener("click", () => {
      const b = readBuilds();
      const name = $("buildSel").value;
      if (!name || !b[name]) { $("buildMsg").textContent = "読み込むビルドを選んでください。"; return; }
      try { localStorage.setItem(STORE, JSON.stringify(b[name])); } catch (e) { /* 無視 */ }
      location.reload();
    });
    $("buildDel").addEventListener("click", () => {
      const b = readBuilds();
      const name = $("buildSel").value;
      if (!name || !b[name]) { $("buildMsg").textContent = "削除するビルドを選んでください。"; return; }
      delete b[name];
      writeBuilds(b);
      refreshBuilds();
      $("buildMsg").textContent = `「${name}」を削除しました。`;
    });
    ["flatAtk", "flatHp"].forEach(key => {
      $(key).addEventListener("input", () => { state[key] = Math.max(parseInt($(key).value, 10) || 0, 0); update(); });
    });
    $("loadTest").addEventListener("click", () => {
      const st = clone(DEFAULT), T = SAVED_BUILDS.test;
      st.lr = TEST_CTX.lr.slice(); st.lrSub = TEST_CTX.lrSub.slice(); st.notes = clone(T.notes); st.enemy = "stomp";
      st.flatAtk = T.flatAtk; st.flatHp = T.flatHp; st.emblems = [1, 0, 1]; st.willowStk = 0;
      st.pots = {};
      const wl = T.potentials.willow;
      POTENTIALS.forEach(p => { if (wl.cores.indexOf(p.jp) >= 0) st.pots[p.id] = 1; if (wl.levels[p.jp]) st.pots[p.id] = wl.levels[p.jp]; });
      st.sup = clone(TEST_CTX.sup);
      try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* 無視 */ }
      location.reload();
    });
    $("loadVerify").addEventListener("click", () => {
      const st = clone(DEFAULT);
      st.lr = TEST2_CTX.lr.slice(); st.lrSub = TEST2_CTX.lrSub.slice(); st.notes = clone(TEST2_CTX.notes);
      st.enemy = TEST2_CTX.enemy; st.flatAtk = TEST2_CTX.flatAtk || 0; st.flatHp = TEST2_CTX.flatHp || 0; st.emblems = [1, 0, 1]; st.pots = { midare: 1 };
      try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* 無視 */ }
      location.reload();
    });
    $("snapSet").addEventListener("click", () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      snap = { state: clone(cur()), label: ($("buildName").value.trim() || "記憶") + "（" + hh + "）" };
      saveSnap();
      update();
    });
    $("snapClear").addEventListener("click", () => {
      snap = null;
      try { localStorage.removeItem(SNAP_KEY); } catch (e) { /* 無視 */ }
      update();
    });
  }

  function renderVerify() {
    const rows = [th(["条件", "予測", "実測", "誤差", ""])];
    MEASUREMENTS.forEach(m => {
      const r = runMeasurement(m);
      const ok = Math.abs(r.diff) < 0.002;
      rows.push(tr([m.label, fmt(r.predicted), fmt(r.measured),
        `<span class="${ok ? "ok" : "ng"}">${(r.diff * 100).toFixed(2)}%</span>`,
        `<span class="badge${m.fit ? "" : " ok"}">${m.fit ? "D適合" : "予測"}</span>`]));
    });
    $("verify").innerHTML = rows.join("");
  }

  function highlight(rows, t) {
    const best = Math.max.apply(null, rows.map(r => r.g[t]));
    return r => {
      const x = r.g[t];
      const top = x > 1e-9 && Math.abs(x - best) < 1e-12;
      return `<td${top ? ' style="background:var(--surface-on);font-weight:900;color:var(--tag-text)"' : ""}>${x > 1e-9 ? "+" + (x * 100).toFixed(1) + "%" : "−"}</td>`;
    };
  }
  function renderRanking() {
    const q = state.rankQ || "rainbow";
    const keys = ["basicDmg", "skillDmg", "ultDmg", "elemDmg", "resPen", "critDmg", "critRate", "basicCritRate", "skillCritRate", "ultCritRate", "atkPct", "baseAtk"];
    const st = cur();
    const rows = [];
    keys.forEach(k => {
      const o = EMBLEM_OPTIONS.find(x => x.key === k);
      const v = o.tiers[q];
      if (v == null) return;
      rows.push({ label: o.label, txt: o.fmt === "pct" ? pct(v) : "+" + v, g: emblemGains(st, k, v) });
    });
    const hl = { basic: highlight(rows, "basic"), skill: highlight(rows, "skill"), ult: highlight(rows, "ult") };
    $("rank").innerHTML = th(["項目", "通常攻撃", "スキル", "必殺技"]) + rows.map(r =>
      `<tr><td>${r.label} <span class="note">${r.txt}</span></td>${hl.basic(r)}${hl.skill(r)}${hl.ult(r)}</tr>`).join("");
  }
  function renderPotRanking() {
    const L = state.potLv || 6;
    const st = cur();
    const rows = POTENTIALS.filter(p => p.effects.length).map(p => {
      const lv = p.core ? 1 : L;
      return { label: p.jp + (p.core ? "（コア）" : ""), txt: p.core ? "取得" : "Lv" + lv, g: potentialGains(st, p.id, lv) };
    });
    const hl = { basic: highlight(rows, "basic"), skill: highlight(rows, "skill"), ult: highlight(rows, "ult") };
    $("potRank").innerHTML = th(["素質", "通常攻撃", "スキル", "必殺技"]) + rows.map(r =>
      `<tr><td>${r.label} <span class="note">${r.txt}</span></td>${hl.basic(r)}${hl.skill(r)}${hl.ult(r)}</tr>`).join("");
  }


  // ---- タブ（入力側・結果側）----
  const TABS_L = [["party", "編成"], ["char", "キャラ"], ["lr", "ロスレコ"], ["pot", "素質"], ["notes", "音符"], ["emblem", "徽章"], ["battle", "敵・戦闘状態"], ["build", "ビルド"]];
  const TABS_R = [["dmg", "ダメージ"], ["rank", "ランキング"], ["verify", "実測・前提"]];
  const TAB_OF = { "ENEMY": "battle", "BATTLE STATE": "battle", "RESONANCE": "battle", "TEAM BUFFS": "battle", "EMBLEMS": "emblem", "LOST RECORDS": "lr",
    "NOTES": "notes", "POTENTIALS": "pot", "BUILD": "build", "STATUS": "dmg", "DAMAGE": "dmg", "POTENTIAL RANKING": "rank", "EMBLEM RANKING": "rank", "VERIFICATION": "verify", "SUPPORT VERIFICATION": "verify" };


  // ---- 編成タブ（主力・支援1・支援2）----
  const EMB_LABEL = { atkPct: "攻撃力", hpPct: "HP", defPct: "防御力", basicDmg: "通常攻撃ダメージ", skillDmg: "スキルダメージ", ultDmg: "必殺技ダメージ",
    elemDmg: "属性ダメージ", resPen: "属性耐性貫通", critDmg: "会心ダメージ", critRate: "会心率", basicCritRate: "通常攻撃会心率", skillCritRate: "スキル会心率",
    ultCritRate: "必殺技会心率", spSupport: "支援SP獲得効率", spMain: "主力SP獲得効率", baseAtk: "基礎攻撃力", baseHp: "基礎HP", baseDef: "基礎防御力",
    derivedDmg: "派生物ダメージ", derivedCritRate: "派生物会心率", servantDmg: "従者ダメージ", markDmg: "印ダメージ" };
  function embSummary(st) {
    return Object.entries(st.em).filter(([k]) => EMB_LABEL[k]).map(([k, v]) => {
      const o = EMBLEM_OPTIONS.find(x => x.key === k);
      return `${EMB_LABEL[k]} ${o && o.fmt === "flat" ? "+" + v : pct(v)}`;
    }).join(" ／ ");
  }
  function slotCardHTML(role, title, sub, rows, notes) {
    return `<div class="slot"><div class="slot-head"><span class="badge ok">${role}</span><b>${title}</b></div><div class="note" style="margin:0 0 6px">${sub}</div>
      <dl class="kv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>${notes ? `<div class="note">${notes}</div>` : ""}</div>`;
  }

  function buildSupPots() {
    state.sup = state.sup || { nazuka: {}, eleanor: {} };
    const box = $("supPots"); box.innerHTML = "";
    $("willowStk").value = state.willowStk || 0;
    state.willowN = state.willowN || {};
    ["cumulus", "saibotsu", "nanairo", "yurameku", "chakuchi", "beach"].forEach(k => {
      const el = $("wn_" + k);
      el.value = state.willowN[k] == null ? "" : state.willowN[k];
      el.addEventListener("input", () => { if (el.value === "") delete state.willowN[k]; else state.willowN[k] = Math.max(parseInt(el.value, 10) || 0, 0); update(); });
    });
    $("bossLv").value = state.bossLv || 1;
    $("bossLv").addEventListener("input", () => { state.bossLv = Math.max(parseInt($("bossLv").value, 10) || 1, 1); update(); });
    ["willowFrog", "willowUlt"].forEach(k => {
      $(k).value = state[k] || 0;
      $(k).addEventListener("input", () => { state[k] = Math.min(Math.max(parseInt($(k).value, 10) || 0, 0), 5); update(); });
    });
    $("willowStk").addEventListener("input", () => { state.willowStk = Math.min(Math.max(parseInt($("willowStk").value, 10) || 0, 0), 100); update(); });
    [["nazuka", "ナツカ"], ["eleanor", "エレノア"]].forEach(([key, label]) => {
      const h = document.createElement("div");
      h.style.cssText = "font-weight:900;color:var(--indigo);margin:12px 0 4px";
      h.textContent = label; box.append(h);
      state.sup[key] = state.sup[key] || {};
      SUP_POTS[key].forEach(p => {
        const cur = state.sup[key][p.id] = state.sup[key][p.id] || { lv: 0 };
        const row = document.createElement("div");
        row.style.cssText = "display:grid;grid-template-columns:1fr 92px 64px 72px;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)";
        const info = document.createElement("div");
        const maxStk = Math.max.apply(null, p.effects.map(e => e.stk || 1).concat([1]));
        info.innerHTML = `<b></b>${p.core ? ' <span class="badge ok">コア</span>' : ""}${p.verified ? ' <span class="badge ok">実測確認</span>' : ""}<br><small style="color:var(--muted)"></small>`;
        info.querySelector("b").textContent = p.jp + "（" + p.en + "）";
        info.querySelector("small").textContent = (p.note || "") + (p.verified ? " " + p.verified : "") + (p.effects.length ? "" : " 効果は未反映");
        const sel = document.createElement("select");
        if (p.core) { sel.add(new Option("未取得", 0)); sel.add(new Option("取得", 1)); }
        else for (let l = 0; l <= 9; l++) sel.add(new Option(l === 0 ? "未取得" : "Lv" + l + (l > 6 ? "（徽章）" : ""), l));
        sel.value = String(cur.lv || 0);
        sel.addEventListener("change", () => { cur.lv = parseInt(sel.value, 10) || 0; update(); });
        const on = document.createElement("label"); on.style.cssText = "display:flex;gap:4px;align-items:center;font-weight:400";
        const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = cur.on == null ? p.on !== false : !!cur.on;
        cb.addEventListener("change", () => { cur.on = cb.checked; update(); });
        on.append(cb, "反映");
        const stk = document.createElement("input"); stk.type = "number"; stk.min = 0; stk.step = 1; stk.placeholder = maxStk > 1 ? "重複数/" + maxStk : "";
        stk.disabled = maxStk <= 1; stk.value = cur.stk == null ? "" : cur.stk;
        stk.addEventListener("input", () => { if (stk.value === "") delete cur.stk; else cur.stk = Math.max(parseInt(stk.value, 10) || 0, 0); update(); });
        row.append(info, sel, on, stk);
        box.append(row);
      });
    });
  }

  function supportCtx() {
    return { lr: state.lr.filter(Boolean), lrSub: (state.lrSub || []).filter(Boolean), notes: state.notes, enemy: state.enemy, flatAtk: state.flatAtk || 0, flatHp: state.flatHp || 0, sup: state.sup, willowPots: state.pots, willowStk: (state.willowStk || 0) / 100, willowFrog: state.willowFrog || 0, willowUlt: state.willowUlt || 0, willowN: state.willowN, bossLv: state.bossLv || 1 };
  }
  function supportDmgHTML(key) {
    const d = supportDamage(key, supportCtx());
    const rows = d.rows.map(h => `<tr><td>${h.name}</td><td>${h.m}%</td><td>${fmt(h.normal)}</td><td>${fmt(h.crit)}</td><td>${fmt(h.avg)}</td><td>×${h.count}</td><td>${fmt(h.total)}</td></tr>`).join("");
    return `<div class="slot-dmg"><b>支援スキルのダメージ（Lv${PARTY[key].skillLv.support}）</b>
      <div class="note" style="margin:2px 0 6px">戦闘中の攻撃力 ${fmt(Math.floor(d.atk))}（ロスレコ・音符込み）／ W ${d.W.toFixed(3)} ／ 敵側補正 D ${d.D.toFixed(4)}${d.dApprox ? "（近似）" : ""} ／ 素質は未反映</div>
      <div class="tbl-wrap"><table><tr><th>ヒット</th><th>倍率</th><th>非会心</th><th>会心</th><th>期待値</th><th>回数</th><th>合計(期待値)</th></tr>${rows}</table></div></div>`;
  }
  function renderSupVerify() {
    const checks = [
      ["nazuka", "花びら", "normal", 18779, "Dの逆算に使用"], ["nazuka", "花びら", "crit", 28774, "Dの逆算に使用"],
      ["nazuka", "花のオーブ", "normal", 34119, "予測"], ["nazuka", "花の海", "normal", 34047, "予測"],
      ["eleanor", "跳びはね爆発", "normal", 16700, "予測"], ["eleanor", "ドローン", "normal", 12229, "予測"], ["eleanor", "ドローン", "crit", 18738, "予測"],
      ["nazuka", "花のオーブ", "normal", 64252, "テスト用", TEST_CTX], ["nazuka", "花びら", "normal", 78004, "テスト用", TEST_CTX], ["nazuka", "花びら", "crit", 124900, "テスト用", TEST_CTX],
      ["nazuka", "花の海", "normal", 171663, "テスト用", TEST_CTX],
      ["eleanor", "跳びはね爆発", "normal", 155043, "終盤", TEST_PLATEAU_CTX], ["eleanor", "跳びはね爆発", "crit", 285466, "終盤", TEST_PLATEAU_CTX],
      ["eleanor", "ドローン", "normal", 66836, "終盤", TEST_PLATEAU_CTX],
      ["nazuka", "花びら", "normal", 114626, "ウィロー1回目(当てはめ)", TEST_W1_CTX], ["nazuka", "花のオーブ", "normal", 100094, "ウィロー1回目(当てはめ)", TEST_W1_CTX],
      ["nazuka", "花びら", "normal", 145745, "ウィロー2回目(Lv4)", TEST_W2_CTX], ["nazuka", "花のオーブ", "normal", 127267, "ウィロー2回目(Lv4)", TEST_W2_CTX],
      ["nazuka", "花びら", "normal", 140564, "ウィロー3回目(当てはめ)", TEST_W3_CTX], ["nazuka", "花のオーブ", "normal", 122744, "ウィロー3回目(当てはめ)", TEST_W3_CTX],
    ];
    const cache = {};
    const rows = [th(["キャラ・ヒット", "予測", "実測", "誤差", ""])];
    checks.forEach(([key, kw, kind, meas, tag, ctx]) => {
      const ck = key + (ctx ? (ctx === TEST_CTX ? "T" : ctx === TEST_PLATEAU_CTX ? "P" : ctx === TEST_W1_CTX ? "W1" : ctx === TEST_W2_CTX ? "W2" : "W3") : "");
      cache[ck] = cache[ck] || supportDamage(key, ctx || TEST2_CTX);
      const row = cache[ck].rows.find(r => r.name.includes(kw));
      const pred = kind === "crit" ? row.crit : row.normal;
      const diff = pred / meas - 1;
      rows.push(tr([`${PARTY[key].jp} ${row.name}${kind === "crit" ? "（会心）" : ""}`, fmt(pred), fmt(meas),
        `<span class="${Math.abs(diff) < 0.002 ? "ok" : "ng"}">${(diff * 100).toFixed(2)}%</span>`,
        `<span class="badge${tag === "予測" ? " ok" : ""}">${tag}</span>`]));
    });
    $("supVerify").innerHTML = rows.join("");
  }

  function partyCardHTML() {
    const w = CHARACTERS[0], res = compute(cur());
    const will = slotCardHTML("主力", "ウィロー（水着）", "★5 ／ 水属性 ／ サポーター ／ Lv90 ／ 心相 5つ ／ 信頼 Lv25", [
      ["HP", fmt(res.hp)], ["攻撃力", fmt(Math.floor(res.atk))], ["防御", fmt(Math.floor(res.def))],
      ["水属性ダメージ", pct(1 + res.lr.elemDmg + res.lr.coreElem + res.nt.water, 0) + "（ロスレコ・音符込み）"],
      ["スキルLv", "通常10 ／ 主力10 ／ 支援10 ／ 必殺10"], ["徽章", embSummary({ em: res.em })],
    ], "ステータスは、ロスレコ・音符・徽章・素質の入力で変わります（上のタブで編集）。");
    const sup = key => {
      const m = PARTY[key], r = partyStatus(key), sk = m.skillLv;
      return slotCardHTML("支援", `${m.jp}`, `★${m.rarity} ／ ${m.element}属性 ／ ${m.role} ／ Lv${m.level} ／ 心相 ${m.talentUnlocked ? m.talentUnlocked + "段階" : "無凸"} ／ 信頼 Lv${m.trustLv}`, [
        ["HP", `${fmt(r.hp)} <small class="note">（基礎 ${fmt(r.hp - r.hpPlus)} +${fmt(r.hpPlus)}）</small>`],
        ["攻撃力", `${fmt(Math.floor(r.atk))} <small class="note">（基礎 ${fmt(Math.floor(r.atk - r.atkPlus))} +${fmt(Math.floor(r.atkPlus))}）</small>`],
        ["防御", fmt(Math.floor(r.def))],
        ["会心率 / 会心ダメージ", `${pct(r.critRate)} / ${pct(r.critDmg, 0)}`],
        [`${m.element}属性ダメージ`, pct(r.elemDmg, 0)], ["支援SP獲得効率", pct(r.spSupport)],
        ["スキルLv", `通常${sk.basic} ／ 主力${sk.main} ／ 支援${sk.support} ／ 必殺${sk.ult}`],
        ["信頼", `Lv${m.trustLv}（基礎HP +${fmt(m.trust.hp)}、基礎攻撃 +${m.trust.atk}、攻撃力 +${pct(m.trust.atkPct, 0)}）`],
        ["徽章（合計）", embSummary(r)],
      ], "ゲーム内のステータス画面と一致（HP・攻撃・属性ダメージ・支援SP）。") + supportDmgHTML(key);
    };
    return `<div class="card" data-tab="party"><h2><span class="en">PARTY</span>編成（主力 1 ＋ 支援 2）</h2><hr class="dotted-rule">
      <div class="party">${will}${sup("nazuka")}${sup("eleanor")}</div>
      <div class="note">支援スキルのダメージは、実測と一致した式で計算しています（素質・心相の戦闘中効果・印ダメージは未反映）。印を付与するだけ・発動するだけの編成は、印ダメージを発動不可として扱う予定です。</div></div>`;
  }

  function charCardHTML() {
    const c = CHARACTERS[0], r = c.resonance.total, t = c.trust;
    return `<div class="card" data-tab="char"><h2><span class="en">TREKKER</span>キャラクター（Lv90・固定）</h2><hr class="dotted-rule">
      <dl class="kv">
        <dt>ウィロー（水着）</dt><dd>★5 ／ 水属性 ／ サポーター ／ Lv${c.level}</dd>
        <dt>基礎ステータス</dt><dd>HP ${fmt(c.statsBase.hp)} ／ 攻撃 ${fmt(c.statsBase.atk)} ／ 防御 ${fmt(c.statsBase.def)}</dd>
        <dt>スキルLv</dt><dd>通常攻撃 Lv10 ／ 主力スキル Lv10 ／ 支援スキル Lv10 ／ 必殺技 Lv10（上限）</dd>
        <dt>心相（凸）</dt><dd>5つすべて解放 10/10。基礎攻撃 +${r.baseAtk}、基礎防御 +${r.baseDef}、基礎HP +${fmt(r.baseHp)}、スキルダメージ +${pct(r.skillDmg, 0)}、必殺技ダメージ +${pct(r.ultDmg, 0)}。戦闘中の効果は「敵・戦闘状態」タブ</dd>
        <dt>信頼</dt><dd>Lv25。基礎HP +${fmt(t.baseHp)}、基礎攻撃 +${t.baseAtk}、攻撃力 +${pct(t.atkPct, 0)}</dd>
      </dl>
      <div class="note">いまはウィロー（水着）固定の計算です。スキルレベルや心相を変えたい場合は、あとで編集できるようにします。</div></div>`;
  }

  function refreshParty() {
    const old = document.querySelector('#colL .card[data-tab="party"]');
    if (!old) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = partyCardHTML();
    const nu = tmp.firstElementChild;
    nu.hidden = old.hidden;
    old.replaceWith(nu);
  }

  function setupTabs() {
    const colL = $("colL"), colR = $("colR");
    colL.querySelector("#tabsL").insertAdjacentHTML("afterend", partyCardHTML() + charCardHTML());
    // ビルドの保存カードは入力側のタブへ移す
    const buildCard = [...colR.querySelectorAll(".card")].find(c => (c.querySelector("h2 .en") || {}).textContent === "BUILD");
    if (buildCard) colL.append(buildCard);
    // 各カードを所属タブに振り分ける
    [...colL.querySelectorAll(".card"), ...colR.querySelectorAll(".card")].forEach(card => {
      if (card.dataset.tab) return;
      const en = card.querySelector("h2 .en");
      if (en && TAB_OF[en.textContent.trim()]) card.dataset.tab = TAB_OF[en.textContent.trim()];
      else if (card.querySelector("details")) card.dataset.tab = "verify";
    });
    const group = (bar, list, root, key) => {
      let cur = list[0][0];
      try { cur = localStorage.getItem(key) || cur; } catch (e) { /* 無視 */ }
      if (!list.some(x => x[0] === cur)) cur = list[0][0];
      const show = id => {
        root.querySelectorAll(".card[data-tab]").forEach(cd => { cd.hidden = cd.dataset.tab !== id; });
        bar.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.id === id)));
        try { localStorage.setItem(key, id); } catch (e) { /* 無視 */ }
      };
      list.forEach(([id, label]) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "tab"; b.dataset.id = id; b.textContent = label; b.setAttribute("role", "tab");
        b.addEventListener("click", () => show(id));
        bar.append(b);
      });
      show(cur);
    };
    group($("tabsL"), TABS_L, colL, "stellasora-calc-tab-l");
    group($("tabsR"), TABS_R, colR, "stellasora-calc-tab-r");
  }

  // 画面下の概要バー（どのタブにいても結果が見える）
  function renderQuick(res) {
    const mk = (st, mark) => compute(Object.assign({}, st, { mark }));
    const sk = id => CHARACTERS[0].skills.find(x => x.id === id);
    const total = (S, ids, m2) => ids.reduce((a, id, i) => a + hitDamage(m2 ? (i === 0 ? S.noMark : S.mark) : S.res, sk(id)).avg, 0);
    const mkSet = st => ({ res: compute(st), noMark: mk(st, false), mark: mk(st, true) });
    const cs = cur(), now = mkSet(cs), base = snap && snap.state ? mkSet(snap.state) : null;
    const items = [
      ["バブルガン4連", ids => total(now, ids, true), ids => base && total(base, ids, true), ["basic-bubble-1", "basic-bubble-2", "basic-bubble-3", "basic-bubble-4"]],
      ["メガホン4連", ids => total(now, ids, false), ids => base && total(base, ids, false), ["basic-mega-1", "basic-mega-2", "basic-mega-3", "basic-mega-4"]],
      ["フロッグ着地", ids => total(now, ids, false), ids => base && total(base, ids, false), ["main-frog"]],
      ["必殺技（連撃×7＋フィニッシュ）", ids => total(now, ["ult-hit"], false) * 7 + total(now, ["ult-finish"], false), ids => base && (total(base, ["ult-hit"], false) * 7 + total(base, ["ult-finish"], false)), []],
    ];
    $("quick").innerHTML = items.map(([label, f, g, ids]) => {
      const v = f(ids), b = g(ids);
      const d = b ? (v - b) / b * 100 : null;
      const dt = d == null || Math.abs(d) < 0.05 ? "" : ` <span class="${d > 0 ? "up" : "down"}">${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}%</span>`;
      return `<span>${label} <b>${fmt(v)}</b>${dt}</span>`;
    }).join("");
  }

  function update() {
    save();
    [["flatAtk", "flatAtk"], ["flatHp", "flatHp"]].forEach(([id, key]) => {
      const el = $(id);
      if (el && document.activeElement !== el) el.value = state[key] || 0;
    });
    const e = ENEMIES.find(x => x.id === state.enemy);
    $("enemyNote").textContent = e ? `D=${e.D}${e.source ? "（" + e.source + "）" : ""}` : "";
    const res = compute(cur());
    $("assistState").textContent = res.assistOn.length ? "発動中のアシスト効果: " + res.assistOn.join("、") : "発動中のアシスト効果: なし（音符のレベルが解放条件に届いていません）";
    renderStats(res);
    renderDamage(res);
    renderRanking();
    renderPotRanking();
    renderQuick(res);
    refreshParty();
  }

  buildInputs();
  renderSupVerify();
  initBuildTools();
  setupTabs();
  renderVerify();
  update();
})();
