"use client"

import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'
import { useNavigationStore } from '@/store/navigation.store'
import { Menu, MenuButton, MenuItem, MenuList, Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import { RTDBStudent } from '@/type-definitions/secure.courses'
import dynamic from 'next/dynamic'
import InfoPopover from '@/components/Dashboard/InfoPopover'
const Chart = dynamic(async () => await import('react-apexcharts'), { ssr: false })

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

  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    const database = getDatabase(app)

    if (team) {
      const projectStats = ref(database, 'course-statistics/' + team.id + '/' + params.id + '/students/' + params.student_id)
      const fetchData = async () => {
        onValue(projectStats, async (snapshot) => {
          const result: RTDBStudent | null = snapshot.val()
          if (result) {
            let copy = { ...result }
            setStudent(copy)
            if (copy.lessons) {
              setLessons(Object.values(copy.lessons).map(e => e.title))
              setLessonDurations(Object.values(copy.lessons).map((lss) => lss.duration).reverse())
              setBlockDurations(Object.values(copy.lessons).map((lss) => {
                if (lss.blocks) {
                  return Object.values(lss.blocks).map((block) => block.duration)
                }
                return []
              }).reverse())

              setRetakes(Object.values(copy.lessons).map((lss) => {
                if (lss.quizzes) {
                  return Object.values(lss.quizzes).map((block) => block.retakes)
                }
                return []
              }).reverse())
              let durations = Object.values(copy.lessons).map((lss) => {
                if (lss.quizzes) {
                  return Object.values(lss.quizzes).map((block) => block.duration)
                }
                return []
              })
              setQuizDurations(durations.reverse())
              setStudentAverage(durations.flatMap(e => e).reduce((acc, curr) => acc + curr, 0) / durations.flat().length)
            }
            if (copy.scores) {
              setScores(copy.scores)
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
  }, [team, params.id, params.student_id])

  return (
    <Layout>
      <div className='w-full overflow-y-scroll bg-gray-50 max-h-full'>
        <div className={`flex-1 py-4 ${sidebarOpen ? 'px-5' : 'px-10'}`}>
          <div className='h-12 px-5 flex justify-end'>
            {/* <Menu>
              <MenuButton type='button' className='bg-gray-100 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center'>
                <img src="/dots.svg" />
              </MenuButton>
              <MenuList className='text-sm py-0' minWidth={'200px'}>
                <Leaderboard students={students} />
                <CourseContents courseId={params.id} />
                <StudentReviews />
                <CourseTrends />
                <ExportStats courseId={params.id} stats={stats} fields={fields} />
                <OpenSettings />
              </MenuList>
            </Menu> */}
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
                      text: "Duration in minutes"
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
                        text: "Duration in minutes"
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
                        text: "Quiz durations in minutes"
                      }
                    },
                  }}
                  series={quizDurations.map((item, index) => ({ name: `Lesson ${index + 1}`, data: item.map((e): number => Number(e.toFixed(2))) }))} type="heatmap" width={"100%"} height={320} />
              </div>
              {/* {student.mcqStats ? <div className="grid grid-cols-2 chart gap-2">
              <div className='h-[250px] border py-1 px-1'>
                <div className='flex mb-2 justify-start text-xs font-semibold'>
                  Retakes
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center text-xs gap-1'>
                    <div className='h-3 w-3 rounded bg-[#05ac47]'></div>
                    Good
                  </div>
                  <div className='flex items-center text-xs gap-1'>
                    <div className='h-3 w-3 rounded bg-[#ffff00]'></div>
                    Medium
                  </div>
                  <div className='flex items-center text-xs gap-1'>
                    <div className='h-3 w-3 rounded bg-[#ff0000]'></div>
                    Low
                  </div>
                </div>

                <div className="w-full h-[145px] mt-3 flex justify-between">
                  <div className='w-2/12 h-full flex'>
                    <div className='h-full w-5'>
                      <span className='text-xs [writing-mode:vertical-lr] mt-10 font-semibold'>Questions</span>
                    </div>
                    <div className='flex flex-col h-full text-xs justify-end gap-1 ml-3 pb-1'>
                      {Array(Object.keys(student.mcqStats).length).fill(0).map((_: any, i) => (<div key={i} className="pr-3 h-[19px]">Q{Object.keys(student.mcqStats).length - i}</div>))}
                    </div>
                  </div>
                  <div className='w-10/12 border-l border-b flex justify-end flex-col'>
                    <div className='flex'>
                      {Object.entries(student.mcqStats).map(([key, value], i) => {
                        return <div key={key} className='flex flex-col justify-end text-xs'>
                          {value.filter(e => e.correctResponse).map(({ numRepeats }, kl) => {
                            return <div key={kl} className={`h-6 flex justify-center items-center w-7 border ${numRepeats < 1 ? 'bg-[#05ac47]' : numRepeats < 2 ? 'bg-[#ffff00]' : 'bg-[#ff0000]'}`}>{numRepeats}</div>
                          })}
                        </div>
                      })}
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className="w-2/12"></div>
                  <div className='w-10/12 px-2 text-xs flex'>
                    {Object.keys(student.mcqStats).map((_: any, i) => (<div key={i} className="pr-3 w-7">L{i + 1}</div>))}
                  </div>
                </div>
                <div className='flex justify-center text-xs font-semibold'>
                  Lessons
                </div>
              </div>
              <div className='h-[250px] border py-1 px-1'>
                <div className='flex justify-start mb-2 text-xs font-semibold'>
                  Duration
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center text-xs gap-1 text-[8px] flex-col'>
                    <div className='h-3 w-3 rounded bg-[#05ac47]'></div>
                    Good (0-{studentAverage - 4})
                  </div>
                  <div className='flex items-center text-xs gap-1 text-[8px] flex-col'>
                    <div className='h-3 w-3 rounded bg-[#ffff00]'></div>
                    Medium ({studentAverage - 3}-{studentAverage + 4})
                  </div>
                  <div className='flex items-center text-[8px] flex-col gap-1'>
                    <div className='h-3 w-3 rounded bg-[#ff0000]'></div>
                    Low ({studentAverage + 5}-above)
                  </div>
                </div>
                <div className="w-full h-[145px] mt-3 flex justify-between">
                  <div className='w-2/12 h-full flex'>
                    <div className='h-full w-5'>
                      <span className='text-xs [writing-mode:vertical-lr] mt-10 font-semibold'>Questions</span>
                    </div>
                    <div className='flex flex-col h-full text-xs justify-end gap-1 ml-3 pb-1'>
                      {Array(Object.keys(student.mcqStats).length).fill(0).map((_: any, i) => (<div key={i} className="pr-3 h-[19px]">Q{Object.keys(student.mcqStats).length - i}</div>))}
                    </div>
                  </div>
                  <div className='w-10/12 border-l border-b flex justify-end flex-col'>
                    <div className='flex'>
                      {Object.entries(student.mcqStats).map(([key, value], i) => {
                        return <div key={key} className='flex flex-col justify-end text-xs'>
                          {value.filter(e => e.correctResponse).map(({ mcqDurationSeconds }, lp) => {
                            return <div key={lp + "fg"} className={`h-6 flex justify-center items-center w-7 border ${(mcqDurationSeconds ? mcqDurationSeconds : 0) < (studentAverage - 4) ? 'bg-[#05ac47]' : (mcqDurationSeconds ? mcqDurationSeconds : 0) < (studentAverage + 4) ? 'bg-[#ffff00]' : 'bg-[#ff0000]'}`}>{Math.ceil((mcqDurationSeconds ? mcqDurationSeconds : 0))}</div>
                          })}
                        </div>
                      })}
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className="w-2/12"></div>
                  <div className='w-10/12 px-2 text-xs flex'>
                    {Object.keys(student.mcqStats).map((_: any, i) => (<div key={i} className="pr-3 w-7">L{i + 1}</div>))}
                  </div>
                </div>
                <div className='flex justify-center text-xs font-semibold'>
                  Lessons
                </div>
              </div>
            </div> : <div className='h-[250px] border py-1 px-1'>No data available yet.</div>} */}
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
                      {student?.scores?.reduce((acc, curr) => acc + curr, 0)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-100">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      Cumulative completion time
                    </th>
                    <td className="px-6 py-4">
                      {/* {student.completionDays + '' === 'N/A' ? student.completionDays : `${student.completionDays} day(s)`} &nbsp;or&nbsp;
                        {!student.hasOwnProperty('completionMinutes') ? 'N/A' : `${student.completionMinutes} minute(s)`} */}
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
          </div>


          {/* <div className="flex justify-start md:flex-row flex-col gap-5 mt-5">
            <div className='md:w-1/2 w-full'>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm chart text-left rtl:text-right text-gray-500">
                  <tbody>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Last activity
                      </th>
                      <td className="px-6 py-4">
                        {moment(student.lastActive).format('Do MMM YYYY @ hh:mma')}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Cumulative test score
                      </th>
                      <td className="px-6 py-4">
                        {student.performance}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Cumulative completion time
                      </th>
                      <td className="px-6 py-4">
                        {student.completionDays + '' === 'N/A' ? student.completionDays : `${student.completionDays} day(s)`} &nbsp;or&nbsp;
                        {!student.hasOwnProperty('completionMinutes') ? 'N/A' : `${student.completionMinutes} minute(s)`}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Total lessons
                      </th>
                      <td className="px-6 py-4">
                        {Object.entries(student.lessonPerformance).length}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex gap-2">
                        Completion speed
                        <InfoPopover message='This refers to how much progress this user makes per minute' />
                      </th>
                      <td className="px-6 py-4">
                        {student.completionSpeed}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Completed
                      </th>
                      <td className="px-6 py-4">
                        {student.completed ? 'Yes' : 'No'}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Dropped out?
                      </th>
                      <td className="px-6 py-4">
                        {student.droppedOut ? "Yes" : "No"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='chart'>
                {student.dialogScores && student.dialogScores.length > 0 && <div className='flex justify-start mt-5'>
                  <div className='bg-white p-5 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-600'>Assessment results</h1>
                    <div className='mt-3 flex flex-col gap-1'>
                      {student.dialogScores.map((entry) => {
                        return <div key={entry.name} className='flex flex-col'>
                          <div className='text-base font-semibold uppercase'>{entry.name.replaceAll('_', ' ')}</div>
                          <div className='text-sm'>{entry.score}</div>
                        </div>
                      })}

                    </div>
                  </div>
                </div>}
                {feedback && <div className='flex justify-start mt-5'>
                  <div className='bg-white p-5 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-600'>Learner&apos;s feedback</h1>
                    <div className='mt-3'>




                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, index) => {
                          return <svg key={`rate_${index}`} className={`w-4 h-4 ${Math.floor(feedback.courseRating) >= index + 1 ? 'text-yellow-500' : 'text-gray-400'} me-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        })}
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{feedback.courseRating}</p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                      </div>


                      {Object.entries(feedback.surveyResponses).map(([key, value]) => {
                        return <div key={key} className='p-3 flex flex-col'>
                          <div className='text-sm font-medium'>{key}</div>
                          <div className='text-xs'>{value}</div>
                        </div>
                      })}

                    </div>
                  </div>
                </div>}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  )
}
