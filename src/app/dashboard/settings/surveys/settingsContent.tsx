"use client"
import CreateSurveyButton from '@/components/FormButtons/CreateSurveyButton'
import DeleteSurveyButton from '@/components/FormButtons/DeleteSurveyButton'
import UpdateSurveyButton from '@/components/FormButtons/EditSurveyButton'
import Layout from '@/layouts/PageTransition'
import { fetchSurveys } from '@/services/survey.services'
import { Survey } from '@/type-definitions/survey'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
interface ApiResponse {
  data: Survey[]
  message: string
}

export default function TeamSurveys () {
  const { data: surveys, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['surveys'],
      queryFn: () => fetchSurveys()
    })
  return (
    <Layout>
      <div className='w-full overflow-y-scroll max-h-full p-4'>
        <div className='h-12 w-full flex justify-between items-center'>
          <div className='h-full flex items-center font-bold text-lg'>
            Your team&apos;s surveys
          </div>
          <CreateSurveyButton onFinish={refetch} />
        </div>
        <div>


          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Survey title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Survey questions
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  surveys && surveys.data.map((survey) => (<tr key={survey.id} className="bg-white border-b ">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {survey.title}
                    </th>
                    <td className="px-6 py-4">
                      {survey.questions.length}
                    </td>
                    <td className="px-6 py-4 flex gap-2 items-center">
                      <UpdateSurveyButton onFinish={refetch} survey={survey} />
                      <DeleteSurveyButton refetch={refetch} surveyId={survey.id} />
                    </td>
                  </tr>))
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </Layout>
  )
}
