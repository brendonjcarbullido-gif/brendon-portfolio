'use client'

import { FormEvent, useState } from 'react'
import Footer from '@/components/Footer'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function onSubmit(e: FormEvent) {
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

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })
      setLoading(false)
      if (!res.ok) {
        setError(
          'Something went wrong. Please email me directly at brendonjcarbullido@gmail.com'
        )
        return
      }
      setDone(true)
    } catch {
      setLoading(false)
      setError(
        'Something went wrong. Please email me directly at brendonjcarbullido@gmail.com'
      )
    }
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
          {done ? (
            <p className="font-display text-3xl font-bold italic text-gold md:text-4xl">
              Message sent. I&apos;ll be in touch.
            </p>
          ) : (
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
                  disabled={loading}
                  placeholder="Your name"
                  className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold disabled:opacity-50"
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
                  disabled={loading}
                  placeholder="you@example.com"
                  className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block font-sans text-[9px] font-bold uppercase tracking-label text-gold"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  placeholder="Project type, timeline…"
                  className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold disabled:opacity-50"
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
                  disabled={loading}
                  rows={6}
                  placeholder="Tell me about your project."
                  className="mt-2 min-h-[140px] w-full resize-y border-0 border-b border-line bg-transparent py-2 font-sans text-sm font-light text-ink placeholder:text-[#444444] outline-none transition-colors duration-300 focus:border-gold disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col items-start gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-hover border border-gold px-8 py-3 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold transition-colors duration-300 hover:bg-gold hover:text-contact disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {error && (
                  <p className="max-w-lg font-sans text-sm font-light text-ink/80">{error}</p>
                )}
              </div>
            </form>
          )}
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
                href="#"
                className="group flex items-center gap-2 text-ink transition-colors hover:text-gold"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="#"
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
