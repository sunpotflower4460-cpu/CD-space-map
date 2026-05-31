import { useHarmonicStore } from '../store/useHarmonicStore'
import type { PresetId } from '../types/harmonic'

const BASE_FREQUENCIES = [55, 110, 220, 440] as const

const PRESETS: { value: PresetId; label: string }[] = [
  { value: 'harmonics', label: '倍音' },
  { value: 'octaves', label: 'オクターブ' },
  { value: 'simpleRatios', label: '単純比' },
]

const SPEEDS = [0.25, 0.5, 1, 2] as const

const TRAIL_DURATIONS = [1, 3, 5, 8] as const

const DISPLAY_SCALES = [220, 440, 880, 1760] as const

export function ParameterPanel() {
  const baseFrequency = useHarmonicStore((s) => s.baseFrequency)
  const setBaseFrequency = useHarmonicStore((s) => s.setBaseFrequency)
  const preset = useHarmonicStore((s) => s.preset)
  const setPreset = useHarmonicStore((s) => s.setPreset)
  const playbackSpeed = useHarmonicStore((s) => s.playbackSpeed)
  const setPlaybackSpeed = useHarmonicStore((s) => s.setPlaybackSpeed)
  const trailDuration = useHarmonicStore((s) => s.trailDuration)
  const setTrailDuration = useHarmonicStore((s) => s.setTrailDuration)
  const displayScale = useHarmonicStore((s) => s.displayScale)
  const setDisplayScale = useHarmonicStore((s) => s.setDisplayScale)

  return (
    <div className="parameter-panel">
      <div className="param-row">
        <span className="param-label">基準周波数</span>
        <div className="param-options">
          {BASE_FREQUENCIES.map((f) => (
            <button
              key={f}
              className={`param-btn${baseFrequency === f ? ' selected' : ''}`}
              onClick={() => setBaseFrequency(f)}
              aria-pressed={baseFrequency === f}
            >
              {f}Hz
            </button>
          ))}
        </div>
      </div>

      <div className="param-row">
        <span className="param-label">プリセット</span>
        <div className="param-options">
          {PRESETS.map(({ value, label }) => (
            <button
              key={value}
              className={`param-btn${preset === value ? ' selected' : ''}`}
              onClick={() => setPreset(value)}
              aria-pressed={preset === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="param-row">
        <span className="param-label">表示速度</span>
        <div className="param-options">
          {SPEEDS.map((s) => (
            <button
              key={s}
              className={`param-btn${playbackSpeed === s ? ' selected' : ''}`}
              onClick={() => setPlaybackSpeed(s)}
              aria-pressed={playbackSpeed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="param-row">
        <span className="param-label">軌跡の長さ</span>
        <div className="param-options">
          {TRAIL_DURATIONS.map((d) => (
            <button
              key={d}
              className={`param-btn${trailDuration === d ? ' selected' : ''}`}
              onClick={() => setTrailDuration(d)}
              aria-pressed={trailDuration === d}
            >
              {d}秒
            </button>
          ))}
        </div>
      </div>

      <details className="param-details">
        <summary className="param-details-summary">詳細設定</summary>
        <div className="param-row param-row--detail">
          <span className="param-label">表示スケール</span>
          <div className="param-options">
            {DISPLAY_SCALES.map((v) => (
              <button
                key={v}
                className={`param-btn${displayScale === v ? ' selected' : ''}`}
                onClick={() => setDisplayScale(v)}
                aria-pressed={displayScale === v}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}
