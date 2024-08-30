import { Course, EnrollmentField, LearnerGroup, LearnerGroupPayload, Student, StudentDataForm } from '@/type-definitions/secure.courses'
import { Checkbox, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Select, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import FileUploader from '../FileUploader'
import { RowData, exportSampleData } from '@/utils/generateExcelSheet'
import { useFormik } from 'formik'
import Datetime from 'react-datetime'
import DragAndDropUpload from '../Uploader'
import { Timezones } from '@/utils/timezones'
import parseFile from '@/utils/parseFile'
import { toCamelCase } from '@/utils/string-formatters'
import { addLearnerGroup, bulkAddStudents, removeLearnerGroup, updateSettings } from '@/services/secure.courses.service'
import { v4 } from 'uuid'
import moment from 'moment'
import GroupEnrollmentSchedule from './GroupEnrollmentSchedule'
import ViewMembers from './ViewMembers'
import { FiTrash2 } from 'react-icons/fi'
import CreateCohort from '../Dashboard/CreateCohorts'
import { deleteCourseCohort, getCourseCohorts } from '@/services/cohorts.services'
import { useQuery } from '@tanstack/react-query'
import { CohortsInterface } from '@/type-definitions/cohorts'
import { queryClient } from '@/utils/react-query'
import { Distribution } from '@/type-definitions/callbacks'
interface FilePreview {
  file: File
}

interface ApiResponse {
  data: CohortsInterface[]
  message: string
}




function IndividualMember ({ student, className }: { student: Student, className?: string }) {
  return (
    <div className={className}>{student ? student.firstName.slice(0, 1) : 'T'}</div>
  )
}


export default function LearnerGroups ({ groups, settingsId, course, maxEnrollments, refetch, fields }: { groups: LearnerGroup[], maxEnrollments: number, fields: EnrollmentField[], course: Course, settingsId: string, refetch: () => Promise<any> }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const toast = useToast()

  const loadData = async function (payload: { course: string }) {
    const data = await getCourseCohorts(payload.course, Distribution.WHATSAPP)
    return data
  }

  const { data, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['cohorts', course.id],
      queryFn: () => loadData({ course: course.id })
    })

  const handleDeleteItem = async function (id: string) {
    let lding = { ...loading }
    lding[id] = true
    setLoading(lding)
    await deleteCourseCohort(id)
    queryClient.invalidateQueries({ queryKey: ["cohorts", course.id] })
    lding[id] = false
    setLoading(lding)
  }

  return (
    <div>
      <div className='rounded-lg w-full h-full'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='font-medium text-sm'>Learner groups</h1>
            <div className='text-[#64748B] text-sm'>Lists of students enroled for this course</div>
          </div>
          <div className='flex items-center'>
          </div>
        </div>
        {data && data.data && <div className='flex flex-col gap-3 mt-3'>
          {data?.data.map((group, i) => (
            <div key={`group_${i}`} className='h-16 w-full hover:bg-gray-100 select-none px-3 items-center flex gap-4'>
              <div className='w-24 relative -mt-12'>
                {group.members.length > 2 ? group.members.slice(0, 2).map((student, index) => {
                  return <IndividualMember key={student.email} className={`${index === 0 ? 'left-0 bg-green-300' : 'left-7 bg-gray-700'} top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-semibold text-lg text-white`} student={student} />
                }) : group.members.map((student, index) => {
                  return <IndividualMember key={student.email} className={`${index === 0 ? 'left-0 bg-green-300' : 'left-7 bg-gray-700'} top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-semibold text-lg text-white`} student={student} />
                })}
                {group.members.length > 2 && <div className='left-14 top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-bold text-sm bg-white'>+{group.members.length - 2}</div>}
              </div>
              <div className='flex flex-col gap-1 flex-1 justify-center'>
                <div className='text-sm font-bold'>{group.name}</div>
                <div className='text-sm font-medium text-[#64748B] -mt-1'>{group.members.length} members</div>
              </div>
              <div className='w-32 h-full flex gap-1 items-center'>
                <GroupEnrollmentSchedule group={group} />
                <ViewMembers members={group.members} />
                <button disabled={loading[group.id]} onClick={() => handleDeleteItem(group.id)} className='h-12 w-10 flex justify-center items-center'>
                  {loading[group.id] ? <Spinner size={'sm'} /> : <FiTrash2 />}
                </button>
              </div>
            </div>
          ))}
        </div>}

        <button onClick={onOpen} className='border w-full rounded-md py-2 mt-4 justify-center items-center text-primary-500 font-medium flex gap-2'>
          <AiOutlinePlus className='font-semibold' />
          <span className='text-sm'>Add learner group</span>
        </button>
      </div>


      {isOpen && <Modal isCentered size={{ md: '3xl', base: 'full' }} onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent className=''>
          <ModalBody>
            <CreateCohort onClose={onClose} course={course} hideLink={true} />
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
