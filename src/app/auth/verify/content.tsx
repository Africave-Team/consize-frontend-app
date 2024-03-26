'use client'
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useToast } from '@chakra-ui/react'
import KippaLogo from '@/components/Logo'
import { useEffect } from 'react'
import Layout from '@/layouts/PageTransition'
import { verifyAccount } from '@/services/auth.service'


export default function VerifyContent ({ token }: { token: string }) {
  const toast = useToast()
  const router = useRouter()
  const loginFormik = useFormik({
    initialValues: {

    },
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await verifyAccount({ token })
        toast({
          title: 'Finished.',
          description: "Account verified successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        router.push("/auth/login")
      } catch (error) {
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

  useEffect(() => {
    loginFormik.submitForm()
  }, [token])
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
                Account verification
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginFormik.handleSubmit}>
                Hold on a moment while we verify your account
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
