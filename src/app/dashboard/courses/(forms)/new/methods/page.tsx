"use client"
import React from 'react'
import Layout from '@/layouts/PageTransition'
import { useRouter } from 'next/navigation'

export default function page () {
  const router = useRouter()
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
          <div className='w-full flex md:flex-row flex-col gap-3'>
            <div className='w-full p-3 md:w-1/3 h-[400px] border-2 hover:border-[#0D1F23] hover:border-2 rounded-md flex flex-col gap-2'>
              <div className='bg-[url(/ai-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Create complete course with AI</h2>
                <div className='text-sm mt-1'>
                  Just put the course name and it creates the complete course for you within 2 minutes. You can edit it afterwards.
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/courses/new/ai')} className='w-full text-white bg-[#0D1F23] disabled:bg-gray-300 hover:bg-[#0D1F23]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                <div className='flex w-full justify-center gap-1'>
                  <img loading="lazy" src="/ai-icon.svg" alt="" />
                  Get started with Kippa AI
                </div>
              </button>
            </div>
            <div className='w-full p-3 md:w-1/3 h-[400px] border-2 hover:border-[#0D1F23] hover:border-2 rounded-md flex flex-col gap-2'>
              <div className='bg-[url(/scratch-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Create course from scratch</h2>
                <div className='text-sm mt-1'>
                  Manually add your course content. Our AI shall be at your assistance along the way to help you with content based on your cues. Best way if you want to create a course from scratch.
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/courses/new/manual')} className='w-full text-white bg-[#0D1F23] disabled:bg-gray-300 hover:bg-[#0D1F23]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Start from scratch
              </button>
            </div>
            <div className='w-full p-3 md:w-1/3 h-[400px] border-2 hover:border-[#0D1F23] hover:border-2 rounded-md flex flex-col gap-2'>
              <div className='bg-[url(/doc-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Upload a course document</h2>
                <div className='text-sm mt-1'>
                  Upload your existing course material - PDF, PPT or doc and our AI shall create a micro course using the same. Even a few line of thoughts jotted down in a doc shall be enough to get you started, and you can edit it afterwards on our platform.
                </div>
              </div>
              <button disabled className='w-full text-white bg-[#0D1F23] disabled:bg-gray-300 hover:bg-[#0D1F23]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Upload documents (coming soon)
              </button>
            </div>
          </div>
          <div className='md:h-0 h-[250px]'></div>
        </div>
      </div>
    </Layout>
  )
}