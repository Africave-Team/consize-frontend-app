import { TeamWithOwner } from '@/type-definitions/teams'
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { adminCompanyServices } from '@/services/admin'
import React from 'react'

export default function CompanyCard ({ team }: { team: TeamWithOwner }) {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const form = useFormik({
    initialValues: {

    },
    onSubmit: async (data, { resetForm }) => {
      await adminCompanyServices.resendOnboardEmail(team.id)
    }
  })
  return (
    <>
      <div onClick={onOpen} className='h-16 cursor-pointer flex'>
        {team.logo && team.logo.includes('https://') ? <div className='h-16 w-16 bg-primary-dark flex justify-center items-center'>
          <img src={team.logo} className='h-14 w-14' />
        </div> : <div className='h-16 w-16 bg-primary-dark uppercase text-white flex justify-center items-center text-lg font-semibold'>{team.name.charAt(0)}</div>}
        <div className={`flex-1 p-3 border ${!team.verified && 'border-primary-app'} flex text-sm flex-col justify-center`}>
          <div className='font-medium text-base'>{team.name}</div>
          <div>{team.owner.name}</div>
        </div>
      </div>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'md'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className='h-96 p-5'>
            {!team.verified && <form onSubmit={form.handleSubmit}>
              <button type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Resend onboarding email
                {form.isSubmitting && <Spinner size={'sm'} />}
              </button>
            </form>}
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
