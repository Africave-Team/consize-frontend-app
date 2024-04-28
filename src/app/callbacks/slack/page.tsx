"use client"
import React from 'react'

export default function page (params: any) {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>{JSON.stringify(params)}</div>
  )
}
