import { useNavigationStore } from '@/store/navigation.store'
import { ListStyle } from '@/type-definitions/navigation'
import React from 'react'
import GridItem from '../Courses/GridItem'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import RowItem from '../Courses/RowItem'


interface ApiResponse {
  data: Course
  message: string
}


export default function StudentCourseCard ({ courseId, studentId }: { courseId: string, studentId: string }) {
  const { preferredListStyle } = useNavigationStore()
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }
  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', courseId],
      queryFn: () => loadData({ course: courseId })
    })
  return (
    <div>
      {preferredListStyle === ListStyle.GRID ? courseDetails ? <GridItem studentId={studentId} course={courseDetails.data} /> : <></> : courseDetails ? <RowItem studentId={studentId} course={courseDetails.data} /> : <></>}
    </div>
  )
}
