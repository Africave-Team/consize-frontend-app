export enum CertificatesStatus {
  PENDING = "pending",
  ACTIVE = "active",
  DISABLED = "disabled"
}

export enum ComponentTypes {
  TEXT = "text",
  NAME = "name",
  SIGNATORY = "signatory",
  DATE = "date",
  CIRCLE = 'circle'
}

export interface CertificatesInterface {
  id: string,
  name: string,
  teamId: string,
  colors: string[],
  text: string[],
  status: CertificatesStatus,
  signatories: string[]
}

export interface CreateCertificate {
  name: string
  signatories: string[]
  status: CertificatesStatus
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
  position: {
    x: number
    y: number
  },
  default?: string
  text?: ComponentText
  signatory?: ComponentSignatory
}
export interface CertificateTemplate {
  name?: string
  bg: string
  components: CertificateComponent[]
}