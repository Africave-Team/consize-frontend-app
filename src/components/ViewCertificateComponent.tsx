'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import "../app/templates/certificate/styles.css"
import moment from 'moment'
import Logo from '@/components/Logo'
import { fonts } from '@/app/fonts'
import { CertificateComponent, CertificatesInterface, ComponentTypes } from '@/type-definitions/cert-builder'
const myFont = fonts.gilsnas
const cloisterFont = fonts.cloisterFont
const culpa = fonts.culpa
const antique = fonts.antique
const sequel = fonts.sequel
const theseasons = fonts.theseasons
const sloop = fonts.sloop

import { Rnd } from 'react-rnd'
import TextContent from '@/components/CertificateElements/TextContent'
import Circle from '@/components/CertificateElements/Circle'
import SignatureBox from '@/components/CertificateElements/SignatureBox'
import ImageBox from '@/components/CertificateElements/Image'
import Trapezoid from '@/components/CertificateElements/Trapezoid'
import Triangle from '@/components/CertificateElements/Triangle'
import Box from '@/components/CertificateElements/Box'
import { fetchOpenCertificateByID } from '@/services/certificates.services'
import { useQuery } from '@tanstack/react-query'

interface DataInterface {
  studentName: string
  courseName: string
  organizationName: string
  signature1: string
  signatory1: string
  signature2: string
  signatory2: string
  logoUrl: string
  certificateId: string
  template: boolean
}

export default function ViewCertificateComponent ({ details }: { details: DataInterface }) {
  const [bgUrl] = useState("https://storage.googleapis.com/kippa-cdn-public/microlearn-certificate-assets/new-certificate.png")
  const [certificateContents, setCertificateContents] = useState<ReactNode>(<></>)

  const loadData = async function (id: string) {
    const result = await fetchOpenCertificateByID(id)
    return result.data
  }

  const { data: certificateInfo, isFetching } =
    useQuery<CertificatesInterface>({
      enabled: (details.certificateId.length > 0 && !details.template),
      queryKey: ['certificate', { id: details.certificateId }],
      queryFn: () => loadData(details.certificateId)
    })


  const renderComponent = function (data: CertificateComponent) {
    let component = <div></div>
    switch (data.type) {
      case ComponentTypes.DATE:
        component = <TextContent text={data.properties.text} border={data.properties.border} height={"auto"} width={data.properties.width || 100} />
        break
      case ComponentTypes.TEXT:
      case ComponentTypes.COURSE:
        component = <TextContent text={data.properties.text} border={data.properties.border} height={"auto"} width={data.properties.width || 100} />
        break

      case ComponentTypes.NAME:
        component = <TextContent text={data.properties.text} border={data.properties.border} height={data.properties.height || 40} width={data.properties.width || 100} />
        break
      case ComponentTypes.SIGNATORY:
        component = <SignatureBox url={data.properties.url} border={data.properties.border} radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} />
        break
      case ComponentTypes.CIRCLE:
        component = <Circle size={data.properties.size || 100} color={data.properties.color || '#000'} />
        break

      case ComponentTypes.IMAGE:
        component = <ImageBox url={data.properties.url} radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} />
        break
      case ComponentTypes.TRAPEZOID:
        component = <Trapezoid leftSize={data.properties.leftSize || 0} rightSize={data.properties.rightSize || 130} bottomSize={data.properties.bottomSize || 100} width={data.properties.width || 200} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.TRIANGLE:
        component = <Triangle leftSize={data.properties.leftSize || 100} rightSize={data.properties.rightSize || 100} bottomSize={data.properties.bottomSize || 120} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.SQUARE:
        component = <Box radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 100} width={data.properties.width || 100} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.RECTANGLE:
        component = <Box radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} color={data.properties.color || '#000'} />
        break
      default:
        break
    }

    return component
  }


  const generateContent = function (data: DataInterface, certificate?: CertificatesInterface | null) {
    if (data.certificateId) {
      if (data.template) {
        console.log("TEMPLATE")
        if (data.certificateId === "8423c983-12dd-42d5-83fc-4579f22e48c4") {
          return (
            <>
              <div className='template h-[610px] overflow-y-hidden'>
                <div className="relative">
                  <div className='absolute top-0 left-0 h-full w-full'>
                    <div className='flex justify-between'>
                      <img className="" alt="logo" id="logo-image"
                        src="/wave-stripe.svg" />

                      <div className='w-full flex justify-end px-20 py-10'>
                        <img className="h-16 w-16" alt="logo" id="logo-image"
                          src={details.logoUrl || "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Screenshot_2023-12-21_at_7.42.24_PM-removebg-preview.png"} />
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
              </div>
            </>
          )
        } else if (data.certificateId === "2b3b1a9f-4867-4895-bd57-e6bbb99bd6ad") {
          return (
            <>
              <div className={`${fonts.montserrat.className} template h-[710px] overflow-y-hidden`}>
                <div className="relative">
                  <div className='absolute top-0 left-0 h-[710px] w-full border'>
                    <img src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728045234124.32" alt="" className='h-full w-full' />
                  </div>

                  <div className='absolute top-0 left-0 h-full w-full py-20'>

                    <div className='w-full flex flex-col mt-2 mb-8 justify-center'>
                      <div className={`uppercase text-[53.4px] font-semibold tracking-widest text-primary-dark ${theseasons.className}`}><span className={`uppercase text-8xl font-semibold -mr-2 ${sloop.className}`}>C</span>ertificate </div>
                      <div className={`text-[25.5px] uppercase ml-7 tracking-wide font-semibold ${theseasons.className} -mt-5 text-primary-dark`}>of Completion</div>
                    </div>

                    <div className={`mt-8 text-center font-medium text-lg text-primary-dark`}>
                      This certificate is awarded to
                    </div>

                    <div className='w-full flex justify-center mt-2'>
                      <div className={`min-w-6/12 px-20 tracking-wider border-b-2 border-b-black font-extrabold text-3xl capitalize`}>
                        {details.studentName}
                      </div>
                    </div>

                    <div className={``}>
                      <div className='text-center text-primary-dark font-medium text-lg mt-2'>
                        upon the completion of the self-paced course
                      </div>
                      <div className='text-primary-dark w-full flex justify-center mt-2'>
                        <div className='min-w-3/5 px-3 font-extrabold text-3xl uppercase'>
                          {details.courseName}
                        </div>
                      </div>
                      <div className='text-center text-primary-dark font-medium text-lg mt-1'>
                        given on this day {moment().format('Do MMMM, YYYY')}.
                      </div>
                    </div>

                    <div className='w-full flex mt-16 gap-8 justify-center'>
                      <div className='w-1/5 flex justify-center items-center flex-col'>
                        <div className={`border-b-2 py-1 text-base uppercase border-b-black w-40 flex justify-center`}>
                          <img src={details.signature1} className='h-16 w-28' alt="signature 1" />
                        </div>
                        <div className='text-primary-dark mt-3 text-base uppercase font-bold'>{details.signatory1}</div>
                        <div className='text-sm'>Dean & Director</div>
                        <div className='text-sm'>The FATE School</div>
                      </div>
                      <div className='w-1/6 flex justify-center items-center'>
                        <img src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728045526319.35" className='h-36' alt="" />
                      </div>
                      <div className='w-1/5 flex justify-center flex-col items-center'>
                        <div className={`border-b-2 py-1 text-base uppercase border-b-black w-40 flex justify-center`}>
                          <img src={details.signature2} className='h-16 w-28' alt="signature 2" />
                        </div>
                        <div className='text-primary-dark mt-3 text-base uppercase font-bold'>{details.signatory2}</div>
                        <div className='text-sm'>Executive Director</div>
                        <div className='text-sm'>FATE Foundation</div>
                      </div>
                    </div>
                  </div>
                  <div className='absolute top-0 left-0 w-full h-40 flex justify-between pt-10 px-10'>
                    <img className='h-16' src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728047978762.19" alt="" />
                    <img className='h-16' src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728048011007.19" alt="" />
                  </div>
                </div>
              </div>
            </>
          )
        } else if (data.certificateId === "cb10515f-ce4c-42db-ae6a-2b0afe35c75f") {
          return (
            <>
              <div className={`${fonts.montserrat.className} template h-[750px] overflow-y-hidden`}>
                <div className="relative">
                  <div className='absolute top-0 left-0 h-[750px] w-full'>
                    <img src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728045234124.32" alt="" className='h-full w-full' />
                  </div>

                  <div className='absolute top-0 left-0 h-full w-full py-20'>

                    <div className='w-full flex flex-col mt-2 mb-8 justify-center'>
                      <div className={`uppercase text-[53.4px] font-semibold tracking-widest text-primary-dark ${theseasons.className}`}><span className={`uppercase text-8xl font-semibold -mr-2 ${sloop.className}`}>C</span>ertificate </div>
                      <div className={`text-[25.5px] uppercase ml-7 tracking-wide font-semibold ${theseasons.className} -mt-5 text-primary-dark`}>of Completion</div>
                    </div>

                    <div className={`mt-8 text-center font-medium text-lg text-primary-dark`}>
                      This certificate is awarded to
                    </div>

                    <div className='w-full flex justify-center mt-2'>
                      <div className={`min-w-6/12 px-20 tracking-wider border-b-2 border-b-black font-extrabold text-3xl capitalize`}>
                        {details.studentName}
                      </div>
                    </div>

                    <div className={``}>
                      <div className='text-center text-primary-dark font-medium text-lg mt-2'>
                        upon the completion of the self-paced course
                      </div>
                      <div className='text-primary-dark w-full flex justify-center mt-2'>
                        <div className='min-w-3/5 px-3 font-extrabold text-3xl uppercase'>
                          {details.courseName}
                        </div>
                      </div>
                      <div className='text-center text-primary-dark font-medium text-lg mt-1'>
                        given on this day {moment().format('Do MMMM, YYYY')}.
                      </div>
                    </div>

                    <div className='w-full flex mt-16 gap-8 justify-center'>
                      <div className='w-1/5 flex justify-center items-center flex-col'>
                        <div className={`border-b-2 py-1 text-base uppercase border-b-black w-40 flex justify-center`}>
                          <img src={details.signature1} className='h-16 w-28' alt="signature" />
                        </div>
                        <div className='text-primary-dark mt-3 text-base uppercase font-bold'>{details.signatory1}</div>
                        <div className='text-sm'>Dean & Director</div>
                        <div className='text-sm'>The FATE School</div>
                      </div>
                      <div className='w-1/6 flex justify-center items-center'>
                        <img src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728045526319.35" className='h-36' alt="" />
                      </div>
                      <div className='w-1/5 flex justify-center flex-col items-center'>
                        <div className={`border-b-2 py-1 text-base uppercase border-b-black w-40 flex justify-center`}>
                          <img src={details.signature2} className='h-16 w-28' alt="signature" />
                        </div>
                        <div className='text-primary-dark mt-3 text-base uppercase font-bold'>{details.signatory2}</div>
                        <div className='text-sm'>Executive Director</div>
                        <div className='text-sm'>FATE Foundation</div>
                      </div>
                    </div>

                    <div className='w-full mt-5 flex justify-center'>
                      With support from
                    </div>
                    <div className='w-full flex -mt-4 justify-center'>
                      <img src={"https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1730203054550.svg"} className='h-16 w-28' alt="partner-logo" />
                    </div>
                  </div>
                  <div className='absolute top-0 left-0 w-full h-40 flex justify-between pt-10 px-10'>
                    <img className='h-16' src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728047978762.19" alt="" />
                    <img className='h-16' src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728048011007.19" alt="" />
                  </div>
                </div>
              </div>
            </>
          )
        } else if (data.certificateId === "71bbefa8-1c7b-4c4e-be22-03cf44917a38") {
          return (
            <div className="template h-[700px] w-full relative">
              <div className='h-full absolute left-0 right-0 bg-primary-app flex justify-center items-center'>
                <div className='bg-white h-[635px] rounded-3xl w-11/12'>

                </div>
              </div>
              <div className='absolute top-0 bg-white left-0 h-[510px] w-2/5'></div>
              <div className='absolute bottom-0 bg-white right-0 h-[510px] w-2/5'></div>
              <div className='h-full absolute left-0 right-0 flex justify-center items-center'>
                <div className='bg-white h-[585px] rounded-3xl w-11/12 py-8 px-16'>
                  <div className='flex h-20'>
                    <div className='h-20 w-20 rounded-full bg-gray-200 flex justify-center items-center'>
                      <img src="/icon.svg" className='h-6 w-6 md:mt-0 mt-2' alt="" />
                    </div>
                  </div>

                  <div className='flex flex-col items-start mt-7'>
                    <div className={`uppercase font-bold text-3xl ${fonts.brandFont.className}`}>Certificate of completion</div>
                    <div className='font-medium text-xl mt-2'>This is to certify that</div>
                  </div>
                  <div className='flex flex-col w-full items-start mt-2'>
                    <div className={`h-14 px-1 border-b w-4/5 border-b-primary-dark text-start text-4xl pb-1 flex items-end uppercase ${fonts.brandFont.className}`}>
                      {data.studentName}
                    </div>
                  </div>
                  <div className={`w-4/5 text-lg mt-2 text-start font-extralight`}>has successfully completed the
                    <span className={`font-bold ml-2  ${fonts.brandFont.className} text-xl`}>"{data.courseName}"</span> course offered by {data.organizationName}
                  </div>

                  <div className={`flex gap-5 mt-7 ${fonts.brandFont.className}`}>
                    <div className='font-semibold text-xl uppercase'>Awarded by</div>
                    <div className='h-14 flex flex-col w-52 px-2'>
                      <div className='h-8 w-full px-2'>
                        <span id="signature1">{details.signature1}</span>
                      </div>
                      <div className='font-semibold text-xl'>
                        {data.signatory1}
                      </div>
                    </div>
                  </div>
                  <div className='flex mt-7 justify-between items-end'>
                    <div className='h-20 w-auto shadow-black-right-bottom border px-6 justify-center flex flex-col rounded-xl border-primary-dark'>
                      <div className='flex justify-start uppercase text-sm'>Date of issue</div>
                      <div className='h-8 w-full border-b text-sm flex items-end px-2 uppercase font-semibold justify-start pb-1 border-b-primary-dark'>
                        {moment().format('Do MMMM, YYYY')}
                      </div>
                    </div>
                    <Logo className='h-6' />
                  </div>
                </div>
              </div>
            </div>
          )
        } else if (data.certificateId === "5a4a899d-9d8f-41d4-8c4c-1556cf1e5046") {
          return (
            <div className="template h-[700px] w-full relative">
              <div className='h-full absolute left-0 right-0 bg-[#E4701E] flex justify-center items-center'>
                <div className='bg-white h-[635px] rounded-3xl w-11/12'>

                </div>
              </div>
              <div className='absolute top-0 bg-white left-0 h-[510px] w-2/5'></div>
              <div className='absolute bottom-0 bg-white right-0 h-[510px] w-2/5'></div>
              <div className='h-full absolute left-0 right-0 flex justify-center items-center'>
                <div className='bg-white h-[585px] rounded-3xl w-11/12 py-8 px-16'>
                  <div className='flex h-20'>
                    <div className='h-10 w-10 rounded-full flex justify-center items-center'>
                      <img src="https://www.care-international.org/themes/custom/hc/assets/images/favicon-32x32.png" className='h-full w-full md:mt-0 mt-2' alt="" />
                    </div>
                  </div>

                  <div className='flex flex-col items-start mt-7'>
                    <div className={`uppercase font-bold text-3xl ${fonts.brandFont.className}`}>Certificate of completion</div>
                    <div className='font-medium text-xl mt-2'>This is to certify that</div>
                  </div>
                  <div className='flex flex-col w-full items-start mt-2'>
                    <div className={`h-14 px-1 border-b w-4/5 border-b-primary-dark text-start text-4xl pb-1 flex items-end uppercase ${fonts.brandFont.className}`}>
                      {data.studentName}
                    </div>
                  </div>
                  <div className={`w-4/5 text-lg mt-2 text-start font-extralight`}>has successfully completed the
                    <span className={`font-bold ml-2  ${fonts.brandFont.className} text-xl`}>"{data.courseName}"</span> course offered by {data.organizationName}
                  </div>

                  <div className={`flex gap-1 items-center mt-7 ${fonts.brandFont.className}`}>
                    <div className='font-semibold text-xl uppercase'>Awarded by</div>
                    <div className='h-8 w-98 px-1'>
                      <span id="" className='font-bold text-2xl'>{details.organizationName}</span>
                    </div>
                  </div>
                  <div className='flex mt-7 justify-between items-end'>
                    <div className='h-20 w-auto shadow-black-right-bottom border px-6 justify-center flex flex-col rounded-xl border-primary-dark'>
                      <div className='flex justify-start uppercase text-sm'>Date of issue</div>
                      <div className='h-8 w-full border-b text-sm flex items-end px-2 uppercase font-semibold justify-start pb-1 border-b-primary-dark'>
                        {moment().format('Do MMM, YYYY').replace("Sep", "Sept")}
                      </div>
                    </div>
                    <img src="https://www.care-international.org/themes/custom/hc/assets//images/logo@2x.png" className='h-10 w-auto' />
                  </div>
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="template h-[650px]">
              <img className="template-image"
                alt="Description of the image" id="template-image"
                src={bgUrl} />
              <div className="to-cetrify">
                This is to certify that
              </div>
              <div className="name w-full capitalize" id="name">
                {details.studentName}
              </div>
              <div className="certificate-text">
                Is hereby awarded the certificate of achievement for the successful completion of the
                <span className="course-name pl-1" id="courseName">{details.courseName}</span> course
                offered by <span className="course-provider" id="organizationName">{details.organizationName}</span>

              </div>
              <div className="logo h-14 w-14">
                {details.logoUrl && <img className="logo-image" alt="logo" id="logo-image"
                  src={details.logoUrl} />}
              </div>
              <div className="representative1">
                <span id="signature1">{details.signature1}</span> <br />
                {/* <span id="name1">{details.signatory1}</span> */}

              </div>
              <div className="representative2">
                <span id="signature2">{details.signature2}</span> <br />
                {/* <span id="name2">{details.signatory2}</span> */}

              </div>
            </div>
          )
        }
      } else {
        if (certificate) {
          let nameIndex = certificate.components.components.findIndex(e => e.type === ComponentTypes.NAME)
          let courseIndex = certificate.components.components.findIndex(e => e.type === ComponentTypes.COURSE)
          if (courseIndex >= 0 && certificate.components && certificate.components.components[courseIndex] && certificate.components.components[courseIndex].properties && certificate.components.components[courseIndex].properties.text) {
            certificate.components!.components[courseIndex]!.properties!.text!.value = data.courseName
          }

          if (nameIndex >= 0 && certificate.components && certificate.components.components[nameIndex] && certificate.components.components[nameIndex].properties && certificate.components.components[nameIndex].properties.text) {
            certificate.components!.components[nameIndex]!.properties!.text!.value = data.studentName
          }
          return <div className='template h-[650px] w-[900px] relative'>

            {certificate.components.bg === "plain" ? <div style={{
              background: certificate.components.components[0].properties.color
            }} className='absolute border top-0 left-0 h-full w-full rounded-2xl'></div> : <img className='absolute top-0 left-0 h-full w-full rounded-md' src={certificate.components.bg} />}
            <div className="rounded-2xl absolute top-0 left-0 w-full h-full">
              <div className={`w-full h-full relative overflow-hidden`}>
                {
                  certificate.components.components.map((comp, index) => {
                    if (comp.type === ComponentTypes.BACKGROUND) {
                      return <div key={`${comp.type}_${index}`} />
                    } else {
                      return <Rnd
                        key={`${comp.type}_${index}`}
                        bounds="parent" // This restricts dragging and resizing to the parent container
                        position={{
                          x: comp.position.x || 100,
                          y: comp.position.y || 100,
                        }}
                        enableResizing={false}
                        className={`absolute`}
                      >
                        <div>{renderComponent(comp)}</div>
                      </Rnd>
                    }
                  })
                }

              </div>
            </div>

          </div>
        } else {
          return (
            <div className="template h-[650px]">
              <img className="template-image"
                alt="Description of the image" id="template-image"
                src={bgUrl} />
              <div className="to-cetrify">
                This is to certify that
              </div>
              <div className="name w-full capitalize" id="name">
                {details.studentName}
              </div>
              <div className="certificate-text">
                Is hereby awarded the certificate of achievement for the successful completion of the
                <span className="course-name pl-1" id="courseName">{details.courseName}</span> course
                offered by <span className="course-provider" id="organizationName">{details.organizationName}</span>

              </div>
              <div className="logo h-14 w-14">
                {details.logoUrl && <img className="logo-image" alt="logo" id="logo-image"
                  src={details.logoUrl} />}
              </div>
              <div className="representative1">
                <span id="signature1">{details.signature1}</span> <br />
                {/* <span id="name1">{details.signatory1}</span> */}

              </div>
              <div className="representative2">
                <span id="signature2">{details.signature2}</span> <br />
                {/* <span id="name2">{details.signatory2}</span> */}

              </div>
            </div>
          )
        }
      }
    } else {
      let company = data.organizationName.toLowerCase()
      if (company.includes("wave")) {
        return (
          <>
            <div className='template h-[610px] overflow-y-hidden'>
              <div className="relative">
                <div className='absolute top-0 left-0 h-full w-full'>
                  <div className='flex justify-between'>
                    <img className="" alt="logo" id="logo-image"
                      src="/wave-stripe.svg" />

                    <div className='w-full flex justify-end px-20 py-10'>
                      <img className="h-16 w-16" alt="logo" id="logo-image"
                        src={details.logoUrl || "https://storage.googleapis.com/kippa-cdn-public/microlearn-images/Screenshot_2023-12-21_at_7.42.24_PM-removebg-preview.png"} />
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
            </div>
          </>
        )
      } else if (company.includes("fate")) {
        return (
          <>
            <div className={`${fonts.montserrat.className} template h-[710px] overflow-y-hidden`}>
              <div className="relative">
                <div className='absolute top-0 left-0 h-[710px] w-full border'>
                  <img src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728045234124.32" alt="" className='h-full w-full' />
                </div>

                <div className='absolute top-0 left-0 h-full w-full py-20'>

                  <div className='w-full flex flex-col mt-2 mb-8 justify-center'>
                    <div className={`uppercase text-[53.4px] font-semibold tracking-widest text-primary-dark ${theseasons.className}`}><span className={`uppercase text-8xl font-semibold -mr-2 ${sloop.className}`}>C</span>ertificate </div>
                    <div className={`text-[25.5px] uppercase ml-7 tracking-wide font-semibold ${theseasons.className} -mt-5 text-primary-dark`}>of Completion</div>
                  </div>

                  <div className={`mt-8 text-center font-medium text-lg text-primary-dark`}>
                    This certificate is awarded to
                  </div>

                  <div className='w-full flex justify-center mt-2'>
                    <div className={`min-w-6/12 px-20 tracking-wider border-b-2 border-b-black font-extrabold text-3xl capitalize`}>
                      {details.studentName}
                    </div>
                  </div>

                  <div className={``}>
                    <div className='text-center text-primary-dark font-medium text-lg mt-2'>
                      upon the completion of the self-paced course
                    </div>
                    <div className='text-primary-dark w-full flex justify-center mt-2'>
                      <div className='min-w-3/5 px-3 font-extrabold text-3xl uppercase'>
                        {details.courseName}
                      </div>
                    </div>
                    <div className='text-center text-primary-dark font-medium text-lg mt-1'>
                      given on this day {moment().format('Do MMMM, YYYY')}.
                    </div>
                  </div>

                  <div className='w-full flex mt-16 gap-8 justify-center'>
                    <div className='w-1/5 flex justify-center items-center flex-col'>
                      <div className={`border-b-2 py-1 text-base uppercase border-b-black w-40 flex justify-center`}>
                        <img src={details.signature1} className='h-16 w-28' alt="signature 1" />
                      </div>
                      <div className='text-primary-dark mt-3 text-base uppercase font-bold'>{details.signatory1}</div>
                      <div className='text-sm'>Dean & Director</div>
                      <div className='text-sm'>The FATE School</div>
                    </div>
                    <div className='w-1/6 flex justify-center items-center'>
                      <img src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728045526319.35" className='h-36' alt="" />
                    </div>
                    <div className='w-1/5 flex justify-center flex-col items-center'>
                      <div className={`border-b-2 py-1 text-base uppercase border-b-black w-40 flex justify-center`}>
                        <img src={details.signature2} className='h-16 w-28' alt="signature 2" />
                      </div>
                      <div className='text-primary-dark mt-3 text-base uppercase font-bold'>{details.signatory2}</div>
                      <div className='text-sm'>Executive Director</div>
                      <div className='text-sm'>FATE Foundation</div>
                    </div>
                  </div>
                </div>
                <div className='absolute top-0 left-0 w-full h-40 flex justify-between pt-10 px-10'>
                  <img className='h-16' src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728047978762.19" alt="" />
                  <img className='h-16' src="https://storage.googleapis.com/kippa-cdn-public/microlearn-images/1728048011007.19" alt="" />
                </div>
              </div>
            </div>
          </>
        )
      } else if (company.includes('consize')) {
        return (
          <div className="template h-[700px] w-full relative">
            <div className='h-full absolute left-0 right-0 bg-primary-app flex justify-center items-center'>
              <div className='bg-white h-[635px] rounded-3xl w-11/12'>

              </div>
            </div>
            <div className='absolute top-0 bg-white left-0 h-[510px] w-2/5'></div>
            <div className='absolute bottom-0 bg-white right-0 h-[510px] w-2/5'></div>
            <div className='h-full absolute left-0 right-0 flex justify-center items-center'>
              <div className='bg-white h-[585px] rounded-3xl w-11/12 py-8 px-16'>
                <div className='flex h-20'>
                  <div className='h-20 w-20 rounded-full bg-gray-200 flex justify-center items-center'>
                    <img src="/icon.svg" className='h-6 w-6 md:mt-0 mt-2' alt="" />
                  </div>
                </div>

                <div className='flex flex-col items-start mt-7'>
                  <div className={`uppercase font-bold text-3xl ${fonts.brandFont.className}`}>Certificate of completion</div>
                  <div className='font-medium text-xl mt-2'>This is to certify that</div>
                </div>
                <div className='flex flex-col w-full items-start mt-2'>
                  <div className={`h-14 px-1 border-b w-4/5 border-b-primary-dark text-start text-4xl pb-1 flex items-end uppercase ${fonts.brandFont.className}`}>
                    {data.studentName}
                  </div>
                </div>
                <div className={`w-4/5 text-lg mt-2 text-start font-extralight`}>has successfully completed the
                  <span className={`font-bold ml-2  ${fonts.brandFont.className} text-xl`}>"{data.courseName}"</span> course offered by {data.organizationName}
                </div>

                <div className={`flex gap-5 mt-7 ${fonts.brandFont.className}`}>
                  <div className='font-semibold text-xl uppercase'>Awarded by</div>
                  <div className='h-14 flex flex-col w-52 px-2'>
                    <div className='h-8 w-full px-2'>
                      <span id="signature1">{details.signature1}</span>
                    </div>
                    <div className='font-semibold text-xl'>
                      {data.signatory1}
                    </div>
                  </div>
                </div>
                <div className='flex mt-7 justify-between items-end'>
                  <div className='h-20 w-auto shadow-black-right-bottom border px-6 justify-center flex flex-col rounded-xl border-primary-dark'>
                    <div className='flex justify-start uppercase text-sm'>Date of issue</div>
                    <div className='h-8 w-full border-b text-sm flex items-end px-2 uppercase font-semibold justify-start pb-1 border-b-primary-dark'>
                      {moment().format('Do MMMM, YYYY')}
                    </div>
                  </div>
                  <Logo className='h-6' />
                </div>
              </div>
            </div>
          </div>
        )
      } else if (company.includes('care international')) {
        return (
          <div className="template h-[700px] w-full relative">
            <div className='h-full absolute left-0 right-0 bg-[#E4701E] flex justify-center items-center'>
              <div className='bg-white h-[635px] rounded-3xl w-11/12'>

              </div>
            </div>
            <div className='absolute top-0 bg-white left-0 h-[510px] w-2/5'></div>
            <div className='absolute bottom-0 bg-white right-0 h-[510px] w-2/5'></div>
            <div className='h-full absolute left-0 right-0 flex justify-center items-center'>
              <div className='bg-white h-[585px] rounded-3xl w-11/12 py-8 px-16'>
                <div className='flex h-20'>
                  <div className='h-10 w-10 rounded-full flex justify-center items-center'>
                    <img src="https://www.care-international.org/themes/custom/hc/assets/images/favicon-32x32.png" className='h-full w-full md:mt-0 mt-2' alt="" />
                  </div>
                </div>

                <div className='flex flex-col items-start mt-7'>
                  <div className={`uppercase font-bold text-3xl ${fonts.brandFont.className}`}>Certificate of completion</div>
                  <div className='font-medium text-xl mt-2'>This is to certify that</div>
                </div>
                <div className='flex flex-col w-full items-start mt-2'>
                  <div className={`h-14 px-1 border-b w-4/5 border-b-primary-dark text-start text-4xl pb-1 flex items-end uppercase ${fonts.brandFont.className}`}>
                    {data.studentName}
                  </div>
                </div>
                <div className={`w-4/5 text-lg mt-2 text-start font-extralight`}>has successfully completed the
                  <span className={`font-bold ml-2  ${fonts.brandFont.className} text-xl`}>"{data.courseName}"</span> course offered by {data.organizationName}
                </div>

                <div className={`flex gap-1 items-center mt-7 ${fonts.brandFont.className}`}>
                  <div className='font-semibold text-xl uppercase'>Awarded by</div>
                  <div className='h-8 w-98 px-1'>
                    <span id="" className='font-bold text-2xl'>{details.organizationName}</span>
                  </div>
                </div>
                <div className='flex mt-7 justify-between items-end'>
                  <div className='h-20 w-auto shadow-black-right-bottom border px-6 justify-center flex flex-col rounded-xl border-primary-dark'>
                    <div className='flex justify-start uppercase text-sm'>Date of issue</div>
                    <div className='h-8 w-full border-b text-sm flex items-end px-2 uppercase font-semibold justify-start pb-1 border-b-primary-dark'>
                      {moment().format('Do MMM, YYYY').replace("Sep", "Sept")}
                    </div>
                  </div>
                  <img src="https://www.care-international.org/themes/custom/hc/assets//images/logo@2x.png" className='h-10 w-auto' />
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="template h-[650px]">
            <img className="template-image"
              alt="Description of the image" id="template-image"
              src={bgUrl} />
            <div className="to-cetrify">
              This is to certify that
            </div>
            <div className="name w-full capitalize" id="name">
              {details.studentName}
            </div>
            <div className="certificate-text">
              Is hereby awarded the certificate of achievement for the successful completion of the
              <span className="course-name pl-1" id="courseName">{details.courseName}</span> course
              offered by <span className="course-provider" id="organizationName">{details.organizationName}</span>

            </div>
            <div className="logo h-14 w-14">
              {details.logoUrl && <img className="logo-image" alt="logo" id="logo-image"
                src={details.logoUrl} />}
            </div>
            <div className="representative1">
              <span id="signature1">{details.signature1}</span> <br />
              {/* <span id="name1">{details.signatory1}</span> */}

            </div>
            <div className="representative2">
              <span id="signature2">{details.signature2}</span> <br />
              {/* <span id="name2">{details.signatory2}</span> */}

            </div>
          </div>
        )
      }
    }
  }

  useEffect(() => {
    if (details && !isFetching) {
      const content = generateContent(details, certificateInfo)
      setCertificateContents(content)
    }
  }, [details, certificateInfo, isFetching])
  return (
    <div className='h-screen certificate-view'>
      {certificateContents}
    </div>
  )
}
