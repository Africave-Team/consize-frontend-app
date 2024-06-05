import { CourseResumptionSettings } from '@/type-definitions/secure.courses'
import { updateSettings } from '@/services/secure.courses.service'
import { useFormik } from 'formik'
import React from 'react'
import { Select, Spinner, Switch } from '@chakra-ui/react'
import moment from 'moment'

export default function CourseResumption ({ settings, id, refetch }: { settings: CourseResumptionSettings | null, id: string, refetch: () => Promise<any> }) {
  const daysOptions = [
    {
      title: "Same day of enrollment",
      value: 0
    },
    {
      title: "Next day after enrollment",
      value: 1
    },
    {
      title: "Two days after enrollment",
      value: 2
    },
    {
      title: "Three days after enrollment",
      value: 3
    },
    {
      title: "Four days after enrollment",
      value: 4
    },
    {
      title: "Five days after enrollment",
      value: 5
    },
    {
      title: "Six days after enrollment",
      value: 6
    },
    {
      title: "One week after enrollment",
      value: 7
    }
  ]
  const form = useFormik({
    initialValues: settings ? { ...settings } : {
      enableImmediate: true,
      enabledDateTimeSetup: false,
      days: 0,
      time: "08:00"
    },
    onSubmit: async function (values) {
      await updateSettings({
        id, body: {
          resumption: { ...values, days: Number(values.days) }
        }
      })
      await refetch()
    }
  })
  return (
    <form onSubmit={form.handleSubmit} className='flex flex-col h-full justify-between'>
      <div className='flex flex-col gap-3'>
        <div className=''>
          <div className='font-medium text-sm mt-3'>
            Choose a default time for enrolled students to begin getting this course
          </div>
          <div className='flex gap-2 items-center mt-1'>
            <div className='w-60'>
              <Select value={form.values.days} id="days" name="days" onChange={form.handleChange} onBlur={form.handleBlur} className='text-sm'>
                <option value=''>Select day</option>
                {daysOptions.map((day) => (<option key={day.value} value={day.value}>{day.title}</option>))}
              </Select>
            </div>
            <div className='w-40'>
              <input id="time" value={form.values.time} onChange={form.handleChange} type="time" className='w-full px-3 h-10 text-sm border rounded-lg' />
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='font-medium text-sm mt-3'>
            Allow students to start immediately
          </div>
          <Switch onChange={(e) => form.setFieldValue('enableImmediate', e.target.checked)} isChecked={form.values.enableImmediate} size='md' />
        </div>
        <div className='flex justify-between items-center'>
          <div className='font-medium text-sm mt-3'>
            Allow students to choose their own time to start the course
          </div>
          <Switch onChange={(e) => form.setFieldValue('enabledDateTimeSetup', e.target.checked)} isChecked={form.values.enabledDateTimeSetup} size='md' />
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
