import { MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiEye } from 'react-icons/fi'


export default function PreviewCertificateButton ({ id, template, menu }: { id: string, template: boolean, menu?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const previewPayload = Buffer.from(JSON.stringify({
    "studentName": "Ahman Emmanuel Onoja Solomon",
    "courseName": "The first and last time I will trust a woman",
    "organizationName": "Fate Foundation",
    "signature1": "first_man",
    "signatory1": "First man",
    "signature2": "second_man",
    "signatory2": "Second Man",
    "certificateId": id,
    "template": template
  }), 'utf-8').toString('base64')
  console.log("template", `https://${location.host}/templates/certificate?data=${previewPayload}`)

  return (
    <div>

      {menu ? <MenuItem onClick={() => onOpen()} className='hover:bg-gray-100' icon={<FiEye />}>Preview</MenuItem> : <Tooltip label="Preview">
        <button onClick={onOpen} className='h-9 rounded-md border w-9 flex justify-center items-center'>
          <FiEye />
        </button>
      </Tooltip>}
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
            <iframe src={`https://${location.host}/templates/certificate?data=${previewPayload}`} width="1100px" height="900px"></iframe>
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
