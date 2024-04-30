"use client"
import Layout from '@/layouts/PageTransition'
import { createCohort } from '@/services/cohorts.services'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { channelsList, membersList } from '@/services/slack.services'
import { useAuthStore } from '@/store/auth.store'
import { Distribution } from '@/type-definitions/callbacks'
import { Course } from '@/type-definitions/secure.courses'
import { SlackChannel, SlackUser } from '@/type-definitions/slack'
import { Checkbox, FormControl, FormLabel, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FiArrowRight, FiX } from 'react-icons/fi'

interface ApiResponse {
  data: Course
  message: string
}

enum ENTITY {
  CHANNEL = "channel",
  PERSON = "individual",
  NONE = "none"
}

export default function page ({ params }: { params: { id: string } }) {
  const [slackEntities, setSlackEntities] = useState<ENTITY>(ENTITY.PERSON)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number>(0)

  const { isOpen, onClose, onOpen } = useDisclosure()
  const router = useRouter()
  const { team } = useAuthStore()
  const toast = useToast()
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

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

  const { data: courseDetails, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })

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

  const form = useFormik({
    initialValues: {
      agree: false,
      schedule: false,
      date: new Date().toDateString(),
      time: "",
      name: ""
    },
    onSubmit: async function (values) {
      if (courseDetails && courseDetails.data) {
        await createCohort({
          ...values,
          members: selectedMembers,
          students: [],
          courseId: courseDetails.data.id,
          channels: selectedChannels,
          distribution: courseDetails?.data.distribution,
          date: values.schedule ? moment(values.date).format('YYYY-MM-DD') : ""
        })
        toast({
          description: "Enrollments have been saved.",
          title: "Completed",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        router.push(`/dashboard/courses/${params.id}/builder/publish`)
      }
    },
  })


  return (

    <Layout>
      <div className='h-screen'>
        <div className='w-full overflow-y-scroll  max-h-full'>
          <div className='flex-1 flex justify-center md:py-10'>
            <div className='px-4 w-full md:w-3/5'>
              <div className='flex justify-between items-center mt-5'>
                <div className='font-medium text-lg'>Add students to this course</div>
                <div className='flex gap-2'>
                  <button disabled={selectedChannels.length === 0 && selectedMembers.length === 0} onClick={onOpen} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Save & Publish
                    <FiArrowRight />
                  </button>
                  <button onClick={() => router.push(`/dashboard/courses/${params.id}/builder/publish`)} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-primary-dark bg-primary-app hover:bg-primary-app/90'>Skip & Publish
                    <FiArrowRight />
                  </button>
                </div>
              </div>


              {courseDetails?.data.distribution === Distribution.SLACK && <div className='mt-5'>
                {/* table header */}
                <div className='w-full h-10 border flex items-center justify-start gap-5'>
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


              </div>}
              {courseDetails?.data.distribution === Distribution.WHATSAPP && <></>}

            </div>
          </div>
          <div className='h-96'></div>
        </div>


        {isOpen && <Modal
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          size={'xl'}
        >
          <ModalOverlay />
          <ModalContent className='min-h-48 p-0'>
            <ModalBody className='h-80 px-5 py-5'>
              <form className='flex flex-col' onSubmit={form.handleSubmit}>
                <div className='h-60'>
                  <div className='mt-3 text-sm'>
                    <Checkbox name="agree" onChange={form.handleChange} isChecked={form.values.agree}>Are you sure you wish to invite these {selectedUsers} members to this course?</Checkbox>
                  </div>

                  {form.values.agree && <div>
                    <FormControl>
                      <FormLabel className='text-sm mt-3' htmlFor='name' requiredIndicator={true}>Name this cohort <span className='text-red-500 text-xs'>*</span></FormLabel>
                      <input id="name" name="name" value={form.values.name} onChange={form.handleChange} type="text" placeholder='Cohort name' className='w-full px-3 h-12 border rounded-lg' />
                    </FormControl>
                    <div className='mt-3 text-sm'>
                      <Checkbox name="schedule" onChange={form.handleChange} isChecked={form.values.schedule}>Would you like to schedule their resumption at a later date?</Checkbox>
                    </div>
                    {form.values.schedule && <>
                      <FormControl>
                        <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                        <div className='flex gap-3'>
                          <div className='w-1/2'>
                            <input id="date" value={form.values.date} onChange={form.handleChange} type="date" className='w-full px-3 h-12 border rounded-lg' />
                          </div>
                          <div className='w-1/2'>
                            <input id="time" value={form.values.time} onChange={form.handleChange} type="time" className='w-full px-3 h-12 border rounded-lg' />
                          </div>
                        </div>
                      </FormControl>
                      {form.values.date}
                    </>}
                  </div>}
                </div>
                <div className='flex justify-end h-12 gap-4 mt-3 items-center'>
                  <button onClick={onClose} className='h-10 flex jus items-center hover:bg-gray-100 rounded-lg border px-4'>Cancel</button>
                  <button type="submit" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
                    {form.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>}
      </div>
    </Layout>
  )
}
