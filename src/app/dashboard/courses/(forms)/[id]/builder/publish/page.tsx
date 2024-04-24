"use client"
import ViewCourseDetails from '@/components/Courses/ViewCourseDetails'
import PhoneInput from '@/components/PhoneInput'
import Layout from '@/layouts/PageTransition'
import { fetchSingleCourse, updateCourse } from '@/services/secure.courses.service'
import { Course, CourseStatus } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'


interface ApiResponse {
  data: Course
  message: string
}


export default function page ({ params }: { params: { id: string } }) {
  const router = useRouter()
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }
  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

  const togglePrivacy = async function () {
    if (courseDetails) {
      await updateCourse({
        private: !courseDetails.data.private,
      }, params.id)
    }
    refetch()
  }

  const publishCourse = async function () {
    if (courseDetails) {
      await updateCourse({ // @ts-ignore
        status: CourseStatus.PUBLISHED,
      }, params.id)
    }
    router.push(`/dashboard/courses/${params.id}`)
  }

  const attachSurvey = async function () {
    if (courseDetails) {
      await updateCourse({
        survey: "750c7074-4415-4ec9-8d17-9fb7eaf73b20"
      }, params.id)
      refetch()
    }
  }
  return (

    <Layout>
      <div className='w-full overflow-y-scroll'>
        <div className='flex-1 flex justify-center'>
          <div className='px-4 w-full h-screen'>
            <div className='h-14 flex items-center font-semibold text-xl'>Alright, let's do some house-cleaning</div>
            <div className='flex gap-5'>
              <div className='w-1/2'>
                <div className='w-full'>
                  {courseDetails && <ViewCourseDetails course={courseDetails?.data} />}
                </div>
              </div>
              <div className='flex justify-center w-1/2'>
                {courseDetails && <div className='w-2/3 flex flex-col gap-8'>
                  <div>
                    <div className='flex w-full gap-1'>
                      <button onClick={togglePrivacy} className={`${courseDetails.data.private ? 'border-primary-dark border' : 'bg-primary-dark text-white'} h-12 w-1/2 rounded-md  font-medium`}>
                        Public
                      </button>
                      <button onClick={togglePrivacy} className={`${courseDetails.data.private ? 'bg-primary-dark text-white' : 'border-primary-dark border'} h-12 w-1/2 rounded-md  font-medium`}>
                        Private
                      </button>
                    </div>
                    <div className='mt-1 text-sm'>You may set your course as private and it will only be visible to people you share it with. Public courses get listed on our public repository for potential students to discover</div>
                  </div>
                  {courseDetails.data.status !== CourseStatus.PUBLISHED && <div>
                    <button onClick={publishCourse} className='bg-primary-dark h-12 rounded-md text-white font-medium w-full'>Publish this course</button>
                    <div className='mt-1 text-sm'>By publishing this course you agree to the terms of service as published by Consize and you understand that the course will be marked as being ready for consumption by your students</div>
                  </div>}

                  {!courseDetails.data.survey && <div>
                    <button onClick={attachSurvey} className='bg-primary-dark h-12 rounded-md text-white font-medium w-full'>Attach default survey</button>
                    <div className='mt-1 text-sm'>This survey will be presented to your students at the end of the course to help gauge their opinions on this course.</div>
                  </div>}

                  <div>
                    <div className='my-1 text-sm'>Do you want to try the course before publishing it?</div>
                    <div className='relative'>
                      <div className='absolute w-full top-0 left-0'>
                        <PhoneInput value='' onChange={() => { }} />
                      </div>
                      <button className='h-14 text-white absolute top-0 px-5 bg-primary-dark right-0'>
                        Send
                      </button>
                    </div>

                  </div>

                </div>}
              </div>
            </div>
            <div className='h-60'></div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
