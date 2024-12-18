'use client'
import Link from 'next/link'
import { setCookie } from 'nookies'
import { useFormik } from "formik"
import * as Yup from 'yup'
import { Button, useToast } from '@chakra-ui/react'
import { useAuthStore } from '@/store/auth.store'
import KippaLogo from '@/components/Logo'
import Layout from '@/layouts/PageTransition'
import { login } from '@/services/auth.service'
import { useRouter } from 'next/navigation'
import { COOKIE_AUTH_KEY } from '@/utils/tools'
import { useEffect, useState } from 'react'
import { resolveMyTeamInfo } from '@/services/teams'
import { useQuery } from '@tanstack/react-query'

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .required('Provide a password'),
  email: Yup.string().required('Provide an email address'),
})


export default function LoginHome () {
  const [companyCode, setCompanyName] = useState<string>("")
  const toast = useToast()
  const { setAccess, setUser, setTeam } = useAuthStore()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["company_info", companyCode],
    enabled: companyCode.length > 0,
    queryFn: () => resolveMyTeamInfo(companyCode)
  })


  useEffect(() => {
    let host = location.hostname
    setCompanyName(host)
  }, [])
  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      shortCode: ''
    },
    onSubmit: async (values) => {
      try {
        // validate
        await LoginSchema.validate(values)
        let val = { ...values }
        if (data && data.data) {
          val = { ...values, shortCode: data.data.shortCode }
        }
        const result = await login(val)
        setAccess(result.tokens)
        setUser(result.user)
        setTeam(result.team)
        setCookie(null, COOKIE_AUTH_KEY, result.tokens.access.token, {
          path: "/"
        })
        toast({
          title: 'Finished.',
          description: "Login completed successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        router.push("/dashboard/courses")
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
    let host = location.hostname
    setCompanyName(host)
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
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
