export type FrequencyPoint = {
  id: string
  label: string
  frequency: number
  ratioToBase: number
  layer: number
  angle: number
  color: string
}

export type TrailPoint = {
  pointId: string
  time: number
  position: [number, number, number]
}

export type TrailMap = Record<string, TrailPoint[]>

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

export type ExperimentRun = {
  id: string
  createdAt: string
  title: string
  note: string
  baseFrequency: number
  preset: PresetId
  playbackSpeed: number
  displayScale: number
  trailDuration: number
  points: FrequencyPoint[]
}
