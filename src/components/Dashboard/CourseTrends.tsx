import { MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiBarChart } from 'react-icons/fi'

export default function CourseTrends () {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (

    <>
      <MenuItem onClick={onOpen} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiBarChart className='text-sm' />}>Trends</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'md'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 max-h-[650px] overflow-y-scroll p-0'>
          <ModalBody className='h-full px-2'>
            <div className='w-1/3'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus mollitia unde accusamus eaque, illum similique eos eligendi blanditiis fugiat numquam animi, dignissimos itaque, nemo ipsum optio tempore? Quos, suscipit earum!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus mollitia unde accusamus eaque, illum similique eos eligendi blanditiis fugiat numquam animi, dignissimos itaque, nemo ipsum optio tempore? Quos, suscipit earum!
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
