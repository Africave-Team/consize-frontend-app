'use client'
import { fetchSinglePublishedCourse } from '@/services/public.courses.service'
import { PublicCourse, RTDBStudent } from '@/type-definitions/secure.courses'
import { Icon, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import he from "he"
import { IoChevronForward, IoBookOutline } from "react-icons/io5"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import WholeForm from '@/components/Enrollment/WholeForm'
import Link from 'next/link'
import { FiClock, FiDollarSign } from 'react-icons/fi'
import { RiWhatsappLine } from 'react-icons/ri'
import MainFooter from '@/components/navigations/MainFooter'
import chroma from 'chroma-js'


interface ApiResponse {
  data: PublicCourse
  message: string
}

export default function SinglePublicCourses ({ params, searchParams }: { params: { id: string }, searchParams: { tryout?: boolean } }) {
  const { setPageTitle, team } = useNavigationStore()
  const [loading, setLoading] = useState(false)
  const [maxEnrollmentReached, setMaxEnrollmentReached] = useState(false)

  const loadData = async function () {
    const data = await fetchSinglePublishedCourse(params.id)
    return data
  }

  const { data: courseResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['one-course', params.id],
      queryFn: () => loadData()
    })

  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    const database = getDatabase(app)
    if (courseResults && courseResults.data) {
      setLoading(true)
      let { owner: team, id, title } = courseResults.data

      if (team) {
        const studentPath = ref(database, 'course-statistics/' + team.id + '/' + id + '/students')
        const fetchData = async () => {
          onValue(studentPath, async (snapshot) => {
            const result: {
              [id: string]: RTDBStudent
            } | null = snapshot.val()
            if (result) {
              console.log(result)
              const students = Object.values(result).length
              if (students >= courseResults.data.settings.metadata.maxEnrollments) {
                setMaxEnrollmentReached(true)
              }
            }
            setLoading(false)
          })
        }
        fetchData()
        setPageTitle(team.name + ' - ' + title)
      }

    }




    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (courseResults && courseResults.data) {
        let { owner: team, id } = courseResults.data
        const projectStats = ref(database, 'course-statistics/' + team.id + '/' + id)
        off(projectStats)
      }
    }
  }, [courseResults])

  const goToForm = function () {
    const container = document.getElementById('scroll-container')
    const element = document.getElementById('small-form')
    if (element && container) {
      container.scroll({
        top: element.offsetTop,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  const dynamicGradient = team && team.color
    ? `linear-gradient(to left, ${team.color.primary}, ${chroma(team.color.primary).darken(1.5).hex()})`
    : 'linear-gradient(to left, #1FFF69, #00524F)'

  const dynamicGradientMd = team && team.color
    ? `linear-gradient(to left, ${team.color.primary}, ${chroma(team.color.primary).darken(1.5).hex()} 90%)`
    : 'linear-gradient(to left, #1FFF69, #00524F 90%)'

  const getLegibleTextColor = (backgroundColor: string): string => {
    // Create a chroma color object
    const bgColor = chroma(backgroundColor)
    // Get luminance of the background color
    const luminance = bgColor.luminance()

    // Determine if the background is light or dark
    // Choose text color with enough contrast
    const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF'

    // Check the contrast ratio
    const contrastRatio = chroma.contrast(backgroundColor, textColor)

    // If the contrast ratio is not sufficient, return the other color
    return contrastRatio < 4.5 ? (textColor === '#000000' ? '#FFFFFF' : '#000000') : textColor
  }

  const textColor = team && team.color ? getLegibleTextColor(team.color.primary) : "#ffffff"

  return <Layout>
    <div id="scroll-container" className='h-[94vh] overflow-y-scroll overflow-x-hidden flex-col justify-between'>
      {isFetching ? <div className={`w-full h-full`}>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
      </div> : <>
        <div className={`w-full h-[100vh]`}>
          <div className='relative h-[420px] md:h-[280px]'>
            {/* @ts-ignore */}
            <div style={{ '--dynamic-gradient': dynamicGradient, '--dynamic-gradient-md': dynamicGradientMd }} className='absolute top-0 left-0 h-full w-full gradient-background md:gradient-background'>
              <div className='bg-[url(/lines3.svg)] bg-cover pt-10 pb-5 h-full w-full flex flex-col'>
                <div className='font-semibold text-md flex md:px-16 px-5 gap-2 items-center text-[#AAF0C4]'>
                  {(location.host.startsWith('app.') || location.host.startsWith('staging-app.')) ? <><Link href={`/courses`}>Courses</Link> <Icon as={IoChevronForward} /></> : <><Link href={`/teams/${courseResults?.data.owner.id}`}>{courseResults?.data?.owner.name}</Link> <Icon as={IoChevronForward} /></>}{courseResults?.data?.title}
                </div>
                <div className='mt-4 w-full md:min-h-[250px] min-h-[350px]'>
                  <div className='md:px-16 px-5 w-full md:w-4/6'>
                    <h1 className='font-semibold text-xl line-clamp-2' style={{ color: textColor }}>
                      {courseResults?.data?.title}
                    </h1>
                    <p style={{ color: textColor, opacity: 0.8 }} className='text-sm line-clamp-4 h-20 mt-3' dangerouslySetInnerHTML={{ __html: he.decode(`${courseResults?.data?.description}` || "") }} />

                  </div>
                  <div className='w-full mt-3 overflow-x-hidden select-none overflow-y-hidden'>
                    <div className='flex gap-2 min-w-full md:min-w-[550px] py-3 text-xs md:flex-row flex-col'>
                      <div style={{ color: textColor }} className='md:hidden flex gap-2'>
                        <div className='bg-white bg-opacity-10 px-2 h-7 md:ml-16 ml-5 w-16 rounded-2xl flex gap-2 justify-start items-center'>
                          <Icon as={FiDollarSign} />
                          <span>Free</span>
                        </div>
                        <div className='bg-white bg-opacity-10 h-7 w-24 px-2 rounded-2xl flex gap-2 justify-start items-center'>
                          <Icon as={IoBookOutline} />
                          <span>{courseResults?.data?.lessons.length} Lessons</span>
                        </div>
                        <div className='bg-white/10 h-7 w-20 rounded-2xl px-2 flex gap-2 justify-start items-center'>
                          <Icon as={FiClock} />
                          <span>{courseResults?.data?.lessons.length} Days</span>
                        </div>
                      </div>
                      <div style={{ color: textColor }} className='md:hidden flex'>
                        <div className='bg-white/10 h-7 w-56 ml-5 rounded-2xl px-2 flex gap-2 justify-start items-center'>
                          <Icon as={RiWhatsappLine} />
                          <span>Delivered through WhatsApp</span>
                        </div>
                      </div>

                      <div style={{ color: textColor }} className='bg-white bg-opacity-10 hidden px-2 h-7 md:ml-16 ml-5 w-16 rounded-2xl md:flex gap-2 justify-start items-center'>
                        <Icon as={FiDollarSign} />
                        <span>Free</span>
                      </div>
                      <div style={{ color: textColor }} className='bg-white bg-opacity-10 hidden h-7 w-24 px-2 rounded-2xl md:flex gap-2 justify-start items-center'>
                        <Icon as={IoBookOutline} />
                        <span>{courseResults?.data?.lessons.length} Lessons</span>
                      </div>
                      <div style={{ color: textColor }} className='bg-white/10 h-7 w-20 hidden rounded-2xl px-2 md:flex gap-2 justify-start items-center'>
                        <Icon as={FiClock} />
                        <span>{courseResults?.data?.lessons.length} Days</span>
                      </div>
                      <div style={{ color: textColor }} className='bg-white/10 h-7 w-56 hidden rounded-2xl px-2 md:flex gap-2 justify-start items-center'>
                        <Icon as={RiWhatsappLine} />
                        <span>Delivered through WhatsApp</span>
                      </div>
                    </div>
                    <div className='w-full px-5 py-5 h-16 flex items-center md:hidden'>
                      <button onClick={goToForm} className='h-10 font-medium w-full shadow-md bg-[#1FFF69] rounded-2xl'>
                        Enroll for free
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='absolute top-32 right-10'>
              <div className='w-[450px] hidden md:block'>
                <div className='rounded-xl border min-h-[480px] shadow-sm bg-white md:flex md:flex-col'>
                  <div className='h-52 rounded-t-lg w-full'>
                    <img src={courseResults?.data.headerMedia.url} loading='lazy' className='h-full rounded-t-xl w-full' />
                  </div>
                  <div className='px-5 py-3'>
                    <div className='font-semibold text-base'>Enroll into this course</div>
                    <div className='text-sm text-gray-500'>
                      Enrolling for the course would allow you to immediately start receiving the course on your whatsapp in text format.
                    </div>
                    {searchParams && searchParams.tryout ? <WholeForm fields={courseResults?.data.settings.enrollmentFormFields || []} tryout={true} id={params.id} /> : maxEnrollmentReached ? <div className='bg-[#EF444414] min-h-20 w-full rounded-lg mt-10 p-4'>
                      <div className='font-semibold text-[#EF4444] text-sm'>Maximum enrollment reached</div>
                      <div className='text-[#EF4444] text-sm'>Sorry, the maximum learner limit has reached for this course</div>
                    </div> : <WholeForm fields={courseResults?.data.settings.enrollmentFormFields || []} id={params.id} />}
                  </div>
                </div>
              </div>
            </div>


          </div>

          <div className='text-black py-5 px-5 w-full md:w-3/5'>
            <div className='rounded-lg w-full md:w-11/12 md:px-4 py-4 px-2'>
              <div className='flex justify-start md:flex-row flex-col items-start md:items-center w-full gap-2 md:gap-10'>

                <div className='md:h-72 h-80 md:mb-0 mb-8 px-10 md:w-[450px] flex justify-center w-full items-center'>
                  <div className='w-40 md:h-72 h-80 rounded-lg relative'>
                    <img loading="lazy" src="/wsapp-phone.png" alt="whatsapp-icon" className='w-full h-full absolute' />
                    <img loading="lazy" src="/app-mockup.jpg" alt="whatsapp-icon" className='w-[140px] md:h-[237px] h-[267px] rounded-lg left-2.5 top-5 absolute' />

                  </div>
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

          <div id="small-form" className='w-full px-5 py-16 md:hidden'>
            <div className='rounded-xl border min-h-[480px] shadow-sm bg-white md:flex md:flex-col'>
              <div className='h-52 rounded-t-lg w-full'>
                <img src={courseResults?.data.headerMedia.url} loading='lazy' className='h-full rounded-t-xl w-full' />
              </div>
              <div className='px-5 py-3'>
                <div className='font-semibold text-base'>Enroll into this course</div>
                <div className='text-sm text-gray-500'>
                  Enrolling for the course would allow you to immediately start receiving the course on your whatsapp in text format.
                </div>
                {searchParams && searchParams.tryout ? <WholeForm fields={courseResults?.data.settings.enrollmentFormFields || []} tryout={true} id={params.id} /> : maxEnrollmentReached ? <div className='bg-[#EF444414] min-h-20 w-full rounded-lg mt-10 p-4'>
                  <div className='font-semibold text-[#EF4444] text-sm'>Maximum enrollment reached</div>
                  <div className='text-[#EF4444] text-sm'>Sorry, the maximum learner limit has reached for this course</div>
                </div> : <WholeForm fields={courseResults?.data.settings.enrollmentFormFields || []} id={params.id} />}
              </div>
            </div>
          </div>

          <MainFooter />

        </div>
      </>}

    </div>
  </Layout >
}

