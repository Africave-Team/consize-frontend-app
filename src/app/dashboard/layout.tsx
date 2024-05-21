'use client'

import DashboardNav from '@/components/navigations/DashboardNav'
import Sidebar from '@/components/navigations/Sidebar'
import { sendVerificationEmail } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const [showNav, setShowNav] = useState(false)
  const { user, access } = useAuthStore()
  const toast = useToast()
  const pathname = usePathname()

  const resendVerificationEmail = async function () {
    await sendVerificationEmail()
    toast({
      title: 'Finished.',
      description: "Verification email has been sent",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  useEffect(() => {
    if (pathname.includes('courses/new') || pathname.includes('builder')) {
      setShowNav(false)
    } else {
      setShowNav(true)
    }
  }, [pathname])

  return (
    <div className='flex h-full w-full '>
      <>
        <Sidebar />
        <div className='flex-1 h-full transition-all duration-500'>
          {showNav && <DashboardNav />}
          {user && !user?.isEmailVerified && <div className='h-10 w-full flex justify-center items-center'>
            <div className='w-1/2 text-white py-1 my-5 text-xs bg-black rounded-sm text-center'>
              Your account has not been verified. Check your email for the verification code or <button onClick={resendVerificationEmail} className='font-semibold text-sm underline'>click here</button> to resend it.
            </div>
          </div>}
          <div className={showNav ? 'page-container' : 'h-[100vh]'}>
            {children}
          </div>
        </div>
      </>
    </div>
  )
}
