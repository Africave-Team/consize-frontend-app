
import { myCertificates } from '@/services/certificates.services'
import { CertificatesInterface } from '@/type-definitions/cert-builder'
import { CourseSettings } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import CertificateItem from '../Dashboard/CertificateItem'
import { FormControl, FormLabel, MenuItem, Spinner, Switch, Tooltip } from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'
import { updateSettings } from '@/services/secure.courses.service'

export default function CertificateSettings ({ settings: { id, certificateId, disableCertificates }, refetch }: { settings: CourseSettings, refetch: () => Promise<any> }) {
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

  const disableCertificateSwitchHandler = async function (disabled: boolean) {
    let pg: any = {}
    pg["disabled"] = true
    setProgress(pg)
    await updateSettings({
      id, body: {
        disableCertificates: disabled
      }
    })
    await refetch()
    pg["disabled"] = false
    setProgress(pg)
  }
  return (
    <div>
      <div className='font-semibold text-sm'>
        Certificate settings
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className=''>

          <FormControl display='flex' alignItems='center'>
            <FormLabel htmlFor='disable-certificates' mb='0' className='text-[#64748B] text-sm'>
              Disable Certificates
            </FormLabel>
            <Switch isChecked={disableCertificates} onChange={(e) => disableCertificateSwitchHandler(e.target.checked)} id="disable-certificates" />
          </FormControl>
        </div>
        {certificates && certificates.map((certificate) => <div className={`${certificate.id === certificateId && 'border-l-4 w-full rounded-md border border-primary-dark border-l-primary-dark'} cursor-pointer`} key={certificate.id}>
          <CertificateItem selector={certificate.id === certificateId ? <></> : <MenuItem className='hover:bg-gray-100' onClick={() => handleSelectorClick(certificate.id)} icon={progress[certificate.id] ? <Spinner size={'sm'} /> :
            <FiCheck />}>
            Mark as default
          </MenuItem>} onlyPreview={true} certificate={certificate} />
        </div>)}
      </div>
    </div>
  )
}
