import { Metadata } from 'next'
import LogoutPageContent from './content'
import LoginHome from './content'

export const metadata: Metadata = {
  title: 'Consize - Create account',
  description: 'Consize learning',
}

export default async function Login () {
  return <LoginHome />
}
