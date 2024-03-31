"use client"

import Layout from '@/layouts/PageTransition'

export default function page () {
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-4/5'>
            <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
              <div className='font-semibold md:text-2xl text-xl'>
                Course statistics
              </div>
            </div>
            <div>
              In this step, we'll ask you the name of your course and what it’s about.
            </div>

            <div className='w-3/5 mt-5'>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}