import { updateSettings } from '@/services/secure.courses.service'
import { CourseMetadata } from '@/type-definitions/secure.courses'
import { InputGroup, InputRightElement, Spinner, Input } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

export default function Metadata ({ metadata, id, refetch }: { metadata: CourseMetadata, id: string, refetch: () => Promise<any> }) {
  const form = useFormik({
    initialValues: { ...metadata },
    onSubmit: async function (values) {
      await updateSettings({
        id, body: {
          metadata: values
        }
      })
      await refetch()
    }
  })
  return (
    <form onSubmit={form.handleSubmit}>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='font-medium text-sm'>Course metadata</h1>
          <div className='text-[#64748B] text-sm'>Specify details for this course</div>
        </div>
      </div>

      <div className='font-medium text-sm mt-3'>
        Ideal duration for each lesson
      </div>

      <div className='flex mt-1 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[148px] flex rounded-r-md'>
            <div className='text-xs border-r rounded-r-md h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>
              Minutes
            </div>
            <button className='border-r rounded-r-md hover:bg-gray-100  h-full px-3'>
              <FiMinus />
            </button>
            <button className='h-full px-3 hover:bg-gray-100 '>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input value={form.values.idealLessonTime.value} onChange={form.handleChange} onBlur={form.handleBlur} id="idealLessonTime.value" name="idealLessonTime.value" type='number' placeholder='0' />
        </InputGroup>
      </div>



      <div className='font-medium text-sm mt-3'>
        Course completion days
      </div>

      <div className='flex mt-1 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[98px] flex rounded-r-md'>
            <div className='text-xs border-r rounded-r-md h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>

            </div>
            <button className='border-r rounded-r-md hover:bg-gray-100  h-full px-3'>
              <FiMinus />
            </button>
            <button className='h-full px-3 hover:bg-gray-100 '>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input value={form.values.courseCompletionDays} onChange={form.handleChange} onBlur={form.handleBlur} id="courseCompletionDays" name="courseCompletionDays" type='number' placeholder='0' />
        </InputGroup>
      </div>

      <div className='font-medium text-sm mt-3'>
        Maximum number of lessons per day
      </div>

      <div className='flex mt-1 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[98px] flex rounded-r-md'>
            <div className='text-xs border-r rounded-r-md h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>

            </div>
            <button className='border-r rounded-r-md hover:bg-gray-100  h-full px-3'>
              <FiMinus />
            </button>
            <button className='h-full px-3 hover:bg-gray-100 '>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input value={form.values.maxLessonsPerDay} onChange={form.handleChange} onBlur={form.handleBlur} id="maxLessonsPerDay" name="maxLessonsPerDay" type='number' placeholder='0' />
        </InputGroup>
      </div>



      <div className='font-medium text-sm mt-3'>
        Minimum number of lessons per day
      </div>

      <div className='flex mt-1 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[98px] flex rounded-r-md'>
            <div className='text-xs border-r rounded-r-md h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>

            </div>
            <button className='border-r rounded-r-md hover:bg-gray-100  h-full px-3'>
              <FiMinus />
            </button>
            <button className='h-full px-3 hover:bg-gray-100 '>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input value={form.values.minLessonsPerDay} onChange={form.handleChange} onBlur={form.handleBlur} id="minLessonsPerDay" name="minLessonsPerDay" type='number' placeholder='0' />
        </InputGroup>
      </div>



      <div className='font-medium text-sm mt-3'>
        Maximum number of enrolments
      </div>

      <div className='flex mt-1 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[98px] flex rounded-r-md'>
            <div className='text-xs border-r rounded-r-md h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>

            </div>
            <button className='border-r rounded-r-md hover:bg-gray-100  h-full px-3'>
              <FiMinus />
            </button>
            <button className='h-full px-3 hover:bg-gray-100 '>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input type='number' onChange={form.handleChange} onBlur={form.handleBlur} id="maxEnrollments" name="maxEnrollments" placeholder='0' value={form.values.maxEnrollments} />
        </InputGroup>
      </div>
      <div className='flex mt-3'>
        <button type='submit' className='w-full bg-primary-dark flex gap-2 items-center justify-center font-medium text-white h-11 rounded-lg'>
          Save changes
          {form.isSubmitting && <Spinner size="sm" />}
        </button>
      </div>
    </form>
  )
}
