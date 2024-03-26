import { Metadata } from 'next'
import VerifyContent from './content'

export const metadata: Metadata = {
  title: 'Kippa - Account verification.....',
  description: 'Kippa learning',
}


interface Props {
  searchParams: {
    token: string
  }
}
export default async function Verify (data: Props) {
  return <VerifyContent token={data.searchParams.token} />
}
