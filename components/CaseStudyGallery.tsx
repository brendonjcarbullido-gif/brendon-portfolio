'use client'

import { useState } from 'react'

type Props = {
  images: string[]
  title: string
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-line">
        <p className="font-sans text-sm text-muted">Image coming soon</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setErrored(true)}
    />
  )
}

export default function CaseStudyGallery({ images, title }: Props) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-line">
        <p className="font-sans text-sm text-muted">Gallery images coming soon</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {images.map((src, i) => (
        <div
          key={src}
          className={`overflow-hidden bg-line ${
            i === 0 && images.length > 1 ? 'md:col-span-2' : ''
          }`}
        >
          <GalleryImage src={src} alt={`${title} — image ${i + 1}`} />
        </div>
      ))}
    </div>
  )
}
