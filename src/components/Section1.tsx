import { Button, Icon } from '@chakra-ui/react'
import KippaLogo from './Logo'
import gsap from "gsap"
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React from 'react'
import SampleCourseCTA from './SampleCourseCTA'
import { fonts } from "@/app/fonts"
import { FiArrowRight } from 'react-icons/fi'
import { FaCheck } from 'react-icons/fa6'

gsap.registerPlugin(ScrollTrigger)

export default function Section1 () {

  return (
    <div className='py-10 md:px-14 px-4 md:mt-10 mt-1 min-h-[73vh] flex flex-col gap-10'>
      <div className='h-16 w-full flex justify-center items-center'>
        <div className='font-semibold text-[#0D1F2380] text-[18px]'>How Consize works</div>
      </div>
      <div className='flex justify-center flex-col items-center w-full'>
        <div className={`text-black font-extrabold md:text-[60px] text-3xl text-center  ${fonts.brandFont.className}`}>
          Boost learning retention
        </div>
        <div className={`text-black md:mt-5 -mt-1 font-extrabold md:text-[60px] text-3xl text-center  ${fonts.brandFont.className}`}>
          with daily 10 min bite-sized lessons
        </div>
      </div>
      <div className='h-[850px] md:h-[500px] flex justify-center'>
        <div className='md:w-5/6 w-full flex md:flex-row flex-col gap-3'>
          <div className='md:w-1/2 w-full md:hidden flex h-full items-center justify-center'>

            <div className='w-auto h-96'>
              <img
                decoding="async"
                loading="lazy"
                sizes="480px"
                srcSet="https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png?scale-down-to=512 512w,
 https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png?scale-down-to=1024 1024w,
 https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png 1920w"
                src="https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectPosition: "center",
                  objectFit: "fill",
                  imageRendering: "auto",
                }}
              />
            </div>
          </div>
          <div className='md:w-1/2 w-full md:mt-5 mt-8'>
            <div className='h-96 w-full'>
              <div className='w-[300px] gap-1 border text-xs border-[#eaecf0] rounded-3xl justify-between h-8 bg-[#f4f6f8] flex px-4 items-center'>
                <img loading="lazy" src="/assets/pyramid-5.png" className='h-5 w-5 -mt-2' alt="" />
                <div className='text-[#334155] font-medium'>
                  <span className='md:hidden'>Upload or build</span>
                  <span className='md:block hidden'>Upload or build with a template</span>
                </div>
                <div className='cursor-pointer font-semibold text-[#334155] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
              </div>

              <div className={`font-bold md:mt-2 mt-5 md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                Create your course from
              </div>
              <div className={`font-bold md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                scratch with minimal effort
              </div>

              <div className='flex flex-col mt-4 gap-6 md:text-base text-sm'>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Upload and convert your training materials (PDF, Word, PPT) into impactful bite-sized lessons.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Use generative AI to create your course from scratch in just a few clicks.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Access and customize from our extensive course library of 100+ courses and make it yours.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Add personalized assessments and quizzes to improve learning outcomes.</div>
                </div>
              </div>
            </div>
          </div>
          <div className='md:w-1/2 w-full md:flex hidden h-full items-center justify-center'>
            <div className='w-auto h-96'>
              <img
                decoding="async"
                loading="lazy"
                sizes="480px"
                srcSet="https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png?scale-down-to=512 512w,
 https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png?scale-down-to=1024 1024w,
 https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png 1920w"
                src="https://framerusercontent.com/images/bg8l97YKX9gZ5bPSJJ1b3owF8M.png"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectPosition: "center",
                  objectFit: "fill",
                  imageRendering: "auto",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='h-[850px] md:h-[500px] flex justify-center'>
        <div className='md:w-5/6 w-full flex md:flex-row flex-col gap-3'>
          <div className='md:w-1/2 w-full flex h-full items-center justify-center'>

            <div className='w-auto h-96'>
              <img
                decoding="async"
                loading="lazy"
                sizes="480px"
                srcSet="https://framerusercontent.com/images/NOsJNopVdTCmq8tUNmZhknI64Sw.png?scale-down-to=512 512w,https://framerusercontent.com/images/NOsJNopVdTCmq8tUNmZhknI64Sw.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/NOsJNopVdTCmq8tUNmZhknI64Sw.png 1920w"
                src="https://framerusercontent.com/images/NOsJNopVdTCmq8tUNmZhknI64Sw.png"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectPosition: "center",
                  objectFit: "fill",
                  imageRendering: "auto",
                }}
              />
            </div>
          </div>
          <div className='md:w-1/2 w-full md:mt-5 mt-8'>
            <div className='h-96 w-full'>
              <div className='w-[300px] gap-1 border text-xs border-[#eaecf0] rounded-3xl justify-between h-8 bg-[#f4f6f8] flex px-4 items-center'>
                <img loading="lazy" src="/assets/pyramid-5.png" className='h-5 w-5 -mt-2' alt="" />
                <div className='text-[#334155] font-medium'>
                  <span className='md:hidden'>Upload or build</span>
                  <span className='md:block hidden'>Upload or build with a template</span>
                </div>
                <div className='cursor-pointer font-semibold text-[#334155] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
              </div>

              <div className={`font-bold md:mt-2 mt-5 md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                Create your course from
              </div>
              <div className={`font-bold md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                scratch with minimal effort
              </div>

              <div className='flex flex-col mt-4 gap-6 md:text-base text-sm'>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Upload and convert your training materials (PDF, Word, PPT) into impactful bite-sized lessons.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Use generative AI to create your course from scratch in just a few clicks.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Access and customize from our extensive course library of 100+ courses and make it yours.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Add personalized assessments and quizzes to improve learning outcomes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='h-[850px] md:h-[500px] flex justify-center'>
        <div className='md:w-5/6 w-full flex md:flex-row flex-col gap-3'>
          <div className='md:w-1/2 w-full md:hidden flex h-full items-center justify-center'>

            <div className='w-auto h-96'>
              <img
                decoding="async"
                loading="lazy"
                sizes="480px"
                srcSet="https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png?scale-down-to=512 512w,https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png 1920w" src="https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectPosition: "center",
                  objectFit: "fill",
                  imageRendering: "auto",
                }}
              />
            </div>
          </div>
          <div className='md:w-1/2 w-full md:mt-5 mt-8'>
            <div className='h-96 w-full'>
              <div className='w-[300px] gap-1 border text-xs border-[#eaecf0] rounded-3xl justify-between h-8 bg-[#f4f6f8] flex px-4 items-center'>
                <img loading="lazy" src="/assets/pyramid-5.png" className='h-5 w-5 -mt-2' alt="" />
                <div className='text-[#334155] font-medium'>
                  <span className='md:hidden'>Upload or build</span>
                  <span className='md:block hidden'>Upload or build with a template</span>
                </div>
                <div className='cursor-pointer font-semibold text-[#334155] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
              </div>

              <div className={`font-bold md:mt-2 mt-5 md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                Create your course from
              </div>
              <div className={`font-bold md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                scratch with minimal effort
              </div>

              <div className='flex flex-col mt-4 gap-6 md:text-base text-sm'>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Upload and convert your training materials (PDF, Word, PPT) into impactful bite-sized lessons.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Use generative AI to create your course from scratch in just a few clicks.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Access and customize from our extensive course library of 100+ courses and make it yours.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Add personalized assessments and quizzes to improve learning outcomes.</div>
                </div>
              </div>
            </div>
          </div>
          <div className='md:w-1/2 w-full md:flex hidden h-full items-center justify-center'>
            <div className='w-auto h-96'>
              <img
                decoding="async"
                loading="lazy"
                sizes="480px"
                srcSet="https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png?scale-down-to=512 512w,https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png 1920w" src="https://framerusercontent.com/images/Ld5VTfgGZsAfF7LeNdS5nlppdJE.png"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectPosition: "center",
                  objectFit: "fill",
                  imageRendering: "auto",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='h-[850px] md:h-[500px] flex justify-center'>
        <div className='md:w-5/6 w-full flex md:flex-row flex-col gap-3'>
          <div className='md:w-1/2 w-full flex h-full items-center justify-center'>

            <div className='w-auto h-96'>
              <img
                decoding="async"
                loading="lazy"
                sizes="600px"
                srcSet="https://framerusercontent.com/images/181trh9QZB2AryqJX67MxTMgF8.png?scale-down-to=512 512w,https://framerusercontent.com/images/181trh9QZB2AryqJX67MxTMgF8.png 600w"
                src="https://framerusercontent.com/images/181trh9QZB2AryqJX67MxTMgF8.png"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectPosition: "center",
                  objectFit: "fill",
                  imageRendering: "auto",
                }}
              />
            </div>
          </div>
          <div className='md:w-1/2 w-full md:mt-5 mt-8'>
            <div className='h-96 w-full'>
              <div className='w-[300px] gap-1 border text-xs border-[#eaecf0] rounded-3xl justify-between h-8 bg-[#f4f6f8] flex px-4 items-center'>
                <img loading="lazy" src="/assets/pyramid-5.png" className='h-5 w-5 -mt-2' alt="" />
                <div className='text-[#334155] font-medium'>
                  <span className='md:hidden'>Upload or build</span>
                  <span className='md:block hidden'>Upload or build with a template</span>
                </div>
                <div className='cursor-pointer font-semibold text-[#334155] underline flex items-center gap-1'>Try it <FiArrowRight className='font-bold' /></div>
              </div>

              <div className={`font-bold md:mt-2 mt-5 md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                Create your course from
              </div>
              <div className={`font-bold md:text-5xl text-4xl ${fonts.brandFont.className}`}>
                scratch with minimal effort
              </div>

              <div className='flex flex-col mt-4 gap-6 md:text-base text-sm'>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Upload and convert your training materials (PDF, Word, PPT) into impactful bite-sized lessons.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Use generative AI to create your course from scratch in just a few clicks.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Access and customize from our extensive course library of 100+ courses and make it yours.</div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div>
                    <div className='rounded-full h-7 w-7 border-[3px] border-[#0de854] flex justify-center items-center'>
                      <FaCheck className='text-[#0de854] font-bold text-sm' />
                    </div>
                  </div>
                  <div>Add personalized assessments and quizzes to improve learning outcomes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
