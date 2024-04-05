import { EnrollmentField, LearnerGroup, LearnerGroupPayload, Student, StudentDataForm } from '@/type-definitions/secure.courses'
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
interface FilePreview {
  file: File
}



function IndividualMember ({ student, className }: { student: Student, className?: string }) {
  return (
    <div className={className}>{student ? student.firstName.slice(0, 1) : 'T'}</div>
  )
}

export default function LearnerGroups ({ groups, settingsId, maxEnrollments, refetch, fields }: { groups: LearnerGroup[], maxEnrollments: number, fields: EnrollmentField[], settingsId: string, refetch: () => Promise<any> }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
  const toast = useToast()
  const handleFileChange = async (data: FilePreview) => {
    try {
      if (data.file) {
        setFilePreview(data)
      }
    } catch (error) {
      console.error('Error parsing file:', error)
    }
  }

  const downloadSampleSheet = async function () {
    const tableData: RowData[][] = [
      [
        ...fields.map((field) => {
          return {
            v: field.fieldName,
            t: "s",
            s: {
              font: {
                sz: 15,
                bold: true
              },
            }
          }
        })
      ],
      ...Array(10).fill(0).map((v, index) => {
        return [
          ...fields.map((field) => {
            let value = ''
            if (field.fieldName.toLowerCase().includes('other')) {
              value = 'Robinson'
            } else if (field.fieldName.toLowerCase().includes('first')) {
              value = 'Jack'
            } else if (field.fieldName.toLowerCase().includes('phone')) {
              value = `23481${(new Date().getTime() + index).toString().slice(-8)}'`
            } else if (field.fieldName.toLowerCase().includes('email')) {
              value = 'jack.robinson@mailinator.com'
            } else[
              value = `Example ${field.fieldName}`
            ]
            return {
              v: value,
              t: "s",
            }
          })
        ]
      })
    ]

    exportSampleData({ name: 'sample-learner-groups-consize.com', tableData })
  }

  const handleParseFile = async () => {
    try {
      if (filePreview?.file) {
        const data: any[] = await parseFile(filePreview?.file, fields)
        const total = groups.reduce((acc, curr) => acc + curr.members.length, 0)
        if (data.length + total > maxEnrollments) {
          toast({
            title: 'Maximum enrollments breached',
            description: `The group you added breaches the maximum enrollment limit for this course. Please add not more than ${maxEnrollments - total} learners in this group or increase the maximum enrollment limit in the "course metadata" section`,
            status: 'error',
            duration: 10000,
            isClosable: true,
          })
          return

        }
        const studentsData: StudentDataForm[] = []
        for (let row of data) {

          let frt: StudentDataForm = {
            firstName: "",
            otherNames: "",
            email: "",
            phoneNumber: "",
            custom: {}
          }
          for (let field of fields) {
            let fieldName = toCamelCase(field.fieldName)
            if (row[fieldName]) {
              if (field.defaultField) {
                if (fieldName.toLowerCase().includes('email')) {
                  frt['email'] = row[fieldName]
                } else if (fieldName.toLowerCase().includes('phone')) {
                  let phoneNumber = row[fieldName]
                  phoneNumber = phoneNumber.replace("'", "")
                  if (phoneNumber.startsWith('0')) {
                    phoneNumber = `234${phoneNumber.substring(1)}`
                  } else if (phoneNumber.startsWith('+')) {
                    phoneNumber = `${phoneNumber.substring(1)}`
                  }
                  frt["phoneNumber"] = phoneNumber
                } else if (fieldName.toLowerCase().includes('first')) {
                  frt["firstName"] = row[fieldName]
                } else {
                  frt["otherNames"] = row[fieldName]
                }
              } else {
                frt.custom[fieldName.replaceAll('?', '')] = row[fieldName]
              }
            }
          }
          studentsData.push(frt)

        }
        // bulk add the students
        // return the added students ids
        return studentsData
      }
    } catch (error) {
      toast({
        title: 'Unable to process request',
        description: (error as any).message,
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    }
  }

  const handleDeleteItem = async function (id: string) {
    let lding = { ...loading }
    lding[id] = true
    setLoading(lding)
    await removeLearnerGroup({ id: settingsId, groupId: id })
    await refetch()
    lding[id] = false
    setLoading(lding)
  }

  const form = useFormik({
    initialValues: {
      allowScheduling: false,
      name: "",
      members: [],
      launchTimes: {
        date: new Date(),
        time: "",
        timezone: "",

      }
    },
    onSubmit: async function (values) {
      const members = await handleParseFile()
      if (members) {
        const { data } = await bulkAddStudents({ body: members })
        const group: LearnerGroupPayload = {
          id: v4(),
          members: data,
          name: values.name,
          launchTimes: null
        }
        if (values.allowScheduling) {
          const combinedDate = moment(`${values.launchTimes.date} ${values.launchTimes.time}`, "YYYY-MM-DD HH:mm").toDate()
          const zone = Timezones.find(e => e.value === values.launchTimes.timezone)
          if (zone && zone.value) {

            group.launchTimes = {
              launchTime: combinedDate,
              utcOffset: zone.offset
            }
          }
        }
        // update the course setting
        await addLearnerGroup({
          id: settingsId, body: group
        })
        await refetch()
        onClose()
      }
    }
  })

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
        <div className='flex flex-col gap-3 mt-3'>
          {groups.map((group, i) => (
            <div key={`group_${i}`} className='h-16 w-full hover:bg-gray-100 select-none px-3 items-center flex gap-4'>
              <div className='w-24 relative -mt-12'>
                {group.members.length > 2 ? group.members.slice(0, 2).map((student, index) => {
                  return <IndividualMember key={student.email} className={`${index === 0 ? 'left-0 bg-green-300' : 'left-7 bg-gray-700'} top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-semibold text-lg text-white`} student={student} />
                }) : group.members.map((student, index) => {
                  return <IndividualMember key={student.email} className={`${index === 0 ? 'left-0 bg-green-300' : 'left-7 bg-gray-700'} top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-semibold text-lg text-white`} student={student} />
                })}
                <div className='left-14 top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-bold text-sm bg-white'>+{group.members.length - 2}</div>
              </div>
              <div className='flex flex-col gap-1 flex-1 justify-center'>
                <div className='text-sm font-bold'>{group.name}</div>
                <div className='text-sm font-medium text-[#64748B] -mt-1'>{group.members.length} members</div>
              </div>
              <div className='w-32 h-full flex gap-1 items-center'>
                <GroupEnrollmentSchedule refetch={refetch} group={group} settingsId={settingsId} />
                <ViewMembers members={group.members} />
                <button disabled={loading[group.id]} onClick={() => handleDeleteItem(group.id)} className='h-12 w-10 flex justify-center items-center'>
                  {loading[group.id] ? <Spinner size={'sm'} /> : <FiTrash2 />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onOpen} className='border w-full rounded-md py-2 mt-4 justify-center items-center text-primary-500 font-medium flex gap-2'>
          <AiOutlinePlus className='font-semibold' />
          <span className='text-sm'>Add learner group</span>
        </button>
      </div>


      {isOpen && <Modal size={'lg'} onClose={onClose} isOpen={isOpen}>

        <ModalOverlay />
        <ModalContent className=''>
          <form onSubmit={form.handleSubmit}>
            <ModalHeader className='border-b !py-3 text-base'>Create learner group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel className='text-sm' htmlFor='name' requiredIndicator={true}>Group name <span className='text-red-500 text-xs'>*</span></FormLabel>
                <Input id='name' onChange={form.handleChange} placeholder='Enter a name for this group' />
              </FormControl>

              <FormControl className='mt-4'>
                <FormLabel className='text-sm'>Upload learner list file <span className='text-red-500 text-xs'>*</span></FormLabel>
                <div className='mb-2'>
                  <p className='text-xs'>Take a look at a <a className='text-primary-500 hover:text-purple-500' href="#" onClick={(e) => {
                    e.preventDefault()
                    downloadSampleSheet()
                  }} target="_blank" rel="noopener noreferrer">sample spreadsheet</a> to see how you are expected to format your spreadsheet</p>
                </div>
                <DragAndDropUpload onFileChange={handleFileChange} />
              </FormControl>
              <div className='flex gap-2 my-2 items-center flex-row-reverse justify-end'>
                <Checkbox onChange={(val) => {
                  form.setFieldValue('allowScheduling', val.target.checked)
                }} className='text-xs' isChecked={form.values.allowScheduling}>
                  Do you want to schedule a launch time for this group?
                </Checkbox>
              </div>
              {form.values.allowScheduling && <div>
                <FormControl>
                  <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                  {/* <Datetime value={form.values.launchTimes.date} onChange={(f) => { form.setFieldValue("launchTimes.date", new Date(f.valueOf())) }} /> */}
                  <div className='flex gap-3'>
                    <div className='w-1/2'>
                      <input id="launchTimes.date" onChange={form.handleChange} type="date" className='w-full px-3 h-12 border rounded-lg' />
                    </div>
                    <div className='w-1/2'>
                      <input id="launchTimes.time" onChange={form.handleChange} type="time" className='w-full px-3 h-12 border rounded-lg' />
                    </div>
                  </div>
                </FormControl>
                <FormControl>
                  <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Timezone <span className='text-red-500 text-xs'>*</span></FormLabel>
                  <Select value={form.values.launchTimes.timezone} onChange={(e) => {
                    form.setFieldValue("launchTimes.timezone", e.target.value)
                  }}>
                    <option>Select timezone</option>
                    {Timezones.map((zone, i) => {
                      return (
                        <option key={zone.value} value={zone.value}>{zone.text}</option>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>
              }
              <div className='h-2 w-full mt-3'>
                {form.isSubmitting && <Progress className='' size='xs' isIndeterminate />}
              </div>
            </ModalBody>
            <ModalFooter className='!justify-between pt-0'>
              <button type="button" className='px-4 py-2 border rounded-lg font-semibold' onClick={onClose}>Cancel</button>
              <button type="submit" className='px-4 py-2 border rounded-lg font-semibold flex justify-center items-center gap-1 disabled:bg-primary-dark/90 bg-primary-dark text-white'>Save
                {form.isSubmitting && <Spinner size={'sm'} />}
              </button>
            </ModalFooter>
          </form>
        </ModalContent></Modal>}
    </div>
  )
}
