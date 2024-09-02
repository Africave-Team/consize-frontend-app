"use client"
import { fonts } from '@/app/fonts'
import MainFooter from '@/components/navigations/MainFooter'
import SiteNavBar from '@/components/siteNavBar'
import Layout from '@/layouts/PageTransition'
import Link from 'next/link'
import React from 'react'
import { FaRegClock } from 'react-icons/fa6'
import { FiArrowRight } from 'react-icons/fi'

export default function LeapAfricaContent () {
  return (
    <Layout>
      <section className='h-screen flex flex-col overflow-x-hidden'>
        <SiteNavBar />
        <div className='h-screen overflow-y-scroll bg-[#f5f7f5]'>
          {/* Hero section */}
          <div className='relative min-h-[700px] md:min-h-[550px]'>
            <div className='w-full z-10 h-[550px] absolute top-0 left-0'>
              <div className='flex justify-end h-full'>
                <div className='w-2/3 -mr-72'>
                  <img
                    src="https://framerusercontent.com/images/4dqgofLWnF977ja7HNm1Ww7FGEo.png"
                    alt=""
                    className=''
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='absolute z-40 top-0 h-[550px] left-0 flex flex-col'>
              <div className='w-full flex justify-center'>
                <div className='md:w-4/5 w-full '>
                  <div className='flex md:flex-row flex-col gap-10'>
                    <div className='w-full md:w-3/5 h-full md:py-10 pb-3 pt-10 md:px-5 px-3'>
                      <div className='flex'>
                        <div className='flex h-10 items-center justify-center gap-1 text-sm bg-[#ebefec] px-5 rounded-3xl'>
                          <img src="https://framerusercontent.com/images/rDPWn84GsjiIywPWGuF8nROGMc.png" className='h-3 w-3' alt="" />
                          Case studies
                        </div>
                      </div>

                      <div className={`${fonts.brandFont.className} text-4xl md:text-5xl mt-5`}>
                        How LEAP Africa trains the new generation of social enterprise leaders in 10 minutes every day
                      </div>
                      <div className='flex flex-col gap-3 mt-5'>
                        <div className='flex gap-3 items-center'>
                          <div className='flex justify-center items-center h-12 w-12 rounded-full bg-[#ebefec]'>
                            <FaRegClock />
                          </div>
                          <div>
                            71% of the students completed the training within 6 days
                          </div>
                        </div>
                        <div className='flex gap-3 items-center'>
                          <div className='flex justify-center items-center h-12 w-12 rounded-full bg-[#ebefec]'>
                            <FaRegClock />
                          </div>
                          <div>
                            All students agree that learning on WhatsApp is effective
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className='w-full md:w-2/5 md:h-[550px] md:py-10 py-3 md:px-5 px-3 flex items-center justify-center'>
                      <div className='h-[250px] rounded-lg w-4/5 shadow-xl bg-white p-5'>
                        <div className='h-16 border-b w-full flex items-center pl-5'>
                          <div className='h-8 w-16'>
                            <img
                              srcSet="
        https://framerusercontent.com/images/DsUceom3Kh8heiZANq5Ogoynydo.png?scale-down-to=512 512w,
        https://framerusercontent.com/images/DsUceom3Kh8heiZANq5Ogoynydo.png 734w"
                              sizes="40.1093px"
                              src="https://framerusercontent.com/images/DsUceom3Kh8heiZANq5Ogoynydo.png"
                              alt=""
                              style={{
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                borderRadius: 'inherit',
                                objectPosition: 'center',
                                imageRendering: 'auto',
                              }}
                            />
                          </div>
                        </div>
                        <div className='flex flex-col mt-3 gap-2'>
                          <div className='flex justify-between px-4 items-center h-14 w-full rounded-lg bg-[#ecefec99]'>
                            <div className='text-[#9ca3af]'>Years of operation</div>
                            <div>22 years</div>
                          </div>
                          <div className='flex justify-between px-4 items-center h-14 w-full rounded-lg bg-[#ecefec99]'>
                            <div className='text-[#9ca3af]'>Sector</div>
                            <div>Non-profit</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Next segment */}
          <div className='bg-white min-h-[650px] w-full flex justify-center'>
            <div className='md:w-2/5 w-full md:p-0 px-3 mb-32'>
              <div className={`${fonts.brandFont.className} h-24 border-b w-full flex items-end pb-5 text-3xl font-bold`}>
                About LEAP Africa
              </div>
              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>Overview</div>
                <div className='mt-5'>
                  Leadership Effectiveness, Accountability, and Professionalism (LEAP) Africa is a youth-focused non-profit committed to raising a new cadre of African leaders. They do this through training programs, research publications, convenings, and e-learning.
                </div>
              </div>

              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>The Challenge</div>
                <div className='mt-5'>
                  Consize needed to test out its Whatsapp microlearning solution and partnered with LEAP Africa to pilot with some of their students to take a course on WhatsApp.
                </div>
              </div>

              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>The Solution</div>
                <div className='mt-5'>
                  <p>
                    The Consize team took one of LEAP Africa’s popular courses: <strong>Sustainable Development Goals: The Goals, The Targets and Your Role</strong>, which has 1.5 hours of video content, converted it to bite-sized content (text and multimedia), and delivered the course using WhatsApp.
                  </p>

                  <p className='mt-5'>
                    The SDG course was designed to expose the participants to the global goals, their targets, and the importance of achieving them before 2030. It also explains how their everyday decisions and attitudes can affect the lives of people around the world.
                  </p>

                  <p className='mt-5'>
                    The students needed only 10 minutes each day, for 6 days to complete the course on Whatsapp.
                  </p>
                </div>
              </div>

              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>The Impact</div>
                <div className='mt-5'>
                  <p>
                    In 6 days, LEAP Africa trained 27 young African professionals on the SDGs using WhatsApp. Not only that, the students had an average test score of 96% and only had to spend an average of 8.34 minutes learning each day.
                  </p>

                  <p className='mt-5'>
                    At LEAP Africa, they are convinced that microlearning is the future of e-learning and Amabelle Nwakanma, Director of Programmes says:
                  </p>

                  <p className='mt-5'>
                    “At LEAP Africa, we pride ourselves on being at the forefront of educational technologies in Africa and we are excited to be a part of what Consize is building. This innovation will help us reach busy professionals in 10 minutes a day”
                  </p>
                </div>
              </div>



            </div>

          </div>
          {/* case studies */}
          <div className='bg-[#f5f7f5] min-h-[600px] w-full md:pt-20 pt-10 md:pb-0 pb-10'>
            <div className='flex justify-center'>
              <div className='w-full md:w-4/5 md:px-0 px-5'>
                <div className='font-semibold text-[#0D1F2380] text-[18px]'>Case studies</div>
                <div className={`text-black font-extrabold md:text-[50px] text-3xl mt-1 md:mt-3 ${fonts.brandFont.className}`}>
                  Quick learning, lasting impact
                </div>
                <div className='w-full min-h-[560px] mt-10 md:mb-0 mb-10 md:flex-row flex-col flex gap-10'>
                  <div className='md:h-[550px] w-full md:w-1/2 h-[520px]'>
                    <div className='w-full h-[320px] rounded-lg relative'>
                      <img
                        srcSet="
        https://framerusercontent.com/images/k4PX5gZRWkKbFartkrWzo0RF90.png?scale-down-to=512 512w,
        https://framerusercontent.com/images/k4PX5gZRWkKbFartkrWzo0RF90.png?scale-down-to=1024 1024w,
        https://framerusercontent.com/images/k4PX5gZRWkKbFartkrWzo0RF90.png 1656w"
                        sizes="630px"
                        src="https://framerusercontent.com/images/k4PX5gZRWkKbFartkrWzo0RF90.png"
                        alt=""
                        className='h-full w-full absolute'
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          borderRadius: 'inherit',
                          objectPosition: 'center',
                          objectFit: 'cover',
                          imageRendering: 'auto',
                        }}
                      />
                      <div className='h-8 w-16 absolute top-5 left-5'>
                        <img
                          srcSet="
        https://framerusercontent.com/images/DsUceom3Kh8heiZANq5Ogoynydo.png?scale-down-to=512 512w,
        https://framerusercontent.com/images/DsUceom3Kh8heiZANq5Ogoynydo.png 734w"
                          sizes="40.1093px"
                          src="https://framerusercontent.com/images/DsUceom3Kh8heiZANq5Ogoynydo.png"
                          alt=""
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            borderRadius: 'inherit',
                            objectPosition: 'center',
                            imageRendering: 'auto',
                          }}
                        />
                      </div>
                    </div>
                    <div className='py-5'>
                      <div className={`font-semibold text-[20px] md:text-[24px] ${fonts.brandFont.className}`}>
                        How LEAP Africa trains the new generation of social enterprise leaders in 10 minutes every day
                      </div>
                      <div className='text-sm mt-3'>
                        In partnership with Consize, LEAP Africa made it possible for young Africans to learn about the Sustainable Development Goals (SDGs) in just 10 minutes a day using WhatsApp.
                      </div>
                      <div className='mt-3 flex'>
                        <Link href="/home/case-studies/leap-africa" className='flex h-10 items-center justify-center gap-1 text-sm bg-[#ebefec] px-5 rounded-2xl'>
                          Learn more <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className='md:h-[550px] md:w-1/2 w-full rounded-lg h-[500px]'>
                    <div className='w-full h-[320px] rounded-lg p-5 bg-[#ccf1fc]'>
                      <div className='h-8 w-20 border'>
                        <img
                          src="https://framerusercontent.com/images/hbGxj0y55x15rzeEjxheKKWCs.png"
                          alt=""
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            borderRadius: 'inherit',
                            objectPosition: 'center',
                            imageRendering: 'auto',
                          }}
                        />
                      </div>
                    </div>
                    <div className='py-5'>
                      <div className={`font-semibold text-[20px] md:text-[24px] ${fonts.brandFont.className}`}>
                        How WAVE Academies expanded its program to 15 new cities with Consize
                      </div>
                      <div className='text-sm mt-3'>
                        By transforming WAVE's key courses into engaging, bite-sized lessons delivered via WhatsApp, Consize helped WAVE reach over 120 students across 15 new locations in just five days — a 300% increase in monthly training capacity.
                      </div>

                      <div className='mt-3 flex'>
                        <Link href="/home/case-studies/wave-academies" className='flex h-10 items-center justify-center gap-1 text-sm bg-[#ebefec] px-5 rounded-2xl'>
                          Learn more <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MainFooter />
        </div>
      </section>
    </Layout >
  )
}
