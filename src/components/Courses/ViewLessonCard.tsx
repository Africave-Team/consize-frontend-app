import { Lesson } from '@/type-definitions/secure.courses'
import React from 'react'
import ModifyLesson from './ModifyLesson'
import DeleteLessonButton from './DeleteLesson'

export default function ViewLessonCard ({ lesson, index, refetch, courseId }: { lesson: Lesson, index: number, courseId: string; refetch: () => Promise<any> }) {
  return (
    <div className='h-14 border-2 flex items-center px-3 rounded-lg hover:border-primary-dark justify-between'>
      <div className='flex flex-1 h-full gap-2 items-center'>
        <div className='h-10 w-10 font-semibold text-sm rounded-xl border bg-primary-dark text-white flex justify-center items-center'>
          {index + 1}
        </div>
        <div className='font-medium w-96 truncate'>
          {lesson.title}
        </div>
      </div>
      <div className='w-28 gap-1 flex justify-end items-center h-full'>
        <ModifyLesson lesson={lesson} refetch={refetch} courseId={courseId} />
        <DeleteLessonButton lessonId={lesson.id} courseId={courseId} refetch={refetch} />
      </div>
    </div>
  )
}
