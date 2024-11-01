import { CreateCertificate } from '@/type-definitions/cert-builder'
import http from './base'

export const myCertificates = async (): Promise<any> =>
  http.get({
    url: `certificates/`,
  })

export const createCertificate = async (payload: CreateCertificate): Promise<any> =>
  http.post({
    url: `certificates/`,
    body: payload
  })