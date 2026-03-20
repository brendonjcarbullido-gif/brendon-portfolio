'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '@/lib/data'
import { motionEase } from '@/lib/motion'

type Props = {
  project: Project | null
  onClose: () => void
}

function PlayIcon() {
  return (
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="39" cy="39" r="38" stroke="currentColor" strokeWidth="2" opacity="0.55" />
      <path
        d="M33.5 27.8C33.5 26.8 34.6 26.2 35.4 26.7L52.1 36.6C52.9 37.1 52.9 38.2 52.1 38.7L35.4 48.6C34.6 49.1 33.5 48.5 33.5 47.5V27.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function WorkModal({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (project) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [project])

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoErrored, setVideoErrored] = useState(false)

  useEffect(() => {
    if (!project) return
    setVideoLoaded(false)
    setVideoErrored(false)
  }, [project?.id])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto"
          style={{
            background: 'rgba(13,13,13,0.97)',
            backdropFilter: 'blur(4px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: motionEase }}
        >
          <motion.div
            className="relative mx-auto min-h-full max-w-6xl px-5 py-16 md:px-10 md:pb-24"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: motionEase }}
          >
            <button
              type="button"
              className="absolute right-5 top-6 z-20 font-sans text-xl text-gold cursor-hover md:right-10 md:top-10"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="mt-12 md:mt-16">
              <div className="relative aspect-video w-full overflow-hidden bg-line">
                {project.mediaType === 'video' ? (
                  <div className="relative h-full w-full bg-[#111]">
                    {!videoLoaded && (
                      <div className="absolute inset-0 z-[1] flex items-center justify-center text-gold pointer-events-none opacity-95 transition-opacity duration-500">
                        <PlayIcon />
                      </div>
                    )}

                    {project.video && !videoErrored && (
                      <video
                        src={project.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ${
                          videoLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onCanPlay={() => setVideoLoaded(true)}
                        onError={() => {
                          setVideoErrored(true)
                          setVideoLoaded(false)
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="mt-10 grid gap-10 md:grid-cols-[3fr_2fr] md:gap-14">
                <div>
                  <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold text-ink">
                    {project.title}
                  </h2>
                  <p className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
                    {project.client}
                  </p>
                  <p className="mt-6 font-sans text-sm font-light leading-relaxed text-ink/90">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line px-2 py-1 font-sans text-[10px] uppercase tracking-caps text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-6 font-sans text-sm">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-label text-gold">Role</p>
                    <p className="mt-1 font-light text-ink">{project.role}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-label text-gold">Client</p>
                    <p className="mt-1 font-light text-ink">{project.client}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-label text-gold">Year</p>
                    <p className="mt-1 font-light text-ink">{project.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
