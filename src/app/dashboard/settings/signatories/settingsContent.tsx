"use client"
import CreateSignatoryButton from '@/components/FormButtons/CreateSignatoryButton'
import Layout from '@/layouts/PageTransition'
import { mySignatories } from '@/services/signatories'
import { Signatory } from '@/type-definitions/signatories'
import { Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'

export default function TeamsSettingsPage () {
  const loadData = async function () {
    const result = await mySignatories()
    return result.data
  }

  const { data: signatories, isFetching, refetch } =
    useQuery<Signatory[]>({
      queryKey: ['signatories'],
      queryFn: () => loadData()
    })

  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>
        {isFetching ? <div className='flex flex-col gap-3'>
          <Skeleton h={"40px"} className='w-1/5' />
          <Skeleton h={"40px"} className='w-1/3' />
          <Skeleton h={"40px"} className='w-1/3' />
        </div> : <div className='flex flex-col gap-3 w-full md:w-3/5'>
          {(signatories && signatories?.length < 2) && <div>
            <CreateSignatoryButton reload={refetch} />
          </div>}
          <div className='py-5 flex flex-col gap-4'>
            {signatories && signatories.length === 0 && <div>No signatories available</div>}
            {signatories && signatories.map(e => (<div key={e.id} className='h-16 px-4 w-full border flex justify-between items-center'>
              <div>
                <div className='font-semibold text-lg'>{e.name}</div>
                <div className='text-sm'>{e.email}</div>
              </div>
              <button className='h-10 w-10 rounded-lg hover:bg-gray-100 flex justify-center items-center'>
                <FaTrash />
              </button>
            </div>))}
          </div>

        </div>}

      </div>
    </Layout>
  )
}
