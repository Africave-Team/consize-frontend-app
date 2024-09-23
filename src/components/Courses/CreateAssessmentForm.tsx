import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import he from "he"
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Spinner, useToast } from '@chakra-ui/react'
import { createQuestionGroup } from '@/services/secure.courses.service'
import { queryClient } from '@/utils/react-query'


const validationSchema = Yup.object({
  message: Yup.string().required(),
  title: Yup.string().required()
})

export default function NewAssessmentForm ({ courseId, close }: { courseId: string, close: () => void }) {
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      message: "Before we dive into the course, let’s take a quick assessment to gauge your current understanding of the subject matter 🧠. Don't worry, this assessment won't affect your final grade but will help us understand how much you’ve learned by the end of the course",
      title: ""
    },
    onSubmit: async function (values) {

      const { message, data } = await createQuestionGroup({
        courseId, ...values
      })
      queryClient.invalidateQueries({
        queryKey: ['course', courseId],
      })
      toast({
        description: "Done",
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      close()
    },
  })
  return (
    <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
      <div className='flex justify-between items-center h-10'>
        <div className='font-semibold text-lg'>Add a new assessment to the course</div>
      </div>
      <div className='mt-4 flex flex-col gap-4 flex-1 overflow-y-scroll' id="parent">
        <div>
          <label htmlFor="title">Assessment title</label>
          <input onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} name="title" id="title" type="text" placeholder='Title of assessment' className='h-10 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="description">Intro message *</label>
          <textarea className='px-4 py-2 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' name="message" id="message" onChange={form.handleChange} placeholder='Enter the intro messsage for this assessment' value={form.values.message} cols={4} onBlur={form.handleBlur}></textarea>
        </div>
      </div>
      <div className='h-14 w-full'>
        <div className='justify-end flex h-full items-center gap-2'>
          <button onClick={() => close()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
          <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save assessment
            {form.isSubmitting && <Spinner size={'sm'} />}
          </button>
        </div>
      </div>
    </form>
  )
}
