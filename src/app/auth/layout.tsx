import { useRouter } from 'next/router'
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
