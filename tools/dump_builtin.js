// 計算ツールに組み込みの素質の効果を、JSONで出す（今は、セイナ（原点）・ホタル・ティリアの3人だけ。ウィロー・ナツカ・エレノアは表がない）。
const vm = require('vm'), fs = require('fs');
global.window = global;
global.localStorage = { getItem() { return null; } };
for (const f of ['data/trekkers.js', 'data.js', 'data_sup.js', 'record_level.js', 'calc.js', 'sim_data.js', 'sim_pots.js']) vm.runInThisContext(fs.readFileSync(f, 'utf8'), { filename: f });
const out = {};
SIM.CH.forEach(c => { if (SIM.POT_SPEC[c.id]) out[c.en] = SIM.POT_SPEC[c.id]; });
process.stdout.write(JSON.stringify(out));
