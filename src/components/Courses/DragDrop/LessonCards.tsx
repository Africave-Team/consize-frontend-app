import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Course, CreateCoursePayload } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react'
import { PiArrowBendDownRightLight, PiDotsSixVerticalBold } from 'react-icons/pi'
import LessonSections from './Sections'
import LessonQuestions from './Quizzes'
import { updateCourse } from '@/services/secure.courses.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/utils/react-query'
import { useFormik } from 'formik'
import LessonCard from '../LessonCard'
import AssessmentCard from '../AssessmentCard'

export default function DraggableCourseLessonsCards ({ value }: { value: Course }) {

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
          <div className='px-1 min-h-10 w-full' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <div className='text-xs mb-2'>You can drag the lessons to change their position</div>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>

              {form.values.contents.map(({ lesson, assessment }, index) => {

                if (lesson && typeof lesson !== "string") {
                  return <div className='w-full' key={lesson.id || lesson._id || index}>
                    <Draggable index={index} draggableId={lesson.id || lesson._id || index + ''}>
                      {(draggableProvided) => (
                        <div ref={draggableProvided.innerRef} {...draggableProvided.dragHandleProps} className='cursor-pointer bg-white items-center w-full flex justify-between' {...draggableProvided.draggableProps}>
                          <LessonCard courseId={value.id || value._id || ""} index={index} lesson={lesson} />
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
                          <AssessmentCard courseId={value.id || value._id || ""} assessment={assessment} index={index} />
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

