"use client"

import ViewCourseDetails from '@/components/Courses/ViewCourseDetails'
import Layout from '@/layouts/PageTransition'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

interface ApiResponse {
  data: Course
  message: string
}


export default function page ({ params }: { params: { id: string } }) {
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-2/5'>
            {courseDetails && <ViewCourseDetails course={courseDetails?.data} />}
          </div>
        </div>
      </div>
    </Layout>
  )
}