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

export type AppState = {
  baseFrequency: number
  preset: PresetId
  isPlaying: boolean
  time: number
  playbackSpeed: number
  displayScale: number
  trailDuration: number
}
