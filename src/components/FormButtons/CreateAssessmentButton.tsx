import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import NewLesson from '../Courses/NewLesson'
import { FiPlus } from 'react-icons/fi'
import NewAssessmentForm from '../Courses/CreateAssessmentForm'



export default function CreateAssessmentButton ({ courseId, full }: { courseId: string, full?: boolean }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <div>
      <button onClick={onOpen} className={`bg-primary-dark hover:bg-primary-dark/90 flex justify-center items-center gap-2 rounded-lg text-white h-10 ${full ? 'w-full' : 'w-32'}`}>
        <FiPlus />
        Add assessment</button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-56 p-0'>
          <ModalBody className='h-56 px-2'>
            <NewAssessmentForm courseId={courseId} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
