import qs from "query-string"
import axios from 'axios'

import type { IPut, IGet, IPost, IPatch, IDelete } from '@/type-definitions/IAxios'
import { useAuthStore } from '@/store/auth.store'


class HttpFacade {
  private http

  private env = process.env.NEXT_PUBLIC_APP_ENV
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  constructor() {
    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: { 'Content-Type': 'application/json' },
    })

    this.http.interceptors.request.use(
      (config) => {
        if (!config.headers.get('Authorization')) {
          if (typeof window !== 'undefined') {
            // Access the Zustand store only on the client-side
            try {
              const { access } = useAuthStore.getState()
              config.headers['Authorization'] = `Bearer ${access?.token}`
            } catch (error) {
              console.log(error)
            }
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.http.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        const { response } = error
        return Promise.reject(response.data)
      }
    )

  }

  post = async ({ url, body, headers = {} }: IPost) => {
    let py = { ...body }
    const response = await this.http.post(url, py, { headers })
    return response.data
  };

  patch = async ({ url, body, headers = {} }: IPatch) => {
    let py = { ...body }
    const response = await this.http.patch(url, py, { headers })
    return response.data
  };

  get = async ({ url, query = {}, body = {}, headers = {} }: IGet) => {
    let py = { ...query }
    const queryString = qs.stringify(py)
    const response = await this.http.get(`${url + '?' + queryString}`, { headers })
    return response.data
  };

  delete = async ({ url, body = {}, headers = {} }: IDelete) => {
    const response = await this.http.delete(url, { headers, data: body })
    return response.data
  };

  put = async ({ url, body, headers = {} }: IPut) => {
    let py = { ...body }
    const response = await this.http.put(url, py, { headers })
    return response.data
  };
}

const http = new HttpFacade()

export default http
