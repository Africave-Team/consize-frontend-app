import { CreateSignatory } from '@/type-definitions/signatories'
import http from './base'

export const mySignatories = async (): Promise<any> =>
  http.get({
    url: `signatures/`,
  })

export const createSignatories = async (payload: CreateSignatory): Promise<any> =>
  http.post({
    url: `signatures/`,
    body: payload
  })