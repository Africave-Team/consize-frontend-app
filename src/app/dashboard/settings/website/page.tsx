"use client"
import CopyToClipboardButton from '@/components/CopyToClipboard'
import Layout from '@/layouts/PageTransition'
import { fetchMyTeamInfo, updateMyTeamInfo } from '@/services/teams'
import uploadFile from '@/services/upload.service'
import { useAuthStore } from '@/store/auth.store'
import { Team } from '@/type-definitions/auth'
import { queryClient } from '@/utils/react-query'
import { FormControl, FormLabel, Input, Spinner } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'

interface ApiResponse {
  data: Team
}

export default function page () {
  const { team, setTeam } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [url, setUrl] = useState("")
  const [logo, setLogo] = useState<string>()
  const [color, setColor] = useState<{ primary: string, secondary: string }>({
    primary: "#000000",
    secondary: "#ffffff"
  })

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

  const { isPending: logoLoading, mutate: mutateLogo } = useMutation({
    mutationFn: (load: { id: string, payload: Partial<Omit<Team, "id" | "owner">> }) => {
      return updateMyTeamInfo(load.id, load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })
  const { mutate: mutateColors } = useMutation({
    mutationFn: (load: { id: string, payload: Partial<Omit<Team, "id" | "owner">> }) => {
      return updateMyTeamInfo(load.id, load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })
  useEffect(() => {
    if (team) {
      setUrl(location.protocol + '//' + team.shortCode + '.' + location.host)
      if (team.color) {
        setColor(team.color)
      }
      if (team.logo) {
        setLogo(team.logo)
      }
    }
  }, [team])

  useEffect(() => {
    if (teamInfo && teamInfo?.data) {
      setTeam(teamInfo.data)
    }
  }, [teamInfo])


  const handleFileChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    if (team && team.id) {
      const fileInput = fileRef.current
      if (!fileInput || !fileInput.files) return
      // Check if any file is selected
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0]
        if (file) {
          setUploading(true)
          const reader = new FileReader()
          reader.onload = function (e) {
            if (e.target && e.target.result) {
              setLogo(e.target.result as string)
            }
          }
          reader.readAsDataURL(file)
          const formData = new FormData()
          // get file url
          formData.append("file", file)
          const { data } = await uploadFile(formData)
          setUploading(false)
          // update the 
          mutateLogo({ id: team.id, payload: { logo: data } })
        }
      }
    }
  }

  const handleChangeColor = function (e: ChangeEvent<HTMLInputElement>, field: "primary" | "secondary") {
    const copy = { ...color }
    copy[field] = e.target.value
    setColor(copy)
    if (team) {
      mutateColors({ id: team.id, payload: { color: copy } })
    }
  }

  return (
    <Layout>
      <div className='w-1/2'>
        <div className='m-10'>
          <div className='mb-5'>
            <h2 className='font-bold text-lg'>Display information</h2>
            <div>
              This is information for accessing your team-specific page and defining how your team information is displayed
            </div>
          </div>
          <div className='relative h-12 border rounded-md'>
            <div id="link-content" className='px-4 flex items-center absolute top-0 left-0 h-12'>
              {url}
            </div>
            <div className='absolute top-1.5 right-2'>
              <CopyToClipboardButton size='sm' targetSelector='#link-content' />
            </div>
          </div>

          <div className='mt-5 flex gap-5'>
            <input onChange={handleFileChange} ref={fileRef} type="file" accept='image/*' className='hidden' />
            <div style={{ backgroundColor: color.primary, color: color.secondary }} className={`h-24 px-5 w-2/3 border rounded-md flex gap-3 items-center`}>
              <div className='h-20 w-20'>
                {logo ? <div className='relative h-20 w-20 group'>
                  <img src={logo} className='h-20 w-20 rounded-xl absolute top-0 left-0' alt="" />
                  <div className='absolute -top-1 -right-1 h-8 w-8 flex justify-center items-center'>
                    <button onClick={() => {
                      if (fileRef && fileRef.current) {
                        fileRef.current.click()
                      }
                    }} className='group-hover:flex text-white bg-primary-dark shadow  justify-center items-center h-8 w-8 rounded-full hidden'>
                      <FiEdit2 />
                    </button>
                  </div>
                  {(logoLoading || uploading) && <div className='bg-white/40 flex justify-center items-center absolute top-0 left-0 rounded-xl h-20 w-20'>
                    <Spinner size={'xs'} />
                  </div>}
                </div> : <div onClick={() => {
                  if (fileRef && fileRef.current) {
                    fileRef.current.click()
                  }
                }} className='border cursor-pointer rounded-xl h-20 w-20 text-xs flex items-center'>
                  <FiPlus className='text-xs' /> Brand Icon
                </div>}
              </div>
              <div className='font-semibold'>{team?.name}</div>
            </div>

            <div className='w-1/3 flex flex-col gap-4'>
              <FormControl className='relative inline-block'>
                <FormLabel htmlFor='primary-color' mb='0' className='text-sm h-12 flex flex-col gap-1'>
                  <span>Primary brand color</span>
                  <div className='flex gap-2 border rounded-md items-center px-2 py-3 h-10'>
                    <div style={{ backgroundColor: color.primary }} className='h-7 w-7 border rounded-md'></div>
                    <div className='px-1 uppercase text-neutral-500'>
                      {color.primary}
                    </div>
                  </div>
                </FormLabel>
                <Input type='color' className='h-0 absolute w-0 top-0 left-0 opacity-0' id='primary-color' value={color.primary} onChange={(e) => handleChangeColor(e, "primary")} />
              </FormControl>

              <FormControl className='relative inline-block mt-3'>
                <FormLabel htmlFor='secondary-color' mb='0' className='text-sm h-12 flex flex-col gap-1'>
                  Secondary brand color
                  <div className='flex gap-2 border rounded-md items-center px-2 py-3 h-10'>
                    <div style={{ backgroundColor: color.secondary }} className='h-7 w-7 border rounded-md'></div>
                    <div className='px-1 text-neutral-500 uppercase'>
                      {color.secondary}
                    </div>
                  </div>
                </FormLabel>
                <Input type='color' className='h-0 absolute w-0 top-0 left-0 opacity-0' id='secondary-color' value={color.secondary} onChange={(e) => handleChangeColor(e, "secondary")} />
              </FormControl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
