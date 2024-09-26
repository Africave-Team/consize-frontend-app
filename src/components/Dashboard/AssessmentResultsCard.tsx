import { QuestionGroupsInterface, TrendStatistics } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import InfoPopover from './InfoPopover'
import { IoMdArrowDropdown } from 'react-icons/io'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useAssessmentResultByCourse, useAssessmentResultsScores } from '@/services/secure.courses.service'
import { delay } from '@/utils/tools'
import { FiX } from 'react-icons/fi'

export default function AssessmentsResultCard ({ questionGroups }: { questionGroups: QuestionGroupsInterface[] }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [size, setSize] = useState("xs")
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)

  const params = useParams()
  const { data: assessmentReport, isLoading } = useAssessmentResultByCourse(params.id)
  const { data: assessmentScores, isLoading: scoresLoading } = useAssessmentResultsScores(selectedAssessment)
  return (
    <>
      <div className='h-20 border rounded-lg hover:shadow-md shadow-sm py-3 px-2 flex-col'>
        <div className='h-8 flex items-center gap-2'>
          <div className='text-gray-900 value font-bold text-xl'>{isLoading ? 0 : assessmentReport && assessmentReport.assessment.length}<span className='text-xs ml-1'>assessments</span></div>
          {assessmentReport && assessmentReport.assessment.length > 0 && <button onClick={onOpen} className='border h-6 hover:bg-gray-100 px-2 text-xs flex justify-center items-center rounded-md'>
            Details
            <IoMdArrowDropdown className='text-sm' />
          </button>}
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>Assessments</span>
          <InfoPopover message={"The cummulated results of all the assessments you added to this course"} />
        </div>
      </div>
      {assessmentReport && assessmentReport.assessment && <Drawer
        isOpen={isOpen}
        placement='right'
        size={"xl"}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Assessments results</DrawerHeader>

          <DrawerBody>
            <div className='w-full h-[90vh] flex gap-5'>
              <div className={`${size === "xs" ? "w-full" : "w-80"} flex flex-col gap-4`}>
                {assessmentReport.assessment.map((assessment, index) => <div onClick={() => {
                  setSize("xl")
                  delay(200).then(() => setSelectedAssessment(assessment._id))
                }} key={`assessment_${index}`} className={`h-20 cursor-pointer flex items-center px-8 border rounded-full ${assessment._id === selectedAssessment && 'bg-[#0D1F23] text-white'}`}>
                  <div>
                    <div className='font-semibold text-lg'>{assessment.title}</div>
                    <div className='flex text-xs gap-10'>
                      <div>{assessment.totalSubmissions} submissions</div>
                      <div>Average score is {assessment.averageScore.toFixed(0)}</div>
                    </div>
                  </div>
                </div>)}
              </div>
              <div className={`transition-all h-[90vh] overflow-y-scroll duration-500 ${size === "xl" ? "!w-[520px]" : "!w-0"}`}>
                {selectedAssessment && <div className='w-full h-full'>
                  <div className='flex justify-end mb-2'>
                    <button onClick={() => {
                      setSize("xs")
                      setSelectedAssessment(null)
                    }} title='Clear' className='h-10 flex justify-center items-center w-10 rounded-full border'>
                      <FiX />
                    </button>
                  </div>

                  <div>
                    {scoresLoading ? <Spinner size={"sm"} /> : <div className=''>
                      {assessmentScores && assessmentScores.assessments.length > 0 ? <>
                        <div className='min-h-14 flex items-center font-semibold border gap-5 p-2'>
                          <div className='w-2/3'>Student name</div>
                          <div>Score</div>
                        </div>
                        {assessmentScores?.assessments.map((student) => <div className='min-h-14 gap-5 flex items-center border cursor-pointer hover:bg-[#0D1F23] hover:text-white p-2'>
                          <div className='w-2/3'>{student.studentDetails.firstName} {student.studentDetails.otherNames}</div>
                          <div>{student.score}/{questionGroups.find(e => e._id === selectedAssessment)?.questions.length}</div>
                        </div>)}
                      </> : <>No submissions found for this assessment</>}
                    </div>}
                  </div>
                </div>}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>}

    </>
  )
}
