import React from 'react'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
export default function GeneralCoursesPageLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
