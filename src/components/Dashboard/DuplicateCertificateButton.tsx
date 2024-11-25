import { duplicateCertificateByID } from '@/services/certificates.services'
import { queryClient } from '@/utils/react-query'
import { Button, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FiCopy, FiEye } from 'react-icons/fi'


export default function DuplicateCertificateButton ({ id }: { id: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const { mutateAsync: _duplicateCertificate } = useMutation({
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['certificates']
      })
    },
    mutationFn: (data: { id: string, name: string }) => duplicateCertificateByID(data.id, { name: data.name })
  })
  const duplicateCertificateForm = useFormik<{ name: string }>({
    initialValues: {
      name: "",
    },
    validateOnChange: true,
    onSubmit: async function (values, { resetForm }) {
      const result = await _duplicateCertificate({
        name: values.name,
        id
      })
      queryClient.invalidateQueries({
        queryKey: ['certificates']
      })
      router.push(`/dashboard/settings/certificate-builder/${result.data.id}/edit`)
      resetForm()
      onClose()

      toast({
        title: "Finished",
        description: "Certificate created",
        status: "success"
      })
    },
  })

  return (
    <div>
      <MenuItem onClick={() => onOpen()} className='hover:bg-gray-100' icon={<FiCopy />}>Duplicate</MenuItem>
      {isOpen && <Modal size={'xl'} onClose={() => {
        onClose()
      }} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='border-b !py-3 text-base'>
            Duplicate Certificate
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className='mt-5' onSubmit={duplicateCertificateForm.handleSubmit}>
              <label className="flex flex-col w-full gap-1">
                <span>Certificate name</span>
                <input placeholder='Name your certificate' id="name" value={duplicateCertificateForm.values.name} onChange={duplicateCertificateForm.handleChange} type="text" className='w-full px-3 h-12 border rounded-lg' />
              </label>

              <div className='mb-5 mt-5 flex justify-end items-center'>
                <div className='flex items-center gap-2'>
                  <Button className='h-12 px-5' onClick={onClose} type='button'>Cancel</Button>
                  <Button type='submit' isDisabled={duplicateCertificateForm.isSubmitting} isLoading={duplicateCertificateForm.isSubmitting} className='h-12 px-5 border rounded-md'>Duplicate</Button>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
