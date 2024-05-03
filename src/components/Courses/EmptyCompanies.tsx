import React from 'react'

export default function EmptyCompaniesState () {
  return (
    <div className='h-[70vh] w-full flex justify-center items-center'>
      <div className='w-full md:w-1/2 gap-4 flex justify-center items-center flex-col'>
        <img src="/empty.svg" />
        <div className='flex items-center flex-col'>
          <div>You do not have any companies listed yet.</div>
          <div>Enroll new companies and they will appear here</div>
        </div>
      </div>
    </div>
  )
}
