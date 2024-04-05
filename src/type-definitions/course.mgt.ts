export enum ContentTypeEnum {
  SECTION = "section",
  QUIZ = "quiz",
  BLOCK_QUIZ = "block-quiz"
}
export interface CreateLessonContent {
  open: boolean
  lessonId: string
  courseId: string
  contentType: ContentTypeEnum
  blockId?: string
}
export interface CourseMgtStoreInterface {
  currentLesson?: string
  createContent?: CreateLessonContent
  reloadLesson?: boolean

  setReloadLesson: (val: boolean) => void
  setCurrentLesson: (lessonId: string) => void
  initiateCreateContent: (lessonId: string, courseId: string, contentType: ContentTypeEnum, blockId?: string) => void
  closeCreateContent: () => void
}