import { IoMdClose } from "react-icons/io"
import { Checkbox, FormControl, FormLabel, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { channelsList, membersList } from '@/services/slack.services'
import CopyToClipboardButton from '../CopyToClipboard'
import { Course, StudentDataForm } from '@/type-definitions/secure.courses'
import { Distribution } from '@/type-definitions/callbacks'
import { useQuery } from '@tanstack/react-query'
import { SlackChannel, SlackUser } from '@/type-definitions/slack'
import { FiArrowRight } from 'react-icons/fi'
import { SlackEnrollCohortValidator, SlackCreateCohortValidator } from '@/validators/SlackCreateCohort'
import { useFormik } from 'formik'
import { createCohort, enrollCohort, getCourseCohorts } from '@/services/cohorts.services'
import moment from 'moment'
import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'
import CourseQRCode from './CourseQRCode'
import DragAndDropUpload from '../Uploader'
import parseFile, { toCamelCase } from '@/utils/parseFile'
import { RowData, exportSampleData } from '@/utils/generateExcelSheet'
import { bulkAddStudents } from '@/services/secure.courses.service'
import { CohortsInterface } from '@/type-definitions/cohorts'
import { queryClient } from '@/utils/react-query'
import CohortsButton from './CohortsButton'
interface FilePreview {
  file: File
}

enum ENTITY {
  CHANNEL = "channel",
  PERSON = "individual",
  NONE = "none"
}

export default function CreateCohort ({ course, isBundle, onClose, hideLink, hideTitle }: { course: Course, onClose: () => void, isBundle?: boolean, hideLink?: boolean, hideTitle?: boolean }) {
  const [showTeamQR, setShowteamQR] = useState<boolean>(false)
  const [showTeamSlack, setShowteamSlack] = useState<boolean>(false)
  const { team } = useAuthStore()
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
  const [slackEntities, setSlackEntities] = useState<ENTITY>(ENTITY.PERSON)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedCohort, setSelectedCohort] = useState<CohortsInterface>()
  const [selectedUsers, setSelectedUsers] = useState<number>(0)
  const [view, setView] = useState<"list" | "form">("list")
  const [tab, setTab] = useState<"link" | "whatsapp" | 'slack'>(hideLink ? "whatsapp" : "link")

  useEffect(() => {
    if (team && team.channels) {
      let item = team.channels.find(e => e.channel === Distribution.WHATSAPP)
      if (item && item.enabled) {
        setShowteamQR(true)
      }

      item = team.channels.find(e => e.channel === Distribution.SLACK)
      if (item && item.enabled) {
        setShowteamSlack(true)
      }
    }
  }, [team])
  const loadSlackContent = async function (payload: { entity: ENTITY }) {
    if (payload.entity !== ENTITY.NONE) {
      let result
      if (payload.entity === ENTITY.CHANNEL) {
        result = await channelsList()
      } else {
        result = await membersList()
      }
      return result.data
    }
  }
  const toast = useToast()

  const { data: slackData, isFetching: slackProgress } =
    useQuery<{ channels?: SlackChannel[], members?: SlackUser[] }>({
      queryKey: ['slack-' + slackEntities, slackEntities],
      queryFn: () => loadSlackContent({ entity: slackEntities })
    })

  const addChannel = (channel: SlackChannel) => {
    let copy = [...selectedChannels]
    let index = copy.findIndex((e) => e === channel.id)
    if (index >= 0) {
      copy.splice(index, 1)
      setSelectedUsers(selectedUsers - channel.num_members)
    } else {
      copy.push(channel.id)
      setSelectedUsers(selectedUsers + channel.num_members)
    }
    setSelectedChannels(copy)
  }

  const addMember = (member: SlackUser) => {
    let copy = [...selectedMembers]
    let index = copy.findIndex((e) => e === member.id)
    if (index >= 0) {
      copy.splice(index, 1)
      setSelectedUsers(selectedUsers - 1)
    } else {
      copy.push(member.id)
      setSelectedUsers(selectedUsers + 1)
    }
    setSelectedMembers(copy)
  }


  const slackEnrollCohortForm = useFormik({
    initialValues: {
      agree: true,
      schedule: false,
      date: new Date().toDateString(),
      time: "",
      cohortId: "",
    },
    validateOnChange: true,
    validationSchema: SlackEnrollCohortValidator,
    onSubmit: async function (values, { resetForm }) {
      if (values.agree) {
        if (course) {
          const { agree, ...rest } = values
          await enrollCohort({
            ...rest,
            members: selectedMembers,
            students: [],
            courseId: course.id,
            channels: selectedChannels,
            date: values.schedule ? moment(values.date).format('YYYY-MM-DD') : "",
          })
          toast({
            description: "Enrollments have been saved.",
            title: "Completed",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
          setView("list")
          resetForm()
          onClose()
        }
      } else {
        onClose()
      }
    },
  })

  const whatsappEnrollCohortForm = useFormik({
    initialValues: {
      agree: true,
      schedule: false,
      date: new Date().toDateString(),
      time: "",
      cohortId: "",
    },
    validateOnChange: true,
    validationSchema: SlackEnrollCohortValidator,
    onSubmit: async function (values, { resetForm }) {
      if (values.agree) {
        if (course) {
          const { agree, ...rest } = values
          await enrollCohort({
            ...rest,
            students: selectedMembers,
            members: [],
            courseId: course.id,
            channels: [],
            date: values.schedule ? moment(values.date).format('YYYY-MM-DD') : ""
          })
          toast({
            description: "Enrollments have been saved.",
            title: "Completed",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
          // setView("list")
          resetForm()
          onClose()
        }
      } else {
        onClose()
      }
    },
  })


  const handleFileChange = async (data: FilePreview) => {
    try {
      if (data.file) {
        setFilePreview(data)
      }
    } catch (error) {
      console.error('Error parsing file:', error)
    }
  }

  useEffect(() => {
    const load = async function () {
      try {
        const members = await handleParseFile()
        if (members) {
          const { data } = await bulkAddStudents({ body: members })
          setSelectedMembers(data)
        }
      } catch (error) {
        toast({
          title: "Parsing failed",
          description: "Failed to parse the excel file provided"
        })
      }
    }
    if (filePreview) {
      load()
    }
  }, [filePreview])

  useEffect(() => {
    if (selectedCohort) {
      whatsappEnrollCohortForm.setFieldValue("cohortId", selectedCohort.id)
      slackEnrollCohortForm.setFieldValue("cohortId", selectedCohort.id)
    }
  }, [selectedCohort])

  const downloadSampleSheet = async function () {
    const tableData: RowData[][] = [
      [
        ...course.settings.enrollmentFormFields.map((field) => {
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
          ...course.settings.enrollmentFormFields.map((field) => {
            let value = ''
            if (field.fieldName.toLowerCase().includes('other')) {
              value = 'Robinson'
            } else if (field.fieldName.toLowerCase().includes('first')) {
              value = 'Jack'
            } else if (field.fieldName.toLowerCase().includes('phone')) {
              value = `23481${(new Date().getTime() + index).toString().slice(-8)}`
            } else if (field.fieldName.toLowerCase().includes('email')) {
              value = 'jack.robinson@mailinator.com'
            } else {
              if (field.dataType === "text") {
                value = `Example ${field.fieldName}`
              } else if (field.dataType === "boolean") {
                value = `yes/no`
              } else {
                value = `0`
              }
            }

            return {
              v: value,
              t: "s",
              s: {
                // Style object (optional)
                alignment: {
                  horizontal: 'left',
                  vertical: 'center',
                },
                font: {
                  name: 'Arial',
                  sz: 9,
                },
              },
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
        const data: any[] = await parseFile(filePreview?.file, course.settings.enrollmentFormFields)
        const total = course.settings.learnerGroups.reduce((acc, curr) => acc + curr.members.length, 0)
        if (data.length + total > course.settings.metadata.maxEnrollments) {
          toast({
            title: 'Maximum enrollments breached',
            description: `The group you added breaches the maximum enrollment limit for this course. Please add not more than ${course.settings.metadata.maxEnrollments - total} learners in this group or increase the maximum enrollment limit in the "course metadata" section`,
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
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            custom: {}
          }
          for (let field of course.settings.enrollmentFormFields) {
            let fieldName = field.variableName
            if (row[fieldName]) {
              if (field.defaultField) {
                if (fieldName.toLowerCase().includes('email')) {
                  frt['email'] = row[fieldName]
                } else if (fieldName.toLowerCase().includes('phone')) {
                  let phoneNumber = row[fieldName] + ''
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
                frt.custom[fieldName] = row[fieldName]
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
  return (
    <>
      <div className='py-4 h-[650px]'>
        {!hideTitle && <div className='w-full flex justify-between items-start'>
          <div className='w-11/12'>
            <h1 className='font-semibold text-lg text-[#0F172A] line-clamp-2'>
              Invite students
            </h1>
          </div>
          <div className='w-1/12 flex justify-end'>
            <div className='w-9 h-9 cursor-pointer bg-[#F1F5F9] rounded-full flex justify-center items-center' onClick={onClose}>
              <Icon as={IoMdClose} />
            </div>
          </div>
        </div>}
        <div className='h-10 flex mt-2 items-end border-b'>
          {!hideLink && <div onClick={() => setTab('link')} className={`px-5 cursor-pointer h-full flex items-end pb-1 ${tab === 'link' && 'border-b-2 h-full border-primary-dark'}`}>Link</div>}
          <div onClick={() => setTab('whatsapp')} className={`px-5 cursor-pointer h-full flex items-end pb-1 ${tab === 'whatsapp' && 'border-b-2 h-full border-primary-dark'}`}>Whatsapp groups</div>
          <div onClick={() => setTab('slack')} className={`px-5 cursor-pointer h-full flex items-end pb-1 ${tab === 'slack' && 'border-b-2 h-full border-primary-dark'}`}>Slack groups</div>
        </div>
        <div className='h-[570px] overflow-scroll'>
          {tab === 'link' && <>
            <div className='h-10 mt-2 w-full'>
              <div className='h-10 w-1/3'>
                <CohortsButton setSelectedCohort={setSelectedCohort} tab={tab} selectedCohort={selectedCohort} course={course} />
              </div>
            </div>
            {selectedCohort && <>
              <p className='text-sm line-clamp-4 text-[#23173E99]/60 mt-4 mb-1'>Send this course link to students to enroll</p>
              <div className='mb-4 flex justify-between gap-1'>
                <Input type="text" className="bg-gray-200 text-gray-600 !opacity-90 cursor-not-allowed px-2 py-1 border rounded-md overflow-y-auto w-11/12" disabled value={`${location.origin}/courses/${isBundle ? `bundles/` : ''}${course.id}?cohort=${selectedCohort.id}`} id="link-content" />
                <CopyToClipboardButton targetSelector='#link-content' />
              </div>
              {showTeamQR && team && selectedCohort && <CourseQRCode phoneNumber={(course.team?.facebookData?.phoneNumber ? course.team.facebookData.phoneNumber : process.env.NEXT_PUBLIC_WHATSAPP_PHONENUMBER) || ""} cohort={selectedCohort?.shortCode || ""} shortCode={course.shortCode} courseName={course.title} teamName={team.name} />}
            </>}
          </>}

          {tab === 'slack' && <>
            <div className='h-10 mt-2 w-full'>
              <div className='h-10 w-1/3'>
                <CohortsButton setSelectedCohort={setSelectedCohort} tab={tab} selectedCohort={selectedCohort} course={course} />
              </div>
            </div>
            {selectedCohort && <>
              {showTeamSlack ? <div className='mt-5'>
                <div className='font-medium text-lg'>Enroll {selectedUsers || ""} students from slack</div>
                {view === "list" && <>
                  <div className='w-full mt-3 h-10 border flex items-center justify-start gap-5'>
                    <button onClick={() => setSlackEntities(ENTITY.PERSON)} className={`h-10 font-medium w-auto px-4 ${slackEntities === ENTITY.PERSON ? 'bg-primary-dark text-white' : 'text-primary-dark'}`}>Workspace members</button>
                    <button onClick={() => setSlackEntities(ENTITY.CHANNEL)} className={`h-10 font-medium w-auto px-4 ${slackEntities === ENTITY.CHANNEL ? 'bg-primary-dark text-white' : 'text-primary-dark'}`}>Workspace channels</button>
                    <div className='w-32 flex justify-center items-center'>
                      <div className='h-8 flex items-center justify-center min-w-8 rounded-full bg-primary-dark text-white font-medium'>
                        {selectedUsers}
                      </div>
                    </div>
                  </div>
                  <div className='w-full font-medium mt-2 h-10 px-3 border flex items-center justify-start gap-5'>
                    <Checkbox />

                    <div>
                      {slackEntities === ENTITY.CHANNEL ? 'Channel' : 'Member'}
                    </div>
                  </div>

                  <div className='h-[360px] overflow-y-scroll'>
                    {slackData?.channels && slackData.channels.map((channel) => (<div key={channel.id} className='w-full mt-2 h-10 px-3 border flex cursor-pointer items-center justify-start gap-5'>
                      <Checkbox onChange={() => addChannel(channel)} isChecked={selectedChannels.includes(channel.id)} />

                      <div className='flex-1 h-full flex items-center' onClick={() => addChannel(channel)}>
                        #{channel.name} ({channel.num_members})
                      </div>
                    </div>))}

                    {slackData?.members && slackData.members.map((member) => (<div key={member.id} className='w-full mt-2 h-10 px-3 border cursor-pointer flex items-center justify-start gap-5'>
                      <Checkbox onChange={() => addMember(member)} isChecked={selectedMembers.includes(member.id)} />

                      <div className='flex flex-1 h-full items-center gap-2' onClick={() => addMember(member)}>
                        {member.profile.image_32 && <img src={member.profile.image_32} className='h-8 w-8 rounded-full' />}
                        {member.profile.real_name}
                      </div>
                    </div>))}
                  </div>
                  <div className='h-[80px] flex justify-end py-3'>
                    <button disabled={selectedChannels.length === 0 && selectedMembers.length === 0} onClick={() => setView("form")} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Create enrollment
                      <FiArrowRight />
                    </button>
                  </div>
                </>}
                {view === "form" && <form className='flex flex-col' onSubmit={slackEnrollCohortForm.handleSubmit}>
                  <div className='h-[360px]'>
                    {slackEnrollCohortForm.values.agree && <div>
                      <div className='mt-3 text-sm'>
                        <Checkbox name="schedule" onChange={slackEnrollCohortForm.handleChange} isChecked={slackEnrollCohortForm.values.schedule}>Would you like to schedule their resumption at a later date?</Checkbox>
                      </div>
                      {slackEnrollCohortForm.values.schedule && <>
                        <FormControl>
                          <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                          <div className='flex gap-3'>
                            <div className='w-1/2'>
                              <input id="date" value={slackEnrollCohortForm.values.date} onChange={slackEnrollCohortForm.handleChange} type="date" className='w-full px-3 h-12 border rounded-lg' />
                            </div>
                            <div className='w-1/2'>
                              <input id="time" value={slackEnrollCohortForm.values.time} onChange={slackEnrollCohortForm.handleChange} type="time" className='w-full px-3 h-12 border rounded-lg' />
                            </div>
                          </div>
                        </FormControl>
                      </>}
                    </div>}
                  </div>
                  <div className='flex justify-end h-12 gap-4 mt-3 items-center'>

                    <button onClick={() => setView("list")} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>Back</button>
                    <button onClick={onClose} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>Cancel</button>
                    <button type="submit" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
                      {slackEnrollCohortForm.isSubmitting && <Spinner size={'sm'} />}
                    </button>
                  </div>
                </form>}
              </div> : <div className='mt-5'>Slack is not enabled</div>}
            </>}
          </>}

          {tab === "whatsapp" && <>

            <div className='h-10 mt-2 w-full'>
              <div className='h-10 w-1/3'>
                <CohortsButton setSelectedCohort={setSelectedCohort} tab={tab} selectedCohort={selectedCohort} course={course} />
              </div>
            </div>
            {selectedCohort && <>
              {showTeamQR ? <div className='mt-5'>
                <FormControl className='mt-4'>
                  <FormLabel className='text-sm'>Upload learner list file <span className='text-red-500 text-xs'>*</span></FormLabel>
                  <div className='mb-2'>
                    <p className='text-xs'>Take a look at a <a className='text-purple-500 hover:text-purple-500' href="#" onClick={(e) => {
                      e.preventDefault()
                      downloadSampleSheet()
                    }} target="_blank" rel="noopener noreferrer">sample spreadsheet</a> to see how you are expected to format your spreadsheet</p>
                  </div>
                  <DragAndDropUpload onFileChange={handleFileChange} />
                </FormControl>

                {selectedMembers.length > 0 && <form className='flex flex-col' onSubmit={whatsappEnrollCohortForm.handleSubmit}>
                  <div className='min-h-[100px]'>
                    {whatsappEnrollCohortForm.values.agree && <div>
                      <div className='mt-3 text-sm'>
                        <Checkbox name="schedule" onChange={whatsappEnrollCohortForm.handleChange} isChecked={whatsappEnrollCohortForm.values.schedule}>Would you like to schedule their resumption at a later date?</Checkbox>
                      </div>
                      {whatsappEnrollCohortForm.values.schedule && <>
                        <FormControl>
                          <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                          <div className='flex gap-3'>
                            <div className='w-1/2'>
                              <input id="date" value={whatsappEnrollCohortForm.values.date} onChange={whatsappEnrollCohortForm.handleChange} type="date" className='w-full px-3 h-12 border rounded-lg' />
                            </div>
                            <div className='w-1/2'>
                              <input id="time" value={whatsappEnrollCohortForm.values.time} onChange={whatsappEnrollCohortForm.handleChange} type="time" className='w-full px-3 h-12 border rounded-lg' />
                            </div>
                          </div>
                        </FormControl>
                      </>}
                    </div>}
                  </div>
                  <div className='flex justify-end h-12 gap-4 mt-3 items-center'>

                    <button onClick={() => setSelectedMembers([])} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>Back</button>
                    <button onClick={onClose} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>Cancel</button>
                    <button type="submit" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Save & close
                      {whatsappEnrollCohortForm.isSubmitting && <Spinner size={'sm'} />}
                    </button>
                  </div>
                </form>}

              </div> : <div className='mt-5'>Whatsapp is not enabled</div>}
            </>}
          </>}

        </div>
      </div>
    </>
  )
}
