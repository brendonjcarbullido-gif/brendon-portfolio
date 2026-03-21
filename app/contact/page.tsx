'use client'

import { FormEvent, useState } from 'react'
import Footer from '@/components/Footer'
import { SOCIAL_LINKS } from '@/lib/data'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('All fields are required.')
      return
    }
    if (!emailRe.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject.trim()}`)
    const mailtoBody = encodeURIComponent(
      `Hi Brendon,\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
    )
    const mailtoString = `mailto:brendonjcarbullido@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`
    window.open(mailtoString, '_blank')

    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <main className="min-h-screen bg-contact">
      <header className="px-5 pb-12 pt-[160px] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
            Contact
          </p>
          <h1
            className="mt-4 font-display font-bold italic text-ink"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)' }}
          >
            Let&apos;s build something.
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-sm font-light text-muted md:text-base">
            Available for full-time, freelance, and collaborative projects.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 md:grid-cols-[3fr_2fr] md:gap-16 md:px-10">
        <div>
          <form onSubmit={onSubmit} className="space-y-8" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block font-sans text-[9px] font-bold uppercase tracking-label text-gold"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block font-sans text-[9px] font-bold uppercase tracking-label text-gold"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block font-sans text-[9px] font-bold uppercase tracking-label text-gold"
              >
                Project Type
              </label>
              <input
                id="subject"
                name="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brand identity, campaign, packaging…"
                className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block font-sans text-[9px] font-bold uppercase tracking-label text-gold"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Tell me about your project."
                className="mt-2 min-h-[140px] w-full resize-y border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold"
              />
            </div>

            <div className="flex flex-col items-start gap-4">
              <button
                type="submit"
                className="cursor-hover border border-gold px-8 py-3 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold transition-colors duration-300 hover:bg-gold hover:text-contact"
              >
                {sent ? 'Opening your mail app ✓' : 'Send Message'}
              </button>
              <p className="font-sans text-xs font-light text-muted">
                Or email directly:{' '}
                <a
                  href="mailto:brendonjcarbullido@gmail.com"
                  className="text-ink underline transition-colors hover:text-gold"
                >
                  brendonjcarbullido@gmail.com
                </a>
              </p>
              {error && (
                <p className="max-w-lg font-sans text-sm font-light text-ink/80">{error}</p>
              )}
            </div>
          </form>
        </div>

        <aside className="font-sans text-sm font-light text-ink">
          <p className="text-[11px] font-semibold uppercase tracking-caps text-gold">Direct</p>
          <ul className="mt-6 space-y-4">
            <li>
              <a
                href="mailto:brendonjcarbullido@gmail.com"
                className="group flex items-center gap-2 text-ink transition-colors hover:text-gold"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                brendonjcarbullido@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+16504549689"
                className="group flex items-center gap-2 text-ink transition-colors hover:text-gold"
              >
                <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                (650) 454-9689
              </a>
            </li>
            <li>
              <span className="group flex items-center gap-2">
                <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                Los Angeles, CA
              </span>
            </li>
          </ul>

          <hr className="my-10 border-line" />

          <p className="text-[11px] font-semibold uppercase tracking-caps text-gold">Connect</p>
          <ul className="mt-6 space-y-4">
            <li>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-ink transition-colors hover:text-gold"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-ink transition-colors hover:text-gold"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                Instagram
              </a>
            </li>
          </ul>
        </aside>
      </div>

      <Footer />
    </main>
  )
}
