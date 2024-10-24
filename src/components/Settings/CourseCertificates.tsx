
import { myCertificates } from '@/services/certificates.services'
import { CertificatesInterface } from '@/type-definitions/cert-builder'
import { CourseSettings } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import CertificateItem from '../Dashboard/CertificateItem'
import { Spinner, Tooltip } from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'
import { updateSettings } from '@/services/secure.courses.service'

export default function CertificateSettings ({ settings: { id, certificateId }, refetch }: { settings: CourseSettings, refetch: () => Promise<any> }) {
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({})
  const loadData = async function () {
    const result = await myCertificates()
    return result.data
  }

  const { data: certificates, isFetching } =
    useQuery<CertificatesInterface[]>({
      queryKey: ['certificates'],
      queryFn: () => loadData()
    })

  const handleSelectorClick = async function (certificate: string) {
    let pg: any = {}
    pg[certificate] = true
    setProgress(pg)
    await updateSettings({
      id, body: {
        certificateId: certificate
      }
    })
    await refetch()
    pg[certificate] = false
    setProgress(pg)
  }
  return (
    <div>
      Certificate settings
      <div className="flex flex-col gap-3">
        {certificates && certificates.map((certificate) => <div className={`${certificate.id === certificateId && 'border-l-4 w-full rounded-md border border-primary-dark border-l-primary-dark'} cursor-pointer`} key={certificate.id}>
          <CertificateItem selector={certificate.id === certificateId ? <></> : <Tooltip label="Make default certificate">
            <button onClick={() => handleSelectorClick(certificate.id)} className='h-9 rounded-md border w-9 flex justify-center items-center'>
              {progress[certificate.id] ? <Spinner size={'sm'} /> :
                <FiCheck />}
            </button>
          </Tooltip>} onlyPreview={true} certificate={certificate} />
        </div>)}
      </div>
    </div>
  )
}
