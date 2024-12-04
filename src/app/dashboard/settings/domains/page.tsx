"use client"
import CreateNewDomain from '@/components/CreateNewDomain'
import CustomDomainElement from '@/components/CustomDomainElement'
import { fetchMyTeamInfo } from '@/services/teams'
import { useAuthStore } from '@/store/auth.store'
import { Team } from '@/type-definitions/auth'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

export default function page () {
  const { team, setTeam } = useAuthStore()

  const loadData = async function () {
    const result = await fetchMyTeamInfo()
    return result
  }

  const { data: teamInfo, isFetching } =
    useQuery<{ data: Team }>({
      queryKey: ['team'],
      queryFn: () => loadData()
    })
  useEffect(() => {
    if (teamInfo && teamInfo?.data) {
      setTeam(teamInfo.data)
    }
  }, [teamInfo])
  return (
    <div className='w-full p-5 !overflow-y-scroll h-[800px] pb-96 border'>
      <div className='font-bold text-2xl mb-3'>Domains</div>
      <div className="w-1/2 flex flex-col gap-4">
        <CreateNewDomain />
        {team?.domains.sort((a, b) => Number(a.internal) - Number(b.internal)).map((domain, index) => <CustomDomainElement domain={domain} key={`domain_${index}_${domain.host}`} />)}
      </div>
    </div>
  )
}
