'use client'
import CustomHeaderImage from '@/components/CustomHeaderImage'
import React from 'react'

interface DataInterface {
  courseName: string
  organizationName: string
  description: string
}

export default function PageContents ({ details }: { details: DataInterface }) {
  return (
    <div className="h-screen w-screen overflow-y-scroll flex justify-center items-center">
      <div className="course-header">
        <CustomHeaderImage bgColor='#27107a' bgPattern='default-bg-spiral-3' imageText={details.courseName} description={details.description} teamName={details.organizationName} />
      </div>
    </div>
  )
}
