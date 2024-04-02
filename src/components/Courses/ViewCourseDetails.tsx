import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import React from 'react'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Tooltip } from '@chakra-ui/react'
import CourseMenu from './CourseMenu'
import { FiUploadCloud } from 'react-icons/fi'

export default function ViewCourseDetails ({ course }: { course: Course }) {
  return (
    <div className='min-h-40'>
      <div className='h-10 w-full border rounded-t flex justify-between items-center'>
        <div></div>
        <div className='flex items-center '>
          {(course.status === CourseStatus.COMPLETED || course.status === CourseStatus.PUBLISHED) && <div className='h-full w-10 flex items-center justify-center'>
            <Tooltip label={`${course.status !== CourseStatus.PUBLISHED ? 'Publish this course' : 'Unpublish this course'}`}>
              <button className='h-full w-full'>
                <FiUploadCloud />
              </button>
            </Tooltip>
          </div>}
          <div className='h-full w-10 flex items-center justify-center'>
            <Tooltip label={`${course.private ? 'Private' : 'Public'}`}>
              <div className={`h-3 w-3 ${!course.private ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
            </Tooltip>
          </div>
          <CourseMenu single={true} course={course} />
        </div>
      </div>
      <div className='h-96'>
        <img src={course.headerMedia.url} className='w-full h-full' alt="" />
      </div>
      <div className='font-bold text-xl my-2'>
        {course.title}
      </div>
      <div className='text-base font-normal min-h-12 line-clamp-4' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }} />

      <div>
        <Accordion allowMultiple defaultIndex={[]}>
          <AccordionItem>
            <h2>
              <AccordionButton className='pl-0'>
                <Box as="span" flex='1' textAlign='left'>
                  Course lessons
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className='pl-0'>
                <Box as="span" flex='1' textAlign='left'>
                  Course assessments
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className='pl-0'>
                <Box as="span" flex='1' textAlign='left'>
                  Course surveys
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
