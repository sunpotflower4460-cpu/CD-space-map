import { frequencyToRotationSpeed, positionOnDisk } from '../core/frequencyMath'
import type { FrequencyPoint } from '../types/harmonic'

type FrequencyPointMeshProps = {
  point: FrequencyPoint
  radius: number
  y: number
  time: number
  playbackSpeed: number
  displayScale: number
}

export function FrequencyPointMesh({
  point,
  radius,
  y,
  time,
  playbackSpeed,
  displayScale,
}: FrequencyPointMeshProps) {
  const rotationSpeed = frequencyToRotationSpeed(point.frequency, displayScale)
  const currentAngle = point.angle + rotationSpeed * time * playbackSpeed
  const [x, , z] = positionOnDisk(radius, currentAngle, point.layer, 0)

  return (
    <group position={[x, y, z]}>
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
