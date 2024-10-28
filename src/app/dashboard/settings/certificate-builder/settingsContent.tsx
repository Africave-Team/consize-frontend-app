"use client"
import CertificateItem from '@/components/Dashboard/CertificateItem'
import CreateCertificateButton from '@/components/Dashboard/CreateCertificateButton'
import Layout from '@/layouts/PageTransition'
import { myCertificates } from '@/services/certificates.services'
import { updateMyTeamInfo } from '@/services/teams'
import { useAuthStore } from '@/store/auth.store'
import { CertificatesInterface } from '@/type-definitions/cert-builder'
import { queryClient } from '@/utils/react-query'
import { Spinner, Tooltip } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { FiCheck } from 'react-icons/fi'

export default function TeamsSettingsPage () {
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({})
  const { team, setTeam } = useAuthStore()
  const loadData = async function () {
    const result = await myCertificates()
    return result.data
  }

  const { data: certificates, isFetching, refetch } =
    useQuery<CertificatesInterface[]>({
      queryKey: ['certificates'],
      queryFn: () => loadData()
    })

  const { mutateAsync: _updateTeamCertificate } = useMutation({
    mutationFn: (load: { payload: { defaultCertificateId: string } }) => {
      return updateMyTeamInfo(load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })

  const handleSelectorClick = async function (certificate: string) {
    let pg: any = {}
    pg[certificate] = true
    setProgress(pg)
    const result = await _updateTeamCertificate({
      payload: {
        defaultCertificateId: certificate
      }
    })
    setTeam(result.data)
    pg[certificate] = false
    setProgress(pg)
  }
  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>
        <div className='flex justify-between'>
          <div></div>
          <CreateCertificateButton />
        </div>
        <div className='grid grid-cols-2 gap-5 mt-10'>
          {certificates && certificates.map((certificate) => <div className={`${certificate.id === team?.defaultCertificateId && 'border-l-4 w-full rounded-md border border-primary-dark border-l-primary-dark'} cursor-pointer`} key={certificate.id}>
            <CertificateItem selector={certificate.id === team?.defaultCertificateId ? <></> : <Tooltip label="Make default certificate">
              <button onClick={() => handleSelectorClick(certificate.id)} className='h-9 rounded-md border w-9 flex justify-center items-center'>
                {progress[certificate.id] ? <Spinner size={'sm'} /> :
                  <FiCheck />}
              </button>
            </Tooltip>} certificate={certificate} /></div>)}
        </div>
      </div>
    </Layout>
  )
}
