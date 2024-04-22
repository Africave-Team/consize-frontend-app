import { Course, CourseStatistics, CourseStatus } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import CourseMenu from './CourseMenu'

export default function GridItem ({ course }: { course: Course }) {
  const [stats, setStats] = useState<CourseStatistics | null>(null)

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
    <div className='h-96 border-2 cursor-pointer rounded-lg hover:border-[#0D1F23]'>
      <div className='h-60 bg-black w-full rounded-t-lg relative'>
        {course.headerMedia && course.headerMedia.url && <img src={course.headerMedia.url} className='h-full w-full top-0 left-0 absolute rounded-t-lg' alt="" />}
        <div className='absolute top-0 left-0 h-full w-full'>
          <div className='flex justify-end px-3 py-2'>
            <CourseMenu course={course} />
          </div>
        </div>
      </div>
      <div className='w-full h-16 p-2 font-semibold'>
        {course.title}
      </div>
      <div className='w-full p-2 flex gap-4 items-center text-sm'>
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
    </div>
  )
}
