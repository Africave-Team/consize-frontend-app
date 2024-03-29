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

    const refreshToken = async () => {
      try {

        const response = await this.http.post('/auth/refresh-tokens', {
          "refreshToken": useAuthStore.getState().refresh?.token
        })
        const newTokens = response.data.tokens // Assuming your API returns a new token
        useAuthStore.setState({ access: newTokens.access, refresh: newTokens.refresh })
        return newTokens.access.token
      } catch (error) {
        console.error('Error refreshing token:', error)
        throw error // Throw error to be caught where refreshToken is called
      }
    }

    this.http.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const { response } = error
        const originalRequest = error.config
        if (response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const newToken = await refreshToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.http(originalRequest)
          } catch (error) {
            // Handle token refresh error
            useAuthStore.setState({ access: undefined, refresh: undefined, user: undefined, team: undefined })
            // For example, log the user out or redirect to login page
            console.error('Error refreshing token:', error)
            // Redirect to login page or log the user out
          }
        }
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
