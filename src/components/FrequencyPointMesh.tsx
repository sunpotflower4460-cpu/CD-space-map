import type { FrequencyPoint } from '../types/harmonic'

type FrequencyPointMeshProps = {
  point: FrequencyPoint
  position: [number, number, number]
}

export function FrequencyPointMesh({ point, position }: FrequencyPointMeshProps) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.024, 20, 20]} />
        <meshStandardMaterial
          color={point.color}
          emissive={point.color}
          emissiveIntensity={0.16}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.04, 20, 20]} />
        <meshBasicMaterial color={point.color} transparent opacity={0.14} />
      </mesh>
    </group>
  )
}
