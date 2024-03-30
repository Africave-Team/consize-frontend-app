"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import React from 'react'
import { FaPlus } from 'react-icons/fa'
import { CiGrid41, CiGrid2H } from "react-icons/ci"
import { ListStyle } from '@/type-definitions/navigation'
import CreateCourse from '@/components/CreateCourse'

export default function TeamsSettingsPage () {
  const { preferredListStyle, toggleListStyle } = useNavigationStore()
  return (
    <Layout>
      <div className='w-full h-full relative'>
        <div className='absolute top-0 px-5 left-0 h-full w-full'>
          <div className='h-16 w-full flex justify-between items-center'>
            <div className='flex gap-3 items-center h-full'>
              <h2 className='font-bold text-2xl'>
                Courses
              </h2>
              <div className='h-6 min-w-6 px-2 text-white text-xs rounded-full bg-[#0D1F23] flex justify-center items-center'>
                0
              </div>
            </div>
            <div className='h-full flex gap-2 items-center'>
              <button onClick={toggleListStyle} className='h-10 w-10 border rounded-md group hover:bg-black flex justify-center items-center'>
                {preferredListStyle === ListStyle.ROWS && <CiGrid2H className='text-2xl group-hover:text-white' />}
                {preferredListStyle === ListStyle.GRID && <CiGrid41 className='text-2xl group-hover:text-white' />}
                {/* <CiGrid41 className='text-2xl' /> */}
              </button>
            </div>
          </div>
        </div>
        <CreateCourse />
      </div>
    </Layout>
  )
}
