'use client'

import DashboardNav from '@/components/navigations/DashboardNav'
import Sidebar from '@/components/navigations/Sidebar'
import { sendVerificationEmail } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, access } = useAuthStore()
  const toast = useToast()

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

  return (
    <div className='flex h-full w-full '>
      <>
        <Sidebar />
        <div className='flex-1 h-full transition-all duration-500'>
          <DashboardNav />
          {user && !user?.isEmailVerified && <div className='h-8 w-full flex justify-center items-center'>
            <div className='w-1/2 text-white py-1 mt-5 text-xs bg-black rounded-md text-center'>
              Your account has not been verified. Check your email for the verification code or <button onClick={resendVerificationEmail} className='font-semibold text-sm underline'>click here</button> to resend it.
            </div>
          </div>}
          <div className='page-container'>
            {children}
          </div>
        </div>
      </>
    </div>
  )
}
