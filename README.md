# CD-space-map / CD星図 / Harmonic Disk

[![CI](https://github.com/sunpotflower4460-cpu/CD-space-map/actions/workflows/ci.yml/badge.svg)](https://github.com/sunpotflower4460-cpu/CD-space-map/actions/workflows/ci.yml)

周波数の関係を、立体の円盤・回転・軌跡として観測するアプリです。

## 何を観測するアプリか

複数の周波数点が、基準周波数を中心に円盤の上を回転します。  
1周がちょうど1オクターブに対応し、周波数比は常に正確に保たれます。  
点の軌跡は時間の記憶として残り、周波数どうしの関係を視覚的に確認できます。

## MVPの核

| 原則 | 意味 |
|------|------|
| 中心は変わらない | 基準周波数を固定した不変点 |
| 1周 = 1オクターブ | 角度が周波数の対数比に対応する |
| 周波数比は正確に保つ | 表示ズレなく数学的に正確な配置 |
| 軌跡は時間の記憶 | 点の軌跡が過去の動きを可視化する |
| 観測メモで再現性を残す | 条件を保存して後から参照できる |

## 画面の見方

| 要素 | 説明 |
|------|------|
| 中心点（コア） | 固定された基準点。動かない |
| ディスク（円盤） | 各オクターブ層に対応する円盤。layer=0 が基準面で、上方向（正 layer）が高音、下方向（負 layer）が低音 |
| 周波数点 | 各周波数を表す点。周波数比に基づいて回転する |
| 軌跡 | 点が残す時間的な痕跡 |

## 主な機能

- 複数ディスクの3D表示（OrbitControls でドラッグ回転・ズーム可）
- 周波数点の配置（倍音 / オクターブ / 単純比 プリセット）
- 周波数比に基づく正確な回転
- 軌跡表示（長さ調整可）
- 再生 / 停止 / 巻き戻し
- 基準周波数の切替（55 / 110 / 220 / 440 Hz）
- 表示速度の切替（0.25x / 0.5x / 1x / 2x）
- 点選択時の Point Readout（ratio / angle / layer / cents）
- 観測メモ保存（タイトル・メモを localStorage に記録）
- 実験リスト（保存した条件の読み込み・削除・JSON エクスポート）

### 用語メモ

- **displayScale**: 実周波数を可視化用の回転速度に変換するための減速基準値です。  
  回転速度は `frequency / displayScale × 2π` で計算され、周波数比は保ったまま全体の見やすさだけを調整します。

## 技術スタック

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# テスト（vitest）
npm test

# リント（ESLint）
npm run lint
```

## デモ

**https://sunpotflower4460-cpu.github.io/CD-space-map/**

（main ブランチへの push ごとに自動更新されます）

## スクリーンショット

現在準備中です。
