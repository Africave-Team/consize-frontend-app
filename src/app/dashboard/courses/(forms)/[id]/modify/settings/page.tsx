"use client"

import ViewCourseDetails from '@/components/Courses/ViewCourseDetails'
import EnrollmentFormFields from '@/components/Settings/EnrollmentFormFields'
import LearnerGroups from '@/components/Settings/LearnerGroups'
import Metadata from '@/components/Settings/Metadata'
import Reminders from '@/components/Settings/Reminders'
import Resources from '@/components/Settings/Resources'
import Layout from '@/layouts/PageTransition'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { Course, CourseSettings } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'

interface ApiResponse {
  data: Course
  message: string
}


export default function page ({ params }: { params: { id: string } }) {
  const [current, setCurrent] = useState("fields")
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

  const menu = [
    {
      title: "Enrollment fields",
      value: "fields"
    },
    {
      title: "Student resources",
      value: "resources"
    },
    {
      title: "Course metadata",
      value: "metadata"
    },
    {
      title: "Reminders",
      value: "reminders"
    },
    {
      title: "Learner groups",
      value: "groups"
    }
  ]

  const loadTabbedPage = function (settings: CourseSettings) {
    switch (current) {
      case "fields":
        return <EnrollmentFormFields fields={settings.enrollmentFormFields} />
      case "resources":
        return <Resources />
      case "metadata":
        return <Metadata />
      case "reminders":
        return <Reminders />
      case "groups":
        return <LearnerGroups />

      default:
        break
    }
  }
  return (
    <Layout>
      <div className='w-full overflow-y-hidden  max-h-full'>
        <div className='flex-1 flex justify-center'>
          {courseDetails && courseDetails.data && <div className='px-4 w-full flex gap-4 mt-5'>
            <div className='w-2/12 overflow-y-scroll  flex flex-col gap-2'>
              {menu.map((item) => (<button onClick={() => setCurrent(item.value)} key={item.value} className={`h-16 ${item.value === current ? 'bg-primary-dark text-white shadow-lg' : 'bg-white text-primary-dark'} flex items-center border px-3 gap-2 font-semibold`}>
                {item.title} <FiArrowRight />
              </button>))}
            </div>
            <div className='w-6/12 border p-5 rounded-lg h-screen overflow-y-scroll'>
              {loadTabbedPage(courseDetails.data.settings)}
            </div>
          </div>}
        </div>
      </div>
    </Layout>
  )
}