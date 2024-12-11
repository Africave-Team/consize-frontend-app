import { fonts } from '@/app/fonts'
import React from 'react'
const myFont = fonts.brandFont
export default function SiteTemporarilyDown () {
  return (
    <div className='md:px-5 px-2'>
      <div className="relative hero-cont h-[90vh] bg-[#0D1F23] flex items-center justify-center rounded-3xl">
        <div className='absolute h-96 w-full z-10 top-0 left-0 right-0 flex justify-center'>
          <div className='w-full md:w-3/5 h-96 radial-gradient-hero'></div>
        </div>
        <div className="absolute bottom-0 z-20 left-0 right-0 h-full w-full flex justify-center text-white">
          <div className='w-full md:w-3/5 h-96 bg-[url(/assets/grids.svg)] bg-cover'></div>
        </div>

        <div className="absolute bottom-0 z-30 left-0 right-0 pt-[65px] h-full w-full flex-col  flex items-center rounded-lg overflow-hidden">
          <div className='w-full flex justify-center'>
            <div className='w-full md:w-9/12 flex gap-2 justify-center items-center h-[600px] mt-6 flex-col'>
              <div className={`w-full text-white font-extrabold md:text-[65px] mt-2 text-4xl text-center  ${myFont.className}`}>
                We are currently making changes to
              </div>
              <div className={`w-full text-white font-extrabold md:text-[65px] mt-4 text-4xl text-center  ${myFont.className}`}>
                our website. Stay tuned.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
