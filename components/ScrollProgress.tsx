'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/motion'

export default function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduced ? 280 : 100,
    damping: reduced ? 48 : 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed left-0 top-0 z-[10000] h-[2px] w-full origin-[0%_50%] bg-gold"
      style={{ scaleX }}
    />
  )
}
