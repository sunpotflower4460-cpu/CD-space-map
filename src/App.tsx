import './App.css'
import { HarmonicScene } from './components/HarmonicScene'
import { PlaybackControls } from './components/PlaybackControls'
import { ParameterPanel } from './components/ParameterPanel'

function App() {
  return (
    <main className="app">
      <div className="scene-wrapper">
        <HarmonicScene />
        <section className="scene-overlay" aria-hidden="true">
          <h1>CD星図 / 夢盤</h1>
          <p>中心軸を基準に、複数ディスクを静かに観測する。</p>
        </section>
      </div>
      <div className="controls-panel">
        <PlaybackControls />
        <ParameterPanel />
      </div>
    </main>
  )
}

export default App
