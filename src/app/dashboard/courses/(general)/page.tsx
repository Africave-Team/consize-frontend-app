"use client"
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { CiGrid41, CiGrid2H } from "react-icons/ci"
import { ListStyle } from '@/type-definitions/navigation'
import CreateCourse from '@/components/CreateCourse'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { fetchCourses } from '@/services/secure.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import CoursesTable from '@/components/Courses/CoursesTable'
import { FiBookOpen, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Menu, MenuButton, MenuItem, MenuList, Select, Spinner } from '@chakra-ui/react'
import SearchCourses from '@/components/Courses/SearchCourses'
import LoadingCourseSkeleton from '@/components/Courses/LoadingCourseSkeletons'
import { useRouter } from 'next/navigation'
import { GoStack } from 'react-icons/go'
import Link from 'next/link'

interface ApiResponse {
  data: Course[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
  message: string
}

enum PageType {
  ALL = 'all',
  COURSE = 'course',
  BUNDLE = 'bundle',
  DRAFT = 'draft'
}

export default function page () {
  const { preferredListStyle, toggleListStyle, setPageTitle } = useNavigationStore()
  const [page, setPage] = useState(1)
  const [type, setType] = useState<PageType>(PageType.ALL)

  const loadData = async function (payload: { pageParam: number, filter: string }) {
    const pageSize = 12
    const data = await fetchCourses({ page: payload.pageParam, pageSize, filter: payload.filter })
    return data
  }

  const { data: courseResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['projects', { page, type }],
      queryFn: () => loadData({ pageParam: page, filter: type })
    })

  const tabs = [
    {
      title: "All published",
      value: PageType.ALL
    },
    {
      title: "Courses",
      value: PageType.COURSE
    },
    {
      title: "Bundles",
      value: PageType.BUNDLE
    },
    {
      title: "Drafts",
      value: PageType.DRAFT
    }
  ]

  useEffect(() => {
    setPageTitle("Dashboard - Courses")
  }, [])



  return (
    <Layout>
      <div className='w-full h-full relative'>
        <div className='absolute top-0 px-5 left-0 h-full w-full'>
          <div className='w-full overflow-y-scroll h-full'>
            <div className='h-16 w-full flex justify-between items-center'>
              <div className='flex gap-3 items-center h-full'>
                <h2 className='font-bold text-2xl'>
                  Courses
                </h2>
                <div className='h-6 min-w-6 px-2 text-white text-xs rounded-full bg-[#0D1F23] flex justify-center items-center'>
                  {courseResults?.totalResults}
                </div>
                {(isFetching) && <Spinner size={'sm'} />}
              </div>
              <div className='h-full flex gap-2 items-center'>
                <div className='w-60'>
                  <SearchCourses />
                </div>
                <div className='w-44'>
                  <Select value={type} size={'md'} className='rounded-lg border-gray-300' onChange={(e) => setType(e.target.value as PageType)}>
                    {tabs.map((tab, i) => {
                      return (
                        <option key={tab.value} value={tab.value}>
                          {tab.title}
                        </option>
                      )
                    })}
                  </Select>
                </div>
                <Menu>
                  <MenuButton type='button' className='text-sm flex justify-center items-center gap-2 h-10 w-32 text-white bg-[#0D1F23] rounded-lg'><FaPlus className='text-sm mr-2' />Create new</MenuButton>
                  <MenuList className='text-sm py-0 bg-primary-dark' minWidth={'140px'}>
                    <MenuItem as={Link} href="/dashboard/courses/new" className='hover:bg-primary-dark/90 rounded-md bg-primary-dark text-white' icon={<FiBookOpen className='text-sm' />}>Course</MenuItem>
                    <MenuItem href="/dashboard/courses/new/bundle" as={Link} className='hover:bg-primary-dark/90 rounded-md bg-primary-dark text-white' icon={<GoStack className='text-sm' />}>Bundle</MenuItem>
                  </MenuList>
                </Menu>
                <button onClick={toggleListStyle} className='h-10 w-10 border rounded-md group hover:bg-black flex justify-center items-center'>
                  {preferredListStyle !== ListStyle.ROWS && <CiGrid2H className='text-2xl group-hover:text-white' />}
                  {preferredListStyle !== ListStyle.GRID && <CiGrid41 className='text-2xl group-hover:text-white' />}
                  {/* <CiGrid41 className='text-2xl' /> */}
                </button>
              </div>
            </div>
            <div className='w-full min-h-[70vh] py-2 course-list-container pb-10'>
              {isFetching ? <LoadingCourseSkeleton /> : <div>
                <CoursesTable courses={courseResults?.data || []} />
              </div>}
            </div>
            {courseResults && courseResults?.totalPages > 1 && <div className='flex justify-center text-base items-center gap-3 pb-20'>
              <button onClick={() => setPage(page - 1)} disabled={courseResults?.page === 1}><FiChevronLeft /></button>
              <div className='text-sm'>Page {courseResults?.page} of {courseResults?.totalPages}</div>
              <button onClick={() => setPage(page + 1)} disabled={courseResults?.totalPages === courseResults?.page}><FiChevronRight /></button>
            </div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}
