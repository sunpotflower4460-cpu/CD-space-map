import { Line } from '@react-three/drei'

import { getTrailOpacity, pruneTrail } from '../core/trailMath'
import type { FrequencyPoint, TrailMap } from '../types/harmonic'

/** グラデーション表現のために軌跡を分割するバンド数 */
const NUM_OPACITY_BANDS = 4

type TrailLinesProps = {
  point: FrequencyPoint
  trails: TrailMap
  currentTime: number
  trailDuration: number
}

/**
 * 各点の軌跡を1つのポリライン（または少数のバンド）として描画する。
 * セグメントごとに個別 Line を作成する方式を廃止し、ドローコールを削減している。
 */
export function TrailLines({
  point,
  trails,
  currentTime,
  trailDuration,
}: TrailLinesProps) {
  const visibleTrail = pruneTrail(trails[point.id] ?? [], currentTime, trailDuration)

  if (visibleTrail.length < 2) {
    return null
  }

  // 軌跡をバンドに分割して不透明度グラデーションを表現する
  const total = visibleTrail.length - 1
  const bandSize = Math.max(1, Math.ceil(total / NUM_OPACITY_BANDS))

  const bands: Array<{ points: [number, number, number][]; opacity: number }> = []
  for (let b = 0; b < NUM_OPACITY_BANDS; b++) {
    const start = b * bandSize
    const end = Math.min(start + bandSize + 1, visibleTrail.length)
    if (end - start < 2) continue

    const bandPoints = visibleTrail
      .slice(start, end)
      .map((tp) => tp.position as [number, number, number])

    const midIndex = Math.floor((start + end - 1) / 2)
    const opacity = getTrailOpacity(visibleTrail[midIndex].time, currentTime, trailDuration) * 0.2

    if (opacity > 0) {
      bands.push({ points: bandPoints, opacity })
    }
  }

  if (bands.length === 0) {
    return null
  }

  return (
    <>
      {bands.map((band, i) => (
        <Line
          key={i}
          points={band.points}
          color={point.color}
          lineWidth={1}
          opacity={band.opacity}
          transparent
          depthWrite={false}
        />
      ))}
    </>
  )
}
