'use client'

import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion'

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const imageData = ctx.createImageData(w, h)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const n = Math.random() * 255
        data[i] = n
        data[i + 1] = n
        data[i + 2] = n
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.032]"
      aria-hidden
    />
  )
}
