'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { motionEase, usePrefersReducedMotion } from '@/lib/motion'

export default function Showreel() {
  const reduced = usePrefersReducedMotion()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [videoExists, setVideoExists] = useState(true)

  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <section className="relative flex h-[100dvh] min-h-[600px] w-full items-center justify-center overflow-hidden bg-[#0A0A0A]">
        {/* Background video at low opacity */}
        <video
          src="/videos/C0006.mov"
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.15]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.4)]" aria-hidden />

        <div className="relative z-10 flex flex-col items-center gap-8 px-5 text-center">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
            Showreel — 2024
          </p>
          <h2
            className="font-display font-bold italic text-ink"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Direction in motion.
          </h2>
          <button
            type="button"
            className="group cursor-hover"
            aria-label="Play showreel"
            onClick={() => setLightboxOpen(true)}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="#F5F0E8"
                strokeWidth="2"
                className="transition-colors duration-300 group-hover:stroke-[#C9A84C]"
              />
              <path
                d="M42 33C42 31.6 43.5 30.8 44.7 31.5L67.3 44.5C68.5 45.2 68.5 46.8 67.3 47.5L44.7 60.5C43.5 61.2 42 60.4 42 59V33Z"
                fill="#F5F0E8"
                className="transition-colors duration-300 group-hover:fill-[#C9A84C]"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[8000] flex items-center justify-center bg-[rgba(0,0,0,0.95)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: motionEase }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 z-10 font-sans text-xl text-gold cursor-hover"
              aria-label="Close"
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
            <motion.div
              className="relative w-full max-w-5xl px-5"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: motionEase }}
              onClick={(e) => e.stopPropagation()}
            >
              {videoExists ? (
                <div className="relative aspect-video w-full overflow-hidden bg-[#111]">
                  {/* REPLACE with showreel video or YouTube embed ID */}
                  <video
                    src="/videos/showreel-2024.mp4"
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                    onError={() => setVideoExists(false)}
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center bg-[#111] text-center">
                  <p className="font-display text-2xl font-bold italic text-ink/60 md:text-4xl">
                    Showreel coming soon
                  </p>
                  <p className="mt-3 font-sans text-sm text-muted">
                    Check back for the full reel.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
