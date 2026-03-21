'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ParallaxLayer } from '@/components/ParallaxLayer'
import { motionEase, usePrefersReducedMotion } from '@/lib/motion'

const ROLES = ['Art Director', 'Creative Director', 'Brand Strategist'] as const

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }, 3000)
    return () => clearInterval(t)
  }, [reduced])

  const nameWords = ['BRENDON', 'CARBULLIDO']

  return (
    <section
      className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-home"
      style={{ perspective: '900px', perspectiveOrigin: 'center center' }}
    >
      <ParallaxLayer layer="video" className="absolute inset-0">
        <video
          src="/videos/C0006.mov"
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full object-cover"
          aria-hidden
        />
      </ParallaxLayer>

      <div
        className="pointer-events-none absolute inset-0 z-1 bg-[rgba(0,0,0,0.5)]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-2 will-change-transform" aria-hidden>
        <svg className="h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-2 flex items-center justify-center will-change-transform"
        aria-hidden
      >
        <div
          className="h-[min(80vw,720px)] w-[min(80vw,720px)] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,168,76,0.35) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <ParallaxLayer layer="name">
          <div className="w-full px-4 text-center overflow-hidden">
            <h1 className="font-display font-bold uppercase leading-none text-ink">
              {nameWords.map((w, i) => (
                <motion.span
                  key={w}
                  className="hero-name block"
                  style={{
                    fontSize: 'clamp(2.2rem, 14vw, 11rem)',
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    lineHeight: '0.9',
                    whiteSpace: 'nowrap',
                  }}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: motionEase,
                    delay: reduced ? 0 : i * 0.08,
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
          </div>
        </ParallaxLayer>

        <ParallaxLayer layer="role" className="mt-8 flex max-w-2xl flex-col items-center gap-3">
          <div
            className="relative min-h-[2rem] w-full overflow-visible font-sans text-lg font-medium text-gold md:text-xl"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={ROLES[roleIndex]}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: motionEase }}
                className="block w-full text-center whitespace-nowrap"
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <ParallaxLayer layer="tagline">
            <p className="font-sans text-sm font-light tracking-wide text-muted md:text-base">
              Full-ownership creative. Los Angeles.
            </p>
          </ParallaxLayer>
        </ParallaxLayer>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-2 opacity-[0.06] will-change-transform"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <ParallaxLayer layer="scroll" className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <div className="h-10 w-px bg-gradient-to-b from-gold to-transparent animate-scroll-cue" />
        <span className="font-sans text-[10px] font-semibold uppercase tracking-caps text-muted">
          Scroll
        </span>
      </ParallaxLayer>
    </section>
  )
}
