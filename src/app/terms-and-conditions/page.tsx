import React from 'react'

export default function page () {
  return (
    <div className='h-screen w-screen flex'>
      <div className='md:w-2/6 w-0'></div>
      <div className='flex-1 px-4 md:px-0 overflow-y-scroll'>
        <div className='h-40 py-10'>
          <div className='font-bold text-3xl'>Terms of service</div>
          <div className='w-72 flex items-center rounded-md px-3 h-11 mt-4 bg-gray-100'>
            Last updated: 12th June, 2024
          </div>
        </div>

        <div className='h-40'></div>
      </div>
      <div className='md:w-36 w-0'></div>
    </div>
  )
}
