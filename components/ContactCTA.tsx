import Link from 'next/link'

export default function ContactCTA() {
  return (
    <section className="bg-[#0A0A0A] px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <h2
          className="max-w-xl font-display font-bold text-ink"
          style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}
        >
          Let&apos;s build something that performs.
        </h2>
        <Link
          href="/contact"
          className="cursor-hover border border-gold px-8 py-3 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold transition-colors duration-300 hover:bg-gold hover:text-home"
        >
          Start a project
        </Link>
      </div>
    </section>
  )
}
