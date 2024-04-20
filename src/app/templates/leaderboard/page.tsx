import PageContents from './PageContents'

interface Item {
  name: string
  rank: number
  score: number
  isCurrentUser: boolean
}

interface DataInterface {
  courseName: string
  studentName: string
  organizationName: string
  leaderboard: Item[]
}

export default function Page ({ searchParams }: { searchParams: any }) {
  const decodedBuffer: Buffer = Buffer.from(searchParams.data, 'base64')
  const decodedString: string = decodedBuffer.toString('utf-8')
  const details = JSON.parse(decodedString) as DataInterface
  return (
    <PageContents details={details} />
  )
}
