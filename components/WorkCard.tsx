'use client'

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

export default function WorkCard({ project, index, large, onOpen }: Props) {
  const reduced = usePrefersReducedMotion()

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
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
        />
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
