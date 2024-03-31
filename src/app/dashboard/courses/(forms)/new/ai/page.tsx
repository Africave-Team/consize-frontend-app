"use client"
import Layout from '@/layouts/PageTransition'
import React from 'react'

export default function page () {
  return (
    <Layout>
      <div className='flex-1 flex justify-center md:py-10'>
        <div className='px-4 w-full md:w-4/5'>
          <div className='flex py-5 justify-between md:items-center md:flex-row flex-col gap-1'>
            <div className='font-semibold md:text-2xl text-xl'>
              Start here
            </div>
            <div className='w-full text-start md:w-[290px] text-sm md:text-end'>
              Choose from one of the options below
              how you would like to get started.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
