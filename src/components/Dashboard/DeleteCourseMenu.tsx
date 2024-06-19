import { deleteCourse } from '@/services/secure.courses.service'
import { queryClient } from '@/utils/react-query'
import { MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React from 'react'
import { FiTrash2, FiX } from 'react-icons/fi'

export default function DeleteCourseMenu ({ id, dark, label }: { id: string, label: string, dark?: boolean }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const form = useFormik({
    initialValues: {
    },
    onSubmit: async function (values) {
      const { message } = await deleteCourse(id)
      queryClient.invalidateQueries({
        queryKey: ['projects']
      })
      toast({
        description: message,
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      onClose()
    },
  })

  return (

    <>
      <MenuItem onClick={onOpen} className={`${dark ? 'hover:bg-primary-dark/90 bg-primary-dark text-white' : 'text-primary-dark hover:bg-gray-100'}`} icon={<FiTrash2 className='text-sm' />}>{label}</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'md'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='p-0 w-full bg-white'>
          <ModalBody className='bg-white px-2 my-5'>
            <div className='flex justify-center'>
              <div className='h-14 w-14 rounded-full bg-primary-dark flex justify-center items-center'>
                <FiX className='text-4xl text-white' />
              </div>
            </div>
            <div className='text-center mt-3 text-sm'>
              Are you sure you wish to delete this course?
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
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
