import http from './base'
import { CreateCoursePayload, PaginationPayload } from '@/type-definitions/secure.courses'




export const createCourse = async (payload: CreateCoursePayload): Promise<any> =>
  http.post({
    url: `courses/`,
    body: { ...payload }
  })

export const updateCourse = async (payload: CreateCoursePayload, id: string): Promise<any> =>
  http.put({
    url: `courses/${id}`,
    body: { ...payload }
  })

export const fetchCourses = async (payload: PaginationPayload): Promise<any> =>
  http.get({
    url: `courses/`,
    query: payload
  })

export const fetchSingleCourse = async (course: string): Promise<any> =>
  http.get({
    url: `courses/${course}`
  })

export const searchCourses = async (payload: { search: string }): Promise<any> =>
  http.get({
    url: `courses/search`,
    query: payload
  })


