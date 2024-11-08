import { CertificatesInterface } from '@/type-definitions/cert-builder'
import { Button, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import PreviewCertificateButton from './PreviewCertificate'
import { FiCopy, FiEdit2, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { deleteCertificateByID, duplicateCertificateByID } from '@/services/certificates.services'
import { queryClient } from '@/utils/react-query'
import DuplicateCertificateButton from './DuplicateCertificateButton'

export default function CertificateItem ({ certificate, onlyPreview, selector }: { certificate: CertificatesInterface, onlyPreview?: boolean, selector?: ReactNode }) {

  const { mutateAsync: _deleteCertificate } = useMutation({
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['certificates']
      })
    },
    mutationFn: (data: { id: string }) => deleteCertificateByID(data.id)
  })
  return (
    <div key={certificate.id} className='h-10 border rounded-md w-full px-4 flex justify-between items-center'>
      <div className=''>
        <div className='text-base font-bold'>{certificate.name}</div>
      </div>
      <div className='flex gap-2'>
        <Menu>
          <MenuButton className='hover:bg-white active:!bg-white'>
            <FiMoreHorizontal />
          </MenuButton>
          <MenuList>
            <PreviewCertificateButton menu={true} template={!certificate.components || certificate.components.components.length === 0} id={certificate.id} />
            {!onlyPreview && <MenuItem as={Link} href={`/dashboard/settings/certificate-builder/${certificate.id}/edit`} icon={<FiEdit2 />}>Edit</MenuItem>}
            {!onlyPreview && <DuplicateCertificateButton id={certificate.id} />}
            {!onlyPreview && <MenuItem onClick={() => _deleteCertificate({ id: certificate.id })} className='hover:bg-gray-100' icon={<FiTrash2 />}>Delete</MenuItem>}
            {selector}
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}
