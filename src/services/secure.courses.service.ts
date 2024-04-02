import http from './base'
import { AddBlock, AddBlockQuiz, AddLessonQuiz, CreateCoursePayload, PaginationPayload } from '@/type-definitions/secure.courses'




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



// Blocks


export const addLessonBlock = async (payload: AddBlock): Promise<any> =>
  http.post({
    url: `blocks/${payload.courseId}/${payload.lessonId}`,
    body: { ...payload.block }
  })





// quiz
export const addBlockQuiz = async (payload: AddBlockQuiz): Promise<any> =>
  http.post({
    url: `blocks/quiz/${payload.courseId}/${payload.lessonId}/${payload.blockId}`,
    body: { ...payload.quiz }
  })

export const addLessonQuiz = async (payload: AddLessonQuiz): Promise<any> =>
  http.post({
    url: `lessons/quiz/${payload.courseId}/${payload.lessonId}`,
    body: { ...payload.quiz }
  })