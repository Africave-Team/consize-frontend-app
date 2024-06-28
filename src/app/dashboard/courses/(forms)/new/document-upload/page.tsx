"use client"
import Layout from '@/layouts/PageTransition'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Course } from '@/type-definitions/secure.courses'
import { generateCourseOutlineFile } from '@/services/secure.courses.service'
import { useRouter } from 'next/navigation'
import { Spinner, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import FileUploader from '@/components/FileUploader'
import { FileTypes } from '@/type-definitions/utils'


const validationSchema = Yup.object({
  title: Yup.string().required(),
  files: Yup.array().of(Yup.string().required()),
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
      files: [],
      id: ""
    },
    onSubmit: async function (values, { setFieldValue }) {
      try {
        const { data }: { data: Course } = await generateCourseOutlineFile({
          title: values.title,
          files: values.files
        })
        toast({
          title: "Completed",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        router.push(`/dashboard/courses/${data.id}/builder/ai/finish`)
      } catch (error) {
        console.log(error)
      }
    },
  })
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-4/5'>
            <div>
              Step 1
            </div>
            <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
              <div className='font-semibold md:text-2xl text-xl'>
                Tell us about your course
              </div>
            </div>
            <div className='w-3/5'>
              In this step, we'll ask you a few questions about your course. This would help the AI better tailor the course content to your specific needs.
            </div>

            <div className='w-3/5 mt-8 border border-[#D8E0E9] shadow p-6 rounded-lg'>
              <form onSubmit={form.handleSubmit} className='flex flex-col gap-4'>
                <div>
                  <label htmlFor="title">Course title *</label>
                  <input value={form.values.title} onChange={form.handleChange} onBlur={form.handleBlur} id="title" type="text" placeholder='Course title' className='h-12 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                </div>
                <FileUploader originalUrl={form.values.files} mimeTypes={[FileTypes.PDF]} droppable={false} onUploadComplete={(val) => {
                  form.setFieldValue("files", val)
                }} previewable={true} buttonOnly={true} multiple={true} />

                <div className='justify-end gap-2 flex'>
                  <Link href="/dashboard/courses/new/methods" className='text-sm px-7 h-12 border items-center justify-center text-primary-dark font-medium bg-white flex gap-1 rounded-3xl'>
                    Back
                  </Link>
                  <button disabled={!form.isValid} type='submit' className='text-sm px-7 h-12 items-center justify-center text-primary-dark font-medium bg-primary-app flex gap-1 disabled:bg-primary-app/60 rounded-3xl'>Next
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
