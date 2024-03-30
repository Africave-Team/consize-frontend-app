import { useRouter } from 'next/navigation'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

export default function CreateCourse () {
  const router = useRouter()
  return (
    <div>
      <button onClick={() => router.push("/dashboard/courses/new")} className='h-16 w-16 rounded-full bg-[#0D1F23] text-white flex justify-center items-center absolute bottom-10 right-10'>
        <FaPlus />
      </button>
    </div>
  )
}
