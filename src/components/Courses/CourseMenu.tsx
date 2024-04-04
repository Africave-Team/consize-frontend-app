import { Course, CourseStatus, Sources } from '@/type-definitions/secure.courses'
import React from 'react'
import { HiDotsHorizontal, HiOutlineDuplicate } from 'react-icons/hi'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { FiEdit2, FiEye, FiSettings, FiTrash2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function CourseMenu ({ course, single }: { course: Course, single?: boolean }) {
  const router = useRouter()
  return (
    <Menu>
      <MenuButton type='button' className='bg-gray-100 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center'>
        <img src="/dots.svg" />
      </MenuButton>
      <MenuList className='text-sm' minWidth={'200px'}>
        {(course.status === CourseStatus.PUBLISHED || course.status === CourseStatus.COMPLETED) && <MenuItem onClick={() => router.push(`/dashboard/courses/${course.id}`)} className='hover:bg-gray-100' icon={<FiEye className='text-sm' />}>View {course.bundle ? 'bundle' : 'course'} stats</MenuItem>}
        {!course.bundle && <MenuItem className='hover:bg-gray-100' icon={<HiOutlineDuplicate className='text-sm' />}>Duplicate {course.bundle ? 'bundle' : 'course'}</MenuItem>}
        {!single && <MenuItem onClick={() => router.push(`/dashboard/courses/${course.id}/builder`)} className='hover:bg-gray-100' icon={<FiEdit2 className='text-sm' />}>Edit {course.bundle ? 'bundle' : 'course'}</MenuItem>}
        {single && <MenuItem onClick={() => router.push(`/dashboard/courses/${course.id}/builder/${course.status === CourseStatus.DRAFT && course.source === Sources.MANUAL ? 'course-info' : 'outline'}`)} className='hover:bg-gray-100' icon={<FiEdit2 className='text-sm' />}>Edit {course.bundle ? 'bundle' : 'course'} in builder</MenuItem>}
        {course.status !== CourseStatus.DRAFT && <MenuItem onClick={() => router.push(`/dashboard/courses/${course.id}/builder/settings`)} className='hover:bg-gray-100' icon={<FiSettings className='text-sm' />}>{course.bundle ? 'Bundle' : 'Course'} settings</MenuItem>}
        <MenuItem className='hover:bg-gray-100' icon={<FiTrash2 className='text-sm' />}>Delete {course.bundle ? 'bundle' : 'course'}</MenuItem>
      </MenuList>
    </Menu>
  )
}
