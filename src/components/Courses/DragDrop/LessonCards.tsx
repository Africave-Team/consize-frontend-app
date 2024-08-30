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

export default function DraggableCourseLessonsCards ({ value }: { value: Course }) {

  const form = useFormik({
    initialValues: {
      lessons: value.lessons
    },
    onSubmit: () => { }
  })

  useEffect(() => {
    form.setFieldValue("lessons", value.lessons)
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

    let blocks = [...form.values.lessons]
    const item = blocks[source.index]
    blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, item)
    form.setFieldValue("lessons", blocks)
    let payload: Partial<CreateCoursePayload> = {
      lessons: blocks.map(e => e.id || e._id || "")
    }

    await updateMutation.mutateAsync({ payload, id: value.id || value._id || "" })
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={value.id}>
        {(droppableProvided) => (
          <div className='px-1 min-h-72 w-full' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <div className='text-xs mb-2'>You can drag the lessons to change their position</div>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>

              {form.values.lessons.map((lesson, index) => {

                return <div className='w-full' key={lesson.id}>
                  <Draggable index={index} draggableId={lesson.id}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} {...draggableProvided.dragHandleProps} className='cursor-pointer bg-white items-center w-full flex justify-between' {...draggableProvided.draggableProps}>
                        <LessonCard courseId={value.id} index={index} lesson={lesson} refetch={async () => { }} />
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

