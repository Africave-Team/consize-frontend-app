"use client"
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import FileUploader from '@/components/FileUploader'
import ImageBuilder from '@/components/FormButtons/ImageBuilder'
import Layout from '@/layouts/PageTransition'
import { FileTypes } from '@/type-definitions/utils'
import React from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Course, MediaType } from '@/type-definitions/secure.courses'
import { createCourse } from '@/services/secure.courses.service'
import { useRouter } from 'next/navigation'
import { Spinner, useToast } from '@chakra-ui/react'


const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  headerMedia: Yup.object({
    mediaType: Yup.string().required(),
    url: Yup.string().required()
  }).required()
})

export default function page () {
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
      const { data, message }: { message: string, data: Course } = await createCourse({
        ...values,
        free: true,
        bundle: false,
        private: false,
      })
      toast({
        description: message,
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      router.push(`/dashboard/courses/${data.id}/modify`)
    },
  })
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-4/5'>
            <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
              <div className='font-semibold md:text-2xl text-xl'>
                Step 1
              </div>
            </div>
            <div>
              In this step, we'll ask you the name of your course and what it’s about.
            </div>

            <div className='w-3/5 mt-5'>
              <form onSubmit={form.handleSubmit} className='flex flex-col gap-4'>
                <div>
                  <label htmlFor="title">Course title *</label>
                  <input onChange={form.handleChange} onBlur={form.handleBlur} id="title" type="text" placeholder='Course title' className='h-14 px-4 focus-visible:outline-none w-full rounded-none border border-[#0D1F23]' />
                </div>
                <div>
                  <label htmlFor="description">Course description *</label>
                  <CustomTinyMCEEditor field='description' maxLength={250} onChange={(value) => {
                    form.setFieldValue("description", value)
                  }} placeholder='Describe your course for us' value={form.values.description} aiOptionButtons={[]} />
                </div>
                <div className='w-[640px]'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="">Course header image</label>
                    <ImageBuilder imageText={form.values.title} onFileUploaded={(val) => {
                      form.setFieldValue("headerMedia.url", val)
                    }} label='Build header' />
                  </div>
                  <FileUploader originalUrl={form.values.headerMedia.url} mimeTypes={[FileTypes.IMAGE]} droppable={false} onUploadComplete={(val) => {
                    form.setFieldValue("headerMedia.url", val)
                  }} previewable={true} />
                </div>
                <div className='justify-end flex'>
                  <button disabled={!form.isValid} type='submit' className='text-sm px-10 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-none'>Next
                    {form.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
