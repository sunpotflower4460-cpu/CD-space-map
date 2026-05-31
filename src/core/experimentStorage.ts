import type { ExperimentRun } from '../types/harmonic'

const STORAGE_KEY = 'cd_space_map_experiments_v1'

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
  return (
    typeof run.id === 'string' &&
    typeof run.createdAt === 'string' &&
    typeof run.title === 'string' &&
    typeof run.baseFrequency === 'number' &&
    typeof run.preset === 'string' &&
    typeof run.playbackSpeed === 'number' &&
    typeof run.displayScale === 'number' &&
    typeof run.trailDuration === 'number'
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
