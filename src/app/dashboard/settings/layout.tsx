'use client'

import SettingsNav from '@/components/navigations/SettingsNav'
import Sidebar from '@/components/navigations/Sidebar'

export default function SettingsLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className='flex h-full overflow-hidden flex-col w-full '>
      <div className='min-h-14 border-b w-full overflow-x-hidden'>
        <SettingsNav />
      </div>
      <div className='flex-1 overflow-y-hidden'>
        {children}
      </div>
    </div>
  )
}
