import { create } from 'zustand'

import type { AppState, PresetId } from '../types/harmonic'

type HarmonicActions = {
  play: () => void
  pause: () => void
  rewind: () => void
  setPlaybackSpeed: (speed: number) => void
  setDisplayScale: (scale: number) => void
  setBaseFrequency: (frequency: number) => void
  setPreset: (preset: PresetId) => void
  setTime: (time: number) => void
  tick: (delta: number) => void
}

type HarmonicStoreState = AppState & HarmonicActions

export const useHarmonicStore = create<HarmonicStoreState>((set) => ({
  baseFrequency: 110,
  preset: 'harmonics',
  isPlaying: false,
  time: 0,
  playbackSpeed: 1,
  displayScale: 440,
  trailDuration: 3,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  rewind: () => set({ time: 0 }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setDisplayScale: (displayScale) => set({ displayScale }),
  setBaseFrequency: (baseFrequency) => set({ baseFrequency }),
  setPreset: (preset) => set({ preset }),
  setTime: (time) => set({ time }),
  tick: (delta) =>
    set((state) =>
      state.isPlaying
        ? {
            time: state.time + delta,
          }
        : state,
    ),
}))
