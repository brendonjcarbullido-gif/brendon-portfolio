'use client'

import { useEffect, useState } from 'react'

/** Cubic-bezier per motion spec — no bounce */
export const motionEase = [0.25, 0.1, 0.25, 1] as const

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
