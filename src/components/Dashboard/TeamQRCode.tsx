import React from 'react'
import { useQRCode } from 'next-qrcode'

export default function TeamQRCode ({ shortCode, teamName, phoneNumber }: { shortCode: string, teamName: string, teamLogo: string, phoneNumber: string }) {
  const { Canvas } = useQRCode()
  const message = `Hello Consize, \nI want to see courses offered by *${teamName}* (id: _${shortCode}_)`
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
