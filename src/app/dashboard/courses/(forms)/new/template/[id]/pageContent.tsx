"use client"
import Layout from '@/layouts/PageTransition'
import { duplicateCourse, fetchSingleCourse } from '@/services/secure.courses.service'
import { Course, MediaType } from '@/type-definitions/secure.courses'
import { Editable, EditableInput, EditablePreview, EditableTextarea, Spinner, useEditableControls, useToast } from '@chakra-ui/react'
import * as Yup from 'yup'
import he from "he"
import { useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi'
import { stripHtmlTags } from '@/utils/string-formatters'
import ImageBuilder from '@/components/FormButtons/ImageBuilder'
import FileUploader from '@/components/FileUploader'
import { FileTypes } from '@/type-definitions/utils'
interface ApiResponse {
  data: Course
  message: string
}

const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  headerMedia: Yup.object({
    mediaType: Yup.string().required(),
    url: Yup.string().required()
  }).required()
})

export default function CreateCourseFromTemplatePage ({ courseId }: { courseId: string }) {
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', courseId],
      queryFn: () => loadData({ course: courseId })
    })
  const router = useRouter()
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      description: "",
      headerMedia: {
        mediaType: MediaType.IMAGE,
        url: ""
      }
    },
    onSubmit: async function (values) {
      const { data, message }: { message: string, data: Course } = await duplicateCourse({
        headerMediaUrl: values.headerMedia.url,
        description: values.description,
        title: values.title
      }, courseId)
      toast({
        description: "Course created successfully",
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      let path = `/dashboard/courses/${data.id}/builder/outline`
      if (courseDetails?.data.bundle) {
        path = `/dashboard/courses/${data.id}/builder/publish`
      }
      router.push(path)
    },
  })

  useEffect(() => {
    if (courseDetails) {
      form.setFieldValue("title", courseDetails.data.title)
      form.setFieldValue("description", stripHtmlTags(he.decode(courseDetails.data.description)))
      if (courseDetails.data.headerMedia && courseDetails.data.headerMedia.url) {
        form.setFieldValue("headerMedia.url", courseDetails.data.headerMedia.url)
      }
    }
  }, [courseDetails])
  const EditableControls1 = function () {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()
    return isEditing ? <>
      <button {...getCancelButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
        <FiX />
      </button>
      <button {...getSubmitButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
        <FiCheck />
      </button>
    </> : <button {...getEditButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
      <FiEdit2 />
    </button>

  }

  const EditableControls2 = function () {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()
    return isEditing ? <>
      <button {...getCancelButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
        <FiX />
      </button>
      <button {...getSubmitButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
        <FiCheck />
      </button>
    </> : <button {...getEditButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
      <FiEdit2 />
    </button>

  }
  return (
    <Layout>
      <div className='w-full h-full'>
        <div className='w-full h-full flex justify-center overflow-y-scroll py-20'>
          <form onSubmit={form.handleSubmit} className='w-3/5 flex flex-col border min-h-[700px] p-5 rounded-md'>
            <Editable onChange={(val) => form.setFieldValue('title', val)} className='mb-4 flex justify-between' value={form.values.title}>
              <div className='flex items-center flex-1'>
                <EditablePreview className='font-bold text-3xl' />
                <EditableInput className='px-3 h-12' />
              </div>
              <div className='w-24 flex justify-end items-center gap-1'>
                <EditableControls1 />
              </div>
            </Editable>
            <Editable onChange={(val) => form.setFieldValue('description', val)} className='mb-5 flex justify-between' value={form.values.description}>

              <div className='flex items-center flex-1'>
                <EditablePreview />
                <EditableTextarea p={5} className='h-40' />
              </div>
              <div className='w-24 flex justify-end items-center gap-1'>
                <EditableControls2 />
              </div>
            </Editable>
            <div className=''>
              <div className='h-96 rounded-md w-full group relative'>
                {form.values.headerMedia.url.startsWith('https://') ? <img src={form.values.headerMedia.url} className='h-full w-full rounded-md absolute left-0 top-0' /> : <div className='h-full bg-gray-100'></div>}
                <div className='absolute top-4 right-4 hidden gap-2 group-hover:flex'>
                  <FileUploader buttonOnly={true} originalUrl={form.values.headerMedia.url} mimeTypes={[FileTypes.IMAGE]} droppable={false} onUploadComplete={(val) => {
                    form.setFieldValue("headerMedia.url", val)
                  }} previewable={false} />
                  <ImageBuilder imageText={form.values.title} onFileUploaded={(val) => {
                    form.setFieldValue("headerMedia.url", val)
                  }} label='Generate Image' />
                </div>
              </div>
            </div>
            <div className='justify-end flex mt-5'>
              <button type='submit' className='text-sm px-8 h-12 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Continue
                {form.isSubmitting && <Spinner size={'sm'} />}
              </button>
            </div>
          </form>
          <div className='w-1 text-transparent'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error quod deleniti autem ad a temporibus consequatur tempora, laudantium doloremque quidem numquam maiores. Sapiente asperiores officiis, quibusdam ratione commodi dolorum numquam.
          </div>

        </div>
      </div>
    </Layout>
  )
}
