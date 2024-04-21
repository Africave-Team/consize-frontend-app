import { IoMdClose } from "react-icons/io"
import { Icon, Input, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import CopyToClipboardButton from '../CopyToClipboard'

export default function InvitationLink ({ courseId, isBundle }: { courseId: string, isBundle?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
      <button onClick={() => onOpen()} className='bg-primary-dark hover:bg-primary-dark/90 px-4 h-10 text-white rounded-md text-sm'>Send invite</button>

      {isOpen && <Modal isCentered isOpen={isOpen} size={{ md: 'sm', base: 'full' }} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody className='py-4'>
            <div className='w-full flex justify-between items-start'>
              <div className='w-11/12'>
                <h1 className='font-semibold text-lg text-[#0F172A] line-clamp-2'>
                  Invite students
                </h1>
                <p className='text-sm line-clamp-4 text-[#23173E99]/60 mt-1'>Send this course link to students to enroll</p>
              </div>
              <div className='w-1/12'>
                <div className='w-9 h-9 cursor-pointer bg-[#F1F5F9] rounded-full flex justify-center items-center' onClick={onClose}>
                  <Icon as={IoMdClose} />
                </div>
              </div>
            </div>

            <div className='my-4 flex justify-between gap-1'>
              <Input type="text" className="bg-gray-200 text-gray-600 !opacity-90 cursor-not-allowed px-2 py-1 border rounded-md overflow-y-auto w-11/12" disabled value={`${location.origin}/courses/${isBundle ? `bundles/` : ''}${courseId}`} id="link-content" />
              <CopyToClipboardButton targetSelector='#link-content' />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
