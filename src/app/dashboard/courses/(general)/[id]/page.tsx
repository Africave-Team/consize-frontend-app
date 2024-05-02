"use client"

import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'
import { useNavigationStore } from '@/store/navigation.store'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import { Course, CourseStatistics, RTDBStudent, TrendStatisticsBody } from '@/type-definitions/secure.courses'
import StatsCard from '@/components/Dashboard/StatsCard'
import SearchStudents from '@/components/Dashboard/SearchStudents'
import StudentsTable from '@/components/Dashboard/StudentsTable'
import InvitationLink from '@/components/Dashboard/InvitationLink'
import ExportStudents from '@/components/Dashboard/ExportStudents'
import Leaderboard from '@/components/Dashboard/Leaderboard'
import CourseContents from '@/components/Dashboard/ViewCourseContents'
import StudentReviews from '@/components/Dashboard/StudentReviews'
import CourseTrends from '@/components/Dashboard/CourseTrends'
import ExportStats from '@/components/Dashboard/ExportStats'
import OpenSettings from '@/components/Dashboard/OpenSettings'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { useQuery } from '@tanstack/react-query'

const fields = [
  { description: 'Total number of students who registered on the course', unit: "", field: "enrolled", title: "Enrolled students" },
  { description: 'No. of users who are still in between the course', unit: "", field: "active", title: "Active students" },
  { description: 'No. of users who have completed the course', unit: "", field: "completed", title: "Completed students" },
  { description: 'No. of users who have dropped out of this course', unit: "", field: "dropouts", title: "Students dropped out" },
  { description: 'The scores achieved for all the quizzes in the course, averaged over all enrolled students', unit: "", field: "averageTestScore", title: "Avg. test score" },
  { description: 'Time taken to complete the course averaged over all enrolled students', unit: "minutes", field: "averageCompletionMinutes", title: "Avg. completion time" },
  { description: 'The extent of course completed by student averaged over all enrolled students', unit: "%", field: "averageCourseProgress", title: "Avg. course progress" },
  { description: 'The percentage of quiz questions that the students got wrong in the first attempt and then took another attempt', unit: "%", field: "averageMcqRetakeRate", title: "Avg. MCQ retake rates" },
  { description: 'Time taken to complete a lesson, averaged over all enrolled users', unit: "minutes", field: "averageLessonDurationMinutes", title: "Avg. lesson duration" },
  { description: 'Avg. Time taken to complete a section in the course, averaged over all users', unit: "minutes", field: "averageBlockDurationMinutes", title: "Avg. section duration" },
]

interface ApiResponse {
  data: Course
  message: string
}

export default function page ({ params }: { params: { id: string } }) {
  const { sidebarOpen } = useNavigationStore()
  const { setPageTitle } = useNavigationStore()
  const [students, setStudents] = useState<RTDBStudent[]>([])
  const [stats, setStats] = useState<CourseStatistics>({
    enrolled: 0,
    active: 0,
    averageCompletionPercentage: 0,
    dropouts: 0,
    completed: 0,
    averageTestScore: '0',
    averageCompletionDays: 0,
    averageCompletionMinutes: 0,
    averageCourseDurationSeconds: 0,
    dropoutRate: 0,
    averageCourseProgress: 0,
    averageMcqRetakeRate: 0,
    averageLessonDurationMinutes: 0,
    averageBlockDurationMinutes: 0,
    averageBlockDurationSeconds: 0,
    students: {}
  })

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

  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

  const { team } = useAuthStore()

  useEffect(() => {
    setPageTitle("Dashboard - Courses")
  }, [])

  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    const database = getDatabase(app)

    if (team) {
      const projectStats = ref(database, 'course-statistics/' + team.id + '/' + params.id)
      const fetchData = async () => {
        onValue(projectStats, async (snapshot) => {
          const result: CourseStatistics | null = snapshot.val()
          if (result) {
            let copy = { ...result }
            if (result.students) {
              const students = Object.entries(result.students).map(([key, value]) => ({ ...value, id: key, progress: value.progress ? value.progress : 0 })).filter(e => e.lessons)
              setStudents(students)
              const scores = students.reduce((acc, curr) => {
                if (curr.scores && curr.scores.length > 0) {
                  let total = curr.scores.reduce((a, b) => a + b, 0)
                  return acc + total
                } else {
                  return acc
                }
              }, 0)
              copy.enrolled = students.length
              copy.active = students.filter(e => !e.completed && !e.droppedOut).length
              copy.dropoutRate = (students.filter(e => e.droppedOut).length / copy.enrolled) * 100
              copy.completed = students.filter(e => e.completed).length
              copy.averageTestScore = ((scores) / students.length).toFixed(2)

              copy.averageCourseProgress = students.reduce((acc, curr) => {
                if (curr.progress) {
                  return acc + curr.progress
                } else {
                  return acc
                }
              }, 0) / students.length

              copy.averageCompletionMinutes = students.reduce((acc, curr) => {
                if (curr.lessons) {
                  const lessons = Object.values(curr.lessons)
                  if (lessons.length === 0) {
                    return acc
                  } else {
                    let total = lessons.reduce((a, b) => a + b.duration, 0)
                    return acc + (total / 60)
                  }
                } else {
                  return acc
                }
              }, 0) / students.length

              let quizCount = 0
              let retakes = students.reduce((acc, curr) => {
                if (curr.lessons) {
                  const lessons = Object.values(curr.lessons)
                  if (lessons.length === 0) {
                    return acc
                  } else {
                    let total = lessons.map(e => {
                      if (e.quizzes) {
                        const quizzes = Object.values(e.quizzes)
                        quizCount += quizzes.length
                        return quizzes.reduce((acc, curr) => acc + curr.retakes, 0) / quizzes.length
                      }
                      return 0
                    }).reduce((a, b) => a + b, 0)
                    return acc + (total)
                  }
                } else {
                  return acc
                }
              }, 0)
              copy.averageMcqRetakeRate = retakes / quizCount

              let lessonCount = 0
              let lessonDuration = students.reduce((acc, curr) => {
                if (curr.lessons) {
                  const lessons = Object.values(curr.lessons)
                  if (lessons.length === 0) {
                    return acc
                  } else {
                    lessonCount += lessons.length
                    let total = lessons.map(e => {
                      return e.duration / 60
                    }).reduce((a, b) => a + b, 0)
                    return acc + total
                  }
                } else {
                  return acc
                }
              }, 0)

              copy.averageLessonDurationMinutes = lessonDuration / lessonCount

              let blockCount = 0
              let blockDuration = students.reduce((acc, curr) => {
                if (curr.lessons) {
                  const lessons = Object.values(curr.lessons)
                  if (lessons.length === 0) {
                    return acc
                  } else {
                    let total = lessons.map(e => {
                      if (e.blocks) {
                        const blocks = Object.values(e.blocks)
                        blockCount += blocks.length
                        return blocks.reduce((acc, curr) => acc + curr.duration / 60, 0)
                      }
                      return 0
                    }).reduce((a, b) => a + b, 0)
                    return acc + (total)
                  }
                } else {
                  return acc
                }
              }, 0)
              copy.averageBlockDurationMinutes = blockDuration / blockCount

            }
            setStats(copy)
          }
        })
      }
      fetchData()
    }

    const trendsDbRef = ref(database, 'course-trends/' + params.id)
    const fetchTrends = function () {
      onValue(trendsDbRef, async (snapshot) => {
        const result: TrendStatisticsBody | null = snapshot.val()
        if (result) {
          setTrends(result)
        }
      })
    }
    fetchTrends()


    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (team && params.id) {
        const projectStats = ref(database, 'course-statistics/' + team.id + '/' + params.id)
        const trendsDbRef = ref(database, 'course-trends/' + params.id)
        off(trendsDbRef)
        off(projectStats)
      }
    }
  }, [team, params.id])

  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 py-4'>
          <div className='h-12 px-5 mb-4 flex justify-between items-center'>
            <div className='text-xl font-bold line-clamp-1'>{courseDetails?.data.title}</div>
            <div className='flex items-center gap-4'>
              {courseDetails && courseDetails.data && <InvitationLink course={courseDetails.data} />}
              <Menu>
                <MenuButton type='button' className='bg-gray-100 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center'>
                  <img src="/dots.svg" />
                </MenuButton>
                <MenuList className='text-sm py-0' minWidth={'200px'}>
                  <Leaderboard students={students} />
                  <CourseContents courseId={params.id} />
                  <StudentReviews />
                  <CourseTrends />
                  <ExportStats courseId={params.id} stats={stats} fields={fields} />
                  <OpenSettings dark={true} id={params.id} />
                </MenuList>
              </Menu>
            </div>
          </div>
          <div className={`px-4 w-full grid grid-cols-3 gap-3 ${sidebarOpen ? 'md:grid-cols-5' : 'md:grid-cols-6'}`} >
            {/* @ts-ignore */}
            {fields.map(({ field, title, description, unit }) => (<StatsCard description={description} latestTrend={{ value: trends[field] ? trends[field].current : 0, date: "" }} title={title} trends={trends[field] ? trends[field].trends : []} unit={unit} value={unit !== "" ? (stats[field] || 0).toFixed(1) : stats[field] || 0} key={field} />))}
          </div>

          <div className='px-4'>
            <div className='bg-white mt-5 min-h-[500px] rounded-md w-full shadow-sm border p-4'>
              <div className='flex justify-end items-center gap-4'>
                <div className='w-72'>
                  <SearchStudents courseId={params.id} students={students} />
                </div>

                <ExportStudents courseId={params.id} students={students} />
              </div>
              <div className='w-full mt-2'>
                <StudentsTable students={students} courseId={params.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}