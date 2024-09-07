import React from 'react'
import he from "he"
import { Course, CourseStatus, CreateCoursePayload } from '@/type-definitions/secure.courses'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import { PiArrowBendDownRightLight, PiDotsSixVerticalBold } from 'react-icons/pi'
import CourseSurveyCard from '../CourseSurveyCard'
import BundleCourses from './Courses'
import CourseLessons from './Lessons'
import { FiPlus } from 'react-icons/fi'

export default function CourseFlowDragDrop ({ course }: { course: Course }) {

  const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
  }
  return (
    <Accordion allowMultiple defaultIndex={[]}>
      {!course.bundle ? <>

        <AccordionItem className='w-full'>
          <h2>
            <AccordionButton className='px-3'>
              <div className='w-full flex gap-2 items-center'>
                <Box as="span" flex='1' textAlign='left'>
                  Course contents
                </Box>
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
              <CourseLessons value={course} />
            </Accordion>
          </AccordionPanel>
        </AccordionItem>

      </> : <>
        <AccordionItem className='w-full'>
          <h2>
            <AccordionButton className='px-3'>
              <div className='w-full flex gap-2 items-center'>
                <Box as="span" flex='1' textAlign='left'>
                  Bundle courses
                </Box>
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <BundleCourses course={course} />
          </AccordionPanel>
        </AccordionItem>
      </>}

      <AccordionItem className='w-full'>
        <h2>
          <AccordionButton className='px-3'>
            <div className='w-full flex gap-2 items-center'>
              <Box as="span" flex='1' textAlign='left'>
                Course survey
              </Box>
            </div>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {course && <CourseSurveyCard surveyId={course.survey} courseId={course.id} />}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
