import type { FrequencyPoint } from '../types/harmonic'

const TWO_PI = Math.PI * 2

export function frequencyToLayerAngle(frequency: number, baseFrequency: number) {
  const h = Math.log2(frequency / baseFrequency)
  const layer = Math.floor(h)
  const frac = h - layer
  const angle = frac * TWO_PI

  return { h, layer, angle }
}

export function frequencyToRotationSpeed(
  frequency: number,
  displayScale: number,
) {
  return (frequency / displayScale) * TWO_PI
}

export function positionOnDisk(
  radius: number,
  angle: number,
  layer: number,
  layerGap: number,
): [number, number, number] {
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const y = layer * layerGap

  return [x, y, z]
}

export function getFrequencyPointPosition(
  point: FrequencyPoint,
  radius: number,
  y: number,
  time: number,
  playbackSpeed: number,
  displayScale: number,
): [number, number, number] {
  const rotationSpeed = frequencyToRotationSpeed(point.frequency, displayScale)
  // mod TWO_PI で長時間再生時の浮動小数点精度劣化を防ぐ
  const currentAngle = (point.angle + (rotationSpeed * time * playbackSpeed) % TWO_PI)
  const [x, , z] = positionOnDisk(radius, currentAngle, point.layer, 0)

  return [x, y, z]
}
