import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import { Lesson } from '@/type-definitions/secure.courses'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { LuDot } from "react-icons/lu"

export default function LessonCard ({ lesson, index, refetch, courseId }: { lesson: Lesson, index: number, courseId: string; refetch: () => Promise<any> }) {
  const { currentLesson, setCurrentLesson, initiateCreateContent } = useCourseMgtStore()
  return (
    <div onClick={() => setCurrentLesson(lesson.id)} className={`h-14 border-2 flex cursor-pointer items-center px-1 rounded-lg ${lesson.id === currentLesson ? 'border-primary-dark' : 'hover:border-primary-dark'} justify-between`}>
      <div className='flex flex-1 h-full gap-2 items-center'>
        <div className='h-10 w-10 font-semibold text-sm rounded-lg border bg-primary-dark text-white flex justify-center items-center'>
          {index + 1}
        </div>
        <div className='w-52 flex flex-col truncate'>
          <div className='font-medium w-full text-sm'>
            {lesson.title}
          </div>
          <div className='text-xs flex w-full items-center font-medium'>
            <span>{lesson.blocks.length === 0 ? 'No' : lesson.blocks.length} sections</span> <LuDot className='text-lg' /> <span>{lesson.quizzes.length === 0 ? 'No' : lesson.quizzes.length} quizzes</span></div>
        </div>
      </div>
      <div className='w-10 gap-1 flex justify-end items-center h-full'>
        <Menu>
          <MenuButton type='button' className='bg-gray-100 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center'>
            <img src="/dots.svg" />
          </MenuButton>
          <MenuList className='text-sm' minWidth={'170px'}>
            <MenuItem className='hover:bg-gray-100' icon={<FiEdit2 className='text-sm' />}>Edit lesson</MenuItem>
            <MenuItem onClick={() => initiateCreateContent(lesson.id, courseId, ContentTypeEnum.SECTION)} className='hover:bg-gray-100' icon={<FiPlus className='text-sm' />}>Add a section</MenuItem>
            <MenuItem onClick={() => initiateCreateContent(lesson.id, courseId, ContentTypeEnum.QUIZ)} className='hover:bg-gray-100' icon={<FiPlus className='text-sm' />}>Add a quiz</MenuItem>
            <MenuItem className='hover:bg-gray-100' icon={<FiTrash2 className='text-sm' />}>Delete lesson</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}
