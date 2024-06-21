'use client'
import CustomHeaderImage from '@/components/CustomHeaderImage'
import React from 'react'

interface DataInterface {
  courseName: string
  organizationName: string
  logoUrl?: string
}

export default function PageContents ({ details }: { details: DataInterface }) {
  return (
    <div className="h-screen w-screen overflow-y-scroll flex justify-center items-center">
      <div className="course-header h-[60vh] w-[60vw]">
        <CustomHeaderImage bgColor='#000' bgPattern='default-bg-spiral-3' imageText={details.courseName} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo minus ullam veniam, inventore molestias omnis quo natus quis nulla placeat doloremque, tenetur enim consectetur sint deserunt aspernatur! Sit, expedita nostrum."} teamName={details.organizationName} />
      </div>
    </div>
  )
}
