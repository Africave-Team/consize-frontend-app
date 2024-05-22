// Import your Client Component
import HomePage from './dashboardPageContent'
import { cookies } from 'next/headers'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Consize Learning',
  description: 'Consize learning',
}

export default async function HomePageServer () {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <HomePage />
}