import { fetchSingleAssessment, fetchSingleLesson } from '@/services/secure.courses.service'
import { LessonData, MediaType, QuestionGroupsInterface } from '@/type-definitions/secure.courses'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Editable, EditableInput, EditablePreview, Menu, MenuButton, MenuItem, MenuList, Spinner, useEditableControls } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import he from 'he'
import React, { useEffect } from 'react'
import { updateAssessment } from '@/services/lessons.service'
import { FiArrowRight, FiCheck, FiEdit2, FiEye, FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import DeleteLessonBlockButton from '../FormButtons/DeleteBlock'
import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import DeleteBlockQuizButton from '../FormButtons/DeleteBlockQuiz'
import DeleteLessonQuizButton from '../FormButtons/DeleteLessonQuiz'
import DeleteLessonButton from './DeleteLesson'
import EditBlockForm from '../FormButtons/EditBlock'
import EditQuizForm from '../FormButtons/EditQuiz'
import { useRouter } from 'next/navigation'
import { stripHtmlTags } from '@/utils/string-formatters'
import { queryClient } from '@/utils/react-query'
import DraggableAssessmentQuestionCards from './DragDrop/DraggableAssessmentQuestion'
import { FaPlus } from 'react-icons/fa6'

interface ApiResponse {
  data: QuestionGroupsInterface
  message: string
}

function findFirstNonexistentElement (arrA: string[], arrB: string[]) {
  for (let i = 0; i < arrA.length; i++) {
    if (!arrB.includes(arrA[i])) {
      return arrA[i]
    }
  }
  return null // If all elements of arrA exist in arrB
}

export default function AssessmentContentView ({ assessmentId, courseId }: { assessmentId: string, courseId: string, }) {
  const { initiateCreateContent } = useCourseMgtStore()

  const loadData = async function (payload: { assessment: string, course: string }) {
    const data = await fetchSingleAssessment(payload.course, payload.assessment)
    return data
  }

  const router = useRouter()

  const { data: assessmentDetails, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['assessment', { assessmentId, courseId }],
      queryFn: () => loadData({ assessment: assessmentId, course: courseId })
    })

  const EditableControls = function () {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()
    return isEditing ? <>
      <button {...getCancelButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
        <FiX />
      </button>
      <button {...getSubmitButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
        <FiCheck />
      </button>
    </> : <button {...getEditButtonProps()} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
      <FiEdit2 />
    </button>

  }

  const handleEditTitle = async function (value: string) {
    if (assessmentDetails) {
      await updateAssessment({
        assessment: {
          title: value
        }, assessmentId, courseId
      })
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
    }
  }

  const handleEditMessage = async function (value: string) {
    if (assessmentDetails) {
      await updateAssessment({
        assessment: {
          message: value
        }, assessmentId, courseId
      })
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
    }
  }

  return (
    <div>
      {isFetching ? <div className='h-screen flex justify-center items-center w-3/5'>
        <Spinner size={'sm'} />
      </div> :
        <>
          {assessmentDetails && assessmentDetails.data && <div className='h-screen flex gap-3'>
            <div className='h-screen w-3/5 overflow-y-scroll' >
              <div className='mt-4 font-semibold text-lg'>Assessment</div>
              <div className='min-h-12 w-full border text-sm group font-semibold rounded-lg mt-1 pl-4 pr-2 flex items-center justify-between'>
                <Editable onSubmit={handleEditTitle} defaultValue={assessmentDetails.data.title} className='flex flex-1 justify-between'>
                  <div className='flex items-center flex-1'>
                    <EditablePreview />
                    <EditableInput className='px-2' />
                  </div>
                  <div className='w-24 flex justify-end items-center gap-1'>
                    <EditableControls />
                  </div>
                </Editable>
              </div>
              <div className='min-h-12 w-full border text-sm group font-semibold rounded-lg mt-3 pl-4 pr-2 flex items-center justify-between'>
                <Editable onSubmit={handleEditMessage} defaultValue={stripHtmlTags(he.decode(assessmentDetails.data.message || ""))} className='flex flex-1 justify-between'>
                  <div className='flex items-center flex-1'>
                    <EditablePreview />
                    <EditableInput className='px-2' />
                  </div>
                  <div className='w-24 flex justify-end items-center gap-1'>
                    <EditableControls />
                  </div>
                </Editable>
              </div>
              <Accordion defaultIndex={[0]} className='mt-3 space-y-3' allowMultiple>
                <AccordionItem className='rounded-md border'>
                  <div className='flex group'>
                    <AccordionButton className='hover:bg-white'>
                      <Box as="span" className='font-semibold text-sm' flex='1' textAlign='left'>
                        Questions ({(assessmentDetails.data.questions || []).length})
                      </Box>
                    </AccordionButton>
                    <div className='flex gap-2 items-center pr-3'>
                      <div className='h-10 gap-1 items-center group-hover:flex'>
                        <Menu>
                          <MenuButton type='button' className='hover:bg-gray-100 h-10 w-10 flex items-center justify-center'><FaPlus className='text-sm' /></MenuButton>
                          <MenuList minWidth={'140px'}>
                            <MenuItem onClick={() => {
                              initiateCreateContent(assessmentDetails.data.id, courseId, ContentTypeEnum.ASSESSMENT_QUIZ)
                            }} className='hover:bg-gray-100' >Create question</MenuItem>
                            <MenuItem onClick={() => {
                              initiateCreateContent(assessmentDetails.data.id, courseId, ContentTypeEnum.SELECT_ASSESSMENT_QUIZ, undefined, undefined, assessmentDetails.data)
                            }} className='hover:bg-gray-100'>Select existing questions</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <AccordionButton className='hover:bg-white px-0'>
                        <AccordionIcon />
                      </AccordionButton>
                    </div>
                  </div>
                  <AccordionPanel pb={4}>
                    {(assessmentDetails.data.questions || []).length === 0 && <div className='h-10 flex justify-center text-sm items-center'>
                      No questions have been added to this assessment
                    </div>}
                    {assessmentDetails && assessmentDetails.data && (assessmentDetails.data.questions || []).length > 0 && <DraggableAssessmentQuestionCards assessmentId={assessmentId} courseId={courseId} value={assessmentDetails.data} />}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <div className='flex justify-end mt-3'>
                <button onClick={() => router.push(`/dashboard/courses/${courseId}/builder/settings`)} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
                  <FiArrowRight />
                </button>
              </div>
              <div className='h-96 w-full'></div>
            </div>
            <div></div>

          </div>}
        </>}
    </div>
  )
}
