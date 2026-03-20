'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/motion'

export default function CustomCursor() {
  const reduced = usePrefersReducedMotion()
  const [coarse, setCoarse] = useState(false)
  const [hover, setHover] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const updateCoarse = () => setCoarse(mq.matches)
    updateCoarse()
    mq.addEventListener('change', updateCoarse)

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const interactive = t.closest('a, button, [role="button"], input, textarea, select, .cursor-hover')
      setHover(!!interactive)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', onOver, true)

    return () => {
      mq.removeEventListener('change', updateCoarse)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', onOver, true)
    }
  }, [x, y])

  if (reduced || coarse) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: hover ? 52 : 18,
        height: hover ? 52 : 18,
        backgroundColor: hover ? 'rgba(201, 168, 76, 0.08)' : 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#C9A84C',
        borderStyle: 'solid',
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    />
  )
}
