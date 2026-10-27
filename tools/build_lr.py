# Wikiのロスレコ（data/lostrecords_jp.json）から、計算ページで使う形（data/lr_auto.js: window.LR_AUTO）を作る。
#   python tools/build_lr.py
# 効果の文を「誰の・何が・何%」の決まった言い回しのルールで読む。読めない文は効果にせず、文だけ残す（画面では「計算に未反映」）。
# 条件付きの効果（〜時から、〜場合、〜の敵へ など）は、既定で反映しない（画面のチェックで反映できる）。重複できるものは最大の重複数で計算する。
# Wikiの値で、ゲーム内の画面では確認していないので、画面では名前の後ろに「*」を付ける。
import json, re

d = json.load(open('data/lostrecords_jp.json', encoding='utf-8'))
EL = '水火風地光闇'
NUM = r'(\d+(?:\.\d+)?)'

# 何が（長い言い回しを先に）
STAT = [
    (r'通常攻撃ダメージとスキルダメージ', ['Bb', 'Bs']),
    (r'スキルダメージと必殺技ダメージ', ['Bs', 'Bu']),
    (r'スキルおよび必殺技ダメージ', ['Bs', 'Bu']),
    (r'通常攻撃(?:ダメージ)?と必殺技ダメージ', ['Bb', 'Bu']),
    (r'全ての属性ダメージ', ['W']),
    (r'[' + EL + r']属性ダメージ', ['W']),
    (r'スキル会心ダメージ', ['critDmgSkill']),
    (r'会心ダメージ', ['critDmg']),
    (r'会心率', ['critRate']),
    (r'通常攻撃ダメージ', ['Bb']),
    (r'スキルダメージ', ['Bs']),
    (r'必殺技ダメージ', ['Bu']),
    (r'印ダメージ', ['mark']),
    (r'攻撃力', ['atkPct']),
    (r'(?:最大)?HP', ['hpPct']),
]
COND = ('時', '後', '場合', '間、', '達', '付与され', '保有', '保持', '敵へ', '敵に与える', 'エリート', 'ノーマル', '弱点', '中、', '持続中', '撃破', '確率')


def who(seg):
    """効果を受ける側: (to, el)。to = el(その属性の全員)/all/main/sup/role:バランサー など"""
    m = re.search(r'([' + EL + r'])属性の(主力|支援|バランサー|サポーター)巡遊者', seg)
    if m:
        r = {'主力': 'main', '支援': 'sup'}.get(m.group(2), 'role:' + m.group(2))
        return r, m.group(1)
    if re.search(r'主力巡遊者|自身', seg):
        return 'main', None
    if re.search(r'支援巡遊者', seg):
        return 'sup', None
    m = re.search(r'([' + EL + r'])属性(?:の)?(?:巡遊者|の味方|従者)', seg)
    if m:
        return 'el', m.group(1)
    if re.search(r'チーム(全体|全員|内)|味方', seg):
        return 'all', None
    return None, None


def sentences(t):
    return [s.strip() for s in re.split(r'[。\n]', t) if s.strip()]


def classify(t, lr_el):
    """1つの文章 → 効果の一覧 [{k, to, el, v, off, stk, txt}]。読めない文は {'txt', 'skip':True}"""
    out, last = [], None
    for s in sentences(t):
        st = re.search(r'この効果は(?:最大)?(\d+)回(?:まで)?重複', s)
        if st and last:
            for e in last:
                e['stk'] = int(st.group(1))
            continue
        if re.search(r'この効果は|重複できる|保持できる', s) and not re.search(r'増加|上昇', s):
            continue
        got = []
        # 敵の被ダメージ（増加させる／増加する）
        m = re.search(r'([' + EL + r'])属性(?:の(スキル|通常攻撃|印|必殺技))?被ダメージ(?:を|が)\s*' + NUM + r'\s*[%％]\s*増加', s)
        if m and '受ける' not in s:
            k = {'スキル': 'takenSkill', '通常攻撃': 'takenBasic', None: 'taken'}.get(m.group(2))
            if k:
                got.append({'k': k, 'to': 'el', 'el': m.group(1), 'v': float(m.group(3)) / 100})
        elif re.search(r'被ダメージ.*減少|シールド|SP|防御力|従者', s):
            pass
        else:
            m = re.search(r'(?:' + '|'.join(p for p, _ in STAT) + r')(?:が|は)\s*(?:追加で|さらに)?\s*' + NUM + r'\s*[%％]\s*(?:増加|上昇)', s)
            m2 = re.search(r'追加で\s*' + NUM + r'\s*[%％]\s*(?:増加|上昇)', s) if not m else None
            if m:
                head = s[:m.start()]
                seg = re.split(r'[、，,]', head)[-1] if re.split(r'[、，,]', head)[-1].strip() else head
                stat = next(ks for p, ks in STAT if re.match(p, s[m.start():]))
                to, el = who(seg)
                if to is None:
                    to, el = who(head)
                if to is None:
                    to, el = 'all', None
                # 「チーム全体のX属性ダメージ」はその属性の味方だけに意味がある
                if stat == ['W'] and to == 'all':
                    em = re.match(r'([' + EL + r'])属性ダメージ', s[m.start():])
                    if em:
                        to, el = 'el', em.group(1)
                v = float(m.group(1)) / 100
                if re.search(r'ごとに|につき|\*', s):
                    v = None   # 数に応じて増える効果（暁光1ごと など）は、数が分からないので反映しない
                for k in stat:
                    got.append({'k': k, 'to': to, 'el': el, 'v': v})
            elif m2 and last and not re.search(r'ごとに|につき', s):
                for e in last:
                    got.append({'k': e['k'], 'to': e['to'], 'el': e.get('el'), 'v': float(m2.group(1)) / 100, 'add': True})
        if got and all(g['v'] is not None for g in got):
            off = any(w in s for w in COND)
            for g in got:
                g['off'] = off
                g['txt'] = s
            out += got
            last = got
        else:
            out.append({'txt': s, 'skip': True})
            last = None
    return out


def merge_levels(texts, lr_el):
    """突破やLvごとの文章 → 文ごとの項目 [{txt:[...], off, e:[{k,to,el,v:[...]}]}]。文の数が違うときは、1つ目の形に合わせる"""
    per = [classify(t, lr_el) for t in texts]
    base = per[0]
    items = []
    # 同じ文から出た効果を1項目にまとめる
    groups = []
    for i, e in enumerate(base):
        if groups and groups[-1]['txt0'] == e['txt'] and not e.get('skip') and not groups[-1].get('skip'):
            groups[-1]['idx'].append(i)
        else:
            groups.append({'txt0': e['txt'], 'idx': [i], 'skip': e.get('skip')})
    for gi, g in enumerate(groups):
        it = {'txt': [], 'skip': bool(g['skip'])}
        for p in per:
            it['txt'].append(p[g['idx'][0]]['txt'] if len(p) == len(base) else g['txt0'])
        if not g['skip']:
            e0 = base[g['idx'][0]]
            it['off'] = e0['off']
            it['e'] = []
            for i in g['idx']:
                b = base[i]
                vals = [(p[i]['v'] if len(p) == len(base) and not p[i].get('skip') and p[i].get('k') == b['k'] else b['v']) for p in per]
                e = {'k': b['k'], 'to': b['to'], 'v': vals}
                if b.get('el'):
                    e['el'] = b['el']
                if b.get('stk'):
                    e['stk'] = b['stk']
                it['e'].append(e)
        items.append(it)
    return items


def stats(s, el):
    r = {}
    for k, v in s.items():
        try:
            x = float(v[-1].replace('%', ''))
        except ValueError:
            continue
        pct = '%' in v[-1]
        if re.search(r'攻撃', k):
            r['baseAtk'] = x
        elif 'HP' in k:
            r['baseHp'] = x
        elif re.search(r'属性ダメージ', k):
            r['elemDmg'] = x / 100
        elif k == 'スキルダメージ':
            r['skillDmg'] = x / 100
        elif k == '必殺技ダメージ':
            r['ultDmg'] = x / 100
        elif k == '通常攻撃ダメージ':
            r['basicDmg'] = x / 100
    return r


out, cnt = [], {'items': 0, 'used': 0}
for i, (name, v) in enumerate(d.items()):
    el = v.get('element') or 'なし'
    rec = {'id': 'w' + str(i), 'name': name, 'rarity': v.get('rarity'), 'element': el, 'tags': v.get('tags'),
           'stats': stats(v['stats'], el), 'sub': [{'note': x['note'], 'lv': x['r8']} for x in v['sub']],
           'coreName': v.get('coreName') or name, 'core': merge_levels(v['core'], el) if v['core'] else [], 'assists': []}
    for j, a in enumerate(v['assists']):
        if not a['levels']:
            continue
        rec['assists'].append({'id': 'a' + str(j), 'name': a['name'], 'notes': a['notes'], 'base': a['levels'][0]['need'] or 10,
                               'items': merge_levels([l['text'] for l in a['levels']], el)})
    for it in rec['core'] + [x for a in rec['assists'] for x in a['items']]:
        cnt['items'] += 1
        cnt['used'] += 0 if it['skip'] else 1
    out.append(rec)
open('data/lr_auto.js', 'w', encoding='utf-8').write(
    '// ロスレコ（日本語Wikiから自動で作成: tools/import_lr_wiki.py → tools/build_lr.py）。ゲーム内の画面では未確認（画面では名前に「*」）。\n'
    '// core: 突破1〜6ごとの値、assists: Lv1〜5ごとの値。e.v は配列（突破／Lvの順）。skip=読めなかった文（計算に未反映）。off=条件付き（既定で反映しない）。\n'
    'window.LR_AUTO = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), 'records', cnt)
