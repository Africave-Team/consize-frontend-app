"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FiX } from 'react-icons/fi'

export default function GeneralCoursesPageLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const path = usePathname()
  return (
    <div className='flex flex-col h-screen'>
      <div className='h-16 border-b p-3 flex justify-between items-center'>
        <div className='h-full flex gap-2 items-center'>
          <Link href="/dashboard/courses" className='h-full border-r w-14 flex justify-center items-center cursor-pointer'>
            <FiX />
          </Link>
          <div className='font-semibold text-base'>
            {
              path.includes('builder') ? 'Update a course' : path.includes('duplicate') ? 'Duplicate a course' : path.includes('bundle') ? 'Create a course bundle' : 'Create a course'
            }
          </div>
        </div>
      </div>
      <div className='flex-1 overflow-y-scroll'>
        {children}
      </div>
    </div>
  )
}
