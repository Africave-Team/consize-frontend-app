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
import CourseSurveyCard from '@/components/Courses/CourseSurveyCard'
import UpdateCourseButton from '@/components/FormButtons/EditCourseButton'
import DraggableCourseLessonsCards from '@/components/Courses/DragDrop/LessonCards'
import CreateAssessmentButton from '@/components/FormButtons/CreateAssessmentButton'
import AssessmentContentView from '@/components/Courses/AssessmentContentView'

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
      let lessons = courseDetails.data.lessons.map(e => e.id)

      let contents = courseDetails.data.contents.map(e => {
        if (e.assessment && typeof e.assessment !== "string") {
          return e.assessment._id
        }
        if (e.lesson && typeof e.lesson !== "string") {
          return e.lesson._id
        }
      }).filter(e => typeof e === "string") as string[]
      if (topLesson) {
        if (!currentLesson || !contents.includes(currentLesson)) {
          setCurrentLesson(contents[0])
        }
      }
    }
  }, [currentLesson, courseDetails])

  return (

    <Layout>
      <div className='w-full overflow-y-scroll border min-h-screen'>
        {courseDetails && courseDetails.data && <div className='flex w-full h-screen overflow-hidden'>
          <div className='w-[370px] border-r h-full overflow-y-scroll px-2'>
            <div className='flex w-full h-12 items-center justify-between'>
              <div className='font-medium text-lg'>Course contents</div>
              {courseDetails.data && <UpdateCourseButton course={courseDetails.data} />}

            </div>
            <div className='flex flex-col w-full gap-3'>
              {courseDetails.data.lessons.length === 0 && <div className='h-10 flex justify-center items-center'>
                No lessons added yet
              </div>}
              {courseDetails && courseDetails.data && <DraggableCourseLessonsCards value={courseDetails.data} />}
              <CourseSurveyCard surveyId={courseDetails.data.survey} courseId={courseDetails.data.id} />
              <CreateLessonButton courseId={courseDetails.data.id} full={true} />
              <CreateAssessmentButton courseId={courseDetails.data.id} full={true} />
            </div>
          </div>
          {courseDetails && courseDetails.data && currentLesson && <div className='flex-1 h-full px-5'>
            {courseDetails.data.lessons.find(e => e._id === currentLesson) ? <LessonContentView reload={refetch} courseId={params.id} lessonId={currentLesson} /> : <AssessmentContentView assessmentId={currentLesson} courseId={params.id} />}
          </div>}
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
