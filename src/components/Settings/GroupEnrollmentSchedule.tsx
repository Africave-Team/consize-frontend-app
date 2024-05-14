import { Checkbox, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiClock } from 'react-icons/fi'
import moment from 'moment'
import Countdown, { zeroPad } from 'react-countdown'
import { Timezones } from '@/utils/timezones'
import { LearnerGroup } from '@/type-definitions/secure.courses'
import { useFormik } from 'formik'
import { setLauncTimes } from '@/services/secure.courses.service'
import { CohortsInterface } from '@/type-definitions/cohorts'

export interface EnrollmentSchedule {
  courseId: string
  client: string
  timestamp: string
  utcOffset: number
  groupId: string
  isBundle: boolean
}

export default function GroupEnrollmentSchedule ({ group }: { group: CohortsInterface }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const form = useFormik({
    initialValues: {
      schedule: false,
      date: new Date().toDateString(),
      time: "",
    },
    onSubmit: async function (values, { resetForm }) {
      resetForm()
      onClose()
    }
  })

  const openModal = function () {
    if (group.schedule) {
      form.setFieldValue("date", moment(group.date).format("YYYY-MM-DD"))
      form.setFieldValue("time", group.time)
      form.setFieldValue("schedule", group.schedule)
    }
    onOpen()
  }
  return (
    <div>
      <button onClick={openModal} className='h-12 w-10 flex justify-center items-center'>
        <FiClock />
      </button>

      {isOpen && <Modal size={'lg'} onClose={onClose} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent className='min-h-[180px] overflow-y-scroll'>
          <ModalHeader className='border-b !py-3 text-base'>Learner group launch time information</ModalHeader>
          <ModalCloseButton />
          <ModalBody className='px-6 py-3'>
            {group.schedule ? <div className='flex flex-col gap-2'>
              {moment(group.date).isAfter() && <div>
                <div className='text-sm text-center'>This course launches for these {group.members.length} students in</div>
                <div className='w-full h-10 border flex justify-center items-center'>
                  <Countdown date={moment(group.date).valueOf()} renderer={({ minutes, seconds, hours, days, completed }) => (
                    <div className='text-xs'>
                      {zeroPad(days)} days, {zeroPad(hours)} hours, {zeroPad(minutes)} minutes, {zeroPad(seconds)} seconds
                    </div>
                  )} />
                </div>
              </div>}
            </div> : <div className='w-full flex justify-center text-center items-center text-sm'>
              You dont have any active schedules for this group
            </div>}

            <form onSubmit={form.handleSubmit}>
              <div className='flex gap-2 my-2 items-center flex-row-reverse justify-end'>
                <Checkbox onChange={(val) => {
                  form.setFieldValue('allowScheduling', val.target.checked)
                }} className='text-xs' isChecked={form.values.schedule}>
                  {group.schedule ? <span className='text-sm'>
                    Do you want to reschedule the launch time for this group?
                  </span> : <span className='text-sm'>
                    Do you want to schedule a launch time for this group?
                  </span>}
                </Checkbox>
              </div>
              {form.values.schedule && <div>
                <FormControl>
                  <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                  {/* <Datetime value={form.values.launchTimes.date} onChange={(f) => { form.setFieldValue("launchTimes.date", new Date(f.valueOf())) }} /> */}
                  <div className='flex gap-3'>
                    <div className='w-1/2'>
                      <input id="date" value={form.values.date} onChange={form.handleChange} type="date" className='w-full px-3 h-12 border rounded-lg' />
                    </div>
                    <div className='w-1/2'>
                      <input id="time" value={form.values.time} onChange={form.handleChange} type="time" className='w-full px-3 h-12 border rounded-lg' />
                    </div>
                  </div>
                </FormControl>
                <div className='w-full flex justify-center my-3'>
                  <button type="submit" className='h-12 w-full md:w-1/2 rounded-lg bg-primary-dark text-white'>Save schedule</button>
                </div>
              </div>
              }
            </form>
          </ModalBody>
        </ModalContent>

      </Modal>}
    </div>
  )
}
