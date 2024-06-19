import { fetchSurveysResponsesChart } from '@/services/survey.services'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@chakra-ui/react'
const Chart = dynamic(async () => await import('react-apexcharts'), { ssr: false })

interface ChartDataInformation {
  surveyId: string
  questionId: string
  questionText: string
  choices: string[]
  responses: { option: string, count: number, percent: number }[]
  totalCount: number
}
interface ApiResponse {
  data: ChartDataInformation[]
  message: string
}
export default function ReviewCharts ({ courseId }: { courseId: string }) {
  const loadData = async function ({ course }: { course: string }) {
    const result = await fetchSurveysResponsesChart(course)
    return result
  }

  const { data, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['review-charts', courseId],
      queryFn: () => loadData({ course: courseId })
    })

  return (
    <div>
      <div className='font-bold text-lg uppercase mb-2'>
        Charts
      </div>
      {isFetching ? <div className='flex flex-col gap-3'>
        <Skeleton className='w-full h-44' />
        <Skeleton className='w-full h-44' />
        <Skeleton className='w-full h-44' />
        <Skeleton className='w-full h-44' />

      </div> : data && data.data && <div className='flex flex-col gap-3'>
        {data.data.map(({ questionText, responses, choices }, index) => (<div key={`review_question_chart_${index}`}>
          <Chart
            series={responses.map(e => e.percent)}
            options={{
              title: {
                text: questionText
              },
              labels: choices,
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }} type="donut" width={"100%"} height={190} />
        </div>))}

      </div>}
    </div>
  )
}
