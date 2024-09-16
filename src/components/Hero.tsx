import { IconButton } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import KippaLogo from './Logo'
import SampleCourseCTA from './SampleCourseCTA'
import { FiArrowRight } from 'react-icons/fi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { FaSlack } from 'react-icons/fa6'
import { IoIosMail } from 'react-icons/io'
import { SiMinutemailer } from 'react-icons/si'
import { motion } from "framer-motion"

import { fonts } from "@/app/fonts"
import Link from 'next/link'
const myFont = fonts.brandFont

export default function Hero () {
  return (
    <div className='md:px-5 px-2'>
      <div className="relative hero-cont h-[980px] bg-[#0D1F23] flex items-center justify-center rounded-3xl">
        <div className='absolute h-96 w-full z-10 top-0 left-0 right-0 flex justify-center'>
          <div className='w-full md:w-3/5 h-96 radial-gradient-hero'></div>
        </div>
        <div className="absolute bottom-0 z-20 left-0 right-0 h-full w-full flex justify-center text-white">
          <div className='w-full md:w-3/5 h-96 bg-[url(/assets/grids.svg)] bg-cover'></div>
        </div>
        <motion.div className="absolute bottom-0 z-30 left-0 right-0 pt-[65px] h-full w-full flex-col  flex items-center rounded-lg overflow-hidden">
          <div className='w-full flex justify-center'>
            <div className='md:w-[350px] w-auto gap-1 border text-xs border-[#77898b] rounded-3xl justify-between h-8 bg-[#385255] flex px-4 items-center'>
              <KippaLogo fillText='white' className='h-3' />
              <div className='text-[#fff] font-regular'>
                <span className='md:hidden'>Free to try forever</span>
                <span className='md:block hidden'>Free to try for as long as you like</span>
              </div>
              <div className='cursor-pointer font-semibold text-[#fff] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
            </div>
          </div>

          <div className='w-full flex justify-center'>
            <div className='w-full md:w-9/12 flex gap-2 justify-center mt-6 flex-col'>
              <div className={`w-full text-white font-extrabold md:text-[65px] mt-2 text-4xl text-center  ${myFont.className}`}>
                Deliver training where your
              </div>
              <div className={`w-full text-white font-extrabold md:text-[65px] md:mt-3 -mt-2 text-4xl text-center ${myFont.className}`}>
                learners spend most of their time
              </div>
              <div className={`w-full text-white font-extrabold md:text-[65px] md:mt-3 -mt-2 text-4xl text-center ${myFont.className}`}>
                - on messaging apps
              </div>

              <div className='flex flex-col gap-1'>
                <div className='mt-8 w-full text-center text-[12px] md:text-base text-[#D0D5DD]'>
                  Consize helps you deliver impactful <b>10-minute daily training via messaging apps</b>,
                </div>
                <div className='w-full text-center text-[13px] md:text-base text-[#D0D5DD]'>
                  – where research shows we spend 23% of our daily app time.
                </div>
              </div>
              <div className='flex justify-center mt-8 gap-3'>
                <IoLogoWhatsapp className='text-neutral-500 text-3xl' />
                <div className='h-7 w-8 rounded-lg bg-neutral-500 flex items-center justify-center'>
                  <IoIosMail className='text-xl' />
                </div>
                <FaSlack className='text-neutral-500 text-3xl' />
                <div className='h-8 w-8 rounded-full bg-neutral-500 flex items-center justify-center'>
                  <SiMinutemailer className='text-xl' />
                </div>

              </div>
              <div className='text-center mt-10'>
                <Link href={`/courses/${process.env.NEXT_PUBLIC_SAMPLE_COURSE}?tryout=true`} className='bg-primary-app rounded-3xl h-10 py-3 px-6 font-medium text-sm'>
                  Try a sample course
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        <div className='w-full absolute bottom-0 z-40 left-0 flex justify-center'>
          <div
            className="w-[350px] h-[380px] overflow-hidden"
          >
            <img
              src="https://framerusercontent.com/images/RIcj1r8X4DRPnNXVvgSnm1PDnA.png"
              alt=""
              className='h-[520px] w-[350px]'
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectPosition: 'top',
                objectFit: 'cover',
                imageRendering: 'auto',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
