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
  const { user, access, refresh } = useAuthStore()
  const { setPageTitle } = useNavigationStore()
  const router = useRouter()
  useEffect(() => {
    setPageTitle("Consize - Console Authentication")
  }, [])
  return (
    <div>{children}</div>
  )
}
