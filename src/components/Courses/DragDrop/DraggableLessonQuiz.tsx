import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Course, CreateCoursePayload, Lesson, LessonData, MediaType, UpdateLesson } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import { updateCourse } from '@/services/secure.courses.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/utils/react-query'
import { useFormik } from 'formik'
import LessonCard from '../LessonCard'
import { updateLesson } from '@/services/lessons.service'
import { FiEye, FiPlus } from 'react-icons/fi'
import EditBlockForm from '@/components/FormButtons/EditBlock'
import DeleteLessonBlockButton from '@/components/FormButtons/DeleteBlock'
import DeleteBlockQuizButton from '@/components/FormButtons/DeleteBlockQuiz'
import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import { PiDotsSixVerticalBold } from 'react-icons/pi'
import EditQuizForm from '@/components/FormButtons/EditQuiz'
import DeleteLessonQuizButton from '@/components/FormButtons/DeleteLessonQuiz'

export default function DraggableLessonsQuizCards ({ value }: { value: LessonData }) {
  const { initiateCreateContent, reloadLesson, setReloadLesson } = useCourseMgtStore()
  const form = useFormik({
    initialValues: {
      quizzes: value.quizzes
    },
    onSubmit: () => { }
  })

  useEffect(() => {
    form.setFieldValue("quizzes", value.quizzes)
  }, [value])


  const updateMutation = useMutation({
    mutationFn: (data: UpdateLesson) => updateLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', { lessonId: value.id || value._id || "", courseId: value.course.id || value.course._id || "" }], })
    }
  })

  const onDragEnd = async ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    let blocks = [...form.values.quizzes]
    const item = blocks[source.index]
    blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, item)
    form.setFieldValue("quizzes", blocks)
    let payload: UpdateLesson = {
      lessonId: value._id || value.id || "",
      courseId: value.course.id,
      lesson: {
        title: value.title,
        blocks: value.blocks.map(e => e._id || e.id || ""),
        quizzes: blocks.map(e => e._id || e.id || ""),
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

              {form.values.quizzes.map((quiz, index) => {
                let random = Number((Math.random() * (value.blocks.length - 1)).toFixed(0))
                if (quiz.block) {
                  let index = value.blocks.findIndex(e => e.id === quiz.block)
                  if (index >= 0) {
                    random = index
                  }
                }
                let block = value.blocks[random]
                return <div className='w-full' key={quiz.id || quiz._id || ""}>
                  <Draggable index={index} draggableId={quiz.id || quiz._id || ""}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} className='cursor-pointer bg-white items-center w-full flex justify-between' {...draggableProvided.draggableProps}>
                        <AccordionItem key={quiz.id} className='rounded-md border'>
                          <div className='flex group'>
                            <AccordionButton className='hover:bg-white flex gap-2 items-center'>
                              <span {...draggableProvided.dragHandleProps}>
                                <PiDotsSixVerticalBold className='cursor-move' />
                              </span>
                              <Box className='font-semibold text-sm line-clamp-1' as="span" flex='1' textAlign='left' dangerouslySetInnerHTML={{ __html: he.decode(quiz.question) }} />
                            </AccordionButton>
                            <div className='flex gap-2 items-center pr-3'>
                              <div className='flex gap-1 h-10 items-center'>
                                {/* <button className='hover:bg-gray-100 rounded-lg h-10 w-10 hidden group-hover:flex justify-center items-center text-base'>
                                <FiEye />
                              </button> */}
                                <EditQuizForm block={block.id} quiz={quiz} content={block.content} refetch={async () => {

                                }} />
                                <DeleteLessonQuizButton lessonId={value.id} quizId={quiz.id} refetch={async () => {

                                }} />
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
                              {quiz.hint && <div>
                                <label className='font-semibold text-sm' htmlFor="">Hint</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.hint) }} />
                              </div>}
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when they get it correctly</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.correctAnswerContext) }} />
                              </div>
                              {quiz.revisitChunk && <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when a user retries answering this question</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.revisitChunk) }} />
                              </div>}
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when they get it wrong</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.wrongAnswerContext) }} />
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

