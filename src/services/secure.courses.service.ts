import http from './base'
import { AddBlock, AddBlockQuiz, AddLessonQuiz, Block, CreateCoursePayload, PaginationPayload, Quiz } from '@/type-definitions/secure.courses'




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


// lessons
export const fetchSingleLesson = async (course: string, lesson: string): Promise<any> =>
  http.get({
    url: `lessons/${course}/${lesson}`
  })

// Blocks


export const addLessonBlock = async (payload: AddBlock): Promise<any> =>
  http.post({
    url: `blocks/${payload.courseId}/${payload.lessonId}`,
    body: { ...payload.block }
  })

export const updateLessonBlock = async (payload: {
  blockId: string, update: Partial<Block>
}): Promise<any> =>
  http.put({
    url: `blocks/${payload.blockId}`,
    body: { ...payload.update }
  })

export const deleteLessonBlock = async (payload: {
  lessonId: string, blockId: string
}): Promise<any> => {
  return http.delete({
    url: `blocks/${payload.lessonId}/${payload.blockId}`
  })
}



export const deleteBlockQuiz = async (payload: {
  quizId: string, blockId: string
}): Promise<any> => {
  return http.delete({
    url: `blocks/quiz/${payload.blockId}/${payload.quizId}`
  })
}





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

export const updateQuiz = async (payload: { id: string, body: Partial<Quiz> }): Promise<any> =>
  http.put({
    url: `quiz/${payload.id}`,
    body: { ...payload.body }
  })


export const deleteLessonQuiz = async (payload: {
  quizId: string, lessonId: string
}): Promise<any> => {
  return http.delete({
    url: `lessons/quiz/${payload.lessonId}/${payload.quizId}`
  })
}