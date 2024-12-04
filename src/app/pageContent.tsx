'use client'
import SiteNavBar from '@/components/siteNavBar'
import TeamNotFound from '@/components/TeamNotFound'
import { resolveMyTeamInfo } from '@/services/teams'
import { Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'


export default function Home () {
  const [companyCode, setCompanyName] = useState<string>("")


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
    if (data) {
      if (data.data) {
        location.href = location.origin + '/teams/' + data.data.id
      } else {
        location.href = location.origin + '/home'
      }
    }
  }, [data])
  return (
    <section className='h-screen'>
      <SiteNavBar />
      <div className='page-container !p-0 flex justify-center items-center bg-[url(https://a.slack-edge.com/80588/img/404/marrakesh-meadow-80.jpg)]'>
        {isLoading ? <div className='h-12 w-12 bg-white rounded-full flex items-center justify-center'>
          <Spinner className='' />
        </div> : <>

        </>}
      </div>
    </section>


  )
}
