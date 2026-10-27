// リンクのカード画像（OGP）を作る: tools/og.svg → og.png（1200×630）
//   node tools/make_og.mjs
// 画像の変換は、プリセット共有サイトの開発用の依存（@resvg/resvg-js）を使う。文字はWindowsの Noto Sans JP・Bahnschrift
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(new URL('../../stellasora-site/package.json', import.meta.url));
const { Resvg } = require('@resvg/resvg-js');
const svg = fs.readFileSync(new URL('./og.svg', import.meta.url), 'utf8');
const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: false, fontFiles: ['C:/Windows/Fonts/NotoSansJP-Bold.ttf', 'C:/Windows/Fonts/bahnschrift.ttf'], defaultFontFamily: 'Noto Sans JP' },
}).render().asPng();
fs.writeFileSync(new URL('../og.png', import.meta.url), png);
console.log('og.png', png.length, 'bytes');
