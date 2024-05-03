import { adminCompanyServices } from '@/services/admin'
import { queryClient } from '@/utils/react-query'
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  name: Yup.string().required("Provide the name of the contact person"),
  email: Yup.string().email("Provide a valid email").required("Provide the email of this contact person"),
  companyName: Yup.string().required("Provide the name of this company")
})

export default function EnrollCompanyButton ({ reload }: { reload: () => void }) {
  const { onOpen, isOpen, onClose } = useDisclosure()

  const form = useFormik({
    initialValues: {
      name: "",
      email: "",
      companyName: ""
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (data, { resetForm }) => {
      await adminCompanyServices.enrollCompanies(data)
      reload()
      resetForm()
      onClose()
    }
  })
  return (
    <div>
      <button onClick={onOpen} className='bg-primary-dark text-white flex justify-center items-center gap-2 h-10 px-4 rounded-md'>
        <FaPlus />
        Enroll company
      </button>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'md'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className='h-96 p-5'>
            <h2 className='font-semibold text-xl'>Enroll a company</h2>

            <form onSubmit={form.handleSubmit} className='mt-4 flex flex-col gap-3'>
              <div>
                <label htmlFor="email">Company name *</label>
                <input onChange={form.handleChange} value={form.values.companyName} onBlur={form.handleBlur} name="companyName" id="companyName" type="text" placeholder="Comapny name" className='h-12 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                {form.touched.companyName && form.errors.companyName && <div className='text-xs text-red-500'>{form.errors.companyName}</div>}
              </div>
              <div>
                <label htmlFor="name">Contact person&apos;s name *</label>
                <input onChange={form.handleChange} value={form.values.name} onBlur={form.handleBlur} name="name" id="name" type="text" placeholder="Contact person's name" className='h-12 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                {form.touched.name && form.errors.name && <div className='text-xs text-red-500'>{form.errors.name}</div>}
              </div>
              <div>
                <label htmlFor="email">Contact person&apos;s email *</label>
                <input onChange={form.handleChange} value={form.values.email} onBlur={form.handleBlur} name="email" id="email" type="text" placeholder="Contact person's email" className='h-12 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                {form.touched.email && form.errors.email && <div className='text-xs text-red-500'>{form.errors.email}</div>}
              </div>

              <div className='h-14 w-full'>
                <div className='justify-end flex h-full items-center gap-2'>
                  <button onClick={() => close()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
                  <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save changes
                    {form.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
