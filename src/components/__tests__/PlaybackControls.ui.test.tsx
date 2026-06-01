// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useHarmonicStore } from '../../store/useHarmonicStore'
import { PlaybackControls } from '../PlaybackControls'

describe('PlaybackControls UI', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    useHarmonicStore.setState({
      baseFrequency: 110,
      preset: 'harmonics',
      isPlaying: false,
      time: 2.5,
      playbackSpeed: 1,
      displayScale: 440,
      trailDuration: 3,
      trails: { p1: [{ pointId: 'p1', time: 1, position: [1, 2, 3] }] },
      lastTrailSampleTime: 1,
      experiments: [],
    })
  })

  it('storeの再生状態をボタン表示に反映する', () => {
    render(<PlaybackControls />)

    const playButton = screen.getByRole('button', { name: '再生' })
    expect(playButton.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(playButton)
    expect(screen.getByRole('button', { name: '停止' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('巻き戻しボタンでstore状態を初期化できる', () => {
    useHarmonicStore.setState({ isPlaying: true })
    render(<PlaybackControls />)

    fireEvent.click(screen.getByRole('button', { name: '巻き戻し' }))

    expect(useHarmonicStore.getState().isPlaying).toBe(false)
    expect(useHarmonicStore.getState().time).toBe(0)
    expect(useHarmonicStore.getState().trails).toEqual({})
  })
})
