# ゲームの素質プリセットコード用の対応表を作る: data/shared/potentials.json（プリセット共有サイトのデータ）→ data/preset_map.js
#   python tools/build_preset_map.py
# コードの中身は「巡遊者ID（サイトと同じ）」と「素質の枠の番号（slot。コア0〜3・サブ0〜11）」。枠の番号は、サイトの potentials.slot を使う
import json

d = json.load(open('data/shared/potentials.json', encoding='utf-8'))
en_of = {t['id']: t['en'] for t in d['trekkers']}
slots = {}
for p in d['potentials']:
    en = en_of[p['trekker_id']]
    r = slots.setdefault(en, {}).setdefault(p['role'], {'core': [None] * 4, 'sub': [None] * 12})
    r[p['kind']][p['slot']] = p['name_en']
missing = [(en, role, k) for en, rs in slots.items() for role, r in rs.items() for k in ('core', 'sub') if None in r[k]]
out = {'trekkers': {str(k): v for k, v in en_of.items()}, 'slots': slots}
open('data/preset_map.js', 'w', encoding='utf-8').write(
    '// ゲームの素質プリセットコード用の対応表（tools/build_preset_map.py が data/shared/potentials.json から作る）。\n'
    '// trekkers: 巡遊者ID → 英語名、slots: 英語名 → main/support → core[4]・sub[12]（コードの中の枠の順の素質の英語名）\n'
    'window.PRESET_MAP = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(en_of), 'trekkers', 'missing slots', missing[:5])
