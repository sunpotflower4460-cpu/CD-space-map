import { DoubleSide } from 'three'

type DiskLayerProps = {
  layerIndex: number
  radius: number
  y: number
  opacity?: number
}

export function DiskLayer({ layerIndex, radius, y, opacity = 0.22 }: DiskLayerProps) {
  const hueShift = layerIndex * 0.02

  return (
    <group position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.04, 96]} />
        <meshStandardMaterial
          color={`hsl(${205 + hueShift * 360}, 70%, 73%)`}
          transparent
          opacity={opacity}
          side={DoubleSide}
          metalness={0.3}
          roughness={0.15}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 16, 128]} />
        <meshStandardMaterial
          color="#b7d9ff"
          transparent
          opacity={Math.min(opacity + 0.18, 0.55)}
          emissive="#7fb4ff"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.07, radius * 0.15, 64]} />
        <meshBasicMaterial color="#d5ebff" transparent opacity={Math.min(opacity + 0.1, 0.45)} side={DoubleSide} />
      </mesh>
    </group>
  )
}
