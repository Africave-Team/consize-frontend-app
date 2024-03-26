import { Metadata } from 'next'
import AcceptInvitation from './InvitationContent'

export const metadata: Metadata = {
  title: 'Kippa - Accept invitation',
  description: 'Kippa learning',
}


interface Props {
  searchParams: {
    token: string
  }
}
export default async function Login (data: Props) {
  return <AcceptInvitation token={data.searchParams.token} />
}
