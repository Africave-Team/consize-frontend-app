import { IconButton } from '@chakra-ui/react'
import gsap from "gsap"
import React, { useEffect } from 'react'
import KippaLogo from './Logo'
import SampleCourseCTA from './SampleCourseCTA'
import { FiArrowRight } from 'react-icons/fi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { FaSlack } from 'react-icons/fa6'
import { IoIosMail } from 'react-icons/io'
import { SiMinutemailer } from 'react-icons/si'
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
import { fonts } from "@/app/fonts"
const myFont = fonts.brandFont

export default function Hero () {
  const animateComponents = () => {
    gsap.from(".image-container", {
      height: "1500px",
      scrollTrigger: {
        trigger: '.hero-cont',
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (self.direction === -1) {
            // Scroll up
            gsap.to('.image-container', { height: "1500px", duration: 0.3 })
          } else {
            // Scroll down
            gsap.to('.image-container', { height: "910px", duration: 0.3 })
          }
        },
      },
    })
  }
  useEffect(() => {
    animateComponents()
  }, [])
  return (
    <div className='md:px-5 px-2'>
      <div className="relative hero-cont h-[900px] bg-[#0D1F23] flex items-center justify-center rounded-3xl">
        <div className='absolute h-96 w-full z-20 top-0 left-0 right-0 flex justify-center'>
          <div className='w-full md:w-3/5 h-96 radial-gradient-hero'></div>
        </div>
        <div className="absolute bottom-0 z-30 left-0 right-0 h-full w-full flex justify-center text-white">
          <div className='w-full md:w-3/5 h-96 bg-[url(/assets/grids.svg)] bg-cover'></div>
        </div>
        <div className="absolute bottom-0 z-50 left-0 right-0 pt-[65px] h-full w-full flex-col  flex items-center rounded-lg overflow-auto">
          <div className='w-full flex justify-center'>
            <div className='md:w-[350px] w-auto gap-1 border text-xs border-[#77898b] rounded-3xl justify-between h-8 bg-[#385255] flex px-4 items-center'>
              <KippaLogo fillText='white' className='h-3' />
              <div className='text-[#fff] font-light'>
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
              <div className='text-center mt-3'>
                <button className='bg-primary-app rounded-3xl h-10 px-6 font-medium text-sm'>
                  Try a sample course
                </button>
              </div>
            </div>
          </div>

          <div className='w-full flex mt-8 justify-center'>
            <div
              className="w-[450px] h-[500px] relative flex-none image-container"
              style={{
                opacity: 1,
                transition: 'transform 0.1s ease-out, opacity 0.3s ease',
                transform:
                  "perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  borderRadius: "inherit",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
              >
                <img
                  decoding="async"
                  sizes="450px"
                  srcSet="https://framerusercontent.com/images/RIcj1r8X4DRPnNXVvgSnm1PDnA.png?scale-down-to=2048 1009w, https://framerusercontent.com/images/RIcj1r8X4DRPnNXVvgSnm1PDnA.png 1795w"
                  src="https://framerusercontent.com/images/RIcj1r8X4DRPnNXVvgSnm1PDnA.png"
                  alt=""
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectPosition: "center",
                    objectFit: "cover",
                    imageRendering: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
