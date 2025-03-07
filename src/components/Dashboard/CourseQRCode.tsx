import React from 'react'
import { useQRCode } from 'next-qrcode'

export default function CourseQRCode ({ shortCode, courseName, teamName, cohort, phoneNumber, width = 350 }: { shortCode: string, courseName: string, teamName: string, cohort: string, phoneNumber: string, width?: number }) {
  const { Canvas } = useQRCode()
  const message = `Hello, \nI want to start the course *${courseName}* offered by *${teamName}* \n(id: _${shortCode}_)`
  if (cohort) {
    message + ` \n(group: _${cohort}_)`
  }
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <Canvas
      text={url}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width,
        color: {
          dark: "#0D1F23",
          light: "#fff"
        }
      }}

    />
  )
}
