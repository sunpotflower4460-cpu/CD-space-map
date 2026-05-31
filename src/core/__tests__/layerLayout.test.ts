import { describe, expect, it } from 'vitest'

import { generateDiskLayers, getLayerBounds } from '../layerLayout'
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
})
