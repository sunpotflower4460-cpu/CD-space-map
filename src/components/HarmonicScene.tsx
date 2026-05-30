import { Canvas } from '@react-three/fiber'

import { CenterCore } from './CenterCore'
import { DiskLayer } from './DiskLayer'

const diskLayers = [
  { layerIndex: 0, radius: 1.55, y: -0.36, opacity: 0.18 },
  { layerIndex: 1, radius: 1.42, y: -0.12, opacity: 0.22 },
  { layerIndex: 2, radius: 1.28, y: 0.14, opacity: 0.25 },
  { layerIndex: 3, radius: 1.12, y: 0.38, opacity: 0.28 },
]

export function HarmonicScene() {
  return (
    <div className="harmonic-canvas" aria-label="CD星図 3D scene">
      <Canvas camera={{ position: [3.9, 2.6, 4.6], fov: 42 }}>
        <color attach="background" args={['#040814']} />
        <fog attach="fog" args={['#040814', 7, 14]} />

        <ambientLight intensity={0.38} color="#a7bce8" />
        <directionalLight position={[4.5, 5, 2.5]} intensity={0.6} color="#d8e9ff" />
        <pointLight position={[-3, 2.5, -4]} intensity={0.2} color="#588cd4" />

        <CenterCore />
        {diskLayers.map((layer) => (
          <DiskLayer key={layer.layerIndex} {...layer} />
        ))}
      </Canvas>
    </div>
  )
}
