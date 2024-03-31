import { IconButton } from '@chakra-ui/react'
import gsap from "gsap"
import React, { useEffect } from 'react'
import KippaLogo from './Logo'
import localFont from 'next/font/local'
import SampleCourseCTA from './SampleCourseCTA'
import { FiArrowRight } from 'react-icons/fi'

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
    <div className='md:px-4 px-2'>
      <div className="relative h-[840px] md:mb-auto mb-36 bg-[#0D1F23] flex items-center justify-center rounded-lg">
        <div className='absolute h-96 w-full top-0 left-0 right-0 flex justify-center'>
          <div className='w-full md:w-4/5 h-96 radial-gradient-hero'></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-full w-full flex justify-center text-white">
          <div className='w-full md:w-4/5 h-96 bg-[url(/assets/grids.svg)] bg-cover'></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-10 h-full w-full flex-col  flex items-center rounded-lg">
          <div className='w-full flex justify-center'>
            <div className='w-2/3 md:w-3/12 gap-1 border text-xs border-[#77898b] rounded-3xl justify-between h-8 bg-[#385255] flex px-4 items-center'>
              <KippaLogo fillText='white' className='h-3' />
              <div className='text-[#fff] font-light'>Free to try for as long as you like</div>
              <div className='cursor-pointer font-semibold text-[#fff] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
            </div>
          </div>

          <div className='w-full flex justify-center'>
            <div className='w-full md:w-5/12 flex gap-2 justify-center mt-5 flex-col'>
              <div className={`w-full text-white font-extrabold md:text-6xl text-5xl text-center  ${myFont.className}`}>
                Training that meets
              </div>
              <div className={`w-full text-white font-extrabold md:text-6xl text-5xl text-center ${myFont.className}`}>
                learners where they are
              </div>

              <>
                <div className='mt-5 w-full text-center text-sm text-[#D0D5DD]'>
                  Consize delivers impactful training - <b>that your learners will actually take</b>
                </div>
                <div className='w-full text-center text-sm text-[#D0D5DD]'>
                  – through everyday messaging tools, all in 10 minutes a day.
                </div>
              </>

              <div className='text-center mt-10'>
                <button className='bg-primary-app rounded-3xl h-12 px-12'>
                  Try a sample course
                </button>
              </div>

              <div className='w-full flex mt-8 justify-center'>
                <div className='relative h-[400px] w-[500px] '>
                  <div className='w-full absolute text-black phone hidden'>
                    <div className='w-full h-full flex justify-center'>
                      <img loading='lazy' src="/assets/wsapp-phone.gif" className='h-[400px] w-[250px]' alt="pyramid" />
                    </div>
                  </div>
                  <div className='w-full absolute top-7 text-black phone hidden'>
                    <div className='w-full h-full flex justify-center'>
                      <img loading='lazy' src="/assets/final-gif-2x.gif" className='h-[360px] rounded-2xl w-[215px]' alt="pyramid" />
                    </div>
                  </div>
                  <div className="-bottom-5 shadow-xl py-3 w-full rounded-xl h-24 bg-white absolute flex justify-between items-center">
                    <div className='w-3/5 flex flex-col pl-5 gap-2'>
                      <div className='flex gap-3'>
                        <img src="/assets/wsapp-icon.png" className='h-7' />
                        <img src="/assets/imessage.png" className='h-7' />
                        <img src="/assets/slack.png" className='h-7' />
                        <img src="/assets/teams.png" className='h-7' />
                        <img src="/assets/mail.png" className='h-7' />
                      </div>
                      <div className='text-xs'>
                        Deliver bite-sized courses on these platforms
                      </div>
                    </div>
                    <div className='h-full border w-0.5'></div>
                    <div className='flex-1 px-2'>
                      <button className='bg-primary-app rounded-3xl h-12 w-full px-3 text-xs'>
                        Try a sample course
                      </button>
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
