# Pointillism Art

画像を点描化し、マウス操作で彩度・明度を変えられる p5.js インタラクティブ作品

An interactive p5.js sketch that turns images into pointillism and lets you adjust saturation and brightness with the mouse.

## Features / 機能

- 任意の画像を選択して点描表示（縦長・横長両対応）
- 画像を最大辺 **128px** にリサイズし、ピクセルごとにスキャン
- 各点の色は元ピクセルの色（HSB）に対応
- マウス左右で **Saturation**（白黒 〜 元画像）
- マウス上下で **Brightness**（白 〜 中間色 〜 黒）
- 明度に応じて点のサイズが変化（明るいほど小さく、暗くても最小点は残る）
- わずかなランダムオフセットで手描き感のある点描
- `S` キーでキャンバスを PNG 保存

## Controls / 操作

| 操作 | 効果 |
| --- | --- |
| 画像を選択 | 点描の元画像を変更 |
| マウス左右 | 彩度（左: 低 / 右: 高） |
| マウス上下 | 明度（上: 白寄り / 下: 黒寄り） |
| `S` | 画像を保存 |

### Brightness mapping / 明度マップ

マウス位置（上=0% 〜 下=100%）に対する効果量（最大100）:

| マウス位置 | 効果量 | 明度の変化 |
| --- | --- | --- |
| 0% → 20% | 1 → 40 | 白 → 中間色（元ピクセル） |
| 20% → 80% | 40 → 60 | 中間色を維持 |
| 80% → 100% | 60 → 100 | 中間色 → 黒 |

## Getting Started / 使い方

### ローカルで開く

```bash
# プロジェクトフォルダで簡易サーバを起動
python3 -m http.server 8765
```

ブラウザで [http://127.0.0.1:8765/](http://127.0.0.1:8765/) を開く。

> `file://` で直接開くと画像読み込みに失敗することがあるため、ローカルサーバ経由を推奨します。

### GitHub Pages で公開する

1. このリポジトリを GitHub に push する
2. **Settings → Pages**
3. Source を `Deploy from a branch` にし、`main`（または `master`）の `/ (root)` を選択
4. 数分後、次のような URL で公開される  
   `https://<username>.github.io/<repository-name>/`

## Project Structure / 構成

```
-Pointillism/
├── index.html      # ページ本体・UI
├── sketch.js       # p5.js スケッチ
├── data/
│   └── pic.png     # 初期表示用サンプル画像
└── README.md
```

## Tech / 技術

- [p5.js](https://p5js.org/)（CDN）
- HTML / CSS / JavaScript

## License

MIT（必要に応じて変更してください）
