'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { stats } from '@/lib/data'
import { motionEase, usePrefersReducedMotion } from '@/lib/motion'

export default function AboutPreview() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="border-t border-line bg-home px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16">
        <motion.blockquote
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: motionEase }}
          className="font-display text-[clamp(28px,3.5vw,44px)] font-light italic leading-snug text-ink/95"
        >
          “I function as an entire creative department: I conceive, shoot, direct, edit, and deploy
          content across every medium.”
        </motion.blockquote>

        <div className="grid grid-cols-2 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                ease: motionEase,
                delay: reduced ? 0 : i * 0.08,
              }}
              className="border border-line p-5"
            >
              <p className="font-display text-4xl font-bold text-gold md:text-5xl">
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-2 font-sans text-[11px] font-light uppercase tracking-caps text-muted">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl text-center md:text-left">
        <Link
          href="/about"
          className="inline-flex cursor-hover items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold"
        >
          Full story <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
