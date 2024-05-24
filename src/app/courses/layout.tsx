'use client'

import MainFooter from '@/components/navigations/MainFooter'
import SiteNavBar from '@/components/siteNavBar'
import { AnimatePresence } from 'framer-motion'

export default function PublicCoursesLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className=''>
      <SiteNavBar />
      <div className='page-container-2 !p-0'>
        {children}
      </div>
    </div>
  )
}