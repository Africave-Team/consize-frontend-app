"use client"
import CopyToClipboardButton from '@/components/CopyToClipboard'
import Layout from '@/layouts/PageTransition'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { fetchMyTeamInfo } from '@/services/teams'
import { useAuthStore } from '@/store/auth.store'
import { useCallbackStore } from '@/store/callbacks.store'
import { Team } from '@/type-definitions/auth'
import { Distribution } from '@/type-definitions/callbacks'
import { Course } from '@/type-definitions/secure.courses'
import { Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { FiArrowRight } from 'react-icons/fi'

interface ApiResponse {
  data: Course
  message: string
}

interface TeamApiResponse {
  data: Team
}

export default function DistributionSetup ({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { initiateSlack, initiateSlackAsync } = useCallbackStore()
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })
  const { team } = useAuthStore()

  const loadTeamData = async function ({ id }: { id?: string }) {
    if (id) {
      const result = await fetchMyTeamInfo(id)
      return result
    }
  }

  const { data: teamInfo, isFetching: teamProgress } =
    useQuery<TeamApiResponse>({
      queryKey: ['team', team?.id],
      queryFn: () => loadTeamData({ id: team?.id }),
    })

  useEffect(() => {
    if (courseDetails && courseDetails.data) {
      if (courseDetails.data.distribution === Distribution.SLACK) {
        if (teamInfo?.data?.slackToken) {
          router.push(`/dashboard/courses/${params.id}/builder/lessons`)
        }
      } else {
        if (teamInfo?.data?.whatsappToken) {
          router.push(`/dashboard/courses/${params.id}/builder/lessons`)
        }
      }
    }
  }, [courseDetails?.data, teamInfo?.data])
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          {isFetching ? <div className='flex-1 flex flex-col md:py-5 gap-5 px-10'>
            <Skeleton className='h-10 w-1/2' />
            <Skeleton className='h-20 w-1/2' />
            <Skeleton className='h-60 w-1/2' />
          </div> : <div className='flex-1 flex flex-col w-full md:py-10'>
            {courseDetails && courseDetails.data && <div>
              {courseDetails.data.distribution === Distribution.SLACK ? <div className='w-1/2 flex justify-center items-center min-h-96'>
                {!teamInfo?.data?.slackToken && <div className='flex flex-col'>
                  <div className='text-sm font-medium'>Click this button to authorize consize on your slack workspace</div>
                  <div className='py-5 flex items-center gap-3'>
                    <button onClick={() => initiateSlack(params.id)} className='h-12 flex gap-3 font-semibold text-lg items-center border px-5 rounded-md'>
                      <svg className='h-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>
                      Authorize Slack
                    </button>
                  </div>
                  <div className='text-sm font-medium'>Or share authorization link with whoever has permission to install consize into your workspace</div>
                  <div className='py-5 flex items-center gap-3'>
                    <CopyToClipboardButton message='Slack authorization link copied' useLink={true} link={initiateSlackAsync()} targetSelector='abc' />
                    <button onClick={() => router.push(`/dashboard/courses/${params.id}/builder/lessons`)} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-primary-dark bg-primary-app hover:bg-primary-app/90'>Skip & continue
                      <FiArrowRight />
                    </button>
                  </div>
                </div>}
              </div> : <div className='w-1/2 min-h-96'>
              </div>}
            </div>}
          </div>}
        </div>
      </div>
    </Layout>
  )
}
