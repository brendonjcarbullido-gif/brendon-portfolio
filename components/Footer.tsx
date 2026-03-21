import { SOCIAL_LINKS } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <p className="font-sans text-[11px] font-light text-muted">
          © 2025 Brendon Carbullido. Los Angeles.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] font-light text-muted transition-colors hover:text-gold"
          >
            Instagram
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] font-light text-muted transition-colors hover:text-gold"
          >
            LinkedIn
          </a>
        </div>
        <p className="font-sans text-[11px] font-light text-muted">
          Art Direction. Creative Direction. Brand Strategy.
        </p>
      </div>
    </footer>
  )
}
