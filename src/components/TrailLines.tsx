import { getTrailOpacity, pruneTrail } from '../core/trailMath'
import type { FrequencyPoint, TrailMap } from '../types/harmonic'

type TrailLinesProps = {
  point: FrequencyPoint
  trails: TrailMap
  currentTime: number
  trailDuration: number
}

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

  return (
    <group>
      {visibleTrail.slice(1).map((trailPoint, index) => {
        const start = visibleTrail[index]
        const opacity = getTrailOpacity(trailPoint.time, currentTime, trailDuration) * 0.2

        if (opacity <= 0) {
          return null
        }

        return (
          <line key={`${point.id}-${trailPoint.time}-${index}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([...start.position, ...trailPoint.position]), 3]}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={point.color}
              transparent
              opacity={opacity}
              depthWrite={false}
            />
          </line>
        )
      })}
    </group>
  )
}
