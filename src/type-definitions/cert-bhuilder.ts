import { ReactNode } from 'react'

export enum ComponentTypes {
  TEXT = "text",
  NAME = "name",
  SIGNATORY = "signatory",
  DATE = "date",
}

export interface ComponentText {
  classNames: string
}

export interface ComponentSignatory {
  classNames: string,
  signatoryName: string
  signature: string
  title?: string
}
export interface CertificateComponent {
  type: ComponentTypes
  default: string
  position: {
    x: number
    y: number
  },
  text?: ComponentText
  signatory?: ComponentSignatory
}
export interface CertificateTemplate {
  name?: string
  bg: string
  components: CertificateComponent[]
}