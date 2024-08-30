import React from 'react'
import CertBuilderNavLink from './BuilderNavItem'

export default function CertificatesNav () {
  const items = [
    {
      title: "Certificates",
      path: "/dashboard/settings/certificate-builder"
    },
    // {
    //   title: "Logos",
    //   path: "/dashboard/settings/certificate-builder/logos"
    // },
    {
      title: "Signatories",
      path: "/dashboard/settings/certificate-builder/signatories"
    }

  ]
  return (
    <div className='p-3 flex w-full h-full overflow-x-auto items-center gap-2 flex-col'>
      {items.map((item, index) => <CertBuilderNavLink title={item.title} key={`menu_${index}`} href={item.path} />)}
    </div>
  )
}
