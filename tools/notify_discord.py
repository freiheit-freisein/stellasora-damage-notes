# 公開のあと、更新履歴（data/changelog.js）に増えた行を Discord に流す。
# 使い方: python tools/notify_discord.py            … 前回流したコミットから HEAD までに増えた行を送る
#         python tools/notify_discord.py --dry-run  … 送らずに中身だけ出す
#         python tools/notify_discord.py --only=2   … 増えた行のうち先頭の2件だけ送る（残りは送らずに、送ったことにする）
#         python tools/notify_discord.py --pick=1,3,4 … 増えた行のうち、番号で選んだ行だけ送る（残りは送らずに、送ったことにする）
# Webhook の URL は .discord-webhook（git に入れない）。前回流したコミットは .discord-last に残す。
import json, re, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOOK = ROOT / ".discord-webhook"
LAST = ROOT / ".discord-last"
CAT = {"chara": "巡遊者", "calc": "計算", "ui": "画面", "pot": "素質", "lr": "ロスレコ"}


def git(*a):
    return subprocess.run(["git", *a], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True).stdout


def main():
    dry = "--dry-run" in sys.argv
    head = git("rev-parse", "--short", "HEAD").strip()
    base = LAST.read_text(encoding="utf-8").strip() if LAST.exists() else git("rev-parse", "--short", "HEAD~1").strip()
    if base == head:
        print("前回から更新履歴は増えていません"); return
    diff = git("diff", f"{base}..{head}", "--", "data/changelog.js")
    items = []
    for ln in diff.splitlines():
        if not ln.startswith("+") or ln.startswith("+++"):
            continue
        m = re.search(r'c:\s*"(\w+)".*?t:\s*"((?:[^"\\]|\\.)*)"', ln)
        if m:
            add = re.search(r"add:\s*true", ln)
            txt = m.group(2).replace("`", "'")   # 1件ずつコードブロックで囲む（見分けやすいように。ユーザーの希望）
            items.append(f"```\n【{CAT.get(m.group(1), m.group(1))}{'・追加' if add else ''}】{txt}\n```")
    if not items:
        print("増えた更新履歴の行がありません"); LAST.write_text(head, encoding="utf-8"); return
    only = next((int(a.split("=", 1)[1]) for a in sys.argv if a.startswith("--only=")), None)   # 先頭のN件だけ送る（長いと読みにくいとき。ユーザーの指示）
    if only:
        items = items[:only]
    pick = next(([int(x) for x in a.split("=", 1)[1].split(",")] for a in sys.argv if a.startswith("--pick=")), None)   # 番号（1から）で選んだ行だけ送る（更新が多いときに厳選する。ユーザーの指示）
    if pick:
        items = [items[i - 1] for i in pick if 0 < i <= len(items)]
    head_txt = "**巡遊者の計算ノートを更新しました**"
    foot = ""   # URL は付けない（ユーザーの希望）
    body, out = [], []
    for it in items:   # Discord は1通2000文字まで。あふれたら分けて送る
        if len(head_txt) + len(foot) + sum(len(x) + 1 for x in body) + len(it) + 1 > 1900:
            out.append(body); body = []
        body.append(it)
    out.append(body)
    msgs = [(head_txt if i == 0 else "（続き）") + "\n" + "\n".join(b) + (foot if i == len(out) - 1 else "") for i, b in enumerate(out)]
    if dry:
        print("\n\n".join(msgs)); return
    url = HOOK.read_text(encoding="utf-8").strip()
    for msg in msgs:
        req = urllib.request.Request(url, data=json.dumps({"content": msg, "allowed_mentions": {"parse": []}}).encode("utf-8"),
                                     headers={"Content-Type": "application/json", "User-Agent": "stellasora-calc-notify"})
        urllib.request.urlopen(req).read()
    LAST.write_text(head, encoding="utf-8")
    print(f"{len(items)}件を {len(msgs)}通で送りました（{base}..{head}）")


if __name__ == "__main__":
    main()
