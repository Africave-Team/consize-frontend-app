import { Course, MediaType } from '@/type-definitions/secure.courses'
import React from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import FileUploader from '@/components/FileUploader'
import ImageBuilder from '@/components/FormButtons/ImageBuilder'
import { useFormik } from 'formik'
import { Spinner, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FileTypes } from '@/type-definitions/utils'
import { updateCourse } from '@/services/secure.courses.service'
import he from "he"
import ViewLessonCard from './ViewLessonCard'
import EmptyLessonState from './EmptyLessonState'
import CreateLessonButton from '../FormButtons/CreateLessonButton'



const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().optional()
})

export default function ListLessons ({ course, refetch }: { course: Course, refetch: () => Promise<any> }) {
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
          <div className='mt-2'>
            {course.lessons.length === 0 && <div className='flex flex-col gap-7 pb-20 pt-10'>
              <EmptyLessonState />
              <div className='flex justify-center'>
                <CreateLessonButton courseId={course.id} refetch={refetch} />
              </div>
            </div>}
            {course.lessons.map((lesson) => <ViewLessonCard lesson={lesson} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
