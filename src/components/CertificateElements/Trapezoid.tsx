import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'

interface TrapezoidProperties {
  size: number
  leftSize: number
  rightSize: number
  bottomSize: number
  color: string
}

export default function Trapezoid ({ leftSize, rightSize, bottomSize, color, width }: Pick<ElementProperties, "leftSize" | "rightSize" | 'bottomSize' | 'width' | 'color'>) {
  return (
    <div style={{
      "width": `${width}px`,
      "height": "0px",
      "borderLeft": `${leftSize}px solid transparent`,
      "borderRight": `${rightSize}px solid transparent`,
      "borderBottom": `${bottomSize}px solid ${color}`,
    }} />
  )
}
