import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

export default function TeamNotFound () {
  const home = () => {

    switch (`${process.env.NEXT_PUBLIC_APP_ENV}`) {
      case "development":
        return "https://app.consize.localhost/courses"
      case "staging":
        return "https://staging-app.consize.com/courses"
      default:
        return "https://app.consize.com/courses"
    }
  }
  return (
    <div className='w-full md:w-1/3 bg-white rounded-md border shadow-md h-56 p-4'>
      <div className='flex items-center justify-center gap-3 font-bold text-2xl'>
        <FiAlertTriangle className='text-primary-app' />
        There&apos;s been a glitch
      </div>
      <div className='mt-4'>
        We could not find any teams related to the provided subdomain.
        <a className='ml-2 text-purple-500' href={home()}>Go back home</a>
      </div>
    </div>
  )
}
