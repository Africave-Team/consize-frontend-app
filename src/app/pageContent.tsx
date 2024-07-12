'use client'
import { useEffect } from 'react'


export default function Home () {
  useEffect(() => {
    let host = location.hostname
    host = host.replace('app.', '').replace('staging-app.', '')
    let parts = host.split('.')
    parts.pop()
    parts.pop()
    if (parts.length > 0) {
      let subdomain = parts[0]
      console.log(subdomain)
      // confirm the client from the subdomain
    } else {
      location.href = location.origin + '/courses'
    }
  })
  return (
    <section className='h-screen overflow-y-scroll'>

    </section>
  )
}
