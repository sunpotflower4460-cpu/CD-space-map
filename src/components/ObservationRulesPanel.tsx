import { useHarmonicStore } from '../store/useHarmonicStore'

/**
 * 現在の観測ルールをリアルタイムで表示するパネル。
 * 初見のユーザーでも「何を観測しているか」が分かるようにする。
 *
 * 表記の注意:
 * - 角度は UI 向けに度数（×360°）で表示しているが、内部数学（frequencyMath.ts）は
 *   ラジアン（×2π）で統一されている。これは意図的な表記の分離。
 * - layer が負のプリセット（octaves の 1/2f〜1/8f など）では、layer=0 より下方向の
 *   ディスクに点が配置される。
 */
export function ObservationRulesPanel() {
  const baseFrequency = useHarmonicStore((s) => s.baseFrequency)
  const trailDuration = useHarmonicStore((s) => s.trailDuration)
  const displayScale = useHarmonicStore((s) => s.displayScale)

  return (
    <details className="param-details observation-rules">
      <summary className="param-details-summary">観測ルール</summary>
      <ul className="obs-rules-list">
        <li>
          <span className="obs-rules-label">基準</span>
          <span className="obs-rules-value">{baseFrequency} Hz</span>
        </li>
        <li>
          <span className="obs-rules-label">配置</span>
          <span className="obs-rules-value">1周 = 1オクターブ（低音は下ディスク）</span>
        </li>
        <li>
          <span className="obs-rules-label">角度</span>
          {/* UI は度数（×360°）で表示。内部計算はラジアン（×2π）で行う。 */}
          <span className="obs-rules-value">log₂(f / f₀) の小数部 × 360°</span>
        </li>
        <li>
          <span className="obs-rules-label">軌跡</span>
          <span className="obs-rules-value">過去 {trailDuration} 秒の位置</span>
        </li>
        <li>
          <span className="obs-rules-label">表示スケール</span>
          <span className="obs-rules-value">{displayScale}（観測用の減速倍率）</span>
        </li>
      </ul>
    </details>
  )
}
