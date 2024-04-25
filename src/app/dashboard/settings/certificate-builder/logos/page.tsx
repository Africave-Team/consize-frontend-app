"use client"
import Layout from '@/layouts/PageTransition'
import { fetchMyTeamInfo, updateMyTeamInfo } from '@/services/teams'
import uploadFile from '@/services/upload.service'
import { useAuthStore } from '@/store/auth.store'
import { Team } from '@/type-definitions/auth'
import { queryClient } from '@/utils/react-query'
import { Spinner } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useRef, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

interface ApiResponse {
  data: Team
}

export default function page () {
  const { team } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadData = async function ({ id }: { id?: string }) {
    if (id) {
      const result = await fetchMyTeamInfo(id)
      return result
    }
  }

  const { data: teamInfo, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['team', team?.id],
      queryFn: () => loadData({ id: team?.id })
    })

  const { isPending, mutate } = useMutation({
    mutationFn: (load: { id: string, payload: Partial<Omit<Team, "id" | "owner">> }) => {
      return updateMyTeamInfo(load.id, load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })

  const handleFileChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    if (team && team.id) {
      const fileInput = fileRef.current
      if (!fileInput || !fileInput.files) return
      // Check if any file is selected
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0]
        const formData = new FormData()
        // get file url
        formData.append("file", file)
        mutate({ id: team.id, payload: {} })
        const { data } = await uploadFile(formData)
        // update the 
        mutate({ id: team.id, payload: { logo: data } })
      }
    }
  }
  return (
    <Layout>
      <div className='flex flex-col'>
        <input onChange={handleFileChange} ref={fileRef} type="file" accept='image/*' className='hidden' />
        <div>
          <button className='py-2 px-3 md:w-auto w-[115px] bg-[#0D1F23] flex justify-center items-center gap-1 rounded-lg text-sm text-white' onClick={() => {
            if (fileRef && fileRef.current) {
              fileRef.current.click()
            }
          }}>
            <FiPlus /> Add logo {isPending && <Spinner size={'sm'} />}
          </button>
        </div>
        {isFetching ? <div className='h-40 w-40 flex justify-center items-center'>
          <Spinner />
        </div> : teamInfo?.data.logo && <div className='h-40 mt-5 w-40 flex justify-start items-center'>
          <div className='h-full relative'>
            <img src={teamInfo.data.logo} className='h-40 w-full top-0 rounded-full left-0' />
            <div className='hover:bg-gray-200/20 h-40 group absolute rounded-full w-full top-0 left-0 flex justify-center items-center'>
              {/* <button className='hidden bg-white rounded-lg p-1 group-hover:flex justify-center items-center'>
                <FiTrash2 className="" />
              </button> */}
            </div>
          </div>
        </div>}
      </div>
    </Layout>
  )
}
