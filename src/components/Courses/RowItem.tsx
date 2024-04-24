import { Course, CourseStatistics, CourseStatus } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import CourseMenu from './CourseMenu'
import { useRouter } from 'next/navigation'


export default function RowItem ({ course }: { course: Course }) {
  const [stats, setStats] = useState<CourseStatistics | null>(null)
  const router = useRouter()
  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    const database = getDatabase(app)
    const projectStats = ref(database, 'course-statistics/' + course.owner + '/' + course.id)
    const fetchData = async () => {
      onValue(projectStats, async (snapshot) => {
        const data: CourseStatistics = await snapshot.val()
        const students = Object.entries(data.students).map(([key, value]) => ({ ...value, id: key, progress: value.progress ? value.progress : 0 })).filter(e => e.lessons)
        setStats({ ...data, enrolled: students.length, active: students.filter(e => !e.completed && !e.droppedOut).length })
      })
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => off(projectStats)
  }, [course.id])

  return (
    <div className='h-16 w-full border-2 cursor-pointer rounded-lg hover:border-[#0D1F23] flex justify-between items-center'>
      <div onClick={() => router.push(`/dashboard/courses/${course.id}`)} className='px-3 w-2/3 h-full flex items-center truncate'>
        <div className='font-semibold'>{course.title}</div>
      </div>
      <div className='w-1/3 p-2 h-full flex gap-4 items-center justify-end text-sm'>
        <div className='w-1/2 flex gap-10 ' onClick={() => router.push(`/dashboard/courses/${course.id}`)}>
          {(course.status === CourseStatus.COMPLETED || course.status === CourseStatus.PUBLISHED) && <>
            <div className=''>
              <div className='font-semibold'>Enrollments</div>
              <div>{stats ? stats.enrolled : 0}</div>
            </div>
            <div className=''>
              <div className='font-semibold'>Active</div>
              <div>{stats ? stats.active : 0}</div>
            </div>
          </>}
          {(course.status !== CourseStatus.COMPLETED && course.status !== CourseStatus.PUBLISHED) && <>
            <div className='text-sm'>
              <div className='font-semibold'>Type</div>
              <div>{course.bundle ? 'Bundle' : 'Course'}</div>
            </div>
          </>}
        </div>

        <CourseMenu course={course} />
      </div>

    </div>
  )
}
