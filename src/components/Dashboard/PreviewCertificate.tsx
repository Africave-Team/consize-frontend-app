import { MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiEye } from 'react-icons/fi'
import ViewCertificateComponent from '../ViewCertificateComponent'
import { useAuthStore } from '@/store/auth.store'


export default function PreviewCertificateButton ({ id, template, menu }: { id: string, template: boolean, menu?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { team } = useAuthStore()
  const previewPayload = Buffer.from(JSON.stringify({
    "studentName": "Ahman Emmanuel Onoja",
    "courseName": "Project management essentials",
    "organizationName": "Fate Foundation",
    "signature1": "first_man",
    "signatory1": "First man",
    "signature2": "second_man",
    "signatory2": "Second Man",
    "certificateId": id,
    "template": template
  }), 'utf-8').toString('base64')
  console.log(previewPayload)

  return (
    <div>

      {menu ? <MenuItem onClick={() => onOpen()} className='hover:bg-gray-100' icon={<FiEye />}>Preview</MenuItem> : <Tooltip label="Preview">
        <button onClick={onOpen} className='h-8 rounded-l-md rounded-r-2xl hover:bg-gray-100 w-9 flex justify-center items-center'>
          <FiEye />
        </button>
      </Tooltip>}
      {isOpen && <Modal size={'certificate'} onClose={() => {
        onClose()
      }} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='border-b !py-3 text-base'>
            Preview Certificate
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className='flex justify-center items-center pb-10 pt-5'>
            <div className="relative h-[600px] w-[900px]">
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <ViewCertificateComponent details={{
                  "studentName": "Ahman Emmanuel Onoja",
                  "courseName": "Project management essentials",
                  "organizationName": team?.name || "",
                  "signature1": "first_man",
                  "signatory1": "First man",
                  "signature2": "second_man",
                  "signatory2": "Second Man",
                  "certificateId": id,
                  "template": template,
                  logoUrl: ""
                }} />
              </div>
              <div className='absolute top-0 left-0 w-full h-full'></div>
            </div>
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
