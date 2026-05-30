export type FrequencyPoint = {
  id: string
  label: string
  frequency: number
  ratioToBase: number
  layer: number
  angle: number
  color: string
}

export type PresetId = 'harmonics' | 'octaves' | 'simpleRatios'
