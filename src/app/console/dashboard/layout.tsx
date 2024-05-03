'use client'

import DashboardNav from '@/components/navigations/DashboardNav'
import Sidebar from '@/components/navigations/AdminSidebar'

export default function ConsoleDashboardLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-full w-full '>
      <>
        <Sidebar />
        <div className='flex-1 h-full transition-all duration-500'>
          <DashboardNav />
          <div className='page-container'>
            {children}
          </div>
        </div>
      </>
    </div>
  )
}
