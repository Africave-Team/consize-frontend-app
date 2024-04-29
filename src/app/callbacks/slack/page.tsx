"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import React, { useEffect } from 'react'
import KippaLogo from '@/components/Logo'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useCallbackStore } from '@/store/callbacks.store'
import { slackTokenExchange } from '@/services/slack.services'
import { useToast } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { useAuthStore } from '@/store/auth.store'

export default function page (data: any) {
  const { setPageTitle } = useNavigationStore()
  const { setTeam } = useAuthStore()
  const { redirect } = useCallbackStore()

  const toast = useToast()
  useEffect(() => {
    setPageTitle("Consize - Slack integration")
  }, [])
  const router = useRouter()

  const loginFormik = useFormik({
    initialValues: {
      code: data.searchParams.code,
    },
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const value = await slackTokenExchange(values.code)
        if (value && value.data) {
          setTeam(value.data)
        }
        if (redirect) {
          router.push(redirect)
        }
      } catch (error) {
        toast({
          status: "error",
          description: (error as any).message,
          title: "Failed "
        })
      }
    },
  })
  useEffect(() => {
    loginFormik.submitForm()
  }, [data.searchParams.code])
  return (
    <Layout>
      {/* <div className='h-screen w-screen flex justify-center items-center'>{JSON.stringify(data.searchParams)}</div> */}
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
                Slack verification callback
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginFormik.handleSubmit}>
                Hold on a moment while we verify finish your integration
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
