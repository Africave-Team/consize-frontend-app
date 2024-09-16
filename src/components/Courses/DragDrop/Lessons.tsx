import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Course, CreateCoursePayload } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import { PiArrowBendDownRightLight, PiDotsSixVerticalBold } from 'react-icons/pi'
import LessonSections from './Sections'
import LessonQuestions from './Quizzes'
import { updateCourse } from '@/services/secure.courses.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/utils/react-query'
import { useFormik } from 'formik'
import AssessmentCard from '../AssessmentCard'
import DraggableAssessmentQuestionCards from './DraggableAssessmentQuestion'

export default function CourseLessons ({ value }: { value: Course }) {


  const form = useFormik({
    initialValues: {
      lessons: value.lessons,
      contents: value.contents
    },
    onSubmit: () => { }
  })

  useEffect(() => {
    form.setFieldValue("lessons", value.lessons)
    form.setFieldValue("contents", value.contents)
  }, [value])

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: Partial<CreateCoursePayload> }) => updateCourse(data.payload, data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', value.id || value._id || ""] })
    }
  })

  const onDragEnd = async ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    let blocks = [...form.values.contents]
    const item = blocks[source.index]
    blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, item)
    form.setFieldValue("contents", blocks)
    let payload: Partial<CreateCoursePayload> = {
      lessons: blocks.map(e => {
        let lesson = e.lesson
        if (lesson && typeof lesson !== "string") {
          return lesson.id || lesson._id || ""
        }
        else {
          return ""
        }
      }).filter(e => e !== ""),
      contents: blocks.map(e => {
        let lesson = e.lesson
        let assessment = e.assessment
        if (lesson && typeof lesson !== "string") {
          return { lesson: lesson.id || lesson._id || "", assessment: null }
        }
        if (assessment && typeof assessment !== "string") {
          return { assessment: assessment.id || assessment._id || "", lesson: null }
        }
        return { assessment: null, lesson: null }
      }).filter(e => !(e.assessment === null && e.lesson === null))
    }

    await updateMutation.mutateAsync({ payload, id: value.id || value._id || "" })
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={value.id}>
        {(droppableProvided) => (
          <div className='px-1 min-h-20' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>

              {form.values.contents.map(({ lesson, assessment }, index) => {

                if (lesson && typeof lesson !== "string") {
                  return <div key={lesson.id}>
                    <Draggable index={index} draggableId={lesson.id}>
                      {(draggableProvided) => (
                        <div ref={draggableProvided.innerRef} className='cursor-pointer items-center flex justify-between' {...draggableProvided.draggableProps}>

                          <AccordionItem className='border-none w-full' key={lesson.id}>
                            <div className='flex justify-between items-center rounded-lg h-10 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
                              <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                                <div className='flex gap-2 items-start'>
                                  <span {...draggableProvided.dragHandleProps}>
                                    <PiDotsSixVerticalBold className='cursor-move' />
                                  </span>
                                  <div className='text-sm text-black font-semibold'>{lesson.title}</div>
                                </div>
                              </AccordionButton>
                              <div className='flex items-center gap-2 h-full'>
                                <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                                  <AccordionIcon />
                                </AccordionButton>
                              </div>
                            </div>
                            <AccordionPanel className='px-4 py-2'>
                              <div className='flex flex-col gap-2'>
                                <div className='my-1 font-medium text-sm'>All sections in this lesson</div>
                                <LessonSections lesson={lesson} />
                                <div className='my-1 font-medium text-sm'>All assessments in this lesson</div>
                                <LessonQuestions lesson={lesson} />
                              </div>
                            </AccordionPanel>
                          </AccordionItem>
                        </div>
                      )}
                    </Draggable>
                  </div>
                }

                if (assessment && typeof assessment !== "string") {
                  return <div className='w-full' key={assessment.id || assessment._id || index}>
                    <Draggable index={index} draggableId={assessment.id || assessment._id || index + ''}>
                      {(draggableProvided) => (
                        <div ref={draggableProvided.innerRef} {...draggableProvided.dragHandleProps} className='cursor-pointer bg-white items-center w-full flex justify-between' {...draggableProvided.draggableProps}>
                          <Accordion defaultIndex={[0]} className='mt-3 space-y-3 w-full' allowMultiple>
                            <AccordionItem className='rounded-md border-none'>
                              <div className='flex justify-between items-center rounded-lg h-10 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
                                <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                                  <div className='flex gap-2 items-start'>
                                    <span {...draggableProvided.dragHandleProps}>
                                      <PiDotsSixVerticalBold className='cursor-move' />
                                    </span>
                                    <div className='text-sm text-black font-semibold'>
                                      {assessment.title} ({(assessment.questions || []).length} questions)
                                    </div>
                                  </div>
                                </AccordionButton>
                                <div className='flex items-center gap-2 h-full'>
                                  <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </div>
                              </div>
                              <AccordionPanel pb={4}>
                                {(assessment.questions || []).length === 0 && <div className='h-10 flex justify-center text-sm items-center'>
                                  No questions have been added to this assessment
                                </div>}
                                {assessment && (assessment.questions || []).length > 0 && <DraggableAssessmentQuestionCards assessmentId={assessment._id || ""} courseId={value._id || ""} value={assessment} />}
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </Draggable>
                  </div>
                }
              })}
            </Accordion>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

