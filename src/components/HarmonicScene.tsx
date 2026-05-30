import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'

import { createFrequencyPoints } from '../core/presets'
import type { PresetId } from '../types/harmonic'
import { CenterCore } from './CenterCore'
import { DiskLayer } from './DiskLayer'
import { FrequencyPointMesh } from './FrequencyPointMesh'

const diskLayers = [
  { layerIndex: 0, radius: 1.55, y: -0.36, opacity: 0.18 },
  { layerIndex: 1, radius: 1.42, y: -0.12, opacity: 0.22 },
  { layerIndex: 2, radius: 1.28, y: 0.14, opacity: 0.25 },
  { layerIndex: 3, radius: 1.12, y: 0.38, opacity: 0.28 },
  { layerIndex: 4, radius: 0.96, y: 0.62, opacity: 0.3 },
]

type HarmonicSceneProps = {
  baseFrequency?: number
  presetId?: PresetId
}

export function HarmonicScene({ baseFrequency = 110, presetId = 'harmonics' }: HarmonicSceneProps) {
  const points = useMemo(
    () => createFrequencyPoints(baseFrequency, presetId),
    [baseFrequency, presetId],
  )

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
        {points.map((point) => {
          const layer = diskLayers[point.layer]
          if (!layer) {
            return null
          }

          return (
            <FrequencyPointMesh
              key={point.id}
              point={point}
              radius={layer.radius * 0.83}
              y={layer.y}
            />
          )
        })}
      </Canvas>
    </div>
  )
}
