import PageContents from './Contents'


interface DataInterface {
  studentName: string
  courseName: string
  organizationName: string
  signature1: string
  signatory1: string
  signature2: string
  signatory2: string
  logoUrl: string
}

export default function Page ({ searchParams }: { searchParams: any }) {
  const decodedBuffer: Buffer = Buffer.from(searchParams.data, 'base64')
  const decodedString: string = decodedBuffer.toString('utf-8')
  const details = JSON.parse(decodedString) as DataInterface
  return (
    <PageContents details={details} />
  )
}
