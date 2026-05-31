import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'

import { getFrequencyPointPosition } from '../core/frequencyMath'
import { generateDiskLayers, getLayerBounds } from '../core/layerLayout'
import { createFrequencyPoints } from '../core/presets'
import type { FrequencyPoint, TrailPoint } from '../types/harmonic'
import { useHarmonicStore } from '../store/useHarmonicStore'
import { CenterCore } from './CenterCore'
import { DiskLayer } from './DiskLayer'
import { FrequencyPointMesh } from './FrequencyPointMesh'
import { TrailLines } from './TrailLines'

type RenderPoint = {
  point: FrequencyPoint
  radius: number
  y: number
}

function SceneTicker({ renderPoints }: { renderPoints: RenderPoint[] }) {
  const advanceTick = useHarmonicStore((state) => state.advanceTick)

  useFrame((_, delta) => {
    const state = useHarmonicStore.getState()

    if (!state.isPlaying) {
      return
    }

    // 描画時刻と記録時刻を揃えるため、現在の state.time（React が描画した時刻）で
    // 軌跡スナップショットを計算し、advanceTick で原子的に time を進める。
    const trailSnapshot: TrailPoint[] = renderPoints.map(({ point, radius, y }) => ({
      pointId: point.id,
      time: state.time,
      position: getFrequencyPointPosition(
        point,
        radius,
        y,
        state.time,
        state.playbackSpeed,
        state.displayScale,
      ),
    }))

    advanceTick(delta, trailSnapshot)
  })

  return null
}

/** HarmonicScene は store を唯一の真実の源として使用する。初期値は store 側に集約。 */
export function HarmonicScene() {
  const storeBaseFrequency = useHarmonicStore((state) => state.baseFrequency)
  const preset = useHarmonicStore((state) => state.preset)
  const time = useHarmonicStore((state) => state.time)
  const playbackSpeed = useHarmonicStore((state) => state.playbackSpeed)
  const displayScale = useHarmonicStore((state) => state.displayScale)
  const trails = useHarmonicStore((state) => state.trails)
  const trailDuration = useHarmonicStore((state) => state.trailDuration)

  const points = useMemo(
    () => createFrequencyPoints(storeBaseFrequency, preset),
    [storeBaseFrequency, preset],
  )

  const { minLayer, maxLayer } = useMemo(() => getLayerBounds(points), [points])
  const diskLayers = useMemo(() => generateDiskLayers(minLayer, maxLayer), [minLayer, maxLayer])
  const diskLayerMap = useMemo(
    () => new Map(diskLayers.map((layer) => [layer.layerIndex, layer])),
    [diskLayers],
  )

  const renderPoints = useMemo(
    () =>
      points.flatMap((point) => {
        const layer = diskLayerMap.get(point.layer)
        if (!layer) {
          console.warn(
            `Point "${point.id}" has layer ${point.layer} but disk layers only cover ${minLayer}..${maxLayer}`,
          )
          return []
        }

        return {
          point,
          radius: layer.radius * 0.83,
          y: layer.y,
        }
      }),
    [points, diskLayerMap, minLayer, maxLayer],
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

        <OrbitControls makeDefault enablePan={false} />

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
