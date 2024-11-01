import { ElementProperties } from '@/type-definitions/cert-builder'
import React from 'react'
import { FaRegImage } from 'react-icons/fa6'

export default function ImageBox ({ url, width, height, radius }: Pick<ElementProperties, "width" | "height" | "url" | 'radius'>) {
  return (
    <div style={{
      "width": `${width}px`,
      "height": `${height}px`,
      borderTopRightRadius: radius.rt,
      borderBottomRightRadius: radius.rb,
      borderTopLeftRadius: radius.lt,
      borderBottomLeftRadius: radius.lb
    }} >
      {url ? <img className='h-full w-full' src={url} /> : <div className='w-full h-full flex justify-center items-center'>
        <FaRegImage className='text-5xl' />
      </div>}
    </div>
  )
}
