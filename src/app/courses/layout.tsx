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
    enabled: companyCode.length > 0,
    queryFn: () => resolveMyTeamInfo(companyCode)
  })


  useEffect(() => {
    let host = location.hostname
    setCompanyName(host)
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