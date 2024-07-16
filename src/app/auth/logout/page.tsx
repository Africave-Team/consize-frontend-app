"use client"
import { useAuthStore } from '@/store/auth.store'
import React, { useEffect } from 'react'
import KippaLogo from '@/components/Logo'
import { cookies } from "next/headers"
import Layout from '@/layouts/PageTransition'
import { Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/auth.service'
import { destroyCookie, parseCookies } from 'nookies'
import { COOKIE_AUTH_KEY } from '@/utils/tools'


export default function page () {
  const { logoutAccount, refresh } = useAuthStore()
  const router = useRouter()
  const logoutNow = async function () {
    if (refresh) {
      await logout({
        refreshToken: refresh?.token
      })
    }
    destroyCookie(null, COOKIE_AUTH_KEY, {
      path: "/"
    })
    await logoutAccount()
    router.push("/auth/login")
  }
  useEffect(() => {
    logoutNow()
  }, [])
  return (
    <Layout>
      <section id="box" className="bg-gray-100">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className='flex justify-center pt-10'>
              <div>
                <a
                  className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0"
                  href="/">
                  <KippaLogo />
                </a>
              </div>
            </div>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Signing out of your organization
              </h1>
              <div className='w-full flex justify-center'>
                <Spinner />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
