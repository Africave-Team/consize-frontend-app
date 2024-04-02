import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import NewLesson from '../Courses/NewLesson'
import { Lesson } from '@/type-definitions/secure.courses'
import { FiEdit2 } from 'react-icons/fi'

import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import he from "he"
import { updateLesson } from '@/services/lessons.service'

const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().optional()
})
export default function ModifyLesson ({ courseId, lesson, refetch }: { courseId: string, lesson: Lesson, refetch: () => Promise<any> }) {
  const { isOpen, onClose, onOpen } = useDisclosure()

  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: lesson.title,
      description: he.decode(lesson.description || ""),
    },
    onSubmit: async function (values) {
      const { message } = await updateLesson({ lesson: values, lessonId: lesson.id, courseId })
      toast({
        description: message,
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      await refetch()
      onClose()
    },
  })
  return (
    <div>
      <button onClick={onOpen} className={`h-10 w-10 hover:bg-gray-100 rounded-lg flex justify-center items-center`}>
        <FiEdit2 />
      </button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'md'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className='h-96 px-2'>
            <div className='w-full p-3'>
              <div className='flex justify-between'>
                <div className='font-semibold text-lg'>Modify this lesson</div>
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
                  <div className='justify-end flex gap-2'>
                    <button onClick={onClose} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
                    <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save changes
                      {form.isSubmitting && <Spinner size={'sm'} />}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
