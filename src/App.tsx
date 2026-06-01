import './App.css'
import { ExperimentList } from './components/ExperimentList'
import { HarmonicScene } from './components/HarmonicScene'
import { ObservationNotes } from './components/ObservationNotes'
import { ObservationRulesPanel } from './components/ObservationRulesPanel'
import { PlaybackControls } from './components/PlaybackControls'
import { ParameterPanel } from './components/ParameterPanel'
import { PointReadoutPanel } from './components/PointReadoutPanel'

function App() {
  return (
    <main className="app">
      <div className="scene-wrapper">
        <HarmonicScene />
        {/* aria-hidden を外して支援技術からページタイトルを読めるようにする */}
        <section className="scene-overlay">
          <h1>CD星図 / 夢盤</h1>
          <p>中心軸を基準に、複数ディスクを静かに観測する。</p>
        </section>
      </div>
      <div className="controls-panel">
        <PlaybackControls />
        <ParameterPanel />
        <PointReadoutPanel />
        <ObservationRulesPanel />
        <ObservationNotes />
        <ExperimentList />
      </div>
    </main>
  )
}

export default App
