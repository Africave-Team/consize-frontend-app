import React from 'react'
import SampleCourseCTA from './SampleCourseCTA'

export default function Section2 () {
  return (
    <div className='md:px-14 px-4 md:mt-0 mt-96 mb-20'>
      <div className="relative">
        <div className='absolute md:-top-12 -top-24 md:right-16 right-1/3'>
          <img loading='lazy' src="/pyramid2.png" className='h-24' alt="pyramid" />
        </div>
      </div>
      <div className='flex justify-center md:justify-start'>
        <div className="text-2xl md:text-3xl lg:text-4xl text-center md:text-start mt-3 w-[70%] md:w-[35%] py-5">
          <span className="text-black">A learning tool your learners</span>
          <span className="text-primary-500"> will actually use</span>
        </div>
      </div>

      <div className='flex md:flex-row flex-col gap-20 items-center'>
        <div className='w-full md:w-1/2 flex justify-center items-center'>
          <img loading='lazy' src={'/frame-1.webp'} className='' />
        </div>

        <div className='w-full md:w-1/2'>
          <div className="text-2xl md:text-3xl lg:text-4xl text-center md:text-start mt-3 w-full py-5">
            <span className="text-black">Learning</span><br />
            <span className="text-[#14B8A6]"> shouldn&apos;t be a chore</span>
          </div>

          <p className='text-md text-[#334155] w-full md:w-4/5'>Learning tends to be lengthy and often takes place on tools we rarely remember to use. That’s why learners prefer Consize to any other learning method, including in-person training.</p>

          <div className='bg-[#E8EAEE66] bg-opacity-40 md:p-5 px-3 py-2 min-h-[100px] rounded-lg mt-5 w-full md:w-11/12 flex justify-start gap-5'>
            <img loading='lazy' src="/curlies.png" className='h-16' />
            <div>
              <p className='mt-2 text-[#334155]'>
                Consize simplifies content into actionable lessons, quizzes, and nudges using platforms that people use everyday.
              </p>
            </div>
          </div>

          {/* <Button className='text-white bg-primary-500 mt-8 px-5 py-2 rounded-md'>Try a sample course</Button> */}
          <div className="flex md:justify-start justify-center">
            <SampleCourseCTA bg={'bg-primary-500 mt-8'} />
          </div>
        </div>
      </div>


      <div className='flex md:flex-row flex-col items-center'>
        <div className='w-full md:w-1/2'>
          <div className="text-2xl md:text-3xl lg:text-4xl text-center md:text-start mt-3 w-full md:w-[80%] md:py-0 py-5">
            <span className="text-black">Meet learners where they are</span>
            <span className="text-primary-500"> no matter where they are</span>
          </div>

          <p className='text-md text-[#334155] w-full md:w-4/5'>
            Eliminate the friction between learners and learning material.
            That is why outcome metrics via Consize are much higher than any other learning method.
          </p>

          <div className='bg-[#FD86FF]/25 md:p-5 px-3 py-2 min-h-[100px] rounded-lg mt-5 w-full flex justify-start gap-5'>
            <img loading='lazy' src="/wsapp2.png" className='h-16' />
            <div>
              <p className='mt-2 text-[#334155]'>
                Consize injects your learning material into contexts where your learners already spend time, so there are minimal barriers.
              </p>
            </div>
          </div>

          {/* <Button className='text-white bg-primary-500 mt-8 px-5 py-2 rounded-md'>Try a sample course</Button> */}
          <div className="flex md:justify-start justify-center">
            <SampleCourseCTA bg={'bg-primary-500 mt-8'} />
          </div>
        </div>

        <div className='w-full md:w-1/2 flex justify-center items-center  md:py-10'>
          <img loading='lazy' src={'/frame-2.webp'} className='-ml-2 h-[500px]' />
        </div>
      </div>


      <div className='flex md:flex-row flex-col items-center'>
        <div className='w-full md:w-1/2 hidden md:block md:py-10'>
          <img loading='lazy' src={'/frame-3.webp'} className='-ml-3 h-[400px]' />
        </div>

        <div className='w-full md:w-1/2'>
          <div className="text-2xl md:text-3xl lg:text-4xl text-center md:text-start mt-3 w-full py-5">
            <span className="text-black">Launch your course</span><br />
            <span className="text-[#14B8A6]"> in 1 hour</span>
          </div>

          <p className='text-md text-[#334155] w-full md:w-4/5'>
            Use our AI Creator, import and convert your existing materials (PPT, Word, PDF) or create a course from scratch - in 60 minutes
          </p>

          <div className='bg-[#FD86FF]/25 md:p-5 px-3 py-3 min-h-[100px] rounded-lg mt-5 w-full md:w-4/5 flex justify-start gap-5'>
            <img loading='lazy' src="/flat.png" className='h-16' />
            <div>
              <p className='mt-2 text-[#334155]'>
                With Kippa, you can customize your delivery preferences. Launch your
                course to your learners in 1 click.
              </p>
            </div>
          </div>

          {/* <Button className='text-white bg-primary-500 mt-8 px-5 py-2 rounded-md'>Try a sample course</Button> */}
          <div className="flex md:justify-start justify-center">
            <SampleCourseCTA bg={'bg-primary-500 mt-8'} />
          </div>
        </div>
      </div>


      <div className='flex md:flex-row flex-col items-center'>
        <div className='w-full md:w-1/2'>
          <div className="text-2xl md:text-3xl lg:text-4xl text-center md:text-start mt-3 w-full md:w-[80%] py-5">
            <span className="text-black">Learning that</span><br />
            <span className="text-[#F5935F]"> changes behavior</span>
          </div>

          <p className='text-md text-[#334155] w-full md:w-4/5'>
            Most critical learning needed on a day-to-day basis does not belong in an LMS. Witness direct impact from faster change management and greater performance lift by delivering learning that users can readily reach.
          </p>

          <div className='bg-[#E96035]/30 md:p-5 px-3 py-3 min-h-[100px] rounded-lg mt-5 w-full md:w-4/5 flex justify-start gap-5'>
            <img loading='lazy' src="/helix-2.webp" className='h-16' />
            <div>
              <p className='mt-2 text-[#793815]'>
                Deliver context-relevant learning, that learners can revisit anytime with ease
              </p>
            </div>
          </div>

          {/* <Button className='text-white bg-primary-500 mt-8 px-5 py-2 rounded-md'>Try a sample course</Button> */}
          <div className="flex md:justify-start justify-center">
            <SampleCourseCTA bg={'bg-primary-500 mt-8'} />
          </div>
        </div>

        <div className='w-full md:w-1/2 flex justify-center items-center md:py-10'>
          <img loading='lazy' src={'/frame-4.webp'} className='-ml-3 h-[400px]' />
        </div>
      </div>

    </div>
  )
}
