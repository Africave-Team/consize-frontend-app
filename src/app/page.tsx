// Import your Client Component
import HomePage from './pageContent'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - Consize Learning',
  description: 'Consize learning',
}

export default async function HomePageServer () {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <HomePage />
}