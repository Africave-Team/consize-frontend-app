"use client"
import Layout from '@/layouts/PageTransition'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { useAuthStore } from '@/store/auth.store'
import { useCallbackStore } from '@/store/callbacks.store'
import { Distribution } from '@/type-definitions/callbacks'
import { Course } from '@/type-definitions/secure.courses'
import { Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

interface ApiResponse {
  data: Course
  message: string
}

export default function DistributionSetup ({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { initiateSlack } = useCallbackStore()
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

  useEffect(() => {
    if (courseDetails && courseDetails.data) {
      if (courseDetails.data.distribution === Distribution.SLACK) {
        if (team?.slackToken) {
          router.push(`/dashboard/courses/${params.id}/builder/lessons`)
        }
      } else {
        if (team?.whatsappToken) {
          router.push(`/dashboard/courses/${params.id}/builder/lessons`)
        }
      }
    }
  }, [courseDetails?.data, team])
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
                <button onClick={() => initiateSlack(params.id)} className='h-12 flex gap-3 font-semibold text-lg items-center'>
                  <svg className='h-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>
                  Authorize Slack
                </button>
              </div> : <div className='w-1/2 min-h-96'>
              </div>}
            </div>}
          </div>}
        </div>
      </div>
    </Layout>
  )
}
