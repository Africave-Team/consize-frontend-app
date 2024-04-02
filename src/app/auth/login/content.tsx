'use client'
import Link from 'next/link'

import { useFormik } from "formik"
import * as Yup from 'yup'
import { Button, useToast } from '@chakra-ui/react'
import { useAuthStore } from '@/store/auth.store'
import KippaLogo from '@/components/Logo'
import Layout from '@/layouts/PageTransition'
import { login } from '@/services/auth.service'
import { useRouter } from 'next/navigation'

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .required('Provide a password'),
  email: Yup.string().required('Provide an email address'),
})


export default function LoginHome () {
  const toast = useToast()
  const { setAccess, setUser, setTeam } = useAuthStore()
  const router = useRouter()
  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      try {
        // validate
        await LoginSchema.validate(values)
        const result = await login(values)
        setAccess(result.tokens)
        setUser(result.user)
        setTeam(result.team)
        toast({
          title: 'Finished.',
          description: "Login completed successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        router.push("/dashboard")
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
                Sign in to your organization
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginFormik.handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
                  <input autoComplete='email' type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Your email" onChange={loginFormik.handleChange}
                    value={loginFormik.values.email} onBlur={loginFormik.handleBlur} />
                </div>
                <div>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <Link scroll={false} className='text-xs hover:underline' href={'/auth/forgot-password'}>Forgot your password?</Link>
                  </div>
                  <input autoComplete='password' type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus-visible:!ring-primary-app focus-visible:!border-primary-app block w-full p-2.5 " onChange={loginFormik.handleChange}
                    value={loginFormik.values.password} onBlur={loginFormik.handleBlur} />
                </div>
                <Button isLoading={loginFormik.isSubmitting} _hover={(!loginFormik.isValid || loginFormik.isSubmitting) ? { background: 'gray.300' } : {}} isDisabled={!loginFormik.isValid} type="submit" className="w-full text-black bg-primary-app disabled:bg-primary-app/25 hover:bg-primary-app focus:ring-4 focus:outline-none focus:ring-primary-app font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</Button>
                <p className="text-sm font-light text-gray-500 text-center">
                  <Link scroll={false} href="/auth/register" className="text-sm font-medium text-primary-600 hover:underline">Create an account?</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
