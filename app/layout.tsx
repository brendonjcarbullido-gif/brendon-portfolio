import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import CustomCursor from '@/components/CustomCursor'
import GrainOverlay from '@/components/GrainOverlay'
import ScrollProgress from '@/components/ScrollProgress'
import PageTransition from '@/components/PageTransition'
import { TrackingProvider } from '@/context/TrackingContext'
import { TrackingBadge } from '@/components/TrackingBadge'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brendon Carbullido — Art Director & Creative Director | Los Angeles',
  description:
    'Multidisciplinary Art Director and Creative Director based in Los Angeles. 7+ years building brands across fashion, CPG, lifestyle, and luxury. Clients include Anne Klein, Joseph Abboud, and Lotto US.',
  keywords:
    'Art Director Los Angeles, Creative Director, Brand Strategy, Anne Klein, Teeccino Portfolio',
  openGraph: {
    title: 'Brendon Carbullido — Art Director & Creative Director',
    description: 'Full-ownership creative. Los Angeles.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col bg-home font-sans text-ink antialiased">
        <TrackingProvider>
          <ScrollProgress />
          <CustomCursor />
          <GrainOverlay />
          <Nav />
          <PageTransition>{children}</PageTransition>
          <TrackingBadge />
        </TrackingProvider>
      </body>
    </html>
  )
}
