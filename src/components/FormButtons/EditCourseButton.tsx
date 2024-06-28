import { Course } from '@/type-definitions/secure.courses'
import { Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiEdit2 } from 'react-icons/fi'
import ModifyCourse from '../Courses/ModifyCourse'
export default function UpdateCourseButton ({ course }: { course: Course }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <>
      <button onClick={onOpen} className='flex gap-1 font-medium items-center justify-center w-10 rounded-md hover:bg-primary-dark hover:text-white h-10'>
        <FiEdit2 />
      </button>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent className='p-0'>
          <ModalBody className='p-0'>
            <ModifyCourse course={course} full={true} onFinish={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
