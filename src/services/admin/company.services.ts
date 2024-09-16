import http from './base'

export const fetchCompanies = async (search?: string, page?: number, pageSize?: number): Promise<any> =>
  http.get({
    url: `company/`,
    query: { search, page, pageSize },

  })


export const enrollCompanies = async (payload: {
  name: string,
  email: string,
  companyName: string
}): Promise<any> =>
  http.post({
    url: `company/enroll`,
    body: payload
  })



export const transferCompany = async (payload: {
  name: string,
  email: string,
  id: string
}): Promise<any> =>
  http.post({
    url: `company/${payload.id}`,
    body: payload
  })


export const resendOnboardEmail = async (teamId: string): Promise<any> =>
  http.patch({
    url: `company/${teamId}`,
  })