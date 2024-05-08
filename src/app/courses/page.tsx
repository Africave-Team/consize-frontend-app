'use client'
import { fetchPublishedCourses } from '@/services/public.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import { Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import he from "he"
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import { useRouter } from 'next/navigation'


interface ApiResponse {
  data: Course[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
  message: string
}

export default function PublicCourses () {
  const { setPageTitle } = useNavigationStore()
  const [page, setPage] = useState(1)

  const router = useRouter()

  useEffect(() => {
    setPageTitle("Consize - Courses")
  }, [])

  const loadData = async function (payload: { pageParam: number }) {
    const pageSize = 9
    const data = await fetchPublishedCourses({ page: payload.pageParam, pageSize })
    return data
  }

  const { data: courseResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['courses', { page }],
      queryFn: () => loadData({ pageParam: page })
    })
  return <Layout>
    <div className='page-container-2 overflow-y-scroll flex flex-col justify-between px-10 py-5'>
      {isFetching ? <div className={`w-full grid grid-cols-3 gap-3`}>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
        <div className='h-96'>
          <Skeleton className='h-full w-full rounded-lg' />
        </div>
      </div> : <div>
        <div className='mb-3'>
          <h1 className='font-semibold text-lg'>Courses</h1>
          <p className='text-sm text-[#64748B]'>{courseResults?.data.length} results on consize</p>
        </div>
        <div className={`w-full grid grid-cols-3 gap-3`}>

          {courseResults?.data.map((course) => <div onClick={() => router.push(`/courses/${course.id}`)} className='h-96 shadow-sm border cursor-pointer rounded-lg flex flex-col'>
            <div className='h-60 border rounded-t-lg'>
              <img src={course.headerMedia.url} loading='lazy' className='h-full rounded-t-lg' />
            </div>
            <div className='px-2 py-1'>
              <div className='text-base font-semibold'>{course.title}</div>
              <div className='line-clamp-4 text-sm' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }} />
            </div>
          </div>)}

        </div>
      </div>}
      {courseResults && courseResults.totalPages > 1 && <div className='flex h-10 mt-5 justify-center text-base items-center gap-3'>
        <button onClick={() => setPage(page - 1)} disabled={courseResults?.page === 1}><FiChevronLeft /></button>
        <div className='text-sm'>Page {courseResults?.page} of {courseResults?.totalPages}</div>
        <button onClick={() => setPage(page + 1)} disabled={courseResults?.totalPages === courseResults?.page}><FiChevronRight /></button>
      </div>}
      <div className='h-96'></div>
    </div>
  </Layout>
}

