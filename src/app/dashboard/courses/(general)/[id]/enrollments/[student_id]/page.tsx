"use client"

import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'
import { useNavigationStore } from '@/store/navigation.store'
import { Menu, MenuButton, MenuItem, MenuList, Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import { Course, Lesson, LessonData, RTDBStudent } from '@/type-definitions/secure.courses'
import dynamic from 'next/dynamic'
import InfoPopover from '@/components/Dashboard/InfoPopover'
import { fetchSingleCourse, useStudentAssessmentResult } from '@/services/secure.courses.service'
import { useQuery } from '@tanstack/react-query'
const Chart = dynamic(async () => await import('react-apexcharts'), { ssr: false })

interface ApiResponse {
  data: Course
  message: string
}

export default function page ({ params }: { params: { id: string, student_id: string } }) {
  const { sidebarOpen } = useNavigationStore()
  const { setPageTitle } = useNavigationStore()
  const [student, setStudent] = useState<RTDBStudent | null>(null)
  const [lessonDurations, setLessonDurations] = useState<number[]>([])
  const [blockDurations, setBlockDurations] = useState<number[][]>([])
  const [retakes, setRetakes] = useState<number[][]>([])
  const [quizDurations, setQuizDurations] = useState<number[][]>([])
  const [lessons, setLessons] = useState<string[]>([])

  const [quizCount, setQuizCount] = useState<number>(0)
  const [studentAverage, setStudentAverage] = useState<number>(10)
  const [scores, setScores] = useState<number[]>([])

  const [blocksShowOption, setBlocksShowOption] = useState<number>(-1)

  const { team } = useAuthStore()

  useEffect(() => {
    setPageTitle("Dashboard - Courses")
  }, [])

  useEffect(() => {
    if (retakes.length > 0) {
      setQuizCount(Math.max(...retakes.map(e => e.length)))
    }
  }, [retakes])


  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

  const { data: studentAssessment, isLoading } = useStudentAssessmentResult(params.id, params.student_id)

  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    const database = getDatabase(app)

    if (team && courseDetails?.data) {
      const projectStats = ref(database, 'course-statistics/' + team.id + '/' + params.id + '/students/' + params.student_id)
      const fetchData = async () => {
        onValue(projectStats, async (snapshot) => {
          // get the course here
          let lessonIds: string[] = courseDetails?.data.lessons.map(((e: Lesson) => e.id))
          const result: RTDBStudent | null = snapshot.val()
          if (result) {
            let copy = { ...result }
            setStudent(copy)
            if (copy.lessons) {
              let l = copy.lessons
              let lessonsList = lessonIds.map((id) => l[id]).filter(e => e !== undefined)


              setLessons(lessonsList.map(e => e.title))
              setLessonDurations(lessonsList.map((lss) => {
                if (lss.blocks) {
                  return Object.values(lss.blocks).map((block) => block.duration > 300 ? 200 : block.duration).reduce((a, b) => a + b, 0)
                }
                return 0
              }))
              setBlockDurations(lessonsList.map((lss) => {
                if (lss.blocks) {
                  return Object.values(lss.blocks).map((block) => block.duration > 300 ? 200 : block.duration)
                }
                return []
              }))
              setBlocksShowOption(0)

              setRetakes(lessonsList.map((lss) => {
                if (lss.quizzes) {
                  return Object.values(lss.quizzes).map((block) => block.retakes)
                }
                return []
              }))
              let durations = lessonsList.map((lss) => {
                if (lss.quizzes) {
                  return Object.values(lss.quizzes).map((block) => block.duration)
                }
                return []
              })
              setQuizDurations(durations)
              setStudentAverage(durations.flatMap(e => e).reduce((acc, curr) => acc + curr, 0) / durations.flat().length)
              let scores = lessonsList.flatMap((lesson) => {
                if (lesson.quizzes) {
                  return Object.values(lesson.quizzes).map(e => e.score)
                }
                return []
              })
              setScores(scores)
            }
          }
        })
      }
      fetchData()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (team && params.id) {
        const projectStats = ref(database, 'course-statistics/' + team.id + '/' + params.id + '/students/' + params.student_id)
        off(projectStats)
      }
    }
  }, [team, params.id, params.student_id, courseDetails?.data])

  return (
    <Layout>
      <div className='w-full overflow-y-scroll bg-gray-50 max-h-full'>
        <div className={`flex-1 py-4 ${sidebarOpen ? 'px-5' : 'px-10'}`}>
          <div className='h-12 px-5 flex justify-end'>
            {student?.name}
          </div>
          <div className='grid md:grid-cols-2 gap-5 grid-cols-1'>

            <div className='chart pt-6'>
              <Chart
                options={{
                  title: {
                    text: "Average Lesson Duration"
                  },
                  subtitle: {
                    text: "Average time spent by this student going through each lesson"
                  },
                  dataLabels: {
                    enabled: false
                  },
                  chart: {
                    toolbar: {
                      show: false
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 5,
                      columnWidth: "10%",
                    }
                  },
                  legend: {
                    show: false
                  },
                  yaxis: {
                    labels: {
                      show: true
                    },
                    title: {
                      text: "Lessons"
                    }
                  },
                  xaxis: {
                    categories: lessonDurations.map((_, index) => `Lesson ${index + 1}`),
                    title: {
                      text: "Duration in seconds"
                    }
                  },
                }} series={[{
                  name: "Duration",
                  data: lessonDurations.map((e): number => Number(e.toFixed(2)))
                }]} type="bar" width={"100%"} height={340} />
            </div>
            <div>
              <div className='flex justify-end pl-5'>
                <div className="w-24">
                  <Select value={blocksShowOption} onChange={(e) => setBlocksShowOption(Number(e.target.value))} size={'xs'} placeholder='Select option'>
                    <option value={-1}>All</option>
                    {
                      lessonDurations.map((_, index) => <option key={`lesson_${index}`} value={index}>{`Lesson ${index + 1}`}</option>)
                    }
                  </Select>
                </div>
              </div>
              <div className='chart'>
                <Chart
                  options={{
                    title: {
                      text: "Section Duration"
                    },
                    subtitle: {
                      text: "Time spent by this student going through each block"
                    },
                    dataLabels: {
                      enabled: false
                    },
                    chart: {
                      toolbar: {
                        show: false
                      },
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 5,
                        columnWidth: "10%",
                        horizontal: true,
                      }
                    },
                    legend: {
                      show: false
                    },
                    yaxis: {
                      labels: {
                        show: true
                      },
                      title: {
                        text: "Sections"
                      }
                    },
                    xaxis: {
                      categories: blocksShowOption === -1 ? blockDurations.flatMap((item, index) => {
                        return item
                      }).map((_, index) => `Section ${index + 1}`) : blockDurations[blocksShowOption].map((_, index) => `Section ${index + 1}`),
                      title: {
                        text: "Duration in seconds"
                      }
                    },
                  }} series={[{
                    name: "Durations",
                    data: blocksShowOption === -1 ? blockDurations.flatMap((item, index) => {
                      return item.map((val, ind) => Number(val.toFixed(2)))
                    }) : blockDurations[blocksShowOption].map((val) => Number(val.toFixed(2)))
                  }]} type="bar" width={"100%"} height={320} />
              </div>
            </div>
            <div className='chart'>
              <Chart
                options={{
                  title: {
                    text: "Quiz scores"
                  },
                  subtitle: {
                    text: "All the quiz scores by this student"
                  },
                  dataLabels: {
                    enabled: false
                  },
                  chart: {
                    toolbar: {
                      show: false
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      borderRadius: 10
                    }
                  },
                  legend: {
                    show: false
                  },
                  yaxis: {
                    title: {
                      text: "Scores"
                    },
                    min: 0, max: 1, tickAmount: 1
                  },
                  xaxis: {
                    categories: scores.map((_, index) => `Quiz ${index + 1}`),
                    max: 100,
                    title: {
                      text: "Quizzes"
                    }
                  },
                }} series={[{
                  name: "Scores",
                  data: scores.map((d) => Number(d.toFixed(1)))
                }]} type="bar" width={"100%"} height={320} />
            </div>

            <div className='pt-2'>
              <div>
                <h1 className='text-lg font-medium'>MCQ stats</h1>
                <p className='text-sm mb-4'>Data collected for the multichoice question duration and retakes</p>
              </div>
              <div className='grid grid-cols-2'>
                <Chart
                  options={{
                    chart: {
                      toolbar: {
                        show: false
                      },
                    },
                    plotOptions: {
                      heatmap: {
                        shadeIntensity: 0.5, // Adjust the intensity of colors
                        colorScale: {
                          ranges: [{
                            from: 0,
                            to: 0,
                            name: 'Good',
                            color: '#05ac47' // Color for value 0
                          },
                          {
                            from: 1,
                            to: 1,
                            name: 'Medium',
                            color: '#ffff00' // Color for value 1
                          },
                          {
                            from: 2,
                            to: 2,
                            name: 'Very low',
                            color: '#ff0000' // Color for value 2
                          }]
                        }
                      }
                    },
                    xaxis: {
                      categories: new Array(quizCount).fill(0).map((_, index) => `Quiz ${index + 1}`),
                      max: 100,
                      title: {
                        text: "Retakes"
                      }
                    },
                  }}
                  series={retakes.map((item, index) => ({ name: `Lesson ${index + 1}`, data: item }))} type="heatmap" width={"100%"} height={320} />


                <Chart
                  options={{
                    chart: {
                      toolbar: {
                        show: false
                      },
                    },
                    dataLabels: {
                      style: {
                        colors: ['#000000'] // change the text color here, for example, black
                      }
                    },
                    plotOptions: {
                      heatmap: {
                        shadeIntensity: 0.5, // Adjust the intensity of colors
                        colorScale: {
                          ranges: [{
                            from: 0,
                            to: studentAverage - 4,
                            name: 'Good',
                            color: '#05ac47' // Color for value 0
                          },
                          {
                            from: studentAverage - 3,
                            to: studentAverage + 4,
                            name: 'Medium',
                            color: '#ffff00' // Color for value 1
                          },
                          {
                            from: studentAverage + 5,
                            to: Math.max(...quizDurations.flatMap(durations => durations)),
                            name: 'Very low',
                            color: '#ff0000' // Color for value 2
                          }]
                        }
                      }
                    },
                    xaxis: {
                      categories: new Array(quizCount).fill(0).map((_, index) => `Quiz ${index + 1}`),
                      max: 100,
                      title: {
                        text: "Quiz durations in seconds"
                      }
                    },
                  }}
                  series={quizDurations.map((item, index) => ({ name: `Lesson ${index + 1}`, data: item.map((e): number => Number(e.toFixed(2))) }))} type="heatmap" width={"100%"} height={320} />
              </div>
            </div>
          </div>

          <div className='grid gap-10 md:grid-cols-2 grid-cols-1'>
            <div className='bg-white min-h-96 rounded-lg'>
              <table className="w-full text-sm chart text-left rtl:text-right text-gray-500">
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Cumulative test score
                    </th>
                    <td className="px-6 py-4">
                      {student?.scores?.reduce((acc, curr) => acc + curr, 0) || '--'}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Total time spent
                    </th>
                    <td className="px-6 py-4">
                      {/* {student.completionDays + '' === 'N/A' ? student.completionDays : `${student.completionDays} day(s)`} &nbsp;or&nbsp;
                        {!student.hasOwnProperty('completionMinutes') ? 'N/A' : `${student.completionMinutes} minute(s)`} */}
                      {lessonDurations.length > 0 ? `${(lessonDurations.reduce((acc, curr) => acc + curr, 0) / 60).toFixed(1)} minutes` : '--'}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Total lessons
                    </th>
                    <td className="px-6 py-4">
                      {lessons.length}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex gap-2">
                      Completion speed
                      <InfoPopover message='This refers to how much progress this user makes per minute' />
                    </th>
                    <td className="px-6 py-4">
                      {/* {student.completionSpeed} */}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Completed
                    </th>
                    <td className="px-6 py-4">
                      {student?.completed ? 'Yes' : 'No'}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Dropped out?
                    </th>
                    <td className="px-6 py-4">
                      {student?.droppedOut ? "Yes" : "No"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='bg-white min-h-96 rounded-lg p-4'>
              <div className='font-semibold text-xl'>Lessons completed</div>
              <div className='mt-3 flex flex-col gap-2'>
                {lessons.map((e, index) => <div className='min-h-8 px-5 flex items-center border rounded-md' key={`lesson_finished_${index}`}>{e}</div>)}
              </div>
            </div>

            {courseDetails && courseDetails.data && <div className='bg-white min-h-96 rounded-lg p-4'>
              <div className='font-semibold text-xl'>Assessments completed</div>
              <div className='flex flex-col gap-0 py-3'>
                <div className='flex w-full mb-1 items-center font-semibold justify-between px-3 py-2'>
                  <div>
                    Assessment title
                  </div>
                  <div>
                    Assessment score
                  </div>
                </div>
                {studentAssessment?.assessments.map((record) => {
                  let assessment = courseDetails.data.contents.find(e => e.assessment && typeof e.assessment !== "string" && e.assessment._id === record.assessmentId)
                  if (assessment && assessment.assessment && typeof assessment.assessment !== "string") {
                    let ast = assessment.assessment
                    return <div className='flex w-full mb-1 items-center justify-between px-3 py-2'>
                      <div>
                        {ast.title}
                      </div>
                      <div>
                        {record.score}/{ast.questions.length}
                      </div>
                    </div>
                  }
                  return <>

                  </>
                })}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}
