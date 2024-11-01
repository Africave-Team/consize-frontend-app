import { ElementProperties } from '@/type-definitions/cert-builder'
import { Text } from '@chakra-ui/react'
import React from 'react'

export default function TextContent ({ text, width, border }: Pick<ElementProperties, "width" | "height" | "text" | "border">) {
  return (
    <div style={{
      width,
      borderTop: `${border?.t}px solid ${border?.color}`,
      borderBottom: `${border?.b}px solid ${border?.color}`,
      borderLeft: `${border?.l}px solid ${border?.color}`,
      borderRight: `${border?.r}px solid ${border?.color}`,
      textAlign: text?.align
    }}>
      <Text>{text?.value}</Text>
    </div>
  )
}
