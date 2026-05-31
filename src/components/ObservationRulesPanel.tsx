import { useHarmonicStore } from '../store/useHarmonicStore'

/**
 * 現在の観測ルールをリアルタイムで表示するパネル。
 * 初見のユーザーでも「何を観測しているか」が分かるようにする。
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
          <span className="obs-rules-value">1周 = 1オクターブ</span>
        </li>
        <li>
          <span className="obs-rules-label">角度</span>
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
