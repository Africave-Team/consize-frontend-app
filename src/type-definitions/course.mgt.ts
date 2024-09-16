import { QuestionGroupsInterface, Quiz } from './secure.courses'

export enum ContentTypeEnum {
  SECTION = "section",
  QUIZ = "quiz",
  BLOCK_QUIZ = "block-quiz",
  ASSESSMENT_QUIZ = "assessment-quiz",
  SELECT_ASSESSMENT_QUIZ = "select-assessment-quiz",
  DELETE_LESSON = "delete-lesson",
  DELETE_ASSESSMENT_QUIZ = "delete-assessment-quiz"
}
export interface CreateLessonContent {
  open: boolean
  lessonId: string
  courseId: string
  contentType: ContentTypeEnum
  blockId?: string
  content?: string
  assessment?: QuestionGroupsInterface
}
export interface CourseMgtStoreInterface {
  currentLesson?: string
  createContent?: CreateLessonContent
  reloadLesson?: boolean

  setReloadLesson: (val: boolean) => void
  setCurrentLesson: (lessonId: string) => void
  initiateCreateContent: (lessonId: string, courseId: string, contentType: ContentTypeEnum, blockId?: string, content?: string, assessment?: QuestionGroupsInterface) => void
  closeCreateContent: () => void
}

export enum OptionButtons {
  SUGGEST = 'aisuggest',
  IMPROVE = 'aiimprove',
  SUGGESTQUIZ = 'aisuggest-quiz',
  IMPROVEQUIZ = 'aiimprove-quiz'
}