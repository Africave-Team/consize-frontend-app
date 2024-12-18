export enum CertificatesStatus {
  PENDING = "pending",
  ACTIVE = "active",
  DISABLED = "disabled"
}

export enum ComponentTypes {
  BACKGROUND = 'background',
  TEXT = "text",
  NAME = "name",
  IMAGE = "image",
  SIGNATORY = "signatory",
  COURSE = "course-title",
  DATE = "date",
  CIRCLE = 'circle',
  TRIANGLE = "triangle",
  TRAPEZOID = "trapezoid",
  SQUARE = 'square',
  RECTANGLE = "rectangle"
}

export enum TextAlign {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center"
}

export enum TextDecoration {
  NONE = "none",
  UNDERLINE = "underline",
  LINETHROUGH = 'line-through'
}

export enum TextStyle {
  NORMAL = "normal",
  ITALIC = "italic"
}

export enum TextTransform {
  NONE = 'none',
  UPPERCASE = 'uppercase'
}


export interface ElementProperties {
  height: number | "auto"
  width: number | "auto"
  size: number
  leftSize: number
  rightSize: number
  bottomSize: number
  color: string
  radius: {
    rt: number
    rb: number
    lb: number
    lt: number
  },
  border?: {
    r: number
    b: number
    l: number
    t: number,
    color: string
  },
  text?: {
    size: number
    weight: number
    family: string
    color: string
    value: string
    align: TextAlign
    decoration?: TextDecoration,
    style?: TextStyle,
    transform?: TextTransform
  },

  url?: string
}
export interface CertificatesInterface {
  id: string,
  name: string,
  teamId: string,
  colors: string[],
  text: string[],
  status: CertificatesStatus,
  signatories: string[]
  components: CertificateTemplate
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
  properties: Partial<ElementProperties>,
  default?: string
  text?: ComponentText
  signatory?: ComponentSignatory
}
export interface CertificateTemplate {
  name?: string
  bg: string
  components: CertificateComponent[]
}