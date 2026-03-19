'use client'

import { useState } from 'react'
import Link from 'next/link'
import { projects } from '@/lib/data'
import type { Project } from '@/lib/data'
import WorkCard from './WorkCard'
import WorkModal from './WorkModal'

type Props = {
  preview: boolean
}

export default function WorkGrid({ preview }: Props) {
  const list = preview ? projects.slice(0, 4) : projects
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section className={`px-5 py-20 md:px-10 md:py-28 ${preview ? 'bg-home' : 'bg-work'}`}>
      <div className="mx-auto max-w-7xl">
        {preview && (
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-caps text-gold">
                Selected Work
              </p>
              <h2
                className="mt-3 font-display font-bold text-ink"
                style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}
              >
                Recent projects.
              </h2>
            </div>
            <Link
              href="/work"
              className="cursor-hover border border-gold px-5 py-2 font-sans text-[11px] font-semibold uppercase tracking-caps text-gold transition-colors duration-300 hover:bg-gold hover:text-home"
            >
              View All Work
            </Link>
          </div>
        )}

        <div
          className={`grid gap-6 ${
            preview ? 'md:grid-cols-2' : 'md:grid-cols-2 md:gap-10'
          }`}
        >
          {list.map((p, i) => (
            <WorkCard
              key={p.id}
              project={p}
              index={i}
              large={!preview}
              onOpen={setActive}
            />
          ))}
        </div>
      </div>

      <WorkModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
