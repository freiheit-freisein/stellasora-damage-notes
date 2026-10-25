"""fetch_trekkers.py で保存したwikitextを読み、ツール用のデータ(trekkers.json / trekkers.js)を作る。

使い方: python -X utf8 tools/parse_trekkers.py <wikitextのディレクトリ> <出力ディレクトリ>
出典: ステラソラWiki（https://stellasora.miraheze.org/）。
"""
import glob, json, os, re, sys

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "..", "data")


def fields(block):
    """{{Template | key = value ...}} の key=value を辞書にする（1行1項目の単純な形のみ）。"""
    d = {}
    # 値が空の行（「| name = 」）の次の行を飲み込まないよう、= の後ろは改行を含めない
    for m in re.finditer(r"^[ \t]*\|[ \t]*([A-Za-z0-9_-]+)[ \t]*=[ \t]*(.*)$", block, re.M):
        d[m.group(1)] = m.group(2).strip()
    return d


def section(w, start, ends):
    """見出し start から、次に現れる ends のどれかの見出しまでを返す（見出しの空白の違いに対応）。"""
    m = re.search(r"\n==\s*%s\s*==" % start, "\n" + w)
    if not m:
        return ""
    body = ("\n" + w)[m.end():]
    e = re.search(r"\n==\s*(?:%s)\s*==" % "|".join(ends), body)
    return body[:e.start()] if e else body


def num(x):
    x = x.strip().rstrip("%")
    try:
        v = float(x)
        return int(v) if v == int(v) else v
    except ValueError:
        return None


def clean(text):
    """wikiの装飾を取り、読める文にする。"""
    t = re.sub(r"\{\{color\|[^|}]*\|([^}]*)\}\}", r"\1", text)
    t = re.sub(r"\{\{word\|([^|}]*)(?:\|[^}]*)?\}\}", r"\1", t)
    t = re.sub(r"\{\{Item\|[^}]*\}\}", "", t)
    t = t.replace("<br>", " ").replace("<br/>", " ")
    t = re.sub(r"<[^>]+>", "", t)
    t = re.sub(r"\{\{[^}]*\}\}", "", t)
    return re.sub(r"\s+", " ", t).strip()


def colored(text):
    """{{color|#xxx|a%/b%/...}} の数値列を順に取り出す。固定値は要素1個、レベル別は6個になる。
    「99% of ATK x3」「432% of ATK」のように後ろに語が付く場合も、先頭の数字を取る。"""
    out = []
    for m in re.finditer(r"\{\{color\|[^|}]*\|([^}]*)\}\}", text):
        parts = []
        for p in m.group(1).split("/"):
            mm = re.match(r"^\s*([0-9]+(?:\.[0-9]+)?)", p)
            parts.append(num(mm.group(1)) if mm else None)
        if parts and all(p is not None for p in parts):
            out.append(parts)
    return out


def stat_blocks(w):
    st = section(w, "Stats", ["Skills"])
    res = {}
    for m in re.finditer(r"\{\{StatDisplay/value(.*?)\n\}\}", st, re.S):
        b = m.group(1)
        lab = re.search(r"label\s*=\s*(.*)", b)
        if not lab:
            continue
        arrs = {}
        for n, nm in re.findall(r"name(\d)\s*=\s*(\S+)", b):
            v = re.search(r"values%s\s*=\s*(.*)" % n, b)
            if v:
                arrs[nm] = [num(x) for x in v.group(1).split(",")]
        res[lab.group(1).strip()] = arrs
    return res


def skills(w):
    seg = section(w, "Skills", ["Potentials"])
    out = []
    for blk in re.split(r"\{\{TrekkerSkill", seg)[1:]:
        f = fields(blk)
        if not f.get("name"):
            continue  # 「{{TrekkerSkill」の分割で出る空のかたまりは無視
        levels = []
        for n in range(1, 11):
            d = f.get("desc_%d" % n)
            if d:
                levels.append(colored(d))
        last = f.get("desc_10") or f.get("desc_1") or ""
        out.append({"name": f.get("name", ""), "brief": clean(f.get("brief", "")), "text": clean(last), "nums": levels})
    return out


def potentials(w):
    seg = section(w, "Potentials", ["Affinity", "Gallery", "External links", "Navigation"])
    res = {}
    for role, key in (("Main", "main"), ("Support", "support")):
        m = re.search(r"\|-\|%s=(.*?)(?=\|-\|(?:Main|Support)=|</tabber>)" % role, seg, re.S)
        if not m:
            continue
        body = m.group(1)
        builds = {}
        for n in (1, 2, 3):
            nm = re.search(r"name%d\s*=\s*(.*)" % n, body)
            builds[n] = clean(nm.group(1)) if nm else ""
        groups = []
        for g in (1, 2, 3):
            gm = re.search(r"^\|\s*%d\s*=\s*(.*?)(?=^\|\s*[123]\s*=|\Z)" % g, body, re.S | re.M)
            if not gm:
                continue
            pots = []
            for pm in re.finditer(r"\{\{TrekkerPotential(.*?)\n\s*\}\}", gm.group(1), re.S):
                f = fields(pm.group(1))
                desc = f.get("desc", "")
                pots.append({"name": f.get("name", ""), "type": num(f.get("type", "")), "brief": clean(f.get("brief", "")),
                             "text": clean(desc), "nums": colored(desc)})
            groups.append({"build": g, "title": builds.get(g, ""), "potentials": pots})
        res[key] = groups
    return res


def parse(path):
    w = open(path, encoding="utf-8").read()
    m = re.match(r"\s*\{\{TrekkerData(.*?)\n\}\}", w, re.S)
    info = fields(m.group(1)) if m else {}
    st = stat_blocks(w)
    hp, atk, df = st.get("HP", {}), st.get("Attack", {}), st.get("Defense", {})
    return {
        "id": num(info.get("id", "")), "en": os.path.basename(path)[:-9].replace("_", " "),
        "jp": info.get("jp_name", ""), "role": info.get("role", ""), "element": info.get("element", ""),
        "rarity": num(info.get("rarity", "")), "range": info.get("range", ""), "release": info.get("release_date", ""),
        "stats": {
            "hp": hp.get("level"), "atk": atk.get("level"), "def": df.get("level"),
            "trust": {"hp": hp.get("affinity"), "atk": atk.get("affinity1"), "atkPct": atk.get("affinity2")},
            "talent": {"hp": hp.get("talent"), "atk": atk.get("talent1"), "atkPct": atk.get("talent2"), "def": df.get("talent")},
        } if hp else None,
        "skills": skills(w),
        "potentials": potentials(w),
    }


def main():
    os.makedirs(OUT, exist_ok=True)
    data = []
    for f in sorted(glob.glob(os.path.join(SRC, "*.wikitext"))):
        try:
            data.append(parse(f))
        except Exception as e:
            print("失敗", f, e)
    data.sort(key=lambda x: x["id"] or 0)
    with open(os.path.join(OUT, "trekkers.json"), "w", encoding="utf-8") as fo:
        json.dump(data, fo, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(OUT, "trekkers.js"), "w", encoding="utf-8") as fo:
        fo.write("// 自動生成: tools/parse_trekkers.py（出典: ステラソラWiki https://stellasora.miraheze.org/ ）\n")
        fo.write("window.TREKKERS = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("巡遊者:", len(data), "サイズ(KB):", os.path.getsize(os.path.join(OUT, "trekkers.json")) // 1024)


if __name__ == "__main__":
    main()
