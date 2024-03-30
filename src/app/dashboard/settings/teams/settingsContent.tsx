"use client"
import InviteTeamMember from '@/components/FormButtons/InviteTeamMember'
import Layout from '@/layouts/PageTransition'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { deleteTeamMember, myTeamMembers, resendInvite } from '@/services/teams'
import { QueryResult, User } from '@/type-definitions/auth'
import { getAvatarFallback } from '@/utils/string-formatters'
import { Button, ButtonGroup, Spinner, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { useAuthStore } from '@/store/auth.store'

interface ResultData extends QueryResult {
  results: User[]
}

export default function TeamsSettingsPage () {
  const [page, setPage] = useState(1)
  const { user, team } = useAuthStore()
  const loadData = async function ({ pageParam }: { pageParam: number }) {
    const result = await myTeamMembers(pageParam)
    return result
  }

  const { isLoading, data: results, refetch } = useInfiniteQuery({
    queryKey: ['members', page],
    queryFn: loadData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })

  const resendMutation = useMutation({
    mutationFn: (userId: string) => {
      return resendInvite(userId)
    },
  })

  const deleteMemberMutation = useMutation({
    mutationFn: (userId: string) => {
      return deleteTeamMember(userId)
    },
    onSuccess: async () => {
      refetch()
    }
  })

  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4 flex'>
        <div className='w-full md:w-1/2'>
          <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
              Team members <div className='text-black bg-primary-app h-6 w-6 text-sm rounded-full flex justify-center items-center'>{results?.pages[0] && results?.pages[0].data.length}</div>
              {(isLoading || resendMutation.isPending || deleteMemberMutation.isPending) && <Spinner size={'sm'} />}
            </div>

            <InviteTeamMember onRefresh={async () => {
              refetch()
            }} />
          </div>
          <div className='flex gap-3 items-center font-semibold h-12 px-3 border mt-3 text-sm shadow-md'>
            <div className='w-3/5'>Full name</div>
            <div className='w-1/5'>Role</div>
            <div className='w-1/5'>Actions</div>
          </div>
          {results?.pages[0] && <>
            {results?.pages[0].data.length === 0 && <div className='h-12 px-3 border mt-1 flex items-center text-sm hover:shadow-md'>You have no team members yet.</div>}
            {results?.pages[0].data.map((member: User) => (
              <div key={member.id} className='flex gap-3 items-center h-12 px-3 border mt-1 text-sm hover:shadow-md'>
                <div className='w-3/5 flex gap-2 items-center'>
                  <div className='h-8 w-8 flex justify-center items-center bg-primary-app rounded-full'>{getAvatarFallback(member.name)}</div>
                  {member.name}
                  {member.id === user?.id && <div className=' h-6 px-3 rounded-xl bg-primary-dark text-white flex items-center'>you</div>}
                </div>
                <div className='w-1/5'>{member.permissionGroup.name}</div>
                <div className='w-1/5 flex gap-1'>

                  {!member.isEmailVerified && <Tooltip label="Resend invitation">
                    <button onClick={() => resendMutation.mutate(member.id)} className='h-8 w-8 flex justify-center items-center rounded-lg border hover:bg-gray-100'>
                      <FiRefreshCw />
                    </button>
                  </Tooltip>}
                  {team?.owner !== member.id && user?.id !== member.id && <Tooltip label="Remove from team">
                    <button onClick={() => deleteMemberMutation.mutate(member.id)} className='h-8 w-8 flex justify-center items-center rounded-lg border hover:bg-gray-100'>
                      <FiTrash2 />
                    </button>
                  </Tooltip>}
                </div>
              </div>
            ))}
            {results?.pages[0].totalPages > 1 && <div className="flex justify-center py-5">
              <ButtonGroup variant='outline' isAttached>
                <Button onClick={() => setPage(results?.pages[0].page - 1)} isDisabled={results?.pages[0].page === 1} className='font-medium' size={'sm'}>Previous</Button>
                {new Array(results?.pages[0].totalPages).fill(0).map((_, i) => {
                  if ((i + 1) === results?.pages[0].page) {
                    return (
                      <Button onClick={() => setPage(i + 1)} className={`!font-medium bg-gray-200`} key={i} size={'sm'}>{i + 1}</Button>
                    )
                  } else {
                    return (
                      <Button onClick={() => setPage(i + 1)} className='!font-medium' key={i} size={'sm'}>{i + 1}</Button>
                    )
                  }
                })}

                <Button onClick={() => setPage(results?.pages[0].page + 1)} isDisabled={results?.pages[0].page === results?.pages[0].totalPages} className='font-medium' size={'sm'}>Next</Button>
              </ButtonGroup>
            </div>}

          </>}
        </div>
      </div>
    </Layout>
  )
}
