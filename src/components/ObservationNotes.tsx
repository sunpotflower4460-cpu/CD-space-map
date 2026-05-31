import { useState } from 'react'

import { useHarmonicStore } from '../store/useHarmonicStore'

export function ObservationNotes() {
  const saveExperimentRun = useHarmonicStore((s) => s.saveExperimentRun)
  const loadExperimentRuns = useHarmonicStore((s) => s.loadExperimentRuns)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  const saveCurrentCondition = () => {
    saveExperimentRun(title, note)
    loadExperimentRuns()
    setTitle('')
    setNote('')
  }

  return (
    <section className="observation-notes">
      <h2 className="notes-title">観測メモ</h2>
      <p className="notes-copy">今、何が見えた？ どの軌跡が気になった？ どの比率が美しく見えた？</p>
      <label className="notes-label">
        タイトル
        <input
          className="notes-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例: 完全五度の重なりを観測"
        />
      </label>
      <label className="notes-label">
        メモ
        <textarea
          className="notes-textarea"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="気づいたことを自由に書く"
          rows={3}
        />
      </label>
      <button className="param-btn notes-save-button" onClick={saveCurrentCondition}>
        この条件を保存
      </button>
    </section>
  )
}
