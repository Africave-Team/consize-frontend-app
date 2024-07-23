'use client'

import MainFooter from '@/components/navigations/MainFooter'
import SiteNavBar from '@/components/siteNavBar'

export default function TermsLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <SiteNavBar />
      <div className='h-screen overflow-y-scroll'>
        {children}
        <MainFooter />
      </div>
    </div>
  )
}