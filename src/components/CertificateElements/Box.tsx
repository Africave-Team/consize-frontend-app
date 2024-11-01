import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'
export default function Box ({ color, width, height, radius }: Pick<ElementProperties, "width" | "height" | 'color' | 'radius'>) {
  return (
    <div style={{
      "width": `${width}px`,
      "height": `${height}px`,
      background: color,
      borderTopRightRadius: radius.rt,
      borderBottomRightRadius: radius.rb,
      borderTopLeftRadius: radius.lt,
      borderBottomLeftRadius: radius.lb
    }} />
  )
}
