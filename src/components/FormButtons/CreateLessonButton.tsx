import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import NewLesson from '../Courses/NewLesson'
import { FiPlus } from 'react-icons/fi'


export default function CreateLessonButton ({ courseId, refetch, full }: { courseId: string, refetch: () => Promise<any>, full?: boolean }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <div>
      <button onClick={onOpen} className={`bg-primary-dark hover:bg-primary-dark/90 flex justify-center items-center gap-2 rounded-lg text-white h-10 ${full ? 'w-full' : 'w-32'}`}>
        <FiPlus />
        Add lesson</button>
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
            }} courseId={courseId} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
