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
  // console.log(Buffer.from(JSON.stringify({
  //   "studentName": "James Onaghi",
  //   "courseName": "Astrophysics",
  //   "organizationName": "CARE International",
  //   "signature1": "first_man",
  //   "signatory1": "First man",
  //   "signature2": "second_man",
  //   "signatory2": "Second Man"
  // }), 'utf-8').toString('base64'))
  const decodedBuffer: Buffer = Buffer.from(searchParams.data, 'base64')
  const decodedString: string = decodedBuffer.toString('utf-8')
  const details = JSON.parse(decodedString) as DataInterface

  return (
    <PageContents details={details} />
  )
}
