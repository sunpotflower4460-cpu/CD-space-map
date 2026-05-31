import { create } from 'zustand'

import {
  deleteExperiment,
  exportExperimentsAsJson,
  loadExperiments,
  saveExperiment,
} from '../core/experimentStorage'
import { createFrequencyPoints } from '../core/presets'
import { appendTrailSnapshot, shouldSampleTrail } from '../core/trailMath'
import type { AppState, ExperimentRun, PresetId, TrailMap, TrailPoint } from '../types/harmonic'

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
  saveExperimentRun: (title: string, note: string) => void
  loadExperimentRuns: () => void
  deleteExperimentRun: (id: string) => void
  loadExperimentRun: (id: string) => void
  exportExperiments: () => void
}

type HarmonicStoreState = AppState & {
  trails: TrailMap
  lastTrailSampleTime: number | null
  experiments: ExperimentRun[]
} & HarmonicActions

function createRunId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `run-${Date.now()}`
}

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
  experiments: loadExperiments(),
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
  saveExperimentRun: (title, note) =>
    set((state) => {
      const run: ExperimentRun = {
        id: createRunId(),
        createdAt: new Date().toISOString(),
        title: title.trim() || '無題の観測',
        note: note.trim(),
        baseFrequency: state.baseFrequency,
        preset: state.preset,
        playbackSpeed: state.playbackSpeed,
        displayScale: state.displayScale,
        trailDuration: state.trailDuration,
        points: createFrequencyPoints(state.baseFrequency, state.preset),
      }

      saveExperiment(run)
      return { experiments: loadExperiments() }
    }),
  loadExperimentRuns: () => set({ experiments: loadExperiments() }),
  deleteExperimentRun: (id) => {
    deleteExperiment(id)
    set({ experiments: loadExperiments() })
  },
  loadExperimentRun: (id) =>
    set((state) => {
      const run = state.experiments.find((item) => item.id === id)
      if (!run) {
        return state
      }

      return {
        baseFrequency: run.baseFrequency,
        preset: run.preset,
        playbackSpeed: run.playbackSpeed,
        displayScale: run.displayScale,
        trailDuration: run.trailDuration,
        isPlaying: false,
        time: 0,
        trails: {},
        lastTrailSampleTime: null,
      }
    }),
  exportExperiments: () => exportExperimentsAsJson(),
}))
