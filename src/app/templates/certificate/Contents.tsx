'use client'
import localFont from 'next/font/local'
import { Norican, Kristi } from 'next/font/google'
import React, { useState } from 'react'
import "./styles.css"
import moment from 'moment'
const myFont = localFont({ src: './gilsans.ttf' })
const cloisterFont = localFont({ src: './CloisterBlack.ttf' })
const culpa = localFont({ src: './helvetica.ttf' })
const antique = localFont({ src: './antique.ttf' })
const sequel = localFont({ src: './sequel.ttf' })
const rationell = localFont({ src: './rationell.otf' })

interface DataInterface {
  studentName: string
  courseName: string
  organizationName: string
  signature1: string
  signatory1: string
  signature2: string
  signatory2: string
  logoUrl: string
}

export default function PageContents ({ details }: { details: DataInterface }) {
  const [bgUrl] = useState("https://storage.googleapis.com/kippa-cdn-public/microlearn-certificate-assets/new-certificate.png")
  return (
    <div className='h-screen'>
      {!details.organizationName.toLowerCase().includes('wave') ?
        <div className="template">
          <img className="template-image"
            alt="Description of the image" id="template-image"
            src={bgUrl} />
          <div className="to-cetrify">
            This is to certify that
          </div>
          <div className="name w-full" id="name">
            {details.studentName}
          </div>
          <div className="certificate-text">
            Is hereby awarded the certificate of achievement for the successful completion of the
            <span className="course-name pl-1" id="courseName">{details.courseName}</span> course
            offered by <span className="course-provider" id="organizationName">{details.organizationName}</span>

          </div>
          <div className="logo">
            <img className="logo-image" alt="logo" id="logo-image"
              src={details.logoUrl} />
          </div>
          <div className="representative1">
            <span id="signature1">{details.signature1}</span> <br />
            <span id="name1">{details.signatory1}</span>

          </div>
          <div className="representative2">
            <span id="signature2">{details.signature2}</span> <br />
            <span id="name2">{details.signatory2}</span>

          </div>
        </div>
        : <div className='template h-[610px] overflow-y-hidden'>
          <div className="relative">
            <div className='absolute top-0 left-0 h-full w-full'>
              <div className='flex justify-between'>
                <img className="" alt="logo" id="logo-image"
                  src="/wave-stripe.svg" />

                <div className='w-full flex justify-end px-20 py-10'>
                  <img className="h-12 w-36" alt="logo" id="logo-image"
                    src={details.logoUrl} />
                </div>
              </div>
            </div>
            <div className='absolute top-0 left-0 h-full w-full py-20'>

              <div className='w-full flex flex-col mt-8 mb-8 justify-center'>
                <div className={`uppercase text-2xl tracking-widest text-[#0095FA] ${culpa.className}`}>Certificate of </div>
                <div className={`text-8xl tracking-wide font-extrabold ${cloisterFont.className} text-[#003399]`}>Completion</div>
              </div>

              <div className={`mt-8 text-center font-medium text-[#F44336] uppercase ${antique.className}`}>
                Presented to
              </div>

              <div className='w-full flex justify-center mt-5'>
                <div className={`min-w-3/5 px-5 tracking-wider border-b-2 border-b-black font-extrabold text-4xl uppercase ${sequel.className}`}>
                  {details.studentName}
                </div>
              </div>

              <div className={``}>
                <div className='text-center text-[#003399] font-semibold text-lg mt-1'>
                  In completion of the WAVE&apos;S skills training program with mandatory courses
                </div>
                <div className='min-h-14 text-[#003399] w-full flex justify-center'>
                  <div className='w-3/5 px-3 text-base'>
                    in {details.courseName}
                  </div>
                </div>
              </div>
              <div className='w-full flex justify-center mt-0'>
                <div className='min-w-60 h-10'>
                  <div className={`w-full mb-2 text-center uppercase font-medium text-[#F44336] ${antique.className}`}>
                    Dated this
                  </div>
                  <div className={`border-b-2 border-b-black pb-1 uppercase text-xl font-extrabold ${culpa.className}`}>
                    {moment().format('Do MMMM, YYYY')}
                  </div>
                  <div className={`font-bold text-lg text-[#003399] ${myFont.className}`}>
                    www.waveacademies.org
                  </div>
                </div>
              </div>

              <div className='w-full mt-8 flex justify-center gap-20'>
                <div className='w-1/3 flex'>
                  <div className='w-2/3'>
                    <div className={`border-b py-1 text-base uppercase border-b-black border-dashed`}>
                      {details.signatory1}
                    </div>
                    <div className='text-[#003399]'>Executive Secretary</div>
                  </div>
                </div>
                <div className='w-1/3 flex justify-end'>
                  <div className='w-2/3'>
                    <div className={`border-b py-1 text-base uppercase border-b-black border-dashed`}>
                      {details.signatory2}
                    </div>
                    <div className='text-[#003399]'>Director</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>
  )
}
