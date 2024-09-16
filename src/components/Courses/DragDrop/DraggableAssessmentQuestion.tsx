import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Course, CreateCoursePayload, Lesson, LessonData, MediaType, QuestionGroupsInterface, UpdateLesson } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import { updateCourse } from '@/services/secure.courses.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/utils/react-query'
import { useFormik } from 'formik'
import LessonCard from '../LessonCard'
import { updateAssessment, updateLesson } from '@/services/lessons.service'
import { FiEye, FiPlus } from 'react-icons/fi'
import EditBlockForm from '@/components/FormButtons/EditBlock'
import DeleteLessonBlockButton from '@/components/FormButtons/DeleteBlock'
import DeleteBlockQuizButton from '@/components/FormButtons/DeleteBlockQuiz'
import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import { PiDotsSixVerticalBold } from 'react-icons/pi'
import EditQuizForm from '@/components/FormButtons/EditQuiz'
import DeleteLessonQuizButton from '@/components/FormButtons/DeleteLessonQuiz'

export default function DraggableAssessmentQuestionCards ({ value, assessmentId, courseId }: { value: QuestionGroupsInterface, courseId: string, assessmentId: string }) {
  const { initiateCreateContent, reloadLesson, setReloadLesson } = useCourseMgtStore()
  const form = useFormik({
    initialValues: {
      questions: value.questions
    },
    onSubmit: () => { }
  })

  useEffect(() => {
    form.setFieldValue("questions", value.questions)
  }, [value])


  const updateMutation = useMutation({
    mutationFn: (data: { courseId: string, assessmentId: string, assessment: { title?: string, message?: string, questions?: string[] } }) => updateAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', { assessmentId, courseId }], })
    }
  })

  const onDragEnd = async ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    let blocks = [...form.values.questions]
    const item = blocks[source.index]
    blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, item)
    form.setFieldValue("questions", blocks)
    let payload: { courseId: string, assessmentId: string, assessment: { questions: string[] } } = {
      assessmentId,
      courseId,
      assessment: {
        questions: blocks.map(e => {
          if (typeof e === "string") return ""
          return e._id || e.id || ""
        }).filter(e => e !== ""),
      }
    }

    await updateMutation.mutateAsync(payload)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={value.id || value._id || ""}>
        {(droppableProvided) => (
          <div className='px-1 min-h-16 w-full' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <div className='text-xs mb-2'>You can drag the questions to change their position</div>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>

              {form.values.questions.map((quiz, index) => {
                if (typeof quiz === "string") return null
                return <div className='w-full' key={quiz.id || quiz._id || ""}>
                  <Draggable index={index} draggableId={quiz.id || quiz._id || ""}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} className='cursor-pointer bg-white items-center w-full flex justify-between' {...draggableProvided.draggableProps}>
                        <AccordionItem key={quiz.id} className='rounded-md w-full border'>
                          <div className='flex group'>
                            <AccordionButton className='hover:bg-white flex gap-2 items-center'>
                              <span {...draggableProvided.dragHandleProps}>
                                <PiDotsSixVerticalBold className='cursor-move' />
                              </span>
                              <Box className='font-semibold text-sm line-clamp-1' as="span" flex='1' textAlign='left' dangerouslySetInnerHTML={{ __html: he.decode(quiz.question) }} />
                            </AccordionButton>
                            <div className='flex gap-2 items-center pr-3'>
                              <div className='flex gap-1 h-10 items-center'>
                                {/* <EditQuizForm block={block.id} quiz={quiz} content={block.content} refetch={async () => {

                                }} /> */}
                                {/* <DeleteLessonQuizButton lessonId={value.id} quizId={quiz.id} refetch={async () => {

                                }} /> */}
                              </div>
                              <AccordionButton className='hover:bg-white px-0'>
                                <AccordionIcon />
                              </AccordionButton>
                            </div>
                          </div>
                          <AccordionPanel pb={4}>
                            <div className='flex flex-col gap-2'>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Question</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.question) }} />
                              </div>


                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Choices</label>
                                {quiz.choices.map((val, index) => <div key={val + index} className='text-sm'>{["A", "B", "C"][index]}: {val}</div>)}
                              </div>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                                <div className='text-sm'>{["A", "B", "C"][quiz.correctAnswerIndex]}</div>
                              </div>

                            </div>
                          </AccordionPanel>
                        </AccordionItem>
                      </div>
                    )}
                  </Draggable>
                </div>
              })}
            </Accordion>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

