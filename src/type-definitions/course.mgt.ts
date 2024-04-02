export enum ContentTypeEnum {
  SECTION = "section",
  QUIZ = "quiz"
}
export interface CreateLessonContent {
  open: boolean
  lessonId: string
  courseId: string
  contentType: ContentTypeEnum
}
export interface CourseMgtStoreInterface {
  currentLesson?: string
  createContent?: CreateLessonContent

  setCurrentLesson: (lessonId: string) => void
  initiateCreateContent: (lessonId: string, courseId: string, contentType: ContentTypeEnum) => void
  closeCreateContent: () => void
}