import React from 'react'
import { usePathname } from 'next/navigation'
import { useNavigationStore } from '@/store/navigation.store'
import Link from 'next/link'

export default function SidebarLink ({ href, children }: { href: string, children: React.ReactNode }) {
  const { sidebarOpen } = useNavigationStore()
  const pathname = usePathname()

  // Check if the current route matches the href

  const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  // Define the classNames based on isActive
  const linkClassName = `${isActive ? 'bg-[#0D1F23] text-white' : 'hover:bg-gray-100'} flex items-center ${sidebarOpen ? 'justify-start px-8' : 'justify-center'} w-full border-b h-16`

  return (
    <Link className={linkClassName} href={href}>
      {children}
    </Link>
  )
}
