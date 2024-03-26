"use client"
import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'
import { getAvatarFallback } from '@/utils/string-formatters'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { updateProfile, getProfile } from '@/services/user.service'

export default function ProfileSettings () {
  const { user, setUser } = useAuthStore()

  const profileFormik = useFormik({
    initialValues: {
      email: user?.email || '',
      name: user?.name || '',
      avatar: user?.avatar || ''
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Provide a name for this team member'),
          avatar: Yup.string(),
          email: Yup.string().required('Provide an email address for this team member'),
        })
        await schema.validate(values)
        await updateProfile({ name: values.name, avatar: values.avatar })
        await loadUserData()
      } catch (error) {

      }
    }
  })

  const loadUserData = async function () {
    const result = await getProfile()
    setUser(result)
  }

  useEffect(() => {
    if (user) {
      profileFormik.setValues({
        name: user.name, email: user.email, avatar: user.avatar || ''
      })
    }
  }, [user])

  useEffect(() => {
    loadUserData()
  }, [])


  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>
        <div className='relative group h-32 w-32'>
          <div className='h-32 w-32 absolute top-0 left-0 rounded-full border bg-primary-dark'>
            {profileFormik.values.avatar ? <img src={profileFormik.values.avatar} className='h-full w-full rounded-full' /> : <div className='h-full w-full rounded-full text-white flex justify-center items-center font-semibold text-2xl'>{getAvatarFallback(user?.name || '')}</div>}
          </div>
          <div className='absolute top-0 right-0 h-10 w-10 flex justify-center items-center'>
            <button className='group-hover:flex text-white bg-primary-dark shadow  justify-center items-center h-10 w-10 rounded-full hidden'>
              <FiEdit2 />
            </button>
          </div>
        </div>

        <div className='w-full'>
          <form className="w-full flex md:flex-row flex-col mt-5" onSubmit={profileFormik.handleSubmit}>
            <div className="w-full md:w-2/5 space-y-2">
              <div className='w-full'>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
                <input autoComplete='email' type="text" name="email" disabled id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Email address" onChange={profileFormik.handleChange}
                  value={profileFormik.values.email} onBlur={profileFormik.handleBlur} />
              </div>
              <div className='w-full'>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
                <input autoComplete='name' type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Full name" onChange={profileFormik.handleChange}
                  value={profileFormik.values.name} onBlur={profileFormik.handleBlur} />
              </div>

              <div className='flex justify-end gap-5'>
                <button onClick={() => profileFormik.submitForm()} disabled={!profileFormik.touched.name} className='bg-[#0D1F23] disabled:bg-[#0D1F23]/60 h-11 w-auto px-8 text-white' >Save</button>
              </div>


            </div>

            <div className="w-full md:w-2/5">


            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
