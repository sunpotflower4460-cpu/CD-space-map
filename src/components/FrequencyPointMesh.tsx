import { useState, useCallback } from 'react'
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'

import type { FrequencyPoint } from '../types/harmonic'
import { formatRatioText } from '../core/pointReadout'

type FrequencyPointMeshProps = {
  point: FrequencyPoint
  position: [number, number, number]
  isSelected: boolean
  onSelect: (id: string | null) => void
}

export function FrequencyPointMesh({ point, position, isSelected, onSelect }: FrequencyPointMeshProps) {
  const [hovered, setHovered] = useState(false)

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
  }, [])

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onSelect(isSelected ? null : point.id)
    },
    [isSelected, point.id, onSelect],
  )

  const outerOpacity = isSelected ? 0.35 : 0.14
  const innerEmissiveIntensity = isSelected ? 0.5 : 0.16
  const scale: [number, number, number] = isSelected ? [1.25, 1.25, 1.25] : [1, 1, 1]

  return (
    <group position={position}>
      <mesh
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.024, 20, 20]} />
        <meshStandardMaterial
          color={point.color}
          emissive={point.color}
          emissiveIntensity={innerEmissiveIntensity}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
      <mesh scale={scale}>
        <sphereGeometry args={[0.04, 20, 20]} />
        <meshBasicMaterial color={point.color} transparent opacity={outerOpacity} />
      </mesh>
      {(hovered || isSelected) && (
        <Html distanceFactor={5} style={{ pointerEvents: 'none' }}>
          <div className="point-label">
            <span className="point-label__name">{point.label}</span>
            <span className="point-label__ratio">{formatRatioText(point.ratioToBase)}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
