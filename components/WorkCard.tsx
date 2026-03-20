'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/data'
import { motionEase } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/motion'

type Props = {
  project: Project
  index: number
  large?: boolean
  onOpen: (p: Project) => void
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

export default function WorkCard({ project, index, large, onOpen }: Props) {
  const reduced = usePrefersReducedMotion()
  const isVideo = project.mediaType === 'video'

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoErrored, setVideoErrored] = useState(false)

  useEffect(() => {
    setVideoLoaded(false)
    setVideoErrored(false)
  }, [project.id])

  return (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.55,
        ease: motionEase,
        delay: reduced ? 0 : index * 0.08,
      }}
      className={`group relative cursor-hover overflow-hidden bg-line ${
        large ? 'aspect-[16/11] md:aspect-[16/10]' : 'aspect-[16/12]'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="absolute inset-0 z-10 block h-full w-full text-left"
        aria-label={`Open project ${project.title}`}
      />
      <motion.div
        className="h-full w-full"
        whileHover={reduced ? undefined : { scale: 1.05 }}
        transition={{ duration: 0.45, ease: motionEase }}
      >
        {isVideo ? (
          <div className="relative h-full w-full bg-[#111]">
            {!videoLoaded && (
              <div className="absolute inset-0 z-[1] flex items-center justify-center text-gold pointer-events-none opacity-95 transition-opacity duration-500 group-hover:opacity-80">
                <PlayIcon />
              </div>
            )}

            {project.video && !videoErrored && (
              <video
                src={project.video}
                autoPlay={!reduced}
                muted
                loop
                playsInline
                preload="metadata"
                className={`pointer-events-none absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ${
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
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
          />
        )}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-home via-home/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-gold/0 transition-colors duration-500 group-hover:bg-gold/10" />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6">
        <h3
          className={`font-display font-bold text-ink ${
            large ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-caps text-gold">
          {project.client}
        </p>
      </div>
    </motion.article>
  )
}
