import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'

interface CircleProperties {
  size: number
  color: string
}
export default function Circle ({ size, color }: Pick<ElementProperties, 'size' | 'color'>) {
  return (
    <div style={{
      height: `${size}px`,
      width: `${size}px`,
      borderRadius: size,
      background: color
    }} />
  )
}
