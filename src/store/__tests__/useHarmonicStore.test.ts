import { beforeEach, describe, expect, it } from 'vitest'

import { TRAIL_SAMPLE_INTERVAL } from '../../core/trailMath'
import type { TrailPoint } from '../../types/harmonic'
import { useHarmonicStore } from '../useHarmonicStore'

describe('useHarmonicStore advanceTick', () => {
  beforeEach(() => {
    useHarmonicStore.setState({
      baseFrequency: 110,
      preset: 'harmonics',
      isPlaying: false,
      time: 0,
      playbackSpeed: 1,
      displayScale: 440,
      trailDuration: 3,
      trails: {},
      lastTrailSampleTime: null,
      experiments: [],
    })
  })

  it('再生中は time と trail を advanceTick で同時に更新する', () => {
    const trailSnapshot: TrailPoint[] = [{ pointId: 'p1', time: 1, position: [1, 2, 3] }]
    useHarmonicStore.setState({ isPlaying: true, time: 1 })

    useHarmonicStore.getState().advanceTick(0.5, trailSnapshot)
    const state = useHarmonicStore.getState()

    expect(state.time).toBeCloseTo(1.5)
    expect(state.trails.p1).toEqual(trailSnapshot)
    expect(state.lastTrailSampleTime).toBe(1)
  })

  it('サンプリング間隔未満では trail を更新せずに time のみ進める', () => {
    const initialTrails = {
      p1: [{ pointId: 'p1', time: 1, position: [1, 2, 3] as [number, number, number] }],
    }
    const trailSnapshot: TrailPoint[] = [{ pointId: 'p1', time: 1, position: [9, 8, 7] }]
    useHarmonicStore.setState({
      isPlaying: true,
      time: 1,
      trails: initialTrails,
      lastTrailSampleTime: 1,
    })

    useHarmonicStore.getState().advanceTick(TRAIL_SAMPLE_INTERVAL / 2, trailSnapshot)
    const state = useHarmonicStore.getState()

    expect(state.time).toBeCloseTo(1 + TRAIL_SAMPLE_INTERVAL / 2)
    expect(state.trails).toBe(initialTrails)
    expect(state.lastTrailSampleTime).toBe(1)
  })

  it('旧 action (tick / recordTrailSnapshot) を公開しない', () => {
    const state = useHarmonicStore.getState() as unknown as Record<string, unknown>

    expect(state.tick).toBeUndefined()
    expect(state.recordTrailSnapshot).toBeUndefined()
  })
})
