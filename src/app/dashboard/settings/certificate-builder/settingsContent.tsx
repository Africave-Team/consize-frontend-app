"use client"
import CertificateItem from '@/components/Dashboard/CertificateItem'
import CreateCertificateButton from '@/components/Dashboard/CreateCertificateButton'
import Layout from '@/layouts/PageTransition'
import { myCertificates } from '@/services/certificates.services'
import { CertificatesInterface } from '@/type-definitions/cert-builder'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function TeamsSettingsPage () {
  const loadData = async function () {
    const result = await myCertificates()
    return result.data
  }

  const { data: certificates, isFetching, refetch } =
    useQuery<CertificatesInterface[]>({
      queryKey: ['certificates'],
      queryFn: () => loadData()
    })
  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>
        <div className='flex justify-between'>
          <div></div>
          <CreateCertificateButton />
        </div>
        <div className='grid grid-cols-2 gap-5 mt-10'>
          {certificates && certificates.map((certificate) => <CertificateItem certificate={certificate} />)}
        </div>
      </div>
    </Layout>
  )
}
