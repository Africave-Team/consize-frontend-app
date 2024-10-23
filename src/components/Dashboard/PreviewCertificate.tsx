import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiEye } from 'react-icons/fi'


export default function PreviewCertificateButton ({ id }: { id: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const previewPayload = Buffer.from(JSON.stringify({
    "studentName": "James Onaghi",
    "courseName": "Astrophysics",
    "organizationName": "Fate Foundation",
    "signature1": "first_man",
    "signatory1": "First man",
    "signature2": "second_man",
    "signatory2": "Second Man",
    "certificateId": id,
    "template": true
  }), 'utf-8').toString('base64')

  return (
    <div>
      <Tooltip label="Preview">
        <button onClick={onOpen} className='h-9 rounded-md border w-9 flex justify-center items-center'>
          <FiEye />
        </button>
      </Tooltip>
      {isOpen && <Modal size={'4xl'} onClose={() => {
        onClose()
      }} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='border-b !py-3 text-base'>
            Preview Certificate
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <iframe src={`https://${location.host}/templates/certificate?data=${previewPayload}`} width="1100px" height="750px"></iframe>
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
