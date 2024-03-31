import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import React from 'react'
interface Props {
  courses: Course[]
}
export default function CourseGrid ({ courses }: Props) {

  return (
    <div className={`w-full grid grid-cols-3 gap-3`}>
      {courses.map((course) => <div key={course.id} className='h-96 border-2 cursor-pointer rounded-lg hover:border-[#0D1F23]'>
        <div className='h-60 bg-black w-full rounded-t-lg'>
          {course.headerMedia && course.headerMedia.url && <img src={course.headerMedia.url} className='h-full w-full rounded-t-lg' alt="" />}
        </div>
        <div className='w-full h-16 p-2 font-semibold'>
          {course.title}
        </div>
        <div className='w-full p-2 flex gap-4 items-center text-sm'>
          {(course.status === CourseStatus.COMPLETED || course.status === CourseStatus.PUBLISHED) && <>
            <div className=''>
              <div className='font-semibold'>Enrolled</div>
              <div>10</div>
            </div>
            <div className=''>
              <div className='font-semibold'>Active</div>
              <div>10</div>
            </div>
          </>}
          {(course.status !== CourseStatus.COMPLETED && course.status !== CourseStatus.PUBLISHED) && <>
            <div className='text-sm'>
              <div className='font-semibold'>Type</div>
              <div>{course.bundle ? 'Bundle' : 'Course'}</div>
            </div>
          </>}
        </div>
      </div>)}
    </div>
  )
}
