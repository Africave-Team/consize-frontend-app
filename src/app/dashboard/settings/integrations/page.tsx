"use client"
import CopyToClipboardButton from '@/components/CopyToClipboard'
import { fetchMyTeamInfo } from '@/services/teams'
import Layout from '@/layouts/PageTransition'
import { slackUninstall } from '@/services/slack.services'
import { useAuthStore } from '@/store/auth.store'
import { useCallbackStore } from '@/store/callbacks.store'
import { Skeleton, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Team } from '@/type-definitions/auth'


interface ApiResponse {
  data: Team
}
export default function IntegrationSettings () {
  const [progress, setProgress] = useState(false)
  const { team, setTeam } = useAuthStore()
  const { initiateSlackSettings, initiateSlackAsync } = useCallbackStore()

  const handleUninstallSlack = async function () {
    setProgress(true)
    await slackUninstall()
    refetch()
    setProgress(false)
  }

  const loadData = async function ({ id }: { id?: string }) {
    if (id) {
      const result = await fetchMyTeamInfo(id)
      return result
    }
  }

  const { data: teamInfo, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['team', team?.id],
      queryFn: () => loadData({ id: team?.id }),
    })
  return (
    <Layout>
      <div className='w-full overflow-y-scroll h-screen p-4'>
        <div className='h-[700px] w-full'>
          <div className='flex flex-col gap-10'>
            <div>
              <div className='text-lg font-semibold flex items-center gap-4'>Slack integrations
                {isFetching && <Spinner size={'sm'} />}
              </div>
              <div className='w-80 mt-4'>
                {isFetching ? <div className='flex flex-col gap-2 w-42'>
                  <Skeleton className='h-10 rounded-lg' />
                  <Skeleton className='h-10 rounded-lg' />
                </div> : <>

                  {!teamInfo?.data?.slackToken ? <>
                    <div className='text-sm font-medium'>Click this button to authorize consize on your slack workspace</div>
                    <div className='py-5 flex items-center gap-3'>
                      <button onClick={() => initiateSlackSettings(team?.id)} className='h-12 flex gap-3 font-semibold text-lg items-center border px-5 rounded-md'>
                        <svg className='h-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>
                        Authorize Slack
                      </button>
                    </div>
                    <div className='text-sm font-medium'>Or share authorization link with whoever has permission to install consize into your workspace</div>
                    <div className='py-5 flex items-center gap-3'>
                      <CopyToClipboardButton message='Slack authorization link copied' useLink={true} link={initiateSlackAsync()} targetSelector='abc' />
                    </div>
                  </> : <>
                    <div className='text-sm font-medium'>Click this button to uninstall consize from your slack workspace</div>
                    <div className='py-5 flex items-center gap-3'>
                      <button onClick={handleUninstallSlack} className='h-12 flex gap-3 font-semibold text-lg items-center border px-5 rounded-md'>
                        <svg className='h-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>
                        Uninstall Slack
                      </button>
                      {progress && <Spinner />}
                    </div>
                  </>}

                </>}
              </div>
            </div>

            <div>
              <div className='text-lg font-semibold'>Whatsapp integrations</div>
              <div className='text-sm font-medium'>Whatsapp integrations description</div>
              <div>

              </div>
            </div>
          </div>
          <div className='h-52'></div>
        </div>
      </div>
    </Layout>
  )
}
