import { Checkbox, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiClock } from 'react-icons/fi'
import moment from 'moment'
import Countdown, { zeroPad } from 'react-countdown'
import { Timezones } from '@/utils/timezones'
import { LearnerGroup } from '@/type-definitions/secure.courses'
import { useFormik } from 'formik'
import { setLauncTimes } from '@/services/secure.courses.service'

export interface EnrollmentSchedule {
  courseId: string
  client: string
  timestamp: string
  utcOffset: number
  groupId: string
  isBundle: boolean
}

export default function GroupEnrollmentSchedule ({ group, settingsId, refetch }: { settingsId: string, group: LearnerGroup, refetch: () => Promise<void> }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const form = useFormik({
    initialValues: {
      allowScheduling: false,
      date: new Date().toDateString(),
      time: "",
      timezone: "",
    },
    onSubmit: async function (values, { resetForm }) {
      const combinedDate = moment(`${values.date} ${values.time}`, "YYYY-MM-DD HH:mm").toDate()
      const zone = Timezones.find(e => e.value === values.timezone)
      if (zone && zone.value) {

        await setLauncTimes({
          id: settingsId,
          groupId: group.id,
          body: {
            launchTime: combinedDate,
            utcOffset: zone.offset
          }
        })
        await refetch()
        resetForm()
        onClose()
      }
    }
  })

  const openModal = function () {
    if (group.launchTimes) {
      form.setFieldValue("date", moment(group.launchTimes.launchTime).format("YYYY-MM-DD"))
      form.setFieldValue("time", moment(group.launchTimes.launchTime).format("HH:MM"))
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
            {group.launchTimes ? <div className='flex flex-col gap-2'>
              <div className='text-sm text-center'>This course launches for these {group.members.length} students in</div>
              {moment(group.launchTimes.launchTime).isAfter() && <div className='w-full h-10 border flex justify-center items-center'>
                <Countdown date={moment(group.launchTimes.launchTime).utcOffset(group.launchTimes.utcOffset).valueOf()} renderer={({ minutes, seconds, hours, days, completed }) => (
                  <div className='text-xs'>
                    {zeroPad(days)} days, {zeroPad(hours)} hours, {zeroPad(minutes)} minutes, {zeroPad(seconds)} seconds
                  </div>
                )} />
              </div>}
            </div> : <div className='w-full flex justify-center text-center items-center text-sm'>
              You dont have any active schedules for this group
            </div>}

            <form onSubmit={form.handleSubmit}>
              <div className='flex gap-2 my-2 items-center flex-row-reverse justify-end'>
                <Checkbox onChange={(val) => {
                  form.setFieldValue('allowScheduling', val.target.checked)
                }} className='text-xs' isChecked={form.values.allowScheduling}>
                  {group.launchTimes ? <span className='text-sm'>
                    Do you want to reschedule the launch time for this group?
                  </span> : <span className='text-sm'>
                    Do you want to schedule a launch time for this group?
                  </span>}
                </Checkbox>
              </div>
              {form.values.allowScheduling && <div>
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
                <FormControl>
                  <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Timezone <span className='text-red-500 text-xs'>*</span></FormLabel>
                  <Select value={form.values.timezone} onChange={(e) => {
                    form.setFieldValue("timezone", e.target.value)
                  }}>
                    <option>Select timezone</option>
                    {Timezones.map((zone, i) => {
                      return (
                        <option key={zone.value} value={zone.value}>{zone.text}</option>
                      )
                    })}
                  </Select>
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
