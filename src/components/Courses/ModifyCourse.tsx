import { Course, MediaType } from '@/type-definitions/secure.courses'
import React from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import FileUploader from '@/components/FileUploader'
import ImageBuilder from '@/components/FormButtons/ImageBuilder'
import { useFormik } from 'formik'
import { Select, Spinner, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FileTypes } from '@/type-definitions/utils'
import { updateCourse } from '@/services/secure.courses.service'
import he from "he"
import { Distribution } from '@/type-definitions/callbacks'
import { useAuthStore } from '@/store/auth.store'


const courseDistributionOptions = [
  {
    value: Distribution.SLACK,
    title: "Slack"
  },
  {
    value: Distribution.WHATSAPP,
    title: "Whatsapp"
  }
]



const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  distribution: Yup.string().required().oneOf(Object.values(Distribution)),
  headerMedia: Yup.object({
    mediaType: Yup.string().required(),
    url: Yup.string().required()
  }).required()
})

export default function ModifyCourse ({ course }: { course: Course }) {
  const router = useRouter()
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: course.title,
      description: he.decode(course.description),
      headerMedia: course.headerMedia
    },
    onSubmit: async function (values) {
      const { message }: { message: string, data: Course } = await updateCourse({
        ...values,
        free: true,
        bundle: false,
        private: false,
      }, course.id)
      toast({
        description: message,
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      let path = `/dashboard/courses/${course.id}/builder/lessons`
      router.push(path)
    },
  })
  return (
    <div className='px-4 w-full md:w-4/5'>
      <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
        <div className='font-semibold md:text-2xl text-xl'>
          Update course information
        </div>
      </div>
      <div>
        In this step, we'll ask you the name of your course and what it’s about.
      </div>
      <div className='w-3/5 mt-5'>
        <form onSubmit={form.handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label htmlFor="title">Course title *</label>
            <input onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} name="title" id="title" type="text" placeholder='Course title' className='h-14 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
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
            <button disabled={!form.isValid} type='submit' className='text-sm rounded-lg px-10 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60'>Save and continue
              {form.isSubmitting && <Spinner size={'sm'} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
