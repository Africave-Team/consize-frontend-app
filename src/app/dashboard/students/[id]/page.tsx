"use client"
import Layout from '@/layouts/PageTransition'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { CourseStatistics } from '@/type-definitions/secure.courses'
import StatsCard from '@/components/Dashboard/StatsCard'
import { useNavigationStore } from '@/store/navigation.store'
import StudentCourseCard from '@/components/Dashboard/StudentCourseCard'
import { ListStyle } from '@/type-definitions/navigation'
import { CiGrid2H, CiGrid41 } from 'react-icons/ci'


const fields = [
  { description: 'Total number of courses this learner is enrolled in', unit: "", field: "enrolled", title: "Enrolled courses" },
  { description: 'No. of courses this learner has ongoing', unit: "", field: "active", title: "Active courses" },
  { description: 'No. of courses this learner has completed', unit: "", field: "completed", title: "Completed courses" },
  { description: 'No. of courses this user has dropped out of', unit: "", field: "dropouts", title: "Courses dropped out" },
  { description: 'The scores achieved for all the quizzes this learner has attempted, averaged over all enrolled courses', unit: "", field: "averageTestScore", title: "Avg. test score" },
]

export default function SingleStudentPage ({ params }: { params: { id: string } }) {
  const { sidebarOpen } = useNavigationStore()
  const { preferredListStyle, toggleListStyle } = useNavigationStore()
  const [courses, setCourses] = useState<string[]>([])
  const [stats, setStats] = useState<any>({
    enrolled: 0,
    active: 0,
    dropouts: 0,
    completed: 0,
    averageTestScore: '0',
  })
  const { team } = useAuthStore()
  useEffect(() => {
    let app: any
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }
    const database = getDatabase(app)

    if (team) {
      const projectStats = ref(database, 'course-statistics/' + team.id)
      const fetchData = async () => {
        onValue(projectStats, async (snapshot) => {
          const result: { [courseId: string]: CourseStatistics } | null = snapshot.val()
          if (result) {
            let copy = { ...result }
            const published = Object.entries(copy).map(([courseId, rest]) => ({ courseId, ...rest })).filter(e => e.students)
            let totalEnrolled = published.filter(e => e.students[params.id])
            let active = 0, dropouts = 0, completed = 0, scores = 0, scoresCount = 0
            let courses = []
            for (let course of published) {
              let record = course.students[params.id]
              if (record) {
                if (record.droppedOut) {
                  dropouts += 1
                } else {
                  active += 1
                }
                if (record.completed) {
                  completed += 1
                }
                if (record.scores) {
                  for (let score of record.scores) {
                    scores += score
                    scoresCount += 1
                  }
                }
              }

              courses.push(course.courseId)
            }
            setCourses(courses)
            setStats({
              enrolled: totalEnrolled.length,
              active,
              dropouts,
              completed,
              averageTestScore: ((scores / scoresCount) * 100).toFixed(1) + '%',
            })
          }
        })
      }
      fetchData()
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (team) {
        const projectStats = ref(database, 'course-statistics/' + team.id)
        off(projectStats)
      }
    }
  }, [team, params.id])
  return (
    <Layout>
      <div className='h-full py-4 w-full overflow-y-scroll  max-h-full'>
        <div className='flex items-center flex-wrap gap-x-4 gap-y-2'>
          <div className={`px-4 w-full grid grid-cols-4 gap-3 ${sidebarOpen ? 'md:grid-cols-5' : 'md:grid-cols-5'}`} >
            {/* @ts-ignore */}
            {fields.map(({ field, title, description, unit }) => (<StatsCard latestTrend={{ value: 0, date: '' }} trends={[]} description={description} title={title} unit={unit} value={unit !== "" ? (stats[field] || 0).toFixed(1) : stats[field] || 0} key={field} />))}
          </div>
        </div>
        <div className='px-4 py-10'>
          <div className='flex h-10 mb-3 justify-end'>
            <button onClick={toggleListStyle} className='h-10 w-10 border rounded-md group hover:bg-black flex justify-center items-center'>
              {preferredListStyle !== ListStyle.ROWS && <CiGrid2H className='text-2xl group-hover:text-white' />}
              {preferredListStyle !== ListStyle.GRID && <CiGrid41 className='text-2xl group-hover:text-white' />}
              {/* <CiGrid41 className='text-2xl' /> */}
            </button>
          </div>
          <div className={preferredListStyle === ListStyle.GRID ? `w-full grid grid-cols-3 gap-3` : `w-full grid grid-cols-1 gap-3`}>
            {courses.map(e => (<StudentCourseCard studentId={params.id} courseId={e} />))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
