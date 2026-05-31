import { useEffect } from 'react'

import { useHarmonicStore } from '../store/useHarmonicStore'

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime()) ? createdAt : date.toLocaleString('ja-JP', { hour12: false })
}

function notePreview(note: string) {
  if (!note) {
    return '（メモなし）'
  }
  return note.length > 52 ? `${note.slice(0, 52)}…` : note
}

export function ExperimentList() {
  const experiments = useHarmonicStore((s) => s.experiments)
  const loadExperimentRuns = useHarmonicStore((s) => s.loadExperimentRuns)
  const loadExperimentRun = useHarmonicStore((s) => s.loadExperimentRun)
  const deleteExperimentRun = useHarmonicStore((s) => s.deleteExperimentRun)
  const exportExperiments = useHarmonicStore((s) => s.exportExperiments)

  useEffect(() => {
    loadExperimentRuns()
  }, [loadExperimentRuns])

  return (
    <section className="experiment-list">
      <div className="experiment-list-header">
        <h2 className="notes-title">保存した実験</h2>
        <button className="param-btn" onClick={exportExperiments}>
          JSON export
        </button>
      </div>

      {experiments.length === 0 ? (
        <p className="notes-copy">まだ保存された実験はありません。</p>
      ) : (
        <ul className="experiment-items">
          {experiments.map((run) => (
            <li key={run.id} className="experiment-item">
              <div className="experiment-main">
                <strong>{run.title}</strong>
                <span>
                  {formatCreatedAt(run.createdAt)} / {run.baseFrequency}Hz / {run.preset}
                </span>
                <span>{notePreview(run.note)}</span>
              </div>
              <div className="experiment-actions">
                <button className="param-btn" onClick={() => loadExperimentRun(run.id)}>
                  読み込み
                </button>
                <button
                  className="param-btn"
                  onClick={() => {
                    if (window.confirm('この保存データを削除しますか？')) {
                      deleteExperimentRun(run.id)
                    }
                  }}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
