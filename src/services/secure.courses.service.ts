import http from './base'
import { AddBlock, AddBlockQuiz, AddLessonQuiz, Block, CourseSettings, CourseSettingsPayload, CreateCoursePayload, LearnerGroupLaunchTime, LearnerGroupPayload, PaginationPayload, Quiz, StudentDataForm } from '@/type-definitions/secure.courses'




export const createCourse = async (payload: CreateCoursePayload): Promise<any> =>
  http.post({
    url: `courses/`,
    body: { ...payload }
  })


export const duplicateCourse = async (payload: {
  title: string,
  description: string,
  headerMediaUrl: string
}, courseId: string): Promise<any> =>
  http.post({
    url: `courses/${courseId}`,
    body: { ...payload }
  })
export const createCourseAI = async (payload: { jobId: string }): Promise<any> =>
  http.post({
    url: `courses/ai`,
    body: { ...payload }
  })

export const generateCourseOutlineAI = async (payload: { title: string, lessonCount: number, jobId?: string }): Promise<any> =>
  http.post({
    url: `courses/ai/generate-outline`,
    body: { ...payload }
  })

export const generateCourseOutlineFile = async (payload: { title: string, files: string[], jobId?: string }): Promise<any> =>
  http.post({
    url: `courses/ai/generate-outline-from-file`,
    body: { ...payload }
  })

export const updateCourse = async (payload: Partial<CreateCoursePayload>, id: string): Promise<any> =>
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

export const searchCourses = async (payload: { search: string, filter?: string }): Promise<any> =>
  http.get({
    url: `courses/search`,
    query: payload
  })

export const findLibraryCourses = async (payload: { search: string, library: 0 | 1 }): Promise<any> =>
  http.get({
    url: `courses/public/all`,
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

export const rewriteBlockContent = async (payload: {
  lessonId: string
  courseId: string
  seedTitle: string
  seedContent: string
}): Promise<any> =>
  http.post({
    url: `ai/rewrite-section`,
    body: { ...payload }
  })

export const suggestBlockContent = async (payload: {
  lessonId: string
  courseId: string
  seedTitle: string
}): Promise<any> =>
  http.post({
    url: `ai/generate-section`,
    body: { ...payload }
  })


export const rewriteBlockQuiz = async (payload: {
  isFollowup: boolean
  content: string
}): Promise<any> =>
  http.post({
    url: `ai/rewrite-quiz`,
    body: { ...payload }
  })

export const suggestBlockQuiz = async (payload: {
  isFollowup: boolean
  content: string
}): Promise<any> =>
  http.post({
    url: `ai/generate-quiz`,
    body: { ...payload }
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

// settings


export const updateSettings = async (payload: { id: string, body: Partial<CourseSettingsPayload> }): Promise<any> =>
  http.put({
    url: `courses/settings/${payload.id}`,
    body: { ...payload.body }
  })

export const addLearnerGroup = async (payload: { id: string, body: LearnerGroupPayload }): Promise<any> =>
  http.post({
    url: `courses/settings/add-learner-group/${payload.id}`,
    body: { ...payload.body }
  })

export const setLauncTimes = async (payload: { id: string, groupId: string, body: LearnerGroupLaunchTime }): Promise<any> =>
  http.patch({
    url: `courses/settings/launchtimes/${payload.id}/${payload.groupId}`,
    body: { ...payload.body }
  })

export const removeLearnerGroup = async (payload: { id: string, groupId: string }): Promise<any> =>
  http.delete({
    url: `courses/settings/remove-learner-group/${payload.id}/${payload.groupId}`
  })

export const deleteCourse = async (courseId: string): Promise<any> => {
  return http.delete({
    url: `courses/${courseId}`
  })
}





//students 

export const bulkAddStudents = async (payload: { body: StudentDataForm[] }): Promise<any> =>
  http.post({
    url: `students/bulk-save`,
    body: { students: payload.body }
  })

export const testCourseSlack = async (payload: { slackId: string, course: string }): Promise<any> =>
  http.post({
    url: `students/test-course/slack`,
    body: payload
  })

export const testCourseWhatsapp = async (payload: { phoneNumber: string, course: string }): Promise<any> =>
  http.post({
    url: `students/test-course/whatsapp`,
    body: payload
  })

