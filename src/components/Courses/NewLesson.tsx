import React from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Spinner, useToast } from '@chakra-ui/react'
import he from "he"


const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().optional()
})

export default function NewLesson ({ courseId, handleFinish }: { courseId: string, handleFinish: () => void }) {
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async function (values) {

      // toast({
      //   description: message,
      //   title: "Completed",
      //   status: 'success',
      //   duration: 2000,
      //   isClosable: true,
      // })
    },
  })
  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <div className='font-semibold text-lg'>Add a new lesson</div>
      </div>
      <div>
        <form onSubmit={form.handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label htmlFor="title">Lesson title *</label>
            <input onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} name="title" id="title" type="text" placeholder='Lesson title' className='h-14 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
          </div>
          <div>
            <label htmlFor="description">Lesson description (optional)</label>
            <CustomTinyMCEEditor field='description' maxLength={150} onChange={(value) => {
              form.setFieldValue("description", value)
            }} placeholder='Describe your lesson for us. This is optional' value={form.values.description} aiOptionButtons={[]} />
          </div>
          <div className='justify-end flex'>
            <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save lesson
              {form.isSubmitting && <Spinner size={'sm'} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
