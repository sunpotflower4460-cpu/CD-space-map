import { useMemo } from 'react'

import { createFrequencyPoints } from '../core/presets'
import { createPointReadout } from '../core/pointReadout'
import { useHarmonicStore } from '../store/useHarmonicStore'

const RAD_TO_DEG = 180 / Math.PI

function formatAngleText(angleRadians: number) {
  return `${(angleRadians * RAD_TO_DEG).toFixed(1)}°`
}

function toEqualTemperamentReferenceRatio(ratioToBase: number) {
  const semitone = Math.round(Math.log2(ratioToBase) * 12)
  return 2 ** (semitone / 12)
}

export function PointReadoutPanel() {
  const baseFrequency = useHarmonicStore((s) => s.baseFrequency)
  const preset = useHarmonicStore((s) => s.preset)
  const selectedPointId = useHarmonicStore((s) => s.selectedPointId)

  const selectedPoint = useMemo(() => {
    if (selectedPointId == null) {
      return null
    }

    const points = createFrequencyPoints(baseFrequency, preset)
    return points.find((point) => point.id === selectedPointId) ?? null
  }, [baseFrequency, preset, selectedPointId])

  if (selectedPointId == null) {
    return (
      <section className="point-readout" aria-live="polite">
        <h2 className="notes-title">Point Readout</h2>
        <p className="notes-copy">点を選択すると、ratio / angle / layer / cents を表示します。</p>
      </section>
    )
  }

  if (selectedPoint == null) {
    return (
      <section className="point-readout" aria-live="polite">
        <h2 className="notes-title">Point Readout</h2>
        <p className="notes-copy">選択中の点が現在のプリセットに存在しません。</p>
      </section>
    )
  }

  const readout = createPointReadout(
    selectedPoint,
    baseFrequency,
    toEqualTemperamentReferenceRatio(selectedPoint.ratioToBase),
  )

  return (
    <section className="point-readout" aria-live="polite">
      <h2 className="notes-title">Point Readout</h2>
      <ul className="obs-rules-list">
        <li>
          <span className="obs-rules-label">点</span>
          <span className="obs-rules-value">{readout.label}</span>
        </li>
        <li>
          <span className="obs-rules-label">周波数</span>
          <span className="obs-rules-value">{readout.frequencyText} Hz</span>
        </li>
        <li>
          <span className="obs-rules-label">比</span>
          <span className="obs-rules-value">{readout.ratioText}</span>
        </li>
        <li>
          <span className="obs-rules-label">angle</span>
          <span className="obs-rules-value">{formatAngleText(selectedPoint.angle)}</span>
        </li>
        <li>
          <span className="obs-rules-label">layer</span>
          <span className="obs-rules-value">{readout.layer}</span>
        </li>
        <li>
          <span className="obs-rules-label">cents</span>
          <span className="obs-rules-value">{readout.centsText} ¢</span>
        </li>
      </ul>
    </section>
  )
}
