import http from './base'
import { PaginationPayload } from '@/type-definitions/secure.courses'

export const fetchPublishedCourses = async (payload: Omit<PaginationPayload, 'filter'>): Promise<any> =>
  http.get({
    url: `courses/public/all`,
    query: payload
  })


export const fetchSinglePublishedCourse = async (courseId: string): Promise<any> =>
  http.get({
    url: `courses/public/single/${courseId}`
  })

export const verifyStudentPhone = async (phoneNumber: string): Promise<any> =>
  http.get({
    url: `students`,
    query: {
      phoneNumber
    }
  })


export const enrollStudent = async (studentId: string, courseId: string, custom: any, cohortId?: string): Promise<any> =>
  http.post({
    url: `students/${studentId}/enrollments`,
    body: {
      course: courseId, custom, cohortId
    }
  })


export const registerStudent = async (payload: { email: string, firstName: string, otherNames: string, phoneNumber: string, tz: string, teamId: string }): Promise<any> =>
  http.post({
    url: `students/`,
    body: {
      ...payload, custom: {}
    }
  })

export const verifyWHatsappCode = async (code: string, teamId: string): Promise<any> =>
  http.post({
    url: `students/otp`,
    body: {
      code, teamId
    }
  })