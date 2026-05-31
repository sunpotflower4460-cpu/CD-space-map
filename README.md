# CD-space-map

CD星図 / Harmonic Disk は、周波数の関係を、立体の円盤・回転・軌跡として観測するアプリです。

## MVPの核

- 中心は変わらない
- 1周 = 1オクターブ
- 周波数比は正確に保つ
- 軌跡は時間の記憶

## 実装順

- Phase -1: プロジェクト初期化
- Phase 0: 原則と数学カーネル
- Phase 1: 中心点と複数ディスク
- Phase 2: 周波数点配置
- Phase 3: 正確な比率回転
- Phase 4: 軌跡表示
- Phase 5: 観測操作UI
- Phase 6: 観測メモ保存

## 技術スタック

- Vite
- React
- TypeScript
- Three.js
- React Three Fiber
- @react-three/drei
- Zustand

## 起動方法

\`\`\`bash
npm install
npm run dev
\`\`\`

ビルド:

\`\`\`bash
npm run build
\`\`\`

テスト:

\`\`\`bash
npm test
\`\`\`
