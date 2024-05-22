// Import your Client Component
import { Metadata } from 'next'
import TeamsSettingsPage from './settingsContent'

export const metadata: Metadata = {
  title: 'Teams settings - Consize',
  description: 'Consize learning',
}

export default async function HomePageServer () {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <TeamsSettingsPage />
}