import React from 'react'
import Link from 'next/link'
import { FaRegCopyright } from 'react-icons/fa'
import { fonts } from "@/app/fonts"
const myFont = fonts.brandFont

export default function MainFooter () {
  return (
    <div className='px-16 pt-5 pb-5 bg-[#0D1F23] w-full flex flex-col'>
      <div className='md:min-h-60 min-h-24 w-full flex justify-between md:flex-row gap-10 md:gap-2 flex-col items-center'>
        <div className='flex-1 flex gap-3 md:items-center items-start'>
          <img src="/icon.svg" className='h-6 w-6 md:mt-0 mt-2' alt="" />
          <div className={`text-white font-medium text-4xl ${myFont.className}`}>Consize is <span className='gradient-text-1'>free to try</span> for as long as you like</div>
        </div>
        <div className='w-80 h-12 flex justify-center md:justify-end gap-3'>
          <Link href="/auth/login" className='px-5 flex items-center justify-center font-medium text-sm h-10 rounded-3xl bg-white/10 text-white'>Sign in</Link>
          <Link href="https://calendly.com/ketan-vuov/meet-consize" target='__black' className='px-5 text-sm flex justify-center items-center font-medium h-10 rounded-3xl bg-[#1FFF69] hover:bg-primary-app/80 text-black'>Contact us</Link>
        </div>
      </div>
      <div className='md:py-10 py-5 text-sm border-t border-white/10 gap-1 w-full flex justify-center md:justify-end items-center text-white/30'>
        <FaRegCopyright />
        Consize Corporation {new Date().getFullYear()}
      </div>
    </div>
  )
}
