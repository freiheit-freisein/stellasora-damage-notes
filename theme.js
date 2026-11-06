/*
  巡遊者ノート 共通：表示の色（ライト・ダーク）の切り替え。最初はライト
  トップ・計算ノート・素質ノートで同じファイルを使う（変えるときは3つともそろえる）。

  使い方:
  - <head> の中、CSS より前に <script src="theme.js"></script> を置く（読み込み前に色を決めて、白く光るのを防ぐ）。
  - 切り替えボタンは、.notes-bar .wrap か、data-theme-switch の付いた要素に自動で入る。
    あとから帯を作るページは、作ったあとに TNTheme.mount(要素) を呼ぶ。
  - 選んだ色は cookie（.stella-tool.com 全体）に覚えるので、3つのサイトで共通になる。
  - 色そのものは各サイトの CSS の :root[data-theme="dark"] で決める。端末のダーク設定には合わせない（ユーザーの指定）。
*/
(function () {
  var KEY = 'tn-theme';
  var MODES = ['light', 'dark'];

  function read() {
    var m = document.cookie.match(/(?:^|;\s*)tn-theme=(light|dark)/);
    if (m) return m[1];
    try { var v = localStorage.getItem(KEY); if (MODES.indexOf(v) >= 0) return v; } catch (e) {}
    return 'light';
  }
  function save(mode) {
    var domain = /(^|\.)stella-tool\.com$/.test(location.hostname) ? '; domain=.stella-tool.com' : '';
    document.cookie = KEY + '=' + mode + '; path=/; max-age=31536000; SameSite=Lax' + domain;
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }
  // <html data-theme="light|dark"> を入れる（CSS はこれだけを見る）
  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
  }

  var current = read();
  apply(current);

  var ICON = {
    light: '<circle cx="12" cy="12" r="4.5"/><path d="M11 1.5h2v3.5h-2zM11 19h2v3.5h-2zM1.5 11H5v2H1.5zM19 11h3.5v2H19zM4.2 5.6l1.4-1.4 2.5 2.5-1.4 1.4zM15.9 17.3l1.4-1.4 2.5 2.5-1.4 1.4zM4.2 18.4l2.5-2.5 1.4 1.4-2.5 2.5zM15.9 6.7l2.5-2.5 1.4 1.4-2.5 2.5z"/>',
    dark: '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/>'
  };
  function label(mode) {
    var en = (document.documentElement.lang || '').indexOf('en') === 0;
    var L = en ? { light: 'Light', dark: 'Dark', group: 'Color theme' }
               : { light: 'ライト', dark: 'ダーク', group: '表示の色' };
    return L[mode];
  }

  function injectStyle() {
    if (document.getElementById('tn-theme-style')) return;
    var s = document.createElement('style');
    s.id = 'tn-theme-style';
    s.textContent =
      '.tn-theme{flex:none;display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:999px;background:rgba(127,133,180,.22)}' +
      '.tn-theme button{display:inline-grid;place-items:center;width:28px;height:24px;padding:0;border:0;border-radius:999px;background:transparent;color:inherit;cursor:pointer}' +
      '.tn-theme button svg{width:15px;height:15px;fill:currentColor}' +
      '.tn-theme button:hover{opacity:.8}' +
      '.tn-theme button[aria-pressed="true"]{background:var(--indigo-fill,#4B5082);color:#fff;cursor:default}' +
      '.notes-bar .tn-theme{margin-left:auto;color:#C5CAE3;background:rgba(255,255,255,.12)}' +
      '.notes-bar .tn-theme button[aria-pressed="true"]{background:#fff;color:#1E2250}';
    document.head.appendChild(s);
  }

  function render(box) {
    box.innerHTML = MODES.map(function (m) {
      return '<button type="button" data-mode="' + m + '" aria-pressed="' + (m === current) + '" title="' + label(m) + '" aria-label="' + label(m) + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[m] + '</svg></button>';
    }).join('');
    box.setAttribute('aria-label', label('group'));
  }
  var boxes = [];
  function mount(target) {
    if (!target || target.querySelector('.tn-theme')) return;
    injectStyle();
    var box = document.createElement('div');
    box.className = 'tn-theme';
    box.setAttribute('role', 'group');
    render(box);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mode]');
      if (!b) return;
      set(b.getAttribute('data-mode'));
    });
    target.appendChild(box);
    boxes.push(box);
  }
  function set(mode) {
    if (MODES.indexOf(mode) < 0) return;
    current = mode;
    save(mode);
    apply(mode);
    boxes.forEach(render);
  }
  function autoMount() {
    var list = document.querySelectorAll('.notes-bar .wrap, [data-theme-switch]');
    for (var i = 0; i < list.length; i++) mount(list[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount);
  else autoMount();

  window.TNTheme = { mount: mount, set: set, get: function () { return current; } };
})();
