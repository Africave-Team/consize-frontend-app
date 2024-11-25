import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'
export default function Triangle ({ leftSize, rightSize, bottomSize, color }: Pick<ElementProperties, "leftSize" | "rightSize" | 'bottomSize' | 'color'>) {
  return (
    <div style={{
      "width": "0px",
      "height": "0px",
      "borderLeft": `${leftSize}px solid transparent`,
      "borderRight": `${rightSize}px solid transparent`,
      "borderBottom": `${bottomSize}px solid ${color}`,
    }} />
  )
}
