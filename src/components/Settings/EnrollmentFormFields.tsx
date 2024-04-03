import { EnrollmentField } from '@/type-definitions/secure.courses'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Switch, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

export default function EnrollmentFormFields ({ fields }: { fields: EnrollmentField[] }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [fieldName, setFieldName] = useState("")
  const [dataType, setDataType] = useState("text")
  const [loading, setLoading] = useState<boolean>(true)
  const [fieldIsRequired, setFieldIsRequired] = useState(true)
  return (
    <div>
      <Accordion defaultIndex={[0]} className='mt-3 space-y-3' allowMultiple>
        <AccordionItem className='rounded-md border'>
          <div className='flex group'>
            <AccordionButton className='hover:bg-white'>
              <Box className='font-semibold text-sm' as="span" flex='1' textAlign='left'>
                Default enrollment form fields ({fields.filter(e => e.defaultField).length})
              </Box>
            </AccordionButton>
            <div className='flex gap-2 items-center pr-3'>
              <div className='flex gap-1 h-10 items-center'>
              </div>
              <AccordionButton className='hover:bg-white px-0'>
                <AccordionIcon />
              </AccordionButton>
            </div>
          </div>
          <AccordionPanel pb={4}>

          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className='rounded-md border'>
          <div className='flex group'>
            <AccordionButton className='hover:bg-white'>
              <Box as="span" className='font-semibold text-sm' flex='1' textAlign='left'>
                Custom enrollment form fields ({fields.filter(e => !e.defaultField).length})
              </Box>
            </AccordionButton>
            <div className='flex gap-2 items-center pr-3'>
              <div className='h-10 gap-1 items-center group-hover:flex'>
                <button onClick={onOpen} className='hover:bg-gray-100 rounded-lg h-10 w-10 hidden group-hover:flex justify-center items-center text-base'>
                  <FiPlus />
                </button>
              </div>
              <AccordionButton className='hover:bg-white px-0'>
                <AccordionIcon />
              </AccordionButton>
            </div>
          </div>
          <AccordionPanel pb={4}>

          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {isOpen && <Modal size={'lg'} onClose={onClose} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='border-b !py-3 text-base'>Add a custom field</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <FormLabel className='text-sm' htmlFor='fieldName' requiredIndicator={true}>Field Name <span className='text-red-500 text-xs'>*</span></FormLabel>
              <Input value={fieldName} onChange={(e) => setFieldName(e.target.value)} id='fieldName' placeholder='Enter a name for this field' />
            </div>

            <FormLabel className='mt-5 text-sm' htmlFor='datatype' requiredIndicator={true}>Select data type <span className='text-red-500 text-xs'>*</span></FormLabel>
            <div className='min-h-[100px] rounded-xl border w-full'>
              <div onClick={() => setDataType("text")} className='h-20 cursor-pointer select-none  gap-3 w-full border-b flex px-3 justify-start items-center'>
                <div className='h-14 w-16 rounded-lg bg-gray-200 text-[#98A2B3] text-2xl flex justify-center items-center'>
                  Aa
                </div>
                <div className='h-14 flex-1 flex flex-col justify-center'>
                  <div className='font-semibold text-base'>Text</div>
                  <div className='text-sm'>A plain text input field</div>
                </div>
                <div className={`h-7 w-7 rounded-full flex justify-center items-center ${dataType === 'text' ? 'border-primary-500' : ''} border`}>
                  {dataType === 'text' && <div className='h-4 w-4 bg-primary-500 rounded-full' />}
                </div>
              </div>
              <div onClick={() => setDataType("number")} className='h-20  cursor-pointer select-none gap-3 w-full border-b flex px-3 justify-start items-center'>
                <div className='h-14 w-16 rounded-lg bg-gray-200 text-[#98A2B3] text-2xl flex justify-center items-center'>
                  123
                </div>
                <div className='h-14 flex-1 flex flex-col justify-center'>
                  <div className='font-semibold text-base'>Integer</div>
                  <div className='text-sm'>An input field for numerical entries</div>
                </div>
                <div className={`h-7 w-7 rounded-full flex justify-center items-center ${dataType === 'number' ? 'border-primary-500' : ''} border`}>
                  {dataType === 'number' && <div className='h-4 w-4 bg-primary-500 rounded-full' />}
                </div>
              </div>
              <div onClick={() => setDataType("boolean")} className='h-20  cursor-pointer select-none gap-3 w-full flex px-3 justify-start items-center'>
                <div className='h-14 w-16 rounded-lg bg-gray-200 text-[#98A2B3] text-2xl flex justify-center items-center'>
                  T/F
                </div>
                <div className='h-14 flex-1 flex flex-col justify-center'>
                  <div className='font-semibold text-base'>True or False</div>
                  <div className='text-sm'>Only people with the link</div>
                </div>
                <div className={`h-7 w-7 rounded-full flex justify-center items-center ${dataType === 'boolean' ? 'border-primary-500' : ''} border`}>
                  {dataType === 'boolean' && <div className='h-4 w-4 bg-primary-500 rounded-full' />}
                </div>
              </div>
            </div>

            <FormControl className='mt-5 gap-2' display='flex' alignItems='center'>
              <Switch size={'lg'} id='fieldRequired' />
              <FormLabel className='text-sm' htmlFor='fieldRequired' mb='0'>
                Make this field compulsory
              </FormLabel>
            </FormControl>
          </ModalBody>
          <ModalFooter className='!justify-between'>
            <button className='px-4 py-2 border rounded-lg font-semibold' onClick={onClose}>Cancel</button>
            <button className='px-4 py-2 border rounded-lg font-semibold disabled:bg-primary-300 bg-primary-500 text-white'>Add field</button>
          </ModalFooter>
        </ModalContent></Modal>}
    </div>
  )
}
