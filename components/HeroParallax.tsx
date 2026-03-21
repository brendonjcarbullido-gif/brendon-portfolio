'use client'

import { motion } from 'framer-motion'
import { useHeadTracking, HeadPosition } from '@/lib/hooks/useHeadTracking'

const LAYERS = {
  name:       { x: 28, y: 20, z: 40 },
  role:       { x: 16, y: 12, z: 20 },
  tagline:    { x: 10, y:  8, z: 12 },
  scroll:     { x:  5, y:  4, z:  6 },
  videoBg:    { x: -8, y: -6, z: -15 },
}

interface Props {
  children: React.ReactNode
  layer: keyof typeof LAYERS
  head: HeadPosition
  className?: string
  style?: React.CSSProperties
}

export function ParallaxLayer({ children, layer, head, className, style }: Props) {
  const mult = LAYERS[layer]

  const translateX = head.x * mult.x
  const translateY = head.y * mult.y
  const scale = 1 + (head.z - 0.5) * (mult.z / 200)

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        x: translateX,
        y: translateY,
        scale,
        willChange: 'transform',
      }}
      transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.8 }}
    >
      {children}
    </motion.div>
  )
}

export function TrackingIndicator({ head }: { head: HeadPosition }) {
  if (head.source === 'none' || head.source === 'mouse') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2
                 text-white/40 text-xs tracking-widest uppercase"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        head.source === 'face' ? 'bg-green-400/60' : 'bg-yellow-400/60'
      }`} />
      {head.source === 'face' ? 'Head tracking' : 'Gyroscope'}
    </motion.div>
  )
}
