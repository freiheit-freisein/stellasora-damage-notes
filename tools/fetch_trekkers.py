"""英語版ステラソラWiki（miraheze）から全巡遊者ページのwikitextを取得して保存する。

使い方: python -X utf8 tools/fetch_trekkers.py [保存先ディレクトリ]
- 公式のMediaWiki APIを使う。1ページごとに間隔を空けて負荷をかけない。
- すでに保存済みのページは取得しない（途中で止めても再実行で続きから）。
"""
import json, os, sys, time, urllib.parse, urllib.request

API = "https://stellasora.miraheze.org/w/api.php"
UA = "stellasora-calc/0.1 (personal damage calculator; polite fetch)"
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "cache")
DELAY = 0.6


def get(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def list_trekkers():
    titles, cont = [], {}
    while True:
        d = get(dict({"action": "query", "list": "embeddedin", "eititle": "Template:TrekkerData",
                      "eilimit": "500", "einamespace": "0", "format": "json"}, **cont))
        titles += [x["title"] for x in d["query"]["embeddedin"]]
        if "continue" not in d:
            break
        cont = d["continue"]
    return titles


def main():
    os.makedirs(OUT, exist_ok=True)
    titles = list_trekkers()
    with open(os.path.join(OUT, "_titles.json"), "w", encoding="utf-8") as f:
        json.dump(titles, f, ensure_ascii=False, indent=1)
    print("ページ数:", len(titles), flush=True)
    for i, t in enumerate(titles, 1):
        path = os.path.join(OUT, t.replace("/", "_").replace(" ", "_") + ".wikitext")
        if os.path.exists(path):
            continue
        try:
            d = get({"action": "parse", "page": t, "prop": "wikitext", "format": "json", "formatversion": "2"})
            with open(path, "w", encoding="utf-8") as f:
                f.write(d["parse"]["wikitext"])
            print(f"[{i}/{len(titles)}] {t}", flush=True)
        except Exception as e:  # 1ページの失敗で全体を止めない
            print(f"[{i}/{len(titles)}] 失敗 {t}: {e}", flush=True)
        time.sleep(DELAY)
    print("完了", flush=True)


if __name__ == "__main__":
    main()
