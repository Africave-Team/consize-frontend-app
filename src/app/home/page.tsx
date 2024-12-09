import React from 'react'
import HomePageContent from './PageContent'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - Consize Learning',
  description: 'Deliver impactful training - that your learners will actually take &#x2013; through everyday messaging tools, all in 10 minutes a day.',
  icons: "https://framerusercontent.com/images/x8KIepxiGzVmPd17alnttXas5Q.svg"
}

export default function page () {
  return (
    <HomePageContent disabled={process.env['NEXT_PUBLIC_DISABLE_SITE'] === "YES"} />
  )
}
