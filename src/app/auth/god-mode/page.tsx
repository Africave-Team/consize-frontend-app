"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import React, { useEffect, useState } from 'react'
import KippaLogo from '@/components/Logo'
import { useToast } from '@chakra-ui/react'
import { useAuthStore } from '@/store/auth.store'
import { getProfile } from '@/services/user.service'
import moment from 'moment'
import { fetchMyTeamInfo } from '@/services/teams'
import { setCookie } from 'nookies'
import { COOKIE_AUTH_KEY } from '@/utils/tools'
import Link from 'next/link'

export default function page (data: any) {
  const { setPageTitle } = useNavigationStore()
  const { setAccess, setUser, setTeam } = useAuthStore()

  const loadUserData = async function () {
    const result = await getProfile()
    setUser(result)
  }

  const loadTeamData = async function () {
    const result = await fetchMyTeamInfo()
    setTeam(result)
  }

  const toast = useToast()
  useEffect(() => {
    setPageTitle("Consize - Begining God mode...")
  }, [])

  const handleLogin = async function (accessToken: string, refreshToken: string) {
    setAccess({
      access: {
        token: accessToken,
        expires: moment().add(300, "minutes").toDate()
      },
      refresh: {
        token: refreshToken,
        expires: moment().add(30, "days").toDate()
      }
    })
    await loadUserData()
    await loadTeamData()
    setCookie(null, COOKIE_AUTH_KEY, accessToken, {
      path: "/"
    })
    toast({
      title: 'Finished.',
      description: "Welcome to God-mode",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    const el = document.getElementById("dashboard")
    if (el) {
      el.click()
    }

  }
  useEffect(() => {
    if (data.searchParams.accessToken && data.searchParams.refreshToken) {
      handleLogin(data.searchParams.accessToken, data.searchParams.refreshToken)
    }
  }, [data.searchParams.accessToken, data.searchParams.refreshToken])
  return (
    <Layout>
      {/* <div className='h-screen w-screen flex justify-center items-center'>{JSON.stringify(data.searchParams)}</div> */}
      <section id="box" className="bg-gray-100">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <Link href="/dashboard/courses" id="dashboard" />
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
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Initializing God mode....
              </h1>
              <div className='text-center'>Hold on a moment while we verify your access credentials</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
