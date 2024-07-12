'use client'
import { fetchPublishedCourses } from '@/services/public.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import { Skeleton, Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import he from "he"
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Layout from '@/layouts/PageTransition'
import { useNavigationStore } from '@/store/navigation.store'
import { useRouter } from 'next/navigation'
import MainFooter from '@/components/navigations/MainFooter'
import Link from 'next/link'
import { useFormik } from 'formik'
import { FaSearch } from 'react-icons/fa'
import { resolveMyTeamInfo } from '@/services/teams'
import { debounce } from '@/utils/tools'


interface ApiResponse {
  data: Course[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
  message: string
}

export default function TeamPublicCourses ({ params }: { params: { teamId: string } }) {
  const { setPageTitle } = useNavigationStore()

  const [param, setParam] = useState<{ pageParam: number, search?: string, team: string }>({ pageParam: 1, team: params.teamId })

  const router = useRouter()

  useEffect(() => {
    setPageTitle("Consize - Courses")
  }, [])

  const [companyCode, setCompanyName] = useState<string>("test")


  const { data, isLoading } = useQuery({
    queryKey: ["company_info", companyCode],
    queryFn: () => resolveMyTeamInfo(companyCode)
  })


  useEffect(() => {
    let host = location.hostname
    host = host.replace('app.', '').replace('staging-app.', '')
    let parts = host.split('.')
    parts.pop()
    parts.pop()
    if (parts.length > 0) {
      let subdomain = parts[0]
      setCompanyName(subdomain)
    }
  }, [])

  const form = useFormik({
    initialValues: {
      search: ""
    },
    onSubmit: async function () {

    },
  })

  const loadData = async function (payload: { pageParam: number, search?: string, team: string }) {
    const pageSize = 9
    const data = await fetchPublishedCourses({ page: payload.pageParam, pageSize, search: payload.search, team: payload.team })
    return data
  }

  const { data: courseResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['courses', param],
      queryFn: () => loadData(param)
    })

  const debouncedSetParam = useCallback(
    debounce((value: string) => {
      setParam((prevParam) => ({
        ...prevParam,
        search: value,
      }))
    }, 500), // 500ms debounce time
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e)
    debouncedSetParam(e.target.value)
  }

  return <Layout>
    <div className='h-[94vh] overflow-y-scroll overflow-x-hidden flex-col justify-between'>
      <div className='flex mt-3 mb-5 justify-between flex-col md:px-10 px-5 md:flex-row md:items-center'>
        <div className=''>
          <h1 className='font-semibold text-lg'>{data && data.data ? `${data.data.name} Courses` : `Courses`}</h1>
          <p className='text-sm text-[#64748B]'>{courseResults?.totalResults || 0} {data && data.data ? `courses naintained by ${data.data.name}` : `results on consize`}</p>
        </div>
        <form className='w-full md:w-1/2 border' onSubmit={form.handleSubmit}>
          {/* search form here */}
          <div className='relative'>
            <div onClick={() => document.getElementById('search')?.focus()} className='pl-12 absolute top-0 left-0 flex h-14 font-semibold items-center text-base'>{form.values.search.length === 0 ? 'Search courses' : ''}</div>
            <input onChange={handleSearchChange} onBlur={form.handleBlur} name="search" value={form.values.search} placeholder='' id="search" type="text" className={`w-full bg-white  h-14 pl-12 pr-5 border font-semibold text-lg focus-visible:outline-[#0D1F23]`} />
            <div className='absolute left-0 top-0 h-14 w-12 flex justify-center items-center'>
              <FaSearch className='text-xl' />
            </div>
            <div className='absolute right-0 top-0 h-14 w-12 flex justify-center items-center'>
              {isFetching && <Spinner size={'md'} className='text-xl' />}
            </div>
          </div>
        </form>
      </div>
      {isFetching ? <div className={`w-full grid grid-cols-1 md:grid-cols-3 gap-3 px-10 py-5`}>
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
      </div> : <div className='h-[100vh] py-5'>
        <div className={`w-full grid md:px-10 px-5 grid-cols-1 md:grid-cols-3 gap-3`}>

          {courseResults?.data.map((course) => <Link key={course.id} href={`/courses/${course.id}`} className='h-[420px] shadow-sm border cursor-pointer rounded-lg flex flex-col'>
            <div className='h-60 border rounded-t-lg bg-gray-100'>
              {course.headerMedia && course.headerMedia.url && <img src={course.headerMedia.url} loading='lazy' className='h-full w-full rounded-t-lg' />}
            </div>
            <div className='px-2 py-1'>
              <div className='text-base font-semibold'>{course.title}</div>
              <div className='line-clamp-4 text-sm' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }} />
            </div>
          </Link>)}

        </div>
        {courseResults && courseResults.totalPages > 1 && <div className='flex h-10 my-5 justify-center text-base items-center gap-3'>
          <button onClick={() => setParam({ ...param, pageParam: param.pageParam - 1 })} disabled={courseResults?.page === 1}><FiChevronLeft /></button>
          <div className='text-sm'>Page {courseResults?.page} of {courseResults?.totalPages}</div>
          <button onClick={() => setParam({ ...param, pageParam: param.pageParam + 1 })} disabled={courseResults?.totalPages === courseResults?.page}><FiChevronRight /></button>
        </div>}
        <MainFooter />
      </div>}
    </div>

  </Layout>
}
