import { frequencyToLayerAngle } from './frequencyMath'
import type { FrequencyPoint, PresetId } from '../types/harmonic'

type PresetEntry = {
  ratio: number
  label: string
}

const presets: Record<PresetId, PresetEntry[]> = {
  harmonics: [
    { ratio: 1, label: '1f' },
    { ratio: 2, label: '2f' },
    { ratio: 3, label: '3f' },
    { ratio: 4, label: '4f' },
    { ratio: 5, label: '5f' },
    { ratio: 6, label: '6f' },
    { ratio: 7, label: '7f' },
    { ratio: 8, label: '8f' },
  ],
  octaves: [
    { ratio: 1 / 8, label: '1/8f' },
    { ratio: 1 / 4, label: '1/4f' },
    { ratio: 1 / 2, label: '1/2f' },
    { ratio: 1, label: '1f' },
    { ratio: 2, label: '2f' },
    { ratio: 4, label: '4f' },
    { ratio: 8, label: '8f' },
    { ratio: 16, label: '16f' },
  ],
  simpleRatios: [
    { ratio: 1 / 1, label: '基準' },
    { ratio: 6 / 5, label: '短三度' },
    { ratio: 5 / 4, label: '長三度' },
    { ratio: 4 / 3, label: '完全四度' },
    { ratio: 3 / 2, label: '完全五度' },
    { ratio: 7 / 4, label: '自然七度系' },
    { ratio: 2 / 1, label: 'オクターブ' },
  ],
}

function ratioColor(index: number, total: number) {
  const hue = 200 + (index / Math.max(total, 1)) * 140
  return `hsl(${hue}, 78%, 72%)`
}

export function createFrequencyPoints(baseFrequency: number, presetId: PresetId): FrequencyPoint[] {
  const entries = presets[presetId]

  return entries.map((entry, index) => {
    const frequency = baseFrequency * entry.ratio
    const { layer, angle } = frequencyToLayerAngle(frequency, baseFrequency)

    return {
      id: `${presetId}-${entry.label}-${entry.ratio}`,
      label: entry.label,
      frequency,
      ratioToBase: entry.ratio,
      layer,
      angle,
      color: ratioColor(index, entries.length),
    }
  })
}
