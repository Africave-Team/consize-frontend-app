"use client"
import { fonts } from '@/app/fonts'
import MainFooter from '@/components/navigations/MainFooter'
import SiteNavBar from '@/components/siteNavBar'
import Layout from '@/layouts/PageTransition'
import Link from 'next/link'
import React from 'react'
import { FaRegClock } from 'react-icons/fa6'
import { FiArrowRight } from 'react-icons/fi'

export default function WaveAcademiesContent () {
  const locations = [
    "Ogun",
    "Oyo",
    "Abuja",
    "Cross River",
    "Kano",
    "Kaduna",
    "Ondo",
    "Edo",
    "Rivers",
    "Enugu",
    "Delta",
    "Katsina",
    "Abia",
    "Anambra",
    "Benue"
  ]
  const Location = ({ name }: { name: string }) => (
    <div className="flex gap-2 items-center">
      <div className="">
        <span role="img" aria-label="pin">📍</span>
      </div>
      <div className="text-white font-regular">
        {name}
      </div>
    </div>
  )

  return (
    <Layout>
      <section className='h-screen flex flex-col overflow-x-hidden'>
        <SiteNavBar />
        <div className='h-screen overflow-y-scroll bg-[#f5f7f5]'>
          {/* Hero section */}
          <div className='relative min-h-[740px] md:min-h-[550px]'>
            <div className='w-full z-10 hidden md:block h-[550px] absolute top-0 left-0'>
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
            <div className='absolute z-40 top-0 left-0 flex flex-col'>
              <div className='w-full min-h-[550px] flex justify-center'>
                <div className='md:w-4/5 w-full '>
                  <div className='flex md:flex-row flex-col md:gap-10 gap-3'>
                    <div className='w-full md:w-3/5 h-full md:py-10 pb-3 pt-10 md:px-5 px-3'>
                      <div className='flex'>
                        <div className='flex h-10 items-center justify-center gap-1 text-sm bg-[#ebefec] px-5 rounded-3xl'>
                          <img src="https://framerusercontent.com/images/rDPWn84GsjiIywPWGuF8nROGMc.png" className='h-3 w-3' alt="" />
                          Case studies
                        </div>
                      </div>

                      <div className={`${fonts.brandFont.className} text-4xl md:text-5xl mt-5`}>
                        How WAVE Academies expanded its program to 15 new cities with Consize
                      </div>
                      <div className='flex flex-col gap-3 mt-5'>
                        <div className='flex gap-3 items-center'>
                          <div className='flex justify-center items-center h-12 w-12 rounded-full bg-[#ebefec]'>
                            <FaRegClock />
                          </div>
                          <div>
                            300% more students trained in a month
                          </div>
                        </div>
                        <div className='flex gap-3 items-center'>
                          <div className='flex justify-center items-center h-12 w-12 rounded-full bg-[#ebefec]'>
                            <FaRegClock />
                          </div>
                          <div>
                            Course completion rate of 80% achieved
                          </div>
                        </div>
                        <div className='flex gap-3 items-center'>
                          <div className='flex justify-center items-center h-12 w-12 rounded-full bg-[#ebefec]'>
                            <FaRegClock />
                          </div>
                          <div>
                            15 new locations reached
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full md:w-2/5 md:h-[550px] md:py-10 py-3 md:px-5 px-3 flex items-center justify-center'>
                      <div className='h-[250px] rounded-lg w-4/5 shadow-xl bg-white p-5'>
                        <div className='h-16 border-b w-full flex items-center pl-5'>
                          <div className='h-8 w-20'>
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
                        <div className='flex flex-col mt-3 gap-2'>
                          <div className='flex justify-between px-4 items-center h-14 w-full rounded-lg bg-[#ecefec99]'>
                            <div className='text-[#9ca3af]'>Years of operation</div>
                            <div>10 years</div>
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
                About WAVE Academies
              </div>
              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>Overview</div>
                <div className='mt-5'>
                  WAVE (West Africa Vocational Education) is a social venture working with unemployed youth (18-35 year olds) in West Africa. WAVE launched in August 2013 with a focus on screening, training, and placing local West Africans in hospitality and retail jobs in the region.
                </div>
              </div>

              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>The Challenge</div>
                <div className='mt-5'>
                  <p>
                    For the last ten years, WAVE Academies has been helping young people in Lagos, Nigeria to become employable by teaching them in-demand skills and offering job placements in hospitality, service and retail.
                  </p>
                  <p className="mt-5">
                    These young people often from underserved, low-income communities attend physical classes for three weeks, learning soft skills like negotiation, problem-solving and time management alongside skills specific to the retail and hospitality industry like making foods & beverages and housekeeping.
                  </p>
                  <p className="mt-5">
                    In the second half of 2023, the petroleum subsidy in Nigeria was removed, leading to increased transportation costs. Despite WAVE Academies having several training centers across Lagos, Nigeria, it was difficult for its learners to make it to the center every day of the week.
                  </p>
                  <p className="mt-5">
                    WAVE needed a way to expand its reach to these people beyond the confines of physical centers, making learning more accessible than ever before.
                  </p>
                </div>
              </div>

              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>The Solution</div>
                <div className='mt-5'>
                  <p>
                    The Consize team worked with WAVE to understand their unique needs. We converted two of WAVE’s courses: Customer Service 101 and The Art of Negotiation originally in PowerPoint slides into bite-sized content (text and multimedia) delivered via WhatsApp.
                  </p>

                  <p className='mt-5'>
                    The Customer Service course was designed to teach the learners how to manage customers and create memorable experiences for them. The course covered tips on making a good first impression, understanding their needs, talking to customers over the phone, in person, and via chat.
                  </p>

                  <p className='mt-5'>
                    Similarly, the Art of Negotiation course was designed to equip the learners with the essential skills and strategies needed to navigate successful negotiations in both personal and professional contexts. The course covered the negotiation process, tips to know when not to negotiate and essential skills for negotiation.
                  </p>
                  <p className="mt-5">
                    Learners had to dedicate only 10 minutes per day for 5 days to complete the course on WhatsApp.
                  </p>
                </div>
              </div>

              <div className='py-5'>
                <div className={`${fonts.brandFont.className} font-bold text-2xl`}>The Impact</div>
                <div className='mt-5'>
                  <p>
                    In 5 days, 120+ students from Lagos and 15 new locations completed WAVE’s courses delivered on WhatsApp. This represents a 300% increase in the number of students that WAVE would typically train monthly.
                  </p>

                  <div className='md:h-[500px] h-[300px] bg-[#0d1f23;] rounded-lg mt-5 flex'>
                    <div className='flex-1 flex items-center justify-center'>
                      <img src="https://framerusercontent.com/images/F2DW7HRNnenwYKvyPe5RieCnUDw.svg" className='w-[350px] md:h-[380px] md:w-[420px] h-[300px]' alt="" />
                    </div>
                    <div className='w-3/12 bg-[#ffffff0a] hidden md:block pt-5'>
                      <div className='text-[#ffffff80] font-semibold text-sm mb-3 px-3'>
                        NEW LOCATIONS
                      </div>
                      <div className="flex flex-col gap-1 px-5">
                        {locations.map(location => <Location key={location} name={location} />)}
                      </div>
                    </div>
                  </div>

                  <p className='mt-5'>
                    However, we wanted to understand how this new learning method will impact results. Every student was required to take a test after completing both courses. The average performance from the test was 90% indicating an excellent understanding of key concepts in the courses taken. 99.1% of the learners also agreed that the learning method was effective. For WAVE Academics, this represents endless possibilities for the future.
                  </p>

                  <p className='mt-5'>
                    "At WAVE, we believe in unlocking boundless opportunities for the future. As CEO, I emphasize the importance of affordability and accessibility in our operations. Collaborating with Kippa to deliver our courses via WhatsApp has revolutionized our approach. It enables us to extend our reach across Nigeria and ultimately beyond, fostering true scalability of our impact.The entire team is enthusiastic, as we envision multiplying our impact tenfold."
                  </p>
                  <p className='mt-3'>
                    – Molade Adeniyi, CEO, WAVE
                  </p>
                </div>
              </div>



            </div>

          </div>
          {/* case studies */}
          <div className='bg-[#f5f7f5] min-h-[600px] w-full md:pt-20 pt-10 md:pb-0 pb-16'>
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
    </Layout>
  )
}
