import { Course, CourseStatistics, CourseStatus } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import CourseMenu from './CourseMenu'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import he from "he"
import { GoStack } from 'react-icons/go'
import { FiBookOpen } from 'react-icons/fi'

export default function GridItem ({ course, studentId }: { course: Course, studentId?: string }) {
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
        if (data && data.students) {
          const students = Object.entries(data.students).map(([key, value]) => ({ ...value, id: key, progress: value.progress ? value.progress : 0 }))
          setStats({ ...data, enrolled: students.length, active: students.filter(e => !e.completed && !e.droppedOut).length })
        }
      })
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => off(projectStats)
  }, [course.id])
  return (
    <div className='min-h-56 pb-5 border-2 cursor-pointer rounded-lg hover:border-[#0D1F23]'>
      <div className='h-40 mb-2 bg-black w-full rounded-t-lg relative'>
        {course.headerMedia && course.headerMedia.url && <Link href={!studentId ? `/dashboard/courses/${course.id}` : `/dashboard/courses/${course.id}/enrollments/${studentId}`}>
          <img src={course.headerMedia.url} className='h-full w-full top-0 left-0 absolute course-image rounded-t-lg' alt="" />
        </Link>}
        {!studentId && <div className='absolute top-0 right-0 h-14 min-w-20 flex items-center'>
          {!course.bundle ? <FiBookOpen className='text-lg text-white' /> :
            <GoStack className='text-lg text-white' />}
          <div className='flex justify-end px-3 py-2'>
            <CourseMenu course={course} />
          </div>
        </div>}
      </div>
      <div className='w-full overflow-hidden whitespace-nowrap text-ellipsis p-2 font-semibold'>
        <Link href={!studentId ? `/dashboard/courses/${course.id}` : `/dashboard/courses/${course.id}/enrollments/${studentId}`} className=''>
          {course.title}
        </Link>
      </div>
      {!studentId ? <Link href={`/dashboard/courses/${course.id}`} className='w-full p-2 flex gap-4 items-center text-sm'>
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
      </Link> : <div className='px-2 line-clamp-3' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }} />}
    </div>
  )
}
