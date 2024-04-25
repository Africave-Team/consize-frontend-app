"use client"

import Layout from '@/layouts/PageTransition'

import React, { useEffect } from 'react'

import { Course } from '@/type-definitions/secure.courses'
import { fetchSingleCourse } from '@/services/secure.courses.service'

import { useQuery } from '@tanstack/react-query'
import LessonCard from '@/components/Courses/LessonCard'
import CreateLessonButton from '@/components/FormButtons/CreateLessonButton'
import { useCourseMgtStore } from '@/store/course.management.store'
import CreateLessonSection from '@/components/Courses/CreateLessonContent'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Spinner } from '@chakra-ui/react'
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi'
import LessonContentView from '@/components/Courses/LessonContentView'

interface ApiResponse {
  data: Course
  message: string
}

export default function page ({ params }: { params: { id: string } }) {

  const { createContent, currentLesson, setReloadLesson, setCurrentLesson } = useCourseMgtStore()

  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

  useEffect(() => {
    if (courseDetails) {
      let topLesson = courseDetails.data.lessons[0]
      if (topLesson) {
        if (!currentLesson || currentLesson !== topLesson.id) {
          setCurrentLesson(topLesson.id)

        }
      }
    }
  }, [currentLesson, courseDetails])

  return (

    <Layout>
      <div className='w-full overflow-y-scroll border min-h-screen'>
        {/* {isFetching && <div className='h-40 flex justify-center items-center'>
          <Spinner />
        </div>} */}
        {courseDetails && courseDetails.data && <div className='flex w-full h-screen overflow-hidden'>
          <div className='w-[370px] border-r h-full overflow-y-scroll px-2'>
            <div className='flex w-full h-12 items-center justify-between'>
              <div className='font-medium text-lg'>Lessons</div>
              {/* {courseDetails.data.lessons.length > 0 && <button className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
                <FiEye />
              </button>} */}
            </div>
            <div className='flex flex-col w-full gap-3'>
              {courseDetails.data.lessons.length === 0 && <div className='h-10 flex justify-center items-center'>
                No lessons added yet
              </div>}
              {courseDetails.data.lessons.map((lesson, index) => <LessonCard key={lesson.id} index={index} lesson={lesson} refetch={refetch} courseId={courseDetails.data.id} />)}
              <CreateLessonButton courseId={courseDetails.data.id} refetch={refetch} full={true} />
            </div>
          </div>
          <div className='flex-1 h-full px-5'>
            {currentLesson && <LessonContentView reload={refetch} courseId={params.id} lessonId={currentLesson} />}
          </div>
        </div>}
      </div>
      {createContent && createContent.open && <CreateLessonSection
        open={createContent.open}
        refetch={async () => {
          setReloadLesson(true)
          refetch()
        }}
      />
      }
    </Layout>
  )
}
