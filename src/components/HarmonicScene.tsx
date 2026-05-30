import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'

import { getFrequencyPointPosition } from '../core/frequencyMath'
import { createFrequencyPoints } from '../core/presets'
import type { FrequencyPoint, PresetId, TrailPoint } from '../types/harmonic'
import { useHarmonicStore } from '../store/useHarmonicStore'
import { CenterCore } from './CenterCore'
import { DiskLayer } from './DiskLayer'
import { FrequencyPointMesh } from './FrequencyPointMesh'
import { TrailLines } from './TrailLines'

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

type RenderPoint = {
  point: FrequencyPoint
  radius: number
  y: number
}

function SceneTicker({ renderPoints }: { renderPoints: RenderPoint[] }) {
  const tick = useHarmonicStore((state) => state.tick)
  const recordTrailSnapshot = useHarmonicStore((state) => state.recordTrailSnapshot)

  useFrame((_, delta) => {
    const state = useHarmonicStore.getState()

    if (!state.isPlaying) {
      return
    }

    const currentTime = state.time + delta
    const trailSnapshot: TrailPoint[] = renderPoints.map(({ point, radius, y }) => ({
      pointId: point.id,
      time: currentTime,
      position: getFrequencyPointPosition(
        point,
        radius,
        y,
        currentTime,
        state.playbackSpeed,
        state.displayScale,
      ),
    }))

    tick(delta)
    recordTrailSnapshot(trailSnapshot, currentTime)
  })

  return null
}

export function HarmonicScene({ baseFrequency = 110, presetId = 'harmonics' }: HarmonicSceneProps) {
  const setBaseFrequency = useHarmonicStore((state) => state.setBaseFrequency)
  const setPreset = useHarmonicStore((state) => state.setPreset)
  const storeBaseFrequency = useHarmonicStore((state) => state.baseFrequency)
  const preset = useHarmonicStore((state) => state.preset)
  const time = useHarmonicStore((state) => state.time)
  const playbackSpeed = useHarmonicStore((state) => state.playbackSpeed)
  const displayScale = useHarmonicStore((state) => state.displayScale)
  const trails = useHarmonicStore((state) => state.trails)
  const trailDuration = useHarmonicStore((state) => state.trailDuration)

  useEffect(() => {
    setBaseFrequency(baseFrequency)
  }, [baseFrequency, setBaseFrequency])

  useEffect(() => {
    setPreset(presetId)
  }, [presetId, setPreset])

  const points = useMemo(
    () => createFrequencyPoints(storeBaseFrequency, preset),
    [storeBaseFrequency, preset],
  )

  const renderPoints = useMemo(
    () =>
      points.flatMap((point) => {
        const layer = diskLayers[point.layer]
        if (!layer) {
          return []
        }

        return {
          point,
          radius: layer.radius * 0.83,
          y: layer.y,
        }
      }),
    [points],
  )

  return (
    <div className="harmonic-canvas" aria-label="CD星図 3D scene">
      <Canvas camera={{ position: [3.9, 2.6, 4.6], fov: 42 }}>
        <SceneTicker renderPoints={renderPoints} />
        <color attach="background" args={['#040814']} />
        <fog attach="fog" args={['#040814', 7, 14]} />

        <ambientLight intensity={0.38} color="#a7bce8" />
        <directionalLight position={[4.5, 5, 2.5]} intensity={0.6} color="#d8e9ff" />
        <pointLight position={[-3, 2.5, -4]} intensity={0.2} color="#588cd4" />

        <CenterCore />
        {diskLayers.map((layer) => (
          <DiskLayer key={layer.layerIndex} {...layer} />
        ))}
        {renderPoints.map(({ point, radius, y }) => {
          const position = getFrequencyPointPosition(
            point,
            radius,
            y,
            time,
            playbackSpeed,
            displayScale,
          )

          return (
            <group key={point.id}>
              <TrailLines
                point={point}
                trails={trails}
                currentTime={time}
                trailDuration={trailDuration}
              />
              <FrequencyPointMesh point={point} position={position} />
            </group>
          )
        })}
      </Canvas>
    </div>
  )
}
