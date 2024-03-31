"use client"
import Logo from '@/components/Logo'
import Layout from '@/layouts/PageTransition'
import localFont from 'next/font/local'
import { useRouter } from 'next/navigation'
import React from 'react'
const myFont = localFont({ src: '../../../../../fonts/rgs-1.ttf' })

export default function TeamsSettingsPage () {
  const router = useRouter()
  return (
    <Layout>
      <div className='w-full h-full'>
        <div className='flex md:flex-row flex-col h-full items-center overflow-y-scroll'>
          <div className='w-full md:w-1/2 md:py-0 pt-10  px-10'>
            <h2 className='text-4xl md:text-5xl font-semibold md:mb-3'>
              <span className={`mb-10 ${myFont.className}`}>Start creating</span>
            </h2>
            <h2 className={`mb-10 ${myFont.className} text-4xl md:text-5xl font-semibold flex gap-3 items-center`}>
              courses now on Consize
            </h2>
          </div>
          <div className='w-full md:w-1/2 px-10 md:px-16'>
            <div>
              <div className='flex border-b py-10'>
                <div className='flex flex-col w-10/12'>
                  <div className='text-lg font-semibold flex gap-3'>
                    1. <h2>Tell us about your course</h2>
                  </div>
                  <div className=''>
                    <div className='px-7 text-sm'>
                      Share some basic info like the name, an image and description of the course.
                    </div>
                  </div>
                </div>
                <div className='w-2/12'>
                  <img loading="lazy" src="/assets/pyramid-5.png" className='h-16 w-16' alt="" />
                </div>
              </div>

              <div className='flex border-b py-10'>
                <div className='flex flex-col w-10/12'>
                  <div className='text-lg font-semibold flex gap-3'>
                    2. <h2>Select your audience</h2>
                  </div>
                  <div className=''>
                    <div className='px-7 text-sm'>
                      Decide who gets access to your course. It could be available to the public or only people you share with.
                    </div>
                  </div>
                </div>
                <div className='w-2/12'>
                  <img loading="lazy" src="/assets/cylinder-5.png" className='h-16 w-16' alt="" />
                </div>
              </div>

              <div className='flex border-b py-10'>
                <div className='flex flex-col w-10/12'>
                  <div className='text-lg font-semibold flex gap-3'>
                    3. <h2>Schedule delivery and publish</h2>
                  </div>
                  <div className=''>
                    <div className='px-7 text-sm'>
                      Set when you want to deliver the course - instantly or scheduled for later, review the course and publish.
                    </div>
                  </div>
                </div>
                <div className='w-2/12'>
                  <img loading="lazy" src="/assets/cylinder-7.png" className='h-16 w-16' alt="" />
                </div>
              </div>

              <div className=' pt-5 pb-16 flex justify-center'>
                <button onClick={() => router.push("/dashboard/courses/new/methods")} className='py-3 px-5 w-1/2 bg-[#0D1F23] rounded-lg text-sm text-white'>
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
