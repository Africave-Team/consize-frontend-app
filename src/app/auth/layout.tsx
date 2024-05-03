"use client"
import { useAuthStore } from '@/store/auth.store'
import { useNavigationStore } from '@/store/navigation.store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function AuthLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>{children}</div>
  )
}
