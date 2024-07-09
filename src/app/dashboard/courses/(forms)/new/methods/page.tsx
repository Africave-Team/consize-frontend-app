"use client"
import React from 'react'
import Layout from '@/layouts/PageTransition'
import { useRouter } from 'next/navigation'
import AIIcon from '@/components/icons/AI'
import Link from 'next/link'
import LibrarySelector from '@/components/FormButtons/LibrarySelector'

export default function page () {
  const router = useRouter()
  return (
    <Layout>
      <div className='h-full  flex justify-center md:py-10'>
        <div className='px-4 w-full md:w-4/5 h-full overflow-y-scroll'>
          <div className='flex py-5 justify-between md:items-center md:flex-row flex-col gap-1'>
            <div className='font-semibold md:text-2xl text-xl'>
              Start here
            </div>
            <div className='w-full text-start md:w-[290px] text-sm md:text-end'>
              Choose from one of the options below
              how you would like to get started.
            </div>
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-3'>
            <div className='w-full p-3 h-[400px] border-4 hover:border-[#1FFF6999] hover:border-4 rounded-xl flex flex-col gap-2'>
              <div className='bg-[url(/ai-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Create complete course with AI</h2>
                <div className='text-sm mt-1'>
                  Just put the course name and it creates the complete course for you within 2 minutes. You can edit it afterwards.
                </div>
              </div>
              <Link href='/dashboard/courses/new/ai' className='w-full text-[#0D1F23] bg-[#1FFF6999] disabled:bg-gray-300 hover:bg-[#1FFF6999]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                <div className='flex w-full justify-center gap-1'>
                  {/* <img loading="lazy" src="/ai-icon-dark-2.svg" alt="" /> */}
                  <AIIcon className='h-5 w-5 stroke-black fill-black' />
                  Get started with ConsizeAI
                </div>
              </Link>
            </div>
            <div className='w-full p-3 h-[400px] border-4 hover:border-[#1FFF6999] hover:border-4 rounded-xl flex flex-col gap-2'>
              <div className='bg-[url(/scratch-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Create course from scratch</h2>
                <div className='text-sm mt-1'>
                  Manually add your course content. Our AI shall be at your assistance along the way to help you with content based on your cues. Best way if you want to create a course from scratch.
                </div>
              </div>
              <Link href='/dashboard/courses/new/manual' className='w-full text-[#0D1F23] bg-[#1FFF6999] disabled:bg-gray-300 hover:bg-[#1FFF6999]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Start from scratch
              </Link>
            </div>
            <div className='w-full p-3 h-[400px] border-4 hover:border-[#1FFF6999] hover:border-4 rounded-xl flex flex-col gap-2'>
              <div className='bg-[url(/doc-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Upload a course document</h2>
                <div className='text-sm mt-1'>
                  Upload your existing course material - PDF, PPT or doc and our AI shall create a micro course using the same. Even a few line of thoughts jotted down in a doc shall be enough to get you started, and you can edit it afterwards on our platform.
                </div>
              </div>
              <Link href="/dashboard/courses/new/document-upload" className='w-full bg-[#1FFF6999] text-[#0D1F23] disabled:bg-gray-300 hover:bg-[#1FFF6999]/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Upload documents
              </Link>
            </div>

            <div className='w-full p-3 h-[400px] border-4 hover:border-[#1FFF6999] hover:border-4 rounded-xl flex flex-col gap-2'>
              <div className='bg-[url(/ai-method.png)] bg-no-repeat bg-cover bg-center h-[200px] rounded-md'>
              </div>
              <div className='h-[180px]'>
                <h2 className='text-lg font-medium'>Choose one from our library</h2>
                <div className='text-sm mt-1'>
                  Search our extensive course library to find a course that closely resembles what you want and just edit it to match your requirements
                </div>
              </div>
              <LibrarySelector />
            </div>
          </div>
          <div className='md:h-0 h-[250px]'></div>
        </div>
      </div>
    </Layout>
  )
}
