"use client"
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function AuthLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, access, refresh } = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    if (access && refresh && user) {
      router.push("/dashboard")
    }
  }, [access, refresh])
  return (
    <div>{children}</div>
  )
}
