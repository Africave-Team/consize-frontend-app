import React from 'react'
import { useQRCode } from 'next-qrcode'

export default function TeamQRCode ({ shortCode, teamName, teamLogo }: { shortCode: string, teamName: string, teamLogo: string }) {
  const { Canvas } = useQRCode()
  const message = `Hello consize, \nI want to see courses offered by *${teamName}*.\n_${shortCode}_`
  const url = `https://wa.me/2349012996642?text=${encodeURIComponent(message)}`
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
      logo={{
        src: teamLogo,
        options: {
          width: 100,
          x: undefined,
          y: undefined,
        }
      }}
    />
  )
}
