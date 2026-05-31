import { useEffect, useRef, useState } from 'react'

import { useHarmonicStore } from '../store/useHarmonicStore'

export function ObservationNotes() {
  const saveExperimentRun = useHarmonicStore((s) => s.saveExperimentRun)
  const loadExperimentRuns = useHarmonicStore((s) => s.loadExperimentRuns)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
  const resetSaveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resetSaveStatusTimerRef.current !== null) {
        clearTimeout(resetSaveStatusTimerRef.current)
        resetSaveStatusTimerRef.current = null
      }
    },
    [],
  )

  const saveCurrentCondition = () => {
    saveExperimentRun(title, note)
    loadExperimentRuns()
    setTitle('')
    setNote('')
    setSaveStatus('saved')
    if (resetSaveStatusTimerRef.current !== null) {
      clearTimeout(resetSaveStatusTimerRef.current)
    }
    resetSaveStatusTimerRef.current = setTimeout(() => {
      setSaveStatus('idle')
      resetSaveStatusTimerRef.current = null
    }, 2000)
  }

  return (
    <section className="observation-notes">
      <h2 className="notes-title">観測メモ</h2>
      <p className="notes-copy">
        今、何が見えた？ どの軌跡が気になった？ どの比率が美しく見えた？
        <br />
        <small>保存は「観測条件」の記録です。軌跡は保存されません。</small>
      </p>
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
        {saveStatus === 'saved' ? '✓ 保存しました' : 'この条件を保存'}
      </button>
    </section>
  )
}
