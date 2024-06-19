import React from 'react'
import DuplicateCoursePage from './pageContent'

export default function page ({ params }: { params: { id: string } }) {
  return (
    <DuplicateCoursePage courseId={params.id} />
  )
}
