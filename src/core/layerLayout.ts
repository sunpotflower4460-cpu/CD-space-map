import type { FrequencyPoint } from '../types/harmonic'

export type DiskLayerConfig = {
  layerIndex: number
  radius: number
  y: number
  opacity: number
}

const BASE_RADIUS = 1.55
const RADIUS_RANGE = 0.59
/** 最も遠い層でも潰れないよう保証する最小半径。テストからも参照可。 */
export const MIN_RADIUS = 0.96
const LAYER_GAP = 0.49
const BASE_OPACITY = 0.18
const OPACITY_RANGE = 0.12

/**
 * 点群の最小・最大 layer を返す。
 *
 * 設計方針: layer=0 を「常に基準面として描く」仕様にしているため、
 * Math.min/max に 0 を混ぜることで全点が正 layer のみ（例: harmonics 0〜3）の
 * 場合でも minLayer=0 が保証される。
 * 将来「全点が負 layer のみ」のプリセットを追加しても、正 layer 側に
 * 空ディスクが生じるだけで描画は壊れない。この挙動が不要になった場合は
 * Math.min(0, ...) / Math.max(0, ...) の 0 を除去すること。
 */
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
