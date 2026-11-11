# ロスレコのアシスト効果で、解放に必要な音符が「解放条件」（表の見出し）になっているものを直す。
#   python tools/fix_lr_notes.py   → data/lostrecords_jp.json の該当するアシスト効果の notes だけを書き換える
# Wikiの表は「Lv｜効果｜解放条件」の行のあとに、音符の名前の行が別にある形のページがある（取り込みのときに見出しを音符と読んでいた）。
# ほかの値（文章・必要数など）は触らない。そのあと python tools/build_lr.py で data/lr_auto.js を作り直す。
import json, re, sys, time
sys.path.insert(0, 'tools')
from import_lr_wiki import fetch, tables

P = 'data/lostrecords_jp.json'
d = json.load(open(P, encoding='utf-8'))
fixed = 0
for name, v in d.items():
    if not any(a.get('notes') == ['解放条件'] for a in v.get('assists', [])):
        continue
    h = fetch(name)
    found = []
    for head, rows in tables(h):
        if head != 'アシスト効果' or not rows:
            continue
        notes = []
        for i, r in enumerate(rows):
            if r and r[0] == 'Lv':
                tail = [c for c in r[2:] if c]
                if tail == ['解放条件'] and i + 1 < len(rows):
                    tail = [c for c in rows[i + 1] if c]
                notes = tail
                break
        found.append((rows[0][0], notes))
    for a in v['assists']:
        if a.get('notes') != ['解放条件']:
            continue
        hit = next((n for nm, n in found if nm == a['name'] and n and all(x.endswith('の音符') for x in n)), None)
        if hit:
            a['notes'] = hit; fixed += 1
        else:
            print('読めませんでした:', name, a['name'], file=sys.stderr)
    time.sleep(0.6)
json.dump(d, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(fixed, '件を直しました')
