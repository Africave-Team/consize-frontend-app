// Import your Client Component
import { Metadata } from 'next'
import PageContent from './studentsPage'

export const metadata: Metadata = {
  title: 'Students - Consize',
  description: 'Consize learning',
}

export default async function HomePageServer () {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <PageContent />
}