"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import { CourseStatistics } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, off } from "firebase/database"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/rtdb-config'
import { useAuthStore } from '@/store/auth.store'
import TeamQRCode from '@/components/Dashboard/TeamQRCode'
import { Distribution } from '@/type-definitions/callbacks'

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
  const [showTeamQR, setShowteamQR] = useState<boolean>(false)
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
          if (data) {
            const result: CourseStatistics[] = Object.values(data)
            console.log(result)
            let copy = {
              totalCourses: result.length,
              active: 0,
              completed: 0,
              enrollments: 0
            }
            for (let ite of result) {
              if (ite.students) {
                let students = Object.values(ite.students)
                copy.active += students.filter(e => e.progress < 100 && !e.droppedOut).length
                copy.completed += students.filter(e => e.progress === 100 && !e.droppedOut).length
                copy.enrollments += students.length
              }
            }
            setStats(copy)
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
  }, [team])

  useEffect(() => {
    if (team && team.channels) {
      let item = team.channels.find(e => e.channel === Distribution.WHATSAPP)
      if (item && item.enabled) {
        setShowteamQR(true)
      }
    }
  }, [team])
  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full'>
        <div className='w-full'>
          <div className='grid grid-cols-3'>
            <div className='h-20 p-4 border'>{stats.totalCourses}
              <div className='font-semibold text-sm'>Courses</div>
            </div>
            <div className='h-20 p-4 border'>{stats.enrollments}
              <div className='font-semibold text-sm'>Total enrollments</div>
            </div>
            <div className='h-20 p-4 border'>{stats.active}
              <div className='font-semibold text-sm'>Active students</div>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='grid flex-1 grid-cols-1 gap-5 p-4 min-h-[12vh]'>

            </div>
            <div className='h-96 border w-1/3 flex items-center justify-center p-5'>
              {showTeamQR ? <>{team && <TeamQRCode teamLogo={team.logo || ""} shortCode={team?.shortCode} teamName={team.name} />}</> : <div className='h-full w-full flex justify-center items-center'>Whatsapp channel is disabled</div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
