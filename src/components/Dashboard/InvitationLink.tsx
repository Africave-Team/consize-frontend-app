import { IoMdClose } from "react-icons/io"
import { Checkbox, FormControl, FormLabel, Icon, Input, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { channelsList, membersList } from '@/services/slack.services'
import CopyToClipboardButton from '../CopyToClipboard'
import { Course } from '@/type-definitions/secure.courses'
import { Distribution } from '@/type-definitions/callbacks'
import { useQuery } from '@tanstack/react-query'
import { SlackChannel, SlackUser } from '@/type-definitions/slack'
import { FiArrowRight } from 'react-icons/fi'
import { SlackCreateCohortValidator } from '@/validators/SlackCreateCohort'
import { useFormik } from 'formik'
import { createCohort } from '@/services/cohorts.services'
import moment from 'moment'


enum ENTITY {
  CHANNEL = "channel",
  PERSON = "individual",
  NONE = "none"
}

export default function InvitationLink ({ course, isBundle }: { course: Course, isBundle?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [slackEntities, setSlackEntities] = useState<ENTITY>(ENTITY.PERSON)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number>(0)
  const [view, setView] = useState<"list" | "form">("list")
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


  const slackCreateCohortForm = useFormik({
    initialValues: {
      agree: false,
      schedule: false,
      date: new Date().toDateString(),
      time: "",
      name: ""
    },
    validateOnChange: true,
    validationSchema: SlackCreateCohortValidator,
    onSubmit: async function (values) {
      if (values.agree) {
        if (course) {
          await createCohort({
            ...values,
            members: selectedMembers,
            students: [],
            courseId: course.id,
            channels: selectedChannels,
            distribution: course.distribution,
            date: values.schedule ? moment(values.date).format('YYYY-MM-DD') : ""
          })
          toast({
            description: "Enrollments have been saved.",
            title: "Completed",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
          onClose()
        }
      } else {
        onClose()
      }
    },
  })
  return (
    <div>
      <button onClick={() => onOpen()} className='bg-primary-dark hover:bg-primary-dark/90 px-4 h-10 text-white rounded-md text-sm'>Enroll students</button>

      {isOpen && <Modal isCentered isOpen={isOpen} size={{ md: '3xl', base: 'full' }} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody className='py-4'>
            <div className='w-full flex justify-between items-start'>
              <div className='w-11/12'>
                <h1 className='font-semibold text-lg text-[#0F172A] line-clamp-2'>
                  Invite students
                </h1>
                <p className='text-sm line-clamp-4 text-[#23173E99]/60 mt-1'>Send this course link to students to enroll</p>
              </div>
              <div className='w-1/12 flex justify-end'>
                <div className='w-9 h-9 cursor-pointer bg-[#F1F5F9] rounded-full flex justify-center items-center' onClick={onClose}>
                  <Icon as={IoMdClose} />
                </div>
              </div>
            </div>

            <div className='my-4 flex justify-between gap-1'>
              <Input type="text" className="bg-gray-200 text-gray-600 !opacity-90 cursor-not-allowed px-2 py-1 border rounded-md overflow-y-auto w-11/12" disabled value={`${location.origin}/courses/${isBundle ? `bundles/` : ''}${course.id}`} id="link-content" />
              <CopyToClipboardButton targetSelector='#link-content' />
            </div>

            <div className='w-full flex items-center'>
              <hr className='flex-1' />
              <div className='h-8 w-8 border rounded-full flex justify-center items-center font-medium'>or</div>
              <hr className='flex-1' />
            </div>

            {course.distribution === Distribution.SLACK && <div className='mt-5'>
              <div className='font-medium text-lg'>Enroll students from slack</div>
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
              {view === "form" && <form className='flex flex-col' onSubmit={slackCreateCohortForm.handleSubmit}>
                <div className='h-[360px]'>
                  <div className='mt-3 text-sm'>
                    <Checkbox name="agree" onChange={slackCreateCohortForm.handleChange} isChecked={slackCreateCohortForm.values.agree}>Are you sure you wish to invite these {selectedUsers} members to this course?</Checkbox>
                  </div>

                  {slackCreateCohortForm.values.agree && <div>
                    <FormControl>
                      <FormLabel className='text-sm mt-3' htmlFor='name' requiredIndicator={true}>Name this cohort <span className='text-red-500 text-xs'>*</span></FormLabel>
                      <input id="name" name="name" value={slackCreateCohortForm.values.name} onChange={slackCreateCohortForm.handleChange} type="text" placeholder='Cohort name' className='w-full px-3 h-12 border rounded-lg' />
                      {slackCreateCohortForm.errors.name && <span className='text-xs text-red-400'>{slackCreateCohortForm.errors.name}</span>}
                    </FormControl>
                    <div className='mt-3 text-sm'>
                      <Checkbox name="schedule" onChange={slackCreateCohortForm.handleChange} isChecked={slackCreateCohortForm.values.schedule}>Would you like to schedule their resumption at a later date?</Checkbox>
                    </div>
                    {slackCreateCohortForm.values.schedule && <>
                      <FormControl>
                        <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                        <div className='flex gap-3'>
                          <div className='w-1/2'>
                            <input id="date" value={slackCreateCohortForm.values.date} onChange={slackCreateCohortForm.handleChange} type="date" className='w-full px-3 h-12 border rounded-lg' />
                          </div>
                          <div className='w-1/2'>
                            <input id="time" value={slackCreateCohortForm.values.time} onChange={slackCreateCohortForm.handleChange} type="time" className='w-full px-3 h-12 border rounded-lg' />
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
                    {slackCreateCohortForm.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </form>}
            </div>}
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
