import { useNavigationStore } from '@/store/navigation.store'
import { ListStyle } from '@/type-definitions/navigation'
import { Skeleton } from '@chakra-ui/react'
import React from 'react'

export default function LoadingCourseSkeleton () {
  const { preferredListStyle } = useNavigationStore()
  return (
    <div>
      {preferredListStyle === ListStyle.GRID ? <div className={`w-full grid grid-cols-3 gap-3`}>
        <div className='h-60'>
          <Skeleton className='h-full w-full' />
        </div>
        <div className='h-60'>
          <Skeleton className='h-full w-full' />
        </div>
        <div className='h-60'>
          <Skeleton className='h-full w-full' />
        </div>
      </div> : <div className={`w-full grid grid-cols-1 gap-3`}>
        <div className='h-20'>
          <Skeleton className='h-full w-full' />
        </div>
        <div className='h-20'>
          <Skeleton className='h-full w-full' />
        </div>
        <div className='h-20'>
          <Skeleton className='h-full w-full' />
        </div>
      </div>}
    </div>
  )
}
