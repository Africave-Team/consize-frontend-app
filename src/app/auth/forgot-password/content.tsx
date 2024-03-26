'use client'
import moment from 'moment'
import Countdown, { zeroPad } from 'react-countdown'
import Link from 'next/link'

import { useFormik } from "formik"
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { Button, useToast } from '@chakra-ui/react'
import { useAuthStore } from '@/store/auth.store'
import KippaLogo from '@/components/Logo'
import { useCallback, useEffect, useState } from 'react'
import Layout from '@/layouts/PageTransition'
import { forgotPassword } from '@/services/auth.service'
import { FiCheckCircle } from 'react-icons/fi'

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Provide an email address'),
})


export default function LoginHome () {
  const [completed, setCompleted] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const [showButton, setShowButton] = useState(false)
  const [progress, setProgress] = useState(false)
  const [countdown, setCountdown] = useState(Date.now() + 3 * 1000 * 60)
  const handleCountdownEnd = useCallback(() => {
    setShowButton(true)
  }, [])
  const loginFormik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values) => {
      try {
        await forgotPassword({
          email: values.email
        })
        setCompleted(true)
        setCountdown(Date.now() + 0.5 * 1000 * 60)
        setShowButton(false)
      } catch (error) {
        debugger
        toast({
          title: 'Failed.',
          description: (error as any).message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    },
  })
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
                let's help you get back in
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginFormik.handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
                  <input autoComplete='email' type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Your email" onChange={loginFormik.handleChange}
                    value={loginFormik.values.email} onBlur={loginFormik.handleBlur} />
                </div>
                {!completed ? <>
                  <Button isLoading={loginFormik.isSubmitting} _hover={(!loginFormik.isValid || loginFormik.isSubmitting) ? { background: 'gray.300' } : {}} isDisabled={!loginFormik.isValid} type="submit" className="w-full text-black bg-primary-app disabled:bg-primary-app/25 hover:bg-primary-app focus:ring-4 focus:outline-none focus:ring-primary-app font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Send reset code</Button>
                  <p className="text-sm font-light text-gray-500 text-center">
                    <Link href="/auth/register" className="text-sm font-medium text-primary-600 hover:underline">Create an account?</Link>
                  </p>
                </>
                  :
                  <div className='min-h-10 px-4 rounded-md py-2 bg-primary-app text-black flex items-center gap-4'>
                    <div className='w-16 h-16 rounded-full flex items-center justify-center'>
                      <FiCheckCircle className='text-3xl' />
                    </div>
                    <div className='text-xs'>
                      An email has been sent to the above email address.
                      {showButton ? (
                        <Button isLoading={loginFormik.isSubmitting} className='bg-transparent hover:bg-transparent hover:underline' size={'xs'} onClick={loginFormik.submitForm}>
                          Resend OTP
                        </Button>
                      ) : (
                        <Countdown
                          date={countdown} // 3 minutes in milliseconds
                          onComplete={handleCountdownEnd}
                          autoStart={true}
                          renderer={({ minutes, seconds, completed }) => (
                            <div className='text-xs'>
                              Did&apos;t receive it? Resend in {zeroPad(minutes)}:{zeroPad(seconds)}
                            </div>
                          )}
                        />
                      )}
                    </div>
                  </div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
