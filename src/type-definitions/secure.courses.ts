export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image'
}
export interface Media {
  mediaType: MediaType
  url: string
}
export interface CreateCoursePayload {
  free: boolean
  bundle: boolean
  private: boolean
  headerMedia: Media
  title: string
  description: string
  price?: number
  audiences?: string
}

export interface CourseStatistics {
  enrolled: number
  active: number
  averageCompletionPercentage: number
  dropouts: number
  completed: number
  averageTestScore: number
  averageCompletionDays: number
  averageCompletionMinutes: number
  averageCourseDurationSeconds: number
  dropoutRate: number
  averageCourseProgress: number
  averageMcqRetakeRate: number
  averageLessonDurationMinutes: number
  averageBlockDurationMinutes: number
  averageBlockDurationSeconds: number
}

export interface PaginationPayload {
  page: number
  pageSize: number
  filter: string
}


export enum CourseStatus {
  DRAFT = "draft",
  COMPLETED = "completed",
  PUBLISHED = "published",
  DELETED = "deleted"
}

export interface Lesson {
  id: string
  title: string
  blocks: string[]
  quizzes: string[]
  course: string
  description?: string
}


export interface LessonData {
  id: string
  title: string
  blocks: Block[]
  quizzes: Quiz[]
  course: Course
  description?: string
}

export enum Sources {
  MANUAL = "manual",
  AI = "ai"
}

export interface Createlesson {
  courseId: string
  lesson: {
    title: string
    description?: string
  }
}

export interface UpdateLesson {
  lessonId: string
  courseId: string
  lesson: {
    title: string
    description?: string
  }
}




export interface Course {
  id: string
  title: string
  description: string
  owner: string
  lessons: Lesson[]
  courses: Course[]
  headerMedia: Media
  status: CourseStatus
  free: boolean
  settings: string
  bundle: boolean
  private: boolean
  source: Sources
  price?: number
  currentCohort?: string
  audiences?: string
}


// Blocks

export interface Block {
  quiz?: Quiz
  id: string
  course: string
  title: string
  content: string
  bodyMedia: Media
}
export interface AddBlock {
  courseId: string
  lessonId: string
  block: Omit<Block, "id" | "course">
}


// quiz

export interface Quiz {
  id: string
  question: string
  correctAnswerContext: string
  wrongAnswerContext: string
  choices: string[]
  correctAnswerIndex: number
  revisitChunk?: string
  hint?: string
}
export interface AddBlockQuiz {
  courseId: string
  lessonId: string
  blockId: string
  quiz: Omit<Quiz, "id">
}

export interface AddLessonQuiz {
  courseId: string
  lessonId: string
  quiz: Omit<Quiz, "id">
}