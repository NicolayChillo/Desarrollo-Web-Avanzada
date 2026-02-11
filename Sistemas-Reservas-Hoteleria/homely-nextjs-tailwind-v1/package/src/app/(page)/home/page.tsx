import Hero from '@/components/Home/Hero'
import Properties from '@/components/Home/Properties'
import Services from '@/components/Home/Services'
import BlogSmall from '@/components/shared/Blog'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hotel Scalibur - Cumbayá, Pichincha',
  description: 'Descubre nuestras habitaciones y servicios exclusivos en Hotel Scalibur'
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Properties />
      <BlogSmall />
    </main>
  )
}
