# 素質のデータ（プリセット共有サイトと共有する形）

計算ツール（このリポジトリ）と、プリセット共有サイト（`stellasora-site`）で、素質の情報を共有するための取り決めです。

## 方針

- **キーは、プリセット共有サイトと同じ。** `trekker_id`（巡遊者のID）＋ `role`（`main` / `support`）＋ `name_en`（素質の英語名）。サイトの `potentials` テーブルの列（`role` `kind` `grp` `ui_order` `slot` `name_ja` `name_en`）を、そのまま使います。
- **計算ツールが足す項目は、別の枠（`effects` など）にまとめる。** サイトの既存の列は、変えません。
- **1つのファイル `data/shared/potentials.json` を作る。** `tools/build_shared.py` が、次の入力から組み立てます（手で編集しない）。

| 入力 | 中身 |
|---|---|
| プリセット共有サイトのAPI（`/api/trekkers`、`/api/potentials`） | 巡遊者のID・役割・種類・枠・日本語名 |
| `data/trekkers.json` | 英語Wikiの説明文・Lvごとの数値（`nums_en`） |
| `data/potentials_jp.json` | 日本語Wikiの説明文（ゲーム内の文章に近い） |
| `data/spec_user.js` | あなたが確認した効果（`confirmed`）と、手作業の下書き |
| `data/spec_draft.js` | 日本語の説明文から、ルールで作った下書き |
| `sim_pots.js` の組み込み | セイナ（原点）・ホタル・ティリアの効果（`builtin`） |

## ファイルの形

```json
{
  "schema": 1,
  "generated": "2026-10-27",
  "source": { "site": "...", "wiki_ja": "...", "wiki_en": "..." },
  "trekkers": [ { "id": 107, "en": "Tilia", "ja": "ティリア", "element": "Lux", "rarity": 4, "role": "Support" } ],
  "potentials": [ { ... } ]
}
```

### potentials の1件

| 項目 | 意味 |
|---|---|
| `trekker_id` `role` `kind` `grp` `ui_order` `slot` `name_en` `name_ja` | サイトの `potentials` と同じ |
| `type` | 英語Wikiの種類（1=コア、2=サブ、3=汎用）。サイトの `kind` と別に持つ |
| `text_ja` | 日本語Wikiの説明文。数値は `16~63%` のような範囲（Lv1〜Lv6）。`(Max!)` が付いた数値は、Lv6から上がらない |
| `text_en` `nums_en` | 英語Wikiの説明文と、Lvごとの数値（古い値が多いので、参考） |
| `effects` | 計算ツールの効果の分類（下記） |

### effects

| 項目 | 意味 |
|---|---|
| `status` | `confirmed`（あなたが確認した）／`builtin`（計算ツールに組み込み。一部は実測で確認、仮の値を含む）／`draft`（手作業の下書き）／`review`（自動で一部だけ分類。要確認）／`none`（火力に影響しない、と自動で判断）／`unclassified`（未分類） |
| `e` | 効果の一覧。形は下記 |
| `off` | 既定で反映しない（条件が重い効果） |
| `note` `verified` `unclassified` | メモ・確認した方法・自動で分類できなかった文 |

効果 `e[]` の形（計算ツールの `sim_pots.js` の冒頭に説明があります）:

- `k`: 効果の種類 — `W`（属性ダメージ）`Bs`（スキル）`Bb`（通常）`Bu`（必殺）`mark`（印）`atkPct` `hpPct` `hpFlat` `atkFlat` `pen` `critRate` `critDmg` `taken`（敵の属性被ダメージ）`takenSkill` `takenBasic` `takenMark` `mult`（ヒット倍率）`count` `extra`（追加ヒット）
- 値: `n`（`nums_en` の番号）／`arr`（Lvごとの値、%）／`raw`（固定。割合は 0.15 = 15%）／`m`（追加ヒットの倍率%）
- `to`: 効く相手 — 省略=自身、`main` `all` `lux`（効果を持つ巡遊者と同じ属性の全員）`luxVers` `enemy`
- `stk`: 最大の重複数、`cond`: 条件、`ht`: 会心の対象（`basic` `skill` `ult` `mark`）、`tags`: 対象のヒット
- `ext: "cap"`: Lv6から上がらない（説明文の数値に `(Max!)` が付いているもの）。`over: {"7": …, "8": …, "9": …}`: Lv7〜9の値を直接指定

## 数値について（確認度）

- ゲーム内で確認できるのは **Lv1 と Lv6 だけ**。Lv2〜5 は、英語Wikiの表の値、または直線補間（未確認）。Lv7〜9 は、直前の増え方で延長した推定値です（`ext: "cap"` の数値は、Lv6のまま）。
- 日本語Wikiの数値は、ゲーム内の画面と一致することを、テレサ「飛水・爆撃」で確認済み。英語Wikiのコア素質の数値は、古い（約2.2〜2.3倍小さい）ものが多く、日本語Wikiの値を優先します。

## ライセンス・出典

- 説明文（`text_ja` `text_en`）は、元のWikiのライセンス・利用条件に従います。
- `effects`（効果の分類）は、このプロジェクト独自の内容です。

## 更新の手順

1. 素質の説明文を更新: `python tools/import_jp_wiki.py`
2. 効果の下書きを更新: `python tools/classify_effects.py`
3. 編集ページ（`edit.html`）で確認 → 書き出した内容を `data/spec_user.js` に貼る
4. 共有用のファイルを作り直す: `python tools/build_shared.py`
5. プリセット共有サイト側は、`data/shared/potentials.json` を、`trekker_id` / `role` / `name_en` で、自分のデータと突き合わせて取り込む
