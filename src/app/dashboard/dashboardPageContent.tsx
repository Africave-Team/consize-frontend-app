"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import { CourseStatistics } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import { useAuthStore } from '@/store/auth.store'

interface TeamStatistics {
  totalCourses: number
  enrollments: number
  active: number
  completed: number
}

export default function DashboardPage () {
  const [stats, setStats] = useState<TeamStatistics>({
    totalCourses: 0,
    active: 0,
    completed: 0,
    enrollments: 0
  })
  const { team } = useAuthStore()
  const { setPageTitle } = useNavigationStore()
  useEffect(() => {
    setPageTitle("Dashboard - Home")
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
      const projectStats = ref(database, 'course-statistics/' + team.id)
      const fetchData = async () => {
        onValue(projectStats, async (snapshot) => {
          const data: { [key: string]: CourseStatistics } = snapshot.val()
          const result: CourseStatistics[] = Object.values(data)
          console.log(result)
          let copy = {
            totalCourses: result.length,
            active: 0,
            completed: 0,
            enrollments: 0
          }
          for (let ite of result) {
            copy.active += ite.active
            copy.completed += ite.completed
            copy.enrollments += ite.enrolled
          }
          setStats(copy)
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
  }, [team])
  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full'>
        <div className='w-full'>
          <div className='grid md:grid-cols-4 grid-cols-2'>
            <div className='h-20 p-4 border'>{stats.totalCourses}
              <div className='font-semibold text-sm'>Courses</div>
            </div>
            <div className='h-20 p-4 border'>{stats.enrollments}
              <div className='font-semibold text-sm'>Total enrollments</div>
            </div>
            <div className='h-20 p-4 border'>{stats.active}
              <div className='font-semibold text-sm'>Active students</div>
            </div>
            <div className='h-20 p-4 border'>{stats.completed}
              <div className='font-semibold text-sm'>Completed students</div>
            </div>
            <div className='h-20 p-4 border'>{stats.totalCourses}
              <div className='font-semibold text-sm'>Courses</div>
            </div>
            <div className='h-20 p-4 border'>{stats.enrollments}
              <div className='font-semibold text-sm'>Total enrollments</div>
            </div>
            <div className='h-20 p-4 border'>{stats.active}
              <div className='font-semibold text-sm'>Active students</div>
            </div>
            <div className='h-20 p-4 border'>{stats.completed}
              <div className='font-semibold text-sm'>Completed students</div>
            </div>
            <div className='h-20 p-4 border'>{stats.totalCourses}
              <div className='font-semibold text-sm'>Courses</div>
            </div>
            <div className='h-20 p-4 border'>{stats.enrollments}
              <div className='font-semibold text-sm'>Total enrollments</div>
            </div>
            <div className='h-20 p-4 border'>{stats.active}
              <div className='font-semibold text-sm'>Active students</div>
            </div>
            <div className='h-20 p-4 border'>{stats.completed}
              <div className='font-semibold text-sm'>Completed students</div>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-5 p-4 min-h-[55vh] md:grid-cols-2'>
            <div>
              <h3>Trending courses</h3>
              <div className='flex mt-4 flex-col w-full'>
                <div className='h-10 hover:border-[#0D1F23] border-2 flex items-center px-3 w-full'>
                  Customer Service Training
                </div>
              </div>
            </div>
            <div>
              <h3>Top performers</h3>
              <div className='flex mt-4 flex-col w-full'>
                <div className='h-10 hover:border-[#0D1F23] border-2 flex items-center px-3 w-full'>
                  James Imabe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
