import React, { useState } from 'react'
import AIIcon from '../icons/AI'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { FaSearch } from 'react-icons/fa'
import { findLibraryCourses } from '@/services/secure.courses.service'
import { useQuery } from '@tanstack/react-query'
import { Course } from '@/type-definitions/secure.courses'
import { GoDotFill } from 'react-icons/go'
import { PiArrowBendDownRightLight } from 'react-icons/pi'
import CourseSurveyCard from '../Courses/CourseSurveyCard'
import Link from 'next/link'

export default function LibrarySelector () {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const loadData = async function (payload: { search: string }) {
    const { data } = await findLibraryCourses({ search: payload.search, library: 1 })
    return data
  }

  const form = useFormik({
    initialValues: {
      search: ""
    },
    onSubmit: async function () {
      onClose()
    },
  })

  const { data: searchResults, isFetching, refetch } =
    useQuery({
      queryKey: ['library-search', { search: form.values.search, isOpen }],
      queryFn: () => isOpen && form.values.search.length > 0 && loadData({ search: form.values.search })
    })
  return (
    <div>
      <button onClick={onOpen} className='w-full text-[#0D1F23] bg-[#1FFF6999] disabled:bg-gray-300 hover:bg-[#1FFF6999]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
        <div className='flex w-full justify-center gap-1'>
          {/* <img loading="lazy" src="/ai-icon-dark-2.svg" alt="" /> */}
          <AIIcon className='h-5 w-5 stroke-black fill-black' />
          Choose from library
        </div>
      </button>


      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'6xl'}
      >
        <ModalOverlay />
        <ModalContent className='p-0 h-screen'>
          <ModalBody className='px-2 py-5 h-full'>
            <div className='flex h-full justify-between gap-4 mt-3 items-center'>
              <div className='w-[400px] border-r h-full pr-5'>
                <div className='font-bold text-xl mb-2'>Let's find what you need</div>
                <form onSubmit={form.handleSubmit}>
                  {/* search form here */}
                  <div className='relative'>
                    <div onClick={() => document.getElementById('search')?.focus()} className='pl-12 absolute top-0 left-0 flex h-14 font-semibold items-center text-base'>{form.values.search.length === 0 ? 'Search courses' : ''}</div>
                    <input onChange={form.handleChange} onBlur={form.handleBlur} name="search" value={form.values.search} placeholder='' id="search" type="text" className={`w-full bg-white  h-14 pl-12 pr-5 border font-semibold text-lg focus-visible:outline-[#0D1F23]`} />
                    <div className='absolute left-0 top-0 h-14 w-12 flex justify-center items-center'>
                      <FaSearch className='text-xl' />
                    </div>
                    <div className='absolute right-0 top-0 h-14 w-12 flex justify-center items-center'>
                      {isFetching && <Spinner size={'md'} className='text-xl' />}
                    </div>
                  </div>
                </form>

                {searchResults && <div>
                  {searchResults.length === 0 ? <div className='w-full h-10 flex justify-center items-center mt-4'>
                    No results found
                  </div> : <div>
                    <div className='h-10 w-full mt-3'>
                      {searchResults.length} results
                    </div>
                    <div className='w-full overflow-y-scroll'>
                      {searchResults.map((course: Course) => (<div onClick={() => {
                        setActiveCourse(course)
                      }} className={`min-h-20 cursor-pointer hover:bg-[#0D1F23] hover:text-white p-2 ${activeCourse && activeCourse.id === course.id ? 'bg-[#0D1F23] text-white' : ''}`} key={course.id}>
                        <div className='text-sm font-bold flex gap-1 items-center'>{course.title}</div>
                        <div className='mt-2 text-xs line-clamp-2' dangerouslySetInnerHTML={{ __html: he.decode(course.description || "") }}></div>
                      </div>))}
                    </div>
                  </div>}
                </div>}
              </div>
              <div className='flex-1 flex pr-5 h-full justify-start  overflow-y-scroll items-start'>
                {
                  !activeCourse ? <div>
                    Select a course to preview it here
                  </div> : <div className='flex flex-col w-full'>
                    <div className='w-full flex items-center justify-between mb-3'>
                      <div className='font-bold text-xl mb-2'></div>
                      <div className='flex items-center gap-3'>
                        <button className='' onClick={() => setActiveCourse(null)}>Close</button>
                        <Link href={`/dashboard/courses/new/template/${activeCourse.id}`} className='h-8 rounded-lg flex items-center bg-primary-dark text-white px-4'>Use this</Link>
                      </div>
                    </div>

                    <div className='h-96 bg-gray-100'>
                      {activeCourse.headerMedia && activeCourse.headerMedia.url && <img src={activeCourse.headerMedia.url} className='w-full h-full' alt="" />}
                    </div>
                    <div className='font-bold text-xl my-2 px-3'>
                      {activeCourse.title}
                    </div>
                    <div className='text-base px-3 font-normal min-h-12 line-clamp-4' dangerouslySetInnerHTML={{ __html: he.decode(activeCourse.description) }} />

                    <div className='mt-4'>
                      <Accordion allowMultiple defaultIndex={[]}>
                        {!activeCourse.bundle ? <AccordionItem>
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
                              {activeCourse.lessons.map((value, index) => <AccordionItem className='border-none' key={value.id}>
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
                              {activeCourse.courses.map((value, index) => <AccordionItem className='border-none' key={value.id}>
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
                                            {lesson.blocks && lesson.blocks.map((block, index) => <div key={block.id} className='flex'>
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
                            {activeCourse && <CourseSurveyCard surveyId={activeCourse.survey} courseId={activeCourse.id} />}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                }
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
