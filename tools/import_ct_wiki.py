# 日本語Wiki（stellasora.wikiru.jp）の巡遊者のページから、スキルのCD（クールタイム）と必殺技の消費SPを取り込む。
# 出力: data/skill_ct.js（window.SKILL_CT = { 英語名: { main, support, ult, sp } }。秒。Wikiが空欄の所は null）
# 使い方: python tools/import_ct_wiki.py
import json, re, time, urllib.parse, urllib.request, html as H

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

# 「↑ 主力スキル † 名前 CD 20秒 要約」「↑ 必殺技 † 名前 CD 40秒 消費SP 300 要約」の形
PAT = re.compile(r'(主力スキル|支援スキル|必殺技) † [^†]{0,40}? CD ?([0-9.]*)秒? ?(?:消費SP ([0-9]+) )?要約')
KEY = {'主力スキル': 'main', '支援スキル': 'support', '必殺技': 'ult'}

out, report = {}, []
for t in tk:
    ja = tja.get(t['en'])
    if not ja:
        report.append((t['en'], '日本語名なし')); continue
    try:
        page = fetch(ja.replace('（', '(').replace('）', ')'))
    except Exception as e:
        report.append((t['en'], 'fetch失敗 ' + str(e)[:40])); continue
    text = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', page)))
    row = {'main': None, 'support': None, 'ult': None, 'sp': None}
    for m in PAT.finditer(text):
        k = KEY[m.group(1)]
        if row[k] is None and m.group(2):
            row[k] = float(m.group(2))
        if k == 'ult' and m.group(3) and row['sp'] is None:
            row['sp'] = int(m.group(3))
    out[t['en']] = row
    if None in (row['main'], row['support'], row['ult']):
        report.append((t['en'], ja, row))
    time.sleep(0.5)

with open('data/skill_ct.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write('// スキルのCD（秒）と必殺技の消費SP。日本語Wikiから自動で作成（tools/import_ct_wiki.py）。null はWikiが空欄\n')
    f.write('window.SKILL_CT = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), '人')
for r in report:
    print('未取得', r)
