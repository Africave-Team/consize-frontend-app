import { Course, MediaType } from '@/type-definitions/secure.courses'
import React from 'react'
import * as Yup from 'yup'
import ViewLessonCard from './ViewLessonCard'
import EmptyLessonState from './EmptyLessonState'
import CreateLessonButton from '../FormButtons/CreateLessonButton'
import { useRouter } from 'next/navigation'
import { FiArrowRight } from 'react-icons/fi'



const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().optional()
})

export default function ListLessons ({ course, refetch }: { course: Course, refetch: () => Promise<any> }) {
  const router = useRouter()
  return (
    <div className='px-4 w-full md:w-4/5'>
      <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
        <div className='font-semibold md:text-2xl text-xl'>
          Update lessons
        </div>
      </div>
      <div>
        In this step, we'll ask you to add some lesson topics
      </div>
      <div className='w-3/5 mt-5'>
        <div className='w-full border min-h-40 rounded-lg px-4 py-2'>
          <div className='h-10 flex items-center justify-between'>
            <div className='text-sm font-semibold'>Lessons</div>
            <div className='text-sm font-semibold'>Generate lesson outline</div>
          </div>
          <div className='mt-2 w-full'>
            {course.lessons.length === 0 ? <div className='flex flex-col gap-7 pb-20 pt-10'>
              <EmptyLessonState />
              <div className='flex justify-center'>
                <CreateLessonButton courseId={course.id} refetch={refetch} />
              </div>
            </div> : <div className='flex flex-col gap-2 pt-2'>
              {course.lessons.map((lesson, index) => <ViewLessonCard key={lesson.id} index={index} lesson={lesson} refetch={refetch} courseId={course.id} />)}
              <div className='mt-5'>
                <CreateLessonButton full={true} courseId={course.id} refetch={refetch} />
              </div>
              <div className='mt-2 flex justify-end gap-3'>
                <button onClick={() => router.push(`/dashboard/courses/${course.id}/builder/course-info`)} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>Back</button>
                <button onClick={() => router.push(`/dashboard/courses/${course.id}/builder/outline`)} type="submit" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
                  <FiArrowRight />
                </button>
              </div>
            </div>}

          </div>
        </div>
      </div>
    </div>
  )
}
