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
  content?: string
}
export interface CourseMgtStoreInterface {
  currentLesson?: string
  createContent?: CreateLessonContent
  reloadLesson?: boolean

  setReloadLesson: (val: boolean) => void
  setCurrentLesson: (lessonId: string) => void
  initiateCreateContent: (lessonId: string, courseId: string, contentType: ContentTypeEnum, blockId?: string, content?: string) => void
  closeCreateContent: () => void
}

export enum OptionButtons {
  SUGGEST = 'aisuggest',
  IMPROVE = 'aiimprove',
  SUGGESTQUIZ = 'aisuggest-quiz',
  IMPROVEQUIZ = 'aiimprove-quiz'
}