'use client'

import MainFooter from '@/components/navigations/MainFooter'
import SiteNavBar from '@/components/siteNavBar'

export default function PrivacyLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className=''>
      <SiteNavBar />
      <div className=''>
        {children}
        <MainFooter />
      </div>
    </div>
  )
}