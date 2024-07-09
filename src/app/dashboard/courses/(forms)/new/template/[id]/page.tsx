import React from 'react'
import CreateCourseFromTemplatePage from './pageContent'

export default function page ({ params }: { params: { id: string } }) {
  return (
    <CreateCourseFromTemplatePage courseId={params.id} />
  )
}
