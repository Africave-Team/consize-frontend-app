import http from './base'

const uploadFile = async (payload: FormData): Promise<any> =>
  http.upload({
    url: `upload/`,
    data: payload
  })


export default uploadFile