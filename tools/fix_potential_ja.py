# data/potential_ja.js（素質の日本語名）を、日本語Wikiの名前（data/potentials_jp.json）で直す。
# プリセット共有サイトの名前データは、35組で「英語名 ↔ 日本語名」が入れ替わっている（例: テレサ Power Strike = スタン = 溜めの一撃）。
# 日本語Wikiの名前は、説明文の数値を英語Wikiの数値と照合して英語名に対応させてあるので、こちらを正とする。
import json

s = open('data/potential_ja.js', encoding='utf-8').read()
ja = json.loads(s[s.index('{'):s.rindex('}') + 1])
jp = json.load(open('data/potentials_jp.json', encoding='utf-8'))
n = 0
for t, m in ja.items():
    for role in ('main', 'support'):
        for en, v in ((jp.get(t) or {}).get(role) or {}).items():
            if v.get('ja') and en in m and m[en] != v['ja']:
                m[en] = v['ja']
                n += 1
lines = ['// 素質の日本語名（プリセット共有サイトの名前データより。入れ替わっていた35組は、日本語Wikiの名前で直した: tools/fix_potential_ja.py）。キー=巡遊者の英語名 → 素質の英語名。',
         'window.POTENTIAL_JA = {']
items = list(ja.items())
for i, (t, m) in enumerate(items):
    lines.append(json.dumps(t, ensure_ascii=False) + ': {')
    ks = list(m.items())
    for j, (en, v) in enumerate(ks):
        lines.append(json.dumps(en, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False) + (',' if j < len(ks) - 1 else ''))
    lines.append('}' + (',' if i < len(items) - 1 else ''))
lines.append('};')
open('data/potential_ja.js', 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('fixed', n)
