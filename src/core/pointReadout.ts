import { frequencyToLayerAngle } from './frequencyMath'
import type { FrequencyPoint } from '../types/harmonic'

function assertFinitePositiveNumber(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite positive number`)
  }
}

function trimTrailingZeros(valueText: string) {
  if (!valueText.includes('.')) {
    return valueText
  }

  return valueText.replace(/\.?0+$/, '')
}

function toFractionText(value: number, maxDenominator = 128) {
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(value)) * 32

  for (let denominator = 1; denominator <= maxDenominator; denominator += 1) {
    const numerator = Math.round(value * denominator)
    if (Math.abs(value - numerator / denominator) <= tolerance) {
      return `${numerator}/${denominator}`
    }
  }

  return null
}

export const POINT_READOUT_ROUNDING = {
  frequencyHz: 2,
  ratioDecimal: 6,
  log2Difference: 4,
  centsOffset: 1,
} as const

export type PointReadout = {
  label: string
  frequencyHz: number
  frequencyText: string
  ratio: number
  ratioText: string
  log2Difference: number
  log2Text: string
  centsOffset: number
  centsText: string
  layer: number
}

export function calculateCentsOffset(observedValue: number, referenceValue: number) {
  assertFinitePositiveNumber(observedValue, 'observedValue')
  assertFinitePositiveNumber(referenceValue, 'referenceValue')

  return 1200 * Math.log2(observedValue / referenceValue)
}

export function formatRatioText(ratio: number) {
  assertFinitePositiveNumber(ratio, 'ratio')

  const fractionText = toFractionText(ratio)
  const decimalText = trimTrailingZeros(ratio.toFixed(POINT_READOUT_ROUNDING.ratioDecimal))

  return fractionText == null ? decimalText : `${fractionText} (${decimalText})`
}

export function createPointReadout(
  point: Pick<FrequencyPoint, 'label' | 'frequency' | 'ratioToBase' | 'layer'>,
  baseFrequency: number,
  referenceRatio = point.ratioToBase,
): PointReadout {
  assertFinitePositiveNumber(baseFrequency, 'baseFrequency')
  assertFinitePositiveNumber(referenceRatio, 'referenceRatio')

  const { h } = frequencyToLayerAngle(point.frequency, baseFrequency)
  const centsOffset = calculateCentsOffset(point.ratioToBase, referenceRatio)

  return {
    label: point.label,
    frequencyHz: point.frequency,
    frequencyText: point.frequency.toFixed(POINT_READOUT_ROUNDING.frequencyHz),
    ratio: point.ratioToBase,
    ratioText: formatRatioText(point.ratioToBase),
    log2Difference: h,
    log2Text: h.toFixed(POINT_READOUT_ROUNDING.log2Difference),
    centsOffset,
    centsText: centsOffset.toFixed(POINT_READOUT_ROUNDING.centsOffset),
    layer: point.layer,
  }
}
