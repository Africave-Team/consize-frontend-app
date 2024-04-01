import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import React from 'react'
import RowItem from './RowItem'
interface Props {
  courses: Course[]
}
export default function CourseRow ({ courses }: Props) {
  return (
    <div className={`w-full grid grid-cols-1 gap-3`}>
      {courses.map((course) => <RowItem key={course.id} course={course} />)}
    </div>
  )
}
