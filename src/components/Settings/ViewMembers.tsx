import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiEye } from 'react-icons/fi'
import { Student } from '@/type-definitions/secure.courses'



export default function ViewMembers ({ members }: { members: Student[] }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <div>
      <button onClick={onOpen} className='h-12 w-10 flex justify-center items-center'>
        <FiEye />
      </button>

      {isOpen && <Modal size={'sm'} onClose={onClose} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent className='h-96 overflow-y-scroll'>
          <ModalHeader className='border-b !py-3 text-base'>Learner group members</ModalHeader>
          <ModalCloseButton />
          <ModalBody className='p-0'>
            <div className='flex flex-col gap-2'>
              {members.map((member) => <div key={member.email} className='h-12 w-full justify-center hover:bg-gray-100 flex flex-col px-3'>
                <h2 className='text-sm font-bold'>{member.firstName} {member.otherNames}</h2>
                <p className='text-xs'>{member.phoneNumber}</p>
              </div>)}
            </div>
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
