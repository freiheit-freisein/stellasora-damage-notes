# プリセット共有サイトと共有する、素質のデータを作る。
#   出力: data/shared/potentials.json（スキーマは docs/shared-data.md）
# キー: trekker_id（プリセット共有サイトの巡遊者ID）＋ role（main/support）＋ name_en（英語名）。サイトの potentials テーブルと同じ。
# 入力: プリセット共有サイトのAPI（巡遊者ID・役割・種類・枠・日本語名）／data/trekkers.json（英語Wikiの数値）／
#       data/potentials_jp.json（日本語Wikiの説明文）／data/spec_user.js（確認済みの効果）／data/spec_draft.js（自動の下書き）
import json, time, datetime, subprocess, urllib.request

SITE = 'https://preset.stella-tool.com'


def js(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('window.'):].split('=', 1)[1].strip().rstrip(';').strip()) if 'window.' in s else json.loads(s)


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return json.load(urllib.request.urlopen(req, timeout=60))


tk = json.load(open('data/trekkers.json', encoding='utf-8'))
tk = tk if isinstance(tk, list) else tk.get('trekkers', tk)
en_by = {t['en']: t for t in tk}
jp = json.load(open('data/potentials_jp.json', encoding='utf-8'))
user = js('data/spec_user.js')
draft = js('data/spec_draft.js')

builtin = json.loads(subprocess.run(['node', 'tools/dump_builtin.js'], capture_output=True, text=True, encoding='utf-8').stdout or '{}')
site_tk = get(SITE + '/api/trekkers')
ids = [t['id'] for t in site_tk]
rows = []
for i in range(0, len(ids), 10):
    rows += get(SITE + '/api/potentials?ids=' + ','.join(map(str, ids[i:i + 10])))
    time.sleep(0.5)
id_of = {t['name_en']: t['id'] for t in site_tk}
ja_of = {t['name_en']: t['name_ja'] for t in site_tk}

trekkers = []
for t in site_tk:
    w = en_by.get(t['name_en'])
    trekkers.append({'id': t['id'], 'en': t['name_en'], 'ja': t['name_ja'], 'element': (w or {}).get('element'), 'rarity': (w or {}).get('rarity'),
                     'role': (w or {}).get('role')})

by_id = {t['id']: t['name_en'] for t in site_tk}
pots = []
for r in rows:
    en = by_id[r['trekker_id']]
    w = en_by.get(en)
    wp = None
    if w:
        for g in w['potentials'].get(r['role'], []):
            for p in g['potentials']:
                if p['name'] == r['name_en']:
                    wp = p
    j = ((jp.get(en) or {}).get(r['role']) or {}).get(r['name_en'])
    u = (user.get(en) or {}).get(r['name_en'])
    d = ((draft.get(en) or {}).get(r['role']) or {}).get(r['name_en'])
    b = (builtin.get(en) or {}).get(r['name_en'])
    if u and not u.get('draft'):
        eff = {'status': 'confirmed', 'e': u.get('e', []), 'off': bool(u.get('off')), 'note': u.get('note'), 'verified': u.get('verified')}
    elif b and not u:
        eff = {'status': 'builtin', 'e': b.get('e', []), 'off': bool(b.get('off')), 'note': b.get('txt')}
    elif u:
        eff = {'status': 'draft', 'e': u.get('e', []), 'off': bool(u.get('off')), 'note': u.get('note')}
    elif d:
        eff = {'status': 'review' if d.get('review') else ('none' if d.get('none') else 'draft'), 'e': d.get('e', []), 'note': d.get('note'), 'unclassified': d.get('unk')}
    else:
        eff = {'status': 'unclassified', 'e': []}
    eff = {k: v for k, v in eff.items() if v not in (None, False, [])} | {'e': eff.get('e', [])}
    pots.append({
        'trekker_id': r['trekker_id'], 'role': r['role'], 'kind': r['kind'], 'grp': r['grp'], 'ui_order': r['ui_order'], 'slot': r['slot'],
        'name_en': r['name_en'], 'name_ja': r['name_ja'],
        'type': (wp or {}).get('type'),
        'text_ja': (j or {}).get('text'),
        'terms_ja': (j or {}).get('terms'),
        'text_en': (wp or {}).get('text'),
        'nums_en': (wp or {}).get('nums'),
        'effects': eff,
    })

out = {'schema': 1, 'generated': datetime.date.today().isoformat(), 'source': {'site': SITE, 'wiki_ja': 'https://stellasora.wikiru.jp/', 'wiki_en': 'https://stellasora.miraheze.org/'},
       'trekkers': trekkers, 'potentials': pots}
import os
os.makedirs('data/shared', exist_ok=True)
json.dump(out, open('data/shared/potentials.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
from collections import Counter
print(len(trekkers), 'trekkers', len(pots), 'potentials', dict(Counter(p['effects']['status'] for p in pots)))
