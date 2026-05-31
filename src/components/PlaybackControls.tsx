import { useHarmonicStore } from '../store/useHarmonicStore'

export function PlaybackControls() {
  const isPlaying = useHarmonicStore((s) => s.isPlaying)
  const play = useHarmonicStore((s) => s.play)
  const pause = useHarmonicStore((s) => s.pause)
  const rewind = useHarmonicStore((s) => s.rewind)

  return (
    <div className="playback-controls">
      <button
        className={`ctrl-btn${isPlaying ? ' active' : ''}`}
        onClick={isPlaying ? pause : play}
        aria-label={isPlaying ? '停止' : '再生'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? '⏸ 停止' : '▶ 再生'}
      </button>
      <button className="ctrl-btn" onClick={rewind} aria-label="巻き戻し">
        ↺ 巻き戻し
      </button>
    </div>
  )
}
