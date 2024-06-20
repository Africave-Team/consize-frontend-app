"use client"
import { useAuthStore } from '@/store/auth.store'
import React, { useEffect, useState } from 'react'
import { PiDotsSixVerticalBold } from 'react-icons/pi'
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react"
import { Draggable } from "@hello-pangea/dnd"
import { FiTrash2 } from 'react-icons/fi'
import { Course } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import CourseContents from '../Dashboard/ViewCourseContents'

interface ApiResponse {
  data: Course
  message: string
}

export default function CourseItem ({ id, index, onDelete }: { id: string, index: number, onDelete: (course: Course) => void }) {
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', id],
      queryFn: () => loadData({ course: id })
    })

  return (
    <Draggable index={index} draggableId={id}>
      {(draggableProvided) => (
        <div ref={draggableProvided.innerRef} className='cursor-pointer border-t items-center hover:bg-[#F8F8F8] flex justify-between' {...draggableProvided.draggableProps}>
          <div className='flex-1'>
            <CourseContents courseId={id}>
              <div className={`px-4 bg-white w-full h-10 flex justify-between items-center`}>
                <div className='flex gap-3 w-full'>
                  {isFetching ? <div>Loading details</div> : <div className='flex gap-2 items-center justify-between  w-full'>
                    <div className='flex gap-2 items-center'>
                      <span {...draggableProvided.dragHandleProps}>
                        <PiDotsSixVerticalBold className='cursor-move' />
                      </span>
                      <div className='font-semibold text-sm line-clamp-1'>{courseDetails?.data.title}</div>
                    </div>
                  </div>}
                </div>
                <div>
                </div>
              </div>
            </CourseContents>
          </div>
          {courseDetails && <button type='button' onClick={() => onDelete(courseDetails.data)} className='h-7 w-7 rounded-lg select-none flex items-center justify-center'>
            <FiTrash2 className='text-sm' />
          </button>}

        </div>
      )}
    </Draggable>
  )
}
