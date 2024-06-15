import { MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiEye } from 'react-icons/fi'
import ReviewCharts from './ReviewCharts'
import ReviewList from './ReviewList'

export default function StudentReviews ({ courseId }: { courseId: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (

    <>
      <MenuItem onClick={onOpen} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiEye className='text-sm' />}>Reviews</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'5xl'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='h-[90vh] overflow-y-hidden p-0'>
          <ModalBody className='h-full p-5'>
            {isOpen && <div className='flex h-full gap-3 w-full'>
              <div className='flex-1 h-full overflow-y-scroll border-r px-3'>
                <ReviewList courseId={courseId} />
              </div>
              <div className='w-[400px] h-full overflow-y-scroll'>
                <ReviewCharts courseId={courseId} />
              </div>
            </div>}
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
