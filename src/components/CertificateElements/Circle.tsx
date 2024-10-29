import React from 'react'

interface CircleProperties {
  size: number
  color: string
}
export default function Circle ({ size, color }: CircleProperties) {
  return (
    <div style={{
      height: `${size}px`,
      width: `${size}px`,
      borderRadius: size,
      background: color
    }} />
  )
}
