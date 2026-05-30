import './App.css'
import { HarmonicScene } from './components/HarmonicScene'

function App() {
  return (
    <main className="app">
      <HarmonicScene />
      <section className="scene-overlay" aria-hidden="true">
        <h1>CD星図 / 夢盤</h1>
        <p>中心軸を基準に、複数ディスクを静かに観測する。</p>
      </section>
    </main>
  )
}

export default App
