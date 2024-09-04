'use client'
import moment from 'moment'
import Link from 'next/link'

import { useFormik } from "formik"
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { Button, useToast } from '@chakra-ui/react'
import { useAuthStore } from '@/store/auth.store'
import KippaLogo from '@/components/Logo'
import { useEffect, useState } from 'react'
import Layout from '@/layouts/PageTransition'
import { resetPassword } from '@/services/auth.service'

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .required('Provide a password')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-zA-Z]).+$/, "Must contain at least 1 alphabet and 1 number"),
  confirmPassword: Yup.string()
    .required('Please retype your password.')
    .oneOf([Yup.ref('password')], 'Your passwords do not match.')
})


export default function LoginHome ({ token }: { token: string }) {
  const toast = useToast()
  const router = useRouter()
  const loginFormik = useFormik({
    initialValues: {
      confirmPassword: '',
      password: ''
    },
    validationSchema: LoginSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await resetPassword({ password: values.password, token })
        toast({
          title: 'Finished.',
          description: "Password changed successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        router.push("/auth/login")
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
                Set a new password
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginFormik.handleSubmit}>
                <div>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                  </div>
                  <input autoComplete='password' type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus-visible:!ring-primary-app focus-visible:!border-primary-app block w-full p-2.5 " onChange={loginFormik.handleChange}
                    value={loginFormik.values.password} onBlur={loginFormik.handleBlur} />
                  <span className='text-sm text-red-400'>
                    {loginFormik.errors.password}
                  </span>
                </div>
                <div>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirm new password</label>
                  </div>
                  <input autoComplete='confirmPassword' type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus-visible:!ring-primary-app focus-visible:!border-primary-app block w-full p-2.5 " onChange={loginFormik.handleChange}
                    value={loginFormik.values.confirmPassword} onBlur={loginFormik.handleBlur} />

                  <span className='text-sm text-red-400'>
                    {loginFormik.errors.confirmPassword}
                  </span>
                </div>
                <Button isLoading={loginFormik.isSubmitting} _hover={(!loginFormik.isValid || loginFormik.isSubmitting) ? { background: 'gray.300' } : {}} isDisabled={!loginFormik.isValid} type="submit" className="w-full text-black bg-primary-app disabled:bg-primary-app/85 hover:bg-primary-app focus:ring-4 focus:outline-none focus:ring-primary-app font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</Button>
                <p className="text-sm font-light text-gray-500 text-center">
                  <Link href="/auth/register" className="text-sm font-medium text-primary-600 hover:underline">Create an account?</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
