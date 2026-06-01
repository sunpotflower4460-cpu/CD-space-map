import { describe, expect, it } from 'vitest'

import { generateDiskLayers, getLayerBounds, MIN_RADIUS } from '../layerLayout'
import { createFrequencyPoints } from '../presets'

describe('layerLayout', () => {
  it('点群から負layerを含む最小・最大layerを求める', () => {
    expect(
      getLayerBounds([
        { layer: -2 },
        { layer: 0 },
        { layer: 3 },
      ]),
    ).toEqual({ minLayer: -2, maxLayer: 3 })
  })

  it('layer=0 を中心に負layer/正layerのディスクを生成する', () => {
    const diskLayers = generateDiskLayers(-2, 1)

    expect(diskLayers.map((layer) => layer.layerIndex)).toEqual([-2, -1, 0, 1])

    const centerLayer = diskLayers.find((layer) => layer.layerIndex === 0)
    const lowerLayer = diskLayers.find((layer) => layer.layerIndex === -1)
    const upperLayer = diskLayers.find((layer) => layer.layerIndex === 1)

    expect(centerLayer?.y).toBe(0)
    expect(lowerLayer?.y).toBeLessThan(0)
    expect(upperLayer?.y).toBeGreaterThan(0)
    expect(centerLayer?.radius).toBeGreaterThan(lowerLayer?.radius ?? 0)
    expect(centerLayer?.radius).toBeGreaterThan(upperLayer?.radius ?? 0)
  })

  it('octaves プリセットは低音側のlayerも生成する', () => {
    const points = createFrequencyPoints(110, 'octaves')

    expect(points.some((point) => point.layer < 0)).toBe(true)
    expect(points.find((point) => point.label === '1/2f')?.layer).toBe(-1)
    expect(points.find((point) => point.label === '1/4f')?.layer).toBe(-2)
    expect(points.find((point) => point.label === '1/8f')?.layer).toBe(-3)
  })

  it('octaves レンジ(-3〜4)で全8ディスクが生成され、radius ≥ MIN_RADIUS が保証される', () => {
    // octaves プリセットの実際のレンジ: minLayer=-3, maxLayer=4
    const diskLayers = generateDiskLayers(-3, 4)

    expect(diskLayers).toHaveLength(8)
    expect(diskLayers.map((l) => l.layerIndex)).toEqual([-3, -2, -1, 0, 1, 2, 3, 4])

    // すべての層で radius ≥ MIN_RADIUS かつ opacity > 0 が成立する
    for (const layer of diskLayers) {
      expect(layer.radius).toBeGreaterThanOrEqual(MIN_RADIUS)
      expect(layer.opacity).toBeGreaterThan(0)
    }

    // furthestLayer = Math.max(3, 4, 1) = 4 → t=1 の最遠層 (layerIndex=4) で radius = MIN_RADIUS
    const furthestLayer = diskLayers.find((l) => l.layerIndex === 4)!
    expect(furthestLayer.radius).toBeCloseTo(MIN_RADIUS)
  })

  it('等距離の層（layer=-3 と layer=3）は同じ半径・透明度を持つ（中心距離による対称化）', () => {
    const diskLayers = generateDiskLayers(-3, 4)

    const layerMinus3 = diskLayers.find((l) => l.layerIndex === -3)!
    const layerPlus3 = diskLayers.find((l) => l.layerIndex === 3)!

    expect(layerMinus3.radius).toBeCloseTo(layerPlus3.radius)
    expect(layerMinus3.opacity).toBeCloseTo(layerPlus3.opacity)
  })

  it('octaves の全8点が diskLayerMap に存在し renderPoints から落ちない', () => {
    const points = createFrequencyPoints(110, 'octaves')
    const { minLayer, maxLayer } = getLayerBounds(points)
    const diskLayers = generateDiskLayers(minLayer, maxLayer)
    const diskLayerMap = new Map(diskLayers.map((l) => [l.layerIndex, l]))

    // すべての点に対応するディスクが存在する（HarmonicScene の renderPoints 相当）
    for (const point of points) {
      expect(
        diskLayerMap.has(point.layer),
        `layer ${point.layer} (${point.label}) が diskLayerMap に無い`,
      ).toBe(true)
    }
  })

  it.each([
    ['harmonics', 55],
    ['harmonics', 110],
    ['harmonics', 220],
    ['harmonics', 440],
    ['octaves', 55],
    ['octaves', 110],
    ['octaves', 220],
    ['octaves', 440],
    ['simpleRatios', 55],
    ['simpleRatios', 110],
    ['simpleRatios', 220],
    ['simpleRatios', 440],
  ] as const)(
    'スモークテスト: preset=%s baseFreq=%d で全点が diskLayerMap に存在する',
    (presetId, baseFreq) => {
      const points = createFrequencyPoints(baseFreq, presetId)
      const { minLayer, maxLayer } = getLayerBounds(points)
      const diskLayers = generateDiskLayers(minLayer, maxLayer)
      const diskLayerMap = new Map(diskLayers.map((l) => [l.layerIndex, l]))

      for (const point of points) {
        expect(diskLayerMap.has(point.layer)).toBe(true)
      }
    },
  )
})
