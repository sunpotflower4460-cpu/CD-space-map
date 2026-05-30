export function frequencyToLayerAngle(frequency: number, baseFrequency: number) {
  const h = Math.log2(frequency / baseFrequency)
  const layer = Math.floor(h)
  const frac = h - layer
  const angle = frac * Math.PI * 2

  return { h, layer, angle }
}

export function frequencyToRotationSpeed(
  frequency: number,
  displayScale: number,
) {
  return (frequency / displayScale) * Math.PI * 2
}

export function positionOnDisk(
  radius: number,
  angle: number,
  layer: number,
  layerGap: number,
): [number, number, number] {
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const y = layer * layerGap

  return [x, y, z]
}
