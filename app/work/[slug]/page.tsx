import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects } from '@/lib/data'
import CaseStudyGallery from '@/components/CaseStudyGallery'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const cs = project.caseStudy
  const nextProject = projects[(index + 1) % projects.length]

  return (
    <main className="min-h-screen bg-home">
      {/* Back nav */}
      <div className="fixed left-5 top-[88px] z-[4000] md:left-10">
        <Link
          href="/work"
          className="cursor-hover font-sans text-[11px] font-semibold uppercase tracking-caps text-gold transition-colors hover:text-ink"
        >
          ← Work
        </Link>
      </div>

      {/* Hero block */}
      <section
        className="relative flex min-h-[60vh] items-end overflow-hidden px-5 pb-16 pt-[160px] md:px-10 md:pb-20"
        style={{ backgroundColor: cs.color }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <span className="inline-block rounded-full border border-ink/30 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-caps text-ink/80">
            {project.role}
          </span>
          <h1
            className="mt-4 font-display font-bold text-ink"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            {project.title}
          </h1>
          <p className="mt-2 font-sans text-lg font-light text-ink/70">{project.client}</p>
        </div>
      </section>

      {/* Metadata strip */}
      <section className="border-b border-line px-5 py-8 md:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          <div>
            <p className="font-sans text-[9px] font-bold uppercase tracking-label text-gold">Client</p>
            <p className="mt-1 font-sans text-sm font-light text-ink">{cs.client}</p>
          </div>
          <div>
            <p className="font-sans text-[9px] font-bold uppercase tracking-label text-gold">Role</p>
            <p className="mt-1 font-sans text-sm font-light text-ink">{cs.role}</p>
          </div>
          <div>
            <p className="font-sans text-[9px] font-bold uppercase tracking-label text-gold">Year</p>
            <p className="mt-1 font-sans text-sm font-light text-ink">{cs.year}</p>
          </div>
          <div>
            <p className="font-sans text-[9px] font-bold uppercase tracking-label text-gold">Deliverables</p>
            <p className="mt-1 font-sans text-sm font-light text-ink">
              {cs.deliverables.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink">
            {cs.headline}
          </h2>
          <p className="mt-8 max-w-[60ch] font-sans text-base font-light leading-relaxed text-ink/85 md:text-lg">
            {cs.overview}
          </p>
        </div>
      </section>

      {/* Image gallery */}
      <section className="px-5 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <CaseStudyGallery images={cs.images} title={project.title} />
        </div>
      </section>

      {/* Next project */}
      <Link
        href={`/work/${nextProject.slug}`}
        className="group block border-t border-line px-5 py-16 transition-colors duration-300 hover:bg-[#111] md:px-10 md:py-20"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
              Next Project
            </p>
            <p className="mt-2 font-display text-[clamp(24px,3vw,48px)] font-bold text-ink">
              {nextProject.title}
            </p>
            <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-caps text-muted">
              {nextProject.client}
            </p>
          </div>
          <div className="hidden h-24 w-36 overflow-hidden bg-line opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={nextProject.image}
              alt={nextProject.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Link>
    </main>
  )
}
