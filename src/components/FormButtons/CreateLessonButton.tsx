import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import NewLesson from '../Courses/NewLesson'


export default function CreateLessonButton ({ courseId, refetch }: { courseId: string, refetch: () => Promise<any> }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <div>
      <button onClick={onOpen} className='bg-primary-dark text-white h-10 w-32'>Add lesson</button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'md'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className='h-96 px-2'>
            <NewLesson handleFinish={async () => {
              await refetch()
              onClose()
            }} courseId={courseId} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
