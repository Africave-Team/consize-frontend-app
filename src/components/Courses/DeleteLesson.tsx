import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiTrash2, FiX } from 'react-icons/fi'
import DeleteLessonComponent from './DeleteLessonComponent'


export default function DeleteLessonButton ({ courseId, refetch, lessonId }: { courseId: string, refetch: () => Promise<any>, lessonId: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <div>
      <button onClick={onOpen} className={`h-10 hover:bg-gray-100 flex rounded-lg justify-center items-center w-10`}>
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
            <DeleteLessonComponent courseId={courseId} lessonId={lessonId} onClose={onClose} refetch={refetch} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
