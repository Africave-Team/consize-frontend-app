// Import your Client Component
import { Metadata } from 'next'
import ProfileSettings from './settingsContent'

export const metadata: Metadata = {
  title: 'Security settings - Consize',
  description: 'Consize',
}

export default async function HomePageServer () {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <ProfileSettings />
}