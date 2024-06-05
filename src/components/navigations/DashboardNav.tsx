"use client"
import { useAuthStore } from '@/store/auth.store'
import React from 'react'
import Logo from '../Logo'
import SubscriptionIndicator from '../SubscriptionIndicator'

export default function DashboardNav () {
  const { team } = useAuthStore()
  return (
    <div className='h-16 border-b flex justify-between items-center px-5'>
      <div className='flex items-center gap-3'>
        {team && team.logo ? <div>
          <img src={team.logo} className='h-10' />
        </div> : <Logo />}
        <SubscriptionIndicator />
      </div>
    </div>
  )
}
