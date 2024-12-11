"use client"
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import MainFooter from '@/components/navigations/MainFooter'
import Section1 from '@/components/Section1'
import Section2 from '@/components/Section2'
import SiteNavBar from '@/components/siteNavBar'
import SiteTemporarilyDown from '@/components/SiteTemporarilyDown'
import Layout from '@/layouts/PageTransition'
import React from 'react'

export default function HomePageContent () {
  const disabled = process.env['NEXT_PUBLIC_DISABLE_SITE'] === "YES"
  return (
    <Layout>
      <section className='h-screen flex flex-col overflow-x-hidden'>
        <SiteNavBar disabled={disabled} />
        {disabled ? <SiteTemporarilyDown /> : <div className='h-screen overflow-y-scroll'>
          <Hero />
          <Section1 />
          <Section2 />
          <MainFooter />
        </div>}
      </section>
    </Layout>
  )
}
