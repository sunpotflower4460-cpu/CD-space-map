import { beforeEach, describe, expect, it } from 'vitest'

import { useHarmonicStore } from '../../store/useHarmonicStore'

// FrequencyPointMesh は Three.js / R3F に依存するため、
// コンポーネントの振る舞いは store を通じて検証する。
// 点の選択・解除ロジックは store 側で完結している。
describe('点選択の store 統合', () => {
  beforeEach(() => {
    useHarmonicStore.setState({
      baseFrequency: 110,
      preset: 'harmonics',
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

  it('selectPoint を呼ぶと selectedPointId が更新される', () => {
    const { selectPoint } = useHarmonicStore.getState()
    selectPoint('point-3-2')

    expect(useHarmonicStore.getState().selectedPointId).toBe('point-3-2')
  })

  it('同じ点の選択後に deselectPoint を呼ぶと解除される', () => {
    const { selectPoint, deselectPoint } = useHarmonicStore.getState()
    selectPoint('point-3-2')
    deselectPoint()

    expect(useHarmonicStore.getState().selectedPointId).toBeNull()
  })

  it('別の点を選択すると selectedPointId が切り替わる', () => {
    const { selectPoint } = useHarmonicStore.getState()
    selectPoint('point-3-2')
    selectPoint('point-5-4')

    expect(useHarmonicStore.getState().selectedPointId).toBe('point-5-4')
  })
})

// PointReadout との接続: selectedPointId が変化した際に
// store から正しく読み取れることを確認する。
describe('selectedPointId の store 購読', () => {
  beforeEach(() => {
    useHarmonicStore.setState({ selectedPointId: null })
  })

  it('store の selectedPointId を外部から読み取れる', () => {
    useHarmonicStore.getState().selectPoint('p42')
    const { selectedPointId } = useHarmonicStore.getState()
    expect(selectedPointId).toBe('p42')
  })

  it('store の selectedPointId に変化があれば subscribe で検知できる', () => {
    const seen: (string | null)[] = []
    const unsubscribe = useHarmonicStore.subscribe((state) => {
      seen.push(state.selectedPointId)
    })

    useHarmonicStore.getState().selectPoint('p1')
    useHarmonicStore.getState().deselectPoint()

    expect(seen).toContain('p1')
    expect(seen).toContain(null)

    unsubscribe()
  })
})
