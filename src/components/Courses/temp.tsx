import { Course, MediaType } from '@/type-definitions/secure.courses'
import React from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import FileUploader from '@/components/FileUploader'
import ImageBuilder from '@/components/FormButtons/ImageBuilder'
import { useFormik } from 'formik'
import { Spinner, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FileTypes } from '@/type-definitions/utils'
import { updateCourse } from '@/services/secure.courses.service'
import he from "he"



const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().optional()
})

export default function ListLessons ({ course, refetch }: { course: Course, refetch: () => void }) {
  const router = useRouter()
  const toast = useToast()
  // const form = useFormik({
  //   validationSchema,
  //   validateOnMount: true,
  //   validateOnChange: true,
  //   initialValues: {
  //     title: course.title,
  //     description: he.decode(course.description),
  //   },
  //   onSubmit: async function (values) {
  //     const { message }: { message: string, data: Course } = await updateCourse({
  //       ...values,
  //       free: true,
  //       bundle: false,
  //       private: false,
  //     }, course.id)
  //     toast({
  //       description: message,
  //       title: "Completed",
  //       status: 'success',
  //       duration: 2000,
  //       isClosable: true,
  //     })
  //     router.push(`/dashboard/courses/${course.id}/modify/lessons`)
  //   },
  // })
  return (
    <div className='px-4 w-full md:w-4/5'>
      <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
        <div className='font-semibold md:text-2xl text-xl'>
          Update lessons
        </div>
      </div>
      <div>
        In this step, we'll ask you the name of your course and what it’s about.
      </div>
      <div className='w-3/5 mt-5'>
        <div className='w-full border h-10'></div>
      </div>
    </div>
  )
}
