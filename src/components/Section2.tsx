import React from 'react'
import KippaLogo from './Logo'
import { fonts } from "@/app/fonts"
import { FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

export default function Section2 () {
  return (
    <div className=''>
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
      <div className='min-h-[550px] pb-16 bg-white'>
        <div className='flex justify-center items-center flex-col h-[400px]'>

          <div className='w-auto md:w-[350px] mt-8 gap-1 border text-xs border-[#eaecf0] rounded-3xl justify-between h-8 bg-[#f4f6f8] flex px-4 items-center'>
            <KippaLogo fillText='#334155' className='h-3' />
            <div className='text-[#334155] font-regular'>
              <span className='md:hidden'>Free to try forever</span>
              <span className='md:block hidden'>Free to try for as long as you like</span>
            </div>
            <div className='cursor-pointer font-semibold text-[#334155] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
          </div>
          <div className={`mt-3 w-[520px] md:text-[57px] text-center text-[45px] font-bold ${fonts.brandFont.className}`}>
            Learners are already
          </div>
          <div className={`-mt-5 w-[500px] md:text-[57px] text-center text-[45px] font-bold ${fonts.brandFont.className}`}>
            seeing great results
          </div>
          <Link href={`/courses/${process.env.NEXT_PUBLIC_SAMPLE_COURSE}?tryout=true`} className='bg-primary-app rounded-3xl h-10 mt-4 py-3 px-6 font-medium text-sm'>
            Try a sample course
          </Link>
        </div>

        <div className='flex justify-center gap-5 md:flex-row flex-col px-5 md:px-2'>
          <div className='w-full bg-[#f8f8f8] md:w-[420px] rounded-lg min-h-20 p-5'>
            <div className={`${fonts.brandFont.className} !font-bold text-4xl text-[#6665dd]`}>20+ Hours</div>
            <div className='text-sm mt-2'>By focusing on outcomes, Consize condenses learning into the essentials and saves <strong>20+ hours</strong> per learner annually.</div>
          </div>
          <div className='w-full bg-[#f8f8f8] md:w-[420px] rounded-lg min-h-20 p-5'>
            <div className={`${fonts.brandFont.className} !font-bold text-4xl text-[#6665dd]`}>2.5x</div>
            <div className='text-sm mt-2'>Most critical learning needed on a day-to-day basis does not belong in an LMS. Witness direct impact from faster change management and greater performance lift by delivering learning that users can readily reach.</div>
          </div>
          <div className='w-full bg-[#f8f8f8] md:w-[420px] rounded-lg min-h-20 p-5'>
            <div className={`${fonts.brandFont.className} !font-bold text-4xl text-[#6665dd]`}>675</div>
            <div className='text-sm mt-2'>Most critical learning needed on a day-to-day basis does not belong in an LMS. Witness direct impact from faster change management and greater performance lift by delivering learning that users can readily reach.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
