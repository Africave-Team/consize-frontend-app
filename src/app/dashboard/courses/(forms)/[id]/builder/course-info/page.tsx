"use client"

import Layout from '@/layouts/PageTransition'

import React from 'react'

import { Course } from '@/type-definitions/secure.courses'
import { fetchSingleCourse } from '@/services/secure.courses.service'

import { useQuery } from '@tanstack/react-query'
import ModifyCourse from '@/components/Courses/ModifyCourse'

interface ApiResponse {
  data: Course
  message: string
}

export default function page ({ params }: { params: { id: string } }) {

  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='flex-1 flex justify-center md:py-10'>
            {courseDetails && courseDetails.data && <ModifyCourse course={courseDetails.data} />}
          </div>
        </div>
      </div>
    </Layout>
  )
}
