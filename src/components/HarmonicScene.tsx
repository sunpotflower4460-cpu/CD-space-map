import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'

import { getFrequencyPointPosition } from '../core/frequencyMath'
import { createFrequencyPoints } from '../core/presets'
import type { FrequencyPoint, TrailPoint } from '../types/harmonic'
import { useHarmonicStore } from '../store/useHarmonicStore'
import { CenterCore } from './CenterCore'
import { DiskLayer } from './DiskLayer'
import { FrequencyPointMesh } from './FrequencyPointMesh'
import { TrailLines } from './TrailLines'

/** ディスク層の視覚パラメータを必要なレイヤー数に応じて動的に生成する */
function generateDiskLayers(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = count > 1 ? i / (count - 1) : 0
    return {
      layerIndex: i,
      radius: 1.55 - t * 0.59,
      y: -0.36 + t * 0.98,
      opacity: 0.18 + t * 0.12,
    }
  })
}

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

  const maxLayer = useMemo(() => Math.max(0, ...points.map((p) => p.layer)), [points])
  const diskLayers = useMemo(() => generateDiskLayers(maxLayer + 1), [maxLayer])

  const renderPoints = useMemo(
    () =>
      points.flatMap((point) => {
        if (point.layer < 0) {
          console.warn(`Point "${point.id}" has layer ${point.layer} < 0 and will not be displayed`)
          return []
        }
        const layer = diskLayers[point.layer]
        if (!layer) {
          console.warn(`Point "${point.id}" has layer ${point.layer} but only ${diskLayers.length} disk layers exist`)
          return []
        }

        return {
          point,
          radius: layer.radius * 0.83,
          y: layer.y,
        }
      }),
    [points, diskLayers],
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
