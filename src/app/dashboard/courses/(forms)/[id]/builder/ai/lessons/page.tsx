"use client"
import Layout from '@/layouts/PageTransition'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Skeleton, Spinner } from '@chakra-ui/react'
import { createCourseAI, generateCourseOutlineAI } from '@/services/secure.courses.service'
import { FiEdit3 } from 'react-icons/fi'
import Link from 'next/link'
interface JobData {
  title: string
  start: string | null
  end: string | null
  error: string | null
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
  lessons: Lessons
}

export default function page ({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<JobData | null>(null)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
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
        setJob(data)
        setLoading(false)
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

  const createCourse = async function () {
    setSubmitting(true)
    await createCourseAI({ jobId: params.id })
    setSubmitting(false)
    let doc = document.getElementById("next")
    if (doc) {
      doc.click()
    }
  }
  return (

    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-4/5'>
            <div>
              Step 2
            </div>
            <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
              <div className='font-semibold md:text-2xl text-xl'>
                Review lesson outline
              </div>
            </div>
            <div className='w-3/5'>
              In this step, we'll ask you a few questions about your course. This would help the AI better tailor the course content to your specific needs.
            </div>

            <div className='w-3/5 mt-8 border border-[#D8E0E9] shadow p-6 rounded-lg'>
              {isLoading ? <div className='flex flex-col gap-2'>
                <Skeleton className='h-14 w-full rounded-lg' />
                <Skeleton className='h-14 w-full rounded-lg' />
              </div> : job && <div>
                <div className='flex h-8 justify-between items'>
                  <div className='text-base text-[#334155]'>{job.status === "FINISHED" && `${job.lessonCount} lessons added`}</div>
                  <div className={`text-sm text-[#64748B] ${(job.status === "RUNNING" || job.status === "RETRYING") && 'italic'}`}>
                    {job.status === "RUNNING" || job.status === "RETRYING" ? "Generating lesson outline..." : "Lesson outline"}
                  </div>
                </div>
                {(job.status === "RUNNING" || job.status === "RETRYING") ? <div className='flex flex-col gap-3 w-full'>
                  {new Array(job.lessonCount).fill(4).map((_, key) => <div key={key} className='h-10 border border-[#D8E0E9] shadow p-6 rounded-lg flex justify-between items-center'>
                    <span></span>
                    <span className='text-[#64748B] text-sm'>Creating lesson {key + 1}</span>
                    <Spinner color='#64748B' size={'sm'} />
                  </div>)}
                </div> : <>
                  {job.status === "FAILED" ? <div className='w-full p-2 font-medium bg-red-500 min-h-12  text-white'>
                    <p className='text-xs'>ConsizeAI failed to generate your course outline due to the following reasons</p>

                    <p className='mt-2 text-sm'>{job.error}</p>
                    <p className='mt-2 text-xs'>Click the following button to try again</p>
                    <button onClick={() => generateOutline(job)} className='text-sm px-7 mt-3 h-12 items-center justify-center bg-primary-dark font-medium text-white flex gap-1 disabled:bg-primary-app/60 rounded-3xl'>Try again</button>
                  </div> : <div className='flex flex-col gap-3 w-full'>
                    <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                      {job.result && Object.entries(job.result.lessons).map(([key, value], index) => <AccordionItem className='border-none' key={key}>
                        <div className='flex justify-between items-center border border-[#D8E0E9] shadow rounded-lg h-14'>
                          <AccordionButton className='h-full hover:!bg-transparent flex gap-2'>
                            <div className='h-10 w-10 rounded-full bg-primary-dark flex text-white font-semibold justify-center items-center'>{index + 1}</div>
                            <div className='flex flex-col items-start'>
                              <div className='text-sm text-[#64748B]'>{key}</div>
                              <div className='text-primary-dark text-sm font-semibold'>{value.lesson_name}</div>
                            </div>
                          </AccordionButton>
                          <div className='flex items-center gap-2 h-full'>
                            {/* <button className='h-11 w-11 rounded-full bg-gray-100 flex justify-center items-center'>
                              <FiEdit3 />
                            </button> */}
                            <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                              <AccordionIcon />
                            </AccordionButton>
                          </div>
                        </div>
                        <AccordionPanel className='px-0 py-2'>
                          <div className='flex flex-col gap-3'>
                            {Object.entries(value.sections).map(([key, value], index) => <div key={key} className='bg-[#F5F7F5] min-h-20 w-full rounded-lg p-3'>
                              <div className='text-base text-[#64748B]'>Section {index + 1}</div>
                              <div className='text-primary-dark text-base font-semibold'>{value[0]}</div>
                              <div className='text-sm text-[#334155]'>{value[1]}</div>
                            </div>)}
                          </div>
                        </AccordionPanel>
                      </AccordionItem>)}
                    </Accordion>
                    <div className='justify-end gap-2 flex'>
                      <Link href="/dashboard/courses/new/ai" className='text-sm px-7 h-12 border items-center justify-center text-primary-dark font-medium bg-white flex gap-1 rounded-3xl'>
                        Back
                      </Link>
                      <button onClick={createCourse} className='text-sm px-7 h-12 items-center justify-center text-primary-dark font-medium bg-primary-app flex gap-1 disabled:bg-primary-app/60 rounded-3xl'>
                        Create course
                        {isSubmitting && <Spinner size={'sm'} />}
                      </button>
                      <Link href={`/dashboard/courses/${params.id}/builder/ai/finish`} id="next" className='hidden' />
                    </div>
                  </div>}
                </>}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
