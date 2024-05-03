'use client'
import moment from 'moment'
import Link from 'next/link'

import { useFormik } from "formik"
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { Button, useToast } from '@chakra-ui/react'
import { useAuthStore } from '@/store/auth.store'
import KippaLogo from '@/components/Logo'
import { useState } from 'react'
import { register } from '@/services/auth.service'
import { FiCheckCircle } from 'react-icons/fi'
import Layout from '@/layouts/PageTransition'

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .required('Provide a password'),
  name: Yup.string().required('Tell us your name'),
  companyName: Yup.string().required('Tell us the name of your organization'),
  email: Yup.string().required('Provide an email address'),
})


export default function RegisterHome () {
  const toast = useToast()
  const { setAccess, setUser, setTeam } = useAuthStore()
  const [registerationCompleted, setRegisterationCompleted] = useState(false)
  const router = useRouter()
  const registerFormik = useFormik({
    initialValues: {
      email: '',
      companyName: '',
      name: '',
      password: ''
    },
    validationSchema: LoginSchema,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await register({
          email: values.email,
          companyName: values.companyName,
          name: values.name,
          password: values.password
        })
        setAccess(result.tokens)
        setUser(result.user)
        setTeam(result.team)

        setRegisterationCompleted(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 4000)
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
      <section id="box" className="bg-gray-100 min-h-[100vh] max-h-[130vh] overflow-y-scroll">
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
                Create an account
              </h1>
              <form className="space-y-2 md:space-y-3" onSubmit={registerFormik.handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
                  <input autoComplete='name' type="text" name="name" id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5"
                    placeholder="Your fullname" onChange={registerFormik.handleChange}
                    value={registerFormik.values.name} onBlur={registerFormik.handleBlur} />
                </div>
                <div>
                  <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900">Your Business name</label>
                  <input autoComplete='companyName' type="text" name="companyName" id="companyName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5"
                    placeholder="Name of your business" onChange={registerFormik.handleChange}
                    value={registerFormik.values.companyName} onBlur={registerFormik.handleBlur} />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
                  <input autoComplete='email' type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Your email" onChange={registerFormik.handleChange}
                    value={registerFormik.values.email} onBlur={registerFormik.handleBlur} />
                </div>
                <div>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                  </div>
                  <input autoComplete='password' type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus-visible:!ring-primary-app focus-visible:!border-primary-app block w-full p-2.5 " onChange={registerFormik.handleChange}
                    value={registerFormik.values.password} onBlur={registerFormik.handleBlur} />
                </div>
                <div>
                  <Button isLoading={registerFormik.isSubmitting} _hover={(!registerFormik.isValid || registerFormik.isSubmitting) ? { background: 'gray.300' } : {}} isDisabled={!registerFormik.isValid} type="submit" className="w-full mt-5 text-black bg-primary-app disabled:bg-primary-app/85 hover:bg-primary-app focus:ring-4 focus:outline-none focus:ring-primary-app font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</Button>
                </div>
                <div>
                  <p className="text-sm font-light text-gray-500 text-center mt-3">
                    <Link href="/auth/login" className="text-sm mt-3 font-medium text-primary-600 hover:underline">Login to your account?</Link>
                  </p>
                </div>
                {registerationCompleted && <div className='min-h-10 px-4 rounded-md py-2 bg-primary-app text-black flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-full flex items-center justify-center'>
                    <FiCheckCircle className='text-3xl' />
                  </div>
                  <div className='text-sm'>
                    Your account has been created. Check your email for the verification mail
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
