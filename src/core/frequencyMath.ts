import type { FrequencyPoint } from '../types/harmonic'

const TWO_PI = Math.PI * 2

function assertFinitePositiveNumber(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite positive number`)
  }
}

export function frequencyToLayerAngle(frequency: number, baseFrequency: number) {
  // 数学カーネル側で入力を検証し、不正値は明示的に reject する
  assertFinitePositiveNumber(frequency, 'frequency')
  assertFinitePositiveNumber(baseFrequency, 'baseFrequency')

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
  assertFinitePositiveNumber(frequency, 'frequency')
  assertFinitePositiveNumber(displayScale, 'displayScale')

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
  const currentAngle = ((point.angle + rotationSpeed * time * playbackSpeed) % TWO_PI + TWO_PI) % TWO_PI
  const [x, , z] = positionOnDisk(radius, currentAngle, point.layer, 0)

  return [x, y, z]
}
