import { updateSettings } from '@/services/secure.courses.service'
import { EnrollmentField } from '@/type-definitions/secure.courses'
import { toCamelCase } from '@/utils/string-formatters'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Switch, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { v4 } from 'uuid'

export default function EnrollmentFormFields ({ fields, id, refetch }: { fields: EnrollmentField[], id: string, refetch: () => Promise<any> }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [fieldName, setFieldName] = useState("")
  const [dataType, setDataType] = useState("text")
  const [loading, setLoading] = useState<boolean>(false)
  const [fieldIsRequired, setFieldIsRequired] = useState(true)
  const addCustomField = async function () {
    const max = fields.length === 0 ? 0 : fields.map(e => e.position).sort(function (a, b) {
      return b - a
    })[0]
    setLoading(true)
    await updateSettings({
      id, body: {
        enrollmentFormFields: [...fields, {
          id: v4(),
          position: max + 1,
          fieldName,
          variableName: toCamelCase(fieldName.replaceAll('?', '')),
          required: fieldIsRequired,
          defaultField: false
        }]
      }
    })
    await refetch()
    onClose()
    setLoading(false)
  }
  return (
    <div>
      <Accordion defaultIndex={[0]} className='mt-3 space-y-3' allowMultiple>
        <AccordionItem className='rounded-md border'>
          <div className='flex group'>
            <AccordionButton className='hover:bg-white'>
              <Box className='font-semibold text-sm' as="span" flex='1' textAlign='left'>
                Default enrollment form questions ({fields.filter(e => e.defaultField).length})
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
            {fields.filter(e => e.defaultField).map((field, index) =>
              <div key={`form_fields_${index}`}>
                <div className={`hover:bg-[#F8F8F8] px-3 bg-white w-full h-10 border-t flex justify-start gap-1 text-sm items-center`}>
                  {field.fieldName} {field.required && <span className='text-red-500 text-xs'>*</span>}
                </div>
              </div>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className='rounded-md border'>
          <div className='flex group'>
            <AccordionButton className='hover:bg-white'>
              <Box as="span" className='font-semibold text-sm' flex='1' textAlign='left'>
                Custom enrollment form questions ({fields.filter(e => !e.defaultField).length})
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
            {fields.filter(e => !e.defaultField).map((field, index) =>
              <div key={`form_fields_${index}`}>
                <div className={`hover:bg-[#F8F8F8] px-3 bg-white w-full h-10 border-t flex justify-start gap-1 text-sm items-center`}>
                  {field.fieldName} {field.required && <span className='text-red-500 text-xs'>*</span>}
                </div>
              </div>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {isOpen && <Modal size={'md'} onClose={onClose} isOpen={isOpen} isCentered={true}>

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
                <div className='h-14 w-16 rounded-lg bg-gray-200 text-[#98A2B3] text-xl flex justify-center items-center'>
                  Aa
                </div>
                <div className='h-14 flex-1 flex flex-col justify-center'>
                  <div className='font-semibold text-base'>Text</div>
                  <div className='text-sm'>A plain text input field</div>
                </div>
                <div className={`h-7 w-7 rounded-full flex justify-center items-center ${dataType === 'text' ? 'border-primary-dark' : ''} border`}>
                  {dataType === 'text' && <div className='h-4 w-4 bg-primary-dark rounded-full' />}
                </div>
              </div>
              <div onClick={() => setDataType("number")} className='h-20  cursor-pointer select-none gap-3 w-full border-b flex px-3 justify-start items-center'>
                <div className='h-14 w-16 rounded-lg bg-gray-200 text-[#98A2B3] text-xl flex justify-center items-center'>
                  123
                </div>
                <div className='h-14 flex-1 flex flex-col justify-center'>
                  <div className='font-semibold text-base'>Integer</div>
                  <div className='text-sm'>An input field for numerical entries</div>
                </div>
                <div className={`h-7 w-7 rounded-full flex justify-center items-center ${dataType === 'number' ? 'border-primary-dark' : ''} border`}>
                  {dataType === 'number' && <div className='h-4 w-4 bg-primary-dark rounded-full' />}
                </div>
              </div>
              <div onClick={() => setDataType("boolean")} className='h-20  cursor-pointer select-none gap-3 w-full flex px-3 justify-start items-center'>
                <div className='h-14 w-16 rounded-lg bg-gray-200 text-[#98A2B3] text-xl flex justify-center items-center'>
                  T/F
                </div>
                <div className='h-14 flex-1 flex flex-col justify-center'>
                  <div className='font-semibold text-base'>True or False</div>
                  <div className='text-sm'>Only people with the link</div>
                </div>
                <div className={`h-7 w-7 rounded-full flex justify-center items-center ${dataType === 'boolean' ? 'border-primary-dark' : ''} border`}>
                  {dataType === 'boolean' && <div className='h-4 w-4 bg-primary-dark rounded-full' />}
                </div>
              </div>
            </div>

            <FormControl className='mt-5 gap-2' display='flex' alignItems='center'>
              <Switch onChange={() => setFieldIsRequired(!fieldIsRequired)} defaultChecked={fieldIsRequired} size={'lg'} id='fieldRequired' />
              <FormLabel className='text-sm' htmlFor='fieldRequired' mb='0'>
                Make this field compulsory
              </FormLabel>
            </FormControl>
          </ModalBody>
          <ModalFooter className='!justify-between'>
            <button className='px-4 py-2 border rounded-lg font-semibold' onClick={onClose}>Cancel</button>
            <button onClick={addCustomField} disabled={fieldName.length === 0} className='px-4 py-2 border flex justify-center items-center rounded-lg font-semibold disabled:bg-primary-dark/80 gap-2 disabled:cursor-not-allowed bg-primary-dark text-white'>
              Add field {loading && <Spinner size={'sm'} />}
            </button>
          </ModalFooter>
        </ModalContent></Modal>}
    </div>
  )
}
