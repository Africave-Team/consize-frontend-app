import React from 'react'
import { useQRCode } from 'next-qrcode'

export default function CourseQRCode ({ shortCode, courseName, teamName }: { shortCode: string, courseName: string, teamName: string }) {
  const { Canvas } = useQRCode()
  const message = `Hello consize, \nI want to start the course *${courseName}* offered by *${teamName}*.\n_${shortCode}_`
  const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONENUMBER}?text=${encodeURIComponent(message)}`
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
          light: "#1FFF69"
        }
      }}

    />
  )
}
