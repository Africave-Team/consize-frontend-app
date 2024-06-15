import { fetchSurveysResponsesListing } from '@/services/survey.services'
import { SurveyResponsepayload } from '@/type-definitions/survey'
import { Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

interface ApiResponse {
  data: SurveyResponsepayload[]
  message: string
}
export default function ReviewList ({ courseId }: { courseId: string }) {
  const loadData = async function ({ course }: { course: string }) {
    const result = await fetchSurveysResponsesListing(course)
    return result
  }

  const { data, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['review-listing', courseId],
      queryFn: () => loadData({ course: courseId })
    })
  return (
    <div>
      <div className='font-bold text-lg uppercase mb-2'>
        All student reviews
      </div>
      {isFetching ? <div className='flex flex-col gap-3'>
        <Skeleton className='w-full h-44' />
        <Skeleton className='w-full h-44' />
        <Skeleton className='w-full h-44' />
        <Skeleton className='w-full h-44' />

      </div> : data && data.data && <div className='flex flex-col gap-3'>
        {data.data.map(({ student, responses }, index) => (<div key={`responses_${index}`} className='min-h-12 p-3 border-b rounded-sm'>
          <div className='flex justify-between items-center font-semibold text-sm uppercase'>
            <div>{student.name}</div>
            <div>+{student.phoneNumber}</div>
          </div>
          <div className='flex flex-col gap-3 mt-1'>
            {responses.map(({ question, answer }, index2) => (<div key={`response${index2}`} className='text-xs'>
              <div className='font-medium text-sm'>{question.question}</div>
              <div className=''>{answer}</div>
            </div>))}
          </div>
        </div>))}
      </div>}
    </div>
  )
}
