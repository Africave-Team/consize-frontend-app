import http from './base'
import { CreateCoursePayload, PaginationPayload } from '@/type-definitions/secure.courses'




export const createCourse = async (payload: CreateCoursePayload): Promise<any> =>
  http.post({
    url: `courses/`,
    body: { ...payload }
  })

export const fetchCourses = async (payload: PaginationPayload): Promise<any> =>
  http.get({
    url: `courses/`,
    query: payload
  })

export const searchCourses = async (payload: { search: string }): Promise<any> =>
  http.get({
    url: `courses/search`,
    query: payload
  })


