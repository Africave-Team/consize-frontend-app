"use client"
import { useAuthStore } from '@/store/auth.store'
import React from 'react'
import Logo from '../Logo'
import SubscriptionIndicator from '../SubscriptionIndicator'
import { usePathname } from 'next/navigation'

export default function DashboardNav () {
  const { team } = useAuthStore()
  const pathname = usePathname()
  return (
    <div className='h-16 border-b flex justify-between items-center px-5'>
      <div className='flex items-center gap-3'>
        {team && team.logo ? <div>
          <img src={team.logo} className='h-10' />
        </div> : <Logo />}
        {!pathname.startsWith('/console') && <SubscriptionIndicator />}
      </div>
    </div>
  )
}
