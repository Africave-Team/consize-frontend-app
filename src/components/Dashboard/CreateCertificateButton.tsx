import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { CohortsInterface } from '@/type-definitions/cohorts'
import { useFormik } from 'formik'
import { CertificatesStatus } from '@/type-definitions/cert-builder'
import { mySignatories } from '@/services/signatories'
import { Signatory } from '@/type-definitions/signatories'
import { useQuery } from '@tanstack/react-query'
import { createCertificate } from '@/services/certificates.services'
import { queryClient } from '@/utils/react-query'

interface ApiResponse {
  data: CohortsInterface[]
  message: string
}


export default function CreateCertificateButton () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()


  const loadData = async function () {
    const result = await mySignatories()
    return result.data
  }

  const { data: signatories, isFetching, refetch } =
    useQuery<Signatory[]>({
      queryKey: ['signatories'],
      enabled: isOpen,
      queryFn: () => loadData()
    })

  const createCertificateForm = useFormik<{ name: string, signatories: string[], status: CertificatesStatus }>({
    initialValues: {
      name: "",
      signatories: [],
      status: CertificatesStatus.ACTIVE
    },
    validateOnChange: true,
    onSubmit: async function (values, { resetForm }) {
      await createCertificate({
        name: values.name,
        status: values.status,
        signatories: signatories?.map(e => e._id || "").filter(e => e.length > 0).slice(0, 2) || []
      })
      queryClient.invalidateQueries({
        queryKey: ['certificates']
      })
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
      <button onClick={onOpen} className='h-12 rounded-md bg-primary-dark text-white px-5'>
        Create new
      </button>
      {isOpen && <Modal size={'xl'} onClose={() => {
        onClose()
      }} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='border-b !py-3 text-base'>
            Create Certificate
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className='mt-5' onSubmit={createCertificateForm.handleSubmit}>
              <label className="flex flex-col w-full gap-1">
                <span>Certificate name</span>
                <input placeholder='Name your certificate' id="name" value={createCertificateForm.values.name} onChange={createCertificateForm.handleChange} type="text" className='w-full px-3 h-12 border rounded-lg' />
              </label>

              <div className='mb-5 mt-5 flex justify-end items-center'>
                <div className='flex items-center gap-2'>
                  <button className='h-12 px-5' onClick={onClose} type='button'>Cancel</button>
                  <button className='h-12 px-5 border rounded-md'>Save</button>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
