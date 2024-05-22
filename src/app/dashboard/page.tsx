// Import your Client Component
import HomePage from './dashboardPageContent'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard - Consize Learning',
  description: 'Consize learning',
}

export default async function HomePageServer () {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  redirect("/dashboard/courses")
  return <HomePage />
}