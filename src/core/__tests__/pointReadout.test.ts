import { describe, expect, it } from 'vitest'

import {
  POINT_READOUT_ROUNDING,
  calculateCentsOffset,
  createPointReadout,
  formatRatioText,
} from '../pointReadout'

describe('calculateCentsOffset', () => {
  it('同値同士の差は 0 セント', () => {
    expect(calculateCentsOffset(1, 1)).toBeCloseTo(0)
    expect(calculateCentsOffset(440, 440)).toBeCloseTo(0)
  })

  it('純正完全五度と平均律完全五度の差をセントで返す', () => {
    const justFifth = 3 / 2
    const equalTemperedFifth = 2 ** (7 / 12)

    expect(calculateCentsOffset(justFifth, equalTemperedFifth)).toBeCloseTo(1.9550008654)
  })

  it('純正長三度と平均律長三度の差を負値で返す', () => {
    const justMajorThird = 5 / 4
    const equalTemperedMajorThird = 2 ** (4 / 12)

    expect(calculateCentsOffset(justMajorThird, equalTemperedMajorThird)).toBeCloseTo(-13.6862861352)
  })

  it('不正入力は throw する', () => {
    expect(() => calculateCentsOffset(0, 1)).toThrow(RangeError)
    expect(() => calculateCentsOffset(1, 0)).toThrow(RangeError)
    expect(() => calculateCentsOffset(Number.NaN, 1)).toThrow(RangeError)
    expect(() => calculateCentsOffset(1, Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })
})

describe('formatRatioText', () => {
  it('単純比は分数と小数で表す', () => {
    expect(formatRatioText(3 / 2)).toBe('3/2 (1.5)')
    expect(formatRatioText(1 / 8)).toBe('1/8 (0.125)')
  })

  it('近い単純分数がない値は小数のみで表す', () => {
    expect(formatRatioText(Math.sqrt(2))).toBe('1.414214')
  })
})

describe('createPointReadout', () => {
  it('PointReadout 用の観測値を整理する', () => {
    const point = {
      label: '完全五度',
      frequency: 165,
      ratioToBase: 3 / 2,
      layer: 0,
    }
    const readout = createPointReadout(point, 110, 2 ** (7 / 12))

    expect(POINT_READOUT_ROUNDING).toEqual({
      frequencyHz: 2,
      ratioDecimal: 6,
      log2Difference: 4,
      centsOffset: 1,
    })
    expect(readout.label).toBe('完全五度')
    expect(readout.frequencyHz).toBe(165)
    expect(readout.frequencyText).toBe('165.00')
    expect(readout.ratio).toBe(3 / 2)
    expect(readout.ratioText).toBe('3/2 (1.5)')
    expect(readout.log2Difference).toBeCloseTo(Math.log2(3 / 2), 12)
    expect(readout.log2Text).toBe('0.5850')
    expect(readout.centsOffset).toBeCloseTo(1.9550008654, 9)
    expect(readout.centsText).toBe('2.0')
    expect(readout.layer).toBe(0)
  })
})
