'use client'

import SiteNavBar from '@/components/siteNavBar'
import { resolveMyTeamInfo } from '@/services/teams'
import { useNavigationStore } from '@/store/navigation.store'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function PublicCoursesLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTeam } = useNavigationStore()
  const [companyCode, setCompanyName] = useState<string>("test")


  const { data, isLoading } = useQuery({
    queryKey: ["company_info", companyCode],
    queryFn: () => resolveMyTeamInfo(companyCode)
  })


  useEffect(() => {
    let host = location.hostname
    host = host.replace('app.', '').replace('staging-app.', '')
    let parts = host.split('.')
    parts.pop()
    parts.pop()
    if (parts.length > 0) {
      let subdomain = parts[0]
      setCompanyName(subdomain)
    }
  }, [])

  useEffect(() => {
    if (data && data.data) {
      // @ts-ignore
      setTeam(data.data)
    }
  }, [data])

  return (
    <div className=''>
      <SiteNavBar team={companyCode !== "test"} />
      <div className='page-container-2 !p-0'>
        {children}
      </div>
    </div>
  )
}