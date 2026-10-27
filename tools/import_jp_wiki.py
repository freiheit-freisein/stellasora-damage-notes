# 日本語Wiki（wikiru）の素質の説明文を、巡遊者ごとに取り込む。ゲーム内の日本語の文章と数値に近いため、英語Wikiより優先して使う。
# 使い方: python tools/import_jp_wiki.py  → data/potentials_jp.json を作る
import json, re, sys, time, urllib.parse, urllib.request, html as H

def js(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])

tk = json.load(open('data/trekkers.json', encoding='utf-8'))
tk = tk if isinstance(tk, list) else tk.get('trekkers', tk)
tja = js('data/trekker_ja.js'); pja = js('data/potential_ja.js')

def fetch(name):
    url = 'https://stellasora.wikiru.jp/?' + urllib.parse.quote(name)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=40).read().decode('utf-8', 'replace')

def clean(s):
    s = re.sub(r'<br[^>]*>', '\n', s)
    s = re.sub(r'<img[^>]*>', '', s)
    s = re.sub(r'<[^>]+>', '', s)
    return H.unescape(s).strip()

def parse(page):
    rows = []
    for tr in re.findall(r'<tr>(.*?)</tr>', page, flags=re.S):
        ths = re.findall(r'<th[^>]*>(.*?)</th>', tr, flags=re.S)
        if len(ths) != 3: continue
        label, name, desc = clean(ths[0]), clean(ths[1]), ths[2]
        nums = [clean(x) for x in re.findall(r'<span style="color:#[0-9a-fA-F]{6}">(.*?)</span>', desc, flags=re.S)]
        rows.append({'label': label, 'ja': name, 'text': clean(desc), 'nums': nums})
    return rows

out = {}; report = []
for t in tk:
    ja = tja.get(t['en'])
    pname = ja.replace('（', '(').replace('）', ')')   # ページ名のかっこは半角
    try:
        page = fetch(pname)
    except Exception as e:
        report.append((t['en'], ja, 'fetch失敗 ' + str(e)[:40])); continue
    rows = parse(page)
    inv = {}
    for en, jn in pja.get(t['en'], {}).items(): inv.setdefault(jn, []).append(en)
    # 英語側の素質を role 付きで列挙
    en_list = [(r, p['name']) for r in ('main', 'support') for g in t['potentials'].get(r, []) for p in g['potentials']]
    used = {}; res = {}
    for r in rows:
        cands = [(role, en) for role, en in en_list if pja.get(t['en'], {}).get(en) == r['ja']]
        cands = [c for c in cands if (c[0], c[1]) not in used]
        if not cands: continue
        role, en = cands[0]; used[(role, en)] = 1
        res.setdefault(role, {})[en] = {'ja': r['ja'], 'label': r['label'], 'text': r['text'], 'nums': r['nums']}
    # 日本語名の対応が入れ替わっている素質を、数値の一致で直す（英語Wikiの数値の端が、別の行の数値と一致するもの）
    def numsof(strs):
        return [float(m) for x in strs for m in re.findall(r'\d+(?:\.\d+)?', x)]
    def match(en_vals, jn):
        return bool(en_vals) and all(any(abs(e - x) < 0.06 for x in jn) for e in en_vals)
    enp = {(r, p['name']): p for r in ('main', 'support') for g in t['potentials'].get(r, []) for p in g['potentials']}
    fixed = 0
    for role in ('main', 'support'):
        for en, cur in list(res.get(role, {}).items()):
            p = enp.get((role, en))
            envals = [a[0] for a in (p['nums'] if p else []) if a] + [a[-1] for a in (p['nums'] if p else []) if a]
            if not envals or match(envals, numsof(cur['nums'])):
                continue
            alt = [(e2, c2) for e2, c2 in res.get(role, {}).items() if e2 != en and match(envals, numsof(c2['nums']))]
            if len(alt) == 1:   # 交換して、両方が合うときだけ直す
                e2, c2 = alt[0]
                p2 = enp.get((role, e2)); ev2 = [a[0] for a in (p2['nums'] if p2 else []) if a] + [a[-1] for a in (p2['nums'] if p2 else []) if a]
                if match(ev2, numsof(cur['nums'])):
                    res[role][en], res[role][e2] = c2, cur
                    fixed += 1
    n_en = len(en_list); n_got = sum(len(v) for v in res.values())
    report.append((t['en'], ja, f'{n_got}/{n_en} 入れ替え修正 {fixed}'))
    out[t['en']] = res
    time.sleep(0.6)
json.dump(out, open('data/potentials_jp.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
for r in report: print(*r)
