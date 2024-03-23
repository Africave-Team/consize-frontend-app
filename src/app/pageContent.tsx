'use client'
import SiteNavBar from '@/components/siteNavBar'
import Hero from '@/components/Hero'
import Section1 from '@/components/Section1'
import Section2 from '@/components/Section2'
import Footer from '@/components/Footer'
import Image from 'next/image'


export default function Home () {
  return (
    <section>
      <SiteNavBar />
      <Hero />
      <Footer />
    </section>
  )
}
