'use client'
import SiteNavBar from '@/components/siteNavBar'
import TeamNotFound from '@/components/TeamNotFound'
import { resolveMyTeamInfo } from '@/services/teams'
import { Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'


export default function Home () {
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
    } else {
      location.href = location.origin + '/courses'
    }
  }, [])

  useEffect(() => {
    if (data && data.data) {
      location.href = location.origin + '/teams/' + data.data.id
    }
  }, [data])
  return (
    <section className='h-screen'>
      <SiteNavBar />
      <div className='page-container !p-0 flex justify-center items-center'>
        {isLoading ? <Spinner /> : <>
          {data?.data ? <></> : <TeamNotFound />}
        </>}
      </div>
    </section>


  )
}
