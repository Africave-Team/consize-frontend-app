import { Button, Icon } from '@chakra-ui/react'
import { FiClock } from "react-icons/fi"
import gsap from "gsap"
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React from 'react'
import SampleCourseCTA from './SampleCourseCTA'

gsap.registerPlugin(ScrollTrigger)

export default function Section1 () {
  const animateContent = function () {
    gsap.to("#revealBox", {
      opacity: 1,
      scrollTrigger: {
        trigger: "#revealBox",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    })
  }
  return (
    <div className='py-10 md:px-14 px-4 mt-5 flex md:flex-row flex-col md:justify-between gap-5 md:h-[73vh] h-[480px]'>

    </div>
  )
}
