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
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

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
        return <EnrollmentFormFields fields={settings.enrollmentFormFields} id={settings.id} refetch={refetch} />
      case "resources":
        return <Resources refetch={refetch} resources={settings.courseMaterials} id={settings.id} />
      case "metadata":
        return <Metadata refetch={refetch} metadata={settings.metadata} id={settings.id} />
      case "reminders":
        return <Reminders refetch={refetch} settings={settings} />
      case "groups":
        return <LearnerGroups fields={settings.enrollmentFormFields} refetch={refetch} groups={settings.learnerGroups} id={settings.id} />

      default:
        break
    }
  }
  return (
    <Layout>
      <div className='w-full overflow-y-hidden  max-h-full'>
        <div className='flex justify-end w-8/12 mt-5'>
          <button onClick={() => router.push(`/dashboard/courses/${params.id}/builder/finish`)} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
            <FiArrowRight />
          </button>
        </div>
        <div className='flex-1 flex justify-center'>
          {courseDetails && courseDetails.data && <div className='px-4 w-full flex gap-4 mt-5'>
            <div className='w-2/12 overflow-y-scroll  flex flex-col gap-2'>
              {menu.map((item) => (<button onClick={() => setCurrent(item.value)} key={item.value} className={`h-16 ${item.value === current ? 'bg-primary-dark text-white shadow-lg' : 'bg-white text-primary-dark'} flex items-center border px-3 gap-2 font-semibold`}>
                {item.title} <FiArrowRight />
              </button>))}
            </div>
            <div className='w-6/12 border p-5 rounded-lg min-h-[70vh] overflow-y-scroll'>
              {loadTabbedPage(courseDetails.data.settings)}
            </div>
          </div>}
        </div>
      </div>
    </Layout>
  )
}