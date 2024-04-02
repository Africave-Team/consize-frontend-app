import React from 'react'

export default function EmptyLessonState () {
  return (
    <div className='h-[10vh] w-full flex justify-center items-center'>
      <div className='w-full gap-4 flex justify-center items-center flex-col'>
        <img src="/empty.svg" className='h-10' />
        <div className='flex items-center flex-col'>
          <div>You do not have any lessons added yet.</div>
          <div>Add new lessons and they will appear here</div>
        </div>
      </div>
    </div>
  )
}
