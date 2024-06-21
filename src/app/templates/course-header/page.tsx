import PageContents from './pageContent'

interface DataInterface {
  courseName: string
  organizationName: string
  description: string
}

export default function Page ({ searchParams }: { searchParams: any }) {
  const decodedBuffer: Buffer = Buffer.from(searchParams.data, 'base64')
  const decodedString: string = decodedBuffer.toString('utf-8')
  const details = JSON.parse(decodedString) as DataInterface
  return (
    <PageContents details={details} />
  )
}
