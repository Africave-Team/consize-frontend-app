import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import { Lesson, QuestionGroupsInterface, Quiz } from '@/type-definitions/secure.courses'
import { queryClient } from '@/utils/react-query'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { LuDot } from "react-icons/lu"

export default function AssessmentCard ({ assessment, index, courseId }: { assessment: QuestionGroupsInterface, index: number, courseId: string }) {
  const { currentLesson, setCurrentLesson, initiateCreateContent, } = useCourseMgtStore()
  return (
    <div onClick={() => {
      setCurrentLesson(assessment.id || assessment._id || "")
    }} className={`h-14 border-2 flex cursor-pointer w-full items-center px-1 rounded-lg ${(assessment.id || assessment._id) === currentLesson ? 'border-primary-dark' : 'hover:border-primary-dark'} justify-between`}>
      <div className='flex flex-1 h-full gap-2 items-center'>
        <div className='h-10 w-10 font-semibold text-sm rounded-lg border bg-primary-app text-primary-dark flex justify-center items-center'>
          {index + 1}
        </div>
        <div className='w-52 flex flex-col truncate'>
          <div className='font-medium w-full text-sm'>
            {assessment.title}
          </div>
          <div className='text-xs flex w-full items-center font-medium'>
            <span>{assessment.questions.length === 0 ? 'No' : assessment.questions.length} questions</span></div>
        </div>
      </div>
      <div className='w-10 gap-1 flex justify-end items-center h-full'>
        <Menu>
          <MenuButton type='button' className='bg-gray-100 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center'>
            <img src="/dots.svg" />
          </MenuButton>
          <MenuList className='text-sm' minWidth={'170px'}>
            <MenuItem onClick={() => initiateCreateContent(assessment._id || "", courseId, ContentTypeEnum.ASSESSMENT_QUIZ)} className='hover:bg-gray-100' icon={<FiPlus className='text-sm' />}>Create question</MenuItem>
            <MenuItem onClick={() => initiateCreateContent(assessment._id || "", courseId, ContentTypeEnum.SELECT_ASSESSMENT_QUIZ, undefined, undefined, assessment)} className='hover:bg-gray-100' icon={<FiPlus className='text-sm' />}>Select question</MenuItem>

            <MenuItem onClick={() => initiateCreateContent(assessment._id || "", courseId, ContentTypeEnum.DELETE_ASSESSMENT_QUIZ)} className='hover:bg-gray-100' icon={<FiTrash2 className='text-sm' />}>Delete assessment</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}
