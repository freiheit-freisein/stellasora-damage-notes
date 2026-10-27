# 計算ページ（sim.html）で選べる巡遊者を、英語Wikiのスキルの説明文から自動で作る。
#   入力: data/trekkers.json  出力: data/sim_chars_auto.js（window.SIM_CHARS_AUTO）
# sim_data.js に手で書いた巡遊者（検証済み）は、こちらより優先される（同じ en は出力しない）。
# ヒットの作り方: 説明文の「数値% ... of ATK / of Max HP ... (Auto Attack|Skill|Ultimate|Minion) DMG」を1つのヒットとし、
#   数値は Lv10 の nums と突き合わせて番号を決める（倍率はスキルLvごとに nums から引く）。「x2」があれば回数にする。
#   「毎秒」「〜秒ごと」などの繰り返しの回数は分からないので、1回分にする。印のダメージは数値が載っていないので入れない。
import json, re, sys

HAND = {'Suntide Willow', 'Nazuka', 'Eleanor', 'Firstlight Noya', 'Firefly', 'Tilia'}
EL = {'Aqua': '水', 'Ignis': '火', 'Lux': '光', 'Umbra': '闇', 'Ventus': '風', 'Terra': '地'}
ROLE = {'Vanguard': 'ヴァンガード', 'Versatile': 'バランサー', 'Support': 'サポーター'}
TYPE = {'Auto Attack': 'basic', 'Skill': 'skill', 'Ultimate': 'ult', 'Minion': 'skill', 'Mark': 'mark'}
GROUP = ['basic', 'main', 'support', 'ult']
REPEAT = re.compile(r'every|per second|once per|multiple times|times in succession|up to \d+ times|each second|continuously', re.I)
NUM = re.compile(r'(\d+(?:\.\d+)?)\s*%')
DMG = re.compile(r"(Auto Attack|Auto ATK|Skill|Ultimate|Minion|Mark|Aqua|Ignis|Lux|Umbra|Ventus|Terra)(?:'s)?(?: AoE)? DMG")   # 「Umbra DMG」だけのときは、技の種類で決める
DEF_TYPE = ['Auto Attack', 'Skill', 'Skill', 'Ultimate']
SENT_END = re.compile(r'\.(?=\s+[A-Z]|\s*$)')


def cid(en):
    return {'Noya': 'noya_ventus'}.get(en, re.sub(r'[^a-z0-9]+', '_', en.lower()).strip('_'))


def hits_of(text, lv10, s):
    """1つのスキルの説明文 → ヒットの一覧（と、HP参照かどうか）"""
    out, hp_ref, used = [], False, set()
    nums = [(m.start(), m.end(), float(m.group(1))) for m in NUM.finditer(text)]
    for k, (a, b, v) in enumerate(nums):
        idx = next((i for i, x in enumerate(lv10) if i not in used and x and abs(x[0] - v) < 1e-6), None)
        if idx is None:
            continue
        # 文の終わりまでで、最初の「… DMG」までを、この数値の説明とみなす
        end = SENT_END.search(text, b)
        seg = text[b:end.start() if end else len(text)]
        d = DMG.search(seg)
        pre = re.search(r'(Auto Attack|Auto ATK|Skill|Ultimate|Minion) DMG equal to\s*$', text[max(0, a - 60):a])   # 「… DMG equal to 328% x14 of ATK」
        if pre:
            d = pre
            clause = seg
        elif not d or ' by ' in text[max(0, a - 4):a]:
            continue
        else:
            clause = seg[:d.end()]
        if not re.search(r'of (?:\w+\'s )?(?:Base )?(ATK|Max HP)', clause) and re.search(r'increas|bonus|reduc|absorb| by ', clause):
            continue
        if 'Max HP' in clause:
            hp_ref = True
        used.add(idx)
        nxt = nums[k + 1][0] - b if k + 1 < len(nums) else len(seg)
        cm = re.search(r'x\s*(\d+)', seg[:nxt] if pre else seg[:min(nxt, d.end())])
        c = int(cm.group(1)) if cm else 1
        sent_start = text.rfind('. ', 0, a)
        sent = text[sent_start + 1:end.start() if end else len(text)]
        st = re.findall(r'Strike (\d+)(?: to (\d+))?', text[sent_start + 1:a])
        kind = {'Auto ATK': 'Auto Attack'}.get(d.group(1), d.group(1))
        if kind in EL:
            kind = DEF_TYPE[s]
        tags = [GROUP[s]] + (['minion'] if kind == 'Minion' else [])
        sname = (st[-1][0] + ('〜' + st[-1][1] if st[-1][1] else '') + '撃目') if st else None
        name = (sname if sname and s == 0 else 'ヒット' + str(len(out) + 1)) + ('（従者）' if kind == 'Minion' else '')
        if REPEAT.search(sent):
            name += '（1回分）'
        if c > 1:
            name += '×' + str(c)
        out.append({'s': s, 'n': idx, 'c': c, 't': TYPE[kind], 'name': name, 'tags': tags})
    return out, hp_ref


def build(t):
    hits, hp = {}, False
    for s, sk in enumerate(t['skills'][:4]):
        h, r = hits_of(sk['text'], sk['nums'][-1], s)
        hits[GROUP[s]] = h
        hp = hp or r
    return {'id': cid(t['en']), 'en': t['en'], 'jp': t['jp'], 'el': EL[t['element']], 'ref': 'hp' if hp else 'atk', 'role': ROLE[t['role']],
            'trust0': 0, 'talent0': 0, 'talentBonus': {}, 'auto': True, 'hits': hits}


if __name__ == '__main__':
    tk = json.load(open('data/trekkers.json', encoding='utf-8'))
    if '--check' in sys.argv:   # 手で書いた巡遊者と比べる（自動の作り方の確認用）
        for t in tk:
            if t['en'] in HAND:
                print(t['en'], json.dumps(build(t)['hits'], ensure_ascii=False))
        sys.exit()
    out = [build(t) for t in tk if t['en'] not in HAND]
    open('data/sim_chars_auto.js', 'w', encoding='utf-8').write(
        '// 計算ページで選べる巡遊者（自動）。tools/build_chars.py が英語Wikiのスキルの説明文から作った。手で直すときは、sim_data.js に書く（そちらが優先）。\n'
        '// ヒットの回数は、説明文に「x2」などがあるものだけ。繰り返し（毎秒など）の回数は1回分、印のダメージは数値が無いので入れていない。\n'
        'window.SIM_CHARS_AUTO = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
    empty = [(c['en'], g) for c in out for g in GROUP if not c['hits'][g]]
    print(len(out), 'trekkers', sum(len(h) for c in out for h in c['hits'].values()), 'hits; hp ref:', [c['en'] for c in out if c['ref'] == 'hp'])
    print('empty groups:', empty)
