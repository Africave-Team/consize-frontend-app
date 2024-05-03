import { Metadata } from 'next'
import LogoutPageContent from './content'
import LoginHome from './content'

export const metadata: Metadata = {
  title: 'Kippa - Reset password',
  description: 'Kippa learning',
}


interface Props {
  searchParams: {
    token: string
  }
}
export default async function Login (data: Props) {
  return <LoginHome token={data.searchParams.token} />
}
