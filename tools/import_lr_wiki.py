# 日本語Wiki（wikiru）のロスレコを、一覧（★5・★4・★3）から全部取り込む。
#   python tools/import_lr_wiki.py        → data/lostrecords_jp.json（Wikiの文章と数値そのまま）
# 取り込むもの: レア度・属性・種類、ステータス（Lv1 / Max）、コア効果（突破1〜6の文章）、
#   アシスト効果（名前・解放に必要な音符・Lvごとの文章と必要数）、サブの初期音符（ランク0 / ランク8）
# ゲーム内の画面で確認した値ではないので、計算ページでは「*」（未確認）を付けて出す。
import json, re, sys, time, urllib.parse, urllib.request, html as H

LISTS = ['★5ロスレコ', '★4ロスレコ', '★3ロスレコ']


def fetch(name):
    url = 'https://stellasora.wikiru.jp/?' + urllib.parse.quote(name)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=40).read().decode('utf-8', 'replace')


def text(s):
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'<script.*?</script>', '', s, flags=re.S)
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'[ \t　]+', ' ', H.unescape(s)).strip()


def tables(h):
    """ページ本文の表を、見出し（h2/h3）の位置と一緒に返す: [(見出し, [[セル…]…])]"""
    body = h[h.find('id="body"'):]
    out, head = [], ''
    for m in re.finditer(r'<h[23][^>]*>(.*?)</h[23]>|<table.*?</table>', body, re.S):
        if m.group(1) is not None:
            head = text(m.group(1)).replace('†', '').strip()
            continue
        rows = []
        for tr in re.findall(r'<tr.*?</tr>', m.group(0), re.S):
            rows.append([text(c) for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S)])
        out.append((head, rows))
    return out


def names_from_list(page):
    """一覧の表の「名前」列（リンクの文字）"""
    h = fetch(page)
    res = []
    for head, rows in tables(h):
        hdr = next((r for r in rows if '名前' in r), None)
        if not hdr:
            continue
        i = hdr.index('名前')
        for r in rows[rows.index(hdr) + 1:]:
            if len(r) > i and r[i]:
                res.append(r[i])
    return res


def parse(name):
    h = fetch(name)
    tb = tables(h)
    d = {'name': name, 'stats': {}, 'core': [], 'assists': [], 'sub': []}
    for head, rows in tb:
        flat = [c for r in rows for c in r]
        if head == '基本情報' and any(c == 'レアリティ' for c in flat):
            for r in rows:
                for k, v in zip(r[::2], r[1::2]) if len(r) % 2 == 0 else zip(r[1::2], r[2::2]):
                    if k == 'レアリティ':
                        d['rarity'] = int(re.sub(r'\D', '', v) or 0)
                    elif k == '属性':
                        d['element'] = v.replace('属性', '')
                    elif k == '種類':
                        d['tags'] = v
        elif head == '基本情報' and rows and rows[0] and rows[0][0].startswith('ステータス'):
            for r in rows[1:]:
                for k, v in zip(r[::2], r[1::2]):
                    if '/' in v:
                        d['stats'][k] = [x.strip() for x in v.split('/')]
        elif head == 'コア効果':
            d['coreName'] = rows[0][0] if rows and rows[0] else name
            d['core'] = [r[1] for r in rows if len(r) >= 2 and re.fullmatch(r'\d+', r[0])]
        elif head == 'アシスト効果' and rows:
            a = {'name': rows[0][0], 'notes': [], 'levels': []}
            for r in rows[1:]:
                if r and r[0] == 'Lv':
                    a['notes'] = r[2:]
                elif r and re.fullmatch(r'\d+', r[0]) and len(r) >= 3:
                    need = re.search(r'(\d+)', r[2])
                    a['levels'].append({'lv': int(r[0]), 'text': r[1], 'need': int(need.group(1)) if need else None})
            d['assists'].append(a)
        elif head == 'サブ' and rows and rows[0] and rows[0][0] == '音符':
            for r in rows[1:]:
                if len(r) >= 3:
                    d['sub'].append({'note': r[0], 'r0': int(re.sub(r'\D', '', r[1]) or 0), 'r8': int(re.sub(r'\D', '', r[2]) or 0)})
    return d


if __name__ == '__main__':
    names = []
    for p in LISTS:
        for n in names_from_list(p):
            if n not in names:
                names.append(n)
        time.sleep(0.6)
    print(len(names), 'records')
    out = {}
    for i, n in enumerate(names):
        try:
            out[n] = parse(n)
        except Exception as e:
            print('ERR', n, e, file=sys.stderr)
        time.sleep(0.6)
    json.dump(out, open('data/lostrecords_jp.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    from collections import Counter
    print(len(out), 'parsed', dict(Counter(v.get('rarity') for v in out.values())))
    print('stats keys', dict(Counter(k for v in out.values() for k in v['stats'])))
    print('no core', [k for k, v in out.items() if not v['core']][:20])
