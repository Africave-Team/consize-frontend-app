"use client"

import Layout from '@/layouts/PageTransition'

import React from 'react'

import { Course } from '@/type-definitions/secure.courses'
import { fetchSingleCourse } from '@/services/secure.courses.service'

import { useQuery } from '@tanstack/react-query'
import LessonCard from '@/components/Courses/LessonCard'
import CreateLessonButton from '@/components/FormButtons/CreateLessonButton'
import { useCourseMgtStore } from '@/store/course.management.store'
import CreateLessonSection from '@/components/Courses/CreateLessonContent'

interface ApiResponse {
  data: Course
  message: string
}

export default function page ({ params }: { params: { id: string } }) {

  const { createContent } = useCourseMgtStore()

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
      <div className='w-full overflow-y-scroll border min-h-screen'>
        {courseDetails && courseDetails.data && <div className='flex w-full h-screen'>
          <div className='w-3/12 border-r h-full px-2'>
            <div className='flex w-full h-12 items-center justify-between'>
              <div className='font-medium text-lg'>Lessons</div>

            </div>
            <div className='flex flex-col w-full gap-3'>
              {courseDetails.data.lessons.map((lesson, index) => <LessonCard key={lesson.id} index={index} lesson={lesson} refetch={refetch} courseId={courseDetails.data.id} />)}
              <CreateLessonButton courseId={courseDetails.data.id} refetch={refetch} full={true} />
            </div>
          </div>
          <div></div>
        </div>}
      </div>
      {createContent && createContent.open && <CreateLessonSection open={createContent.open} refetch={refetch} />}
    </Layout>
  )
}
