import { deleteLesson } from '@/services/lessons.service'
import { deleteAssessment } from '@/services/secure.courses.service'
import { Spinner, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React from 'react'
import { FiX } from 'react-icons/fi'

export default function DeleteAssessmentComponent ({ courseId, refetch, assessmentId, onClose }: { courseId: string, refetch: () => Promise<any>, assessmentId: string, onClose: () => void }) {
  const toast = useToast()
  const form = useFormik({
    initialValues: {
    },
    onSubmit: async function (values) {
      const { message } = await deleteAssessment(assessmentId)
      toast({
        description: message,
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      refetch()
    },
  })
  return (
    <div className='py-5'>
      <div className='flex justify-center'>
        <div className='h-14 w-14 rounded-full bg-primary-dark flex justify-center items-center'>
          <FiX className='text-4xl text-white' />
        </div>
      </div>
      <div className='text-center mt-3 text-sm'>
        Are you sure you wish to delete this assessment?
      </div>
      <div className='text-center text-sm'>
        This action is irreversible
      </div>
      <div className='flex justify-center gap-4 mt-3 items-center'>
        <button onClick={onClose} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>No, cancel</button>
        <form onSubmit={form.handleSubmit}>
          <button type="submit" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Yes, continue
            {form.isSubmitting && <Spinner size={'sm'} />}
          </button>
        </form>
      </div>
    </div>
  )
}