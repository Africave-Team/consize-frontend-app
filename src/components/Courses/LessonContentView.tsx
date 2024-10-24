import { fetchSingleLesson } from '@/services/secure.courses.service'
import { LessonData, MediaType } from '@/type-definitions/secure.courses'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Editable, EditableInput, EditablePreview, Spinner, useEditableControls } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import he from 'he'
import React, { useEffect } from 'react'
import { updateLesson } from '@/services/lessons.service'
import { FiArrowRight, FiCheck, FiEdit2, FiEye, FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import DeleteLessonButton from './DeleteLesson'
import { useRouter } from 'next/navigation'
import { stripHtmlTags } from '@/utils/string-formatters'
import DraggableLessonsSectionCards from './DragDrop/DraggableLessonSections'
import DraggableLessonsQuizCards from './DragDrop/DraggableLessonQuiz'
import { queryClient } from '@/utils/react-query'

interface ApiResponse {
  data: LessonData
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

export default function LessonContentView ({ lessonId, courseId, reload }: { lessonId: string, courseId: string, reload: () => Promise<any> }) {
  const { initiateCreateContent, reloadLesson, setReloadLesson } = useCourseMgtStore()
  const loadData = async function (payload: { lesson: string, course: string }) {
    const data = await fetchSingleLesson(payload.course, payload.lesson)
    return data
  }

  const router = useRouter()

  const options = ["A", "B", "C"]

  const { data: lessonDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['lesson', { lessonId, courseId }],
      queryFn: () => loadData({ lesson: lessonId, course: courseId })
    })

  useEffect(() => {
    if (reloadLesson) {
      refetch()
      setReloadLesson(false)
    }
  }, [reloadLesson])

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

  const handleEditLesson = async function (value: string) {
    if (lessonDetails) {
      await updateLesson({
        lesson: {
          title: value
        }, lessonId: lessonDetails.data.id, courseId
      })
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
    }
  }

  return (
    <div>
      {isFetching ? <div className='h-screen flex justify-center items-center w-3/5'>
        <Spinner size={'sm'} />
      </div> : <>
        {lessonDetails && lessonDetails.data && <div className='h-screen flex gap-3'>
          <div className='h-screen w-3/5 overflow-y-scroll' >
            <div className='mt-4 font-semibold text-lg'>Lesson content</div>
            <div className='h-12 w-full border text-sm group font-semibold rounded-lg mt-1 pl-4 pr-2 flex items-center justify-between'>
              <Editable onSubmit={handleEditLesson} defaultValue={lessonDetails.data.title} className='flex flex-1 justify-between'>
                <div className='flex items-center flex-1'>
                  <EditablePreview />
                  <EditableInput />
                </div>
                <div className='w-24 flex justify-end items-center gap-1'>
                  <EditableControls />
                </div>
              </Editable>
              <div className='flex w-12 gap-1 h-10'>
                <DeleteLessonButton courseId={courseId} lessonId={lessonId} refetch={async () => {
                  await reload()
                  await refetch()
                }} />

                {/* <button className='hover:bg-gray-100 rounded-lg h-10 w-10 hidden group-hover:flex justify-center items-center text-base'>
                <FiEye />
              </button> */}
              </div>
            </div>
            <Accordion defaultIndex={[0]} className='mt-3 space-y-3' allowMultiple>
              <AccordionItem className='rounded-md border'>
                <div className='flex group'>
                  <AccordionButton className='hover:bg-white'>
                    <Box className='font-semibold text-sm' as="span" flex='1' textAlign='left'>
                      Sections ({lessonDetails.data.blocks.length})
                    </Box>
                  </AccordionButton>
                  <div className='flex gap-2 items-center pr-3'>
                    <div className='flex gap-1 h-10 items-center'>
                      {/* <button className='hover:bg-gray-100 rounded-lg h-10 w-10 group-hover:flex hidden justify-center items-center text-base'>
                      <FiEye />
                    </button> */}
                      <button onClick={() => initiateCreateContent(lessonDetails.data.id, courseId, ContentTypeEnum.SECTION)} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
                        <FiPlus />
                      </button>
                    </div>
                    <AccordionButton className='hover:bg-white px-0'>
                      <AccordionIcon />
                    </AccordionButton>
                  </div>
                </div>
                <AccordionPanel pb={4}>
                  {lessonDetails && lessonDetails.data && <DraggableLessonsSectionCards value={lessonDetails.data} />}
                  {lessonDetails.data.blocks.length === 0 && <div className='h-10 flex justify-center text-sm items-center'>
                    No sections have been added to this lesson
                  </div>}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem className='rounded-md border'>
                <div className='flex group'>
                  <AccordionButton className='hover:bg-white'>
                    <Box as="span" className='font-semibold text-sm' flex='1' textAlign='left'>
                      Quizzes ({lessonDetails.data.quizzes.length})
                    </Box>
                  </AccordionButton>
                  <div className='flex gap-2 items-center pr-3'>
                    <div className='h-10 gap-1 items-center group-hover:flex'>
                      {/* <button className='hover:bg-gray-100 group-hover:flex hidden rounded-lg h-10 w-10 justify-center items-center text-base'>
                      <FiEye />
                    </button> */}
                      <button onClick={() => {
                        let quizBlocks = lessonDetails.data.quizzes.filter(e => e.block !== undefined).map(e => e.block)
                        let blockIds = lessonDetails.data.blocks.map(e => e.id) // @ts-ignore
                        const next = findFirstNonexistentElement(blockIds, quizBlocks)
                        let index = Number((Math.random() * (lessonDetails.data.blocks.length - 1)).toFixed(0))
                        if (next !== null) {
                          index = blockIds.findIndex(e => e === next)
                        }
                        let block = lessonDetails.data.blocks[index]
                        initiateCreateContent(lessonDetails.data.id, courseId, ContentTypeEnum.QUIZ, block?.id, block ? stripHtmlTags(he.decode(block.content)) : undefined)
                      }} className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
                        <FiPlus />
                      </button>
                    </div>
                    <AccordionButton className='hover:bg-white px-0'>
                      <AccordionIcon />
                    </AccordionButton>
                  </div>
                </div>
                <AccordionPanel pb={4}>
                  {lessonDetails.data.quizzes.length === 0 && <div className='h-10 flex justify-center text-sm items-center'>
                    No quiz have been added to this lesson
                  </div>}
                  {lessonDetails && lessonDetails.data && <DraggableLessonsQuizCards value={lessonDetails.data} />}
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
