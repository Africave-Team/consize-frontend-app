import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import React from 'react'
import GridItem from './GridItem'
interface Props {
  courses: Course[]
}
export default function CourseGrid ({ courses }: Props) {

  return (
    <div className={`w-full grid grid-cols-3 gap-y-3 gap-x-8`}>
      {courses.map((course) => <GridItem key={course.id} course={course} />)}
    </div>
  )
}
