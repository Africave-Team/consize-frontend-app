import { CertificatesInterface } from '@/type-definitions/cert-builder'
import { Tooltip } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import PreviewCertificateButton from './PreviewCertificate'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function CertificateItem ({ certificate, onlyPreview, selector }: { certificate: CertificatesInterface, onlyPreview?: boolean, selector?: ReactNode }) {
  return (
    <div key={certificate.id} className='h-16 border rounded-md w-full px-4 flex justify-between items-center'>
      <div className=''>
        <div className='text-base font-bold'>{certificate.name}</div>
        <div className='text-sm'>{certificate.signatories.length} {certificate.signatories.length > 1 ? 'Signatories' : 'Signatory'}</div>
      </div>
      <div className='flex gap-2'>

        <PreviewCertificateButton id={certificate.id} />
        {!onlyPreview && <Tooltip label="Edit">
          <button className='h-9 rounded-md border w-9 flex justify-center items-center'>
            <FiEdit2 />
          </button>
        </Tooltip>}
        {!onlyPreview && <Tooltip label="Delete">
          <button className='h-9 rounded-md border w-9 flex justify-center items-center'>
            <FiTrash2 />
          </button>
        </Tooltip>}
        {selector}
      </div>
    </div>
  )
}
