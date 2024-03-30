'use client'

import DashboardNav from '@/components/navigations/DashboardNav'
import Sidebar from '@/components/navigations/Sidebar'
import { sendVerificationEmail } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, access, refresh } = useAuthStore()
  const toast = useToast()
  const router = useRouter()

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
    if (typeof window !== "undefined") {
      // if (!access || !refresh || !user) {
      //   useAuthStore.setState({
      //     team: undefined,
      //     access: undefined,
      //     user: undefined,
      //     refresh: undefined
      //   })
      //   router.push("/auth/login")
      // }
      console.log(access, refresh, user)
    }

  }, [access, refresh, user])
  return (
    <div className='flex h-full w-full '>
      {refresh && access && user && <>
        <Sidebar />
        <div className='flex-1 h-full'>
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
      </>}
    </div>
  )
}
