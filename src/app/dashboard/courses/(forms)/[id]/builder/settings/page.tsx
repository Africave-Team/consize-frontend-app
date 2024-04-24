"use client"

import CourseSettingsComponent from '@/components/Courses/CourseSettings'
import Layout from '@/layouts/PageTransition'
import { useRouter } from 'next/navigation'
import { FiArrowRight } from 'react-icons/fi'

export default function page ({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full flex justify-center'>
        <div className='w-4/5'>
          <div className='flex justify-end mt-5'>
            <button onClick={() => router.push(`/dashboard/courses/${params.id}/builder/publish`)} type="button" className='h-10 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
              <FiArrowRight />
            </button>
          </div>
          <CourseSettingsComponent id={params.id} />
        </div>
      </div>
    </Layout>
  )
}