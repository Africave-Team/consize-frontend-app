"use client"
import Layout from '@/layouts/PageTransition'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import React, { useEffect, useRef, useState } from 'react'
import { PiArrowBendDownRightLight } from "react-icons/pi"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Skeleton, Spinner } from '@chakra-ui/react'
import { generateCourseOutlineAI } from '@/services/secure.courses.service'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'
import EditBlockForm from '@/components/FormButtons/EditBlock'
import { MediaType } from '@/type-definitions/secure.courses'
import Link from 'next/link'
import Countdown, { zeroPad } from 'react-countdown'
import moment from 'moment'

interface FinalResult {
  section: {
    sectionName: string
    sectionContent: string
  }
  quiz: {
    question: string
    options: string[]
    correct_answer: string
    hint: string
    explanation: string
  }
  followupQuiz: {
    question: string
    options: string[]
    correct_answer: string
    hint: string
    explanation: string
  }
}
interface Progress {
  [key: string]: {
    [lesson: string]: {
      [key: string]: {
        [section: string]: {
          result: FinalResult
          blockId: string
          courseId: string
          lessonId: string
          status: "RUNNING" | "FINISHED" | "FAILED" | "RETRYING"
        }
      }
    }
  }
}

function convertToProgress (input: any): Progress {
  const result: Progress = {}

  for (const lessonId in input) {
    const lessonData = input[lessonId]
    for (const lessonName in lessonData) {
      const sectionsData = lessonData[lessonName]
      result[lessonName] = {}

      for (const sectionId in sectionsData) {
        const sectionData = sectionsData[sectionId]
        for (const sectionName in sectionData) {
          const sectionDetails = sectionData[sectionName]
          result[lessonName][sectionName] = {
            result: sectionDetails.result,
            blockId: sectionDetails.blockId,
            courseId: sectionDetails.courseId,
            lessonId: sectionDetails.lessonId,
            status: sectionDetails.status,
          }
        }
      }
    }
  }

  return result
}

interface JobData {
  title: string
  start: string | null
  end: string | null
  error: string | null
  courseId: string | null
  progress: Progress
  result: Curriculum
  lessonCount: number
  status: "RUNNING" | "FINISHED" | "FAILED" | "RETRYING"
}

interface LessonSection {
  [sectionKey: string]: [string, string]
}

interface Lesson {
  lesson_name: string
  sections: LessonSection
}

interface Lessons {
  [lessonKey: string]: Lesson
}

interface Curriculum {
  description: string
  lessons: Lessons
}

export default function page ({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<JobData | null>(null)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const timerRef = useRef(moment().add(30, 'minutes').valueOf())
  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    setLoading(true)
    const database = getDatabase(app)
    const path = ref(database, `ai-jobs/` + params.id)
    const fetchData = async () => {
      onValue(path, async (snapshot) => {
        const data: JobData = await snapshot.val()
        if (data) {

          setJob(data)
          if (data.progress) {
            setLoading(false)
          }
          console.log(data)
        }
      })
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      const path = ref(database, `ai-jobs/` + params.id)
      off(path)
    }
  }, [params.id])

  const generateOutline = async function (job: JobData) {
    await generateCourseOutlineAI({
      title: job.title,
      lessonCount: job.lessonCount,
      jobId: params.id
    })
  }
  return (

    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-4/5'>
            <div>
              Step 3
            </div>
            <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
              <div className='font-semibold md:text-2xl text-xl'>
                Preview lesson outline
              </div>
            </div>
            <div className='w-3/5'>
              In this step, we'll ask you a few questions about your course. This would help the AI better tailor the course content to your specific needs.
            </div>

            <div className='w-3/5 mt-8 border border-[#D8E0E9] shadow p-6 rounded-lg'>
              <div className='flex justify-between items-center h-10 w-full'>
                <div className='font-semibold text-lg'>Lessons</div>
                {(isLoading || job?.status === "RUNNING" || job?.status === "RETRYING") && <div className='flex justify-center'>
                  <Countdown date={timerRef.current} renderer={({ minutes, seconds }) => (
                    <div className='text-sm'>
                      {minutes} minutes, {zeroPad(seconds)} seconds
                    </div>
                  )} />
                </div>}
              </div>
              {isLoading ? <div className='flex flex-col gap-2'>
                <Skeleton className='h-14 w-full rounded-lg' />
                <Skeleton className='h-14 w-full rounded-lg' />
              </div> : job && <div>
                <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                  {job.progress && Object.keys(job.progress).filter(e => !isNaN(Number(e))).map((key, index) => {
                    const lessonData = job.progress[key]
                    const lessonName = Object.keys(lessonData)[0]
                    const sections = lessonData[lessonName]
                    let running = Object.values(sections).flatMap((sec) => {
                      let ft = Object.values(sec)[0]
                      return ft ? ft.status : 'RUNNING'
                    }).some(e => e === "RUNNING" || e === "RETRYING")
                    return (
                      <AccordionItem className='border-none' key={lessonName}>
                        <div className='flex justify-between items-center rounded-lg h-10 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
                          <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                            <div className='flex flex-col items-start'>
                              <div className='text-sm text-black font-semibold'>{lessonName}</div>
                            </div>
                          </AccordionButton>
                          <div className='flex items-center gap-2 h-full'>
                            {running ? <Spinner className='mr-5' size={'sm'} /> :
                              <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                                <AccordionIcon />
                              </AccordionButton>
                            }
                          </div>
                        </div>
                        <AccordionPanel className='px-0 py-2'>
                          <div className='flex flex-col gap-2'>
                            {sections && Array.isArray(sections) ? <>
                              {sections.map((value, index) => {
                                const sectionName = Object.keys(value)[0]
                                const section = value[sectionName]
                                return (
                                  <div key={sectionName} className='flex'>
                                    {<>
                                      <div className='w-10 flex justify-center py-3'>
                                        <PiArrowBendDownRightLight className='text-2xl font-bold' />
                                      </div>
                                      <div className='min-h-10 flex-1 rounded-lg py-1'>
                                        <Accordion className='flex flex-col w-full pl-0' defaultIndex={[0]} allowMultiple>
                                          <AccordionItem className='border-none pl-0' key={sectionName}>
                                            <div className='flex justify-between items-center rounded-lg h-10'>
                                              <AccordionButton className='h-full hover:!bg-transparent pl-0 flex gap-2'>
                                                <div className='flex flex-col items-start'>
                                                  <div className='text-sm text-black font-semibold' >Section {index + 1}: {sectionName}</div>
                                                </div>
                                              </AccordionButton>
                                              <div className='flex items-center gap-2 h-full'>
                                                {section && (section.status === "RUNNING" || section.status === "RETRYING") ? <Spinner className='mr-5' size={'sm'} /> : <>
                                                  <button className='h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center'>
                                                    <FiTrash2 />
                                                  </button>
                                                  <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                                                    <AccordionIcon />
                                                  </AccordionButton>
                                                </>}
                                              </div>
                                            </div>
                                            {section && section.status === "FINISHED" && section.result && <AccordionPanel className='px-0 py-2'>
                                              {section.result.section && <div>
                                                <div dangerouslySetInnerHTML={{ __html: section.result.section.sectionContent }} />
                                              </div>}
                                            </AccordionPanel>}
                                          </AccordionItem>
                                        </Accordion>
                                      </div></>}
                                  </div>
                                )
                              })}
                            </> : Object.entries(sections).map(([_, value], index) => {
                              const sectionData = value
                              const sectionName = Object.keys(sectionData)[0]
                              const section = sectionData[sectionName]
                              return (
                                <div key={sectionName} className='flex'>
                                  {<>
                                    <div className='w-10 flex justify-center py-3'>
                                      <PiArrowBendDownRightLight className='text-2xl font-bold' />
                                    </div>
                                    <div className='min-h-10 flex-1 rounded-lg py-1'>
                                      <Accordion className='flex flex-col w-full pl-0' defaultIndex={[0]} allowMultiple>
                                        <AccordionItem className='border-none pl-0' key={sectionName}>
                                          <div className='flex justify-between items-center rounded-lg h-10'>
                                            <AccordionButton className='h-full hover:!bg-transparent pl-0 flex gap-2'>
                                              <div className='flex flex-col items-start'>
                                                <div className='text-sm text-black font-semibold' >Section {index + 1}: {sectionName}</div>
                                              </div>
                                            </AccordionButton>
                                            <div className='flex items-center gap-2 h-full'>
                                              {section && (section.status === "RUNNING" || section.status === "RETRYING") ? <Spinner className='mr-5' size={'sm'} /> : <>
                                                <button className='h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center'>
                                                  <FiTrash2 />
                                                </button>
                                                <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                                                  <AccordionIcon />
                                                </AccordionButton>
                                              </>}
                                            </div>
                                          </div>
                                          {section && section.status === "FINISHED" && section.result && <AccordionPanel className='px-0 py-2'>
                                            {section.result.section && <div>
                                              <div dangerouslySetInnerHTML={{ __html: section.result.section.sectionContent }} />
                                            </div>}
                                          </AccordionPanel>}
                                        </AccordionItem>
                                      </Accordion>
                                    </div></>}
                                </div>
                              )
                            })}
                          </div>
                        </AccordionPanel>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
                <div className='justify-end gap-2 py-5 flex'>
                  <Link href="/dashboard/courses/new/ai" className='text-sm px-7 h-12 border items-center justify-center text-primary-dark font-medium bg-white flex gap-1 rounded-3xl'>
                    Back
                  </Link>
                  {job.courseId && <Link replace={true} href={`/dashboard/courses/${job.courseId}/builder/outline`} className='text-sm px-7 h-12 items-center justify-center text-primary-dark font-medium bg-primary-app flex gap-1 disabled:bg-primary-app/60 rounded-3xl'>
                    Next
                  </Link>}
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
