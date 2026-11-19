# ゲームの素質プリセットコード用の対応表を作る: プリセット共有サイトのAPI → data/preset_map.js
#   python tools/build_preset_map.py            … data/preset_map.js を書き直す
#   python tools/build_preset_map.py --out FILE … 別のファイルに書く（tools/build_site.py が公開のたびに dist/ に作り直すとき）
# コードの中身は「巡遊者ID（サイトと同じ）」と「素質の枠の番号（slot。コア0〜3・サブ0〜11）」。枠の番号は、サイトの potentials.slot を使う
# 結び付けは日本語名（2026-11-19）。英語名は両サイトで違うことがある（スグハ: 素質ノートは Leafia、計算ノートは仮の Suguha。素質の英語名も違う）。
#   日本語名はどちらのサイトでも同じなので、sim_preset.js は巡遊者を c.jp、素質を data/potential_ja.js の日本語名で引く（全角・半角の違いはそろえて比べる）
import json, sys, time, urllib.request

SITE = 'https://preset.stella-tool.com'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return json.load(urllib.request.urlopen(req, timeout=60))


def build():
    tk = get(SITE + '/api/trekkers')
    ids = [t['id'] for t in tk]
    rows = []
    for i in range(0, len(ids), 10):
        rows += get(SITE + '/api/potentials?ids=' + ','.join(map(str, ids[i:i + 10])))
        time.sleep(0.3)
    ja_of = {t['id']: t['name_ja'] for t in tk}
    slots = {}
    for p in rows:
        ja = ja_of.get(p['trekker_id'])
        if not ja or p.get('slot') is None:
            continue
        r = slots.setdefault(ja, {}).setdefault(p['role'], {'core': [None] * 4, 'sub': [None] * 12})
        r[p['kind']][p['slot']] = p['name_ja']
    # 枠がそろっていない巡遊者（素質がまだ登録されていないなど）は入れない
    slots = {ja: rs for ja, rs in slots.items() if all(None not in r[k] for r in rs.values() for k in ('core', 'sub'))}
    trekkers = {str(i): ja for i, ja in ja_of.items() if ja in slots}
    return {'trekkers': trekkers, 'slots': slots}


if __name__ == '__main__':
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else 'data/preset_map.js'
    m = build()
    open(out, 'w', encoding='utf-8', newline='\n').write(
        '// ゲームの素質プリセットコード用の対応表（tools/build_preset_map.py がプリセット共有サイトのAPIから作る）。\n'
        '// trekkers: 巡遊者ID → 日本語名、slots: 日本語名 → main/support → core[4]・sub[12]（コードの中の枠の順の素質の日本語名）\n'
        'window.PRESET_MAP = ' + json.dumps(m, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(len(m['trekkers']), 'trekkers ->', out)
