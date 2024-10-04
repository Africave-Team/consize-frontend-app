import React from 'react'
import { useQRCode } from 'next-qrcode'

export default function CourseQRCode ({ shortCode, courseName, teamName, cohort, phoneNumber }: { shortCode: string, courseName: string, teamName: string, cohort: string, phoneNumber: string }) {
  const { Canvas } = useQRCode()
  const message = `Hello Consize, \nI want to start the course *${courseName}* offered by *${teamName}* \n(id: _${shortCode}_) \n(group: _${cohort}_)`
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <Canvas
      text={url}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: 350,
        color: {
          dark: "#0D1F23",
          light: "#fff"
        }
      }}

    />
  )
}
