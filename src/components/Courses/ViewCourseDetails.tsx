import { Course, CourseStatus, CreateCoursePayload } from '@/type-definitions/secure.courses'
import React, { useState } from 'react'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Tooltip } from '@chakra-ui/react'
import CourseMenu from './CourseMenu'
import { FiUploadCloud } from 'react-icons/fi'
import { PiArrowBendDownRightLight } from 'react-icons/pi'
import CourseSurveyCard from './CourseSurveyCard'
import ImageBuilder from '../FormButtons/ImageBuilder'
import FileUploader from '../FileUploader'
import { FileTypes } from '@/type-definitions/utils'
import { useMutation } from '@tanstack/react-query'
import { updateCourse } from '@/services/secure.courses.service'
import { queryClient } from '@/utils/react-query'
import CourseFlowDragDrop from './DragDrop'

export default function ViewCourseDetails ({ course, editablePhoto }: { course: Course, editablePhoto?: boolean }) {

  const [courseInfo, setCourseInfo] = useState(course)
  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: Partial<CreateCoursePayload> }) => updateCourse({
      ...data.payload
    }, data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', course.id] })
    }
  })
  return (
    <div className='min-h-40'>
      <div className='h-10 w-full border rounded-t flex justify-between items-center'>
        <div></div>
        <div className='flex items-center '>
          {(course.status === CourseStatus.COMPLETED || course.status === CourseStatus.PUBLISHED) && <div className='h-full w-10 flex items-center justify-center'>
            <Tooltip label={`${course.status !== CourseStatus.PUBLISHED ? 'Publish this course' : 'Unpublish this course'}`}>
              <button className='h-full w-full'>
                <FiUploadCloud />
              </button>
            </Tooltip>
          </div>}
          <div className='h-full w-10 flex items-center justify-center'>
            <Tooltip label={`${course.private ? 'Private' : 'Public'}`}>
              <div className={`h-3 w-3 ${!course.private ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
            </Tooltip>
          </div>
          <CourseMenu single={true} course={course} />
        </div>
      </div>
      <div className='h-96 relative group'>
        <img src={courseInfo.headerMedia.url} className='w-full h-full absolute' alt="" />
        {editablePhoto && <div className='absolute right-0 h-14 min-w-32 p-2 group-hover:flex hidden gap-3'>
          <FileUploader header={true} originalUrl={course.headerMedia.url} mimeTypes={[FileTypes.IMAGE]} droppable={false} onUploadComplete={async (val) => {
            if (!Array.isArray(val)) {
              setCourseInfo({
                ...course, headerMedia: {
                  mediaType: course.headerMedia.mediaType,
                  url: val
                }
              })
              await updateMutation.mutateAsync({
                id: course.id, payload: {
                  headerMedia: {
                    mediaType: course.headerMedia.mediaType,
                    url: val
                  }
                }
              })
            }
          }} previewable={false} multiple={false} buttonOnly={true} />
          <ImageBuilder imageText={course.title} onFileUploaded={async (val) => {
            setCourseInfo({
              ...course, headerMedia: {
                mediaType: course.headerMedia.mediaType,
                url: val
              }
            })
            await updateMutation.mutateAsync({
              id: course.id, payload: {
                headerMedia: {
                  mediaType: course.headerMedia.mediaType,
                  url: val
                }
              }
            })
          }} label='Build header' description={course.description} />
        </div>}
      </div>
      <div className='font-bold text-xl my-2 px-3'>
        {course.title}
      </div>
      <div className='text-base px-3 font-normal min-h-12 line-clamp-4' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }} />

      <div className='mt-4'>
        <CourseFlowDragDrop course={course} />
      </div>
    </div>
  )
}
