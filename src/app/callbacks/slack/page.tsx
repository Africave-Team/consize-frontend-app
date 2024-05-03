"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import React, { useEffect, useState } from 'react'
import KippaLogo from '@/components/Logo'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useCallbackStore } from '@/store/callbacks.store'
import { slackTokenExchange, slackTokenExchangeWithToken } from '@/services/slack.services'
import { Spinner, useToast } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { FaCheck } from 'react-icons/fa6'

export default function page (data: any) {
  const { setPageTitle } = useNavigationStore()
  const { setTeam } = useAuthStore()
  const { redirect } = useCallbackStore()
  const [completed, setCompleted] = useState(false)

  const toast = useToast()
  useEffect(() => {
    setPageTitle("Consize - Slack integration")
  }, [])
  const router = useRouter()

  const loginFormik = useFormik({
    initialValues: {
      code: data.searchParams.code,
      state: data.searchParams.state,
    },
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        if (values.state) {
          const stateValues = values.state.split(',')
          if (stateValues.length === 2) {
            const [teamId, token] = stateValues
            if (teamId && token) {
              try {
                await slackTokenExchangeWithToken(values.code, token)
                if (redirect) {
                  router.push(redirect)
                }
                toast({
                  status: "success",
                  description: "Your integration has been completed successfully",
                  title: "Done "
                })
                setCompleted(true)
                return
              } catch (error) {
                toast({
                  status: "error",
                  description: (error as any).message,
                  title: "Failed "
                })
              }
            }
          }
        }
        const value = await slackTokenExchange(values.code)
        if (value && value.data) {
          setTeam(value.data)
        }
        setCompleted(true)
        toast({
          status: "success",
          description: "Your integration has been completed successfully",
          title: "Done "
        })
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
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Slack verification callback
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginFormik.handleSubmit}>
                <div className='text-center'>
                  {loginFormik.isSubmitting && <Spinner />}
                </div>
                {completed && <div className='w-full h-24 flex justify-center items-center'>
                  <div className='h-20 w-20 rounded-full bg-green-400 flex justify-center items-center'>
                    <FaCheck />
                  </div>
                </div>}
                {completed ? <div className='text-center'>Your integration has been completed successfully</div> : <div className='text-center'>Hold on a moment while we verify finish your integration</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
