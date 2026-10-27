# 日本語Wikiの素質の説明文から、効果の下書きを、決まった言い回しのルールで作る。
# 入力: data/potentials_jp.json, data/trekkers.json, data/trekker_ja.js  出力: data/spec_draft.js（window.SPEC_DRAFT）
# 分類できなかった文は、review=true（要確認）にして、効果は空のままにする。
import json, re


def js(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])


tk = json.load(open('data/trekkers.json', encoding='utf-8'))
tk = tk if isinstance(tk, list) else tk.get('trekkers', tk)
jp = json.load(open('data/potentials_jp.json', encoding='utf-8'))
tja = js('data/trekker_ja.js')
EL = {'Aqua': '水', 'Ignis': '火', 'Lux': '光', 'Umbra': '闇', 'Ventus': '風', 'Terra': '地'}
NUM = r'(\d+(?:\.\d+)?)'
RNG = NUM + r'\s*[%％]?\s*[～~]\s*' + NUM + r'\s*[%％]?'
MAXOPT = r'(?:\s*[（(]\s*[Mm][Aa][Xx]\s*[!！]?\s*[）)])?'
VAL = '(?:' + RNG + '|' + NUM + r'\s*[%％])' + MAXOPT
NONE_WORDS = ('シールド', '回復', 'クールタイム', 'SP', 'エネルギー', 'スタン', '耐性', '吸収', '移動速度', '無敵', '復活', 'ブレイク',
              '攻撃速度', '範囲', '持続時間', '延長', '短縮', 'ノックバック', '確率で', 'リセット')


MAXRE = r'\s*[（(]\s*[Mm][Aa][Xx]\s*[!！]?\s*[）)]'


def value(txt, en_nums, flat=False, sent=''):
    """数値の文字列 → ({n:番号} | {arr:[...]} | {raw:数}) とメモ。範囲は、英語Wikiの表の端と一致すれば番号、なければ直線補間。"""
    r = re.search(RNG, txt)
    if r:
        a, b = float(r.group(1)), float(r.group(2))
        capped = bool(re.search(r'max', txt, re.I))   # 数値の直後に (Max!) が付いている（その数値は、Lv6から上がらない）
        for i, arr in enumerate(en_nums):
            if arr and abs(arr[0] - a) < 0.06 and abs(arr[-1] - b) < 0.06:
                return ({'n': i, 'ext': 'cap'} if capped else {'n': i}), None
        v = {'arr': [round(a + (b - a) * k / 5, 2) for k in range(6)]}
        if capped:
            v['ext'] = 'cap'
        return v, '中間のLvは直線補間（未確認）'
    s = re.search(NUM, txt)
    if not s:
        return None, None
    x = float(s.group(1))
    return ({'raw': x} if flat else {'raw': round(x / 100, 6)}), None


def classify(en_name, jt, en_nums, el_ja, role):
    effects, notes, unknown = [], [], []
    last = None
    for s in [x for x in re.split(r'[。\n]', jt) if x.strip()]:
        st = re.search(r'この効果は[^。]*?(\d+)回(?:まで)?重複', s)
        if st:
            if last:
                for e in last:
                    e['stk'] = int(st.group(1))
            continue
        if s.startswith('この効果は') or s.startswith('持続時間'):
            continue
        got = []
        head = s.split('が')[0] if 'が' in s else s[:12]
        to = None
        if re.search(r'チーム(全体|内の全員)|全員', head):
            to = 'all'
        elif re.search(r'^主力(巡遊者)?', head):
            to = 'main'
        elif re.search(el_ja + r'属性(の)?巡遊者', head):
            to = 'lux'

        def add(k, txt, flat=False, extra=None, enemy=False):
            v, nt = value(txt, en_nums, flat, s)
            if v is None:
                return
            e = {'k': k}
            e.update(v)
            if enemy:
                e['to'] = 'enemy'
            elif to:
                e['to'] = to
            if flat and 'n' in v:
                e['flat'] = True
            if extra:
                e.update(extra)
            got.append(e)
            if nt and nt not in notes:
                notes.append(nt)

        mm = re.search(r'(スキル|通常攻撃|印)?被ダメージ(?:を|が)\s*(' + VAL + r')\s*(増加|上昇)', s)
        if mm and ('敵' in s or '属性被ダメージ' in s):
            add({'スキル': 'takenSkill', '通常攻撃': 'takenBasic', '印': 'takenMark'}.get(mm.group(1), 'taken'), mm.group(2), enemy=True)
        else:
            m2 = re.search(r'(スキル|通常攻撃|必殺技|印|' + el_ja + r'属性)ダメージが\s*(' + VAL + r')\s*(増加|上昇)', s)
            if m2 and '攻撃力の' not in s[:m2.start()]:
                add({'スキル': 'Bs', '通常攻撃': 'Bb', '必殺技': 'Bu', '印': 'mark'}.get(m2.group(1), 'W'), m2.group(2))
            m3 = re.search(r'(スキル|通常攻撃|必殺技|印)?会心(率|ダメージ)が\s*(' + VAL + r')\s*(上昇|増加)', s)
            if m3:
                ex = {'ht': {'スキル': 'skill', '通常攻撃': 'basic', '必殺技': 'ult', '印': 'mark'}[m3.group(1)]} if m3.group(1) else None
                add('critRate' if m3.group(2) == '率' else 'critDmg', m3.group(3), extra=ex)
            m4 = re.search(r'攻撃力が\s*(' + VAL + r')\s*(上昇|増加)', s)
            if m4:
                add('atkPct', m4.group(1))
            m5 = re.search(r'最大HPが\s*(' + RNG + '|' + NUM + r'(?:\s*[%％])?)' + MAXOPT + r'\s*(増加|上昇)', s)
            if m5:
                flat = '%' not in m5.group(1) and '％' not in m5.group(1)
                add('hpFlat' if flat else 'hpPct', m5.group(1), flat=flat)
            m6 = re.search(r'攻撃力の\s*' + NUM + r'(?:\s*[xX×]\s*(\d+))?\s*[%％]?\s*の[^。]*?(スキル|通常攻撃|必殺技|印)ダメージを与え', s)
            if m6:
                grp = 'ult' if m6.group(3) == '必殺技' else role
                got.append({'k': 'extra', 'group': grp, 'name': en_name, 't': {'スキル': 'skill', '通常攻撃': 'basic', '必殺技': 'ult', '印': 'mark'}[m6.group(3)],
                            'c': int(m6.group(2)) if m6.group(2) else 1, 'edit': True, 'm': float(m6.group(1))})
        if got:
            effects += got
            last = got
        elif any(w in s for w in NONE_WORDS):
            last = None
        else:
            unknown.append(s)
    return effects, notes, unknown


out = {}
stat = {'auto': 0, 'none': 0, 'review': 0, 'mixed': 0}
for t in tk:
    en = t['en']
    el = EL.get(t['element'], '')
    enmap = {(r, p['name']): p for r in ('main', 'support') for g in t['potentials'].get(r, []) for p in g['potentials']}
    for role, pots in jp.get(en, {}).items():
        for pn, j in pots.items():
            p = enmap.get((role, pn))
            en_nums = [a for a in (p['nums'] if p else []) if a]
            eff, notes, unk = classify(pn, j['text'], en_nums, el, role)
            d = {'draft': True, 'auto': True, 'e': eff, 'txt': ''}
            if notes:
                d['note'] = '／'.join(notes)
            if unk and not eff:
                d['review'] = True
                d['unk'] = unk[:3]
                stat['review'] += 1
            elif unk and eff:
                d['review'] = True
                d['unk'] = unk[:3]
                stat['mixed'] += 1
            elif eff:
                stat['auto'] += 1
            else:
                d['none'] = True
                stat['none'] += 1
            out.setdefault(en, {}).setdefault(role, {})[pn] = d
open('data/spec_draft.js', 'w', encoding='utf-8').write('// 素質の効果の下書き（日本語Wikiの説明文から、ルールで自動作成。tools/classify_effects.py）。確認前の内容。\n// キー: 巡遊者の英語名 → main/support → 素質の英語名\nwindow.SPEC_DRAFT = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(stat)
