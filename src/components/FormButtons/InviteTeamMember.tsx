import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  Select,
} from '@chakra-ui/react'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useFormik } from 'formik'
import { IPG } from '@/type-definitions/auth'
import { permissionGroups } from '@/services/permissions'
import { createTeamMember } from '@/services/teams'

export default function InviteTeamMember ({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [pgs, setPgs] = useState<IPG[]>([])

  const invitationFormik = useFormik({
    initialValues: {
      email: '',
      name: '',
      permissionGroup: ''
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Provide a name for this team member'),
          permissionGroup: Yup.string()
            .required('Select permission group for this team member'),
          email: Yup.string().required('Provide an email address for this team member'),
        })
        await schema.validate(values)
        await createTeamMember(values)
        await onRefresh()
        resetForm()
        onClose()
      } catch (error) {

      }
    }
  })


  const loadData = async function () {
    const result = await permissionGroups()
    setPgs(result)
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <div>
      <button className='py-2 px-3 md:w-auto w-[115px] bg-[#0D1F23] rounded-lg text-sm text-white' onClick={() => onOpen()}>
        <FiPlus />
      </button>

      {isOpen && <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent className='h-[60%]'>
          <DrawerCloseButton />
          <DrawerBody>
            <h2 className='font-bold text-lg'>
              Invite a team member
            </h2>
            <p className='text-sm'>Provide the following details so we can invite your team members</p>

            <form className="w-full flex md:flex-row flex-col mt-5" onSubmit={invitationFormik.handleSubmit}>
              <div className="w-full md:w-2/5 space-y-2">
                <div className='w-full'>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
                  <input autoComplete='name' type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Team member name" onChange={invitationFormik.handleChange}
                    value={invitationFormik.values.name} onBlur={invitationFormik.handleBlur} />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
                  <input autoComplete='email' type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-app focus:border-primary-app block w-full p-2.5" placeholder="Team member email" onChange={invitationFormik.handleChange}
                    value={invitationFormik.values.email} onBlur={invitationFormik.handleBlur} />
                </div>
                <div>
                  <label htmlFor="permissionGroup " className="block mb-2 text-sm font-medium text-gray-900">Permission</label>
                  <Select onChange={invitationFormik.handleChange} className='text-sm' value={invitationFormik.values.permissionGroup} onBlur={invitationFormik.handleBlur} name="permissionGroup" id="permissionGroup" >
                    <option>Select a permission group</option>
                    {pgs.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </Select>
                </div>
              </div>

              <div className="w-full md:w-2/5">


              </div>
            </form>
          </DrawerBody>
          <DrawerFooter className='gap-5'>
            <button onClick={onClose}>
              Cancel
            </button>
            <button onClick={() => invitationFormik.submitForm()} className='bg-[#0D1F23] h-11 w-auto px-8 text-white' >Save</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>}
    </div>
  )
}
