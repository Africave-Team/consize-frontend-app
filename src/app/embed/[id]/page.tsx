import React from 'react'

export default function Embeddable ({ params }: { params: { id: string } }) {
  return <video className='h-screen w-screen' controls>
    <source src={`https://storage.googleapis.com/kippa-cdn-public/microlearn-images/${params.id}.mp4`} />
    Your browser does not support the video tag.
  </video>
}
