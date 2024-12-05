import { saveTeamDomains } from '@/services/teams'
import { useAuthStore } from '@/store/auth.store'
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { queryClient } from '@/utils/react-query'
import { FiX } from 'react-icons/fi'

const hostnameRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/
const schema = Yup.object().shape({
  host: Yup.string().required('Tell us your name').matches(hostnameRegex, 'Invalid hostname format')
    .required('Hostname is required'),
})


export default function CreateNewDomain () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { team } = useAuthStore()
  const [host, setHost] = useState("@")
  const toast = useToast()
  const { mutateAsync: _submitMutation } = useMutation<any, string, { host: string, id: string }>({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team'],
      })
    },
    mutationFn: async (props) =>
      (await saveTeamDomains(props.id, props.host)).data,
  })

  const loginFormik = useFormik({
    initialValues: {
      host: '',
    },
    validateOnChange: true,
    validateOnMount: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (!team) return
        // validate
        await _submitMutation({ id: team.id, host: values.host })
        const items = values.host.split(".")
        if (items.length > 2) {
          setHost(items.slice(0, -2).join("."))
        } else {
          setHost("@")
        }
        onOpen()
        toast({
          title: 'Finished.',
          description: "Domain added successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: 'Failed.',
          description: (error as any).message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    },
  })

  useEffect(() => {
    // onOpen()
  }, [])
  return (
    <>
      <div className='h-14 relative w-full rounded-lg'>
        <form onSubmit={loginFormik.handleSubmit}>
          <input placeholder='mywebsite.com' value={loginFormik.values.host} onChange={loginFormik.handleChange} name="host" id="host" type="text" className='h-14 px-4 text-primary-dark absolute rounded-lg w-full border' />
          <button type='submit' disabled={!loginFormik.isValid || loginFormik.isSubmitting} className='w-20 h-10 top-2 absolute right-2 rounded-lg bg-primary-dark disabled:bg-primary-dark/80 text-white'>
            Add {loginFormik.isSubmitting && <Spinner size={'xs'} />}
          </button>
        </form>
      </div>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'md'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='p-0 w-full bg-white'>
          <ModalBody className='bg-white px-5 my-5'>
            <div className='text-start mt-3 text-sm'>
              Add the following DNS Record to your Domain
            </div>
            <div className='text-start text-sm'>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className='w-62 text-start'>Record type</th>
                    <th className='w-auto text-start'>Host</th>
                    <th className='w-62 text-start'>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CNAME</td>
                    <td>{host}</td>
                    <td>{process.env['NEXT_PUBLIC_APP_ENV'] === "production" ? "consize.com" : "staging-app.consize.com"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='flex justify-center gap-4 mt-3 items-center'>
              <button onClick={onClose} className='h-11 text-white w-full bg-primary-dark rounded-md px-4'>Completed</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
