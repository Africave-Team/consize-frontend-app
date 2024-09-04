import React from 'react'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import { Course } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react'
import { PiArrowBendDownRightLight } from 'react-icons/pi'
import CourseLessons from './Lessons'

export default function BundleCourses ({ course }: { course: Course }) {

  const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='bundle-courses'>
        {(droppableProvided) => (
          <div className='min-h-72 px-1' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
              {course.courses.map((value, index) => <AccordionItem className='border-none' key={value.id}>
                <div className='flex justify-between items-center rounded-lg h-10 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
                  <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                    <div className='flex flex-col items-start'>
                      <div className='text-sm text-black font-semibold'>{value.title}</div>
                    </div>
                  </AccordionButton>
                  <div className='flex items-center gap-2 h-full'>
                    <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                      <AccordionIcon />
                    </AccordionButton>
                  </div>
                </div>
                <AccordionPanel className='px-3 py-2'>
                  <div className='flex flex-col gap-2'>
                    <div className='my-4 font-medium text-base'>All lessons in this course</div>
                    <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                      <CourseLessons value={value} />
                    </Accordion>
                  </div>
                </AccordionPanel>
              </AccordionItem>)}
            </Accordion>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
