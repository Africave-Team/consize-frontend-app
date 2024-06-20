import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import React from 'react'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Tooltip } from '@chakra-ui/react'
import CourseMenu from './CourseMenu'
import { FiUploadCloud } from 'react-icons/fi'
import { PiArrowBendDownRightLight } from 'react-icons/pi'
import CourseSurveyCard from './CourseSurveyCard'

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
      <div className='font-bold text-xl my-2 px-3'>
        {course.title}
      </div>
      <div className='text-base px-3 font-normal min-h-12 line-clamp-4' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }} />

      <div className='mt-4'>
        <Accordion allowMultiple defaultIndex={[]}>
          {!course.bundle ? <AccordionItem>
            <h2>
              <AccordionButton className='px-3'>
                <Box as="span" flex='1' textAlign='left'>
                  Course lessons
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                {course.lessons.map((value, index) => <AccordionItem className='border-none' key={value.id}>
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
                  <AccordionPanel className='px-0 py-2'>
                    <div className='flex flex-col gap-2'>
                      {value.blocks.map((block, index) => <div key={block.id} className='flex'>
                        {<>
                          <div className='w-10 flex justify-center py-3'>
                            <PiArrowBendDownRightLight className='text-2xl font-bold' />
                          </div>
                          <div className='min-h-10 flex-1 rounded-lg py-1'>
                            <Accordion className='flex flex-col w-full pl-0' defaultIndex={[0]} allowMultiple>
                              <AccordionItem className='border-none pl-0' key={block.id}>
                                <div className='flex justify-between items-center rounded-lg h-10'>
                                  <AccordionButton className='h-full hover:!bg-transparent pl-0 flex gap-2'>
                                    <div className='flex flex-col items-start'>
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
                                    <div dangerouslySetInnerHTML={{ __html: block.content }} />
                                  </div>}
                                </AccordionPanel>
                              </AccordionItem>
                            </Accordion>
                          </div></>}
                      </div>)}
                    </div>
                  </AccordionPanel>
                </AccordionItem>)}
              </Accordion>
            </AccordionPanel>
          </AccordionItem> : <AccordionItem>
            <h2>
              <AccordionButton className='px-3'>
                <Box as="span" flex='1' textAlign='left'>
                  Bundle courses
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
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
                      <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                        {value.lessons.map((lesson, index) => <AccordionItem className='border-none' key={lesson.id}>
                          <div className='flex justify-between items-center rounded-lg h-10 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
                            <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                              <div className='flex flex-col items-start'>
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
                              {lesson.blocks.map((block, index) => <div key={block.id} className='flex'>
                                {<>
                                  <div className='w-10 flex justify-center py-3'>
                                    <PiArrowBendDownRightLight className='text-2xl font-bold' />
                                  </div>
                                  <div className='min-h-10 flex-1 rounded-lg py-1'>
                                    <Accordion className='flex flex-col w-full pl-0' defaultIndex={[0]} allowMultiple>
                                      <AccordionItem className='border-none pl-0' key={block.id}>
                                        <div className='flex justify-between items-center rounded-lg h-10'>
                                          <AccordionButton className='h-full hover:!bg-transparent pl-0 flex gap-2'>
                                            <div className='flex flex-col items-start'>
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
                                    </Accordion>
                                  </div></>}
                              </div>)}
                            </div>
                          </AccordionPanel>
                        </AccordionItem>)}
                      </Accordion>
                    </div>
                  </AccordionPanel>
                </AccordionItem>)}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>}
          {/* <AccordionItem>
            <h2>
              <AccordionButton className='px-3'>
                <Box as="span" flex='1' textAlign='left'>
                  Course assessments
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              No assessments at this moment
            </AccordionPanel>
          </AccordionItem> */}
          <AccordionItem>
            <h2>
              <AccordionButton className='px-3'>
                <Box as="span" flex='1' textAlign='left'>
                  Course surveys
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {course && <CourseSurveyCard surveyId={course.survey} courseId={course.id} />}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
