import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'

interface CircleProperties {
  size: number
  color: string
}
export default function Circle ({ size, color, border }: Pick<ElementProperties, 'size' | 'color' | "border">) {
  return (
    <div style={{
      height: `${size}px`,
      width: `${size}px`,
      borderTop: `${border?.t}px solid ${border?.color}`,
      borderBottom: `${border?.b}px solid ${border?.color}`,
      borderLeft: `${border?.l}px solid ${border?.color}`,
      borderRight: `${border?.r}px solid ${border?.color}`,
      borderRadius: size,
      background: color
    }} />
  )
}
