import { IconButton } from '@chakra-ui/react'
import gsap from "gsap"
import React, { useEffect } from 'react'
import KippaLogo from './Logo'
import localFont from 'next/font/local'
import SampleCourseCTA from './SampleCourseCTA'
import { FiArrowRight } from 'react-icons/fi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { FaSlack } from 'react-icons/fa6'
import { IoIosMail } from 'react-icons/io'
import { SiMinutemailer } from 'react-icons/si'

const myFont = localFont({ src: '../fonts/rgs-1.ttf' })

export default function Hero () {
  const animateComponents = () => {
    const timeline = gsap.timeline({
      paused: false, // default is false
      smoothChildTiming: true,
      autoRemoveChildren: true,
    })
    const elements = ['.pyramid', '.cylinder', '.helix', '.icos', '.phone']
    elements.map((element) => {
      timeline.fromTo(
        element,
        {
          opacity: 0,
          ease: 'ease-in-out',
        },
        {
          opacity: 1,
          duration: 0.8,
          display: "block"
        },
      )
      return element
    })

    timeline.play()
  }
  useEffect(() => {
    animateComponents()
  }, [])
  return (
    <div className='md:px-5 px-2'>
      <div className="relative h-[900px] md:mb-auto mb-36 bg-[#0D1F23] flex items-center justify-center rounded-3xl">
        <div className='absolute h-96 w-full top-0 left-0 right-0 flex justify-center'>
          <div className='w-full md:w-4/5 h-96 radial-gradient-hero'></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-full w-full flex justify-center text-white">
          <div className='w-full md:w-4/5 h-96 bg-[url(/assets/grids.svg)] bg-cover'></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 top-[70px] h-full w-full flex-col  flex items-center rounded-lg">
          <div className='w-full flex justify-center'>
            <div className='w-[200px] md:w-3/12 gap-1 border text-xs border-[#77898b] rounded-3xl justify-between h-8 bg-[#385255] flex px-4 items-center'>
              <KippaLogo fillText='white' className='h-3 md:block hidden' />
              <div className='text-[#fff] font-light'>
                <span className='md:hidden'>Free to try forever</span>
                <span className='md:block hidden'>Free to try for as long as you like</span>
              </div>
              <div className='cursor-pointer font-semibold text-[#fff] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
            </div>
          </div>

          <div className='w-full flex justify-center'>
            <div className='w-full md:w-7/12 flex gap-2 justify-center mt-6 flex-col'>
              <div className={`w-full text-white font-extrabold md:text-[75px] text-5xl text-center  ${myFont.className}`}>
                Training that meets
              </div>
              <div className={`w-full text-white font-extrabold md:text-[75px] text-5xl text-center ${myFont.className}`}>
                learners where they are
              </div>

              <div className='flex flex-col gap-1'>
                <div className='mt-5 w-full text-center text-[13px] md:text-base text-[#D0D5DD]'>
                  Consize delivers impactful training - <b>that your learners will actually take</b>
                </div>
                <div className='w-full text-center text-[13px] md:text-base text-[#D0D5DD]'>
                  – through everyday messaging tools, all in 10 minutes a day.
                </div>
              </div>
              <div className='flex justify-center mt-8 gap-3'>
                <IoLogoWhatsapp className='text-neutral-500 text-3xl' />
                <div className='h-7 w-8 rounded-lg bg-neutral-500 flex items-center justify-center'>
                  <IoIosMail className='text-xl' />
                </div>
                <FaSlack className='text-neutral-500 text-3xl' />
                <div className='h-7 w-7 rounded-full bg-neutral-500 flex items-center justify-center'>
                  <SiMinutemailer />
                </div>

              </div>
              <div className='text-center mt-3'>
                <button className='bg-primary-app rounded-3xl h-10 px-6 font-medium text-sm'>
                  Try a sample course
                </button>
              </div>

              <div className='w-full flex mt-8 justify-center'>
                <div className='relative h-[400px] w-[500px] '>
                  <div className='w-full absolute text-black phone hidden'>
                    <div className='w-full h-full flex justify-center'>
                      {/* <img loading='lazy' src="/assets/wsapp-phone.gif" className='h-[400px] w-[250px]' alt="pyramid" /> */}
                    </div>
                  </div>
                  <div className='w-full absolute top-7 text-black phone hidden'>
                    <div className='w-full h-full flex justify-center'>
                      <img loading='lazy' src="https://framerusercontent.com/images/RIcj1r8X4DRPnNXVvgSnm1PDnA.png?scale-down-to=2048" className='h-[360px] rounded-2xl w-[215px]' alt="pyramid" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
