import { Course, CourseStatus, Sources } from '@/type-definitions/secure.courses'
import React from 'react'
import { HiDotsHorizontal, HiOutlineDuplicate } from 'react-icons/hi'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { FiEdit2, FiEye, FiSettings, FiTrash2 } from 'react-icons/fi'
import OpenSettings from '../Dashboard/OpenSettings'
import Link from 'next/link'
import DeleteCourseMenu from '../Dashboard/DeleteCourseMenu'

export default function CourseMenu ({ course, single }: { course: Course, single?: boolean }) {
  return (
    <Menu>
      <MenuButton type='button' className='bg-gray-100 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center'>
        <img src="/dots.svg" />
      </MenuButton>
      <MenuList className='text-sm' minWidth={'200px'}>
        {(course.status === CourseStatus.PUBLISHED || course.status === CourseStatus.COMPLETED) && <MenuItem as={Link} href={`/dashboard/courses/${course.id}`} className='hover:bg-gray-100' icon={<FiEye className='text-sm' />}>View {course.bundle ? 'bundle' : 'course'} stats</MenuItem>}
        <MenuItem as={Link} href={`/dashboard/courses/${course.id}/duplicate`} className='hover:bg-gray-100' icon={<HiOutlineDuplicate className='text-sm' />}>Duplicate {course.bundle ? 'bundle' : 'course'}</MenuItem>
        {!single && <MenuItem as={Link} href={`/dashboard/courses/${course.id}/builder`} className='hover:bg-gray-100' icon={<FiEdit2 className='text-sm' />}>Edit {course.bundle ? 'bundle' : 'course'}</MenuItem>}
        {single && !course.bundle && <MenuItem as={Link} href={`/dashboard/courses/${course.id}/builder/${!course.bundle ? 'course-info' : 'bundle'}`} className='hover:bg-gray-100' icon={<FiEdit2 className='text-sm' />}>Edit {course.bundle ? 'bundle' : 'course'} in builder</MenuItem>}
        <OpenSettings id={course.id} />
        <DeleteCourseMenu id={course.id} label={`Delete ${course.bundle ? 'bundle' : 'course'}`} />
      </MenuList>
    </Menu>
  )
}
