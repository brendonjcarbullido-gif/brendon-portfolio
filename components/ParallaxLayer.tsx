'use client'

import { useTracking } from '@/context/TrackingContext'
import { motion, useSpring } from 'framer-motion'
import { useEffect } from 'react'

// Depth config — how much each layer moves per unit of tracking input
// x/y in pixels, z as scale delta (0.05 = 5% scale change)
const DEPTH: Record<string, { x: number; y: number; z: number; invert?: boolean }> = {
  name:    { x: 32, y: 22, z: 0.06 },            // foreground — moves most
  role:    { x: 18, y: 13, z: 0.035 },            // mid
  tagline: { x: 11, y:  8, z: 0.022 },            // mid
  scroll:  { x:  5, y:  4, z: 0.010 },            // near-background
  video:   { x: -9, y: -6, z: -0.025, invert: true }, // counter-moves
}

interface Props {
  layer: keyof typeof DEPTH
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

// Spring config — controls the feel of the drift
const SPRING = { stiffness: 45, damping: 18, mass: 1.2 }

export function ParallaxLayer({ layer, children, className, style }: Props) {
  const pos = useTracking()
  const d = DEPTH[layer]

  const springX = useSpring(0, SPRING)
  const springY = useSpring(0, SPRING)
  const springS = useSpring(1, SPRING)

  useEffect(() => {
    springX.set(pos.x * d.x)
    springY.set(pos.y * d.y)
    springS.set(1 + (pos.z - 0.5) * d.z * (d.invert ? -1 : 1))
  }, [pos.x, pos.y, pos.z, d, springX, springY, springS])

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        x: springX,
        y: springY,
        scale: springS,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
}
