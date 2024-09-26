import { TeamWithOwner } from '@/type-definitions/teams'
import { Button, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { adminCompanyServices } from '@/services/admin'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { fonts } from '@/app/fonts'
import { queryClient } from '@/utils/react-query'
import TeamsSubscription from '../TeamSubscription'

const validateSchema = Yup.object().shape({
  email: Yup.string()
    .required('Provide an email for this contact')
    .email("Must be an amail address"),
  name: Yup.string()
    .required('Provide a name for this contact'),
})

export default function CompanyCard ({ team }: { team: TeamWithOwner }) {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [activeTab, setActiveTab] = useState("general")
  const toast = useToast()
  const form = useFormik({
    initialValues: {

    },
    onSubmit: async (data, { resetForm }) => {
      await adminCompanyServices.resendOnboardEmail(team.id)
    }
  })

  const handleGodMode = async function () {
    const result = await adminCompanyServices.companyGodMode({
      teamId: team.id
    })
    const width = window.screen.width
    const height = window.screen.height
    if (result && result.tokens && result.tokens.access.token && result.tokens.refresh.token) {
      window.open(`${location.protocol}//${location.hostname}/auth/god-mode?accessToken=${result.tokens.access.token}&refreshToken=${result.tokens.refresh.token}`, '_blank', `width=${width},height=${height},left=0,top=0`)
    }

  }

  const profileFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await validateSchema.validate(values)
        await adminCompanyServices.transferCompany({ ...values, id: team.id })
        queryClient.invalidateQueries({
          queryKey: ["companies", { searchKey: "", page: 1 }],
        })
        toast({
          title: 'Finished.',
          description: "Password changed successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        resetForm()
      } catch (error) {
        toast({
          title: 'Failed.',
          description: (error as any).message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  })

  const menuItems = [
    {
      title: "General",
      value: "general"
    },
    {
      title: "Transfer workspace",
      value: "transfer-workspace"
    },
    {
      title: "Subscription",
      value: "subscription"
    },
  ]
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
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className={`${fonts.inter.className} flex gap-3 py-10`}>
            <div className='w-1/4 min-h-96'>
              <div className='font-semibold text-xl pl-8 mb-3 text-primary-dark'>Settings</div>
              <div className='flex flex-col mt-3 gap-2'>
                {menuItems.map(e => <div onClick={() => setActiveTab(e.value)} key={e.value} className={`h-12 pl-8 flex items-center rounded-lg cursor-pointer ${activeTab === e.value ? "font-semibold text-white text-[15px] bg-primary-dark" : 'text-black bg-transparent hover:text-white hover:bg-primary-dark/90'}`}>{e.title}</div>)}
                <div onClick={() => handleGodMode()} className={`h-12 pl-8 flex items-center rounded-lg cursor-pointer text-black bg-transparent hover:text-white hover:bg-primary-dark/90`}>View in God-mode</div>
              </div>
            </div>
            <div className='w-3/4 h-full px-5'>
              {activeTab === "general" && <div>
                <div className='grid grid-cols-2 mb-5'>
                  <div>
                    <div className='text-black font-bold text-lg'>{team.name}</div>
                    <div className='text-gray-400'>Company name</div>
                  </div>
                  <div>
                    <div className='text-black font-bold text-lg'>{team.owner.name}</div>
                    <div className='text-gray-400'>Contact person</div>
                  </div>
                  <div>
                    <div className='text-black font-bold text-lg'>{team.owner.email}</div>
                    <div className='text-gray-400'>Contact email</div>
                  </div>
                </div>
                {!team.verified && <form onSubmit={form.handleSubmit}>
                  <button type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Resend onboarding email
                    {form.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </form>}
              </div>}

              {activeTab === "transfer-workspace" && <div>
                <div className='font-semibold text-xl text-primary-dark'>Change the contact person</div>
                <form className="w-full flex md:flex-row flex-col mt-5" onSubmit={profileFormik.handleSubmit}>
                  <div className="w-full space-y-2">
                    <div className='w-full'>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Contact's fullname</label>
                      <input autoComplete='name' type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Enter contact's name" onChange={profileFormik.handleChange}
                        value={profileFormik.values.name} onBlur={profileFormik.handleBlur} />
                    </div>
                    <div className='w-full'>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Contact's email address</label>
                      <input autoComplete='email' type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Enter contact's email address" onChange={profileFormik.handleChange}
                        value={profileFormik.values.email} onBlur={profileFormik.handleBlur} />
                    </div>

                    <div className='flex justify-end gap-5'>
                      <Button isLoading={profileFormik.isSubmitting} isDisabled={profileFormik.isSubmitting} type="submit" className="bg-[#0D1F23] disabled:bg-[#0D1F23]/60 disabled:hover:bg-[#0D1F23]/90 h-11 w-auto px-4 hover:bg-[#0D1F23]/90 focus:ring-4 focus:outline-none focus:ring-[#0D1F23]/90 text-white">Save changes</Button>
                    </div>


                  </div>

                  <div className="w-full md:w-2/5">


                  </div>
                </form>
              </div>}

              {activeTab === "subscription" && <TeamsSubscription allow team={team} />}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
