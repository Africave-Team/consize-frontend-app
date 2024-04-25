import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function CertBuilderNavLink ({ href, title }: { href: string, title: string }) {
  const pathname = usePathname()

  // Check if the current route matches the href

  const isActive = href === pathname

  // Define the classNames based on isActive
  const linkClassName = `${isActive ? 'bg-[#0D1F23] text-white font-semibold' : 'hover:bg-gray-100'} h-12 w-full text-sm border flex items-center px-5`

  return (
    <Link className={linkClassName} href={href}>
      {title}
    </Link>
  )
}
