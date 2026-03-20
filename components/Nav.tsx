'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { motionEase, usePrefersReducedMotion } from '@/lib/motion'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const stagger = reduced ? 0 : 0.08

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[5000] flex h-[72px] items-center justify-between px-5 transition-[background,backdrop-filter] duration-300 md:px-10 ${
          scrolled ? 'bg-[rgba(13,13,13,0.88)] backdrop-blur-[16px]' : 'bg-transparent'
        }`}
      >
        <Link
          href="/"
          className="font-display text-[22px] font-bold text-gold cursor-hover"
        >
          BC
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`cursor-hover font-sans text-[11px] font-semibold uppercase tracking-caps text-ink ${
                  active ? 'border-b border-gold pb-0.5' : ''
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden cursor-hover"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span className="h-px w-6 bg-ink" />
          <span className="h-px w-6 bg-ink" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[6000] flex flex-col bg-home px-8 pt-24 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: motionEase }}
          >
            <button
              type="button"
              className="absolute right-5 top-5 font-sans text-sm uppercase tracking-caps text-gold cursor-hover"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <div className="flex flex-col gap-6">
              <Link
                href="/"
                className="cursor-hover font-display text-4xl font-bold text-ink"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : i * stagger, ease: motionEase, duration: 0.4 }}
                >
                  <Link
                    href={l.href}
                    className="cursor-hover font-display text-4xl font-bold text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
