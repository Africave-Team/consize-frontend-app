import React from 'react'

export default function Embeddable ({ searchParams }: { searchParams: { url: string } }) {
  return <video className='h-screen w-screen' controls>
    <source src={searchParams.url} />
    Your browser does not support the video tag.
  </video>
}
