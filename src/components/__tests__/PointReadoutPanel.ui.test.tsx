// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { createFrequencyPoints } from '../../core/presets'
import { useHarmonicStore } from '../../store/useHarmonicStore'
import { PointReadoutPanel } from '../PointReadoutPanel'

describe('PointReadoutPanel UI', () => {
  beforeEach(() => {
    useHarmonicStore.setState({
      baseFrequency: 110,
      preset: 'simpleRatios',
      isPlaying: false,
      time: 0,
      playbackSpeed: 1,
      displayScale: 440,
      trailDuration: 3,
      selectedPointId: null,
      trails: {},
      lastTrailSampleTime: null,
      experiments: [],
    })
  })

  it('未選択時は案内メッセージを表示する', () => {
    render(<PointReadoutPanel />)

    expect(screen.getByText('Point Readout')).toBeTruthy()
    expect(screen.getByText('点を選択すると、ratio / angle / layer / cents を表示します。')).toBeTruthy()
  })

  it('選択中の点の観測値を表示する', () => {
    const selectedPoint = createFrequencyPoints(110, 'simpleRatios').find((point) => point.ratioToBase === 3 / 2)
    if (!selectedPoint) {
      throw new Error('test setup error: selected point not found')
    }

    useHarmonicStore.setState({ selectedPointId: selectedPoint.id })

    render(<PointReadoutPanel />)

    expect(screen.getByText('完全五度')).toBeTruthy()
    expect(screen.getByText('165.00 Hz')).toBeTruthy()
    expect(screen.getByText('3/2 (1.5)')).toBeTruthy()
    expect(screen.getByText('210.6°')).toBeTruthy()
    expect(screen.getByText('2.0 ¢')).toBeTruthy()

    const layerLabel = screen.getByText('layer')
    expect(layerLabel.nextElementSibling?.textContent).toBe('0')
  })
})
