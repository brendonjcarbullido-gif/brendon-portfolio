import WorkGrid from '@/components/WorkGrid'
import Footer from '@/components/Footer'

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-work">
      <header className="px-5 pb-12 pt-[160px] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
            Selected Work
          </p>
          <h1
            className="mt-4 font-display font-bold text-ink"
            style={{ fontSize: 'clamp(64px, 8vw, 120px)' }}
          >
            Creative Direction.
          </h1>
          <p
            className="mt-6 font-sans text-sm font-light text-muted md:text-base"
            style={{ letterSpacing: '0.3em' }}
          >
            Campaign. Brand. Content. Production.
          </p>
        </div>
      </header>
      <WorkGrid preview={false} />
      <Footer />
    </main>
  )
}
