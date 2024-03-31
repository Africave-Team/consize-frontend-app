import { useNavigationStore } from '@/store/navigation.store'
import { ListStyle } from '@/type-definitions/navigation'
import { Course } from '@/type-definitions/secure.courses'
import React from 'react'
import CourseGrid from './CourseGrid'
import CourseRow from './CourseRow'
import EmptyCourseState from './EmptyCourseState'

interface Props {
  courses: Course[]
}
export default function CoursesTable ({ courses }: Props) {
  const { preferredListStyle } = useNavigationStore()
  return (
    <div>
      {courses.length === 0 ? <EmptyCourseState /> : preferredListStyle === ListStyle.GRID ? <CourseGrid courses={courses} /> : <CourseRow courses={courses} />}
    </div>
  )
}
