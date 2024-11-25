import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'
export default function Box ({ color, width, height, radius, border }: Pick<ElementProperties, "width" | "height" | 'color' | 'radius' | "border">) {
  return (
    <div style={{
      "width": `${width}px`,
      "height": `${height}px`,
      borderTop: `${border?.t}px solid ${border?.color}`,
      borderBottom: `${border?.b}px solid ${border?.color}`,
      borderLeft: `${border?.l}px solid ${border?.color}`,
      borderRight: `${border?.r}px solid ${border?.color}`,
      background: color,
      borderTopRightRadius: radius.rt,
      borderBottomRightRadius: radius.rb,
      borderTopLeftRadius: radius.lt,
      borderBottomLeftRadius: radius.lb
    }} />
  )
}
