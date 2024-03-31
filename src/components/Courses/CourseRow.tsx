import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import React from 'react'
interface Props {
  courses: Course[]
}
export default function CourseRow ({ courses }: Props) {
  return (
    <div className={`w-full grid grid-cols-1 gap-3`}>
      {courses.map((course) => <div key={course.id} className='h-16 w-full border-2 cursor-pointer rounded-lg hover:border-[#0D1F23] flex justify-between items-center'>
        <div className='px-3 w-2/3 truncate'>
          <div className='font-semibold'>Title</div>
          {course.title}
        </div>
        <div className='w-1/3 p-2 flex gap-4 items-center text-sm'>
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
