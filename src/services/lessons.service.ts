import http from './base'
import { Createlesson, UpdateLesson } from '@/type-definitions/secure.courses'


export const createLesson = async (payload: Createlesson): Promise<any> =>
  http.post({
    url: `lessons/${payload.courseId}`,
    body: { ...payload.lesson }
  })

export const updateLesson = async (payload: UpdateLesson): Promise<any> =>
  http.put({
    url: `lessons/${payload.courseId}/${payload.lessonId}`,
    body: { ...payload.lesson }
  })

export const updateAssessment = async (payload: { courseId: string, assessmentId: string, assessment: { title?: string, message?: string, questions?: string[] } }): Promise<any> =>
  http.put({
    url: `quiz/question-groups/${payload.courseId}/${payload.assessmentId}`,
    body: { ...payload.assessment }
  })

export const deleteLesson = async (payload: Omit<UpdateLesson, 'lesson'>): Promise<any> =>
  http.delete({
    url: `lessons/${payload.courseId}/${payload.lessonId}`,
  })

export const fetchQUestionsByCourseId = async (payload: { courseId: string, assessment: string }): Promise<any> =>
  http.get({
    url: `quiz/questions-by-course-id/${payload.courseId}/${payload.assessment}`,
  })




