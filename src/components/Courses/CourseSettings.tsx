"use client"

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


export default function CourseSettingsComponent ({ id }: { id: string }) {
  const [current, setCurrent] = useState("fields")
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', id],
      queryFn: () => loadData({ course: id })
    })

  const menu = [
    {
      title: "Add enrollment questions",
      value: "fields"
    },
    {
      title: "Create study resources",
      value: "resources"
    },
    {
      title: "Set course metadata",
      value: "metadata"
    },
    {
      title: "Set routine reminders",
      value: "reminders"
    },
    {
      title: "Add student groups",
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
        return <LearnerGroups fields={settings.enrollmentFormFields} maxEnrollments={settings.metadata.maxEnrollments} refetch={refetch} groups={settings.learnerGroups} settingsId={settings.id} />

      default:
        break
    }
  }
  return (
    <div className='w-full h-full'>
      {courseDetails && courseDetails.data && <div className='px-4 w-full flex gap-4 mt-5'>
        <div className='w-4/12 overflow-y-scroll  flex flex-col gap-2'>
          {menu.map((item) => (<button onClick={() => setCurrent(item.value)} key={item.value} className={`h-16 ${item.value === current ? 'bg-primary-dark text-white shadow-lg' : 'bg-white text-primary-dark'} flex items-center border px-3 gap-2 font-semibold`}>
            {item.title} <FiArrowRight />
          </button>))}
        </div>
        <div className='w-8/12 border p-5 rounded-lg min-h-[70vh] overflow-y-scroll'>
          {loadTabbedPage(courseDetails.data.settings)}
        </div>
      </div>}
    </div>
  )
}