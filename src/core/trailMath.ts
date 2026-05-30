import type { TrailMap, TrailPoint } from '../types/harmonic'

export const TRAIL_SAMPLE_INTERVAL = 1 / 24

export function trailCutoffTime(currentTime: number, trailDuration: number) {
  return currentTime - trailDuration
}

export function pruneTrail(trail: TrailPoint[], currentTime: number, trailDuration: number) {
  if (trailDuration <= 0) {
    return []
  }

  const cutoff = trailCutoffTime(currentTime, trailDuration)
  return trail.filter((point) => point.time >= cutoff)
}

export function shouldSampleTrail(
  lastTrailSampleTime: number | null,
  currentTime: number,
  sampleInterval = TRAIL_SAMPLE_INTERVAL,
) {
  return lastTrailSampleTime === null || currentTime - lastTrailSampleTime >= sampleInterval
}

export function appendTrailSnapshot(
  trailMap: TrailMap,
  snapshot: TrailPoint[],
  currentTime: number,
  trailDuration: number,
): TrailMap {
  if (trailDuration <= 0 || snapshot.length === 0) {
    return {}
  }

  const nextTrailMap = Object.fromEntries(
    Object.entries(trailMap).map(([pointId, trail]) => [
      pointId,
      pruneTrail(trail, currentTime, trailDuration),
    ]),
  ) as TrailMap

  snapshot.forEach((point) => {
    nextTrailMap[point.pointId] = pruneTrail(
      [...(nextTrailMap[point.pointId] ?? []), point],
      currentTime,
      trailDuration,
    )
  })

  return nextTrailMap
}

export function getTrailOpacity(pointTime: number, currentTime: number, trailDuration: number) {
  if (trailDuration <= 0) {
    return 0
  }

  const age = Math.max(currentTime - pointTime, 0)
  return Math.max(0, Math.min(1, 1 - age / trailDuration))
}
