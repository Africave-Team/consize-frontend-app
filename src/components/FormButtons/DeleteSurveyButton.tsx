import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiTrash2, FiX } from 'react-icons/fi'
import { useFormik } from 'formik'
import { deleteSurveyRequest } from '@/services/survey.services'


export default function DeleteSurveyButton ({ refetch, surveyId }: { surveyId: string, refetch: () => Promise<any> }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const form = useFormik({
    initialValues: {
    },
    onSubmit: async function () {
      await deleteSurveyRequest(surveyId)
      toast({
        description: "Finished deleting the survey",
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      refetch()
      onClose()
    },
  })
  return (
    <div>
      <button onClick={onOpen} className={`h-10 hover:bg-gray-100 rounded-lg flex justify-center items-center w-10`}>
        <FiTrash2 />
      </button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'sm'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-48 p-0'>
          <ModalBody className='h-48 px-2 py-5'>
            <div className='flex justify-center'>
              <div className='h-14 w-14 rounded-full bg-primary-dark flex justify-center items-center'>
                <FiX className='text-4xl text-white' />
              </div>
            </div>
            <div className='text-center mt-3 text-sm'>
              Are you sure you wish to delete this survey?
            </div>
            <div className='text-center text-sm'>
              This would remove the survey from every course it's been tied to and this action is irreversible
            </div>
            <div className='flex justify-center gap-4 mt-3 items-center'>
              <button onClick={onClose} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>No, cancel</button>
              <form onSubmit={form.handleSubmit}>
                <button type="submit" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Yes, continue
                  {form.isSubmitting && <Spinner size={'sm'} />}
                </button>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
