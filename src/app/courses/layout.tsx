'use client'

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
      <div className=''>
        <AnimatePresence mode="wait" initial={false}>
          {children}
        </AnimatePresence>
      </div>
    </div>
  )
}