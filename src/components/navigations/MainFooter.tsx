import React from 'react'
import localFont from 'next/font/local'
import Link from 'next/link'
const myFont = localFont({ src: '../../fonts/rgs-1.ttf' })

export default function MainFooter () {
  return (
    <div className='px-10 pt-5 pb-10 mt-10 bg-[#0D1F23] w-full flex flex-col'>
      <div className='min-h-36 w-full flex justify-between md:flex-row gap-10 md:gap-2 flex-col items-center'>
        <div className='flex-1 flex gap-3 items-center'>
          <img src="/icon.svg" className='h-6 w-6' alt="" />
          <div className={`text-white font-medium text-4xl ${myFont.className}`}>Consize is <span className='gradient-text-1'>free to try</span> for as long as you like</div>
        </div>
        <div className='w-80 h-12 flex gap-3'>
          <Link href="/auth/login" className='px-10 flex items-center justify-center font-medium h-12 rounded-3xl bg-white/10 text-white'>Sign in</Link>
          <Link href="https://calendly.com/ketan-vuov/meet-consize" target='__black' className='px-10 flex justify-center items-center font-medium h-12 rounded-3xl bg-[#1FFF69] hover:bg-primary-app/80 text-black'>Contact us</Link>
        </div>
      </div>
      {/* <div className='h-10 border-t border-white/10 w-full'></div> */}
      {/* <div className='h-10'></div> */}
    </div>
  )
}
