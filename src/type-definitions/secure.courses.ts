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