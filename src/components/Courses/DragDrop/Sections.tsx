import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Course, CreateCoursePayload, UpdateLesson } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react'
import { PiArrowBendDownRightLight, PiDotsSixVerticalBold } from 'react-icons/pi'
import { Lesson } from '@/type-definitions/secure.courses'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import { updateLesson } from '@/services/lessons.service'
import { queryClient } from '@/utils/react-query'

export default function LessonSections ({ lesson }: { lesson: Lesson }) {

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLesson) => updateLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', lesson.course] })
    }
  })

  const onDragEnd = async ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    let blocks = [...form.values.blocks]
    const item = blocks[source.index]
    blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, item)
    form.setFieldValue("blocks", blocks)
    let payload: UpdateLesson = {
      lessonId: lesson._id || lesson.id || "",
      courseId: lesson.course,
      lesson: {
        title: lesson.title,
        blocks: blocks.map(e => e._id || e.id || ""),
        quizzes: lesson.quizzes.map(e => e._id || e.id || ""),
      }
    }

    await updateMutation.mutateAsync(payload)

  }


  const form = useFormik({
    initialValues: {
      blocks: lesson.blocks
    },
    onSubmit: () => { }
  })

  useEffect(() => {
    form.setFieldValue("blocks", lesson.blocks)
  }, [lesson])
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={lesson.id || lesson._id || `droppable_${new Date().getTime()}`}>
        {(droppableProvided) => (
          <form className='px-1 min-h-10' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
              {form.values.blocks.length === 0 && <div className='text-sm'>No Sections for this lesson</div>}
              {form.values.blocks.map((block, index) => <div key={block.id || block._id || ""}>
                <Draggable index={index} draggableId={block.id || block._id || ""}>
                  {(draggableProvided) => (
                    <div ref={draggableProvided.innerRef} className='cursor-pointer items-center flex justify-between' {...draggableProvided.draggableProps}>

                      <AccordionItem className='border-none w-full pl-0'>
                        <div className='flex justify-between items-center rounded-lg h-10'>
                          <AccordionButton className='h-full hover:!bg-transparent pl-0 flex gap-2'>
                            <div className='flex gap-2 items-center'>
                              <span {...draggableProvided.dragHandleProps}>
                                <PiDotsSixVerticalBold className='cursor-move' />
                              </span>
                              <div className='w-10 flex justify-center py-3'>
                                <PiArrowBendDownRightLight className='text-2xl font-bold' />
                              </div>
                              <div className='text-sm text-black font-semibold' >Section {index + 1}: {block.title}</div>
                            </div>
                          </AccordionButton>
                          <div className='flex items-center gap-2 h-full'>
                            <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                              <AccordionIcon />
                            </AccordionButton>
                          </div>
                        </div>
                        <AccordionPanel className='px-0 py-2'>
                          {block.content && <div>
                            <div dangerouslySetInnerHTML={{ __html: he.decode(block.content) }} />
                          </div>}
                        </AccordionPanel>
                      </AccordionItem>
                    </div>
                  )}
                </Draggable>
              </div>)}
            </Accordion>
            {droppableProvided.placeholder}
          </form>
        )}
      </Droppable>
    </DragDropContext>
  )
}


