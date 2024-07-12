import React from 'react'

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
    <div className='w-full md:w-1/3 border shadow-md h-96 p-4'>
      <div>
        Something went wrong
      </div>
      <a href={home()}>Go back home</a>
    </div>
  )
}
