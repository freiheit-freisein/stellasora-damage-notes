# 日本語Wiki（wikiru）の心相の表（ランク I〜V・名称・効果）を、巡遊者ごとに取り込む。
# 使い方: python tools/import_heart_jp_wiki.py  → data/heart_jp.json を作る（キー: 巡遊者の英語名 → [{n, name, text}]）
import json, re, sys, time, urllib.parse, urllib.request, html as H

def js(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])

tk = json.load(open('data/trekkers.json', encoding='utf-8'))
tk = tk if isinstance(tk, list) else tk.get('trekkers', tk)
tja = js('data/trekker_ja.js')

def fetch(name):
    url = 'https://stellasora.wikiru.jp/?' + urllib.parse.quote(name)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=40).read().decode('utf-8', 'replace')

# 用語の説明（マウスを重ねると出る補足）は本文から外す
TIP = re.compile(r"\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{ tippy\('\.tooltip-[0-9a-f]+', \{ content: '(.*?)', \}\); \}\);\s*", re.S)

def clean(s):
    s = re.sub(r'<script.*?</script>', '', s, flags=re.S)
    s = re.sub(r'<br[^>]*>', '\n', s)
    s = re.sub(r'<img[^>]*>', '', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = TIP.sub('', H.unescape(s))
    return s.replace('%br;', '\n').strip()

ROMAN = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5}

def parse(page):
    i = page.find('id="talent"')
    if i < 0: return []
    j = page.find('<table', i); k = page.find('</table>', j)
    rows = []
    for tr in re.findall(r'<tr>(.*?)</tr>', page[j:k], flags=re.S):
        cells = [clean(c) for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, flags=re.S)]
        if len(cells) >= 3 and cells[0] in ROMAN:
            rows.append({'n': ROMAN[cells[0]], 'name': cells[1], 'text': cells[2]})
    return rows

out = {}; report = []
for t in tk:
    ja = tja.get(t['en'])
    if not ja: continue
    pname = ja.replace('（', '(').replace('）', ')')   # ページ名のかっこは半角
    try:
        rows = parse(fetch(pname))
    except Exception as e:
        report.append((t['en'], ja, 'fetch失敗 ' + str(e)[:40])); continue
    if len(rows) != 5: report.append((t['en'], ja, f'心相の行 {len(rows)}'))
    if rows: out[t['en']] = rows
    time.sleep(1.0)

json.dump(out, open('data/heart_jp.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('取り込んだ巡遊者', len(out))
for r in report: print(*r)
