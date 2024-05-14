import { updateSettings } from '@/services/secure.courses.service'
import { CourseSettings } from '@/type-definitions/secure.courses'
import { Input, InputGroup, InputRightElement, Popover, PopoverBody, PopoverContent, PopoverTrigger, Select, Spinner, useDisclosure } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
enum DropoutEvents {
  LESSON_COMPLETION_DATE = "LESSON_COMPLETION_DATE",
  INACTIVITY = "INACTIVITY"
}


const TimeBlock = function ({ time, next, handleChange, options }: { time: string, options: string[], next: string, handleChange: (val: string) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Popover onClose={onClose} isOpen={isOpen}>
      <PopoverTrigger>
        <div onClick={onOpen} className='w-full text-sm font-medium select-none cursor-pointer bg-gray-200 h-8 rounded-lg flex justify-center items-center'>
          {time}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-32 max-h-[200px] min-h-[80px] px-0'>
        <PopoverBody className='flex flex-col h-full overflow-y-scroll px-0'>
          {options.map((e, i) => <div key={`ffg_${i}`} onClick={() => handleChange(e)} className={`h-6 px-2 text-sm py-1 cursor-pointer flex items-center ${e === time ? 'bg-primary-dark text-white' : 'hover:bg-gray-100'}`}>{e}</div>)}
        </PopoverBody>
      </PopoverContent>
    </Popover>

  )
}



export default function Reminders ({ settings: { id, reminderDuration, reminderSchedule, dropoutEvent, dropoutWaitPeriod, inactivityPeriod }, refetch }: { settings: CourseSettings, refetch: () => Promise<any> }) {
  const [scheduleGroups, setScheduleGroups] = useState<{ title: string, children: string[] }[]>([])

  const form = useFormik({
    initialValues: { reminderDuration, reminderSchedule, dropoutEvent, dropoutWaitPeriod, inactivityPeriod, reminderCount: reminderSchedule.length },
    onSubmit: async function (values) {
      await updateSettings({
        id, body: {
          ...values, reminderSchedule: scheduleGroups.map(e => e.title)
        }
      })
      await refetch()
    }
  })

  const updateReminderCountBtn = function (increment: boolean) {
    let reminderCount = form.values.reminderCount
    if (increment) {
      if (reminderCount === 5) return
      reminderCount++
    } else {
      if (reminderCount === 1) return
      reminderCount--
    }
    form.setFieldValue('reminderCount', reminderCount)
  }

  const updateInactivityCountBtn = function (increment: boolean) {
    let period = { ...form.values.inactivityPeriod }
    if (increment) {
      period.value++
    } else {
      if (period.value === 0) return
      period.value--
    }
    form.setFieldValue('inactivityPeriod', period)
  }

  const updateDropoutCountBtn = function (increment: boolean) {
    let period = { ...form.values.dropoutWaitPeriod }
    if (increment) {
      period.value++
    } else {
      if (period.value === 0) return
      period.value--
    }
    form.setFieldValue('dropoutWaitPeriod', period)
  }

  const updateReminderDurationBtn = function (increment: boolean) {
    let period = { ...form.values.reminderDuration }
    if (increment) {
      period.value++
    } else {
      if (period.value === 0) return
      period.value--
    }
    form.setFieldValue('reminderDuration', period)
  }

  useEffect(() => {
    const newItems: number[] = []
    const diff = Math.ceil(13 / form.values.reminderCount)
    let start = 8
    while (newItems.length < form.values.reminderCount) {
      if (newItems.length === 0) {
        newItems.push(start)
      } else {
        let curr = newItems[newItems.length - 1]
        newItems.push(curr + diff)
      }
    }
    setScheduleGroups(newItems.map((item, index) => {
      const title = `${item <= 12 ? item.toString().padStart(2, '0') : (item - 12).toString().padStart(2, '0')}:00${item < 12 ? ' AM' : ' PM'}`
      let children: string[] = []
      let end = newItems[index + 1]
      if (!newItems[index + 1]) {
        end = 21
      }
      let current_hour: number = item
      let current_minute: number = 0
      while (current_hour < end || (current_hour === end && current_minute === 0)) {
        let hour_12hr: number = current_hour % 12 || 12 // Convert to 12-hour format
        let period: string = current_hour < 12 ? 'AM' : 'PM'
        children.push(`${hour_12hr.toString().padStart(2, '0')}:${current_minute.toString().padStart(2, '0')} ${period}`)

        current_minute += 30
        if (current_minute === 60) {
          current_hour++
          current_minute -= 60
        }
      }
      if (newItems[index + 1]) {
        children.splice(children.length - 1, 1)
      }
      form.setFieldValue(`reminderSchedule[${index}]`, title)
      return {
        title,
        children
      }
    }))
  }, [form.values.reminderCount])

  return (
    <form onSubmit={form.handleSubmit}>
      <div className='font-semibold text-sm flex justify-between items-center'>
        Reminder frequency
      </div>
      <div className='text-[#64748B] text-sm'>How many times in a day should reminders go out?</div>

      <div className='flex mt-2 gap-2 flex-col'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[95px] flex gap-1 rounded-r-md'>
            <button onClick={() => updateReminderCountBtn(false)} type='button' className='border rounded-md h-9 px-3'>
              <FiMinus />
            </button>
            <button onClick={() => updateReminderCountBtn(true)} type='button' className='border rounded-md h-9 px-3'>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input min={0} value={form.values.reminderCount} name="reminderCount" onChange={form.handleChange} max={5} type='number' placeholder='0' />
        </InputGroup>
        <div className='grid grid-cols-5 gap-4 h-9'>
          {
            scheduleGroups.map((e, i) => {
              return (
                <TimeBlock next={form.values.reminderSchedule[i + 1]} options={e.children} time={form.values.reminderSchedule[i]} key={`sch_${i}`} handleChange={(val: string) => {
                  const curr = [...form.values.reminderSchedule]
                  curr[i] = val
                  form.setFieldValue('reminderSchedule', curr)
                }} />
              )
            })
          }
        </div>
        <div className='text-xs'>
          Click on a time to change it
        </div>
      </div>

      <div className='font-semibold text-sm mt-5'>
        Inactivity period
      </div>
      <div className='text-[#64748B] text-sm'>How many hours of learner inactivity before the next reminder gets sent out?</div>

      <div className='flex mt-2 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[150px] flex rounded-r-md gap-1'>
            <div className='text-xs h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>
              Minutes
            </div>
            <button type="button" onClick={() => updateInactivityCountBtn(false)} className='border rounded-md h-9 px-3'>
              <FiMinus />
            </button>
            <button type="button" onClick={() => updateInactivityCountBtn(true)} className='border rounded-md h-9 px-3'>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input name="inactivityPeriod.value" onChange={form.handleChange} value={form.values.inactivityPeriod.value} type='number' placeholder='0' />
        </InputGroup>
      </div>


      <div className='font-semibold text-sm mt-5'>
        Reminder days
      </div>
      <div className='text-[#64748B] text-sm'>How long should the reminder continue for if the learner doesn’t respond?</div>

      <div className='flex mt-2 gap-2'>
        <InputGroup className='w-full'>
          <InputRightElement className='w-[143px] flex rounded-r-md gap-1'>
            <div className='text-xs h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>
              Days
            </div>
            <button type='button' onClick={() => updateReminderDurationBtn(false)} className='border rounded-md h-9 px-3'>
              <FiMinus />
            </button>
            <button type='button' onClick={() => updateReminderDurationBtn(true)} className='border rounded-md h-9 px-3'>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input name="reminderDuration.value" onChange={form.handleChange} value={form.values.reminderDuration.value} type='number' placeholder='0' />
        </InputGroup>
      </div>

      <div className='font-semibold text-sm mt-4'>
        Drop-out message schedule
      </div>
      <div className='text-[#64748B] text-sm'>How many days after should a drop-out message be sent?</div>

      <div className='flex mt-2 gap-2'>
        <InputGroup className='w-1/2'>
          <InputRightElement className='w-[143px] flex gap-1'>
            <div className='text-xs h-full text-[#98A2B3] font-medium flex items-center justify-center px-2'>
              Days
            </div>
            <button type="button" onClick={() => updateDropoutCountBtn(false)} className='border rounded-md h-9 px-3'>
              <FiMinus />
            </button>
            <button type="button" onClick={() => updateDropoutCountBtn(true)} className='border rounded-md h-9 px-3'>
              <FiPlus />
            </button>

          </InputRightElement>
          <Input name="dropoutWaitPeriod.value" onChange={form.handleChange} value={form.values.dropoutWaitPeriod.value} type='number' placeholder='0' />
        </InputGroup>

        <div className='w-1/2'>
          <Select name="dropoutEvent" onChange={form.handleChange} value={form.values.dropoutEvent}>
            <option value={DropoutEvents.LESSON_COMPLETION_DATE}>After lesson completion date</option>
            <option value={DropoutEvents.INACTIVITY}>Of total inactivity</option>
          </Select>
        </div>

      </div>
      <div className='flex mt-3'>
        <button type='submit' className='w-full bg-primary-dark flex gap-2 items-center justify-center font-medium text-white h-11 rounded-lg'>
          Save changes
          {form.isSubmitting && <Spinner size="sm" />}
        </button>
      </div>
    </form>
  )
}
