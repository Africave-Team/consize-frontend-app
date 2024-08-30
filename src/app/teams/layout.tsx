'use client'
import SiteNavBar from '@/components/siteNavBar'

export default function PublicCoursesLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className=''>
      <SiteNavBar team={true} />
      <div className='page-container-2 !p-0'>
        {children}
      </div>
    </div>
  )
}