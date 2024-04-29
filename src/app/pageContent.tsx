'use client'
import { useEffect } from 'react'


export default function Home () {
  useEffect(() => {
    location.href = location.origin + '/auth/login'
  })
  return (
    <section className='h-screen overflow-y-scroll'>

    </section>
  )
}
