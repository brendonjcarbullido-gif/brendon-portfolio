'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { stats, capabilities, industries, experience } from '@/lib/data'
import { motionEase, usePrefersReducedMotion } from '@/lib/motion'

const heroWords = 'A full creative department. One person.'.split(' ')

function formatStatValue(value: number, suffix: string) {
  if (suffix === 'K+') return `${value}K+`
  return `${value}${suffix}`
}

export default function AboutPageContent() {
  const reduced = usePrefersReducedMotion()
  const portraitWrap = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return

    let cancelled = false

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const wrap = portraitWrap.current
      if (wrap) {
        gsap.fromTo(
          wrap,
          { y: 40 },
          {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      const statEls = statsRef.current?.querySelectorAll('[data-stat]')
      statEls?.forEach((el) => {
        const target = Number((el as HTMLElement).dataset.target ?? 0)
        const suffix = (el as HTMLElement).dataset.suffix ?? ''
        const obj = { val: 0 }
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: target,
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onUpdate() {
              const v = Math.round(obj.val)
              ;(el as HTMLElement).textContent = formatStatValue(v, suffix)
            },
          }
        )
      })
    })()

    return () => {
      cancelled = true
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill())
      })
    }
  }, [reduced])

  return (
    <>
      <header className="px-5 pb-16 pt-[160px] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
            About
          </p>
          <h1
            className="mt-4 font-display font-bold leading-tight text-ink"
            style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}
          >
            {heroWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: motionEase,
                  delay: reduced ? 0 : i * 0.06,
                }}
                className="mr-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>
      </header>

      <section className="px-5 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16 md:items-start">
          <div ref={portraitWrap} className="relative w-full overflow-hidden rounded-sm md:sticky md:top-28">
            <div className="aspect-[3/4] w-full">
              <img
                src="/images/about/brendon-portrait.jpg"
                alt="Brendon Carbullido"
                className="h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-multiply"
                style={{ backgroundColor: 'rgba(201, 168, 76, 0.12)' }}
              />
            </div>
          </div>
          <div className="font-sans text-sm font-light leading-relaxed text-ink/90 md:text-base">
            <p>
              I&apos;m Brendon Carbullido — an Art Director and Creative Director based in Los Angeles
              with 7+ years building brands that perform. I shoot, direct, edit, and ship. Strategy
              and execution in the same hand.
            </p>
            <p className="mt-6">
              The discipline of a collegiate athlete shapes how I approach every project. High
              performance isn&apos;t a phrase — it&apos;s the standard I hold myself to creatively,
              strategically, and in every client relationship.
            </p>
            <p className="mt-6">
              I&apos;ve worked as an agency Creative Director, an in-house Art Director, and an
              independent brand builder — across fashion, luxury spirits, CPG, beauty, health and
              wellness, jewelry, and celebrity. The thread across all of it: full creative ownership.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28" ref={statsRef}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="border border-line p-5">
              <p
                className="font-display text-4xl font-bold text-gold md:text-5xl"
                data-stat
                data-target={s.value}
                data-suffix={s.suffix}
              >
                {reduced ? formatStatValue(s.value, s.suffix) : formatStatValue(0, s.suffix)}
              </p>
              <p className="mt-2 font-sans text-[11px] font-light uppercase tracking-caps text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2
            className="font-display font-bold text-ink"
            style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}
          >
            Capabilities
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
            {(
              [
                ['Direction', capabilities.direction],
                ['Production', capabilities.production],
                ['Tools', capabilities.tools],
              ] as const
            ).map(([title, items], col) => (
              <div key={title}>
                <p className="font-sans text-[9px] font-bold uppercase tracking-label text-gold">
                  {title}
                </p>
                <ul className="mt-4 space-y-3">
                  {items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={reduced ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 0.5,
                        ease: motionEase,
                        delay: reduced ? 0 : col * 0.05 + i * 0.08,
                      }}
                      className="font-sans text-sm font-light text-ink/90"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-t border-line px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2
            className="mb-8 font-display font-bold text-ink"
            style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}
          >
            Industries
          </h2>
          {reduced ? (
            <p className="font-sans text-[11px] font-semibold uppercase leading-loose tracking-[0.2em] text-ink">
              {industries.join(' · ')}
            </p>
          ) : (
            <div className="relative w-full overflow-hidden">
              <div className="marquee-track">
                {[0, 1].map((dup) => (
                  <div
                    key={dup}
                    className="flex shrink-0 items-center whitespace-nowrap pr-16"
                    aria-hidden={dup === 1}
                  >
                    {industries.map((ind, i) => (
                      <span key={`${dup}-${ind}`} className="flex items-center">
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                          {ind}
                        </span>
                        <span className="mx-4 text-gold" aria-hidden>
                          ·
                        </span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-line px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2
            className="font-display font-bold text-ink"
            style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}
          >
            Experience
          </h2>

          <div className="relative mt-12 space-y-12 border-l border-gold pl-8 md:pl-12">
            {experience.map((exp, idx) => (
              <article key={`${exp.company}-${exp.dates}-${idx}`} className="relative">
                <div className="absolute -left-[33px] top-1 h-2 w-2 rounded-full bg-gold md:-left-[49px]" />
                <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-muted">
                  {exp.dates}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
                  {exp.title}
                </h3>
                <p className="mt-1 font-sans text-sm font-medium text-gold">{exp.company}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-sm font-light text-ink/85">
                  {exp.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14">
            <a
              href="/resume/Brendon_Carbullido_Resume.pdf"
              download
              className="inline-flex cursor-hover border border-gold px-6 py-2 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold transition-colors duration-300 hover:bg-gold hover:text-about"
            >
              Download Resume
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
            Education
          </p>
          <p className="mt-4 max-w-3xl font-sans text-sm font-light leading-relaxed text-ink md:text-base">
            California Lutheran University, B.A. Business Administration, Emphasis: Innovation &amp;
            Entrepreneurship, 2018–2022
          </p>
        </div>
      </section>
    </>
  )
}
