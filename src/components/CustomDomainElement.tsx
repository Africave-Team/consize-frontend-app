import { deleteTeamDomains, updateTeamDomains } from '@/services/teams'
import { useAuthStore } from '@/store/auth.store'
import { Domain } from '@/type-definitions/auth'
import { queryClient } from '@/utils/react-query'
import { Spinner, useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

const hostnameRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/
const schema = Yup.object().shape({
  host: Yup.string().required('Tell us your name').matches(hostnameRegex, 'Invalid hostname format')
    .required('Hostname is required'),
})

export default function CustomDomainElement ({ domain }: { domain: Domain }) {
  const [editMode, setEditMode] = useState(false)
  const { team } = useAuthStore()
  const toast = useToast()

  const { mutateAsync: _submitUpdateMutation } = useMutation<any, string, { host: string, id: string }>({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team'],
      })
    },
    mutationFn: async (props) =>
      (await updateTeamDomains(props.id, props.host)).data,
  })

  const { mutateAsync: _submitDeleteMutation, isPending: _deletePending } = useMutation<any, string, { host: string, id: string }>({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team'],
      })
    },
    mutationFn: async (props) =>
      (await deleteTeamDomains(props.id, props.host)).data,
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
        await _submitUpdateMutation({ id: team.id, host: values.host })
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
    loginFormik.setFieldValue("host", domain.host)
  }, [domain])

  if (editMode) {
    return (
      <div className='h-36 w-full border p-4'>
        <form onSubmit={loginFormik.handleSubmit}>
          <input type="text" id="host" name="host" className='h-12 w-full px-4 rounded-md border' value={loginFormik.values.host} />
        </form>

        <div className='flex pt-3 border-t mt-3 justify-between items-center'>
          {team && <button disabled={_deletePending} onClick={() => _submitDeleteMutation({
            host: domain.host,
            id: team?.id
          })} className='bg-red-600 text-white rounded-md hover:bg-red-400 px-5 py-2'>Delete
            {_deletePending && <Spinner className='ml-2' size={'xs'} />}
          </button>}
          <div className='flex gap-3'>
            <button onClick={() => setEditMode(false)} className='px-5 py-2 border rounded-md'>Cancel</button>
            <button disabled={loginFormik.isSubmitting} onClick={loginFormik.submitForm} className='px-5 py-2 bg-primary-dark text-white rounded-md'>Save
              {loginFormik.isSubmitting && <Spinner className='ml-2' size={'xs'} />}
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='h-24 w-full border p-3'>
      <div className='flex justify-between w-full items-center'>
        <div className="flex gap-2 items-center">
          <div>{domain.host}</div>
          <div className='bg-blue-500 flex items-center  h-5 rounded-3xl text-xs text-white px-3'>{domain.internal ? 'Default' : 'Custom'}</div>
        </div>
        {!domain.internal && <button onClick={() => setEditMode(true)} className='px-4 py-1 rounded-lg ring'>
          Edit
        </button>}
      </div>
      <div>
        {domain.vercelVerified && <div className='flex gap-1 items-center'>
          <div className='h-4 w-4 rounded-full bg-blue-500 text-white flex justify-center items-center'>
            <FiCheck className='text-xs' />
          </div>
          <span className='text-xs'>Verified</span>
        </div>}
        {!domain.vercelVerified && <div className='flex gap-1 items-center'>
          <div className='h-4 w-4 rounded-full bg-red-500 text-white flex justify-center items-center'>
            <FiX className='text-xs' />
          </div>
          <span className='text-xs'>Not verified</span>
        </div>}
      </div>
    </div>
  )
}
