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

export const deleteLesson = async (payload: Omit<UpdateLesson, 'lesson'>): Promise<any> =>
  http.delete({
    url: `lessons/${payload.courseId}/${payload.lessonId}`,
  })


