import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteExperiment, loadExperiments, saveExperiment } from '../experimentStorage'
import type { ExperimentRun, FrequencyPoint } from '../../types/harmonic'

const STORAGE_KEY = 'cd_space_map_experiments_v1'

function createRun(overrides: Partial<ExperimentRun> = {}): ExperimentRun {
  return {
    version: 1,
    id: 'run-1',
    createdAt: '2026-05-31T00:00:00.000Z',
    title: 'test',
    note: 'note',
    baseFrequency: 110,
    preset: 'harmonics',
    playbackSpeed: 1,
    displayScale: 440,
    trailDuration: 3,
    ...overrides,
  }
}

describe('experimentStorage', () => {
  beforeEach(() => {
    const storage = new Map<string, string>()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('新仕様の points なしデータを保存・読み込みできる', () => {
    saveExperiment(createRun())
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(raw ?? '[]') as Array<Record<string, unknown>>

    expect(parsed).toHaveLength(1)
    expect(parsed[0]).not.toHaveProperty('points')
    expect(loadExperiments()).toEqual([createRun()])
  })

  it('旧仕様の points ありデータも読み込める', () => {
    const legacyPoint: FrequencyPoint = {
      id: 'p1',
      label: '1:1',
      frequency: 110,
      ratioToBase: 1,
      layer: 0,
      angle: 0,
      color: '#fff',
    }
    const modernRun = createRun({ id: 'run-modern' })
    const legacyRun = createRun({ id: 'run-legacy', points: [legacyPoint] })

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([modernRun, legacyRun]))

    expect(loadExperiments()).toEqual([modernRun, legacyRun])
  })

  it('不正な points を持つ旧データは除外する', () => {
    const validRun = createRun({ id: 'run-valid' })
    const invalidLegacyRun = { ...createRun({ id: 'run-invalid' }), points: [{ id: 1 }] }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([validRun, invalidLegacyRun]))

    expect(loadExperiments()).toEqual([validRun])
  })

  it('再生条件が不正なデータは除外する', () => {
    const validRun = createRun({ id: 'run-valid' })
    const invalidBaseFrequency = createRun({ id: 'run-base', baseFrequency: 0 })
    const invalidDisplayScale = createRun({ id: 'run-scale', displayScale: Number.POSITIVE_INFINITY })
    const invalidTrailDuration = createRun({ id: 'run-trail', trailDuration: Number.NaN })

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([validRun, invalidBaseFrequency, invalidDisplayScale, invalidTrailDuration]),
    )

    expect(loadExperiments()).toEqual([validRun])
  })

  it('削除が従来通り動作する', () => {
    saveExperiment(createRun({ id: 'run-1' }))
    saveExperiment(createRun({ id: 'run-2' }))

    deleteExperiment('run-1')

    const loaded = loadExperiments()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('run-2')
  })
})
