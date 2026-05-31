import { create } from 'zustand'

import { appendTrailSnapshot, shouldSampleTrail } from '../core/trailMath'
import type { AppState, PresetId, TrailMap, TrailPoint } from '../types/harmonic'

type HarmonicActions = {
  play: () => void
  pause: () => void
  rewind: () => void
  setPlaybackSpeed: (speed: number) => void
  setDisplayScale: (scale: number) => void
  setBaseFrequency: (frequency: number) => void
  setPreset: (preset: PresetId) => void
  setTrailDuration: (duration: number) => void
  setTime: (time: number) => void
  tick: (delta: number) => void
  recordTrailSnapshot: (trailPoints: TrailPoint[], currentTime: number) => void
  clearTrails: () => void
}

type HarmonicStoreState = AppState & {
  trails: TrailMap
  lastTrailSampleTime: number | null
} & HarmonicActions

export const useHarmonicStore = create<HarmonicStoreState>((set) => ({
  baseFrequency: 110,
  preset: 'harmonics',
  isPlaying: false,
  time: 0,
  playbackSpeed: 1,
  displayScale: 440,
  trailDuration: 3,
  trails: {},
  lastTrailSampleTime: null,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  rewind: () => set({ time: 0, trails: {}, lastTrailSampleTime: null }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setDisplayScale: (displayScale) => set({ displayScale }),
  setBaseFrequency: (baseFrequency) => set({ baseFrequency }),
  setPreset: (preset) => set({ preset }),
  setTrailDuration: (trailDuration) => set({ trailDuration }),
  setTime: (time) => set({ time }),
  tick: (delta) =>
    set((state) =>
      state.isPlaying
        ? {
            time: state.time + delta,
          }
        : state,
    ),
  recordTrailSnapshot: (trailPoints, currentTime) =>
    set((state) => {
      if (!shouldSampleTrail(state.lastTrailSampleTime, currentTime)) {
        return state
      }

      return {
        trails: appendTrailSnapshot(
          state.trails,
          trailPoints,
          currentTime,
          state.trailDuration,
        ),
        lastTrailSampleTime: currentTime,
      }
    }),
  clearTrails: () => set({ trails: {}, lastTrailSampleTime: null }),
}))
