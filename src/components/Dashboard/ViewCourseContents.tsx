import { fetchSingleCourse } from '@/services/secure.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, Skeleton, useDisclosure } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import he from "he"
import React from 'react'
import { FiBookOpen } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'

interface ApiResponse {
  data: Course
  message: string
}

export default function CourseContents ({ courseId }: { courseId: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const options = ['A', 'B', 'C', 'D', 'E', 'F']

  const loadData = async function (payload: { modalOpen: boolean, course: string }) {
    if (payload.modalOpen) {
      const data = await fetchSingleCourse(payload.course)
      return data
    }
  }

  const { data: courseResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['single-course', { isOpen, courseId }],
      queryFn: () => loadData({ modalOpen: isOpen, course: courseId })
    })
  return (

    <>
      <MenuItem onClick={onOpen} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiBookOpen className='text-sm' />}>Course contents</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'xl'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className=' p-0'>
          <ModalBody className='px-0 py-0 h-[650px] overflow-y-scroll'>
            {isFetching ? <div className='flex flex-col gap-3 pb-5'>
              <Skeleton height='300px' />
              <Skeleton height='50px' />
              <Skeleton height='50px' />
              <Skeleton height='50px' />
              <Skeleton height='50px' />
              <Skeleton height='50px' />
            </div> :
              <div className='h-[650px]'>
                <div className='h-[300px]'>
                  <img src={courseResults?.data.headerMedia.url} className='h-full w-full' alt="" />
                </div>
                <div className='min-h-[10px] font-bold text-2xl px-2 pt-1 line-clamp-2'>
                  {courseResults?.data.title}
                </div>
                <div className='min-h-[50px] px-2 text-sm' dangerouslySetInnerHTML={{ __html: he.decode(courseResults?.data.description.replace(/<p>\s*<\/p>/g, '') || "") }} />

                <div className='px-3'>
                  <h1 className='mt-4 line-clamp-3 text-base font-semibold'>Lessons</h1>
                  <Accordion allowMultiple defaultIndex={[]} as="ul" className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg">
                    {
                      courseResults?.data.lessons.map((lesson, index) => {
                        return <AccordionItem key={`lesson_${index}`}>
                          <h2>
                            <AccordionButton _hover={{ bg: 'white' }} className='flex justify-between items-center text-xs !px-0'>
                              {lesson.title}
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel className='!p-0' fontSize={'smaller'}>
                            <h1 className='line-clamp-3 text-xs my-3 font-semibold'>Content sections</h1>

                            <Accordion allowMultiple defaultIndex={[]} as="ul" className="w-full text-sm font-medium ml-3 text-gray-900 bg-white rounded-lg">
                              {
                                lesson.blocks.map((block, index) => {

                                  return <AccordionItem key={`block_${index}`}>
                                    <AccordionButton _hover={{ bg: 'white' }} className='flex justify-between items-center text-xs !pl-0'>
                                      <div className='line-clamp-1'>
                                        {block.title}
                                      </div>
                                      <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel className='!pt-0 px-4 pb-3' fontSize={'smaller'}>
                                      <h1 className='line-clamp-3 text-xs font-semibold'>Content</h1>
                                      <div dangerouslySetInnerHTML={{ __html: he.decode(block.content.replace(/<p>\s*<\/p>/g, '')) }} />
                                      {block.quiz && <div>
                                        <h1 className='line-clamp-3 text-xs mt-2 font-semibold'>Quiz question</h1>
                                        <div className='htm' dangerouslySetInnerHTML={{ __html: he.decode(block.quiz?.question.replace('&lt;p> &lt;/p>', '') || "") }} />
                                        <h1 className='line-clamp-3 text-xs mt-2 font-semibold'>Quiz answer</h1>
                                        <p>{block.quiz?.choices[block.quiz.correctAnswerIndex]}</p>
                                      </div>}

                                    </AccordionPanel>
                                  </AccordionItem>
                                })
                              }
                            </Accordion>

                            <h1 className='line-clamp-3 mt-3 text-xs font-semibold'>End of lesson quiz</h1>
                            {lesson.quizzes.length === 0 && <div className='mb-4'>There are no end of lesson quizzes for this lesson</div>}
                            <Accordion allowMultiple defaultIndex={[]} as="ul" className="w-full text-sm font-medium ml-3 text-gray-900 bg-white rounded-lg">
                              {
                                lesson.quizzes.map((quiz, index) => {
                                  return <AccordionItem key={`quiz_${index}`}>
                                    <AccordionButton _hover={{ bg: 'white' }} className='flex justify-between items-center text-xs !pl-0'>
                                      <div className='line-clamp-1'>
                                        Question {index + 1}
                                      </div>
                                      <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel className='!pt-0 px-4 pb-3' fontSize={'smaller'}>
                                      <h1 className='line-clamp-3 text-xs mb-2 font-semibold'>Question</h1>
                                      <p dangerouslySetInnerHTML={{ __html: he.decode(quiz.question) }} />
                                      <h1 className='line-clamp-3 text-xs my-2 font-semibold'>Hint</h1>
                                      <p dangerouslySetInnerHTML={{ __html: he.decode(quiz.hint || "No hint was set") }} />
                                      <h1 className='line-clamp-3 text-xs my-2 font-semibold'>Choices</h1>
                                      {quiz.choices.map((choice, index) => {
                                        return <div key={`choice_${index}`} className={`${index === quiz.correctAnswerIndex ? 'font-semibold' : ''} flex items-center gap-1`}>
                                          {options[index]}: {choice} {index === quiz.correctAnswerIndex && <IoCheckmark />}
                                        </div>
                                      })}
                                      <h1 className='line-clamp-3 text-xs my-2 font-semibold'>Correct context</h1>
                                      <p dangerouslySetInnerHTML={{ __html: he.decode(quiz.correctAnswerContext) }} />

                                      <h1 className='line-clamp-3 text-xs my-2 font-semibold'>Feedback</h1>
                                      <p dangerouslySetInnerHTML={{ __html: he.decode(quiz.revisitChunk || "No revisit chunk was set") }} />
                                    </AccordionPanel>
                                  </AccordionItem>
                                })
                              }
                            </Accordion>
                          </AccordionPanel>
                        </AccordionItem>
                      })
                    }
                  </Accordion>
                </div>
              </div>}
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
