'use client'

import CertificatesNav from '@/components/navigations/CertificateBuilderNavigation'
import Layout from '@/layouts/PageTransition'

export default function CertificateBuilderLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Layout>
      <div className='flex h-full overflow-hidden gap-2 w-full '>
        <div className='border-b w-1/5 overflow-x-hidden'>
          <CertificatesNav />
        </div>
        <div className='flex-1 p-3 overflow-y-hidden'>
          {children}
        </div>
      </div>
    </Layout>
  )
}
