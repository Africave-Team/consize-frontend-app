import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { Course } from '@/type-definitions/secure.courses'

import CreateCohort from './CreateCohorts'

export default function InvitationLink ({ course, isBundle }: { course: Course, isBundle?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
      <button onClick={() => onOpen()} className='bg-primary-dark hover:bg-primary-dark/90 px-4 h-8 text-white rounded-md text-xs'>Enroll students</button>

      {isOpen && <Modal isCentered isOpen={isOpen} size={{ md: '3xl', base: 'full' }} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody className='p-5'>
            <CreateCohort onClose={onClose} course={course} isBundle={isBundle} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
