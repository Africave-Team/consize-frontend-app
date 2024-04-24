import { MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiSettings, FiX } from 'react-icons/fi'
import CourseSettingsComponent from '../Courses/CourseSettings'

export default function OpenSettings ({ id }: { id: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (

    <>
      <MenuItem onClick={onOpen} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiSettings className='text-sm' />}>Settings</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'full'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='overflow-y-scroll !bg-transparent overflow-hidden flex justify-center items-center p-0 w-full'>
          <ModalBody className='w-[900px] h-[500px] bg-white px-2 my-20'>
            <div className='flex justify-end'>
              <button onClick={onClose} className='bg-white rounded-full h-10 w-10 border flex justify-center items-center'>
                <FiX />
              </button>
            </div>
            <CourseSettingsComponent id={id} />
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
