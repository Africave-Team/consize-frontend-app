"use client"
import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'
import { getAvatarFallback } from '@/utils/string-formatters'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { updatePassword } from '@/services/user.service'
import { Button, useToast } from '@chakra-ui/react'


const LoginSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Provide a new password')
    .min(8, "New password must be at least 8 characters")
    .matches(/\d/, "New password must contain a number")
    .matches(
      /[a-zA-Z]/,
      "New password must contain at least 1 uppercase and 1 lowercase letters"
    ),
  oldPassword: Yup.string()
    .required('Provide your current password')
    .min(8, "Current password must be at least 8 characters")
    .matches(/\d/, "Current password must contain a number")
    .matches(
      /[a-zA-Z]/,
      "Current password must contain at least 1 uppercase and 1 lowercase letters"
    ),
})
export default function SecuritySettingsContent () {
  const toast = useToast()
  const profileFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: ""
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log(values.oldPassword.length)
        await LoginSchema.validate(values)
        await updatePassword(values)
        toast({
          title: 'Finished.',
          description: "Password changed successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        resetForm()
      } catch (error) {
        toast({
          title: 'Failed.',
          description: (error as any).message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  })


  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>

        <div className='w-full'>
          <form className="w-full flex md:flex-row flex-col mt-5" onSubmit={profileFormik.handleSubmit}>
            <div className="w-full md:w-2/5 space-y-2">
              <div className='w-full'>
                <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-gray-900">Current password</label>
                <input autoComplete='oldPassword' type="password" name="oldPassword" id="oldPassword" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Enter your current password" onChange={profileFormik.handleChange}
                  value={profileFormik.values.oldPassword} onBlur={profileFormik.handleBlur} />
              </div>
              <div className='w-full'>
                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">New password</label>
                <input autoComplete='newPassword' type="password" name="newPassword" id="newPassword" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Enter your new password" onChange={profileFormik.handleChange}
                  value={profileFormik.values.newPassword} onBlur={profileFormik.handleBlur} />
              </div>

              <div className='flex justify-end gap-5'>
                <Button isLoading={profileFormik.isSubmitting} isDisabled={profileFormik.isSubmitting} type="submit" className="bg-[#0D1F23] disabled:bg-[#0D1F23]/60 disabled:hover:bg-[#0D1F23]/90 h-11 w-auto px-4 hover:bg-[#0D1F23]/90 focus:ring-4 focus:outline-none focus:ring-[#0D1F23]/90 text-white">Update password</Button>
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
