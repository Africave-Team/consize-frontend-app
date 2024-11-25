'use client'
import React from 'react'
import "./styles.css"
import ViewCertificateComponent from '@/components/ViewCertificateComponent'

interface DataInterface {
  studentName: string
  courseName: string
  organizationName: string
  signature1: string
  signatory1: string
  signature2: string
  signatory2: string
  logoUrl: string
  certificateId: string
  template: boolean
}

export default function PageContents ({ details }: { details: DataInterface }) {
  return <div className='h-screen certificate-view'>
    <ViewCertificateComponent details={details} />
  </div>
}
