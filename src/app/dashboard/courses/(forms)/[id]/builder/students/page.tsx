"use client"
import CreateCohort from '@/components/Dashboard/CreateCohorts'
import Layout from '@/layouts/PageTransition'
import { createCohort } from '@/services/cohorts.services'
import { fetchSingleCourse } from '@/services/secure.courses.service'
import { channelsList, membersList } from '@/services/slack.services'
import { useAuthStore } from '@/store/auth.store'
import { Distribution } from '@/type-definitions/callbacks'
import { Course } from '@/type-definitions/secure.courses'
import { SlackChannel, SlackUser } from '@/type-definitions/slack'
import { SlackCreateCohortValidator } from '@/validators/SlackCreateCohort'
import { Checkbox, FormControl, FormLabel, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FiArrowRight, FiX } from 'react-icons/fi'

interface ApiResponse {
  data: Course
  message: string
}

export default function page ({ params }: { params: { id: string } }) {
  const router = useRouter()
  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const { data: courseDetails, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['course', params.id],
      queryFn: () => loadData({ course: params.id })
    })


  return (

    <Layout>
      <div className='h-screen'>
        <div className='w-full overflow-y-scroll  max-h-full'>
          <div className='flex-1 flex justify-center md:py-10'>
            <div className='px-4 w-full md:w-3/5'>
              <div className='flex justify-between items-center mt-5'>
                <div className='font-medium text-lg'>Add students to this course</div>
                <div className='flex gap-2'>
                  <button onClick={() => router.push(`/dashboard/courses/${params.id}/builder/publish`)} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-primary-dark bg-primary-app hover:bg-primary-app/90'>Continue to publish
                    <FiArrowRight />
                  </button>
                </div>
              </div>
              {courseDetails && <CreateCohort hideTitle={true} course={courseDetails.data} onClose={() => { }} hideLink={true} />}

            </div>
          </div>
          <div className='h-96'></div>
        </div>
      </div>
    </Layout>
  )
}
