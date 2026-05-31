import { describe, expect, it } from 'vitest'

import { frequencyToLayerAngle } from '../frequencyMath'

/**
 * 数学カーネルのテスト。
 * README の「周波数比は正確に保つ」をコード上で保証する。
 *
 * frequencyToLayerAngle(f, f0) の契約:
 *   h = log2(f / f0)
 *   layer = floor(h)
 *   angle = frac(h) * 2π   (0 ≦ angle < 2π)
 */
describe('frequencyToLayerAngle', () => {
  const f0 = 110

  it('基準周波数 → h=0, layer=0, angle=0', () => {
    const { h, layer, angle } = frequencyToLayerAngle(f0, f0)
    expect(h).toBeCloseTo(0)
    expect(layer).toBe(0)
    expect(angle).toBeCloseTo(0)
  })

  it('1オクターブ上 → h=1, layer=1, angle=0', () => {
    const { h, layer, angle } = frequencyToLayerAngle(f0 * 2, f0)
    expect(h).toBeCloseTo(1)
    expect(layer).toBe(1)
    expect(angle).toBeCloseTo(0)
  })

  it('2オクターブ上 → h=2, layer=2, angle=0', () => {
    const { h, layer, angle } = frequencyToLayerAngle(f0 * 4, f0)
    expect(h).toBeCloseTo(2)
    expect(layer).toBe(2)
    expect(angle).toBeCloseTo(0)
  })

  it('完全五度 (3/2) → layer=0, angle=frac(log2(3/2))*2π', () => {
    const f = f0 * (3 / 2)
    const { h, layer, angle } = frequencyToLayerAngle(f, f0)
    const expectedH = Math.log2(3 / 2)
    expect(h).toBeCloseTo(expectedH)
    expect(layer).toBe(0)
    // frac(h) * 2π
    expect(angle).toBeCloseTo((expectedH - 0) * Math.PI * 2)
  })

  it('オクターブ境界上の周波数 (5倍音) → layer=floor(log2(5)), angle正常', () => {
    const f = f0 * 5
    const { h, layer, angle } = frequencyToLayerAngle(f, f0)
    const expectedH = Math.log2(5)
    const expectedLayer = Math.floor(expectedH) // 2
    const expectedAngle = (expectedH - expectedLayer) * Math.PI * 2
    expect(h).toBeCloseTo(expectedH)
    expect(layer).toBe(expectedLayer)
    expect(angle).toBeCloseTo(expectedAngle)
  })

  it('angle は常に [0, 2π) の範囲', () => {
    const cases = [1, 2, 3, 4, 5, 6, 7, 8, 3 / 2, 5 / 4, 4 / 3, 7 / 4]
    for (const ratio of cases) {
      const { angle } = frequencyToLayerAngle(f0 * ratio, f0)
      expect(angle).toBeGreaterThanOrEqual(0)
      expect(angle).toBeLessThan(Math.PI * 2)
    }
  })
})
