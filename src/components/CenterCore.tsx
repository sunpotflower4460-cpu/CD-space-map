export function CenterCore() {
  return (
    <group position={[0, 0, 0]}>
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffe8b5" distance={3.5} />
      <mesh>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#fff6d8"
          emissive="#ffde8c"
          emissiveIntensity={0.9}
          metalness={0.1}
          roughness={0.35}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#fff4cf" transparent opacity={0.16} />
      </mesh>
    </group>
  )
}
