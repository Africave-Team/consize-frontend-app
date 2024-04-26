"use client"
import { useAuthStore } from '@/store/auth.store'
import React from 'react'
import Logo from '../Logo'

export default function DashboardNav () {
  const { team } = useAuthStore()
  return (
    <div className='h-16 border-b flex justify-between items-center px-5'>
      {team && <div>
        {team.logo ? <img src={team.logo} className='h-10' /> : <Logo />}
      </div>}
    </div>
  )
}
