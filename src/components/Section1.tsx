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
    <div className='py-10 md:px-14 px-4 mt-5 flex md:flex-row flex-col md:justify-between gap-5 md:h-[73vh] h-[480px] bg-gradient-to-r from-[#F9FBFF00]/0 to-[#F6F9FF]'>
      <div className='w-full md:w-[45%] flex flex-col md:items-start items-center'>
        <div className='rounded-xl flex gap-2 text-[#8B5CF6] bg-[#F3EFFE] text-xs font-medium md:w-[35%] w-[55%] justify-center items-center px-2 py-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M15.5611 0.800049C13.3018 0.800049 11.0268 1.80136 9.33553 3.49967C9.27672 3.55821 9.23027 3.62759 9.19886 3.70382C9.16744 3.78005 9.15169 3.86163 9.15249 3.94385C9.15329 4.02608 9.17064 4.10734 9.20354 4.18297C9.23644 4.25859 9.28423 4.32708 9.34418 4.38451C9.40422 4.44186 9.47521 4.48699 9.55308 4.51731C9.63095 4.54763 9.71415 4.56254 9.7979 4.56118C9.88166 4.55982 9.96431 4.54222 10.0411 4.50939C10.1179 4.47656 10.1874 4.42915 10.2454 4.36989C11.7103 2.89888 13.6882 2.04809 15.561 2.04809C17.2507 2.04809 18.5989 2.70632 19.4689 3.74831C20.3389 4.79028 20.74 6.23066 20.426 7.88487C19.7981 11.1933 16.4439 13.952 13.0646 13.952C11.1918 13.952 9.64708 13.1299 8.79053 11.7399C8.70326 11.5983 8.56231 11.4966 8.39865 11.4571C8.235 11.4175 8.06205 11.4434 7.91783 11.5291C7.84634 11.5714 7.78403 11.6271 7.73448 11.6931C7.68493 11.7591 7.6491 11.834 7.62904 11.9135C7.60898 11.9931 7.60509 12.0758 7.61758 12.1568C7.63006 12.2378 7.65869 12.3157 7.70183 12.3859C8.79836 14.1652 10.8053 15.2 13.0646 15.2C17.1267 15.2 20.9245 12.0684 21.6748 8.11522C22.05 6.13864 21.5663 4.29348 20.4496 2.95609C19.3329 1.61869 17.5921 0.800049 15.5611 0.800049ZM14.9739 3.26322C14.8221 3.2594 14.674 3.30904 14.5563 3.40315C14.4386 3.49727 14.359 3.62965 14.3321 3.77633L13.4445 8.44673C13.4202 8.57904 13.44 8.71554 13.5011 8.83588C13.5622 8.95623 13.6612 9.054 13.7834 9.11463L16.1756 10.3176C16.2501 10.3554 16.3315 10.3785 16.4151 10.3853C16.4987 10.3921 16.5829 10.3826 16.6627 10.3574C16.7426 10.3321 16.8166 10.2916 16.8804 10.2381C16.9442 10.1846 16.9966 10.1192 17.0346 10.0458C17.1109 9.89851 17.1247 9.72752 17.0728 9.57032C17.0209 9.41312 16.9076 9.28255 16.7578 9.20725L14.7827 8.21638L15.5847 4.00181C15.5999 3.92105 15.5987 3.83813 15.5813 3.75781C15.5638 3.67748 15.5303 3.60134 15.4828 3.53374C15.4353 3.46614 15.3746 3.40842 15.3044 3.36388C15.2341 3.31934 15.1555 3.28886 15.0732 3.27419C15.0404 3.26794 15.0072 3.26435 14.9739 3.26322ZM1.80034 4.84521C1.71688 4.84489 1.63416 4.86071 1.55692 4.89177C1.47969 4.92284 1.40944 4.96853 1.35019 5.02625C1.29093 5.08397 1.24384 5.15259 1.2116 5.22817C1.17936 5.30376 1.1626 5.38484 1.16227 5.46679C1.16194 5.54915 1.17822 5.63075 1.21017 5.70691C1.24212 5.78306 1.28911 5.85225 1.34842 5.91048C1.40774 5.96872 1.47821 6.01485 1.55577 6.04622C1.63334 6.07759 1.71646 6.09357 1.80034 6.09325H8.11029C8.19417 6.09357 8.27729 6.07759 8.35486 6.04622C8.43242 6.01485 8.50289 5.96872 8.5622 5.91048C8.62152 5.85225 8.66851 5.78306 8.70046 5.70691C8.73241 5.63075 8.74869 5.54915 8.74836 5.46679C8.74803 5.38484 8.73127 5.30376 8.69903 5.22817C8.66679 5.15258 8.61969 5.08397 8.56044 5.02625C8.50119 4.96853 8.43094 4.92284 8.35371 4.89177C8.27647 4.86071 8.19375 4.84489 8.11029 4.84521H1.80034ZM3.59166 7.37785C3.50809 7.37753 3.42527 7.3934 3.34795 7.42454C3.27063 7.45568 3.20033 7.50148 3.14106 7.55933C3.08179 7.61718 3.03473 7.68593 3.00256 7.76166C2.97039 7.83739 2.95375 7.9186 2.95359 8.00065C2.95391 8.0826 2.97067 8.16368 3.00292 8.23927C3.03516 8.31486 3.08225 8.38347 3.1415 8.44119C3.20075 8.49891 3.271 8.5446 3.34824 8.57567C3.42548 8.60673 3.50819 8.62256 3.59166 8.62224H9.90781C10.0755 8.62159 10.2362 8.5559 10.3548 8.43947C10.4733 8.32304 10.5403 8.16531 10.5409 8.00065C10.5406 7.83579 10.4738 7.67775 10.3552 7.56105C10.2366 7.44436 10.0757 7.3785 9.90781 7.37785H3.59166ZM0.838271 9.90684C0.754387 9.90652 0.671267 9.9225 0.593705 9.95387C0.516143 9.98524 0.445672 10.0314 0.386357 10.0896C0.327041 10.1478 0.280053 10.217 0.248103 10.2932C0.216153 10.3693 0.199872 10.4509 0.2002 10.5333C0.200525 10.6152 0.217287 10.6963 0.249529 10.7719C0.281771 10.8475 0.328862 10.9161 0.388112 10.9738C0.447363 11.0316 0.517613 11.0773 0.594851 11.1083C0.67209 11.1394 0.754804 11.1552 0.838271 11.1549H7.15318C7.32089 11.1542 7.48155 11.0885 7.60014 10.9721C7.71872 10.8557 7.78564 10.698 7.78629 10.5333C7.78662 10.4513 7.7705 10.3701 7.73886 10.2943C7.70722 10.2185 7.66067 10.1495 7.60188 10.0913C7.54309 10.0332 7.47321 9.98693 7.39622 9.95527C7.31923 9.92362 7.23665 9.90716 7.15318 9.90684H0.838271Z" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="0.2" />
          </svg>
          Launch in 60 minutes
        </div>
        <div className="text-2xl md:text-3xl lg:text-3xl text-center md:text-start mt-3">
          <span className="text-black">Kippa turns a 2-hour video course</span>
          <span className="text-primary-500"> into one quick lesson a day</span>
        </div>
        {/* <Button className='text-white bg-primary-500 mt-8 px-5 py-2 rounded-md'>Try a sample course</Button> */}
        <SampleCourseCTA bg={'bg-primary-500 mt-8'} />
      </div>
      <div className='w-full md:w-[45%] flex flex-col gap-3' id="revealBox">
        <div className='bg-[#E8EAEE66] bg-opacity-40 p-5 w-full min-h-[100px] rounded-lg flex justify-start gap-5'>
          <Icon as={FiClock} />
          <div>
            <h2 className='font-semibold md:text-xl text-base'>
              Launch your course in 1 hour - from scratch
            </h2>
            <p className='mt-2 text-[#334155] text-sm md:text-base'>
              Create and launch your course in 1 hour using AI, customizable templates, and a dedicated support person from our team.
            </p>
          </div>
        </div>
        <div className='bg-[#E8EAEE66] bg-opacity-40 p-5 w-full min-h-[100px] rounded-lg flex justify-start gap-5'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div>
            <h2 className='font-semibold md:text-xl text-base'>
              Deliver exceptional learning experiences
            </h2>
            <p className='mt-2 text-[#334155] text-sm md:text-base'>
              95% satisfaction rate from learners.
            </p>
          </div>
        </div>

        <div className='bg-[#E8EAEE66] bg-opacity-40 p-5 w-full min-h-[100px] rounded-lg flex justify-start gap-5'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 6H23V12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div>
            <h2 className='font-semibold md:text-xl text-base'>
              Improve the metrics that matter to you
            </h2>
            <p className='mt-2 text-[#334155] w-full md:w-[65%] text-sm md:text-base'>
              Increase your completion rates by 50%, and learner retention by 42%.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
