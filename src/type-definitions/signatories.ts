export interface CreateSignatory {
  name: string
  email: string
  position: string
}

export interface Signatory extends CreateSignatory {
  id: string
  signature: string
}