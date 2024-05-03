"use client"
import CompanyCard from '@/components/Admin/CompanyCard'
import EmptyCompaniesState from '@/components/Courses/EmptyCompanies'
import EnrollCompanyButton from '@/components/FormButtons/EnrollCompanyButton'
import Layout from '@/layouts/PageTransition'
import { adminCompanyServices } from '@/services/admin'
import { QueryResult } from '@/type-definitions/auth'
import { TeamWithOwner } from '@/type-definitions/teams'
import { Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface Companies extends QueryResult {
  data: TeamWithOwner[]
}

export default function page () {
  const [searchKey, setSearchKey] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const pageSize = 24

  const { data, isLoading, refetch } = useQuery<Companies>({
    queryKey: ["companies", { searchKey, page }],
    queryFn: () => adminCompanyServices.fetchCompanies(searchKey, page, pageSize)
  })
  const companiesData = data?.data
  return (
    <Layout>
      <div className='p-5 flex flex-col gap-5'>
        <div className='h-10 flex justify-between items-center'>
          <div className='h-full flex items-center '>
            <div className='relative'>
              <div onClick={() => document.getElementById('search')?.focus()} className='pl-12 absolute top-0 left-0 flex h-14 font-semibold items-center text-lg'>{searchKey.length === 0 ? 'Search companies' : ''}</div>
              <input onChange={(e) => setSearchKey(e.target.value)} placeholder='' id="search" type="text" className={`w-full bg-white  h-14 pl-12 pr-5 border font-semibold text-lg focus-visible:outline-[#0D1F23]`} />
              <div className='absolute left-0 top-0 h-14 w-12 flex justify-center items-center'>
                <FaSearch className='text-xl' />
              </div>
              <div className='absolute right-0 top-0 h-14 w-12 flex justify-center items-center'>
                {isLoading && <Spinner size={'md'} className='text-xl' />}
              </div>
            </div>
          </div>
          <EnrollCompanyButton reload={refetch} />
        </div>

        <div className='flex items-center justify-between'>
          <div className='items-center text-white bg-primary-dark flex justify-center h-12 w-12 rounded-full'>
            {companiesData?.length}
          </div>
          {data && data.totalPages > 1 && <div className='flex items-center gap-3'>
            <button onClick={() => setPage(data.page - 1)} disabled={data?.page === 1} className='bg-gray-50 hover:bg-gray-100 disabled:bg-white h-10 w-10 flex justify-center items-center'>
              <FiChevronLeft />
            </button>
            <button onClick={() => setPage(data.page + 1)} disabled={data?.totalPages === data?.page} className='bg-gray-50 hover:bg-gray-100 disabled:bg-white h-10 w-10 flex justify-center items-center'>
              <FiChevronRight />
            </button>
          </div>}
        </div>

        {companiesData?.length === 0 ? <div>
          <EmptyCompaniesState />
        </div> : <div className='w-full grid grid-cols-4 gap-5'>
          {companiesData?.map((team) => <CompanyCard key={team.id} team={team} />)}
        </div>}
      </div>
    </Layout>
  )
}
