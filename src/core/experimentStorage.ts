import type { ExperimentRun, FrequencyPoint, PresetId } from '../types/harmonic'

const STORAGE_KEY = 'cd_space_map_experiments_v1'
const PRESET_IDS: PresetId[] = ['harmonics', 'octaves', 'simpleRatios']

function isValidFrequencyPoint(item: unknown): item is FrequencyPoint {
  if (!item || typeof item !== 'object') return false
  const point = item as Record<string, unknown>
  return (
    typeof point.id === 'string' &&
    typeof point.label === 'string' &&
    typeof point.frequency === 'number' &&
    typeof point.ratioToBase === 'number' &&
    typeof point.layer === 'number' &&
    typeof point.angle === 'number' &&
    typeof point.color === 'string'
  )
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function writeExperiments(experiments: ExperimentRun[]) {
  if (!canUseLocalStorage()) {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments))
  } catch {
    // noop
  }
}

/** 最低限のschema validationでExperimentRunとして安全に扱えるか確認する */
function isValidExperimentRun(item: unknown): item is ExperimentRun {
  if (!item || typeof item !== 'object') return false
  const run = item as Record<string, unknown>
  const version = run.version
  // version===1 は現行、version==null は legacy(v0)として許可。その他は未対応として除外。
  const isSupportedVersion = version === 1 || version == null
  const hasValidPoints =
    run.points == null || (Array.isArray(run.points) && run.points.every(isValidFrequencyPoint))

  return (
    isSupportedVersion &&
    typeof run.id === 'string' &&
    typeof run.createdAt === 'string' &&
    typeof run.title === 'string' &&
    typeof run.note === 'string' &&
    typeof run.baseFrequency === 'number' &&
    typeof run.preset === 'string' &&
    PRESET_IDS.includes(run.preset as PresetId) &&
    typeof run.playbackSpeed === 'number' &&
    typeof run.displayScale === 'number' &&
    typeof run.trailDuration === 'number' &&
    hasValidPoints
  )
}

export function loadExperiments(): ExperimentRun[] {
  if (!canUseLocalStorage()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    // 壊れたエントリは無視し、有効なもののみ返す
    return parsed.filter(isValidExperimentRun)
  } catch {
    return []
  }
}

export function saveExperiment(run: ExperimentRun): void {
  const runs = loadExperiments()
  writeExperiments([run, ...runs])
}

export function deleteExperiment(id: string): void {
  const runs = loadExperiments()
  writeExperiments(runs.filter((run) => run.id !== id))
}

export function exportExperimentsAsJson(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const runs = loadExperiments()
  const blob = new Blob([JSON.stringify(runs, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const link = document.createElement('a')
  link.href = url
  link.download = `cd-space-map-experiments-${date}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
