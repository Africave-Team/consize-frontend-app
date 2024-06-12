"use client"
import Layout from '@/layouts/PageTransition'
import { studentsList } from '@/services/students'
import { RTDBStudent } from '@/type-definitions/secure.courses'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

interface ApiResponse {
  data: RTDBStudent[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
  message: string
}

export default function StudentsPageContent () {
  const [page, setPage] = useState(1)
  const loadData = async function ({ pageParam }: { pageParam: number }) {
    const result = await studentsList(pageParam)
    return result
  }

  const { data: members, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['members', page],
      queryFn: () => loadData({ pageParam: page })
    })
  return (
    <Layout>
      <div className='w-full'>
        <div className='w-1'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum harum facilis dolorem enim impedit? Odit ducimus quos omnis, nisi libero ipsum ut a rem corporis magnam nostrum accusantium quam? Accusantium!
        </div>
      </div>
    </Layout>
  )
}
