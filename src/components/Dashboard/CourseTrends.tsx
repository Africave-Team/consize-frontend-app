import { Input, MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import { FiBarChart } from 'react-icons/fi'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { TrendItem, TrendStatisticsBody } from '@/type-definitions/secure.courses'
import moment, { Moment } from 'moment'

const fields: {
  description: string,
  title: string,
  field: keyof TrendStatisticsBody
}[] = [
    { description: 'Total number of students who registered on the course', field: "enrolled", title: "Enrolled students" },
    { description: 'No. of users who are still in between the course', field: "active", title: "Active students" },
    { description: 'No. of users who have completed the course', field: "completed", title: "Completed students" },
    { description: 'No. of users who have dropped out of this course', field: "dropoutRate", title: "Rate that students drop out" },
    { description: 'The scores achieved for all the quizzes in the course, averaged over all enrolled students', field: "averageTestScore", title: "Avg. test score" },
    { description: 'Time taken to complete the course averaged over all enrolled students', field: "averageCompletionMinutes", title: "Avg. completion time" },
    { description: 'The extent of course completed by student averaged over all enrolled students', field: "averageCourseProgress", title: "Avg. course progress" },
    { description: 'The percentage of quiz questions that the students got wrong in the first attempt and then took another attempt', field: "averageMcqRetakeRate", title: "Avg. MCQ retake rates" },
    { description: 'Time taken to complete a lesson, averaged over all enrolled users', field: "averageLessonDurationMinutes", title: "Avg. lesson duration" },
    { description: 'Avg. Time taken to complete a section in the course, averaged over all users', field: "averageBlockDurationMinutes", title: "Avg. section duration" },
  ]

export default function CourseTrends ({ courseId }: { courseId: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [trends, setTrends] = useState<TrendStatisticsBody>({
    active: {
      trends: [

      ],
      current: 0,
    },
    completed: {
      trends: [

      ],
      current: 0,
    },
    enrolled: {
      trends: [

      ],
      current: 0,
    },
    dropoutRate: {
      trends: [

      ],
      current: 0,
    },
    averageTestScore: {
      trends: [

      ],
      current: 0,
    },
    averageMcqRetakeRate: {
      trends: [

      ],
      current: 0,
    },
    averageBlockDurationMinutes: {
      trends: [

      ],
      current: 100,
    },
    averageCompletionMinutes: {
      trends: [

      ],
      current: 0,
    },
    averageCourseProgress: {
      trends: [

      ],
      current: 0,
    },
    averageLessonDurationMinutes: {
      trends: [

      ],
      current: 0,
    },
  })

  const [viewingTrends, setViewingTrends] = useState<TrendStatisticsBody>({
    active: {
      trends: [

      ],
      current: 0,
    },
    completed: {
      trends: [

      ],
      current: 0,
    },
    enrolled: {
      trends: [

      ],
      current: 0,
    },
    dropoutRate: {
      trends: [

      ],
      current: 0,
    },
    averageTestScore: {
      trends: [

      ],
      current: 0,
    },
    averageMcqRetakeRate: {
      trends: [

      ],
      current: 0,
    },
    averageBlockDurationMinutes: {
      trends: [

      ],
      current: 100,
    },
    averageCompletionMinutes: {
      trends: [

      ],
      current: 0,
    },
    averageCourseProgress: {
      trends: [

      ],
      current: 0,
    },
    averageLessonDurationMinutes: {
      trends: [

      ],
      current: 0,
    },
  })
  const [optionSelected, setOptionSelected] = useState("-1")
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  let app: any
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
  const database = getDatabase(app)
  const trendsDbRef = ref(database, 'course-trends/' + courseId)

  const options = [
    {
      value: "-1", label: "All"
    },
    {
      value: "1", label: "Last 1 day"
    },
    {
      value: "5", label: "Last 5 days"
    },
    {
      value: "10", label: "Last 10 days"
    },
    {
      value: "20", label: "Last 20 days"
    },
    {
      value: "31", label: "Last month"
    },
    {
      value: "custom", label: "Custom date range"
    }
  ]

  const fetchTrends = async function () {
    onValue(trendsDbRef, async (snapshot) => {
      const result: TrendStatisticsBody | null = snapshot.val()
      if (result) {
        setTrends(result)
      }
    })
  }

  const openHandler = async () => {
    await fetchTrends()
    onOpen()
  }


  return (

    <>
      <MenuItem onClick={openHandler} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiBarChart className='text-sm' />}>Trends</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'4xl'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='min-h-52 max-h-[450px] overflow-hidden py-0'>
          <ModalBody className='h-full px-2'>
            <div className='font-semibold text-lg mb-2'>Course trends chart</div>
            <div className='flex w-full'>
              <div className='w-1/4 p-3'>
                <div className="w-full">
                  <div>Filter</div>
                  <Select size={'sm'} value={optionSelected} onChange={(e) => setOptionSelected(e.target.value)} placeholder='Select period'>
                    {
                      options.map((lesson) => <option key={lesson.label} value={lesson.value}>{lesson.label}</option>)
                    }
                  </Select>
                </div>
                {optionSelected === "custom" && <div className='w-full mt-3'>
                  <div>Start date</div>
                  <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type='date' />

                  <div className='mt-3'>End date</div>
                  <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type='date' />
                </div>}
              </div>
              <div className='flex-1 overflow-y-scroll min-h-52 max-h-[450px] p-3'>
                <div className='flex flex-col gap-5'>
                  {fields.map((e) => {
                    let selected: TrendItem | null = trends[e.field]
                    let start: Moment, end: Moment
                    switch (optionSelected) {
                      case "-1":
                        selected = trends[e.field]
                        break
                      case "1":
                        start = moment().subtract(1, "day")
                        selected = {
                          ...trends[e.field],
                          trends: trends[e.field].trends.filter(e => moment(e.date).isSame(start))
                        }
                        break
                      case "5":
                        start = moment().subtract(5, "day")
                        end = moment()
                        selected = {
                          ...trends[e.field],
                          trends: trends[e.field].trends.filter(e => moment(e.date).isSameOrAfter(start) && moment(e.date).isSameOrBefore(end))
                        }
                        break
                      case "10":
                        start = moment().subtract(10, "day")
                        end = moment()
                        selected = {
                          ...trends[e.field],
                          trends: trends[e.field].trends.filter(e => moment(e.date).isSameOrAfter(start) && moment(e.date).isSameOrBefore(end))
                        }
                        break
                      case "20":
                        start = moment().subtract(20, "day")
                        end = moment()
                        selected = {
                          ...trends[e.field],
                          trends: trends[e.field].trends.filter(e => moment(e.date).isSameOrAfter(start) && moment(e.date).isSameOrBefore(end))
                        }
                        break
                      case "31":
                        start = moment().subtract(31, "day")
                        end = moment()
                        selected = {
                          ...trends[e.field],
                          trends: trends[e.field].trends.filter(e => moment(e.date).isSameOrAfter(start) && moment(e.date).isSameOrBefore(end))
                        }
                        break
                      case "custom":
                        if (startDate && endDate) {
                          start = moment(startDate)
                          end = moment(endDate)
                          selected = {
                            ...trends[e.field],
                            trends: trends[e.field].trends.filter((e) => {
                              return moment(e.date, 'DD/MM/YYYY').isSameOrAfter(start) && moment(e.date, 'DD/MM/YYYY').isSameOrBefore(end)
                            })
                          }
                        }
                        break
                      default:
                        break
                    }
                    return (<div className='h-72 w-full rounded-md border p-3'>
                      {e.title}
                      {selected && selected.trends.length > 0 && <Chart
                        options={{
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
                              borderRadius: 5,
                              columnWidth: "10%",
                            }
                          },
                          legend: {
                            show: false
                          },
                          yaxis: {
                            labels: {
                              show: true,
                              formatter: function (value) {
                                // Format the y-axis labels to display with a specific number of decimal places
                                return value.toFixed(1) // Adjust the number inside to set the desired decimal places
                              },
                            },
                          },
                          xaxis: {
                            categories: selected.trends.map((e) => e.date),
                            title: {
                              text: "Dates"
                            },
                            labels: {
                              show: false
                            }
                          },
                        }} series={[{
                          name: "Value",
                          data: selected.trends.map(e => e.value)
                        }]} type="area" width={"100%"} height={200} />}

                      {!selected || selected.trends.length === 0 && <div className='h-[200px] w-full flex justify-center items-center'>
                        No trends data available.
                      </div>}
                    </div>)
                  })}
                </div>
                <div className='h-20'></div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
