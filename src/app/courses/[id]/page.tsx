'use client'
import { fetchSinglePublishedCourse } from '@/services/public.courses.service'
import { PublicCourse } from '@/type-definitions/secure.courses'
import { Icon, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import he from "he"
import { IoChevronForward, IoBookOutline } from "react-icons/io5"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import WholeForm from '@/components/Enrollment/WholeForm'
import Link from 'next/link'
import { FiClock, FiDollarSign } from 'react-icons/fi'
import { RiWhatsappLine } from 'react-icons/ri'


interface ApiResponse {
  data: PublicCourse
  message: string
}

export default function SinglePublicCourses ({ params }: { params: { id: string } }) {
  const { setPageTitle } = useNavigationStore()

  useEffect(() => {
    setPageTitle("Consize - Courses")
  }, [])

  const loadData = async function () {
    const data = await fetchSinglePublishedCourse(params.id)
    return data
  }

  const { data: courseResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['one-course', params.id],
      queryFn: () => loadData()
    })
  return <Layout>
    <div className='flex flex-col justify-between'>
      {isFetching ? <div className={`w-full`}>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
      </div> : <div className={`w-full h-[900px] overflow-y-scroll`}>
        <div className="relative h-[900px]">
          <div className='border w-full absolute top-0 left-0'>
            <div className='h-[390px] md:h-[300px] w-full bg-hero-pattern'>
              <div className='bg-[url(/lines3.svg)] bg-cover h-full w-full'></div>
            </div>
          </div>
          <div className='absolute top-10 h-full md:left-10 left-0 md:right-10 right-0 flex gap-6 justify-between'>
            <div className='flex-1 md:h-[100vh] h-[280vh]'>
              <div className='font-semibold text-md flex md:px-16 px-5 gap-2 items-center text-[#B9B5FB]'>
                <Link href={`/courses`}>Courses</Link> <Icon as={IoChevronForward} /> {courseResults?.data?.owner.name}
              </div>
              <div className='mt-4 w-full md:h-[200px] h-[350px]'>
                <div className='md:px-16 px-5 w-full md:w-4/6'>
                  <h1 className='font-semibold text-xl text-white line-clamp-2'>
                    {courseResults?.data?.title}
                  </h1>
                  <p className='text-sm line-clamp-4 text-white/80 mt-3' dangerouslySetInnerHTML={{ __html: he.decode(courseResults?.data?.description || "") }} />
                </div>
                <div className='w-full mt-3 overflow-x-hidden select-none overflow-y-hidden'>
                  <div className='flex gap-2 min-w-[550px] py-3 text-xs md:flex-row flex-col'>
                    <div className='md:hidden flex gap-2'>
                      <div className='bg-white bg-opacity-10 text-white px-2 h-7 md:ml-16 ml-5 w-16 rounded-2xl flex gap-2 justify-start items-center'>
                        <Icon as={FiDollarSign} />
                        <span>Free</span>
                      </div>
                      <div className='bg-white bg-opacity-10 h-7 w-24 px-2 text-white rounded-2xl flex gap-2 justify-start items-center'>
                        <Icon as={IoBookOutline} />
                        <span>{courseResults?.data?.lessons.length} Lessons</span>
                      </div>
                      <div className='bg-white/10 h-7 w-20 rounded-2xl px-2 text-white flex gap-2 justify-start items-center'>
                        <Icon as={FiClock} />
                        <span>{courseResults?.data?.lessons.length} Days</span>
                      </div>
                    </div>
                    <div className='md:hidden flex'>
                      <div className='bg-white/10 h-7 w-56 ml-5 rounded-2xl px-2 text-white flex gap-2 justify-start items-center'>
                        <Icon as={RiWhatsappLine} />
                        <span>Delivered through WhatsApp</span>
                      </div>
                    </div>

                    <div className='bg-white bg-opacity-10 hidden text-white px-2 h-7 md:ml-16 ml-5 w-16 rounded-2xl md:flex gap-2 justify-start items-center'>
                      <Icon as={FiDollarSign} />
                      <span>Free</span>
                    </div>
                    <div className='bg-white bg-opacity-10 hidden h-7 w-24 px-2 text-white rounded-2xl md:flex gap-2 justify-start items-center'>
                      <Icon as={IoBookOutline} />
                      <span>{courseResults?.data?.lessons.length} Lessons</span>
                    </div>
                    <div className='bg-white/10 h-7 w-20 hidden rounded-2xl px-2 text-white md:flex gap-2 justify-start items-center'>
                      <Icon as={FiClock} />
                      <span>{courseResults?.data?.lessons.length} Days</span>
                    </div>
                    <div className='bg-white/10 h-7 w-56 hidden rounded-2xl px-2 text-white md:flex gap-2 justify-start items-center'>
                      <Icon as={RiWhatsappLine} />
                      <span>Delivered through WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='text-black py-5 px-5 w-full'>
                <div className='rounded-lg w-full md:px-4 py-4 px-2'>
                  <div className='flex justify-start md:flex-row flex-col items-start md:items-center w-full gap-2 md:gap-10'>

                    <div className='md:h-72 h-80 md:mb-0 mb-8 px-10 md:w-[450px] flex justify-center w-full items-center'>
                      <img loading="lazy" src="/wsapp-phone.png" alt="whatsapp-icon" className='md:h-64 md:w-40 h-80 w-40' />
                    </div>
                    <div>
                      <h1 className='font-semibold text-md text-[#0A5C53]'>
                        This is a text-based course delivered through WhatsApp
                      </h1>
                      <p className='text-sm text-[#0A5C53] mt-2'>
                        We strongly believe in bite sized learning rather than long course videos. Aligning with
                        that philosophy, this course shall be sent to you in a text format through WhatsApp,
                        one section at a time. You may go through the course at your own pace.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 border-t pt-5'>
                  <h1 className='font-semibold text-lg'>Course content</h1>
                </div>
                <div className='my-5 border rounded-lg bg-[#D8E0E9]/15'>
                  {courseResults?.data?.lessons && courseResults?.data?.lessons.map((lesson, index) => {
                    return (
                      <div key={lesson.id} className={`py-3 px-3 ${Number(courseResults?.data?.lessons.length) !== (index + 1) ? 'border-b' : ''}`}>
                        <h1 className='font-semibold md:text-md text-sm text-[#0F172A] line-clamp-2'>
                          {lesson.title}
                        </h1>
                        {lesson.description && lesson.description.length > 0 && <p className='text-sm line-clamp-4 text-[#334155] mt-3' dangerouslySetInnerHTML={{ __html: he.decode(lesson.description || '') }}></p>}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className='w-full px-5 md:hidden rounded-lg shadow-sm bg-white flex flex-col'>
                <div className='h-52 rounded-t-lg w-full'>
                  <img src={courseResults?.data.headerMedia.url} loading='lazy' className='h-full rounded-t-lg w-full' />
                </div>
                <div className='px-5 py-3'>
                  <div className='font-semibold text-base'>Enroll into this course</div>
                  <div className='text-sm text-gray-500'>
                    Enrolling for the course would allow you to immediately start receiving the course on your whatsapp in text format.
                  </div>
                  <WholeForm id={params.id} />
                </div>
              </div>
            </div>
            <div className='w-[480px] hidden rounded-lg shadow-sm bg-white md:flex md:flex-col'>
              <div className='h-52 rounded-t-lg w-full'>
                <img src={courseResults?.data.headerMedia.url} loading='lazy' className='h-full rounded-t-lg w-full' />
              </div>
              <div className='px-5 py-3'>
                <div className='font-semibold text-base'>Enroll into this course</div>
                <div className='text-sm text-gray-500'>
                  Enrolling for the course would allow you to immediately start receiving the course on your whatsapp in text format.
                </div>
                <WholeForm id={params.id} />
              </div>
            </div>
          </div>
        </div>
        <div className='h-[300px]'></div>
      </div>}
    </div>
  </Layout>
}

