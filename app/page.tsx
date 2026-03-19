import Hero from '@/components/Hero'
import WorkGrid from '@/components/WorkGrid'
import AboutPreview from '@/components/AboutPreview'
import ContactCTA from '@/components/ContactCTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="bg-home">
      <Hero />
      <WorkGrid preview />
      <AboutPreview />
      <ContactCTA />
      <Footer />
    </main>
  )
}
