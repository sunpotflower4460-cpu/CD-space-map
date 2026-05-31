import type { FrequencyPoint } from '../types/harmonic'

export type DiskLayerConfig = {
  layerIndex: number
  radius: number
  y: number
  opacity: number
}

const BASE_RADIUS = 1.55
const RADIUS_RANGE = 0.59
const MIN_RADIUS = 0.96
const LAYER_GAP = 0.49
const BASE_OPACITY = 0.18
const OPACITY_RANGE = 0.12

export function getLayerBounds(points: Pick<FrequencyPoint, 'layer'>[]) {
  if (points.length === 0) {
    return { minLayer: 0, maxLayer: 0 }
  }

  return {
    minLayer: Math.min(0, ...points.map((point) => point.layer)),
    maxLayer: Math.max(0, ...points.map((point) => point.layer)),
  }
}

/** ディスク層は layer=0 を中心に、正負の layer へ対称に広がる。 */
export function generateDiskLayers(minLayer: number, maxLayer: number): DiskLayerConfig[] {
  const furthestLayer = Math.max(Math.abs(minLayer), Math.abs(maxLayer), 1)
  const count = maxLayer - minLayer + 1

  return Array.from({ length: count }, (_, index) => {
    const layerIndex = minLayer + index
    const distance = Math.abs(layerIndex)
    const t = distance / furthestLayer

    return {
      layerIndex,
      radius: Math.max(MIN_RADIUS, BASE_RADIUS - t * RADIUS_RANGE),
      y: layerIndex * LAYER_GAP,
      opacity: BASE_OPACITY + (1 - t) * OPACITY_RANGE,
    }
  })
}
